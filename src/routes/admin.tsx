import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { AdminShell } from "@/components/admin/AdminShell";
import { me } from "@/lib/auth.functions";

export const Route = createFileRoute("/admin")({
  ssr: false,
  beforeLoad: async () => {
    // `me()` verifies the session cookie server-side. This guard is a UX redirect only — the real
    // enforcement is the `requireAdmin` middleware on every admin server function, so bypassing
    // the client router gains nothing.
    const user = await me().catch(() => null);
    if (!user) throw redirect({ to: "/admin/login" });
    if (user.role !== "admin") throw redirect({ to: "/admin/login", search: { denied: true } });
    return { user };
  },
  component: () => (
    <AdminShell>
      <Outlet />
    </AdminShell>
  ),
});
