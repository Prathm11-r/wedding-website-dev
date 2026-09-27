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
  Sparkles,
  Camera,
  Heart,
  Palette,
  Eye,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";

// ─── 3D Stat card ─────────────────────────────────────────────────────────────

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ElementType;
  description?: string;
  trend?: { value: string; positive: boolean };
}

function StatCard({ label, value, icon: Icon, description, trend }: StatCardProps) {
  return (
    <article className="rounded-2xl bg-white p-6 shadow-3d-card border border-border/80 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-neutral-mid">{label}</p>
          <p className="mt-2 font-display text-3xl sm:text-4xl font-bold text-neutral-dark">
            {value}
          </p>
          {description && (
            <p className="mt-1 text-xs text-neutral-mid">{description}</p>
          )}
        </div>
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary-deep shadow-soft-sm">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </div>
      </div>
      {trend && (
        <p
          className={cn(
            "mt-4 text-xs font-semibold flex items-center gap-1",
            trend.positive ? "text-emerald-700" : "text-amber-700"
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
    className: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  },
  pending: {
    label: "Awaiting Reply",
    icon: Clock,
    className: "bg-amber-50 text-amber-800 ring-amber-200",
  },
  declined: {
    label: "Declined",
    icon: XCircle,
    className: "bg-neutral-100 text-neutral-600 ring-neutral-200",
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
        "group flex items-start gap-4 rounded-2xl border border-border/80 bg-white p-6 shadow-3d-card",
        "transition-all duration-300 hover:border-primary/50 hover:-translate-y-1 hover:shadow-soft-lg",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      )}
    >
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary-deep transition-colors group-hover:bg-primary/20">
        <Icon className="h-5 w-5" aria-hidden="true" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-display text-base font-bold text-neutral-dark group-hover:text-primary-deep transition-colors">
          {title}
        </p>
        <p className="mt-1 text-xs text-neutral-mid leading-relaxed">{description}</p>
      </div>
      <ArrowRight className="h-4 w-4 shrink-0 text-neutral-mid opacity-0 transition-opacity group-hover:opacity-100 group-hover:text-primary-deep" aria-hidden="true" />
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

  // Fallback sample wedding data if the user has not created one yet
  const coupleNames = wedding
    ? `${wedding.partner_one_name} & ${wedding.partner_two_name}`
    : "Sarah & James (Sample Couple)";
  const weddingSlug = wedding ? wedding.slug : "sarah-and-james";
  const weddingDate = wedding?.wedding_date ?? "2027-06-19";
  const weddingLocation = wedding?.location ?? "Napa Valley, California";
  const weddingStatus = wedding?.status ?? "published";

  // Compute RSVP stats
  const rsvpRows = wedding?.rsvps ?? [
    { status: "attending" },
    { status: "attending" },
    { status: "attending" },
    { status: "pending" },
    { status: "declined" },
  ];
  const guestCount = wedding?.guests?.[0]?.count ?? 48;
  const attendingCount = wedding
    ? rsvpRows.filter((r) => r.status === "attending").length
    : 36;
  const pendingCount = wedding
    ? rsvpRows.filter((r) => r.status === "pending").length
    : 9;
  const declinedCount = wedding
    ? rsvpRows.filter((r) => r.status === "declined").length
    : 3;

  const daysUntilWedding = Math.max(
    0,
    Math.ceil((new Date(weddingDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
  );

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Page header with luxury monogram & status badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-border/80 shadow-3d-card">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-full bg-gradient-to-br from-[#ECC880] via-[#C9A96E] to-[#9F7A38] p-[1.5px] shadow-wax-seal flex items-center justify-center shrink-0">
            <div className="w-full h-full rounded-full bg-white flex items-center justify-center font-display font-bold text-xs text-primary-deep tracking-widest">
              EA
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="font-display text-2xl sm:text-3xl font-bold text-neutral-dark">
                {coupleNames}
              </h1>
              <span
                className={cn(
                  "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold tracking-wider uppercase ring-1",
                  weddingStatus === "published"
                    ? "bg-emerald-50 text-emerald-800 ring-emerald-200"
                    : "bg-amber-50 text-amber-800 ring-amber-200"
                )}
              >
                {weddingStatus === "published" ? "Live on CDN" : "Draft Studio"}
              </span>
            </div>
            <p className="mt-1 text-xs sm:text-sm text-neutral-mid flex items-center gap-2">
              <CalendarDays className="h-3.5 w-3.5 text-primary-deep" />
              <span>{formatDate(weddingDate)}</span>
              <span>•</span>
              <span>{weddingLocation}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" asChild className="border-border">
            <Link href={`/wedding/${weddingSlug}`} target="_blank">
              <Eye className="h-3.5 w-3.5 mr-1.5" />
              View Site
            </Link>
          </Button>
          <Button size="sm" asChild className="shadow-soft-md shadow-primary/20">
            <Link href="/website">
              <Palette className="h-3.5 w-3.5 mr-1.5" />
              Open Studio
            </Link>
          </Button>
        </div>
      </div>

      {/* 3D Stats Row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Guests"
          value={guestCount}
          icon={Users}
          description="Confirmed on invite roster"
        />
        <StatCard
          label="Attending"
          value={attendingCount}
          icon={CheckCircle2}
          trend={{
            value: `${guestCount ? Math.round((attendingCount / guestCount) * 100) : 75}% confirmed rate`,
            positive: true,
          }}
        />
        <StatCard
          label="Awaiting Reply"
          value={pendingCount}
          icon={Clock}
          description="Pending digital responses"
        />
        <StatCard
          label="Days to Celebration"
          value={daysUntilWedding}
          icon={CalendarDays}
          description="Until sacred vows exchange"
        />
      </div>

      {/* RSVP Breakdown Progress Bar */}
      <section aria-labelledby="rsvp-heading" className="bg-white p-6 sm:p-8 rounded-3xl border border-border/80 shadow-3d-card">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2
              id="rsvp-heading"
              className="font-display text-xl font-bold text-neutral-dark"
            >
              Live RSVP Roster Breakdown
            </h2>
            <p className="text-xs text-neutral-mid mt-0.5">
              Real-time response tracking with automated dietary counts.
            </p>
          </div>
          <Button variant="ghost" size="sm" asChild className="text-primary-deep text-xs font-semibold">
            <Link href="/guests">
              Manage Guest List <ArrowRight className="h-3.5 w-3.5 ml-1" aria-hidden="true" />
            </Link>
          </Button>
        </div>

        <div className="space-y-4">
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
                className="flex items-center gap-4 p-3 rounded-xl bg-neutral-surface border border-border/60"
              >
                <span
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ring-1 min-w-[130px]",
                    config.className
                  )}
                >
                  <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                  {config.label}
                </span>
                <div className="flex-1 bg-neutral-200/60 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-700"
                    style={{ width: `${pct}%` }}
                    role="progressbar"
                    aria-valuenow={pct}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  />
                </div>
                <span className="text-xs font-mono font-bold text-neutral-dark w-12 text-right">
                  {count} <span className="text-[10px] text-neutral-mid font-normal">({pct}%)</span>
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Quick Atelier Actions */}
      <section aria-labelledby="actions-heading">
        <h2
          id="actions-heading"
          className="font-display text-lg font-bold text-neutral-dark mb-4"
        >
          Atelier Quick Actions
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <QuickActionCard
            title="Customise Website Studio"
            description="Re-skin themes, customize typography, and adjust sections."
            href="/website"
            icon={Palette}
          />
          <QuickActionCard
            title="Guest Roster & CSV Export"
            description="Import contacts, assign plus-ones, and export caterer spreadsheets."
            href="/guests"
            icon={Users}
          />
          <QuickActionCard
            title="Photo Gallery & Moderation"
            description="Manage high-resolution ceremony photos and guest uploads."
            href="/gallery"
            icon={Camera}
          />
        </div>
      </section>
    </div>
  );
}
