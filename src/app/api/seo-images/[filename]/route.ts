import fs from "fs";
import path from "path";
import { NextRequest, NextResponse } from "next/server";

const SEO_IMAGES_DIR = path.join(process.cwd(), "data", "seo-images");

export async function GET(
  _request: NextRequest,
  { params }: { params: { filename: string } }
) {
  const rawName = params.filename || "";
  if (!/^[a-zA-Z0-9._-]+$/.test(rawName)) {
    return NextResponse.json({ error: "Invalid filename" }, { status: 400 });
  }

  const filePath = path.join(SEO_IMAGES_DIR, rawName);
  if (!fs.existsSync(filePath)) {
    return NextResponse.json({ error: "Image not found" }, { status: 404 });
  }

  const buffer = fs.readFileSync(filePath);
  const ext = path.extname(rawName).toLowerCase();
  const contentType =
    ext === ".jpg" || ext === ".jpeg"
      ? "image/jpeg"
      : ext === ".webp"
      ? "image/webp"
      : "image/png";

  return new NextResponse(buffer, {
    status: 200,
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
