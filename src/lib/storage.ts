import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import crypto from "crypto";

export interface UploadResult {
  url: string;
  secureName: string;
}

export interface StorageProvider {
  uploadFile(
    buffer: Buffer,
    originalName: string,
    mimeType: string,
    uploadType: "LOGO" | "DOCUMENT"
  ): Promise<UploadResult>;
}

export class LocalStorageProvider implements StorageProvider {
  async uploadFile(
    buffer: Buffer,
    originalName: string,
    mimeType: string,
    uploadType: "LOGO" | "DOCUMENT"
  ): Promise<UploadResult> {
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
    const uploadDir = join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });

    const filePath = join(uploadDir, secureName);
    await writeFile(filePath, buffer);

    return {
      url: `/uploads/${secureName}`,
      secureName,
    };
  }
}

// Current active storage provider configuration
export const storageProvider: StorageProvider = new LocalStorageProvider();
