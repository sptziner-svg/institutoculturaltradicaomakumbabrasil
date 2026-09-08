import { createFileRoute } from "@tanstack/react-router";

import { Reveal } from "@/components/Reveal";
import { WhatsAppButton, WHATSAPP_DISPLAY } from "@/components/WhatsAppButton";

const TITLE = "Jogos e Oráculos — Instituto Cultural Tradição Makumba Brasil";
const DESCRIPTION =
  "Consultas oraculares com tata Rogério: Ẹ̀rìndínlógún (jogo de búzios) e Oráculo de Quimbanda. Agende seu horário pelo WhatsApp.";

export const Route = createFileRoute("/jogos")({
  component: JogosPage,
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/jogos" }],
  }),
});

const oraculos = [
  {
    nome: "Ẹ̀rìndínlógún",
    subtitulo: "Jogo dos dezesseis búzios",
    texto:
      "O oráculo tradicional Yorùbá, lido nos búzios. Fala pela voz dos Òrìṣà e da ancestralidade: aponta caminhos, o que está em desequilíbrio e o que precisa ser feito. É consulta de fundamento, conduzida com reza e responsabilidade.",
  },
  {
    nome: "Oráculo de Quimbanda",
    subtitulo: "Consulta com Exus e Pombagiras",
    texto:
      "A leitura própria da Quimbanda, feita dentro da sua liturgia e hierarquia. Direta e objetiva, trata da vida como ela é: caminhos travados, demandas, defesa, trabalho e as respostas do povo da esquerda.",
  },
];

function JogosPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="border-b border-border/60 px-5 pt-16 pb-14">
        <div className="mx-auto max-w-3xl text-center">
          <Reveal>
            <p className="font-display text-[0.7rem] tracking-[0.35em] text-gold uppercase">
              Oráculos
            </p>
            <h1 className="mt-5 text-3xl leading-tight text-balance-tight sm:text-5xl">
              Os jogos da casa
            </h1>
            <div className="mx-auto mt-8 w-40 gold-rule" />
            <p className="mt-8 text-base leading-relaxed text-muted-foreground sm:text-lg">
              As consultas são feitas por tata Rogério, cada oráculo dentro do seu próprio
              fundamento — nada é misturado.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="px-5 py-16">
        <div className="mx-auto grid max-w-4xl gap-5 md:grid-cols-2">
          {oraculos.map((o, i) => (
            <Reveal key={o.nome} delay={100 + i * 120}>
              <article className="h-full rounded-sm border border-border/70 bg-card/50 p-7 transition-colors hover:border-gold/70 hover:bg-card">
                <div className="h-px w-8 bg-blood" />
                <h2 className="mt-5 font-display text-xl text-gold">{o.nome}</h2>
                <p className="mt-1 text-xs tracking-[0.2em] text-muted-foreground uppercase">
                  {o.subtitulo}
                </p>
                <p className="mt-5 text-base leading-relaxed text-muted-foreground">{o.texto}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="relative overflow-hidden border-t border-border/60 px-5 py-20 text-center">
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-0 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-blood/25 blur-3xl"
        />
        <div className="relative mx-auto max-w-2xl">
          <h2 className="text-2xl leading-snug text-balance-tight sm:text-4xl">
            Agende seu horário agora
          </h2>
          <p className="mt-5 text-base leading-relaxed text-muted-foreground">
            As consultas são marcadas pelo WhatsApp {WHATSAPP_DISPLAY}. Diga qual oráculo você
            procura e a casa retorna com os horários disponíveis.
          </p>
          <div className="mt-9">
            <WhatsAppButton large>Agende seu horário agora</WhatsAppButton>
          </div>
        </div>
      </section>
    </main>
  );
}
