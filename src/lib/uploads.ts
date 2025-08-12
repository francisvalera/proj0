import { put } from "@vercel/blob";

export type UploadedFile = { url: string };

export async function uploadImage(file: File): Promise<UploadedFile> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    throw new Error("Missing BLOB_READ_WRITE_TOKEN");
  }
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const res = await put(`products/${crypto.randomUUID()}-${file.name}`, buffer, {
    access: "public",
    token: process.env.BLOB_READ_WRITE_TOKEN,
    contentType: file.type || "application/octet-stream",
  });
  return { url: res.url };
}
