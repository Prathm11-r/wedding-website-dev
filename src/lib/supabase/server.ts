import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import type { Database } from "@/types/database";

/**
 * Returns a Supabase client for use in Server Components, Server Actions,
 * and Route Handlers. Reads and writes auth cookies via the Next.js
 * `cookies()` API to keep the session alive across navigations.
 *
 * ⚠️  Must be called inside a Server Component or async Route Handler —
 *     NOT in middleware (use the middleware-specific pattern there).
 *
 * Usage:
 * ```ts
 * const supabase = await createClient();
 * const { data: { user } } = await supabase.auth.getUser();
 * ```
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: Array<{ name: string; value: string; options: CookieOptions }>) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // `setAll` is called from a Server Component during rendering;
            // cookies cannot be mutated there. The middleware handles session
            // refresh before the component tree renders, so this is safe to
            // silently ignore.
          }
        },
      },
    }
  );
}

/**
 * Returns a Supabase client authenticated with the service role key.
 * This bypasses Row Level Security — use only in trusted server contexts
 * (e.g. webhooks, admin tasks, background jobs). Never expose to clients.
 */
export function createServiceClient() {
  return createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
