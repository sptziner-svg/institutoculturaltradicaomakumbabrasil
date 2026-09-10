import { Link } from "@tanstack/react-router";

import logoAsset from "@/assets/logo-instituto.jpg.asset.json";

const sections = [
  { hash: "quem-somos", label: "A casa" },
  { hash: "jogos", label: "Jogos" },
  { hash: "eventos", label: "Eventos" },
  { hash: "blog", label: "Diário" },
  { hash: "endereco", label: "Endereço" },
  { hash: "participar", label: "Fazer parte" },
] as const;

export function SiteNav() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/90 backdrop-blur">
      <nav className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-5 py-3">
        <Link to="/" className="flex items-center gap-3">
          <img
            src={logoAsset.url}
            alt="Logo do Instituto Cultural Tradição Makumba Brasil"
            width={40}
            height={40}
            className="h-9 w-9 rounded-full border border-gold/40 object-cover"
          />
          <span className="font-display text-[0.7rem] tracking-[0.25em] text-gold uppercase">
            Tradição Makumba Brasil
          </span>
        </Link>
        <ul className="flex flex-wrap items-center gap-x-4 gap-y-1">
          {sections.map((s) => (
            <li key={s.hash}>
              <Link
                to="/"
                hash={s.hash}
                className="font-display text-[0.65rem] tracking-[0.2em] text-muted-foreground uppercase transition-colors hover:text-gold"
              >
                {s.label}
              </Link>
            </li>
          ))}
          <li>
            <Link
              to="/auth"
              className="font-display text-[0.65rem] tracking-[0.2em] text-gold/70 uppercase transition-colors hover:text-gold"
            >
              Entrar
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
