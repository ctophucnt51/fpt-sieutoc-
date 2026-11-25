import { NextRequest, NextResponse } from "next/server";
import { verifyAdminAuth } from "@/lib/adminAuth";
import { exec, execFile } from "child_process";
import { promisify } from "util";
import fs from "fs";
import path from "path";

const execPromise = promisify(exec);
const execFilePromise = promisify(execFile);

// Helper chạy lệnh git tối ưu: tắt tự động gc nền, giới hạn 1 thread để không làm phình process table
async function runGit(args: string[], cwd: string): Promise<{ stdout: string; stderr: string }> {
  const optimizedArgs = [
    "-c", "gc.auto=0",
    "-c", "pack.threads=1",
    "-c", "core.preloadindex=false",
    ...args,
  ];

  return execFilePromise("git", optimizedArgs, {
    cwd,
    timeout: 35000,
    env: {
      ...process.env,
      GIT_TERMINAL_PROMPT: "0",
      PATH: `/usr/local/bin:/usr/bin:/bin:${process.env.PATH || ""}`,
    },
  });
}

// Hàm dọn dẹp các tiến trình git treo hoặc tiến trình con mồ côi để giải phóng Process trên cPanel
async function cleanupStaleProcesses(): Promise<{ killedCount: number; message: string }> {
  let killed = 0;
  const currentPid = process.pid;

  // 1. Quét và diệt các tiến trình git hoặc git-remote bị treo từ các lần trước
  const staleGitPatterns = [
    "git fetch",
    "git-remote",
    "git index-pack",
    "git unpack-objects",
    "git gc",
    "git prune",
  ];
  for (const pattern of staleGitPatterns) {
    try {
      await execPromise(`pkill -9 -f "${pattern}" 2>/dev/null || true`);
    } catch {}
  }

  // 2. Thu gom rác bộ nhớ Node.js nếu V8 expose gc
  if (typeof (global as any).gc === "function") {
    try {
      (global as any).gc();
    } catch {}
  }

  // 3. Quét các tiến trình mồ côi (orphan / defunct / zombie) thuộc quyền người dùng
  try {
    const { stdout } = await execPromise("ps -eo pid,ppid,stat,comm 2>/dev/null || true");
    const lines = stdout.trim().split("\n");
    for (const line of lines) {
      const parts = line.trim().split(/\s+/);
      if (parts.length >= 4) {
        const pid = parseInt(parts[0], 10);
        const ppid = parseInt(parts[1], 10);
        const stat = parts[2];
        const comm = parts[3];

        // Nếu tiến trình là Zombie (Z) hoặc tiến trình git/sh mồ côi (ppid === 1) không phải process hiện tại
        if (pid && pid !== currentPid && pid !== process.ppid) {
          if (stat.includes("Z") || (ppid === 1 && (comm.includes("git") || comm.includes("sh")))) {
            try {
              process.kill(pid, "SIGKILL");
              killed++;
            } catch {}
          }
        }
      }
    }
  } catch {}

  return {
    killedCount: killed,
    message: "Đã dọn dẹp tiến trình treo thành công.",
  };
}

// GET: Lấy thông tin phiên bản commit hiện tại
export async function GET(request: NextRequest) {
  if (!verifyAdminAuth(request)) {
    return NextResponse.json(
      { success: false, message: "Không có quyền truy cập." },
      { status: 401 }
    );
  }

  const rootDir = process.cwd();

  try {
    const { stdout: commitInfo } = await runGit(
      ["log", "-1", '--pretty=format:%h - %s (%cd)', "--date=relative"],
      rootDir
    );
    const { stdout: branch } = await runGit(["rev-parse", "--abbrev-ref", "HEAD"], rootDir);

    return NextResponse.json({
      success: true,
      commit: commitInfo.trim(),
      branch: branch.trim(),
    });
  } catch (error: any) {
    return NextResponse.json({
      success: true,
      commit: "Không thể lấy thông tin git (môi trường sản xuất)",
      branch: "main",
      error: error?.message,
    });
  }
}

// POST: Thực hiện đồng bộ kéo code mới nhất từ GitHub VÀ tự động giải phóng tiến trình
export async function POST(request: NextRequest) {
  if (!verifyAdminAuth(request)) {
    return NextResponse.json(
      { success: false, message: "Không có quyền truy cập." },
      { status: 401 }
    );
  }

  // Kiểm tra nếu là yêu cầu dọn dẹp tiến trình độc lập (Manual Cleanup)
  try {
    const body = await request.json().catch(() => ({}));
    if (body?.action === "cleanup") {
      const cleanResult = await cleanupStaleProcesses();
      return NextResponse.json({
        success: true,
        message: "Đã quét và giải phóng thành công các tiến trình treo trên hosting cPanel!",
        data: cleanResult,
      });
    }
  } catch {}

  const rootDir = process.cwd();
  const persistentDataDir = path.join(rootDir, "data");
  const seedDataDir = path.join(rootDir, "src", "data");
  const backupDir = path.join(rootDir, "tmp", `sync_backup_${Date.now()}`);

  try {
    // BƯỚC 1: Dọn dẹp tiến trình treo & rác trước khi bắt đầu để hạ mức Processes
    await cleanupStaleProcesses();

    // BƯỚC 2: Sao lưu an toàn toàn bộ dữ liệu đang chạy trước khi kéo Git
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }

    const dataFiles = ["siteConfig.json", "leads.json", "articles.json"];
    const backedUpFiles: string[] = [];

    for (const file of dataFiles) {
      const persistentPath = path.join(persistentDataDir, file);
      const seedPath = path.join(seedDataDir, file);
      const backupPath = path.join(backupDir, file);

      const sourcePath = fs.existsSync(persistentPath)
        ? persistentPath
        : fs.existsSync(seedPath)
        ? seedPath
        : null;

      if (sourcePath) {
        try {
          fs.copyFileSync(sourcePath, backupPath);
          backedUpFiles.push(file);
        } catch (e) {
          console.error(`Không thể sao lưu ${file}:`, e);
        }
      }
    }

    // BƯỚC 3: Chạy Git fetch & reset đè code mới nhất từ GitHub
    let stdout = "";
    let stderr = "";
    try {
      const fetchRes = await runGit(["fetch", "origin", "main"], rootDir);
      stdout += fetchRes.stdout + "\n";
      stderr += fetchRes.stderr + "\n";

      const resetRes = await runGit(["reset", "--hard", "origin/main"], rootDir);
      stdout += resetRes.stdout;
      stderr += resetRes.stderr;
    } catch (gitErr: any) {
      // Nếu lỗi do hosting cPanel bị kịch trần 100 tiến trình (EAGAIN / fork retry)
      const isProcessLimit =
        gitErr?.message?.includes("Resource temporarily unavailable") ||
        gitErr?.message?.includes("fork: retry") ||
        gitErr?.message?.includes("EAGAIN");

      if (isProcessLimit) {
        // Cố gắng giải phóng cưỡng chế một lần nữa
        await cleanupStaleProcesses();
        throw new Error(
          "Hosting cPanel của bạn đang bị đầy tiến trình (Processes đạt 99/100). Hệ thống đã tự động dọn dẹp các tiến trình treo. Vui lòng thử bấm Đồng Bộ lại hoặc bấm 'Giải Phóng Processes' trên thanh công cụ!"
        );
      }
      throw gitErr;
    }

    // BƯỚC 4: Giải phóng tiến trình phụ ngay sau khi Git hoàn thành
    await cleanupStaleProcesses();

    // Tạo file restart.txt bằng fs nội bộ của Node.js (không fork thêm tiến trình shell)
    try {
      const tmpDir = path.join(rootDir, "tmp");
      if (!fs.existsSync(tmpDir)) {
        fs.mkdirSync(tmpDir, { recursive: true });
      }
      fs.writeFileSync(path.join(tmpDir, "restart.txt"), Date.now().toString());
    } catch (touchErr) {
      console.error("Không thể ghi file restart.txt:", touchErr);
    }

    // BƯỚC 5: Khôi phục lại 100% dữ liệu đã sao lưu vào thư mục persistent data/ và src/data/
    if (!fs.existsSync(persistentDataDir)) {
      fs.mkdirSync(persistentDataDir, { recursive: true });
    }

    for (const file of backedUpFiles) {
      const backupPath = path.join(backupDir, file);
      const persistentPath = path.join(persistentDataDir, file);
      const seedPath = path.join(seedDataDir, file);

      if (fs.existsSync(backupPath)) {
        try {
          fs.copyFileSync(backupPath, persistentPath);
          if (fs.existsSync(seedDataDir)) {
            fs.copyFileSync(backupPath, seedPath);
          }
          // Luôn đồng bộ email hỗ trợ cố định theo cấu hình người dùng
          if (file === "siteConfig.json") {
            try {
              const raw = fs.readFileSync(persistentPath, "utf8");
              const parsed = JSON.parse(raw);
              if (parsed.contact) {
                parsed.contact.supportEmail = "PhucNT51@fpt.com";
                fs.writeFileSync(persistentPath, JSON.stringify(parsed, null, 2), "utf8");
                if (fs.existsSync(seedPath)) {
                  fs.writeFileSync(seedPath, JSON.stringify(parsed, null, 2), "utf8");
                }
              }
            } catch {}
          }
        } catch (restoreErr) {
          console.error(`Lỗi khi khôi phục dữ liệu ${file}:`, restoreErr);
        }
      }
    }

    // Dọn dẹp thư mục tạm
    try {
      fs.rmSync(backupDir, { recursive: true, force: true });
    } catch {}

    // Lấy thông tin commit sau khi cập nhật
    let latestCommit = "";
    try {
      const { stdout: commitOut } = await runGit(
        ["log", "-1", '--pretty=format:%h - %s (%cd)', "--date=relative"],
        rootDir
      );
      latestCommit = commitOut.trim();
    } catch {
      latestCommit = "Đã cập nhật thành công";
    }

    return NextResponse.json({
      success: true,
      message:
        "Đồng bộ mã nguồn từ GitHub thành công! Đã tự động dọn dẹp & giải phóng bảng tiến trình trên máy chủ.",
      commit: latestCommit,
      output: stdout || stderr,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: `Lỗi trong quá trình đồng bộ: ${error?.message || "Không xác định"}`,
      },
      { status: 500 }
    );
  }
}
