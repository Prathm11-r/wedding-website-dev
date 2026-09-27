import Link from "next/link";
import { ArrowLeft, FileText } from "lucide-react";

export const metadata = {
  title: "Terms of Service — EverAfter",
  description: "EverAfter terms of service and subscriber agreement.",
};

export default function TermsOfServicePage() {
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
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h1 className="font-display text-2xl sm:text-3xl font-bold text-neutral-dark">
                Terms of Service
              </h1>
              <p className="text-xs text-neutral-mid">Last Updated: September 2026</p>
            </div>
          </div>

          <div className="space-y-4 text-xs sm:text-sm text-neutral-mid leading-relaxed">
            <h2 className="font-display text-lg font-bold text-neutral-dark">
              1. Platform Subscription & Service
            </h2>
            <p>
              EverAfter provides couples and professional coordinators with website building tools, digital RSVP engines, and custom domain routing. You may choose between our Free Atelier tier, Signature Premium, or Planner Pro subscription.
            </p>

            <h2 className="font-display text-lg font-bold text-neutral-dark pt-3">
              2. Acceptable Use
            </h2>
            <p>
              Users agree to use EverAfter solely for legitimate wedding celebrations and guest coordination. Uploading harmful, infringing, or inappropriate media is strictly prohibited.
            </p>

            <h2 className="font-display text-lg font-bold text-neutral-dark pt-3">
              3. Cancellation & Refunds
            </h2>
            <p>
              Subscriptions can be cancelled at any time directly through your billing workspace. Services continue through the end of the paid billing cycle.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
