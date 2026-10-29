import { NextRequest, NextResponse } from "next/server";
import { getAllArticles } from "@/lib/articleStorage";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const limit = parseInt(searchParams.get("limit") || "20", 10);

  let articles = getAllArticles(false); // published only

  if (category && category !== "all") {
    articles = articles.filter((a) => a.category === category);
  }

  return NextResponse.json({
    articles: articles.slice(0, limit),
    total: articles.length,
  });
}
