import { useState, type ReactNode } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import {
  BarChart3,
  BookOpen,
  Image as ImageIcon,
  Files,
  Gamepad2,
  Trophy,
  Newspaper,
  HelpCircle,
  Images,
  Menu,
  Navigation,
  Palette,
  Settings,
  LayoutTemplate,
  Megaphone,
  Globe,
  LifeBuoy,
  Search,
  Mail,
  LogOut,
  Tags,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { logout } from "@/lib/auth.functions";
import { cn } from "@/lib/utils";

const GROUPS: { group: string; items: { to: string; label: string; icon: typeof BarChart3 }[] }[] =
  [
    {
      group: "Overview",
      items: [{ to: "/admin", label: "Dashboard", icon: BarChart3 }],
    },
    {
      group: "Appearance",
      items: [
        { to: "/admin/theme", label: "Theme", icon: Palette },
        { to: "/admin/backgrounds", label: "Backgrounds", icon: ImageIcon },
        { to: "/admin/settings", label: "Site Settings", icon: Settings },
        { to: "/admin/navigation", label: "Navigation", icon: Navigation },
        { to: "/admin/footer", label: "Footer", icon: LayoutTemplate },
      ],
    },
    {
      group: "Homepage",
      items: [
        { to: "/admin/homepage", label: "Sections", icon: LayoutTemplate },
        { to: "/admin/hero", label: "Hero Slider", icon: Images },
      ],
    },
    {
      group: "Content",
      items: [
        { to: "/admin/site-pages", label: "Site Pages", icon: BookOpen },
        { to: "/admin/pages", label: "Pages", icon: Files },
        { to: "/admin/games", label: "Games", icon: Gamepad2 },
        { to: "/admin/sports", label: "Sports", icon: Trophy },
        { to: "/admin/blog", label: "Blog Posts", icon: Newspaper },
        { to: "/admin/blog-categories", label: "Blog Categories", icon: Tags },
        { to: "/admin/faq", label: "FAQ", icon: HelpCircle },
        { to: "/admin/promotions", label: "Promotions", icon: Megaphone },
        { to: "/admin/available-sites", label: "Available Sites", icon: Globe },
        { to: "/admin/screenshots", label: "Screenshots", icon: Images },
      ],
    },
    {
      group: "System",
      items: [
        { to: "/admin/media", label: "Media Library", icon: ImageIcon },
        { to: "/admin/support", label: "Support", icon: LifeBuoy },
        { to: "/admin/seo", label: "SEO", icon: Search },
        { to: "/admin/messages", label: "Messages", icon: Mail },
      ],
    },
  ];

export function AdminShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const signOut = async () => {
    await queryClient.cancelQueries();
    queryClient.clear();
    // Clears the httpOnly session cookie server-side; the browser holds no token of its own.
    await logout().catch(() => undefined);
    navigate({ to: "/admin/login", replace: true });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex">
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-50 w-72 overflow-y-auto border-r border-border bg-card transition-transform lg:sticky lg:top-0 lg:h-screen lg:translate-x-0",
            open ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <span className="font-display text-sm font-extrabold tracking-[0.22em] text-primary">
              CMS ADMIN
            </span>
            <Button
              size="icon"
              variant="ghost"
              className="lg:hidden"
              onClick={() => setOpen(false)}
            >
              <X className="size-4" />
            </Button>
          </div>
          <nav className="space-y-6 p-4">
            {GROUPS.map((group) => (
              <div key={group.group} className="space-y-1">
                <p className="px-3 text-[0.65rem] font-semibold tracking-[0.2em] text-muted-foreground uppercase">
                  {group.group}
                </p>
                {group.items.map((item) => {
                  const active = pathname === item.to;
                  return (
                    <Link
                      key={item.to}
                      to={item.to}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                        active
                          ? "bg-primary/15 font-semibold text-primary"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground",
                      )}
                    >
                      <item.icon className="size-4 shrink-0" />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            ))}
          </nav>
        </aside>

        <div className="min-w-0 flex-1">
          <header className="sticky top-0 z-40 flex items-center justify-between gap-3 border-b border-border bg-background/90 px-4 py-3 backdrop-blur">
            <Button
              size="icon"
              variant="outline"
              className="lg:hidden"
              onClick={() => setOpen(true)}
            >
              <Menu className="size-4" />
            </Button>
            <div className="flex items-center gap-2">
              <Button asChild variant="outline" size="sm">
                <a href="/" target="_blank" rel="noreferrer">
                  View site
                </a>
              </Button>
              <Button variant="ghost" size="sm" onClick={signOut}>
                <LogOut className="size-4" /> Sign out
              </Button>
            </div>
          </header>
          <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6">{children}</main>
        </div>
      </div>
      {open && (
        <button
          type="button"
          aria-label="Close menu"
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
        />
      )}
    </div>
  );
}
