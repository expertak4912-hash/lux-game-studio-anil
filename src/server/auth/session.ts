/**
 * Session tokens.
 *
 * Replaces Supabase Auth's bearer-token flow. The old setup kept the access token in
 * `localStorage` and attached it via a client middleware, which is readable by any injected
 * script. This uses a signed JWT in an httpOnly cookie instead: JavaScript cannot read it, and it
 * travels automatically on every request, so no client-side attacher is needed.
 *
 * CSRF is handled separately by `createCsrfMiddleware` in `src/start.ts` — with cookie auth that
 * middleware is load-bearing, not optional.
 *
 * SERVER ONLY.
 */
import { SignJWT, jwtVerify } from "jose";
import { deleteCookie, getCookie, setCookie } from "@tanstack/react-start/server";
import type { PublicUser, UserRole } from "@/shared/types";

export const SESSION_COOKIE = "session";
const ISSUER = "lux-game-studio";
const MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days

export type SessionClaims = {
  sub: string;
  email: string;
  role: UserRole;
};

let cachedKey: Uint8Array | undefined;

function secretKey(): Uint8Array {
  if (cachedKey) return cachedKey;

  const secret = process.env["AUTH_SECRET"];
  if (!secret || secret.length < 32) {
    const message =
      "AUTH_SECRET is missing or shorter than 32 characters. " +
      "Generate one with: node -e \"console.log(require('crypto').randomBytes(48).toString('base64url'))\"";
    console.error(`[auth] ${message}`);
    throw new Error(message);
  }

  cachedKey = new TextEncoder().encode(secret);
  return cachedKey;
}

export async function createSessionToken(user: PublicUser): Promise<string> {
  return new SignJWT({ email: user.email, role: user.role })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(user.id)
    .setIssuer(ISSUER)
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE_SECONDS}s`)
    .sign(secretKey());
}

/** Returns the claims for a valid, unexpired token, or null for anything else. */
export async function verifySessionToken(token: string): Promise<SessionClaims | null> {
  try {
    const { payload } = await jwtVerify(token, secretKey(), {
      issuer: ISSUER,
      algorithms: ["HS256"],
    });

    const sub = payload.sub;
    const email = payload["email"];
    const role = payload["role"];

    if (typeof sub !== "string" || typeof email !== "string") return null;
    if (role !== "admin" && role !== "editor") return null;

    return { sub, email, role };
  } catch {
    return null;
  }
}

export async function startSession(user: PublicUser): Promise<void> {
  const token = await createSessionToken(user);
  setCookie(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env["NODE_ENV"] === "production",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  });
}

export function endSession(): void {
  deleteCookie(SESSION_COOKIE, { path: "/" });
}

/** Reads and verifies the session on the current request. Null when signed out. */
export async function readSession(): Promise<SessionClaims | null> {
  const token = getCookie(SESSION_COOKIE);
  if (!token) return null;
  return verifySessionToken(token);
}

/**
 * Same as `readSession`, but for the raw `/api/*` handlers in `src/server.ts`, which run outside
 * the TanStack request context and so cannot use `getCookie`.
 */
export async function readSessionFromRequest(request: Request): Promise<SessionClaims | null> {
  const header = request.headers.get("cookie");
  if (!header) return null;

  for (const part of header.split(";")) {
    const [name, ...rest] = part.trim().split("=");
    if (name === SESSION_COOKIE) {
      const value = rest.join("=");
      if (!value) return null;
      return verifySessionToken(decodeURIComponent(value));
    }
  }

  return null;
}
