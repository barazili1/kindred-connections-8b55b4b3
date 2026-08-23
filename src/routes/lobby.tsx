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
        content: "Instant games with live luck rates.",
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
    ring: "border-accent/45",
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

function Lobby() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<LuckLevel | "all">("all");
  const [usersOnline, setUsersOnline] = useState(2417);
  const [slotIndex, setSlotIndex] = useState(() => getLuckSlot(Date.now()).index);
  const { userId, ready } = useUserId();
  const navigate = useNavigate();

  useEffect(() => {
    if (ready && !userId) navigate({ to: "/terms" });
  }, [ready, userId, navigate]);

  useEffect(() => {
    const id = window.setInterval(() => {
      setSlotIndex(getLuckSlot(Date.now()).index);
      setUsersOnline((n) =>
        Math.min(3200, Math.max(1800, n + Math.round((Math.random() - 0.5) * 24))),
      );
    }, 3000);
    return () => window.clearInterval(id);
  }, []);

  const luckMap = useMemo(() => getLuckMap(slotIndex), [slotIndex]);

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

  return (
    <main className="relative z-10 min-h-screen pb-20">
      {/* Top bar */}
      <header className="sticky top-0 z-30 border-b border-accent/15 bg-background/35 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-6xl items-center gap-2.5 px-4 py-2.5">
          <img
            src={logo}
            alt="Smart Odds logo"
            width={1253}
            height={844}
            className="h-9 w-14 shrink-0 rounded-lg border border-accent/25 object-cover"
          />
          <span className="shrink-0 text-[11px] font-extrabold tracking-[0.22em] text-accent">
            SMART ODDS
          </span>
          <span className="ms-auto flex shrink-0 items-center gap-1.5 rounded-full border border-accent/25 px-2.5 py-1 text-[9px] text-muted-foreground">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
            {usersOnline.toLocaleString("en-US")}
          </span>
          {userId ? (
            <span className="max-w-[30%] truncate rounded-full border border-accent/25 px-2.5 py-1 text-[9px] font-bold text-foreground/80">
              {userId}
            </span>
          ) : null}
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4">
        {/* Stats */}
        <Reveal>
          <section className="mt-5 grid grid-cols-3 gap-2.5">
            <Stat label="Games" value={String(instantGames.length)} />
            <Stat label="Hot now" value={String(hotGames.length)} tone="text-accent" />
            <Stat label="Avg luck" value={`${avgLuck}%`} />
          </section>
        </Reveal>

        {/* Hot rail */}
        {hotGames.length > 0 && (
          <Reveal>
            <section className="mt-7">
              <div className="flex items-center gap-2">
                <span className="h-4 w-1 rounded-full bg-accent" />
                <h2 className="text-[11px] font-bold uppercase tracking-[0.24em] text-foreground/90">
                  Hot luck now
                </h2>
                <span className="ms-auto text-[10px] text-muted-foreground" dir="rtl">
                  اسحب للجانب ←
                </span>
              </div>
              <div className="rail-scroller rail-mask -mx-4 mt-3 overflow-x-auto scroll-smooth px-4 [scroll-snap-type:x_mandatory]">
                <div className="flex w-max gap-3 pb-2">
                  {hotGames.map((g) => (
                    <Link
                      key={g.name}
                      to="/game/$slug"
                      params={{ slug: slugify(g.name) }}
                      className="group relative w-40 shrink-0 overflow-hidden rounded-2xl border border-accent/25 bg-card/10 backdrop-blur-sm transition-all duration-300 [scroll-snap-align:start] hover:-translate-y-1 hover:border-accent/60"
                    >
                      <img
                        src={g.image}
                        alt={`${g.name} artwork`}
                        loading="lazy"
                        width={301}
                        height={180}
                        className="aspect-[301/180] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background via-background/70 to-transparent px-2.5 pb-2 pt-7">
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

        {/* Search + filters */}
        <section className="sticky top-[57px] z-20 -mx-4 mt-6 bg-background/35 px-4 py-3 backdrop-blur-2xl">
          <label className="flex items-center gap-2 rounded-full border border-accent/20 bg-card/10 px-4 py-2.5 transition-colors focus-within:border-accent/70">
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
          <div className="rail-scroller mt-2.5 flex items-center gap-2 overflow-x-auto pb-0.5" dir="rtl">
            {filters.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setFilter(f.id)}
                className={`shrink-0 rounded-full border px-4 py-1.5 text-[11px] font-bold transition-all active:scale-95 ${
                  filter === f.id
                    ? "border-accent/70 bg-accent/10 text-accent"
                    : "border-accent/15 text-muted-foreground hover:border-accent/40 hover:text-foreground"
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
        <section className="mt-2 grid grid-cols-2 gap-3.5 sm:grid-cols-3 lg:grid-cols-4">
          {visible.map((game, i) => {
            const info = luckMap[game.name] ?? { level: "stable" as LuckLevel, luck: 70 };
            const s = levelStyles[info.level];
            return (
              <Reveal key={game.name} delay={(i % 8) * 50} className="h-full">
                <Link
                  to="/game/$slug"
                  params={{ slug: slugify(game.name) }}
                  className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-accent/12 bg-card/10 text-left backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-accent/45 hover:shadow-[0_18px_40px_-24px_oklch(0.84_0.17_160/0.8)]"
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
                      className={`absolute right-2 top-2 rounded-full border border-accent/25 bg-background/60 px-2 py-0.5 text-[9px] font-black backdrop-blur-md ${s.text}`}
                    >
                      {info.luck}%
                    </span>
                  </div>
                  <span className="flex flex-1 flex-col px-3 py-2.5">
                    <span className="block truncate text-[12.5px] font-semibold text-card-foreground">
                      {game.name}
                    </span>
                    <span className="mt-1.5 flex items-center gap-1.5" dir="rtl">
                      <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${s.dot}`} />
                      <span className={`truncate text-[9px] font-semibold ${s.text}`}>
                        {luckShortLabels[info.level]}
                      </span>
                    </span>
                    <span className="mt-2 block h-1 overflow-hidden rounded-full bg-foreground/10">
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
    <div className="rounded-2xl border border-accent/15 bg-card/10 px-3 py-2.5 text-center backdrop-blur-md">
      <p className="text-[8px] uppercase tracking-[0.24em] text-muted-foreground">{label}</p>
      <p className={`mt-1 font-mono text-base font-black ${tone ?? "text-foreground"}`}>{value}</p>
    </div>
  );
}
