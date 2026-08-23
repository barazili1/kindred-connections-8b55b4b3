import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";

import logo from "@/assets/brand-logo.jpg";
import { Reveal } from "@/components/Reveal";
import { useUserId } from "@/components/UserIdGate";
import { games } from "@/data/games";
import { getLuckMap, getLuckSlot, luckShortLabels, type LuckLevel } from "@/lib/luck";
import { slugify } from "@/lib/predict";

export const Route = createFileRoute("/lobby")({
  head: () => ({
    meta: [
      { title: "Lobby — Smart Odds" },
      {
        name: "description",
        content:
          "Browse instant win games in the Smart Odds lobby with live luck rates, hot picks and unstable warnings.",
      },
      { property: "og:title", content: "Lobby — Smart Odds" },
      {
        property: "og:description",
        content: "Instant games with live luck rates updated every few minutes.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Lobby,
});

const instantGames = games.filter((g) => g.category === "instant");

const levelStyles: Record<LuckLevel, { dot: string; text: string; ring: string; bar: string }> = {
  hot: {
    dot: "bg-accent",
    text: "text-accent",
    ring: "border-accent/60 shadow-[0_0_26px_-6px_oklch(0.78_0.19_232/0.8)]",
    bar: "from-accent to-primary",
  },
  stable: {
    dot: "bg-primary",
    text: "text-primary",
    ring: "border-primary/40",
    bar: "from-primary to-primary/40",
  },
  unstable: {
    dot: "bg-destructive",
    text: "text-destructive",
    ring: "border-destructive/40",
    bar: "from-destructive to-destructive/40",
  },
};

const filters: { id: LuckLevel | "all"; label: string }[] = [
  { id: "all", label: "الكل" },
  { id: "hot", label: "ننصح بيها" },
  { id: "stable", label: "مستقرة" },
  { id: "unstable", label: "غير مستقرة" },
];

function fmtLeft(ms: number) {
  const s = Math.max(0, Math.ceil(ms / 1000));
  return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
}

function Lobby() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<LuckLevel | "all">("all");
  const [usersOnline, setUsersOnline] = useState(2417);
  const [now, setNow] = useState(() => Date.now());
  const { userId, ready } = useUserId();
  const navigate = useNavigate();

  useEffect(() => {
    if (ready && !userId) navigate({ to: "/terms" });
  }, [ready, userId, navigate]);

  useEffect(() => {
    const id = window.setInterval(() => {
      setNow(Date.now());
      setUsersOnline((n) =>
        Math.min(3200, Math.max(1800, n + Math.round((Math.random() - 0.5) * 24))),
      );
    }, 1000);
    return () => window.clearInterval(id);
  }, []);

  const slot = useMemo(() => getLuckSlot(now), [now]);
  const luckMap = useMemo(() => getLuckMap(slot.index), [slot.index]);

  const hotGames = useMemo(
    () => instantGames.filter((g) => luckMap[g.name]?.level === "hot").slice(0, 10),
    [luckMap],
  );

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return instantGames.filter((g) => {
      if (q && !g.name.toLowerCase().includes(q)) return false;
      if (filter !== "all" && luckMap[g.name]?.level !== filter) return false;
      return true;
    });
  }, [query, filter, luckMap]);

  return (
    <main className="relative z-10 min-h-screen pb-24">
      {/* Ambient background */}
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(120%_70%_at_50%_-10%,oklch(0.66_0.26_258/0.28),transparent_60%)]" />
      <div className="pointer-events-none fixed inset-x-0 bottom-0 -z-10 h-64 bg-[radial-gradient(60%_100%_at_50%_100%,oklch(0.78_0.19_232/0.14),transparent_70%)]" />

      {/* Top bar */}
      <header className="sticky top-0 z-30 border-b border-primary/20 bg-background/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl flex-nowrap items-center justify-between gap-1.5 px-3 py-2.5">
          <span className="gold-shimmer-text shrink-0 text-[11px] font-extrabold tracking-[0.16em]">
            Smart Odds
          </span>
          {userId ? (
            <span className="max-w-[38%] truncate rounded-full border border-primary/40 bg-primary/10 px-2 py-0.5 text-[9px] font-bold tracking-wider text-foreground">
              ID: {userId}
            </span>
          ) : null}
          <span className="flex shrink-0 items-center gap-1 whitespace-nowrap rounded-full border border-primary/25 px-2 py-0.5 text-[9px] font-medium text-muted-foreground">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent/70" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
            </span>
            Online: <span className="text-foreground">{usersOnline.toLocaleString("en-US")}</span>
          </span>
        </div>
      </header>

      <div className="mx-auto max-w-6xl">
        {/* Hero */}
        <section className="relative flex flex-col items-center px-4 pt-7">
          <div className="pointer-events-none absolute left-1/2 top-2 h-52 w-52 -translate-x-1/2 animate-pulse-glow rounded-full bg-primary/25 blur-[80px]" />
          <div className="luxe-ring animate-rise relative overflow-hidden rounded-2xl">
            <img
              src={logo}
              alt="Smart Odds logo"
              width={1238}
              height={864}
              className="animate-float w-44 max-w-full rounded-2xl"
            />
          </div>
          <h1 className="gold-shimmer-text animate-rise relative mt-3 text-3xl font-black tracking-[0.18em]">
            Smart Odds
          </h1>
          <p className="relative mt-1.5 text-center text-[11px] text-muted-foreground">
            {instantGames.length} instant games · live luck engine
          </p>

          {/* Luck slot banner */}
          <Reveal className="w-full max-w-md">
            <div className="luxe-panel luxe-hairline relative mt-5 overflow-hidden p-4">
              <div className="luxe-aurora pointer-events-none absolute inset-0 opacity-40" />
              <div className="relative flex items-center justify-between gap-3">
                <div dir="rtl" className="text-right">
                  <p className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
                    نسب الحظ
                  </p>
                  <p className="mt-1 text-sm font-bold text-foreground">
                    تحديث الجولة رقم #{slot.index}
                  </p>
                </div>
                <div className="text-center">
                  <p className="font-mono text-2xl font-black tabular-nums text-accent drop-shadow-[0_0_16px_oklch(0.78_0.19_232/0.6)]">
                    {fmtLeft(slot.endsAt - now)}
                  </p>
                  <p className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
                    next update
                  </p>
                </div>
              </div>
              <div className="relative mt-3 h-1.5 overflow-hidden rounded-full bg-muted/50">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-[width] duration-1000"
                  style={{
                    width: `${Math.min(
                      100,
                      Math.max(
                        0,
                        ((now - slot.start) / Math.max(1, slot.endsAt - slot.start)) * 100,
                      ),
                    )}%`,
                  }}
                />
              </div>
            </div>
          </Reveal>

          {/* Search */}
          <label className="relative mt-4 flex w-full max-w-md items-center gap-2 rounded-full border border-primary/25 bg-card px-4 py-2.5 backdrop-blur-md transition-shadow focus-within:border-accent focus-within:shadow-[0_0_24px_oklch(0.78_0.19_232/0.35)]">
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

        {/* Hot rail */}
        {hotGames.length > 0 && (
          <Reveal>
            <section className="mt-7">
              <div className="flex items-center gap-2 px-4">
                <span className="h-4 w-1 rounded-full bg-gradient-to-b from-accent to-primary" />
                <h2 className="text-xs font-bold uppercase tracking-[0.22em] text-foreground">
                  Hot luck now
                </h2>
                <span className="text-[10px] text-muted-foreground" dir="rtl">
                  ننصحك بتجربة الألعاب دي
                </span>
              </div>
              <div className="rail-scroller rail-mask mt-3 overflow-x-auto">
                <div className="flex w-max gap-3 px-4 pb-2">
                  {hotGames.map((g) => (
                    <Link
                      key={g.name}
                      to="/game/$slug"
                      params={{ slug: slugify(g.name) }}
                      className="group w-32 shrink-0 overflow-hidden rounded-2xl border border-accent/50 bg-card shadow-[0_0_22px_-10px_oklch(0.78_0.19_232/0.9)] transition-transform duration-300 hover:-translate-y-1"
                    >
                      <img
                        src={g.image}
                        alt={`${g.name} artwork`}
                        loading="lazy"
                        width={301}
                        height={180}
                        className="aspect-[301/180] w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <span className="block px-2 py-1.5">
                        <span className="block truncate text-[11px] font-semibold text-card-foreground">
                          {g.name}
                        </span>
                        <span className="text-[9px] font-bold text-accent">90% luck</span>
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </section>
          </Reveal>
        )}

        {/* Filters */}
        <section className="px-4 pt-6">
          <div className="flex flex-wrap items-center gap-2" dir="rtl">
            {filters.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setFilter(f.id)}
                className={`rounded-full border px-3.5 py-1.5 text-[11px] font-bold transition-all active:scale-95 ${
                  filter === f.id
                    ? "border-accent bg-accent/15 text-accent shadow-[0_0_20px_-8px_oklch(0.78_0.19_232/0.9)]"
                    : "border-primary/25 text-muted-foreground hover:border-primary hover:text-foreground"
                }`}
              >
                {f.label}
              </button>
            ))}
            <span className="ms-auto text-[11px] text-muted-foreground">{visible.length} games</span>
          </div>

          {/* Grid */}
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {visible.map((game, i) => {
              const info = luckMap[game.name] ?? { level: "stable" as LuckLevel, luck: 70 };
              const s = levelStyles[info.level];
              return (
                <Reveal key={game.name} delay={(i % 8) * 60} className="h-full">
                  <Link
                    to="/game/$slug"
                    params={{ slug: slugify(game.name) }}
                    className={`group relative flex h-full flex-col overflow-hidden rounded-2xl border bg-card text-left backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 ${s.ring}`}
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
                      <span
                        className={`absolute right-1.5 top-1.5 rounded-full border border-background/40 bg-background/70 px-2 py-0.5 text-[9px] font-black backdrop-blur-md ${s.text}`}
                      >
                        {info.luck}%
                      </span>
                      <span className="absolute inset-0 flex items-center justify-center bg-background/60 opacity-0 backdrop-blur-[2px] transition-opacity duration-300 group-hover:opacity-100">
                        <span className="gold-button rounded-full px-4 py-1.5 text-[11px] font-bold uppercase tracking-widest">
                          Play
                        </span>
                      </span>
                    </div>
                    <span className="block px-2.5 py-2">
                      <span className="block truncate text-xs font-semibold text-card-foreground">
                        {game.name}
                      </span>
                      <span className="mt-1.5 flex items-center gap-1.5" dir="rtl">
                        <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${s.dot}`} />
                        <span className={`truncate text-[9px] font-semibold ${s.text}`}>
                          {luckShortLabels[info.level]}
                        </span>
                      </span>
                      <span className="mt-1.5 block h-1 overflow-hidden rounded-full bg-muted/60">
                        <span
                          className={`block h-full rounded-full bg-gradient-to-r ${s.bar} transition-[width] duration-700`}
                          style={{ width: `${info.luck}%` }}
                        />
                      </span>
                    </span>
                  </Link>
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
  );
}
