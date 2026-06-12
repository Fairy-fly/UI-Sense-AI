/**
 * Image Upload API
 *
 * POST /api/upload
 * Accepts multipart/form-data with a "file" field.
 * Saves to public/uploads/YYYY-MM-DD/timestamp-random.ext
 */

import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

export async function GET() {
  return NextResponse.json(
    { success: false, error: "Method Not Allowed" },
    { status: 405 },
  );
}

const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/webp"];
const MAX_SIZE = 10 * 1024 * 1024; // 10MB

const MIME_TO_EXT: Record<string, string> = {
  "image/png": ".png",
  "image/jpeg": ".jpg",
  "image/webp": ".webp",
};

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ success: false, error: "未找到上传文件" }, { status: 400 });
    }

    // Validate type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: "仅支持 PNG、JPG、WebP 格式" },
        { status: 415 },
      );
    }

    // Validate size
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { success: false, error: "文件大小不能超过 10MB" },
        { status: 413 },
      );
    }

    // Build safe filename
    const ext = MIME_TO_EXT[file.type] ?? ".png";
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    const filename = `${timestamp}-${random}${ext}`;

    // Create date-based directory
    const now = new Date();
    const dateDir = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
    const uploadDir = path.join(process.cwd(), "public", "uploads", dateDir);

    await fs.mkdir(uploadDir, { recursive: true });

    // Write file
    const buffer = Buffer.from(await file.arrayBuffer());
    const filePath = path.join(uploadDir, filename);
    await fs.writeFile(filePath, buffer);

    const imageUrl = `/uploads/${dateDir}/${filename}`;

    return NextResponse.json({ success: true, imageUrl });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ success: false, error: "服务器错误，请重试" }, { status: 500 });
  }
}
