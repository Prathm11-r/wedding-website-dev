import Link from "next/link";
import { Check, HelpCircle, ArrowRight, Sparkles, ShieldCheck, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

const TIERS = [
  {
    name: "Free Atelier",
    id: "tier-free",
    priceMonthly: "$0",
    description: "Essential suite to launch a bespoke wedding website and gather digital RSVPs.",
    features: [
      "Dedicated subdomain (e.g. yourname.everafter.com)",
      "Up to 50 guests RSVP tracking",
      "25 high-resolution photography uploads",
      "Digital meal & plus-one selections",
      "Curated external registry links",
      "Mobile-first responsive layout",
      "100% Ad-free guest experience",
    ],
    cta: "Start Free Atelier",
    href: "/auth/signup",
    featured: false,
  },
  {
    name: "Signature Premium",
    id: "tier-premium",
    priceMonthly: "$14.99",
    billingPeriod: "per month",
    description: "The complete planning suite with your own custom domain and unlimited guests.",
    features: [
      "Connect your custom domain (e.g. julianandgenevieve.com)",
      "Automatic SSL certificates & edge caching",
      "Unlimited guests & RSVP responses",
      "Up to 500 gallery photos with guest drop",
      "Interactive 3D seating chart & table studio",
      "Wedding day timeline with Google Maps sync",
      "Remove EverAfter branding badge",
      "Export guest manifests to Excel & CSV",
      "Priority atelier concierge support",
    ],
    cta: "Begin Signature Trial",
    href: "/auth/signup?plan=premium",
    featured: true,
  },
  {
    name: "Planner Pro",
    id: "tier-planner",
    priceMonthly: "$49.99",
    billingPeriod: "per month",
    description: "Designed for luxury wedding coordinators managing multiple couples simultaneously.",
    features: [
      "Manage unlimited active client couples in one dashboard",
      "Seamless multi-tenant client workspace switching",
      "Full access to all Signature features for all clients",
      "Unlimited guest count and photo storage",
      "White-label options and custom agency branding",
      "Collaborative partner and couple permissions",
      "Centralized caterer and vendor export tools",
      "Dedicated account manager & priority assistance",
    ],
    cta: "Start Planner Trial",
    href: "/auth/signup?plan=planner",
    featured: false,
  },
];

const FAQS = [
  {
    question: "Can I start for free and upgrade when ready?",
    answer:
      "Yes. You can begin on our Free Atelier tier with zero credit card required. When you need custom domain support, table seating charts, or unlimited guests, you can upgrade seamlessly without losing any content, RSVPs, or uploaded media.",
  },
  {
    question: "How do custom domains work with EverAfter?",
    answer:
      "On the Signature Premium plan, you can connect any custom domain you own (e.g., sophiaandlucas.com). Our edge infrastructure handles SSL provisioning, DNS routing, and global caching automatically at no extra charge.",
  },
  {
    question: "Will my guests see any advertisements?",
    answer:
      "Never. We uphold strict atelier standards. EverAfter is 100% ad-free across all tiers, ensuring your intimate love story and memories are never compromised by third-party banners or popups.",
  },
  {
    question: "Can guests RSVP easily on mobile phones?",
    answer:
      "Absolutely. EverAfter is engineered mobile-first. Your guests can open your link, confirm their attendance, select their dietary courses, and leave song requests in under 60 seconds without downloading an application.",
  },
  {
    question: "What is your cancellation and billing policy?",
    answer:
      "You can cancel your subscription at any time directly from your billing workspace. Your website will remain published and fully functional through the end of your prepaid billing period.",
  },
];

export default function PricingPage() {
  return (
    <div className="bg-neutral-surface py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold uppercase tracking-widest text-primary-deep mb-4">
            <Sparkles className="h-3.5 w-3.5" />
            Transparent Atelier Investment
          </span>
          <h1 className="font-display text-4xl sm:text-6xl font-bold tracking-tight text-neutral-dark">
            Simple, honest plans for every love story.
          </h1>
          <p className="mt-4 text-base sm:text-lg text-neutral-mid leading-relaxed font-light">
            Whether you are curating an intimate garden gathering or coordinating dozens of high-profile weddings as an event coordinator, EverAfter provides the architectural tools you need.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="isolate mx-auto mt-16 grid max-w-md grid-cols-1 gap-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {TIERS.map((tier) => (
            <div
              key={tier.id}
              className={`rounded-3xl p-8 sm:p-10 border transition-all duration-300 flex flex-col justify-between ${
                tier.featured
                  ? "bg-white border-primary shadow-3d-floating relative ring-1 ring-primary/30"
                  : "bg-white border-border/80 shadow-3d-card hover:border-primary/40"
              }`}
            >
              {tier.featured && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-primary to-primary-dark px-4 py-1 text-[11px] font-semibold text-white uppercase tracking-wider shadow-soft-sm">
                  Most Requested Tier
                </div>
              )}

              <div>
                <h3 className="font-display text-2xl font-bold text-neutral-dark">
                  {tier.name}
                </h3>
                <p className="mt-3 text-xs leading-relaxed text-neutral-mid min-h-[36px]">
                  {tier.description}
                </p>

                <div className="mt-6 flex items-baseline gap-x-1 border-b border-border/80 pb-6">
                  <span className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-neutral-dark">
                    {tier.priceMonthly}
                  </span>
                  {tier.billingPeriod && (
                    <span className="text-xs font-medium uppercase tracking-wider text-neutral-mid">
                      /{tier.billingPeriod}
                    </span>
                  )}
                </div>

                <ul role="list" className="mt-8 space-y-3.5 text-xs sm:text-sm text-neutral-dark">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex gap-x-3 items-start">
                      <Check className="h-4 w-4 flex-none text-primary-deep mt-0.5" aria-hidden="true" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-10">
                <Button
                  variant={tier.featured ? "primary" : "secondary"}
                  className="w-full py-5 text-xs uppercase tracking-widest font-semibold shadow-soft-md"
                  size="lg"
                  asChild
                >
                  <Link href={tier.href}>
                    {tier.cta}
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Guarantees Strip */}
        <div className="mt-16 p-6 rounded-2xl bg-white border border-border/80 shadow-soft-sm max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-around gap-4 text-xs text-neutral-dark font-medium">
          <span className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            100% Ad-Free Guarantee
          </span>
          <span className="hidden sm:inline text-border">•</span>
          <span className="flex items-center gap-2">
            <Heart className="h-4 w-4 text-primary-deep" />
            Zero Setup Fees
          </span>
          <span className="hidden sm:inline text-border">•</span>
          <span className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary-deep" />
            Cancel Anytime Online
          </span>
        </div>

        {/* FAQs */}
        <div className="mx-auto max-w-3xl divide-y divide-border/80 mt-28">
          <h2 className="font-display text-2xl sm:text-4xl font-bold tracking-tight text-neutral-dark text-center mb-10">
            Frequently Asked Questions
          </h2>
          <dl className="space-y-6 divide-y divide-border/80">
            {FAQS.map((faq) => (
              <div key={faq.question} className="pt-6">
                <dt className="text-base font-bold text-neutral-dark flex items-center gap-2.5">
                  <HelpCircle className="h-4 w-4 text-primary-deep shrink-0" />
                  {faq.question}
                </dt>
                <dd className="mt-2 text-sm leading-relaxed text-neutral-mid pl-7 font-light">
                  {faq.answer}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}
