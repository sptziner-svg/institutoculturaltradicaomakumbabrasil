import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/admin")({
  component: AdminPage,
  head: () => ({
    meta: [
      { title: "Administração — Instituto Cultural Tradição Makumba Brasil" },
      { name: "description", content: "Painel de administração do instituto." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Administração" },
      { property: "og:description", content: "Painel de administração do instituto." },
    ],
  }),
});

type EventRow = {
  id: string;
  title: string;
  description: string | null;
  starts_at: string;
  location: string | null;
  published: boolean;
};

type RequestRow = {
  id: string;
  name: string;
  contact: string;
  message: string | null;
  status: string;
  created_at: string;
};

function AdminPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [error, setError] = useState("");

  const roleQuery = useQuery({
    queryKey: ["is-admin"],
    queryFn: async () => {
      const { data: userData } = await supabase.auth.getUser();
      const uid = userData.user?.id;
      if (!uid) return { isAdmin: false, email: "" };
      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", uid)
        .eq("role", "admin")
        .maybeSingle();
      return { isAdmin: Boolean(data), email: userData.user?.email ?? "" };
    },
  });

  const isAdmin = roleQuery.data?.isAdmin ?? false;

  const eventsQuery = useQuery({
    queryKey: ["admin-events"],
    enabled: isAdmin,
    queryFn: async () => {
      const { data, error: e } = await supabase
        .from("events")
        .select("id, title, description, starts_at, location, published")
        .order("starts_at", { ascending: true });
      if (e) throw new Error(e.message);
      return (data ?? []) as EventRow[];
    },
  });

  const requestsQuery = useQuery({
    queryKey: ["admin-requests"],
    enabled: isAdmin,
    queryFn: async () => {
      const { data, error: e } = await supabase
        .from("membership_requests")
        .select("id, name, contact, message, status, created_at")
        .order("created_at", { ascending: false });
      if (e) throw new Error(e.message);
      return (data ?? []) as RequestRow[];
    },
  });

  const [form, setForm] = useState({
    title: "",
    starts_at: "",
    location: "Rua Oito, Jd Aguapeú — Itanhaém/SP",
    description: "",
  });

  async function handleSignOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  async function addEvent(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!form.title.trim() || !form.starts_at) {
      setError("Informe o nome do evento e a data.");
      return;
    }
    const { error: insertError } = await supabase.from("events").insert({
      title: form.title.trim(),
      description: form.description.trim() || null,
      location: form.location.trim() || null,
      starts_at: new Date(form.starts_at).toISOString(),
      published: true,
    });
    if (insertError) {
      setError("Não foi possível salvar o evento.");
      return;
    }
    setForm({ ...form, title: "", starts_at: "", description: "" });
    queryClient.invalidateQueries({ queryKey: ["admin-events"] });
    queryClient.invalidateQueries({ queryKey: ["public-events"] });
  }

  async function togglePublished(row: EventRow) {
    await supabase.from("events").update({ published: !row.published }).eq("id", row.id);
    queryClient.invalidateQueries({ queryKey: ["admin-events"] });
    queryClient.invalidateQueries({ queryKey: ["public-events"] });
  }

  async function removeEvent(id: string) {
    await supabase.from("events").delete().eq("id", id);
    queryClient.invalidateQueries({ queryKey: ["admin-events"] });
    queryClient.invalidateQueries({ queryKey: ["public-events"] });
  }

  async function setRequestStatus(row: RequestRow, status: string) {
    await supabase.from("membership_requests").update({ status }).eq("id", row.id);
    queryClient.invalidateQueries({ queryKey: ["admin-requests"] });
  }

  if (roleQuery.isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center px-5">
        <p className="text-muted-foreground">Carregando...</p>
      </main>
    );
  }

  if (!isAdmin) {
    return (
      <main className="flex min-h-screen items-center justify-center px-5 text-center">
        <div className="max-w-md">
          <h1 className="text-2xl">Acesso restrito</h1>
          <p className="mt-4 text-sm text-muted-foreground">
            Sua conta ({roleQuery.data?.email}) ainda não tem permissão de administração. Peça
            liberação para o responsável pelo site.
          </p>
          <button
            onClick={handleSignOut}
            className="mt-8 rounded-sm border border-gold/60 px-6 py-3 font-display text-xs tracking-widest text-gold uppercase"
          >
            Sair
          </button>
        </div>
      </main>
    );
  }

  const inputClass =
    "mt-2 w-full rounded-sm border border-border/70 bg-card/60 px-4 py-3 text-foreground outline-none focus:border-gold/70";

  return (
    <main className="min-h-screen bg-background px-5 py-14 text-foreground">
      <div className="mx-auto max-w-4xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="font-display text-[0.7rem] tracking-[0.35em] text-gold uppercase">
              Administração
            </p>
            <h1 className="mt-3 text-2xl sm:text-3xl">Painel da casa</h1>
          </div>
          <button
            onClick={handleSignOut}
            className="rounded-sm border border-border/70 px-5 py-2 font-display text-xs tracking-widest text-muted-foreground uppercase hover:border-gold/60 hover:text-gold"
          >
            Sair
          </button>
        </div>

        {/* Novo evento */}
        <section className="mt-12">
          <h2 className="font-display text-lg text-gold">Novo evento</h2>
          <form onSubmit={addEvent} className="mt-5 grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label htmlFor="ev-title" className="text-xs tracking-widest text-gold uppercase">
                Nome do evento
              </label>
              <input
                id="ev-title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="ev-date" className="text-xs tracking-widest text-gold uppercase">
                Data e hora
              </label>
              <input
                id="ev-date"
                type="datetime-local"
                value={form.starts_at}
                onChange={(e) => setForm({ ...form, starts_at: e.target.value })}
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="ev-local" className="text-xs tracking-widest text-gold uppercase">
                Local
              </label>
              <input
                id="ev-local"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                className={inputClass}
              />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="ev-desc" className="text-xs tracking-widest text-gold uppercase">
                Descrição
              </label>
              <textarea
                id="ev-desc"
                rows={3}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className={inputClass}
              />
            </div>
            <div className="sm:col-span-2">
              <button
                type="submit"
                className="rounded-sm border border-gold/60 bg-gold/10 px-7 py-3 font-display text-xs tracking-widest text-gold uppercase hover:bg-gold hover:text-primary-foreground"
              >
                Salvar evento
              </button>
              {error && <p className="mt-3 text-sm text-gold-soft">{error}</p>}
            </div>
          </form>
        </section>

        {/* Eventos */}
        <section className="mt-14">
          <h2 className="font-display text-lg text-gold">Eventos cadastrados</h2>
          <div className="mt-5 space-y-3">
            {eventsQuery.data?.length === 0 && (
              <p className="text-sm text-muted-foreground">Nenhum evento cadastrado.</p>
            )}
            {eventsQuery.data?.map((row) => (
              <article
                key={row.id}
                className="rounded-sm border border-border/70 bg-card/50 p-5"
              >
                <p className="text-xs tracking-widest text-gold uppercase">
                  {new Date(row.starts_at).toLocaleString("pt-BR")}
                </p>
                <h3 className="mt-2 font-display text-lg">{row.title}</h3>
                {row.location && (
                  <p className="mt-1 text-sm text-muted-foreground">{row.location}</p>
                )}
                {row.description && (
                  <p className="mt-2 text-sm text-muted-foreground">{row.description}</p>
                )}
                <div className="mt-4 flex flex-wrap gap-3">
                  <button
                    onClick={() => togglePublished(row)}
                    className="rounded-sm border border-border/70 px-4 py-2 text-xs tracking-widest uppercase hover:border-gold/60 hover:text-gold"
                  >
                    {row.published ? "Ocultar do site" : "Mostrar no site"}
                  </button>
                  <button
                    onClick={() => removeEvent(row.id)}
                    className="rounded-sm border border-blood px-4 py-2 text-xs tracking-widest uppercase hover:bg-blood/20"
                  >
                    Apagar
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Pedidos */}
        <section className="mt-14">
          <h2 className="font-display text-lg text-gold">Quem quer fazer parte</h2>
          <div className="mt-5 space-y-3">
            {requestsQuery.data?.length === 0 && (
              <p className="text-sm text-muted-foreground">Nenhum pedido recebido ainda.</p>
            )}
            {requestsQuery.data?.map((row) => (
              <article key={row.id} className="rounded-sm border border-border/70 bg-card/50 p-5">
                <p className="text-xs tracking-widest text-muted-foreground uppercase">
                  {new Date(row.created_at).toLocaleString("pt-BR")} — {row.status}
                </p>
                <h3 className="mt-2 font-display text-lg">{row.name}</h3>
                <p className="mt-1 text-sm text-gold">{row.contact}</p>
                {row.message && (
                  <p className="mt-2 text-sm text-muted-foreground">{row.message}</p>
                )}
                <div className="mt-4 flex flex-wrap gap-3">
                  <button
                    onClick={() => setRequestStatus(row, row.status === "novo" ? "atendido" : "novo")}
                    className="rounded-sm border border-border/70 px-4 py-2 text-xs tracking-widest uppercase hover:border-gold/60 hover:text-gold"
                  >
                    {row.status === "novo" ? "Marcar como atendido" : "Marcar como novo"}
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
