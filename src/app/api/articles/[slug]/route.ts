import { NextRequest, NextResponse } from "next/server";
import { getArticleBySlug } from "@/lib/articleStorage";

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  const { slug } = params;
  if (!slug) {
    return NextResponse.json({ error: "Slug không hợp lệ." }, { status: 400 });
  }

  const article = getArticleBySlug(slug, true); // increment view count
  if (!article || !article.published) {
    return NextResponse.json({ error: "Không tìm thấy bài viết." }, { status: 404 });
  }

  return NextResponse.json({ article });
}
