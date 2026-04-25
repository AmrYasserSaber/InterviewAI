import { NextRequest, NextResponse } from "next/server";
import { CV_MAX_LENGTH } from "@/utils/constants";

export const runtime = "nodejs";

const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;
const ACCEPTED_MIME_TYPES = new Set([
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

function isDocxFilename(name: string): boolean {
  return name.toLowerCase().endsWith(".docx");
}

export async function POST(req: NextRequest) {
  const formData = await req.formData().catch(() => null);
  if (!formData) {
    return NextResponse.json({ error: "Invalid form payload" }, { status: 400 });
  }

  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "CV file is required" }, { status: 400 });
  }

  const isPdf = file.type === "application/pdf";
  const isDocx = ACCEPTED_MIME_TYPES.has(file.type) || isDocxFilename(file.name);
  if (!isPdf && !isDocx) {
    return NextResponse.json({ error: "Only PDF and DOCX are supported" }, { status: 400 });
  }

  if (file.size > MAX_UPLOAD_BYTES) {
    return NextResponse.json({ error: "File is too large (max 5MB)" }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  try {
    let extracted = "";

    if (isPdf) {
      // Import parser implementation directly to avoid the package's debug-mode
      // entrypoint that tries to read bundled test files in ESM environments.
      // @ts-expect-error pdf-parse subpath has no published typings
      const pdfParseModule = await import("pdf-parse/lib/pdf-parse.js");
      const pdfParse = pdfParseModule.default as (dataBuffer: Buffer) => Promise<{ text?: string }>;
      const result = await pdfParse(buffer);
      extracted = result.text ?? "";
    } else {
      const mammoth = await import("mammoth");
      const result = await mammoth.extractRawText({ buffer });
      extracted = result.value ?? "";
    }

    const text = extracted.trim().slice(0, CV_MAX_LENGTH);
    if (text.length < 50) {
      return NextResponse.json({ error: "Could not extract enough text from file" }, { status: 400 });
    }

    return NextResponse.json({ text });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown parsing error";
    console.error("CV parse failed", { fileName: file.name, fileType: file.type, message });
    return NextResponse.json({ error: "Failed to parse CV file" }, { status: 500 });
  }
}
