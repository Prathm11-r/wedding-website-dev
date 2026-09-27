"use client";

import * as React from "react";
import { Mail, MessageSquare, Send, CheckCircle2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ContactPage() {
  const [submitted, setSubmitted] = React.useState(false);
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [message, setMessage] = React.useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="bg-neutral-surface min-h-screen py-16 sm:py-24">
      <div className="mx-auto max-w-3xl px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold uppercase tracking-widest text-primary-deep mb-4 shadow-soft-sm">
            <Sparkles className="h-3.5 w-3.5" />
            Atelier Concierge
          </span>
          <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-neutral-dark">
            We are here to assist your celebration.
          </h1>
          <p className="mt-4 text-base sm:text-lg text-neutral-mid leading-relaxed font-light">
            Questions regarding custom domains, wedding planner enterprise licenses, or bespoke styling? Our concierge team responds within 24 hours.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-border/80 shadow-3d-card">
          {submitted ? (
            <div className="py-12 text-center space-y-4">
              <div className="h-16 w-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-200 shadow-soft-sm">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <h2 className="font-display text-2xl font-bold text-neutral-dark">
                Message Dispatched
              </h2>
              <p className="text-sm text-neutral-mid max-w-sm mx-auto leading-relaxed">
                Thank you, {name}. Our team has received your inquiry and will follow up at {email} promptly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-dark mb-1.5">
                  Your Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Geneviève Laurent"
                  className="w-full rounded-xl border border-border px-4 py-2.5 text-neutral-dark text-sm bg-neutral-surface focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-dark mb-1.5">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-border px-4 py-2.5 text-neutral-dark text-sm bg-neutral-surface focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-dark mb-1.5">
                  How can we help? *
                </label>
                <textarea
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us about your wedding date, questions, or requirements..."
                  className="w-full rounded-xl border border-border px-4 py-2.5 text-neutral-dark text-sm bg-neutral-surface focus:border-primary focus:outline-none resize-none leading-relaxed"
                />
              </div>

              <Button
                type="submit"
                className="w-full py-5 text-xs uppercase tracking-widest font-semibold shadow-soft-md shadow-primary/25"
              >
                <Send className="h-4 w-4 mr-2" />
                Send Inquiry to Atelier
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
