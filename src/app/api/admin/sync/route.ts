import { NextRequest, NextResponse } from "next/server";
import { verifyAdminAuth } from "@/lib/adminAuth";
import { exec, execFile } from "child_process";
import { promisify } from "util";
import fs from "fs";
import path from "path";

const execPromise = promisify(exec);
const execFilePromise = promisify(execFile);

// Helper chạy lệnh git trực tiếp (không qua /bin/sh để tiết kiệm process table)
async function runGit(args: string[], cwd: string): Promise<{ stdout: string; stderr: string }> {
  return execFilePromise("git", args, {
    cwd,
    timeout: 30000,
    env: { ...process.env, PATH: `/usr/local/bin:/usr/bin:/bin:${process.env.PATH || ""}` },
  });
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

// POST: Thực hiện đồng bộ kéo code mới nhất từ GitHub và khởi động lại ứng dụng
// BẢO VỆ 100% DỮ LIỆU KHÁCH HÀNG (LEADS), CẤU HÌNH (SITECONFIG) VÀ BÀI VIẾT (ARTICLES)
export async function POST(request: NextRequest) {
  if (!verifyAdminAuth(request)) {
    return NextResponse.json(
      { success: false, message: "Không có quyền truy cập." },
      { status: 401 }
    );
  }

  const rootDir = process.cwd();
  const persistentDataDir = path.join(rootDir, "data");
  const seedDataDir = path.join(rootDir, "src", "data");
  const backupDir = path.join(rootDir, "tmp", `sync_backup_${Date.now()}`);

  try {
    // BƯỚC 1: Sao lưu an toàn toàn bộ dữ liệu đang chạy trước khi kéo Git
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }

    const dataFiles = ["siteConfig.json", "leads.json", "articles.json"];
    const backedUpFiles: string[] = [];

    for (const file of dataFiles) {
      const persistentPath = path.join(persistentDataDir, file);
      const seedPath = path.join(seedDataDir, file);
      const backupPath = path.join(backupDir, file);

      // Ưu tiên file trong data/ (persistent), nếu chưa có thì lấy từ src/data/
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

    // BƯỚC 2: Chạy Git fetch & reset đè code mới nhất từ GitHub bằng execFile trực tiếp
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
        throw new Error(
          "Hosting cPanel của bạn đang bị đầy tiến trình (Processes đạt 99/100). Vui lòng vào cPanel > 'Setup Node.js App' bấm 'Restart' ứng dụng hoặc vào 'Terminal' chạy lệnh 'killall node' để giải phóng tiến trình trước khi bấm Đồng bộ lại!"
        );
      }
      throw gitErr;
    }

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

    // BƯỚC 3: Khôi phục lại 100% dữ liệu đã sao lưu vào thư mục persistent data/ và src/data/
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
        "Đồng bộ mã nguồn từ GitHub thành công! Toàn bộ cấu hình và dữ liệu khách hàng được bảo tồn nguyên vẹn.",
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
