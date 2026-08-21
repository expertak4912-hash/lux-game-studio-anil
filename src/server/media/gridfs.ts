/**
 * File storage in MongoDB GridFS — replaces Supabase Storage.
 *
 * GridFS splits a file into chunks across `media.files` / `media.chunks`, so uploads live in the
 * same database as the rest of the content: one backup, one connection string, and identical
 * behaviour on every host (Vercel's filesystem is read-only, so writing to disk was not an option).
 *
 * The `media` collection keeps the human-facing metadata row that the admin library lists; the
 * GridFS document holds the bytes. `media.gridfs_id` links the two.
 *
 * SERVER ONLY.
 */
import { GridFSBucket, ObjectId } from "mongodb";
import { getDb } from "@/server/db/client";

const BUCKET_NAME = "media";

/** Images only, matching the admin uploader's `accept="image/*"`, plus SVG and PDF for logos/docs. */
const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
  "image/svg+xml",
  "application/pdf",
]);

const DEFAULT_MAX_BYTES = 10 * 1024 * 1024; // 10 MB

export function maxUploadBytes(): number {
  const raw = Number(process.env["MAX_UPLOAD_BYTES"]);
  return Number.isFinite(raw) && raw > 0 ? raw : DEFAULT_MAX_BYTES;
}

export function isAllowedType(contentType: string): boolean {
  return ALLOWED_TYPES.has(contentType.toLowerCase());
}

async function bucket(): Promise<GridFSBucket> {
  const db = await getDb();
  return new GridFSBucket(db, { bucketName: BUCKET_NAME });
}

export type StoredFile = {
  gridfsId: string;
  fileName: string;
  contentType: string;
  size: number;
};

/**
 * Writes bytes to GridFS.
 *
 * The whole file is already buffered by the time we get here (FormData decodes it in memory), so
 * a single `write`/`end` is enough; `maxUploadBytes` is what keeps that buffer bounded.
 */
export async function storeFile(
  data: Buffer,
  fileName: string,
  contentType: string,
): Promise<StoredFile> {
  const gfs = await bucket();

  return new Promise<StoredFile>((resolve, reject) => {
    const stream = gfs.openUploadStream(fileName, {
      contentType,
      metadata: { uploadedAt: new Date() },
    });

    stream.on("error", reject);
    stream.on("finish", () => {
      resolve({
        gridfsId: stream.id.toString(),
        fileName,
        contentType,
        size: data.byteLength,
      });
    });

    stream.end(data);
  });
}

export type FetchedFile = {
  stream: NodeJS.ReadableStream;
  contentType: string;
  size: number;
  fileName: string;
};

/** Opens a download stream, or returns null when the id is unknown or malformed. */
export async function fetchFile(id: string): Promise<FetchedFile | null> {
  if (!/^[0-9a-fA-F]{24}$/.test(id)) return null;

  const objectId = new ObjectId(id);
  const db = await getDb();

  const doc = await db.collection(`${BUCKET_NAME}.files`).findOne({ _id: objectId });
  if (!doc) return null;

  const gfs = await bucket();

  return {
    stream: gfs.openDownloadStream(objectId),
    contentType: String(doc["contentType"] ?? "application/octet-stream"),
    size: Number(doc["length"] ?? 0),
    fileName: String(doc["filename"] ?? "file"),
  };
}

/** Removes a stored file. Called when its `media` metadata row is deleted. */
export async function deleteFile(id: string): Promise<void> {
  if (!/^[0-9a-fA-F]{24}$/.test(id)) return;
  const gfs = await bucket();
  await gfs.delete(new ObjectId(id));
}
