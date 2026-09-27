"use client";

import * as React from "react";
import Link from "next/link";
import {
  CreditCard,
  Check,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Receipt,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const PLANS = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Standard website with basic RSVP and up to 50 guests.",
    features: [
      "Subdomain (name.everafter.com)",
      "Up to 50 guests RSVP tracking",
      "25 photo gallery uploads",
      "Digital meal & plus-one selections",
    ],
    isCurrent: false,
    cta: "Downgrade",
  },
  {
    name: "Premium",
    price: "$14.99",
    period: "per month",
    description: "Custom domain, unlimited guests, and 500 photos.",
    features: [
      "Connect your custom domain",
      "Unlimited guests & RSVP responses",
      "500 photo gallery uploads",
      "Interactive seating chart & table planner",
      "Multi-day event schedule",
      "Remove EverAfter badge",
      "Priority customer support",
    ],
    isCurrent: true,
    cta: "Current Plan",
  },
  {
    name: "Planner Pro",
    price: "$49.99",
    period: "per month",
    description: "For professional coordinators managing multiple couples.",
    features: [
      "Unlimited client wedding instances",
      "Multi-wedding planner dashboard",
      "Unlimited guests and photos for all clients",
      "White-label branding options",
      "Client collaboration permissions",
      "Dedicated onboarding manager",
    ],
    isCurrent: false,
    cta: "Upgrade to Pro",
  },
];

const INVOICES = [
  { id: "INV-2026-001", date: "Sep 27, 2026", amount: "$14.99", status: "Paid" },
  { id: "INV-2026-000", date: "Aug 27, 2026", amount: "$14.99", status: "Paid" },
];

export default function BillingPage() {
  return (
    <div className="max-w-5xl space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl font-bold text-neutral-dark">
          Subscription & Billing
        </h1>
        <p className="mt-1 text-sm text-neutral-mid">
          Manage your plan tier, payment method, and billing statements.
        </p>
      </div>

      {/* Active Subscription Summary */}
      <section className="rounded-2xl border border-primary/40 bg-white p-6 shadow-soft-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 h-28 w-28 bg-primary/10 rounded-bl-full pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-primary text-white">
                Active Subscription
              </span>
              <span className="text-xs text-neutral-mid">Renews automatically</span>
            </div>
            <h2 className="font-display text-2xl font-bold text-neutral-dark mt-2">
              EverAfter Premium Plan
            </h2>
            <p className="text-sm text-neutral-mid mt-1">
              $14.99 / month · Next billing date: <strong>October 27, 2026</strong>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm">
              <CreditCard className="mr-1.5 h-4 w-4" />
              Update Payment Method
            </Button>
            <Button size="sm" asChild>
              <Link href="/pricing">Change Tier</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Plans Comparison */}
      <section className="space-y-4">
        <h2 className="font-display text-lg font-bold text-neutral-dark">
          Available Subscription Plans
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-2xl p-6 border flex flex-col justify-between ${
                plan.isCurrent
                  ? "border-primary bg-white shadow-soft-md ring-2 ring-primary/20"
                  : "border-border bg-white/70"
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-xl font-bold text-neutral-dark">
                    {plan.name}
                  </h3>
                  {plan.isCurrent && (
                    <span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-primary/10 text-primary-dark">
                      Current
                    </span>
                  )}
                </div>

                <div className="mt-4 flex items-baseline gap-1">
                  <span className="font-display text-3xl font-bold text-neutral-dark">
                    {plan.price}
                  </span>
                  <span className="text-xs text-neutral-mid">/{plan.period}</span>
                </div>

                <p className="mt-2 text-xs text-neutral-mid min-h-[32px]">
                  {plan.description}
                </p>

                <ul className="mt-6 space-y-2.5 text-xs text-neutral-dark">
                  {plan.features.map((feat) => (
                    <li key={feat} className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8">
                <Button
                  variant={plan.isCurrent ? "outline" : "primary"}
                  disabled={plan.isCurrent}
                  className="w-full text-xs"
                  size="sm"
                >
                  {plan.cta}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Invoices and Payment Receipts */}
      <section className="rounded-2xl border border-border bg-white p-6 shadow-soft-sm space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <h2 className="font-display text-lg font-bold text-neutral-dark flex items-center gap-2">
            <Receipt className="h-5 w-5 text-primary" />
            Billing History & Receipts
          </h2>
          <span className="text-xs text-neutral-mid">Secured via Stripe Payments</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-neutral-dark">
            <thead className="bg-neutral-light/60 text-neutral-mid uppercase font-medium">
              <tr>
                <th className="px-4 py-2.5">Invoice ID</th>
                <th className="px-4 py-2.5">Date</th>
                <th className="px-4 py-2.5">Amount</th>
                <th className="px-4 py-2.5">Status</th>
                <th className="px-4 py-2.5 text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {INVOICES.map((inv) => (
                <tr key={inv.id}>
                  <td className="px-4 py-3 font-mono font-medium">{inv.id}</td>
                  <td className="px-4 py-3 text-neutral-mid">{inv.date}</td>
                  <td className="px-4 py-3 font-semibold">{inv.amount}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-50 text-green-700 font-semibold text-[11px]">
                      {inv.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => alert(`Downloading receipt for ${inv.id}`)}
                      className="text-primary-dark hover:underline inline-flex items-center gap-1"
                    >
                      <Download className="h-3.5 w-3.5" />
                      PDF
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
