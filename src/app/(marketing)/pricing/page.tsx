import Link from "next/link";
import { Check, HelpCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const TIERS = [
  {
    name: "Free",
    id: "tier-free",
    priceMonthly: "$0",
    description: "Everything you need to launch a beautiful wedding website and gather RSVPs.",
    features: [
      "Personalized subdomain (name.everafter.com)",
      "Up to 50 guests RSVP tracking",
      "25 high-resolution photos",
      "Digital meal & plus-one selections",
      "External registry links",
      "Standard mobile-friendly themes",
    ],
    cta: "Get started for free",
    href: "/auth/signup",
    featured: false,
  },
  {
    name: "Premium",
    id: "tier-premium",
    priceMonthly: "$14.99",
    billingPeriod: "per month",
    description: "The complete planning suite with your own custom domain and unlimited guests.",
    features: [
      "Connect your own custom domain (e.g. johnandjane.com)",
      "Unlimited guests & RSVP responses",
      "Up to 500 gallery photos",
      "Interactive seating chart & table planner",
      "Wedding day timeline for guests",
      "Remove EverAfter branding badge",
      "Export guest lists to CSV/Excel",
      "Priority customer support",
    ],
    cta: "Upgrade to Premium",
    href: "/auth/signup?plan=premium",
    featured: true,
  },
  {
    name: "Planner Pro",
    id: "tier-planner",
    priceMonthly: "$49.99",
    billingPeriod: "per month",
    description: "Designed for professional wedding coordinators managing multiple couples.",
    features: [
      "Manage unlimited active weddings in one dashboard",
      "Switch between client workspaces seamlessly",
      "Full access to all Premium features for all clients",
      "Unlimited guest count and photo storage",
      "White-label options and custom branding",
      "Collaborative partner and client permissions",
      "Dedicated planner onboarding & priority assistance",
    ],
    cta: "Start Planner Trial",
    href: "/auth/signup?plan=planner",
    featured: false,
  },
];

const FAQS = [
  {
    question: "Can I start for free and upgrade later?",
    answer:
      "Yes. You can begin on our Free plan with zero credit card required. When you need custom domain support or unlimited guests, you can upgrade seamlessly without losing any content or RSVPs.",
  },
  {
    question: "How do custom domains work?",
    answer:
      "On the Premium plan, you can easily connect any domain you own (e.g., alexandtaylor.com) with simple DNS instructions. We handle SSL certificates automatically at no extra charge.",
  },
  {
    question: "Can my guests RSVP from mobile phones?",
    answer:
      "Absolutely. EverAfter is designed mobile-first. Your guests can open your link, search for their name, and submit their attendance and dietary choices in seconds without downloading an app.",
  },
  {
    question: "What is the refund and cancellation policy?",
    answer:
      "You can cancel your subscription at any time directly from your billing settings. Your wedding website remains live through the end of your billing cycle.",
  },
];

export default function PricingPage() {
  return (
    <div className="bg-background py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-base font-semibold leading-7 text-primary-dark">Pricing</h2>
          <p className="mt-2 font-display text-4xl font-bold tracking-tight text-neutral-dark sm:text-5xl">
            Simple, transparent plans for every celebration
          </p>
          <p className="mt-6 text-lg leading-8 text-neutral-mid">
            Whether you are organizing an intimate gathering or coordinating multiple clients as a professional planner, EverAfter provides the tools you need.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="isolate mx-auto mt-16 grid max-w-md grid-cols-1 gap-y-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3 lg:gap-x-8">
          {TIERS.map((tier) => (
            <div
              key={tier.id}
              className={`rounded-3xl p-8 ring-1 xl:p-10 flex flex-col justify-between ${
                tier.featured
                  ? "bg-white ring-2 ring-primary shadow-soft-xl relative"
                  : "bg-white/60 ring-border"
              }`}
            >
              {tier.featured && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1 text-xs font-semibold text-white uppercase tracking-wider">
                  Most Popular
                </div>
              )}

              <div>
                <div className="flex items-center justify-between gap-x-4">
                  <h3 className="font-display text-2xl font-bold text-neutral-dark">
                    {tier.name}
                  </h3>
                </div>
                <p className="mt-4 text-sm leading-6 text-neutral-mid min-h-[48px]">
                  {tier.description}
                </p>
                <div className="mt-6 flex items-baseline gap-x-1">
                  <span className="font-display text-4xl font-bold tracking-tight text-neutral-dark">
                    {tier.priceMonthly}
                  </span>
                  {tier.billingPeriod && (
                    <span className="text-sm font-semibold leading-6 text-neutral-mid">
                      /{tier.billingPeriod}
                    </span>
                  )}
                </div>

                <ul role="list" className="mt-8 space-y-3 text-sm leading-6 text-neutral-dark">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex gap-x-3 items-start">
                      <Check className="h-5 w-5 flex-none text-primary mt-0.5" aria-hidden="true" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-10">
                <Button
                  variant={tier.featured ? "primary" : "secondary"}
                  className="w-full"
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

        {/* FAQs */}
        <div className="mx-auto max-w-4xl divide-y divide-border mt-24">
          <h3 className="font-display text-2xl font-bold leading-10 tracking-tight text-neutral-dark text-center mb-8">
            Frequently Asked Questions
          </h3>
          <dl className="mt-10 space-y-6 divide-y divide-border">
            {FAQS.map((faq) => (
              <div key={faq.question} className="pt-6">
                <dt className="text-lg font-semibold leading-7 text-neutral-dark flex items-center gap-2">
                  <HelpCircle className="h-5 w-5 text-primary flex-shrink-0" />
                  {faq.question}
                </dt>
                <dd className="mt-2 text-base leading-7 text-neutral-mid pl-7">
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
