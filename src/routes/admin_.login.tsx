import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Loader2, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { adminExists, createFirstAdmin, login } from "@/lib/auth.functions";

export const Route = createFileRoute("/admin_/login")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Admin Login" },
      { name: "robots", content: "noindex, nofollow" },
      { name: "description", content: "Administrator sign in." },
    ],
  }),
  component: AdminLogin,
});

function AdminLogin() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "setup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [firstRun, setFirstRun] = useState(false);

  useEffect(() => {
    void adminExists()
      .then((r) => {
        setFirstRun(!r.exists);
        if (!r.exists) setMode("setup");
      })
      .catch(() => setFirstRun(false));
  }, []);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setBusy(true);
    try {
      // Both calls set the session cookie server-side; nothing is stored in the browser.
      if (mode === "setup") {
        await createFirstAdmin({ data: { email, password } });
        toast.success("Administrator account created");
      } else {
        await login({ data: { email, password } });
      }
      navigate({ to: "/admin", replace: true });
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-16">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-lg">
        <div className="mb-6 flex items-center gap-3">
          <span className="grid size-11 place-items-center rounded-full bg-primary/15 text-primary">
            <ShieldCheck className="size-5" />
          </span>
          <div>
            <h1 className="text-xl font-bold">
              {mode === "setup" ? "Create administrator" : "Admin login"}
            </h1>
            <p className="text-xs text-muted-foreground">
              {mode === "setup"
                ? "First-run setup: this creates the only owner account."
                : "Restricted area. Authorised staff only."}
            </p>
          </div>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              autoComplete={mode === "setup" ? "new-password" : "current-password"}
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Button type="submit" className="w-full" disabled={busy}>
            {busy && <Loader2 className="size-4 animate-spin" />}
            {mode === "setup" ? "Create admin account" : "Sign in"}
          </Button>
        </form>

        {firstRun && (
          <p className="mt-4 text-center text-xs text-muted-foreground">
            No administrator exists yet, so this form creates one.
          </p>
        )}
        {!firstRun && (
          <p className="mt-4 text-center text-xs text-muted-foreground">
            Forgot your password? Run <code className="font-mono">npm run seed</code> with
            SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD set, or contact the site owner.
          </p>
        )}
      </div>
    </div>
  );
}
