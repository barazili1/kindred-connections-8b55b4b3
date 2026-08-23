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
    ring: "border-accent/50",
    bar: "from-accent to-primary",
  },
  stable: {
    dot: "bg-primary",
    text: "text-primary",
    ring: "border-primary/30",
    bar: "from-primary to-primary/40",
  },
  unstable: {
    dot: "bg-destructive",
    text: "text-destructive",
    ring: "border-destructive/35",
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

  const avgLuck = useMemo(() => {
    const vals = instantGames.map((g) => luckMap[g.name]?.luck ?? 70);
    return Math.round(vals.reduce((a, b) => a + b, 0) / Math.max(1, vals.length));
  }, [luckMap]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return instantGames.filter((g) => {
      if (q && !g.name.toLowerCase().includes(q)) return false;
      if (filter !== "all" && luckMap[g.name]?.level !== filter) return false;
      return true;
    });
  }, [query, filter, luckMap]);

  const progress = Math.min(
    100,
    Math.max(0, ((now - slot.start) / Math.max(1, slot.endsAt - slot.start)) * 100),
  );

  return (
    <main className="relative z-10 min-h-screen pb-20">
      {/* Ambient background */}
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(110%_60%_at_50%_-10%,oklch(0.541_0.145_15/0.22),transparent_65%)]" />
      <div className="pointer-events-none fixed inset-x-0 bottom-0 -z-10 h-56 bg-[radial-gradient(60%_100%_at_50%_100%,oklch(0.64_0.145_10/0.12),transparent_70%)]" />

      {/* Top bar */}
      <header className="sticky top-0 z-30 border-b border-primary/15 bg-background/25 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center gap-2 px-3 py-2">
          <img
            src={logo}
            alt="Smart Odds logo"
            width={1238}
            height={864}
            className="h-7 w-10 shrink-0 rounded-md object-cover"
          />
          <span className="gold-shimmer-text shrink-0 text-[11px] font-extrabold tracking-[0.16em]">
            Smart Odds
          </span>
          <span className="ms-auto flex shrink-0 items-center gap-1 rounded-full border border-primary/25 px-2 py-0.5 text-[9px] text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            {usersOnline.toLocaleString("en-US")}
          </span>
          {userId ? (
            <span className="max-w-[32%] truncate rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-[9px] font-bold text-foreground">
              {userId}
            </span>
          ) : null}
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4">
        {/* Luck console */}
        <Reveal>
          <section className="relative mt-4 overflow-hidden rounded-3xl border border-primary/25 bg-card/30 p-4 backdrop-blur-xl">
            <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary/20 blur-3xl" />
            <div className="relative flex items-start justify-between gap-3" dir="rtl">
              <div className="text-right">
                <p className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
                  محرك نسب الحظ
                </p>
                <h1 className="mt-1 text-lg font-black text-foreground">
                  الجولة #{slot.index} شغالة دلوقتي
                </h1>
                <p className="mt-1 text-[11px] text-muted-foreground">
                  النسب بتتحدث تلقائيًا لكل الألعاب
                </p>
              </div>
              <div className="shrink-0 rounded-2xl border border-accent/40 bg-background/25 px-3 py-2 text-center">
                <p className="font-mono text-xl font-black tabular-nums text-accent">
                  {fmtLeft(slot.endsAt - now)}
                </p>
                <p className="text-[8px] uppercase tracking-[0.2em] text-muted-foreground">
                  next update
                </p>
              </div>
            </div>
            <div className="relative mt-3 h-1.5 overflow-hidden rounded-full bg-muted/50">
              <div
                className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-[width] duration-1000"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="relative mt-3 grid grid-cols-3 gap-2">
              <Stat label="Games" value={String(instantGames.length)} />
              <Stat label="Hot now" value={String(hotGames.length)} tone="text-accent" />
              <Stat label="Avg luck" value={`${avgLuck}%`} />
            </div>
          </section>
        </Reveal>

        {/* Hot rail */}
        {hotGames.length > 0 && (
          <Reveal>
            <section className="mt-6">
              <div className="flex items-center gap-2">
                <span className="h-4 w-1 rounded-full bg-gradient-to-b from-accent to-primary" />
                <h2 className="text-xs font-bold uppercase tracking-[0.22em] text-foreground">
                  Hot luck now
                </h2>
                <span className="ms-auto text-[10px] text-muted-foreground" dir="rtl">
                  ننصحك بيها
                </span>
              </div>
              <div className="rail-scroller rail-mask -mx-4 mt-3 overflow-x-auto px-4">
                <div className="flex w-max gap-3 pb-2">
                  {hotGames.map((g) => (
                    <Link
                      key={g.name}
                      to="/game/$slug"
                      params={{ slug: slugify(g.name) }}
                      className="group relative w-40 shrink-0 overflow-hidden rounded-2xl border border-accent/40 bg-card/30 transition-transform duration-300 hover:-translate-y-1"
                    >
                      <img
                        src={g.image}
                        alt={`${g.name} artwork`}
                        loading="lazy"
                        width={301}
                        height={180}
                        className="aspect-[301/180] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background to-transparent px-2 pb-1.5 pt-6">
                        <span className="block truncate text-[11px] font-semibold text-foreground">
                          {g.name}
                        </span>
                        <span className="text-[9px] font-bold text-accent">
                          {luckMap[g.name]?.luck}% luck
                        </span>
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </section>
          </Reveal>
        )}

        {/* Sticky search + filters */}
        <section className="sticky top-[45px] z-20 -mx-4 mt-6 bg-background/25 px-4 py-3 backdrop-blur-xl">
          <label className="flex items-center gap-2 rounded-2xl border border-primary/25 bg-card/30 px-3 py-2 transition-shadow focus-within:border-accent">
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
          <div className="rail-scroller mt-2 flex items-center gap-2 overflow-x-auto pb-0.5" dir="rtl">
            {filters.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setFilter(f.id)}
                className={`shrink-0 rounded-full border px-3.5 py-1.5 text-[11px] font-bold transition-all active:scale-95 ${
                  filter === f.id
                    ? "border-accent bg-accent/15 text-accent"
                    : "border-primary/20 text-muted-foreground hover:border-primary hover:text-foreground"
                }`}
              >
                {f.label}
              </button>
            ))}
            <span className="ms-auto shrink-0 text-[11px] text-muted-foreground">
              {visible.length} games
            </span>
          </div>
        </section>

        {/* Grid */}
        <section className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {visible.map((game, i) => {
            const info = luckMap[game.name] ?? { level: "stable" as LuckLevel, luck: 70 };
            const s = levelStyles[info.level];
            return (
              <Reveal key={game.name} delay={(i % 8) * 50} className="h-full">
                <Link
                  to="/game/$slug"
                  params={{ slug: slugify(game.name) }}
                  className={`group relative flex h-full flex-col overflow-hidden rounded-2xl border bg-card/30 text-left transition-all duration-300 hover:-translate-y-1 ${s.ring}`}
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={game.image}
                      alt={`${game.name} game artwork`}
                      loading={i < 6 ? "eager" : "lazy"}
                      width={301}
                      height={180}
                      className="aspect-[301/180] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <span
                      className={`absolute right-1.5 top-1.5 rounded-full border border-background/40 bg-background/25 px-2 py-0.5 text-[9px] font-black backdrop-blur-md ${s.text}`}
                    >
                      {info.luck}%
                    </span>
                  </div>
                  <span className="flex flex-1 flex-col px-2.5 py-2">
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
        </section>

        {visible.length === 0 && (
          <p className="py-16 text-center text-sm text-muted-foreground">
            No games match “{query}”.
          </p>
        )}
      </div>
    </main>
  );
}

function Stat({ label, value, tone }: { label: string; value: string; tone?: string }) {
  return (
    <div className="rounded-xl border border-primary/20 bg-background/25 px-2 py-1.5 text-center">
      <p className="text-[8px] uppercase tracking-[0.2em] text-muted-foreground">{label}</p>
      <p className={`mt-0.5 font-mono text-sm font-black ${tone ?? "text-foreground"}`}>{value}</p>
    </div>
  );
}
