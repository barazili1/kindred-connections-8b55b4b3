import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";

import logo from "@/assets/casino-ai-logo.png";
import { ParticlesBackground } from "@/components/ParticlesBackground";
import { useUserId } from "@/components/UserIdGate";
import { games, type Game } from "@/data/games";
import { slugify } from "@/lib/predict";
import { getLuckMap, getLuckSlot, luckShortLabels, type LuckInfo } from "@/lib/luck";

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

type TopCategory = "casino" | "instant";
type LuckFilter = "all" | "hot" | "stable" | "unstable";

const luckFilters: { id: LuckFilter; label: string }[] = [
  { id: "all", label: "All games" },
  { id: "hot", label: "Recommended" },
  { id: "stable", label: "Stable" },
  { id: "unstable", label: "Unstable" },
];

const casinoGames = games.filter((g) => g.category === "casino");
const instantGames = games.filter((g) => g.category === "instant");

function Lobby() {
  const [topCategory, setTopCategory] = useState<TopCategory>("casino");
  const [luckFilter, setLuckFilter] = useState<LuckFilter>("all");
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

  // Luck rotation (client-only to keep SSR markup stable)
  const [slot, setSlot] = useState<{ index: number; endsAt: number } | null>(null);

  useEffect(() => {
    let timer: number;
    const tick = () => {
      const s = getLuckSlot(Date.now());
      setSlot({ index: s.index, endsAt: s.endsAt });
      timer = window.setTimeout(tick, Math.max(1000, s.endsAt - Date.now()));
    };
    tick();
    return () => window.clearTimeout(timer);
  }, []);

  const luckMap = useMemo(
    () => (slot ? getLuckMap(slot.index) : ({} as Record<string, LuckInfo>)),
    [slot],
  );

  const hotGames = useMemo(
    () => casinoGames.filter((g) => luckMap[g.name]?.level === "hot"),
    [luckMap],
  );
  const stableGames = useMemo(
    () => casinoGames.filter((g) => luckMap[g.name]?.level === "stable"),
    [luckMap],
  );

  const visible = useMemo(() => {
    const source = topCategory === "casino" ? casinoGames : instantGames;
    const byLuck =
      topCategory === "instant"
        ? source
        : luckFilter === "all"
          ? source
          : source.filter((g) => luckMap[g.name]?.level === luckFilter);
    const q = query.trim().toLowerCase();
    return q
      ? byLuck.filter((g) => g.name.toLowerCase().includes(q))
      : byLuck;
  }, [topCategory, luckFilter, query, luckMap]);

  const isCasino = topCategory === "casino";
  const headerLabel =
    topCategory === "instant"
      ? "Instant games"
      : luckFilters.find((f) => f.id === luckFilter)?.label ?? "All games";

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
              width={816}
              height={816}
              className="relative w-24 drop-shadow-[0_0_38px_oklch(0.66_0.26_300/0.65)]"
            />
            <h1 className="relative mt-3 bg-gradient-to-b from-accent via-foreground to-primary bg-clip-text text-3xl font-extrabold tracking-[0.2em] text-transparent">
              Smart Odds
            </h1>
            <p className="relative mt-2 text-center text-xs text-muted-foreground">
              {casinoGames.length} casino · {instantGames.length} instant · live multipliers
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

          {/* Top-level category tabs: Casino / Instant games */}
          <nav className="mt-7 px-4">
            <div className="flex items-center gap-1 rounded-2xl border border-border p-1 backdrop-blur-md">
              {(
                [
                  { id: "casino", label: "Casino" },
                  { id: "instant", label: "Instant games" },
                ] as { id: TopCategory; label: string }[]
              ).map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTopCategory(t.id)}
                  className={`flex-1 rounded-xl px-4 py-2.5 text-sm font-bold transition-all ${
                    topCategory === t.id
                      ? "bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-[0_0_24px_oklch(0.66_0.26_300/0.5)]"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </nav>

          {/* Luck rails + luck filters — only under Casino */}
          {isCasino && (
            <>
              <LuckRail
                title="ننصحك بتجربة الألعاب"
                subtitle="Recommended now"
                luck={90}
                tone="hot"
                list={hotGames}
              />
              <LuckRail
                title="ألعاب مستقرة"
                subtitle="Stable games"
                luck={70}
                tone="stable"
                list={stableGames}
              />

              {/* Luck filters */}
              <nav className="mt-8 px-4">
                <div className="flex items-center gap-1 rounded-full border border-border p-1 backdrop-blur-md">
                  {luckFilters.map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setLuckFilter(f.id)}
                      className={`flex-1 rounded-full px-3 py-2 text-xs font-semibold transition-all ${
                        luckFilter === f.id
                          ? "bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-[0_0_20px_oklch(0.66_0.26_300/0.5)]"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </nav>
            </>
          )}

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
                const level = isCasino ? luckMap[game.name]?.level : undefined;
                return (
                <CardShell
                  key={game.name}
                  slug={game.category === "instant" ? slugify(game.name) : undefined}
                  className={`group relative overflow-hidden rounded-2xl border text-left backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 ${
                    !isCasino
                      ? "border-accent/30 hover:border-accent hover:shadow-[0_0_26px_oklch(0.8_0.18_180/0.4)]"
                      : level === "hot"
                        ? "border-accent shadow-[0_0_0_1px_oklch(0.8_0.18_180/0.6),0_0_26px_oklch(0.8_0.18_180/0.7),0_0_60px_oklch(0.8_0.18_180/0.45)] hover:shadow-[0_0_0_2px_oklch(0.8_0.18_180/0.8),0_0_40px_oklch(0.8_0.18_180/0.9),0_0_90px_oklch(0.8_0.18_180/0.6)]"
                        : level === "stable"
                          ? "border-primary/50 hover:border-primary hover:shadow-[0_0_30px_oklch(0.66_0.26_300/0.45)]"
                          : "border-border/40 opacity-65 saturate-[0.6] hover:border-primary/60 hover:opacity-100 hover:saturate-100 hover:shadow-[0_0_14px_oklch(0.66_0.26_300/0.25)]"
                  }`}
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
                    {isCasino && luckMap[game.name] && (
                      <LuckBadge info={luckMap[game.name]!} />
                    )}
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
                        className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                          !isCasino
                            ? "bg-accent"
                            : luckMap[game.name]?.level === "hot"
                              ? "bg-accent"
                              : luckMap[game.name]?.level === "stable"
                                ? "bg-primary"
                                : "bg-muted-foreground/50"
                        }`}
                      />
                      <span className="truncate text-[9px] text-muted-foreground" dir="rtl">
                        {!isCasino
                          ? "Instant"
                          : luckMap[game.name]
                            ? luckShortLabels[luckMap[game.name]!.level]
                            : "Casino"}
                      </span>
                    </span>
                  </span>
                </CardShell>
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

function LuckBadge({ info }: { info: LuckInfo }) {
  const hot = info.level === "hot";
  const stable = info.level === "stable";
  const tone = hot
    ? "border-accent/60 text-accent shadow-[0_0_18px_oklch(0.8_0.18_180/0.35)]"
    : stable
      ? "border-primary/60 text-primary shadow-[0_0_18px_oklch(0.66_0.26_300/0.35)]"
      : "border-border text-muted-foreground";

  return (
    <span
      className={`absolute right-2 top-2 flex items-center gap-1 rounded-full border bg-background/70 px-2 py-0.5 text-[10px] font-bold backdrop-blur-md ${tone}`}
    >
      {hot || stable ? (
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={3}
          className="h-2.5 w-2.5"
        >
          <path d="M12 20V5m0 0-6 6m6-6 6 6" />
        </svg>
      ) : (
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={3}
          className="h-2.5 w-2.5"
        >
          <path d="M12 4v15m0 0 6-6m-6 6-6-6" />
        </svg>
      )}
      {hot ? `Recommended ${info.luck}%` : stable ? "Stable" : `${info.luck}%`}
    </span>
  );
}

function LuckRail({
  title,
  subtitle,
  luck,
  tone,
  list,
}: {
  title: string;
  subtitle: string;
  luck: number;
  tone: "hot" | "stable";
  list: Game[];
}) {
  if (list.length === 0) return null;
  const hot = tone === "hot";
  const loop = [...list, ...list];

  return (
    <section className="mt-7 px-4">
      <div
        className={`relative overflow-hidden rounded-[26px] border bg-gradient-to-b from-foreground/[0.04] to-transparent p-[18px] backdrop-blur-xl ${
          hot
            ? "border-accent/25 shadow-[0_18px_60px_-24px_oklch(0.8_0.18_180/0.45)]"
            : "border-primary/25 shadow-[0_18px_60px_-24px_oklch(0.66_0.26_300/0.45)]"
        }`}
      >
        <span
          className={`pointer-events-none absolute -top-24 left-1/2 h-48 w-[70%] -translate-x-1/2 rounded-full blur-[80px] ${
            hot ? "bg-accent/15" : "bg-primary/15"
          }`}
        />

        {/* Header */}
        <div className="relative flex items-center justify-between gap-3">
          <div className="min-w-0">
            <span className="block truncate text-[15px] font-extrabold tracking-tight text-foreground" dir="rtl">
              {title}
            </span>
            <span className="mt-0.5 block text-[9px] uppercase tracking-[0.28em] text-muted-foreground">
              {subtitle}
            </span>
          </div>
          <span
            className={`flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] font-bold backdrop-blur-md ${
              hot
                ? "border-accent/50 bg-accent/10 text-accent"
                : "border-primary/50 bg-primary/10 text-primary"
            }`}
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={3}
              className="h-3 w-3"
            >
              <path d="M12 20V5m0 0-6 6m6-6 6 6" />
            </svg>
            <span className="tabular-nums">{luck}%</span>
          </span>
        </div>

        <span
          className={`relative mt-3 block h-px w-full ${
            hot
              ? "bg-gradient-to-r from-transparent via-accent/40 to-transparent"
              : "bg-gradient-to-r from-transparent via-primary/40 to-transparent"
          }`}
        />

        {/* Auto-scrolling rail */}
        <div className="rail-mask rail-scroller relative -mx-[18px] mt-4 overflow-x-auto overflow-y-hidden">
          <div className="animate-rail flex w-max gap-3 px-[18px]">
            {loop.map((game, i) => (
              <span
                key={`${game.name}-${i}`}
                className={`group relative block w-40 shrink-0 overflow-hidden rounded-2xl border bg-background/20 transition-all duration-300 hover:-translate-y-1 ${
                  hot
                    ? "border-accent/20 hover:border-accent/70 hover:shadow-[0_0_28px_-4px_oklch(0.8_0.18_180/0.5)]"
                    : "border-primary/20 hover:border-primary/70 hover:shadow-[0_0_28px_-4px_oklch(0.66_0.26_300/0.5)]"
                }`}
              >
                <img
                  src={game.image}
                  alt={`${game.name} game artwork`}
                  loading="lazy"
                  width={301}
                  height={180}
                  className="aspect-[301/180] w-full object-cover"
                />
                <span
                  className={`absolute right-1.5 top-1.5 rounded-full border bg-background/75 px-1.5 py-0.5 text-[9px] font-bold tabular-nums backdrop-blur-md ${
                    hot ? "border-accent/50 text-accent" : "border-primary/50 text-primary"
                  }`}
                >
                  ↑{luck}%
                </span>
                <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background via-background/75 to-transparent px-2 pb-1.5 pt-6">
                  <span className="block truncate text-[11px] font-semibold text-foreground">
                    {game.name}
                  </span>
                </span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
