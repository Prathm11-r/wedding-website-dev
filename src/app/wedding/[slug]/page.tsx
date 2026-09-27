import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { SectionRenderer } from "@/components/sections/SectionRenderer";
import { DEFAULT_PAGE_SECTIONS, type PageSectionModel } from "@/types/builder";
import type { TableRow } from "@/types/database";
import { formatDate } from "@/lib/utils";
import { Heart, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface WeddingPageProps {
  params: {
    slug: string;
  };
}

export default async function WeddingPublicPage({ params }: WeddingPageProps) {
  const { slug } = params;
  const supabase = await createClient();

  // Fetch published wedding by slug
  const { data: rawWedding, error } = await supabase
    .from("weddings")
    .select("*")
    .eq("slug", slug)
    .single();

  const wedding = rawWedding as unknown as TableRow<"weddings"> | null;

  // If in local development or wedding not found, provide the full interactive preview
  if (error || !wedding) {
    return (
      <div className="min-h-screen bg-neutral-surface text-neutral-dark font-sans selection:bg-primary/20 selection:text-primary-deep">
        {/* Luxury Top Bar */}
        <header className="border-b border-border/60 bg-white/80 backdrop-blur-md px-6 py-3.5 sticky top-0 z-40">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <Link
              href="/"
              className="flex items-center gap-2 font-display font-semibold text-lg tracking-wider text-neutral-dark hover:text-primary-deep transition-colors"
            >
              <div className="h-7 w-7 rounded-full bg-gradient-to-br from-[#ECC880] to-[#9F7A38] p-[1px] flex items-center justify-center text-[10px] text-white font-bold">
                EA
              </div>
              <span className="font-display">EverAfter</span>
            </Link>

            <div className="flex items-center gap-3">
              <span className="text-[11px] uppercase tracking-widest px-3 py-1 rounded-full bg-primary/10 text-primary-deep font-semibold border border-primary/20">
                Interactive Preview
              </span>
              <Button size="sm" asChild className="hidden sm:inline-flex shadow-soft-sm text-xs">
                <Link href={`/wedding/${slug}/rsvp`}>RSVP Online</Link>
              </Button>
            </div>
          </div>
        </header>

        <main>
          <SectionRenderer
            sections={DEFAULT_PAGE_SECTIONS}
            weddingSlug={slug}
          />
        </main>

        <footer className="border-t border-border/60 py-12 text-center text-xs text-neutral-mid bg-white">
          <p className="flex items-center justify-center gap-1.5 mb-2">
            Crafted with love for Sarah & James
          </p>
          <p>
            Powered by{" "}
            <Link href="/" className="font-semibold text-primary-deep hover:underline">
              EverAfter Wedding Atelier & SaaS
            </Link>
          </p>
        </footer>
      </div>
    );
  }

  // If wedding exists, fetch custom page sections or construct default sections from wedding record
  const coupleNames = `${wedding.partner_one_name} & ${wedding.partner_two_name}`;
  const weddingDateText = wedding.wedding_date ? formatDate(wedding.wedding_date) : undefined;

  const sections: PageSectionModel[] = [
    {
      id: "sec-hero",
      type: "hero",
      sort_order: 0,
      is_visible: true,
      props: {
        headline: coupleNames,
        subheadline: "We are getting married!",
        date_text: weddingDateText,
        location_text: wedding.location ?? undefined,
        image_url: wedding.cover_image_url ?? undefined,
        cta_text: "RSVP Now",
        cta_link: `/wedding/${slug}/rsvp`,
      },
    },
    ...(wedding.wedding_date
      ? [
          {
            id: "sec-countdown",
            type: "countdown" as const,
            sort_order: 1,
            is_visible: true,
            props: {
              heading: "Counting Down The Moments",
              subheading: "Until we exchange our forever vows",
              target_date: new Date(wedding.wedding_date).toISOString(),
            },
          },
        ]
      : []),
    {
      id: "sec-story",
      type: "our_story",
      sort_order: 2,
      is_visible: true,
      props: {
        heading: "Our Love Story",
        subheading: "How forever began",
        body: wedding.short_description || "Welcome to our wedding website! We are thrilled to celebrate our love and commitment surrounded by the people who mean the world to us.",
      },
    },
    {
      id: "sec-schedule",
      type: "schedule",
      sort_order: 3,
      is_visible: true,
      props: {
        heading: "Order of Events",
        subheading: "Celebrate every milestone with us",
        events: [
          {
            id: "ev-1",
            title: "The Ceremony",
            time: "4:00 PM",
            location: wedding.location ?? "Main Lawn",
            dress_code: "Black Tie Optional",
          },
          {
            id: "ev-2",
            title: "Cocktails & Dinner",
            time: "6:00 PM",
            location: wedding.location ?? "Grand Pavilion",
            dress_code: "Black Tie Optional",
          },
        ],
      },
    },
    {
      id: "sec-gallery",
      type: "gallery",
      sort_order: 4,
      is_visible: true,
      props: {
        heading: "Captured Memories",
        subheading: "Our favorite moments together",
        images: [],
      },
    },
    {
      id: "sec-rsvp",
      type: "rsvp",
      sort_order: 5,
      is_visible: true,
      props: {
        heading: "Celebrate With Us",
        subheading: "Please confirm your attendance",
        deadline_text: wedding.rsvp_deadline ? formatDate(wedding.rsvp_deadline) : undefined,
        allow_plus_ones: true,
        meal_options: ["Filet Mignon", "Wild Mushroom Risotto", "Chilean Sea Bass"],
      },
    },
  ];

  return (
    <div className="min-h-screen bg-neutral-surface text-neutral-dark font-sans selection:bg-primary/20 selection:text-primary-deep">
      <header className="border-b border-border/60 bg-white/80 backdrop-blur-md px-6 py-3.5 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <span className="font-display font-semibold text-lg tracking-wider text-neutral-dark">
            {coupleNames}
          </span>

          <Button size="sm" asChild className="shadow-soft-sm text-xs">
            <Link href={`/wedding/${slug}/rsvp`}>RSVP Online</Link>
          </Button>
        </div>
      </header>

      <main>
        <SectionRenderer sections={sections} weddingSlug={slug} />
      </main>

      <footer className="border-t border-border/60 py-12 text-center text-xs text-neutral-mid bg-white">
        <p className="flex items-center justify-center gap-1 mb-2">
          Made with <Heart className="h-3.5 w-3.5 fill-red-400 text-red-400" /> for {coupleNames}
        </p>
        <p>
          Powered by{" "}
          <Link href="/" className="font-semibold text-primary-deep hover:underline">
            EverAfter
          </Link>
        </p>
      </footer>
    </div>
  );
}
