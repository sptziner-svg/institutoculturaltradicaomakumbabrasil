import { Reveal } from "@/components/Reveal";

const ADDRESS = "Rua Oito, Jd Aguapeú — Itanhaém/SP";
const MAPS_QUERY = encodeURIComponent("Rua Oito, Jardim Aguapeu, Itanhaém, SP, Brasil");

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
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${MAPS_QUERY}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-block font-display text-xs tracking-widest text-gold uppercase underline decoration-gold/40 underline-offset-4"
          >
            Abrir no mapa
          </a>
        </Reveal>

        <Reveal delay={140}>
          <div className="mt-8 overflow-hidden rounded-sm border border-gold/30">
            <iframe
              title="Mapa da localização do instituto em Itanhaém"
              src="https://www.openstreetmap.org/export/embed.html?bbox=-46.835%2C-24.203%2C-46.775%2C-24.163&layer=mapnik&marker=-24.183%2C-46.805"
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
