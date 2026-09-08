import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";

import type { Database } from "@/integrations/supabase/types";

export type PublicEvent = {
  id: string;
  title: string;
  description: string | null;
  starts_at: string;
  location: string | null;
};

export const listPublicEvents = createServerFn({ method: "GET" }).handler(
  async (): Promise<PublicEvent[]> => {
    const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
    const supabasePublic = createClient<Database>(process.env["SUPABASE_URL"]!, key, {
      auth: { persistSession: false, autoRefreshToken: false },
      global: {
        fetch: (input, init) => {
          const h = new Headers(init?.headers);
          if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) {
            h.delete("Authorization");
          }
          h.set("apikey", key);
          return fetch(input, { ...init, headers: h });
        },
      },
    });

    const { data, error } = await supabasePublic
      .from("events")
      .select("id, title, description, starts_at, location")
      .eq("published", true)
      .gte("starts_at", new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString())
      .order("starts_at", { ascending: true })
      .limit(50);

    if (error) throw new Error(error.message);
    return data ?? [];
  },
);
