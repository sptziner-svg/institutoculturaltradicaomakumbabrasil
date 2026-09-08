import { useState } from "react";

import { supabase } from "@/integrations/supabase/client";
import { WHATSAPP_NUMBER } from "@/components/WhatsAppButton";
import { Reveal } from "@/components/Reveal";

export function JoinSection() {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const nome = name.trim();
    const cont = contact.trim();
    if (nome.length < 2 || cont.length < 5) {
      setStatus("error");
      setError("Preencha seu nome e um contato válido.");
      return;
    }
    setStatus("sending");
    setError("");

    const { error: insertError } = await supabase.from("membership_requests").insert({
      name: nome.slice(0, 120),
      contact: cont.slice(0, 160),
      message: message.trim().slice(0, 1000) || null,
    });

    if (insertError) {
      setStatus("error");
      setError("Não conseguimos registrar agora. Tente novamente ou fale pelo WhatsApp.");
      return;
    }

    setStatus("done");

    const texto = `Olá! Quero fazer parte do Instituto Cultural Tradição Makumba Brasil.%0A%0ANome: ${encodeURIComponent(
      nome,
    )}%0AContato: ${encodeURIComponent(cont)}${
      message.trim() ? `%0AMensagem: ${encodeURIComponent(message.trim())}` : ""
    }`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${texto}`, "_blank", "noopener,noreferrer");
  }

  return (
    <section id="participar" className="border-t border-border/60 px-5 py-20">
      <div className="mx-auto max-w-2xl">
        <Reveal>
          <p className="font-display text-[0.7rem] tracking-[0.35em] text-gold uppercase">
            Faça parte
          </p>
          <h2 className="mt-4 text-2xl leading-snug text-balance-tight sm:text-4xl">
            Quer fazer parte do instituto?
          </h2>
          <p className="mt-5 text-base leading-relaxed text-muted-foreground">
            Deixe seu nome e contato. A casa recebe seu pedido e entra em contato com você.
          </p>
        </Reveal>

        <Reveal delay={120}>
          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <div>
              <label htmlFor="join-name" className="text-xs tracking-widest text-gold uppercase">
                Nome
              </label>
              <input
                id="join-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={120}
                required
                className="mt-2 w-full rounded-sm border border-border/70 bg-card/60 px-4 py-3 text-foreground outline-none focus:border-gold/70"
              />
            </div>
            <div>
              <label htmlFor="join-contact" className="text-xs tracking-widest text-gold uppercase">
                Contato (WhatsApp, telefone ou e-mail)
              </label>
              <input
                id="join-contact"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                maxLength={160}
                required
                className="mt-2 w-full rounded-sm border border-border/70 bg-card/60 px-4 py-3 text-foreground outline-none focus:border-gold/70"
              />
            </div>
            <div>
              <label htmlFor="join-message" className="text-xs tracking-widest text-gold uppercase">
                Mensagem (opcional)
              </label>
              <textarea
                id="join-message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                maxLength={1000}
                className="mt-2 w-full rounded-sm border border-border/70 bg-card/60 px-4 py-3 text-foreground outline-none focus:border-gold/70"
              />
            </div>

            <button
              type="submit"
              disabled={status === "sending"}
              className="inline-flex items-center justify-center rounded-sm border border-gold/60 bg-gold/10 px-8 py-4 font-display text-sm tracking-widest text-gold uppercase transition-colors hover:bg-gold hover:text-primary-foreground disabled:opacity-60"
            >
              {status === "sending" ? "Enviando..." : "Quero fazer parte"}
            </button>

            {status === "done" && (
              <p className="text-sm text-gold">
                Pedido registrado. Abrimos o WhatsApp com sua mensagem pronta — se não abrir, fale
                com a casa diretamente.
              </p>
            )}
            {status === "error" && <p className="text-sm text-gold-soft">{error}</p>}
          </form>
        </Reveal>
      </div>
    </section>
  );
}
