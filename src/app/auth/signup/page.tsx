"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Heart, ArrowRight, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

function SignupForm() {
  const searchParams = useSearchParams();
  const plan = searchParams.get("plan");

  const [email, setEmail] = React.useState("");
  const [partnerNames, setPartnerNames] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = React.useState(false);
  const [message, setMessage] = React.useState<{ type: "success" | "error"; text: string } | null>(null);

  const supabase = createClient();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    setMessage(null);

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?next=/dashboard/onboarding`,
          data: {
            full_name: partnerNames || undefined,
            selected_plan: plan || "free",
          },
        },
      });

      if (error) {
        setMessage({ type: "error", text: error.message });
      } else {
        setMessage({
          type: "success",
          text: "We just emailed you a secure link to create your account! Click the link to begin setting up your wedding website.",
        });
      }
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "An unexpected error occurred." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setIsGoogleLoading(true);
    setMessage(null);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=/dashboard/onboarding`,
        },
      });

      if (error) {
        setMessage({ type: "error", text: error.message });
        setIsGoogleLoading(false);
      }
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "Could not sign up with Google." });
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col justify-center bg-background px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link href="/" className="flex items-center justify-center gap-2">
          <Heart className="h-7 w-7 fill-primary text-primary" />
          <span className="font-display text-2xl font-bold tracking-tight text-neutral-dark">
            EverAfter
          </span>
        </Link>
        <h2 className="mt-6 text-center font-display text-2xl font-bold leading-9 tracking-tight text-neutral-dark">
          Create your free wedding website
        </h2>
        {plan && (
          <div className="mt-2 flex items-center justify-center gap-1.5 text-xs font-medium text-primary-dark">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Selected plan: {plan.toUpperCase()}</span>
          </div>
        )}
        <p className="mt-2 text-center text-sm text-neutral-mid">
          Already have an account?{" "}
          <Link href="/auth/login" className="font-medium text-primary-dark hover:underline">
            Sign in
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-[420px]">
        <div className="rounded-2xl bg-white px-6 py-8 shadow-soft-md ring-1 ring-border sm:px-10">
          {message && (
            <div
              className={`mb-6 rounded-lg p-4 text-sm ${
                message.type === "success"
                  ? "bg-green-50 text-green-800 border border-green-200"
                  : "bg-red-50 text-red-800 border border-red-200"
              }`}
            >
              {message.text}
            </div>
          )}

          {/* Google OAuth Button */}
          <Button
            type="button"
            variant="outline"
            className="w-full flex items-center justify-center gap-3 py-2.5 font-medium"
            onClick={handleGoogleSignup}
            disabled={isGoogleLoading || isLoading}
          >
            {isGoogleLoading ? (
              <Loader2 className="h-4 w-4 animate-spin text-neutral-mid" />
            ) : (
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  fill="#EA4335"
                />
              </svg>
            )}
            Sign up with Google
          </Button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-neutral-mid">or sign up with email</span>
            </div>
          </div>

          {/* Magic Link Form */}
          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label htmlFor="names" className="block text-sm font-medium leading-6 text-neutral-dark">
                Couple's names (e.g. Alex & Jordan)
              </label>
              <div className="mt-2">
                <input
                  id="names"
                  name="names"
                  type="text"
                  value={partnerNames}
                  onChange={(e) => setPartnerNames(e.target.value)}
                  placeholder="Taylor & Sam"
                  className="block w-full rounded-md border-0 py-2.5 px-3 text-neutral-dark shadow-sm ring-1 ring-inset ring-border placeholder:text-neutral-mid/60 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium leading-6 text-neutral-dark">
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="block w-full rounded-md border-0 py-2.5 px-3 text-neutral-dark shadow-sm ring-1 ring-inset ring-border placeholder:text-neutral-mid/60 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={isLoading || isGoogleLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                <>
                  Create free account
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          <p className="mt-6 text-center text-xs text-neutral-mid">
            By signing up, you agree to EverAfter's{" "}
            <Link href="/legal/terms" className="underline hover:text-neutral-dark">
              Terms
            </Link>{" "}
            and{" "}
            <Link href="/legal/privacy" className="underline hover:text-neutral-dark">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <React.Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-background">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
      <SignupForm />
    </React.Suspense>
  );
}
