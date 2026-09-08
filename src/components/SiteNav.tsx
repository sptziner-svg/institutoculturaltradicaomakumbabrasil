import { Link } from "@tanstack/react-router";

const links = [
  { to: "/", label: "Início" },
  { to: "/jogos", label: "Jogos" },
  { to: "/eventos", label: "Eventos" },
] as const;

export function SiteNav() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/90 backdrop-blur">
      <nav className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-5 py-3">
        <Link to="/" className="font-display text-[0.7rem] tracking-[0.25em] text-gold uppercase">
          Tradição Makumba Brasil
        </Link>
        <ul className="flex items-center gap-4">
          {links.map((l) => (
            <li key={l.to}>
              <Link
                to={l.to}
                activeProps={{ className: "text-gold" }}
                activeOptions={{ exact: l.to === "/" }}
                className="font-display text-[0.7rem] tracking-[0.2em] text-muted-foreground uppercase transition-colors hover:text-gold"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
