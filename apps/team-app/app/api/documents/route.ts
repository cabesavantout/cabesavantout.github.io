import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextRequest, NextResponse } from "next/server";

const PROJECT_ROOT = path.join(process.cwd(), "..", "..");
const DATA_ROOT = path.join(PROJECT_ROOT, "data");

function contentTypeFor(filePath: string) {
  const extension = path.extname(filePath).toLowerCase();

  switch (extension) {
    case ".pdf":
      return "application/pdf";
    case ".txt":
      return "text/plain; charset=utf-8";
    case ".csv":
      return "text/csv; charset=utf-8";
    case ".json":
      return "application/json; charset=utf-8";
    default:
      return "application/octet-stream";
  }
}

export async function GET(request: NextRequest) {
  const relativePath = request.nextUrl.searchParams.get("path");

  if (!relativePath) {
    return NextResponse.json({ error: "Missing path parameter." }, { status: 400 });
  }

  const normalizedPath = path.normalize(relativePath).replace(/^(\.\.(\/|\\|$))+/, "");
  const absolutePath = path.join(PROJECT_ROOT, normalizedPath);

  if (!absolutePath.startsWith(DATA_ROOT)) {
    return NextResponse.json({ error: "Document path is not allowed." }, { status: 403 });
  }

  try {
    const buffer = await readFile(absolutePath);

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": contentTypeFor(absolutePath),
        "Content-Disposition": `inline; filename="${path.basename(absolutePath)}"`,
      },
    });
  } catch {
    return NextResponse.json({ error: "Document not found." }, { status: 404 });
  }
}
