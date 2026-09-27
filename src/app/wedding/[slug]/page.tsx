import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { SectionRenderer } from "@/components/sections/SectionRenderer";
import { DEFAULT_PAGE_SECTIONS, type PageSectionModel } from "@/types/builder";
import type { TableRow } from "@/types/database";
import { formatDate } from "@/lib/utils";

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
      <div className="min-h-screen bg-[#FBF9F5] text-neutral-900 font-sans selection:bg-[#C9A96E]/20">
        <header className="border-b border-border/40 bg-white/80 backdrop-blur px-6 py-3.5 sticky top-0 z-40">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <Link
              href="/"
              className="font-display font-semibold text-lg tracking-wider text-neutral-dark hover:text-primary transition-colors"
            >
              EverAfter
            </Link>
            <span className="text-xs uppercase tracking-widest px-3 py-1 rounded-full bg-primary/10 text-primary-dark font-medium border border-primary/20">
              Interactive Preview Mode
            </span>
          </div>
        </header>

        <main>
          <SectionRenderer
            sections={DEFAULT_PAGE_SECTIONS}
            weddingSlug={slug}
          />
        </main>

        <footer className="border-t border-border/40 py-8 text-center text-xs text-neutral-mid">
          Powered by{" "}
          <Link href="/" className="font-medium text-primary hover:underline">
            EverAfter Wedding SaaS
          </Link>
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
        subheadline: "We're getting married!",
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
              subheading: "Until we say I do",
              target_date: new Date(wedding.wedding_date).toISOString(),
            },
          },
        ]
      : []),
    {
      id: "sec-story",
      type: "our_story",
      sort_order: 2,
      is_visible: Boolean(wedding.short_description),
      props: {
        heading: "Our Story",
        subheading: "How forever began",
        body: wedding.short_description || "Welcome to our wedding website! We are thrilled to celebrate with you.",
      },
    },
    {
      id: "sec-rsvp",
      type: "rsvp",
      sort_order: 3,
      is_visible: true,
      props: {
        heading: "Celebrate With Us",
        subheading: "Please let us know if you can make it",
        deadline_text: wedding.rsvp_deadline ? formatDate(wedding.rsvp_deadline) : undefined,
        allow_plus_ones: true,
        meal_options: ["Standard", "Vegetarian", "Vegan", "Gluten Free"],
      },
    },
  ];

  return (
    <div className="min-h-screen bg-[#FBF9F5] text-neutral-900 font-sans selection:bg-[#C9A96E]/20">
      <main>
        <SectionRenderer sections={sections} weddingSlug={slug} />
      </main>

      <footer className="border-t border-border/40 py-8 text-center text-xs text-neutral-mid">
        Powered by{" "}
        <Link href="/" className="font-medium text-primary hover:underline">
          EverAfter
        </Link>
      </footer>
    </div>
  );
}
