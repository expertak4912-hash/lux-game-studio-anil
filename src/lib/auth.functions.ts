/**
 * Authentication server functions.
 *
 * Replaces `supabase.auth.signUp` / `signInWithPassword` / `getUser` / `signOut`, which used to be
 * called directly from the browser. Everything now runs server-side; the browser only ever sees
 * the resulting httpOnly cookie.
 *
 * This module is imported by route files, so it ships to the client bundle — every server-only
 * import below is deliberately dynamic and lives inside a handler.
 */
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import type { PublicUser } from "@/shared/types";

const credentials = z.object({
  email: z.string().trim().email("Please enter a valid email address.").max(255),
  password: z.string().min(8, "Password must be at least 8 characters.").max(200),
});

/** Deliberately identical for "no such user" and "wrong password" so neither can be probed. */
const BAD_CREDENTIALS = "Incorrect email or password.";

/** True when at least one admin exists. Gates the first-run setup form. */
export const adminExists = createServerFn({ method: "GET" }).handler(async () => {
  const { countAdmins } = await import("@/server/auth/users");
  return { exists: (await countAdmins()) > 0 };
});

/** The signed-in user, or null. Used by the `/admin` route guard. */
export const me = createServerFn({ method: "GET" }).handler(
  async (): Promise<PublicUser | null> => {
    const { readSession } = await import("@/server/auth/session");
    const claims = await readSession();
    if (!claims) return null;
    return { id: claims.sub, email: claims.email, role: claims.role };
  },
);

export const login = createServerFn({ method: "POST" })
  .validator((data: unknown) => credentials.parse(data))
  .handler(async ({ data }): Promise<PublicUser> => {
    const { checkRateLimit } = await import("@/server/rate-limit");
    const { findUserByEmail, recordLogin, toPublicUser } = await import("@/server/auth/users");
    const { verifyPassword } = await import("@/server/auth/password");
    const { startSession } = await import("@/server/auth/session");

    // 10 attempts per 15 minutes per IP.
    checkRateLimit({ key: "login", limit: 10, windowMs: 15 * 60 * 1000 });

    const doc = await findUserByEmail(data.email);
    if (!doc) throw new Error(BAD_CREDENTIALS);

    const ok = await verifyPassword(data.password, String(doc["password_hash"] ?? ""));
    if (!ok) throw new Error(BAD_CREDENTIALS);

    const user = toPublicUser(doc as never);
    if (!user) throw new Error(BAD_CREDENTIALS);
    if (user.role !== "admin") throw new Error("This account does not have admin access.");

    await recordLogin(user.id);
    await startSession(user);
    return user;
  });

export const logout = createServerFn({ method: "POST" }).handler(async () => {
  const { endSession } = await import("@/server/auth/session");
  endSession();
  return { ok: true as const };
});

/**
 * First-run setup: creates the initial administrator, but only while no admin exists.
 * Replaces the old `claimFirstAdmin`, which granted a role to an already-signed-up Supabase user.
 * The "no admin yet" check is re-run server-side here, so the window cannot be raced open.
 */
export const createFirstAdmin = createServerFn({ method: "POST" })
  .validator((data: unknown) => credentials.parse(data))
  .handler(async ({ data }): Promise<PublicUser> => {
    const { checkRateLimit } = await import("@/server/rate-limit");
    const { countAdmins, createUser, findUserByEmail } = await import("@/server/auth/users");
    const { startSession } = await import("@/server/auth/session");

    checkRateLimit({ key: "setup", limit: 5, windowMs: 60 * 60 * 1000 });

    if ((await countAdmins()) > 0) throw new Error("An administrator already exists.");
    if (await findUserByEmail(data.email)) throw new Error("That email is already registered.");

    const user = await createUser(data.email, data.password, "admin");
    await startSession(user);
    return user;
  });
