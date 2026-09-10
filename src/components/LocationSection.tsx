import { Reveal } from "@/components/Reveal";

const ADDRESS = "Rua Oito, 200 — Pq Vergara / Aguapeú, Itanhaém — SP, 11744-036";
const MAPS_QUERY = encodeURIComponent("Rua Oito, 200, Aguapeu, Itanhaém - SP, 11744-036");
const LAT = -24.141437;
const LNG = -46.781188;
const D = 0.006;

export function LocationSection() {
  return (
    <section id="endereco" className="border-t border-border/60 px-5 py-20">
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <p className="font-display text-[0.7rem] tracking-[0.35em] text-gold uppercase">
            Onde estamos
          </p>
          <h2 className="mt-4 text-2xl leading-snug text-balance-tight sm:text-4xl">Endereço</h2>
          <address className="mt-5 text-base leading-relaxed text-muted-foreground not-italic">
            {ADDRESS}
          </address>
          <div className="mt-4 flex flex-wrap gap-5">
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${MAPS_QUERY}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block font-display text-xs tracking-widest text-gold uppercase underline decoration-gold/40 underline-offset-4"
            >
              Abrir no mapa
            </a>
            <a
              href="https://plus.codes/587MV659+CG"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block font-display text-xs tracking-widest text-muted-foreground uppercase underline decoration-border underline-offset-4 hover:text-gold"
            >
              Plus code V659+CG
            </a>
          </div>
        </Reveal>

        <Reveal delay={140}>
          <div className="mt-8 overflow-hidden rounded-sm border border-gold/30">
            <iframe
              title="Mapa da localização do instituto — Rua Oito, 200, Aguapeú, Itanhaém/SP"
              src={`https://www.openstreetmap.org/export/embed.html?bbox=${LNG - D}%2C${LAT - D}%2C${LNG + D}%2C${LAT + D}&layer=mapnik&marker=${LAT}%2C${LNG}`}
              className="h-72 w-full border-0 sm:h-96"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
