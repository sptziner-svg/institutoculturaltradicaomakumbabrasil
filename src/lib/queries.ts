import { queryOptions } from "@tanstack/react-query";

import { listPublicEvents } from "@/lib/events.functions";
import { getSiteSettings, listPublicPosts } from "@/lib/site.functions";

export const eventsQuery = queryOptions({
  queryKey: ["public-events"],
  queryFn: () => listPublicEvents(),
  staleTime: 0,
});

export const postsQuery = queryOptions({
  queryKey: ["public-posts"],
  queryFn: () => listPublicPosts(),
  staleTime: 0,
});

export const settingsQuery = queryOptions({
  queryKey: ["site-settings"],
  queryFn: () => getSiteSettings(),
  staleTime: 0,
});

export function formatEventDate(iso: string) {
  return new Date(iso).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatPostDate(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}
