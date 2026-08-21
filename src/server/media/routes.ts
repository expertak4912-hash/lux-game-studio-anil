/**
 * Raw HTTP handlers for `/api/media/*`.
 *
 * These cannot be server functions: TanStack Start serializes server-function results as JSON, so
 * neither a multipart upload body nor a streamed image response fits through that channel. This
 * version of Start (1.168) has no server-file-route API either, so the handlers are dispatched
 * from `src/server.ts`, which is already the SSR fetch entry and sees every request first.
 *
 * That placement is deliberately preset-agnostic — it behaves identically under `node-server`
 * and `vercel`, with no platform-specific request/response shims.
 *
 * SERVER ONLY.
 */
import { Readable } from "node:stream";
import { readSessionFromRequest } from "@/server/auth/session";
import { fetchFile, isAllowedType, maxUploadBytes, storeFile } from "./gridfs";

const json = (body: unknown, status: number) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });

/**
 * Dispatches `/api/media/*`. Returns null for anything else so the caller falls through to the
 * normal SSR handler.
 */
export async function handleMediaRequest(request: Request): Promise<Response | null> {
  const path = new URL(request.url).pathname;

  if (!path.startsWith("/api/media")) return null;

  if (path === "/api/media/upload") {
    if (request.method !== "POST") return json({ error: "Method not allowed" }, 405);
    return handleUpload(request);
  }

  const match = /^\/api\/media\/([0-9a-fA-F]{24})$/.exec(path);
  if (match) {
    if (request.method !== "GET" && request.method !== "HEAD") {
      return json({ error: "Method not allowed" }, 405);
    }
    return handleDownload(match[1]!, request.method === "HEAD");
  }

  return json({ error: "Not found" }, 404);
}

async function handleUpload(request: Request): Promise<Response> {
  // Same authorization rule the "admins manage media" RLS policy enforced.
  const session = await readSessionFromRequest(request);
  if (!session) return json({ error: "Unauthorized: please sign in." }, 401);
  if (session.role !== "admin") {
    return json({ error: "Forbidden: administrator access required." }, 403);
  }

  // Reject an oversized body before reading it, when the client declares its length.
  const limit = maxUploadBytes();
  const declared = Number(request.headers.get("content-length") ?? 0);
  if (declared > 0 && declared > limit) {
    return json({ error: `File is too large. Maximum is ${formatBytes(limit)}.` }, 413);
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return json({ error: "Expected a multipart form upload." }, 400);
  }

  const file = form.get("file");
  if (!(file instanceof File)) return json({ error: "No file was provided." }, 400);
  if (file.size === 0) return json({ error: "The file is empty." }, 400);
  if (file.size > limit) {
    return json({ error: `File is too large. Maximum is ${formatBytes(limit)}.` }, 413);
  }

  const contentType = file.type || "application/octet-stream";
  if (!isAllowedType(contentType)) {
    return json({ error: `Unsupported file type: ${contentType}` }, 415);
  }

  const rawCategory = form.get("category");
  const category = typeof rawCategory === "string" ? sanitizeCategory(rawCategory) : "other";

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const stored = await storeFile(buffer, safeFileName(file.name), contentType);
    const publicUrl = `/api/media/${stored.gridfsId}`;

    // Record the metadata row that Admin -> Media Library lists.
    const { collectionFor } = await import("@/server/db/collections");
    const collection = await collectionFor("media");
    const now = new Date();
    await collection.insertOne({
      file_name: stored.fileName,
      url: publicUrl,
      category,
      alt_text: null,
      size_bytes: stored.size,
      content_type: stored.contentType,
      gridfs_id: stored.gridfsId,
      created_at: now,
      updated_at: now,
    } as never);

    return json({ url: publicUrl, id: stored.gridfsId }, 201);
  } catch (error) {
    console.error("[media] upload failed", error);
    return json({ error: "Upload failed. Please try again." }, 500);
  }
}

async function handleDownload(id: string, headOnly: boolean): Promise<Response> {
  try {
    const file = await fetchFile(id);
    if (!file) return json({ error: "Not found" }, 404);

    const headers = new Headers({
      "content-type": file.contentType,
      "content-length": String(file.size),
      // Content is immutable: a new upload always gets a new id, so it can be cached forever.
      "cache-control": "public, max-age=31536000, immutable",
      "x-content-type-options": "nosniff",
      // SVGs can carry script, and these are served from the app origin. The sandbox directive
      // stops an uploaded SVG from executing as same-origin script.
      "content-security-policy": "default-src 'none'; style-src 'unsafe-inline'; sandbox",
    });

    if (headOnly) return new Response(null, { status: 200, headers });

    // GridFS hands back a Node Readable; Response wants a web ReadableStream.
    const body = Readable.toWeb(file.stream as Readable) as ReadableStream;
    return new Response(body, { status: 200, headers });
  } catch (error) {
    console.error("[media] download failed", error);
    return json({ error: "Could not read the file." }, 500);
  }
}

/** Reserved and path characters that must not survive into a stored filename. */
const UNSAFE_FILENAME_CHARS = /["*/:<>?\\|]/g;

/** Strips any path component so a crafted filename cannot escape into the metadata row. */
function safeFileName(name: string): string {
  const base = name.split(/[\\/]/).pop() ?? "file";
  const cleaned = base
    .replace(UNSAFE_FILENAME_CHARS, "")
    // Drop C0 control characters without embedding literal control bytes in this source file.
    .split("")
    .filter((char) => char.charCodeAt(0) > 31)
    .join("")
    .trim();

  return cleaned.slice(0, 200) || "file";
}

function sanitizeCategory(value: string): string {
  const cleaned = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, "");
  return cleaned.slice(0, 40) || "other";
}

function formatBytes(bytes: number): string {
  return `${Math.round(bytes / (1024 * 1024))} MB`;
}
