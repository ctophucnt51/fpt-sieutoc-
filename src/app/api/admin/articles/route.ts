import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import { getAllArticles, upsertArticle, deleteArticle } from "@/lib/articleStorage";

export async function GET(req: NextRequest) {
  if (!isAdminAuthenticated(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const articles = getAllArticles(true); // include drafts
  return NextResponse.json({ articles });
}

export async function POST(req: NextRequest) {
  if (!isAdminAuthenticated(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const result = upsertArticle(body);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ success: true, article: result.article });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Lỗi xử lý yêu cầu." }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  if (!isAdminAuthenticated(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Thiếu ID bài viết." }, { status: 400 });
  }

  const success = deleteArticle(id);
  if (!success) {
    return NextResponse.json({ error: "Không tìm thấy bài viết để xóa." }, { status: 404 });
  }

  return NextResponse.json({ success: true, message: "Đã xóa bài viết thành công." });
}
