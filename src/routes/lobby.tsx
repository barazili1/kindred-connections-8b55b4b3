import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";

import logo from "@/assets/brand-logo.jpg";
import { ParticlesBackground } from "@/components/ParticlesBackground";
import { Reveal } from "@/components/Reveal";
import { useUserId } from "@/components/UserIdGate";
import { games } from "@/data/games";
import { slugify } from "@/lib/predict";

export const Route = createFileRoute("/lobby")({
  head: () => ({
    meta: [
      { title: "Lobby — Smart Odds" },
      {
        name: "description",
        content:
          "Browse casino and instant win games in the Smart Odds lobby, from crash classics to slots and hold-and-win hits.",
      },
      { property: "og:title", content: "Lobby — Smart Odds" },
      {
        property: "og:description",
        content: "Browse casino and instant win games in the Smart Odds lobby.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Lobby,
});

const instantGames = games.filter((g) => g.category === "instant");

function Lobby() {
  const [query, setQuery] = useState("");
  const [usersOnline, setUsersOnline] = useState(2417);
  const { userId, ready } = useUserId();
  const navigate = useNavigate();

  useEffect(() => {
    if (ready && !userId) navigate({ to: "/terms" });
  }, [ready, userId, navigate]);

  useEffect(() => {
    const id = window.setInterval(() => {
      setUsersOnline((n) =>
        Math.min(3200, Math.max(1800, n + Math.round((Math.random() - 0.5) * 24))),
      );
    }, 4000);
    return () => window.clearInterval(id);
  }, []);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? instantGames.filter((g) => g.name.toLowerCase().includes(q)) : instantGames;
  }, [query]);

  const headerLabel = "Instant games";

  return (
    <>
      <ParticlesBackground />
      <main className="relative z-10 min-h-screen pb-20">
        {/* Top bar */}
        <header className="sticky top-0 z-30 border-b border-border bg-background/40 backdrop-blur-xl">
          <div className="mx-auto flex max-w-6xl flex-nowrap items-center justify-between gap-1.5 px-3 py-2">
            <span className="shrink-0 bg-gradient-to-b from-accent to-primary bg-clip-text text-[11px] font-extrabold tracking-[0.14em] text-transparent">
              Smart Odds
            </span>
            {userId ? (
              <span className="max-w-[38%] truncate rounded-full border border-primary/40 bg-primary/10 px-2 py-0.5 text-[9px] font-bold tracking-wider text-foreground">
                ID: {userId}
              </span>
            ) : null}
            <span className="flex shrink-0 items-center gap-1 whitespace-nowrap rounded-full border border-border px-2 py-0.5 text-[9px] font-medium text-muted-foreground">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/70" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
              </span>
              Online:{" "}
              <span className="text-foreground">{usersOnline.toLocaleString("en-US")}</span>
            </span>
          </div>
        </header>

        <div className="mx-auto max-w-6xl">
          {/* Hero */}
          <section className="relative flex flex-col items-center px-4 pt-8">
            <div className="pointer-events-none absolute left-1/2 top-0 h-56 w-56 -translate-x-1/2 rounded-full bg-primary/25 blur-[80px]" />
            <img
              src={logo}
              alt="Smart Odds logo"
              width={1238}
              height={864}
              className="relative w-44 max-w-full rounded-2xl drop-shadow-[0_0_38px_oklch(0.66_0.26_300/0.65)]"
            />
            <h1 className="relative mt-3 bg-gradient-to-b from-accent via-foreground to-primary bg-clip-text text-3xl font-extrabold tracking-[0.2em] text-transparent">
              Smart Odds
            </h1>
            <p className="relative mt-2 text-center text-xs text-muted-foreground">
              {instantGames.length} instant games · live multipliers
            </p>

            {/* Search */}
            <label className="relative mt-5 flex w-full max-w-md items-center gap-2 rounded-full border border-border px-4 py-2.5 backdrop-blur-md focus-within:border-primary focus-within:shadow-[0_0_24px_oklch(0.66_0.26_300/0.35)]">
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                className="h-4 w-4 shrink-0 text-muted-foreground"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5" />
              </svg>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search games…"
                className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
              />
            </label>
          </section>

          {/* Grid */}
          <section className="px-4 pt-6">
            <div className="flex items-baseline justify-between">
              <div className="flex items-center gap-2">
                <span className="h-4 w-1 rounded-full bg-gradient-to-b from-accent to-primary" />
                <h2 className="text-sm font-bold uppercase tracking-widest text-foreground">
                  {headerLabel}
                </h2>
              </div>
              <span className="text-xs text-muted-foreground">{visible.length} games</span>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {visible.map((game, i) => {
                return (
                <Reveal key={game.name} delay={(i % 8) * 60} className="h-full">
                <CardShell
                  key={game.name}
                  slug={slugify(game.name)}
                  className="group relative overflow-hidden rounded-2xl border border-accent/30 text-left backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-accent hover:shadow-[0_0_26px_oklch(0.8_0.18_180/0.4)]"
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={game.image}
                      alt={`${game.name} game artwork`}
                      loading={i < 6 ? "eager" : "lazy"}
                      width={301}
                      height={180}
                      className="aspect-[301/180] w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <span className="absolute inset-0 flex items-center justify-center bg-background/60 opacity-0 backdrop-blur-[2px] transition-opacity duration-300 group-hover:opacity-100">
                      <span className="rounded-full bg-gradient-to-r from-primary to-accent px-4 py-1.5 text-[11px] font-bold uppercase tracking-widest text-primary-foreground shadow-[0_0_22px_oklch(0.66_0.26_300/0.6)]">
                        Play
                      </span>
                    </span>
                  </div>
                  <span className="block px-2.5 py-2">
                    <span className="block truncate text-xs font-semibold text-card-foreground">
                      {game.name}
                    </span>
                    <span className="mt-1 flex items-center gap-1.5">
                      <span
                        className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent"
                      />
                      <span className="truncate text-[9px] text-muted-foreground" dir="rtl">
                        Instant
                      </span>
                    </span>
                  </span>
                </CardShell>
                </Reveal>
                );
              })}
            </div>

            {visible.length === 0 && (
              <p className="py-16 text-center text-sm text-muted-foreground">
                No games match “{query}”.
              </p>
            )}
          </section>
        </div>
      </main>
    </>
  );
}

function CardShell({
  slug,
  className,
  children,
}: {
  slug?: string | undefined;
  className: string;
  children: React.ReactNode;
}) {
  if (slug) {
    return (
      <Link to="/game/$slug" params={{ slug }} className={className}>
        {children}
      </Link>
    );
  }
  return (
    <button type="button" className={className}>
      {children}
    </button>
  );
}


