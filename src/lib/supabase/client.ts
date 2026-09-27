"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/types/database";

/**
 * Returns a Supabase client for use in Client Components and browser-side
 * code. This client uses the public anon key and respects Row Level Security.
 *
 * Usage:
 * ```ts
 * const supabase = createClient();
 * const { data, error } = await supabase.from("weddings").select("*");
 * ```
 */
export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
