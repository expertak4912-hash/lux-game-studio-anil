/**
 * Authorization middleware — the application-level replacement for the RLS policies
 * `"admins manage {table}"` that used to gate every write.
 *
 * Shape mirrors the old `requireSupabaseAuth` in `src/integrations/supabase/auth-middleware.ts`,
 * so server functions attach it the same way:
 *
 *     createServerFn({ method: "POST" }).middleware([requireAdmin]).handler(({ context }) => ...)
 *
 * WHY THIS LIVES IN `src/lib/` AND NOT `src/server/`: middleware values must be importable from
 * the same modules the client bundles, because the client needs the middleware's identity to make
 * the RPC call. TanStack's import-protection plugin denies any static import of `**\/server\/**`
 * from client-reachable code, so the session lookup is a dynamic import inside the `.server()`
 * body, which is stripped from the client build.
 */
import { createMiddleware } from "@tanstack/react-start";
import type { PublicUser } from "@/shared/types";

const UNAUTHORIZED = "Unauthorized: please sign in.";
const FORBIDDEN = "Forbidden: administrator access required.";

/** Requires any signed-in user. Adds `context.user`. */
export const requireAuth = createMiddleware({ type: "function" }).server(async ({ next }) => {
  const { readSession } = await import("@/server/auth/session");

  const claims = await readSession();
  if (!claims) throw new Error(UNAUTHORIZED);

  const user: PublicUser = { id: claims.sub, email: claims.email, role: claims.role };
  return next({ context: { user } });
});

/** Requires a signed-in user holding the admin role. Adds `context.user`. */
export const requireAdmin = createMiddleware({ type: "function" }).server(async ({ next }) => {
  const { readSession } = await import("@/server/auth/session");

  const claims = await readSession();
  if (!claims) throw new Error(UNAUTHORIZED);
  if (claims.role !== "admin") throw new Error(FORBIDDEN);

  const user: PublicUser = { id: claims.sub, email: claims.email, role: claims.role };
  return next({ context: { user } });
});
