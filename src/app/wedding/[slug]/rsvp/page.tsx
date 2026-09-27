"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Heart, CheckCircle2, ArrowLeft, Loader2, Utensils, Music, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PublicRsvpPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [fullName, setFullName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [status, setStatus] = React.useState<"attending" | "declined">("attending");
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
      // In production this calls /api/rsvp or a server action
      // Simulate submission network call
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
      <div className="min-h-screen bg-[#FBF9F5] flex flex-col justify-center items-center px-6 py-12">
        <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-border shadow-soft-md text-center">
          <div className="h-16 w-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-200">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <h1 className="font-display text-2xl font-bold text-neutral-dark mb-2">
            RSVP Received!
          </h1>
          <p className="text-neutral-mid text-sm mb-6">
            Thank you, <strong className="text-neutral-dark">{fullName}</strong>. Your response has been recorded.
            {status === "attending"
              ? " We cannot wait to celebrate together!"
              : " We will miss you, but thank you for letting us know."}
          </p>

          <Button variant="outline" className="w-full" asChild>
            <Link href={`/wedding/${slug}`}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Return to wedding website
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FBF9F5] py-12 px-6">
      <div className="max-w-lg mx-auto">
        <div className="mb-6">
          <Link
            href={`/wedding/${slug}`}
            className="inline-flex items-center text-sm font-medium text-neutral-mid hover:text-neutral-dark"
          >
            <ArrowLeft className="h-4 w-4 mr-1.5" />
            Back to wedding page
          </Link>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-border shadow-soft-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center p-2.5 rounded-full bg-primary/10 text-primary mb-3">
              <Heart className="h-5 w-5 fill-primary" />
            </div>
            <h1 className="font-display text-2xl font-bold text-neutral-dark">
              Celebrate With Us
            </h1>
            <p className="text-sm text-neutral-mid mt-1">
              Please RSVP by confirming your details below.
            </p>
          </div>

          {errorMessage && (
            <div className="mb-6 rounded-lg bg-red-50 p-4 text-sm text-red-800 border border-red-200">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-neutral-dark">
                Your Full Name *
              </label>
              <input
                id="name"
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Jane Doe"
                className="mt-1.5 block w-full rounded-lg border border-border px-3.5 py-2.5 text-neutral-dark placeholder:text-neutral-mid/60 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-sm"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-neutral-dark">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jane@example.com"
                className="mt-1.5 block w-full rounded-lg border border-border px-3.5 py-2.5 text-neutral-dark placeholder:text-neutral-mid/60 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-dark mb-2">
                Will you be attending? *
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setStatus("attending")}
                  className={`py-3 px-4 rounded-xl text-sm font-medium border text-center transition-all ${
                    status === "attending"
                      ? "border-primary bg-primary/10 text-primary-dark font-semibold ring-1 ring-primary"
                      : "border-border hover:bg-neutral-light text-neutral-mid"
                  }`}
                >
                  Joyfully Accepts
                </button>
                <button
                  type="button"
                  onClick={() => setStatus("declined")}
                  className={`py-3 px-4 rounded-xl text-sm font-medium border text-center transition-all ${
                    status === "declined"
                      ? "border-neutral-dark bg-neutral-dark text-white font-semibold"
                      : "border-border hover:bg-neutral-light text-neutral-mid"
                  }`}
                >
                  Regretfully Declines
                </button>
              </div>
            </div>

            {status === "attending" && (
              <>
                <div>
                  <label htmlFor="plusOnes" className="block text-sm font-medium text-neutral-dark">
                    Additional Guests (Plus-ones)
                  </label>
                  <select
                    id="plusOnes"
                    value={plusOnes}
                    onChange={(e) => setPlusOnes(e.target.value)}
                    className="mt-1.5 block w-full rounded-lg border border-border px-3.5 py-2.5 text-neutral-dark focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-sm bg-white"
                  >
                    <option value="0">Just me (0 guests)</option>
                    <option value="1">+1 Guest</option>
                    <option value="2">+2 Guests</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="dietary" className="block text-sm font-medium text-neutral-dark">
                    Dietary Requirements or Allergies
                  </label>
                  <textarea
                    id="dietary"
                    rows={2}
                    value={dietaryRestrictions}
                    onChange={(e) => setDietaryRestrictions(e.target.value)}
                    placeholder="e.g. Vegetarian, Nut allergy, Gluten-free..."
                    className="mt-1.5 block w-full rounded-lg border border-border px-3.5 py-2.5 text-neutral-dark placeholder:text-neutral-mid/60 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-sm resize-none"
                  />
                </div>

                <div>
                  <label htmlFor="song" className="block text-sm font-medium text-neutral-dark">
                    Song Request for the Dance Floor
                  </label>
                  <input
                    id="song"
                    type="text"
                    value={songRequest}
                    onChange={(e) => setSongRequest(e.target.value)}
                    placeholder="Artist - Song Title"
                    className="mt-1.5 block w-full rounded-lg border border-border px-3.5 py-2.5 text-neutral-dark placeholder:text-neutral-mid/60 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-sm"
                  />
                </div>
              </>
            )}

            <Button
              type="submit"
              className="w-full mt-6"
              size="lg"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting RSVP...
                </>
              ) : (
                "Submit Response"
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
