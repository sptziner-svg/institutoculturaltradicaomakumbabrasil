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

type PostRow = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  cover_url: string | null;
  published: boolean;
  published_at: string;
};

const inputClass =
  "mt-2 w-full rounded-sm border border-border/70 bg-card/60 px-4 py-3 text-foreground outline-none focus:border-gold/70";
const labelClass = "text-xs tracking-widest text-gold uppercase";
const btnPrimary =
  "rounded-sm border border-gold/60 bg-gold/10 px-7 py-3 font-display text-xs tracking-widest text-gold uppercase hover:bg-gold hover:text-primary-foreground disabled:opacity-60";
const btnGhost =
  "rounded-sm border border-border/70 px-4 py-2 text-xs tracking-widest uppercase hover:border-gold/60 hover:text-gold";
const btnDanger =
  "rounded-sm border border-blood px-4 py-2 text-xs tracking-widest uppercase hover:bg-blood/20";

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 70);
}

async function uploadImage(file: File, folder: string) {
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const { error } = await supabase.storage.from("midia").upload(path, file, {
    contentType: file.type || undefined,
    upsert: false,
  });
  if (error) throw new Error(error.message);
  return `/api/public/midia/${path}`;
}

type Tab = "eventos" | "postagens" | "fotos" | "pedidos";

function AdminPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [tab, setTab] = useState<Tab>("eventos");

  const roleQuery = useQuery({
    queryKey: ["is-admin"],
    queryFn: async () => {
      const { data: userData } = await supabase.auth.getUser();
      const uid = userData.user?.id;
      if (!uid) return { isAdmin: false, email: "" };
      // A primeira conta que acessa o painel assume a administração da casa.
      await supabase.rpc("claim_first_admin");
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

  async function handleSignOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
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

  const tabs: { id: Tab; label: string }[] = [
    { id: "eventos", label: "Eventos" },
    { id: "postagens", label: "Postagens" },
    { id: "fotos", label: "Fotos do site" },
    { id: "pedidos", label: "Pedidos" },
  ];

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
          <button onClick={handleSignOut} className={btnGhost}>
            Sair
          </button>
        </div>

        <div className="mt-8 flex flex-wrap gap-2 border-b border-border/60 pb-3">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`rounded-sm px-4 py-2 font-display text-xs tracking-widest uppercase ${
                tab === t.id
                  ? "border border-gold/60 bg-gold/10 text-gold"
                  : "border border-transparent text-muted-foreground hover:text-gold"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === "eventos" && <EventsPanel />}
        {tab === "postagens" && <PostsPanel />}
        {tab === "fotos" && <PhotosPanel />}
        {tab === "pedidos" && <RequestsPanel />}
      </div>
    </main>
  );
}

function EventsPanel() {
  const queryClient = useQueryClient();
  const [error, setError] = useState("");
  const [ok, setOk] = useState("");
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: "",
    starts_at: "",
    location: "Rua Oito, 200 — Pq Vergara / Aguapeú, Itanhaém/SP",
    description: "",
  });

  const eventsQuery = useQuery({
    queryKey: ["admin-events"],
    queryFn: async () => {
      const { data, error: e } = await supabase
        .from("events")
        .select("id, title, description, starts_at, location, published")
        .order("starts_at", { ascending: true });
      if (e) throw new Error(e.message);
      return (data ?? []) as EventRow[];
    },
  });

  function refresh() {
    queryClient.invalidateQueries({ queryKey: ["admin-events"] });
    queryClient.invalidateQueries({ queryKey: ["public-events"] });
  }

  async function addEvent(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setOk("");
    if (!form.title.trim() || !form.starts_at) {
      setError("Informe o nome do evento e a data.");
      return;
    }
    setSaving(true);
    const { error: insertError } = await supabase.from("events").insert({
      title: form.title.trim(),
      description: form.description.trim() || null,
      location: form.location.trim() || null,
      starts_at: new Date(form.starts_at).toISOString(),
      published: true,
    });
    setSaving(false);
    if (insertError) {
      setError(`Não foi possível salvar o evento: ${insertError.message}`);
      return;
    }
    setForm({ ...form, title: "", starts_at: "", description: "" });
    setOk("Evento salvo e já publicado no site.");
    refresh();
  }

  async function togglePublished(row: EventRow) {
    await supabase.from("events").update({ published: !row.published }).eq("id", row.id);
    refresh();
  }

  async function removeEvent(id: string) {
    await supabase.from("events").delete().eq("id", id);
    refresh();
  }

  return (
    <>
      <section className="mt-10">
        <h2 className="font-display text-lg text-gold">Novo evento</h2>
        <form onSubmit={addEvent} className="mt-5 grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label htmlFor="ev-title" className={labelClass}>
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
            <label htmlFor="ev-date" className={labelClass}>
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
            <label htmlFor="ev-local" className={labelClass}>
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
            <label htmlFor="ev-desc" className={labelClass}>
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
            <button type="submit" disabled={saving} className={btnPrimary}>
              {saving ? "Salvando..." : "Salvar evento"}
            </button>
            {error && <p className="mt-3 text-sm text-gold-soft">{error}</p>}
            {ok && <p className="mt-3 text-sm text-gold">{ok}</p>}
          </div>
        </form>
      </section>

      <section className="mt-14">
        <h2 className="font-display text-lg text-gold">Eventos cadastrados</h2>
        <div className="mt-5 space-y-3">
          {eventsQuery.data?.length === 0 && (
            <p className="text-sm text-muted-foreground">Nenhum evento cadastrado.</p>
          )}
          {eventsQuery.data?.map((row) => (
            <article key={row.id} className="rounded-sm border border-border/70 bg-card/50 p-5">
              <p className="text-xs tracking-widest text-gold uppercase">
                {new Date(row.starts_at).toLocaleString("pt-BR")}
                {!row.published && " — oculto do site"}
              </p>
              <h3 className="mt-2 font-display text-lg">{row.title}</h3>
              {row.location && <p className="mt-1 text-sm text-muted-foreground">{row.location}</p>}
              {row.description && (
                <p className="mt-2 text-sm text-muted-foreground">{row.description}</p>
              )}
              <div className="mt-4 flex flex-wrap gap-3">
                <button onClick={() => togglePublished(row)} className={btnGhost}>
                  {row.published ? "Ocultar do site" : "Mostrar no site"}
                </button>
                <button onClick={() => removeEvent(row.id)} className={btnDanger}>
                  Apagar
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}

function PostsPanel() {
  const queryClient = useQueryClient();
  const [error, setError] = useState("");
  const [ok, setOk] = useState("");
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState({ title: "", excerpt: "", content: "", cover_url: "" });

  const postsAdminQuery = useQuery({
    queryKey: ["admin-posts"],
    queryFn: async () => {
      const { data, error: e } = await supabase
        .from("posts")
        .select("id, title, slug, excerpt, content, cover_url, published, published_at")
        .order("published_at", { ascending: false });
      if (e) throw new Error(e.message);
      return (data ?? []) as PostRow[];
    },
  });

  function refresh() {
    queryClient.invalidateQueries({ queryKey: ["admin-posts"] });
    queryClient.invalidateQueries({ queryKey: ["public-posts"] });
  }

  function resetForm() {
    setEditing(null);
    setForm({ title: "", excerpt: "", content: "", cover_url: "" });
  }

  async function handleCover(file: File) {
    setError("");
    try {
      const url = await uploadImage(file, "postagens");
      setForm((f) => ({ ...f, cover_url: url }));
    } catch (e) {
      setError(`Não conseguimos enviar a imagem: ${(e as Error).message}`);
    }
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setOk("");
    if (!form.title.trim() || !form.content.trim()) {
      setError("Informe o título e o texto da postagem.");
      return;
    }
    setSaving(true);
    const payload = {
      title: form.title.trim(),
      excerpt: form.excerpt.trim() || null,
      content: form.content.trim(),
      cover_url: form.cover_url.trim() || null,
    };
    const res = editing
      ? await supabase.from("posts").update(payload).eq("id", editing)
      : await supabase
          .from("posts")
          .insert({ ...payload, slug: `${slugify(form.title)}-${Date.now().toString(36)}` });
    setSaving(false);
    if (res.error) {
      setError(`Não foi possível salvar: ${res.error.message}`);
      return;
    }
    setOk(editing ? "Postagem atualizada." : "Postagem publicada no site.");
    resetForm();
    refresh();
  }

  async function togglePublished(row: PostRow) {
    await supabase.from("posts").update({ published: !row.published }).eq("id", row.id);
    refresh();
  }

  async function remove(id: string) {
    await supabase.from("posts").delete().eq("id", id);
    if (editing === id) resetForm();
    refresh();
  }

  return (
    <>
      <section className="mt-10">
        <h2 className="font-display text-lg text-gold">
          {editing ? "Editar postagem" : "Nova postagem"}
        </h2>
        <form onSubmit={save} className="mt-5 grid gap-4">
          <div>
            <label htmlFor="po-title" className={labelClass}>
              Título
            </label>
            <input
              id="po-title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="po-excerpt" className={labelClass}>
              Resumo (aparece na lista)
            </label>
            <input
              id="po-excerpt"
              value={form.excerpt}
              onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="po-content" className={labelClass}>
              Texto
            </label>
            <textarea
              id="po-content"
              rows={10}
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="po-cover" className={labelClass}>
              Imagem de capa (opcional)
            </label>
            <input
              id="po-cover"
              type="file"
              accept="image/*"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleCover(f);
              }}
              className="mt-2 w-full text-sm text-muted-foreground"
            />
            {form.cover_url && (
              <img
                src={form.cover_url}
                alt="Prévia da capa"
                className="mt-3 h-40 w-full rounded-sm border border-gold/30 object-cover"
              />
            )}
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <button type="submit" disabled={saving} className={btnPrimary}>
              {saving ? "Salvando..." : editing ? "Salvar alterações" : "Publicar postagem"}
            </button>
            {editing && (
              <button type="button" onClick={resetForm} className={btnGhost}>
                Cancelar
              </button>
            )}
          </div>
          {error && <p className="text-sm text-gold-soft">{error}</p>}
          {ok && <p className="text-sm text-gold">{ok}</p>}
        </form>
      </section>

      <section className="mt-14">
        <h2 className="font-display text-lg text-gold">Postagens</h2>
        <div className="mt-5 space-y-3">
          {postsAdminQuery.data?.length === 0 && (
            <p className="text-sm text-muted-foreground">Nenhuma postagem ainda.</p>
          )}
          {postsAdminQuery.data?.map((row) => (
            <article key={row.id} className="rounded-sm border border-border/70 bg-card/50 p-5">
              <p className="text-xs tracking-widest text-muted-foreground uppercase">
                {new Date(row.published_at).toLocaleDateString("pt-BR")}
                {!row.published && " — oculta do site"}
              </p>
              <h3 className="mt-2 font-display text-lg">{row.title}</h3>
              {row.excerpt && <p className="mt-2 text-sm text-muted-foreground">{row.excerpt}</p>}
              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  onClick={() => {
                    setEditing(row.id);
                    setForm({
                      title: row.title,
                      excerpt: row.excerpt ?? "",
                      content: row.content,
                      cover_url: row.cover_url ?? "",
                    });
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className={btnGhost}
                >
                  Editar
                </button>
                <button onClick={() => togglePublished(row)} className={btnGhost}>
                  {row.published ? "Ocultar do site" : "Mostrar no site"}
                </button>
                <button onClick={() => remove(row.id)} className={btnDanger}>
                  Apagar
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}

function PhotosPanel() {
  const queryClient = useQueryClient();
  const [error, setError] = useState("");
  const [ok, setOk] = useState("");
  const [busy, setBusy] = useState(false);

  const settings = useQuery({
    queryKey: ["admin-settings"],
    queryFn: async () => {
      const { data, error: e } = await supabase.from("site_settings").select("key, value");
      if (e) throw new Error(e.message);
      const out: Record<string, string> = {};
      for (const row of data ?? []) if (row.value) out[row.key] = row.value;
      return out;
    },
  });

  async function saveSetting(key: string, value: string) {
    const { error: e } = await supabase.from("site_settings").upsert({ key, value });
    if (e) throw new Error(e.message);
    queryClient.invalidateQueries({ queryKey: ["admin-settings"] });
    queryClient.invalidateQueries({ queryKey: ["site-settings"] });
  }

  async function changeTataPhoto(file: File) {
    setError("");
    setOk("");
    setBusy(true);
    try {
      const url = await uploadImage(file, "tata");
      await saveSetting("tata_photo_url", url);
      setOk("Foto do tata atualizada no site.");
    } catch (e) {
      setError(`Não conseguimos trocar a foto: ${(e as Error).message}`);
    }
    setBusy(false);
  }

  const current = settings.data?.["tata_photo_url"] || "/tata-rogerio.png";

  return (
    <section className="mt-10">
      <h2 className="font-display text-lg text-gold">Foto do tata Rogério</h2>
      <p className="mt-3 text-sm text-muted-foreground">
        A foto aparece no topo da página inicial e na parte do dirigente.
      </p>
      <img
        src={current}
        alt="Foto atual do tata Rogério"
        className="mt-5 h-48 w-48 rounded-full border border-gold/40 object-cover object-top"
      />
      <div className="mt-5">
        <label htmlFor="tata-photo" className={labelClass}>
          Escolher nova foto
        </label>
        <input
          id="tata-photo"
          type="file"
          accept="image/*"
          disabled={busy}
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) changeTataPhoto(f);
          }}
          className="mt-2 w-full text-sm text-muted-foreground"
        />
      </div>
      {busy && <p className="mt-3 text-sm text-muted-foreground">Enviando...</p>}
      {error && <p className="mt-3 text-sm text-gold-soft">{error}</p>}
      {ok && <p className="mt-3 text-sm text-gold">{ok}</p>}
    </section>
  );
}

function RequestsPanel() {
  const queryClient = useQueryClient();

  const requestsQuery = useQuery({
    queryKey: ["admin-requests"],
    queryFn: async () => {
      const { data, error: e } = await supabase
        .from("membership_requests")
        .select("id, name, contact, message, status, created_at")
        .order("created_at", { ascending: false });
      if (e) throw new Error(e.message);
      return (data ?? []) as RequestRow[];
    },
  });

  async function setRequestStatus(row: RequestRow, status: string) {
    await supabase.from("membership_requests").update({ status }).eq("id", row.id);
    queryClient.invalidateQueries({ queryKey: ["admin-requests"] });
  }

  return (
    <section className="mt-10">
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
            {row.message && <p className="mt-2 text-sm text-muted-foreground">{row.message}</p>}
            <div className="mt-4 flex flex-wrap gap-3">
              <button
                onClick={() => setRequestStatus(row, row.status === "novo" ? "atendido" : "novo")}
                className={btnGhost}
              >
                {row.status === "novo" ? "Marcar como atendido" : "Marcar como novo"}
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
