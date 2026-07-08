import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import {
  badRequest,
  unauthorized,
  serverError,
  created,
} from "@/lib/api-response";
import { createAuditLog, getRequestMeta } from "@/lib/audit";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import crypto from "crypto";

const MAX_LOGO_SIZE = 2 * 1024 * 1024; // 2MB
const MAX_DOC_SIZE = 10 * 1024 * 1024; // 10MB

const ALLOWED_LOGO_TYPES = ["image/jpeg", "image/png", "image/webp"];
const ALLOWED_DOC_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

/**
 * POST /api/upload
 * Secure file upload with strict validation:
 * - Logos/Images: Max 2MB, formats: JPEG, PNG, WebP
 * - Documents: Max 10MB, formats: PDF, DOC, DOCX
 */
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) return unauthorized();

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const uploadType = formData.get("type") as string | null; // "LOGO" or "DOCUMENT"

    if (!file) {
      return badRequest("No file uploaded");
    }

    if (!uploadType || (uploadType !== "LOGO" && uploadType !== "DOCUMENT")) {
      return badRequest("Invalid upload type. Must be 'LOGO' or 'DOCUMENT'");
    }

    // Validate size and mime type
    const size = file.size;
    const mimeType = file.type;

    if (uploadType === "LOGO") {
      if (size > MAX_LOGO_SIZE) {
        return badRequest("Logo file size exceeds the 2MB limit");
      }
      if (!ALLOWED_LOGO_TYPES.includes(mimeType)) {
        return badRequest("Invalid logo format. Allowed: JPEG, PNG, WebP");
      }
    } else {
      if (size > MAX_DOC_SIZE) {
        return badRequest("Document file size exceeds the 10MB limit");
      }
      if (!ALLOWED_DOC_TYPES.includes(mimeType)) {
        return badRequest("Invalid document format. Allowed: PDF, DOC, DOCX");
      }
    }

    // Retrieve file bytes
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate secure, unique filename to prevent overwrites or directory traversal
    const fileExt = mimeType === "application/pdf"
      ? "pdf"
      : mimeType === "application/msword"
      ? "doc"
      : mimeType === "image/png"
      ? "png"
      : mimeType === "image/webp"
      ? "webp"
      : "docx"; // default fallback for ALLOWED_DOC_TYPES

    const secureName = `${crypto.randomUUID()}.${fileExt}`;

    // Define local upload directory (falls back to local filesystem storage for dev/test)
    const uploadDir = join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });

    const filePath = join(uploadDir, secureName);
    await writeFile(filePath, buffer);

    const relativeUrl = `/uploads/${secureName}`;

    // Log the file upload in audit log
    const { ipAddress, userAgent } = getRequestMeta(req);
    await createAuditLog({
      userId: session.user.id,
      action: "ADMIN_ACTION",
      entityType: "File",
      entityId: secureName,
      newValue: {
        fileName: file.name,
        type: uploadType,
        size,
        mimeType,
        url: relativeUrl,
      },
      ipAddress,
      userAgent,
    });

    return created({
      url: relativeUrl,
      fileName: file.name,
      secureName,
      size,
      mimeType,
    });
  } catch (err) {
    console.error("[POST /api/upload]", err);
    return serverError();
  }
}
