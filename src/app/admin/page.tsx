import * as React from "react";
import Link from "next/link";
import {
  Users,
  CreditCard,
  Globe,
  Activity,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  Shield,
  Layers,
  ArrowUpRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

// Mock platform analytics for Super Admin view (no fabricated consumer testimonials)
const PLATFORM_STATS = [
  { label: "Total Tenants (Couples)", value: "148", change: "+12 this week", positive: true, icon: Users },
  { label: "Active Subscriptions", value: "84", change: "56.7% paid conversion", positive: true, icon: CreditCard },
  { label: "Custom Domains Active", value: "52", change: "Vercel Edge TLS verified", positive: true, icon: Globe },
  { label: "Platform Health", value: "99.98%", change: "All systems operational", positive: true, icon: Activity },
];

const TENANTS_SAMPLE = [
  {
    id: "ten-001",
    couple: "Sarah Jenkins & James Miller",
    subdomain: "sarah-and-james",
    custom_domain: "jenkinsmiller.com",
    plan: "Premium",
    status: "Published",
    guests_count: 142,
    rsvps_count: 118,
    created_at: "2026-09-12",
  },
  {
    id: "ten-002",
    couple: "Aaliyah Khan & Rohan Patel",
    subdomain: "aaliyah-and-rohan",
    custom_domain: null,
    plan: "Planner Pro",
    status: "Published",
    guests_count: 380,
    rsvps_count: 310,
    created_at: "2026-09-18",
  },
  {
    id: "ten-003",
    couple: "Elena Rostova & David Chen",
    subdomain: "elena-and-david",
    custom_domain: "elenadavidforever.com",
    plan: "Premium",
    status: "Published",
    guests_count: 85,
    rsvps_count: 72,
    created_at: "2026-09-21",
  },
  {
    id: "ten-004",
    couple: "Maya Lin & Marcus Williams",
    subdomain: "maya-and-marcus",
    custom_domain: null,
    plan: "Free",
    status: "Draft",
    guests_count: 24,
    rsvps_count: 0,
    created_at: "2026-09-26",
  },
];

const INTEGRATIONS_HEALTH = [
  { name: "PostgreSQL Database (Supabase)", status: "Connected", latency: "24ms", ok: true },
  { name: "Payment Gateway (Stripe)", status: "Live & Webhooks Active", latency: "110ms", ok: true },
  { name: "Transactional Email & SMS (Resend / Twilio)", status: "DKIM/DMARC Verified", latency: "45ms", ok: true },
  { name: "Edge Domain Routing (Vercel)", status: "Wildcard SSL Active", latency: "12ms", ok: true },
];

export default function SuperAdminPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-6">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-white">
            Platform Overview & Tenant Operations
          </h1>
          <p className="mt-1 text-sm text-neutral-400">
            Global management portal for EverAfter SaaS administrators.
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {PLATFORM_STATS.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="rounded-2xl border border-neutral-800 bg-neutral-950 p-6 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium uppercase tracking-wider text-neutral-400">
                  {stat.label}
                </span>
                <div className="h-9 w-9 rounded-lg bg-neutral-800 flex items-center justify-center text-primary-light">
                  <Icon className="h-5 w-5" />
                </div>
              </div>
              <p className="font-display text-3xl font-bold text-white mt-4">
                {stat.value}
              </p>
              <p className="text-xs text-primary-light mt-1 flex items-center gap-1">
                {stat.change}
              </p>
            </div>
          );
        })}
      </div>

      {/* Tenants Table */}
      <section className="rounded-2xl border border-neutral-800 bg-neutral-950 overflow-hidden">
        <div className="p-6 border-b border-neutral-800 flex items-center justify-between">
          <div>
            <h2 className="font-display text-lg font-bold text-white">
              Recent Tenant Instances
            </h2>
            <p className="text-xs text-neutral-400 mt-0.5">
              Live wedding sites running on EverAfter multi-tenant infrastructure
            </p>
          </div>
          <span className="text-xs font-mono text-neutral-400">
            Row-Level Security (RLS) Enforced
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-neutral-300">
            <thead className="bg-neutral-900/60 text-xs uppercase font-medium text-neutral-400 border-b border-neutral-800">
              <tr>
                <th className="px-6 py-3.5">Couple / Tenant</th>
                <th className="px-6 py-3.5">Subdomain & Domain</th>
                <th className="px-6 py-3.5">Plan Tier</th>
                <th className="px-6 py-3.5">Guests / RSVPs</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800">
              {TENANTS_SAMPLE.map((t) => (
                <tr key={t.id} className="hover:bg-neutral-900/40 transition-colors">
                  <td className="px-6 py-4 font-medium text-white">
                    <div>{t.couple}</div>
                    <div className="text-xs font-mono text-neutral-500">{t.id}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-mono text-xs text-primary-light">
                      {t.subdomain}.everafter.com
                    </div>
                    {t.custom_domain && (
                      <div className="text-xs text-neutral-400 flex items-center gap-1 mt-0.5">
                        <Globe className="h-3 w-3 text-green-400" />
                        {t.custom_domain}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        t.plan === "Planner Pro"
                          ? "bg-purple-950 text-purple-300 border border-purple-800"
                          : t.plan === "Premium"
                          ? "bg-amber-950 text-amber-300 border border-amber-800"
                          : "bg-neutral-800 text-neutral-300"
                      }`}
                    >
                      {t.plan}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs">
                    <span className="text-white font-medium">{t.rsvps_count}</span>
                    <span className="text-neutral-500"> / {t.guests_count} confirmed</span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${
                        t.status === "Published"
                          ? "text-green-400 bg-green-950/40"
                          : "text-neutral-400 bg-neutral-900"
                      }`}
                    >
                      {t.status === "Published" && <CheckCircle2 className="h-3 w-3" />}
                      {t.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      href={`/wedding/${t.subdomain}`}
                      target="_blank"
                      className="text-xs text-primary-light hover:underline inline-flex items-center gap-1"
                    >
                      Inspect
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Cloud Integrations Status */}
      <section className="rounded-2xl border border-neutral-800 bg-neutral-950 p-6">
        <h2 className="font-display text-lg font-bold text-white mb-4">
          Cloud Infrastructure & Integrations
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {INTEGRATIONS_HEALTH.map((item) => (
            <div
              key={item.name}
              className="p-4 rounded-xl border border-neutral-800 bg-neutral-900/50 flex items-center justify-between"
            >
              <div>
                <p className="text-sm font-semibold text-white">{item.name}</p>
                <p className="text-xs text-neutral-400 mt-0.5">{item.status}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-neutral-400">{item.latency}</span>
                <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
