"use client";

import * as React from "react";
import {
  Settings,
  Globe,
  Lock,
  Save,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  ShieldAlert,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
  const [partnerOne, setPartnerOne] = React.useState("Sarah Jenkins");
  const [partnerTwo, setPartnerTwo] = React.useState("James Miller");
  const [weddingDate, setWeddingDate] = React.useState("2027-06-19");
  const [location, setLocation] = React.useState("Napa Valley, California");
  const [subdomain, setSubdomain] = React.useState("sarah-and-james");

  // Custom domain
  const [customDomain, setCustomDomain] = React.useState("jenkinsmiller.com");
  const [domainStatus, setDomainStatus] = React.useState<"active" | "verifying" | "none">("active");

  // Privacy password
  const [isPasswordProtected, setIsPasswordProtected] = React.useState(false);
  const [sitePassword, setSitePassword] = React.useState("");

  const [isSaved, setIsSaved] = React.useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="max-w-4xl space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl font-bold text-neutral-dark">
          Wedding Settings
        </h1>
        <p className="mt-1 text-sm text-neutral-mid">
          Configure your event details, custom domain, and privacy controls.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* General Event Settings */}
        <section className="rounded-2xl border border-border bg-white p-6 shadow-soft-sm space-y-4">
          <div className="border-b border-border pb-3">
            <h2 className="font-display text-lg font-bold text-neutral-dark">
              General Wedding Information
            </h2>
            <p className="text-xs text-neutral-mid">
              These details appear across your wedding website and invitations.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <label className="block font-medium text-neutral-dark mb-1">
                Partner One Name
              </label>
              <input
                type="text"
                required
                value={partnerOne}
                onChange={(e) => setPartnerOne(e.target.value)}
                className="w-full rounded-lg border border-border px-3.5 py-2 text-sm focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-medium text-neutral-dark mb-1">
                Partner Two Name
              </label>
              <input
                type="text"
                required
                value={partnerTwo}
                onChange={(e) => setPartnerTwo(e.target.value)}
                className="w-full rounded-lg border border-border px-3.5 py-2 text-sm focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-medium text-neutral-dark mb-1">
                Wedding Date
              </label>
              <input
                type="date"
                required
                value={weddingDate}
                onChange={(e) => setWeddingDate(e.target.value)}
                className="w-full rounded-lg border border-border px-3.5 py-2 text-sm focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-medium text-neutral-dark mb-1">
                Venue Location
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="City, State or Country"
                className="w-full rounded-lg border border-border px-3.5 py-2 text-sm focus:border-primary focus:outline-none"
              />
            </div>
          </div>
        </section>

        {/* Custom Domain Settings */}
        <section className="rounded-2xl border border-border bg-white p-6 shadow-soft-sm space-y-4">
          <div className="border-b border-border pb-3 flex items-center justify-between">
            <div>
              <h2 className="font-display text-lg font-bold text-neutral-dark flex items-center gap-2">
                <Globe className="h-5 w-5 text-primary" />
                Custom Domain
              </h2>
              <p className="text-xs text-neutral-mid">
                Connect your personal domain (e.g. yournames.com) with automated SSL.
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 ring-1 ring-purple-200">
              Premium Feature
            </span>
          </div>

          <div className="space-y-4 text-sm">
            <div>
              <label className="block font-medium text-neutral-dark mb-1">
                Your Free EverAfter Subdomain
              </label>
              <div className="flex items-center gap-2">
                <span className="text-sm font-mono text-neutral-mid bg-neutral-100 px-3 py-2 rounded-lg border border-border">
                  https://
                </span>
                <input
                  type="text"
                  value={subdomain}
                  onChange={(e) => setSubdomain(e.target.value)}
                  className="rounded-lg border border-border px-3.5 py-2 text-sm focus:border-primary focus:outline-none font-mono"
                />
                <span className="text-sm font-mono text-neutral-mid">.everafter.com</span>
              </div>
            </div>

            <div>
              <label className="block font-medium text-neutral-dark mb-1">
                Connected Custom Apex Domain
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={customDomain}
                  onChange={(e) => setCustomDomain(e.target.value)}
                  placeholder="e.g. alexandjordan.com"
                  className="flex-1 rounded-lg border border-border px-3.5 py-2 text-sm focus:border-primary focus:outline-none font-mono"
                />
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-50 text-green-700 text-xs font-semibold ring-1 ring-green-200">
                  <CheckCircle2 className="h-4 w-4" />
                  DNS Verified & SSL Active
                </span>
              </div>
              <p className="text-xs text-neutral-mid mt-1.5">
                DNS Configuration: Point a CNAME record for <code className="bg-neutral-100 px-1 py-0.5 rounded">www</code> to <code className="bg-neutral-100 px-1 py-0.5 rounded">cname.everafter.com</code>.
              </p>
            </div>
          </div>
        </section>

        {/* Privacy & Access Controls */}
        <section className="rounded-2xl border border-border bg-white p-6 shadow-soft-sm space-y-4">
          <div className="border-b border-border pb-3">
            <h2 className="font-display text-lg font-bold text-neutral-dark flex items-center gap-2">
              <Lock className="h-5 w-5 text-primary" />
              Privacy & Guest Protection
            </h2>
            <p className="text-xs text-neutral-mid">
              Require guests to enter a passcode to view the wedding schedule and registry.
            </p>
          </div>

          <div className="space-y-4 text-sm">
            <div className="flex items-center gap-3">
              <input
                id="protectToggle"
                type="checkbox"
                checked={isPasswordProtected}
                onChange={(e) => setIsPasswordProtected(e.target.checked)}
                className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
              />
              <label htmlFor="protectToggle" className="font-medium text-neutral-dark cursor-pointer">
                Enable site password protection
              </label>
            </div>

            {isPasswordProtected && (
              <div>
                <label className="block font-medium text-neutral-dark mb-1">
                  Guest Access Passcode
                </label>
                <input
                  type="text"
                  value={sitePassword}
                  onChange={(e) => setSitePassword(e.target.value)}
                  placeholder="e.g. FOREVER2027"
                  className="w-full sm:w-64 rounded-lg border border-border px-3.5 py-2 text-sm focus:border-primary focus:outline-none font-mono"
                />
              </div>
            )}
          </div>
        </section>

        <div className="flex items-center justify-between pt-4">
          <Button type="submit" size="lg">
            {isSaved ? (
              <>
                <CheckCircle2 className="mr-1.5 h-4 w-4" />
                Settings Saved!
              </>
            ) : (
              <>
                <Save className="mr-1.5 h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </form>

      {/* Danger Zone */}
      <section className="rounded-2xl border border-red-200 bg-red-50/40 p-6 space-y-4">
        <div>
          <h2 className="font-display text-lg font-bold text-red-900 flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-red-600" />
            Danger Zone
          </h2>
          <p className="text-xs text-red-700">
            Once archived or deleted, your wedding website and guest RSVPs cannot be recovered.
          </p>
        </div>

        <Button variant="destructive" size="sm">
          Archive Wedding Website
        </Button>
      </section>
    </div>
  );
}
