import { notFound } from "next/navigation";
import Link from "next/link";
import { Calendar, MapPin, Heart, Clock, Gift, Images, Sparkles, Check } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import type { TableRow } from "@/types/database";

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

  if (error || !wedding) {
    // If running in development with mock/unseeded data, render preview placeholder
    return (
      <div className="min-h-screen bg-[#FBF9F5] text-neutral-900 font-sans selection:bg-[#C9A96E]/20">
        <header className="border-b border-border/40 bg-white/70 backdrop-blur px-6 py-4 sticky top-0 z-40">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <span className="font-display font-semibold text-lg tracking-wider text-primary-dark">
              EverAfter Wedding Preview
            </span>
            <span className="text-xs uppercase tracking-widest px-2.5 py-1 rounded-full bg-primary/10 text-primary-dark border border-primary/20">
              Demo Preview
            </span>
          </div>
        </header>

        <main className="max-w-3xl mx-auto px-6 py-16 sm:py-24 text-center">
          <div className="inline-flex items-center justify-center p-3 rounded-full bg-primary/10 text-primary mb-6">
            <Heart className="h-6 w-6 fill-primary" />
          </div>

          <h1 className="font-display text-4xl sm:text-6xl font-bold tracking-tight text-neutral-dark mb-4">
            Sarah & James
          </h1>

          <p className="text-lg sm:text-xl text-neutral-mid mb-8 font-light italic">
            Are getting married!
          </p>

          <div className="flex flex-wrap items-center justify-center gap-6 py-6 border-y border-border/80 my-8 text-sm sm:text-base text-neutral-dark">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              <span>Saturday, June 19, 2027</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              <span>St. Helena Valley, Napa California</span>
            </div>
          </div>

          <p className="text-neutral-mid leading-relaxed max-w-xl mx-auto mb-10 text-base">
            We are overjoyed to celebrate our union surrounded by our beloved family and friends.
            Please join us for an evening of dinner, dancing, and lasting memories.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="w-full sm:w-auto px-8 py-3 text-base" asChild>
              <Link href={`/wedding/${slug}/rsvp`}>
                RSVP for the Celebration
              </Link>
            </Button>
          </div>

          {/* Quick Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-16 text-left">
            <div className="bg-white p-6 rounded-2xl border border-border shadow-soft-sm">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4">
                <Clock className="h-5 w-5" />
              </div>
              <h3 className="font-display font-semibold text-lg mb-1">Ceremony & Reception</h3>
              <p className="text-sm text-neutral-mid">Ceremony begins promptly at 4:30 PM. Cocktail hour and dinner reception to follow.</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-border shadow-soft-sm">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4">
                <Gift className="h-5 w-5" />
              </div>
              <h3 className="font-display font-semibold text-lg mb-1">Gift Registry</h3>
              <p className="text-sm text-neutral-mid">Your presence is our present. For those wishing to honor us with a gift, registry links are available.</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-border shadow-soft-sm">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4">
                <Images className="h-5 w-5" />
              </div>
              <h3 className="font-display font-semibold text-lg mb-1">Photo Sharing</h3>
              <p className="text-sm text-neutral-mid">Capture your favorite moments during our day and upload them directly to our shared guest album.</p>
            </div>
          </div>
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

  const coupleNames = `${wedding.partner_one_name} & ${wedding.partner_two_name}`;

  return (
    <div className="min-h-screen bg-[#FBF9F5] text-neutral-900 font-sans selection:bg-[#C9A96E]/20">
      <main className="max-w-3xl mx-auto px-6 py-16 sm:py-24 text-center">
        <div className="inline-flex items-center justify-center p-3 rounded-full bg-primary/10 text-primary mb-6">
          <Heart className="h-6 w-6 fill-primary" />
        </div>

        <h1 className="font-display text-4xl sm:text-6xl font-bold tracking-tight text-neutral-dark mb-4">
          {coupleNames}
        </h1>

        {wedding.short_description && (
          <p className="text-lg sm:text-xl text-neutral-mid mb-8 font-light italic">
            {wedding.short_description}
          </p>
        )}

        <div className="flex flex-wrap items-center justify-center gap-6 py-6 border-y border-border/80 my-8 text-sm sm:text-base text-neutral-dark">
          {wedding.wedding_date && (
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              <span>{formatDate(wedding.wedding_date)}</span>
            </div>
          )}
          {wedding.location && (
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              <span>{wedding.location}</span>
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
          <Button size="lg" className="w-full sm:w-auto px-8 py-3 text-base" asChild>
            <Link href={`/wedding/${slug}/rsvp`}>
              RSVP for the Celebration
            </Link>
          </Button>
        </div>
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
