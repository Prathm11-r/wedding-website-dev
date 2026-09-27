import { redirect } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  Users,
  Globe,
  Image,
  Settings,
  Heart,
  CreditCard,
  LogOut,
  ChevronRight,
  Bell,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

// ─── Navigation config ────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { label: "Dashboard",  href: "/dashboard",  icon: LayoutDashboard },
  { label: "Website",    href: "/website",    icon: Globe },
  { label: "Guests",     href: "/guests",     icon: Users },
  { label: "Gallery",    href: "/gallery",    icon: Image },
  { label: "Settings",   href: "/settings",   icon: Settings },
] as const;

const BOTTOM_NAV_ITEMS = [
  { label: "Billing",    href: "/billing",    icon: CreditCard },
] as const;

// ─── Sidebar ─────────────────────────────────────────────────────────────────

function AppSidebar({
  userEmail,
  userFullName,
}: {
  userEmail: string;
  userFullName: string | null;
}) {
  return (
    <aside className="flex h-full w-64 flex-col border-r border-border bg-white">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2 border-b border-border px-6">
        <Heart className="h-5 w-5 fill-primary text-primary" aria-hidden="true" />
        <span className="font-display text-lg font-bold text-neutral-dark">
          EverAfter
        </span>
      </div>

      {/* Main nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4" aria-label="App navigation">
        <ul role="list" className="space-y-1">
          {NAV_ITEMS.map(({ label, href, icon: Icon }) => (
            <li key={label}>
              <Link
                href={href}
                className={cn(
                  "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium",
                  "text-neutral-mid transition-colors",
                  "hover:bg-neutral-light hover:text-neutral-dark",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                )}
              >
                <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                {label}
                <ChevronRight
                  className="ml-auto h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-40"
                  aria-hidden="true"
                />
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Bottom section */}
      <div className="border-t border-border px-3 py-3 space-y-1">
        {BOTTOM_NAV_ITEMS.map(({ label, href, icon: Icon }) => (
          <Link
            key={label}
            href={href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium",
              "text-neutral-mid transition-colors",
              "hover:bg-neutral-light hover:text-neutral-dark"
            )}
          >
            <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
            {label}
          </Link>
        ))}

        {/* User block */}
        <div className="mt-2 flex items-center gap-3 rounded-lg px-3 py-2.5">
          {/* Avatar placeholder */}
          <div
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-white text-xs font-bold"
            aria-hidden="true"
          >
            {(userFullName ?? userEmail).charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-neutral-dark">
              {userFullName ?? "My Account"}
            </p>
            <p className="truncate text-xs text-neutral-mid">{userEmail}</p>
          </div>
          {/* Sign out is a form action to avoid client-side JS for a simple redirect */}
          <form action="/auth/signout" method="POST">
            <button
              type="submit"
              className="text-neutral-mid transition-colors hover:text-neutral-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
              aria-label="Sign out"
            >
              <LogOut className="h-4 w-4" aria-hidden="true" />
            </button>
          </form>
        </div>
      </div>
    </aside>
  );
}

// ─── Top bar ─────────────────────────────────────────────────────────────────

function AppTopBar() {
  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-white px-6">
      <div />
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label="Notifications"
          className="relative"
        >
          <Bell className="h-4 w-4" aria-hidden="true" />
        </Button>
        <Button size="sm" asChild>
          <Link href="/website/preview" target="_blank" rel="noopener noreferrer">
            Preview site
          </Link>
        </Button>
      </div>
    </header>
  );
}

// ─── Layout ───────────────────────────────────────────────────────────────────

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Auth guard — this runs server-side on every render of an (app) route.
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    // Middleware should catch this first, but belt-and-suspenders here.
    redirect("/auth/login");
  }

  // Fetch the user's profile for display in the sidebar
  const { data: rawProfile } = await supabase
    .from("profiles")
    .select("full_name, avatar_url")
    .eq("id", user.id)
    .single();

  const profile = rawProfile as unknown as { full_name: string | null; avatar_url: string | null } | null;

  return (
    <div className="flex h-screen overflow-hidden bg-neutral-light">
      {/* Sidebar — hidden on mobile, visible on md+ */}
      <div className="hidden md:flex md:flex-shrink-0">
        <AppSidebar
          userEmail={user.email ?? ""}
          userFullName={profile?.full_name ?? null}
        />
      </div>

      {/* Main content area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <AppTopBar />
        <main
          className="flex-1 overflow-y-auto p-6 lg:p-8"
          id="main-content"
        >
          {children}
        </main>
      </div>
    </div>
  );
}
