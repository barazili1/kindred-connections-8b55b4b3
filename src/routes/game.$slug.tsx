import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";

import appleCellAsset from "@/assets/g/apple-cell.png.asset.json";
import appleGoodAsset from "@/assets/g/apple-good.png.asset.json";
import minesGemAsset from "@/assets/g/mines-gem.png.asset.json";
import ballAsset from "@/assets/t/ball.png.asset.json";
import cupAsset from "@/assets/t/cup.png.asset.json";
import { ParticlesBackground } from "@/components/ParticlesBackground";
import { useUserId } from "@/components/UserIdGate";
import {
  APPLE_FEED_USER_ID,
  fetchAppleRows,
  randomizeAppleRows,
  fetchCrashMultiplier,
} from "@/lib/appleFirebase";
import {
  buildEnterDelayMs,
  buildPrediction,
  formatEnterTime,
  getGameBySlug,
  getKind,
  type Prediction,
} from "@/lib/predict";

export const Route = createFileRoute("/game/$slug")({
  loader: ({ params }) => {
    const game = getGameBySlug(params.slug);
    if (!game) throw notFound();
    return { name: game.name, image: game.image };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Unavailable — Smart Odds" }, { name: "robots", content: "noindex" }] };
    }
    const title = `${loaderData.name} predictor — Smart Odds`;
    const description = `AI signal predictor for ${loaderData.name}: get a predicted round and the best moment to enter the game.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
        { property: "og:image", content: loaderData.image },
        { name: "twitter:image", content: loaderData.image },
      ],
    };
  },
  component: GamePredictor,
  notFoundComponent: () => (
    <main className="relative z-10 flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="text-xl font-bold text-foreground">Game not found</h1>
      <Link to="/lobby" className="text-sm text-primary underline">
        Back to lobby
      </Link>
    </main>
  ),
});

type Phase = "idle" | "waiting" | "ready";

/** Games whose board is revealed one row at a time. */
const rowKinds = ["eastern", "swamp", "cashout", "apple"];

function fmt(ms: number) {
  const s = Math.max(0, Math.ceil(ms / 1000));
  return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
}

function GamePredictor() {
  const { name, image } = Route.useLoaderData();
  const kind = getKind(name);

  const [phase, setPhase] = useState<Phase>("idle");
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [remaining, setRemaining] = useState(0);
  const [enterAt, setEnterAt] = useState<number | null>(null);
  const [total, setTotal] = useState(1);
  const timer = useRef<number | null>(null);
  const [placeholder, setPlaceholder] = useState<Prediction | null>(null);
  const [revealCount, setRevealCount] = useState(0);
  const isRowGame = rowKinds.includes(kind);
  const { userId } = useUserId();
  const useFeed = kind === "apple" && userId === APPLE_FEED_USER_ID;
  const useCrashFeed = kind === "crash" && userId === APPLE_FEED_USER_ID;
  const [feedRows, setFeedRows] = useState<boolean[][] | null>(null);

  useEffect(() => {
    if (!useFeed) {
      setFeedRows(null);
      return;
    }
    let alive = true;
    fetchAppleRows()
      .then((rows) => alive && setFeedRows(rows))
      .catch(() => alive && setFeedRows(null));
    return () => {
      alive = false;
    };
  }, [useFeed]);

  const revealNextRow = () => {
    if (!prediction) {
      setPrediction(buildPrediction(kind));
      setRevealCount(1);
      return;
    }
    setRevealCount((n) => n + 1);
  };

  const resetRows = () => {
    setPrediction(null);
    setRevealCount(0);
    if (useFeed) {
      randomizeAppleRows()
        .then(fetchAppleRows)
        .then(setFeedRows)
        .catch(() => undefined);
    }
  };

  useEffect(() => {
    setPlaceholder(buildPrediction(kind));
  }, [kind]);

  useEffect(() => {
    if (phase !== "waiting" || enterAt == null) return;
    const tick = () => {
      const left = enterAt - Date.now();
      setRemaining(left);
      if (left <= 0) setPhase("ready");
    };
    tick();
    timer.current = window.setInterval(tick, 250);
    return () => {
      if (timer.current) window.clearInterval(timer.current);
    };
  }, [phase, enterAt]);

  const start = () => {
    const base = buildPrediction(kind);
    setPrediction(base);
    if (useCrashFeed) {
      void fetchCrashMultiplier().then((m) => {
        if (m == null) return;
        setPrediction({
          kind: "crash",
          multiplier: `${m.toFixed(2)}x`,
          safeCashout: `${Math.max(1.2, m * 0.62).toFixed(2)}x`,
          round: Math.floor(100000 + Math.random() * 899999),
        });
      });
    }
    const delay = buildEnterDelayMs();
    setTotal(delay);
    setEnterAt(Date.now() + delay);
    setPhase("waiting");
  };

  const reset = () => {
    setPhase("idle");
    setPrediction(null);
    setEnterAt(null);
  };

  return (
    <>
      <ParticlesBackground />
      <main className="relative z-10 min-h-screen pb-24">
        <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(120%_80%_at_50%_-10%,oklch(0.85_0.15_88/0.12),transparent_60%)]" />
        <header className="sticky top-0 z-30 border-b border-gold/25 bg-background/60 backdrop-blur-xl">
          <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
            <Link
              to="/lobby"
              className="flex items-center gap-1.5 rounded-full border border-gold/25 px-3 py-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:border-gold/60 hover:text-gold"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.5}
                className="h-4 w-4"
              >
                <path d="m14 6-6 6 6 6" />
              </svg>
              Lobby
            </Link>
            <span className="gold-text text-sm font-extrabold tracking-[0.32em]">
              Smart Odds
            </span>
          </div>
        </header>

        <div className="mx-auto max-w-3xl px-4">
          {/* Game hero */}
          <section className="luxe-panel luxe-hairline animate-rise relative mt-6 overflow-hidden">
            <img
              src={image}
              alt={`${name} game artwork`}
              width={301}
              height={180}
              className="h-44 w-full object-cover opacity-60 sm:h-60"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/75 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4">
              <div>
                <h1 className="gold-text text-xl font-black tracking-tight sm:text-3xl">{name}</h1>
                <p className="mt-1 text-[10px] uppercase tracking-[0.34em] text-muted-foreground">
                  AI Signal Predictor
                </p>
              </div>
              <span className="flex items-center gap-1.5 rounded-full border border-gold/50 bg-background/70 px-3 py-1 text-[10px] font-bold tracking-widest text-gold backdrop-blur-md">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold/70" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-gold" />
                </span>
                LIVE
              </span>
            </div>
          </section>

          {/* Prediction board */}
          <section className="luxe-panel luxe-hairline animate-rise relative mt-5 overflow-hidden p-5">
            <div className="pointer-events-none absolute -left-16 -top-16 h-48 w-48 rounded-full bg-primary/15 blur-[70px]" />
            <div className="pointer-events-none absolute -bottom-16 -right-10 h-48 w-48 rounded-full bg-gold/10 blur-[70px]" />

            {kind !== "none" && (
              <>
                <div className="relative flex items-center justify-between border-b border-gold/15 pb-3">
                  <h2 className="gold-text text-xs font-black uppercase tracking-[0.3em]">
                    Prediction
                  </h2>
                  <span className="text-[10px] font-semibold text-muted-foreground" dir="rtl">
                    توقّع الجيم القادم
                  </span>
                </div>

                <div
                  className={`relative mt-4 transition-all duration-500 ${
                    prediction ? "opacity-100" : "select-none opacity-40 blur-[6px]"
                  }`}
                >
                  {(prediction ?? placeholder) && (
                    <Board
                      prediction={(prediction ?? placeholder)!}
                      revealed={prediction !== null}
                      revealCount={isRowGame ? revealCount : Infinity}
                      appleRows={feedRows}
                    />
                  )}
                </div>
              </>
            )}

            {/* Status / CTA */}
            <div className="relative mt-6">
              {isRowGame ? (
                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={revealNextRow}
                    className="gold-button luxe-sheen w-full rounded-2xl px-6 py-4 text-base font-black uppercase tracking-[0.25em] transition-transform active:scale-[0.98]"
                  >
                    <span className="relative z-10">{revealCount === 0 ? "بدأ" : "الصف التالي"}</span>
                  </button>
                  {revealCount > 0 && (
                    <button
                      type="button"
                      onClick={resetRows}
                      className="w-full rounded-full border border-gold/30 px-5 py-2 text-xs font-bold uppercase tracking-[0.25em] text-muted-foreground transition-colors hover:border-gold hover:text-gold"
                    >
                      توقع جديد
                    </button>
                  )}
                </div>
              ) : null}

              {!isRowGame && phase === "idle" && (
                <button
                  type="button"
                  onClick={start}
                  className="gold-button luxe-sheen w-full rounded-2xl px-6 py-4 text-base font-black uppercase tracking-[0.25em] transition-transform active:scale-[0.98]"
                >
                  <span className="relative z-10">بدأ</span>
                </button>
              )}

              {!isRowGame && phase === "waiting" && (
                <div className="luxe-panel p-5 text-center">
                  <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                    Enter at
                  </p>
                  <p className="gold-text mt-1 font-mono text-2xl font-extrabold">
                    {enterAt != null ? formatEnterTime(enterAt) : "--:--"}
                  </p>
                  <p className="mt-3 text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                    Next entry in
                  </p>
                  <p className="mt-1 font-mono text-4xl font-black text-foreground drop-shadow-[0_0_22px_oklch(0.85_0.15_88/0.35)]">
                    {fmt(remaining)}
                  </p>
                  <p className="mt-2 text-xs text-muted-foreground" dir="rtl">
                    استنى لحد ما ييجي الوقت المناسب… متخشش دلوقتي
                  </p>
                  <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-muted/60">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-gold-deep via-gold to-gold-soft transition-[width] duration-300"
                      style={{
                        width: `${Math.min(100, Math.max(0, 100 - (remaining / total) * 100))}%`,
                      }}
                    />
                  </div>
                </div>
              )}

              {!isRowGame && phase === "ready" && (
                <div className="luxe-panel border-gold/60 p-6 text-center shadow-[0_0_60px_-15px_oklch(0.85_0.15_88/0.6)]">
                  <p className="gold-text text-3xl font-black" dir="rtl">
                    خش جيم 🚀
                  </p>
                  <p className="mt-2 text-xs text-muted-foreground" dir="rtl">
                    دخول الآن على {name} بالتوقع اللي فوق
                  </p>
                  <p className="mt-1 font-mono text-xs text-gold">
                    {enterAt != null ? formatEnterTime(enterAt) : ""}
                  </p>
                  <button
                    type="button"
                    onClick={reset}
                    className="mt-4 rounded-full border border-gold/30 px-5 py-2 text-xs font-bold uppercase tracking-[0.25em] text-muted-foreground transition-colors hover:border-gold hover:text-gold"
                  >
                    توقع جديد
                  </button>
                </div>
              )}
            </div>

            <p className="relative mt-4 text-center text-[10px] leading-relaxed text-muted-foreground/70">
              Predictions are statistical suggestions only and never guarantee an outcome.
            </p>
          </section>
        </div>
      </main>
    </>
  );
}


function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="luxe-panel p-3 text-center">
      <p className="text-[9px] uppercase tracking-[0.28em] text-muted-foreground">{label}</p>
      <p className="gold-text mt-1 text-lg font-black">{value}</p>
    </div>
  );
}

const cellBase =
  "relative flex aspect-square items-center justify-center overflow-hidden rounded-xl border border-gold/20 bg-[linear-gradient(180deg,oklch(0.22_0.05_300/0.75),oklch(0.11_0.03_300/0.85))] text-lg shadow-[inset_0_1px_0_oklch(1_0_0/0.1),0_6px_14px_-8px_oklch(0_0_0/0.9)] transition-all duration-300";
const cellSafe =
  "border-gold bg-[linear-gradient(180deg,oklch(0.85_0.15_88/0.35),oklch(0.62_0.13_75/0.25))] text-gold-soft shadow-[0_0_26px_oklch(0.85_0.15_88/0.55),inset_0_1px_0_oklch(1_0_0/0.25)]";
const cellIdle = "text-muted-foreground/70";
const cellHidden = "border-dashed border-gold/15 text-muted-foreground/30 opacity-70";

function Board({
  prediction,
  revealed,
  revealCount = Infinity,
  appleRows = null,
}: {
  prediction: Prediction;
  revealed: boolean;
  revealCount?: number;
  appleRows?: boolean[][] | null;
}) {
  switch (prediction.kind) {
    case "crash":
      return (
        <div>
          <div className="relative overflow-hidden luxe-panel p-6 text-center">
            <svg
              aria-hidden="true"
              viewBox="0 0 300 100"
              className="absolute inset-x-0 bottom-0 h-20 w-full text-accent/40"
              preserveAspectRatio="none"
            >
              <path d="M0 100 C120 100 200 60 300 0 L300 100 Z" fill="currentColor" opacity="0.15" />
              <path d="M0 100 C120 100 200 60 300 0" fill="none" stroke="currentColor" strokeWidth="2" />
            </svg>
            <p className="relative text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
              Predicted crash
            </p>
            <p className="relative mt-1 font-mono text-5xl font-extrabold gold-text">
              {prediction.multiplier}
            </p>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <Stat label="Safe cashout" value={prediction.safeCashout} />
            <Stat label="Round" value={`#${prediction.round}`} />
          </div>
        </div>
      );

    case "dice":
      return (
        <div>
          <div className="luxe-panel p-6 text-center">
            <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
              Roll {prediction.direction}
            </p>
            <p className="mt-1 font-mono text-5xl font-extrabold text-primary drop-shadow-[0_0_22px_oklch(0.66_0.26_300/0.7)]">
              {prediction.target}
            </p>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <Stat label="Direction" value={prediction.direction === "over" ? "Over" : "Under"} />
            <Stat label="Win chance" value={`${prediction.chance}%`} />
          </div>
        </div>
      );

    case "thimbles":
      return (
        <div className="luxe-panel p-4">
          <div className="grid grid-cols-3 items-end gap-3">
            {[0, 1, 2].map((i) => {
              const hit = revealed && i === prediction.pick;
              return (
                <div key={i} className="flex flex-col items-center">
                  <div
                    className={`relative w-full rounded-2xl px-2 pt-2 transition-all duration-500 ${
                      hit ? "drop-shadow-[0_0_26px_oklch(0.8_0.18_180/0.7)]" : ""
                    }`}
                  >
                    <img
                      src={cupAsset.url}
                      alt={`Thimble cup ${i + 1}`}
                      width={200}
                      height={200}
                      className={`mx-auto h-auto w-full transition-transform duration-500 ${
                        hit ? "-translate-y-2 scale-105" : "opacity-80"
                      }`}
                    />
                  </div>
                  <div className="mt-1 h-1 w-full rounded-full bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
                  <div className="mt-2 flex h-10 items-center justify-center">
                    {hit ? (
                      <img
                        src={ballAsset.url}
                        alt="Predicted ball position"
                        width={80}
                        height={80}
                        className="h-9 w-9 animate-[pulse-glow_2s_ease-in-out_infinite] drop-shadow-[0_0_18px_oklch(0.8_0.18_180/0.8)]"
                      />
                    ) : (
                      <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                        #{i + 1}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          <p className="mt-2 text-center text-[11px] text-muted-foreground" dir="rtl">
            الكوبّاية اللي تحتها الكورة هي المتوقّعة
          </p>
        </div>
      );

    case "mines":
      return (
        <div>
          <div className="grid grid-cols-5 gap-2">
            {Array.from({ length: prediction.total }, (_, i) => {
              const safe = prediction.safe.includes(i);
              return (
                <div
                  key={i}
                  className={`${cellBase} ${safe ? cellSafe : cellIdle}`}
                >
                  {safe ? (
                    <img
                      src={minesGemAsset.url}
                      alt="Diamond"
                      className="animate-reveal absolute inset-0 h-full w-full object-cover drop-shadow-[0_0_10px_oklch(0.85_0.15_88/0.6)]"
                    />
                  ) : (
                    <span className="text-muted-foreground/60">◆</span>
                  )}
                </div>
              );
            })}
          </div>
          <p className="mt-3 text-center text-[11px] text-muted-foreground" dir="rtl">
            الخانات المضيئة هي المتوقّعة آمنة
          </p>
        </div>
      );

    case "goal":
      return (
        <div>
          <div className="grid grid-cols-2 gap-3">
            {[0, 1].map((i) => {
              const hit = i === prediction.pick;
              return (
                <div
                  key={i}
                  className={`flex aspect-[4/3] flex-col items-center justify-center gap-2 rounded-2xl border transition-all duration-300 ${
                    hit
                      ? "animate-reveal border-gold bg-gold/10 shadow-[0_0_30px_oklch(0.85_0.15_88/0.5)]"
                      : "border-border bg-muted/25"
                  }`}
                >
                  <span className={`text-4xl ${hit ? "animate-float" : "opacity-60"}`}>
                    {i === 0 ? "⚽" : "🚫"}
                  </span>
                  <span
                    className={`text-xs font-black uppercase tracking-[0.2em] ${
                      hit ? "text-gold" : "text-muted-foreground"
                    }`}
                  >
                    {i === 0 ? "Goal" : "No Goal"}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="mt-3 grid grid-cols-1 gap-3">
            <Stat label="Suggested shots" value={String(prediction.corners)} />
          </div>
        </div>
      );

    case "wheel":
      return <Stat label="Predicted segment" value={prediction.segment} />;

    case "swamp":
      return (
        <div className="space-y-2 luxe-panel p-3">
          {prediction.rows.map((row, r) => {
            const shown = r >= prediction.rows.length - revealCount;
            return (
            <div key={r} className={`flex items-center gap-2 ${shown ? "animate-rise" : ""}`}>
              <span className="w-16 shrink-0 rounded-lg border border-gold/40 py-1 text-center text-[10px] font-bold text-gold">
                {row.multiplier}
              </span>
              <div
                className="grid flex-1 gap-2"
                style={{ gridTemplateColumns: `repeat(${prediction.cols}, minmax(0, 1fr))` }}
              >
                {Array.from({ length: prediction.cols }, (_, c) => {
                  const safe = shown && c === row.safe;
                  return (
                    <div
                      key={c}
                      className={`${cellBase} ${safe ? cellSafe : shown ? cellIdle : cellHidden}`}
                    >
                      <span className={safe ? "animate-reveal" : ""}>{safe ? "🐸" : "🍃"}</span>
                    </div>
                  );
                })}
              </div>
            </div>
            );
          })}
          <p className="pt-1 text-center text-[11px] text-muted-foreground" dir="rtl">
            الورقة المضيئة في كل صف هي الطريق الآمن
          </p>
        </div>
      );

    case "gems":
      return (
        <div>
          <div
            className="grid gap-1 luxe-panel p-2"
            style={{ gridTemplateColumns: `repeat(${prediction.cols}, minmax(0, 1fr))` }}
          >
            {prediction.grid.map((sym, i) => {
              const hit = prediction.cluster.includes(i);
              return (
                <div
                  key={i}
                  className={`${cellBase} rounded-lg text-sm ${hit ? cellSafe : cellIdle}`}
                >
                  {sym}
                </div>
              );
            })}
          </div>
          <div className="mt-3 grid grid-cols-1 gap-3">
            <Stat label="Predicted cluster" value={`${prediction.cluster.length} gems`} />
          </div>
        </div>
      );

    case "none":
      return null;

    case "cashout":
      return (
        <div className="space-y-3">
          {prediction.steps.slice(0, revealCount).map((s, i) => (
            <div
              key={i}
              className="flex items-center justify-between gap-3 rounded-2xl border border-gold/50 bg-gold/10 px-4 py-3 shadow-[0_0_26px_oklch(0.85_0.15_88/0.3)]"
              dir="rtl"
            >
              <span className="text-sm font-extrabold text-gold">اسحب الآن</span>
              <span className="font-mono text-xs text-muted-foreground">الخطوة {s.step}</span>
              <span className="font-mono text-lg font-extrabold text-foreground">{s.multiplier}</span>
            </div>
          ))}
          <p className="text-center text-[11px] text-muted-foreground" dir="rtl">
            اسحب عند المضاعفات اللي فوق — التوقيت عشوائي كل جيم
          </p>
        </div>
      );

    case "apple":
      return (
        <div className="space-y-2 luxe-panel p-3">
          {prediction.rows.map((row, r) => {
            const shown = r >= prediction.rows.length - revealCount;
            return (
              <div key={r} className={`flex justify-center gap-2 ${shown ? "animate-rise" : ""}`}>
                {Array.from({ length: row.cols }, (_, c) => {
                  const feedRow = appleRows?.[r];
                  const safe = shown && (feedRow ? feedRow[c] === true : c === row.safe);
                  return (
                    <div
                      key={c}
                      className={`flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border transition-all duration-300 ${
                        safe
                          ? "border-gold bg-gold/20 shadow-[0_0_20px_oklch(0.85_0.15_88/0.55)]"
                          : "border-border bg-muted/30"
                      }`}
                    >
                      <img
                        src={safe ? appleGoodAsset.url : appleCellAsset.url}
                        alt={safe ? "تفاحة سليمة" : "خانة"}
                        width={40}
                        height={40}
                        className={`h-9 w-9 object-contain ${safe ? "animate-reveal" : "opacity-80"}`}
                      />
                    </div>
                  );
                })}
              </div>
            );
          })}
          <p className="pt-1 text-center text-[11px] text-muted-foreground" dir="rtl">
            اضغط الزر عشان يظهر صف واحد كل مرة — التفاحة السليمة هي المتوقّعة
          </p>
        </div>
      );

    case "eastern":
      return (
        <div className="space-y-1.5 luxe-panel p-3">
          {prediction.rows.map((row, r) => {
            const shown = r >= prediction.rows.length - revealCount;
            const cashout = shown && r === prediction.cashoutRow;
            return (
              <div key={r} className={`flex items-center gap-2 ${shown ? "animate-rise" : ""}`}>
                <div
                  className="grid flex-1 gap-1.5"
                  style={{ gridTemplateColumns: `repeat(${prediction.cols}, minmax(0, 1fr))` }}
                >
                  {Array.from({ length: prediction.cols }, (_, c) => {
                    const safe = shown && c === row.safe;
                    return (
                      <div
                        key={c}
                        className={`${cellBase} rounded-lg text-xs ${
                          safe ? cellSafe : shown ? cellIdle : cellHidden
                        }`}
                      >
                        <span className={safe ? "animate-reveal" : ""}>{safe ? "✦" : "·"}</span>
                      </div>
                    );
                  })}
                </div>
                {cashout && (
                  <span
                    className="shrink-0 rounded-full border border-gold bg-gold/10 px-2 py-1 text-[10px] font-extrabold text-gold shadow-[0_0_18px_oklch(0.85_0.15_88/0.5)]"
                    dir="rtl"
                  >
                    اسحب الآن
                  </span>
                )}
              </div>
            );
          })}
          <p className="pt-1 text-center text-[11px] text-muted-foreground" dir="rtl">
            اضغط الزر عشان يظهر صف واحد كل مرة — الخانة المضيئة هي المتوقّعة
          </p>
        </div>
      );

    default:
      return (
        <div>
          <div className="grid grid-cols-3 gap-2 luxe-panel p-3">
            {prediction.reels.map((reel, c) => (
              <div key={c} className="grid gap-2">
                {reel.map((sym, r) => (
                  <div
                    key={r}
                    className={`flex aspect-square items-center justify-center rounded-xl border text-2xl ${
                      r === prediction.payline - 1
                        ? "border-gold bg-gold/10 shadow-[0_0_24px_oklch(0.85_0.15_88/0.45)]"
                        : "border-border/50 opacity-60"
                    }`}
                  >
                    {sym}
                  </div>
                ))}
              </div>
            ))}
          </div>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <Stat label="Spins" value={String(prediction.spins)} />
            <Stat label="Payline" value={`#${prediction.payline}`} />
          </div>
        </div>
      );
  }
}
