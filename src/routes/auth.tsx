import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";

import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth")({
  component: AuthPage,
  head: () => ({
    meta: [
      { title: "Entrar — Administração do Instituto" },
      { name: "description", content: "Acesso restrito à administração do instituto." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Entrar — Administração do Instituto" },
      { property: "og:description", content: "Acesso restrito à administração do instituto." },
    ],
  }),
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"in" | "up">("in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg("");

    if (mode === "in") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      setBusy(false);
      if (error) {
        setMsg("E-mail ou senha incorretos.");
        return;
      }
      navigate({ to: "/admin" });
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: window.location.origin + "/admin" },
    });
    setBusy(false);
    if (error) {
      setMsg(error.message);
      return;
    }
    if (!data.session) {
      setMsg("Conta criada. Confirme seu e-mail pelo link que enviamos e depois entre.");
      return;
    }
    navigate({ to: "/admin" });
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-5 py-16">
      <div className="w-full max-w-sm">
        <p className="text-center font-display text-[0.7rem] tracking-[0.35em] text-gold uppercase">
          Administração
        </p>
        <h1 className="mt-4 text-center text-2xl">
          {mode === "in" ? "Entrar" : "Criar conta"}
        </h1>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <label htmlFor="email" className="text-xs tracking-widest text-gold uppercase">
              E-mail
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 w-full rounded-sm border border-border/70 bg-card/60 px-4 py-3 text-foreground outline-none focus:border-gold/70"
            />
          </div>
          <div>
            <label htmlFor="password" className="text-xs tracking-widest text-gold uppercase">
              Senha
            </label>
            <input
              id="password"
              type="password"
              autoComplete={mode === "in" ? "current-password" : "new-password"}
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 w-full rounded-sm border border-border/70 bg-card/60 px-4 py-3 text-foreground outline-none focus:border-gold/70"
            />
          </div>

          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-sm border border-gold/60 bg-gold/10 px-6 py-3 font-display text-sm tracking-widest text-gold uppercase transition-colors hover:bg-gold hover:text-primary-foreground disabled:opacity-60"
          >
            {busy ? "Aguarde..." : mode === "in" ? "Entrar" : "Criar conta"}
          </button>

          {msg && <p className="text-sm text-gold-soft">{msg}</p>}
        </form>

        <button
          type="button"
          onClick={() => {
            setMode(mode === "in" ? "up" : "in");
            setMsg("");
          }}
          className="mt-6 w-full text-center text-xs tracking-widest text-muted-foreground uppercase hover:text-gold"
        >
          {mode === "in" ? "Criar uma conta" : "Já tenho conta"}
        </button>
      </div>
    </main>
  );
}
