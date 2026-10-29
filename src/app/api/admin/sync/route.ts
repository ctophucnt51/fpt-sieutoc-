import { NextRequest, NextResponse } from "next/server";
import { verifyAdminAuth } from "@/lib/adminAuth";
import { exec } from "child_process";
import { promisify } from "util";

const execPromise = promisify(exec);

// GET: Lấy thông tin phiên bản commit hiện tại
export async function GET(request: NextRequest) {
  if (!verifyAdminAuth(request)) {
    return NextResponse.json(
      { success: false, message: "Không có quyền truy cập." },
      { status: 401 }
    );
  }

  try {
    const { stdout: commitInfo } = await execPromise(
      'git log -1 --pretty=format:"%h - %s (%cd)" --date=relative'
    );
    const { stdout: branch } = await execPromise("git rev-parse --abbrev-ref HEAD");

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
export async function POST(request: NextRequest) {
  if (!verifyAdminAuth(request)) {
    return NextResponse.json(
      { success: false, message: "Không có quyền truy cập." },
      { status: 401 }
    );
  }

  try {
    // 1. Chạy git fetch và git reset để đồng bộ đè bản mới nhất từ GitHub
    // 2. Chạm vào file tmp/restart.txt để cPanel / Phusion Passenger tự động reload ứng dụng
    const command = [
      "git fetch origin main",
      "git reset --hard origin/main",
      "mkdir -p tmp && touch tmp/restart.txt",
    ].join(" && ");

    const { stdout, stderr } = await execPromise(command, {
      timeout: 30000,
      env: { ...process.env, PATH: `/usr/local/bin:/usr/bin:/bin:${process.env.PATH || ""}` },
    });

    // Lấy thông tin commit sau khi cập nhật
    let latestCommit = "";
    try {
      const { stdout: commitOut } = await execPromise(
        'git log -1 --pretty=format:"%h - %s (%cd)" --date=relative'
      );
      latestCommit = commitOut.trim();
    } catch {
      latestCommit = "Đã cập nhật thành công";
    }

    return NextResponse.json({
      success: true,
      message: "Đồng bộ mã nguồn từ GitHub thành công! Trang web đã được cập nhật phiên bản mới nhất.",
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
