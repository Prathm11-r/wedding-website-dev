import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";

export const metadata = {
  title: "Privacy Policy — EverAfter",
  description: "EverAfter privacy policy and guest data security protections.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-neutral-surface min-h-screen py-16 sm:py-24">
      <div className="mx-auto max-w-3xl px-6 lg:px-8">
        <Link
          href="/"
          className="inline-flex items-center text-xs font-semibold uppercase tracking-wider text-primary-deep hover:underline mb-8"
        >
          <ArrowLeft className="h-3.5 w-3.5 mr-1.5" />
          Back to Home
        </Link>

        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-border/80 shadow-3d-card space-y-6">
          <div className="flex items-center gap-3 border-b border-border/60 pb-6">
            <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary-deep flex items-center justify-center">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h1 className="font-display text-2xl sm:text-3xl font-bold text-neutral-dark">
                Privacy Policy & Guest Protections
              </h1>
              <p className="text-xs text-neutral-mid">Last Updated: September 2026</p>
            </div>
          </div>

          <div className="space-y-4 text-xs sm:text-sm text-neutral-mid leading-relaxed">
            <h2 className="font-display text-lg font-bold text-neutral-dark">
              1. Our Zero Advertising Commitment
            </h2>
            <p>
              EverAfter does not sell, license, or monetize couple or guest data. We do not display third-party advertisements or tracking beacons on couples’ wedding websites.
            </p>

            <h2 className="font-display text-lg font-bold text-neutral-dark pt-3">
              2. Data Isolation & Security
            </h2>
            <p>
              Guest records, RSVPs, dietary requirements, and high-resolution photo uploads are isolated using PostgreSQL Row-Level Security (RLS). Only authenticated couple owners and assigned planners may access guest manifests.
            </p>

            <h2 className="font-display text-lg font-bold text-neutral-dark pt-3">
              3. Data Ownership & Deletion
            </h2>
            <p>
              Couples own all content published to EverAfter. You may export your guest list to CSV or request total account and data deletion at any time from your settings workspace.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
