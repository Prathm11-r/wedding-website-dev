import * as React from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Users,
  CreditCard,
  LayoutTemplate,
  Activity,
  ArrowLeft,
  Settings,
} from "lucide-react";

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-neutral-900 text-white flex flex-col font-sans">
      {/* Super Admin Navigation */}
      <header className="border-b border-neutral-800 bg-neutral-950 px-6 py-3.5 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <span className="font-display font-bold text-lg text-white">
                EverAfter
              </span>
              <span className="ml-2 text-xs uppercase font-mono px-2 py-0.5 rounded bg-primary/20 text-primary-light">
                Super Admin
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-sm">
            <Link
              href="/dashboard"
              className="text-neutral-400 hover:text-white flex items-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Exit to Couple Dashboard
            </Link>
          </div>
        </div>
      </header>

      {/* Main Admin Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 lg:p-8">
        {children}
      </main>
    </div>
  );
}
