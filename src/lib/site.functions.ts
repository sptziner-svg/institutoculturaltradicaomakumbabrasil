import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";

import type { Database } from "@/integrations/supabase/types";

function publicClient() {
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
  return createClient<Database>(process.env["SUPABASE_URL"]!, key, {
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
}

export type SiteSettings = Record<string, string>;

export const getSiteSettings = createServerFn({ method: "GET" }).handler(
  async (): Promise<SiteSettings> => {
    const { data, error } = await publicClient().from("site_settings").select("key, value");
    if (error) throw new Error(error.message);
    const out: SiteSettings = {};
    for (const row of data ?? []) {
      if (row.value) out[row.key] = row.value;
    }
    return out;
  },
);

export type PublicPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  cover_url: string | null;
  published_at: string;
};

export const listPublicPosts = createServerFn({ method: "GET" }).handler(
  async (): Promise<PublicPost[]> => {
    const { data, error } = await publicClient()
      .from("posts")
      .select("id, title, slug, excerpt, content, cover_url, published_at")
      .eq("published", true)
      .order("published_at", { ascending: false })
      .limit(50);
    if (error) throw new Error(error.message);
    return data ?? [];
  },
);

export const getPublicPost = createServerFn({ method: "GET" })
  .inputValidator((data: { slug: string }) => data)
  .handler(async ({ data }): Promise<PublicPost | null> => {
    const { data: row, error } = await publicClient()
      .from("posts")
      .select("id, title, slug, excerpt, content, cover_url, published_at")
      .eq("published", true)
      .eq("slug", data.slug)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return row ?? null;
  });
