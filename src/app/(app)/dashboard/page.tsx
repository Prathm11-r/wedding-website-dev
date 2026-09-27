import { redirect } from "next/navigation";
import Link from "next/link";
import {
  Users,
  Globe,
  CalendarDays,
  TrendingUp,
  CheckCircle2,
  Clock,
  XCircle,
  ArrowRight,
  Plus,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";

// ─── Stat card ────────────────────────────────────────────────────────────────

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ElementType;
  description?: string;
  trend?: { value: string; positive: boolean };
}

function StatCard({ label, value, icon: Icon, description, trend }: StatCardProps) {
  return (
    <article className="rounded-xl bg-white p-6 shadow-soft-sm ring-1 ring-border">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-neutral-mid">{label}</p>
          <p className="mt-2 font-display text-3xl font-bold text-neutral-dark">
            {value}
          </p>
          {description && (
            <p className="mt-1 text-sm text-neutral-mid">{description}</p>
          )}
        </div>
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
          <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
        </div>
      </div>
      {trend && (
        <p
          className={cn(
            "mt-4 text-sm font-medium",
            trend.positive ? "text-green-600" : "text-red-600"
          )}
        >
          {trend.positive ? "↑" : "↓"} {trend.value}
        </p>
      )}
    </article>
  );
}

// ─── RSVP status pill ─────────────────────────────────────────────────────────

const RSVP_STATUS_CONFIG = {
  attending: {
    label: "Attending",
    icon: CheckCircle2,
    className: "bg-green-50 text-green-700 ring-green-200",
  },
  pending: {
    label: "Awaiting reply",
    icon: Clock,
    className: "bg-amber-50 text-amber-700 ring-amber-200",
  },
  declined: {
    label: "Declined",
    icon: XCircle,
    className: "bg-red-50 text-red-700 ring-red-200",
  },
} as const;

// ─── Quick action card ────────────────────────────────────────────────────────

function QuickActionCard({
  title,
  description,
  href,
  icon: Icon,
}: {
  title: string;
  description: string;
  href: string;
  icon: React.ElementType;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group flex items-start gap-4 rounded-xl border border-border bg-white p-5",
        "transition-all hover:border-primary/40 hover:shadow-soft-md",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      )}
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 transition-colors group-hover:bg-primary/20">
        <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-neutral-dark">{title}</p>
        <p className="mt-0.5 text-sm text-neutral-mid">{description}</p>
      </div>
      <ArrowRight className="h-4 w-4 shrink-0 text-neutral-mid opacity-0 transition-opacity group-hover:opacity-100" aria-hidden="true" />
    </Link>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  // ── Data fetching ─────────────────────────────────────────────────────────
  type WeddingDashboardData = {
    id: string;
    slug: string;
    partner_one_name: string;
    partner_two_name: string;
    wedding_date: string | null;
    location: string | null;
    status: "draft" | "published" | "archived";
    guests?: Array<{ count: number }>;
    rsvps?: Array<{ status: string }>;
  };

  // Fetch the couple's first (most recent) wedding
  const { data: rawWedding } = await supabase
    .from("weddings")
    .select(
      `
      id, slug, partner_one_name, partner_two_name,
      wedding_date, location, status,
      guests:guests(count),
      rsvps:rsvps(status)
    `
    )
    .eq("created_by", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const wedding = rawWedding as unknown as WeddingDashboardData | null;

  // Compute RSVP stats
  const rsvpRows = wedding?.rsvps ?? [];
  const guestCount = wedding?.guests?.[0]?.count ?? 0;
  const attendingCount = rsvpRows.filter((r) => r.status === "attending").length;
  const pendingCount   = rsvpRows.filter((r) => r.status === "pending").length;
  const declinedCount  = rsvpRows.filter((r) => r.status === "declined").length;

  // ── No wedding yet → onboarding prompt ───────────────────────────────────
  if (!wedding) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <Plus className="h-8 w-8 text-primary" aria-hidden="true" />
        </div>
        <h1 className="font-display text-2xl font-bold text-neutral-dark">
          Create your first wedding website
        </h1>
        <p className="mt-3 max-w-sm text-neutral-mid">
          You&apos;re just a few steps away from sharing your love story with
          the world.
        </p>
        <Button size="lg" className="mt-8" asChild>
          <Link href="/wedding/new">
            <Plus className="h-4 w-4" aria-hidden="true" />
            Get started
          </Link>
        </Button>
      </div>
    );
  }

  // ── Dashboard content ─────────────────────────────────────────────────────
  const coupleNames = `${wedding.partner_one_name} & ${wedding.partner_two_name}`;
  const daysUntilWedding = wedding.wedding_date
    ? Math.max(
        0,
        Math.ceil(
          (new Date(wedding.wedding_date).getTime() - Date.now()) /
            (1000 * 60 * 60 * 24)
        )
      )
    : null;

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-neutral-dark">
            {coupleNames}
          </h1>
          <p className="mt-1 text-neutral-mid">
            {wedding.wedding_date
              ? `${formatDate(wedding.wedding_date)} · ${wedding.location ?? "Location TBC"}`
              : "Date not set yet"}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span
            className={cn(
              "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ring-1",
              wedding.status === "published"
                ? "bg-green-50 text-green-700 ring-green-200"
                : "bg-amber-50 text-amber-700 ring-amber-200"
            )}
          >
            {wedding.status === "published" ? "Live" : "Draft"}
          </span>
          <Button variant="secondary" size="sm" asChild>
            <Link href="/website">Edit website</Link>
          </Button>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Guests"
          value={guestCount}
          icon={Users}
          description="on your guest list"
        />
        <StatCard
          label="Attending"
          value={attendingCount}
          icon={CheckCircle2}
          trend={{
            value: `${guestCount ? Math.round((attendingCount / guestCount) * 100) : 0}% confirmed`,
            positive: true,
          }}
        />
        <StatCard
          label="Awaiting Reply"
          value={pendingCount}
          icon={Clock}
          description="RSVPs not yet received"
        />
        {daysUntilWedding !== null ? (
          <StatCard
            label="Days to Go"
            value={daysUntilWedding}
            icon={CalendarDays}
            description="until your big day"
          />
        ) : (
          <StatCard
            label="Declined"
            value={declinedCount}
            icon={TrendingUp}
            description="RSVPs declined"
          />
        )}
      </div>

      {/* RSVP breakdown */}
      <section aria-labelledby="rsvp-heading">
        <div className="flex items-center justify-between mb-4">
          <h2
            id="rsvp-heading"
            className="font-display text-lg font-semibold text-neutral-dark"
          >
            RSVP Breakdown
          </h2>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/guests">
              View all guests <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </Button>
        </div>

        <div className="rounded-xl bg-white shadow-soft-sm ring-1 ring-border overflow-hidden">
          {Object.entries(RSVP_STATUS_CONFIG).map(([status, config]) => {
            const count =
              status === "attending"
                ? attendingCount
                : status === "pending"
                ? pendingCount
                : declinedCount;
            const pct = guestCount ? Math.round((count / guestCount) * 100) : 0;
            const Icon = config.icon;

            return (
              <div
                key={status}
                className="flex items-center gap-4 px-6 py-4 border-b border-border last:border-0"
              >
                <span
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 min-w-[110px]",
                    config.className
                  )}
                >
                  <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                  {config.label}
                </span>
                <div className="flex-1 bg-neutral-light rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all"
                    style={{ width: `${pct}%` }}
                    role="progressbar"
                    aria-valuenow={pct}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={`${config.label}: ${pct}%`}
                  />
                </div>
                <span className="text-sm font-medium text-neutral-dark w-8 text-right">
                  {count}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Quick actions */}
      <section aria-labelledby="actions-heading">
        <h2
          id="actions-heading"
          className="font-display text-lg font-semibold text-neutral-dark mb-4"
        >
          Quick Actions
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <QuickActionCard
            title="Add Guests"
            description="Import or add guests to your list"
            href="/guests/new"
            icon={Users}
          />
          <QuickActionCard
            title="Customise Website"
            description="Edit sections, colours, and content"
            href="/website"
            icon={Globe}
          />
          <QuickActionCard
            title="Send Invitations"
            description="Email your guests their digital invite"
            href="/guests/invite"
            icon={TrendingUp}
          />
        </div>
      </section>
    </div>
  );
}
