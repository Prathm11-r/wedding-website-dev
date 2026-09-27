"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Heart, CheckCircle2, ArrowLeft, Loader2, Utensils, Music, Users, Sparkles, Send } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PublicRsvpPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [fullName, setFullName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [status, setStatus] = React.useState<"attending" | "declined">("attending");
  const [selectedCourse, setSelectedCourse] = React.useState<string>("Filet Mignon");
  const [plusOnes, setPlusOnes] = React.useState("0");
  const [dietaryRestrictions, setDietaryRestrictions] = React.useState("");
  const [songRequest, setSongRequest] = React.useState("");

  const [isLoading, setIsLoading] = React.useState(false);
  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName) return;

    setIsLoading(true);
    setErrorMessage(null);

    try {
      // Simulate network request to Supabase API
      await new Promise((resolve) => setTimeout(resolve, 800));
      setIsSubmitted(true);
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to submit RSVP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-neutral-surface flex flex-col justify-center items-center px-6 py-16">
        <div className="max-w-md w-full bg-white p-10 rounded-3xl border border-[#DFB76C]/40 shadow-3d-floating text-center">
          <div className="h-16 w-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-200 shadow-soft-sm">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <span className="text-[11px] uppercase tracking-widest text-primary-deep font-semibold block mb-1">
            Confirmed with Honour
          </span>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-neutral-dark mb-3">
            RSVP Confirmed!
          </h1>
          <p className="text-neutral-mid text-sm leading-relaxed mb-8">
            Thank you, <strong className="text-neutral-dark">{fullName}</strong>. Your response has been securely recorded.
            {status === "attending"
              ? " We look forward to celebrating this sacred milestone together!"
              : " We will miss your company, but thank you for your kind wishes."}
          </p>

          <Button variant="outline" className="w-full text-xs font-semibold py-5" asChild>
            <Link href={`/wedding/${slug}`}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Return to Wedding Website
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-surface py-16 px-6">
      <div className="max-w-xl mx-auto">
        <div className="mb-8">
          <Link
            href={`/wedding/${slug}`}
            className="inline-flex items-center text-xs font-semibold tracking-wider text-primary-deep hover:underline uppercase"
          >
            <ArrowLeft className="h-3.5 w-3.5 mr-1.5" />
            Back to Celebration Page
          </Link>
        </div>

        <div className="bg-white p-8 sm:p-12 rounded-3xl border border-[#DFB76C]/40 shadow-3d-card relative">
          {/* Subtle deckle border */}
          <div className="absolute inset-2 rounded-2xl border border-dashed border-[#DFB76C]/25 pointer-events-none" />

          {/* Intaglio Monogram Wax Seal */}
          <div className="flex justify-center -mt-4 mb-6">
            <div
              className="relative h-14 w-14 rounded-full flex items-center justify-center shadow-wax-seal"
              style={{
                background: "radial-gradient(circle at 35% 35%, #F4EBD9 0%, #C9A96E 50%, #8A6424 100%)",
              }}
            >
              <div className="w-11 h-11 rounded-full border border-white/40 flex items-center justify-center p-1">
                <span className="font-display font-bold text-xs tracking-wider text-[#2B1D08]">
                  RSVP
                </span>
              </div>
            </div>
          </div>

          <div className="text-center mb-8">
            <span className="text-xs uppercase tracking-[0.2em] text-primary-deep font-semibold block mb-1">
              Kindly Respond
            </span>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-neutral-dark">
              Celebrate With Us
            </h1>
            <p className="text-xs sm:text-sm text-neutral-mid mt-2 font-light max-w-sm mx-auto">
              Please share your attendance and dining choices below.
            </p>
          </div>

          {errorMessage && (
            <div className="mb-6 rounded-xl bg-red-50 p-4 text-xs text-red-800 border border-red-200">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-xs font-semibold uppercase tracking-wider text-neutral-dark mb-1.5">
                Your Full Name *
              </label>
              <input
                id="name"
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Lord / Lady / Guest Name"
                className="w-full rounded-xl border border-border px-4 py-2.5 text-neutral-dark placeholder:text-neutral-mid/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-sm bg-neutral-surface"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-neutral-dark mb-1.5">
                Email Address (For Calendar Invite)
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="guest@example.com"
                className="w-full rounded-xl border border-border px-4 py-2.5 text-neutral-dark placeholder:text-neutral-mid/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-sm bg-neutral-surface"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-dark mb-2">
                Will You Attend? *
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setStatus("attending")}
                  className={`py-3 px-4 rounded-xl text-xs sm:text-sm font-semibold border text-center transition-all ${
                    status === "attending"
                      ? "border-primary bg-primary/10 text-primary-deep ring-1 ring-primary shadow-soft-sm"
                      : "border-border hover:bg-neutral-light text-neutral-mid"
                  }`}
                >
                  Accepts with Pleasure
                </button>
                <button
                  type="button"
                  onClick={() => setStatus("declined")}
                  className={`py-3 px-4 rounded-xl text-xs sm:text-sm font-semibold border text-center transition-all ${
                    status === "declined"
                      ? "border-neutral-dark bg-neutral-dark text-white shadow-soft-sm"
                      : "border-border hover:bg-neutral-light text-neutral-mid"
                  }`}
                >
                  Declines with Regret
                </button>
              </div>
            </div>

            {status === "attending" && (
              <>
                {/* Culinary Selection */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-dark mb-2 flex items-center gap-1.5">
                    <Utensils className="h-3.5 w-3.5 text-primary-deep" />
                    Curated Banquet Course Selection
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {["Filet Mignon", "Wild Mushroom Risotto (V)", "Pan-Seared Sea Bass"].map((course) => (
                      <button
                        key={course}
                        type="button"
                        onClick={() => setSelectedCourse(course)}
                        className={`p-2.5 rounded-xl text-left text-xs font-medium border transition-colors flex flex-col justify-between ${
                          selectedCourse === course
                            ? "bg-primary/10 border-primary text-primary-deep font-semibold"
                            : "bg-neutral-surface border-border text-neutral-mid hover:text-neutral-dark"
                        }`}
                      >
                        <span>{course}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label htmlFor="plusOnes" className="block text-xs font-semibold uppercase tracking-wider text-neutral-dark mb-1.5">
                    Additional Guests (Plus-Ones)
                  </label>
                  <select
                    id="plusOnes"
                    value={plusOnes}
                    onChange={(e) => setPlusOnes(e.target.value)}
                    className="w-full rounded-xl border border-border px-4 py-2.5 text-neutral-dark focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-sm bg-neutral-surface"
                  >
                    <option value="0">Solo (0 plus-ones)</option>
                    <option value="1">+1 Guest Companion</option>
                    <option value="2">+2 Family Members</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="dietary" className="block text-xs font-semibold uppercase tracking-wider text-neutral-dark mb-1.5">
                    Dietary Requirements or Allergies
                  </label>
                  <textarea
                    id="dietary"
                    rows={2}
                    value={dietaryRestrictions}
                    onChange={(e) => setDietaryRestrictions(e.target.value)}
                    placeholder="e.g. Nut allergy, Gluten sensitivity, Dairy-free..."
                    className="w-full rounded-xl border border-border px-4 py-2 text-neutral-dark placeholder:text-neutral-mid/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-xs bg-neutral-surface resize-none"
                  />
                </div>

                <div>
                  <label htmlFor="song" className="block text-xs font-semibold uppercase tracking-wider text-neutral-dark mb-1.5">
                    Song Request for Midnight Revelry
                  </label>
                  <input
                    id="song"
                    type="text"
                    value={songRequest}
                    onChange={(e) => setSongRequest(e.target.value)}
                    placeholder="Artist — Track Title"
                    className="w-full rounded-xl border border-border px-4 py-2.5 text-neutral-dark placeholder:text-neutral-mid/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-xs bg-neutral-surface"
                  />
                </div>
              </>
            )}

            <Button
              type="submit"
              className="w-full py-6 text-xs uppercase tracking-widest font-semibold shadow-soft-xl shadow-primary/25"
              size="lg"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Recording RSVP Response...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Submit RSVP Response
                </>
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
