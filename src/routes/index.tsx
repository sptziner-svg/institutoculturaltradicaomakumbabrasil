import { createFileRoute } from "@tanstack/react-router";

import { Reveal } from "@/components/Reveal";
import { WhatsAppButton, WHATSAPP_DISPLAY } from "@/components/WhatsAppButton";

const TITLE = "Instituto Cultural Tradição Makumba Brasil";
const DESCRIPTION =
  "Casa de tradição que guarda, transmite e resgata a Makumba Carioca, a Quimbanda, o Culto Tradicional Yorùbá, a Bruxaria Ibero Celta, o Hoodoo e a Pajelança.";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: `${TITLE} — Tradição, ancestralidade e ensinamento` },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: TITLE,
          description: DESCRIPTION,
          telephone: "+5513997274710",
        }),
      },
    ],
  }),
});

const missao = [
  {
    titulo: "Guardar e resgatar",
    texto:
      "Transmitir e proteger as tradições, conservando suas essências e trazendo à luz toda a sua cultura e seus ensinamentos.",
  },
  {
    titulo: "Ancestralidade",
    texto:
      "Promover o aprimoramento humano pela conexão viva com a ancestralidade, pelo culto e pela escuta dos mais velhos.",
  },
  {
    titulo: "Ensino e medicinas",
    texto:
      "Ensinar com responsabilidade e cuidar através das medicinas tradicionais de cada vertente, sem misturas.",
  },
];

const vertentes = [
  {
    nome: "Makumba Carioca",
    texto: "A raiz urbana carioca, com seus pontos, seus assentamentos e sua forma própria de trabalhar.",
  },
  {
    nome: "Quimbanda",
    texto: "Culto aos Exus e Pombagiras, com liturgia, hierarquia e responsabilidade próprias.",
  },
  {
    nome: "Culto Tradicional Yorùbá",
    texto: "O culto aos Òrìṣà na forma tradicional, com seus fundamentos, rezas e obrigações.",
  },
  {
    nome: "Bruxaria Tradicional Ibero Celta",
    texto: "A feitiçaria dos antigos povos ibéricos e celtas: ervas, ossos, encantos e a terra.",
  },
  {
    nome: "Hoodoo",
    texto: "A magia popular afro-americana, feita de trabalho de mão, raízes, salmos e ancestrais.",
  },
  {
    nome: "Pajelança",
    texto: "A tradição de cura brasileira, com seus caboclos, defumações e a medicina da floresta.",
  },
];

function Index() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Abertura */}
      <section className="relative overflow-hidden px-5 pt-16 pb-20 sm:pt-24">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-40 left-1/2 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-gold/12 blur-3xl"
        />
        <div className="relative mx-auto flex max-w-3xl flex-col items-center text-center">
          <Reveal>
            <p className="font-display text-[0.7rem] tracking-[0.35em] text-gold uppercase">
              Casa de Tradição
            </p>
          </Reveal>

          <Reveal delay={100}>
            <h1 className="mt-5 text-3xl leading-tight text-balance-tight sm:text-5xl">
              Instituto Cultural
              <span className="mt-1 block text-gold">Tradição Makumba Brasil</span>
            </h1>
          </Reveal>

          <Reveal delay={200} className="w-full">
            <div className="mx-auto mt-8 w-40 gold-rule sm:w-56" />
          </Reveal>

          <Reveal delay={250}>
            <div className="relative mt-10">
              <div
                aria-hidden
                className="absolute inset-0 -m-3 rounded-full bg-gradient-to-b from-gold/40 to-blood/30 blur-md"
              />
              <img
                src={tataFoto.url}
                alt="Tatá Rogério, dirigente do Instituto Cultural Tradição Makumba Brasil"
                width={480}
                height={480}
                className="relative h-52 w-52 rounded-full border border-gold/50 object-cover object-top sm:h-64 sm:w-64"
              />
            </div>
          </Reveal>

          <Reveal delay={320}>
            <p className="mt-6 font-display text-lg text-gold sm:text-xl">Tatá Rogério</p>
            <p className="mt-1 text-xs tracking-[0.2em] text-muted-foreground uppercase">
              Dirigente da casa
            </p>
          </Reveal>

          <Reveal delay={400}>
            <p className="mt-8 max-w-xl text-base leading-relaxed text-balance-tight text-muted-foreground sm:text-lg">
              Guardamos, ensinamos e resgatamos as tradições — cada uma no seu lugar, com o
              respeito que a ancestralidade pede.
            </p>
          </Reveal>

          <Reveal delay={480}>
            <div className="mt-9">
              <WhatsAppButton large>Fale com a casa</WhatsAppButton>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Quem Somos */}
      <section className="border-t border-border/60 px-5 py-20">
        <div className="mx-auto max-w-3xl">
          <Reveal>
            <p className="font-display text-[0.7rem] tracking-[0.35em] text-gold uppercase">
              01 — Quem Somos
            </p>
            <h2 className="mt-4 text-2xl leading-snug text-balance-tight sm:text-4xl">
              Uma instituição cultural e religiosa de muitas raízes.
            </h2>
          </Reveal>
          <Reveal delay={120}>
            <div className="mt-8 space-y-5 text-base leading-relaxed text-muted-foreground sm:text-lg">
              <p>
                Abrangemos várias vertentes culturais e religiosas, respeitando a
                individualidade de cada uma e cultuando-as em separado.
              </p>
              <p>
                Nada é misturado. Cada tradição tem seu fundamento, sua liturgia e seu tempo — e é
                assim que ela se mantém viva.
              </p>
              <p className="border-l-2 border-gold/70 pl-5 text-foreground">
                Entre as principais estão a Makumba Carioca, a Quimbanda, o Culto Tradicional
                Yorùbá, a Bruxaria Tradicional Ibero Celta, o Hoodoo e a Pajelança.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Missão */}
      <section className="relative border-t border-border/60 px-5 py-20">
        <div className="mx-auto max-w-4xl">
          <Reveal>
            <p className="font-display text-[0.7rem] tracking-[0.35em] text-gold uppercase">
              02 — Nossa Missão
            </p>
            <h2 className="mt-4 text-2xl leading-snug text-balance-tight sm:text-4xl">
              Transmitir, guardar e resgatar.
            </h2>
          </Reveal>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {missao.map((item, i) => (
              <Reveal key={item.titulo} delay={120 + i * 100}>
                <article className="h-full rounded-sm border border-border/70 bg-card/60 p-6">
                  <span className="font-display text-sm text-gold">{`0${i + 1}`}</span>
                  <h3 className="mt-3 text-lg text-foreground">{item.titulo}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {item.texto}
                  </p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Vertentes */}
      <section className="border-t border-border/60 px-5 py-20">
        <div className="mx-auto max-w-5xl">
          <Reveal>
            <p className="font-display text-[0.7rem] tracking-[0.35em] text-gold uppercase">
              03 — As Vertentes
            </p>
            <h2 className="mt-4 text-2xl leading-snug text-balance-tight sm:text-4xl">
              Cada tradição cultuada em seu próprio lugar.
            </h2>
          </Reveal>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {vertentes.map((v, i) => (
              <Reveal key={v.nome} delay={100 + i * 80}>
                <article className="group h-full rounded-sm border border-border/70 bg-card/50 p-6 transition-colors hover:border-gold/70 hover:bg-card">
                  <div className="h-px w-8 bg-blood transition-all group-hover:w-16 group-hover:bg-gold" />
                  <h3 className="mt-5 font-display text-lg text-foreground group-hover:text-gold">
                    {v.nome}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{v.texto}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Dirigente */}
      <section className="border-t border-border/60 px-5 py-20">
        <div className="mx-auto grid max-w-5xl items-center gap-10 md:grid-cols-2">
          <Reveal>
            <img
              src={tataFoto.url}
              alt="Tatá Rogério, dirigente da casa"
              width={720}
              height={720}
              className="w-full rounded-sm border border-gold/30 object-cover"
              loading="lazy"
            />
          </Reveal>
          <Reveal delay={140}>
            <p className="font-display text-[0.7rem] tracking-[0.35em] text-gold uppercase">
              04 — O Dirigente
            </p>
            <h2 className="mt-4 text-2xl leading-snug sm:text-4xl">Tatá Rogério</h2>
            <div className="mt-6 space-y-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
              <p>
                Dirigente do Instituto Cultural Tradição Makumba Brasil, é quem conduz os cultos,
                os ensinamentos e as obrigações da casa.
              </p>
              <p>
                Seu trabalho é manter cada tradição no seu fundamento, orientar quem chega e
                entregar às próximas gerações aquilo que recebeu dos mais velhos.
              </p>
            </div>
            <div className="mt-8">
              <WhatsAppButton>Falar com o Tatá</WhatsAppButton>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Contato */}
      <section className="relative overflow-hidden border-t border-border/60 px-5 py-24 text-center">
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-0 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-blood/25 blur-3xl"
        />
        <div className="relative mx-auto max-w-2xl">
          <p className="font-display text-[0.7rem] tracking-[0.35em] text-gold uppercase">
            05 — Contato
          </p>
          <h2 className="mt-4 text-2xl leading-snug text-balance-tight sm:text-4xl">
            A porta está aberta para quem chega com respeito.
          </h2>
          <p className="mt-6 text-base leading-relaxed text-muted-foreground">
            Fale com a casa pelo WhatsApp {WHATSAPP_DISPLAY} para orientações, atendimentos e
            informações sobre os cultos.
          </p>
          <div className="mt-9">
            <WhatsAppButton large>WhatsApp {WHATSAPP_DISPLAY}</WhatsAppButton>
          </div>
        </div>
      </section>

      <footer className="border-t border-border/60 px-5 py-10 text-center">
        <div className="mx-auto w-24 gold-rule" />
        <p className="mt-6 font-display text-sm tracking-widest text-gold uppercase">
          Instituto Cultural Tradição Makumba Brasil
        </p>
        <p className="mt-2 text-xs text-muted-foreground">
          Tradição, ancestralidade e ensinamento.
        </p>
      </footer>
    </main>
  );
}
