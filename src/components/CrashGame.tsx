import { Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";

import { buildPrediction } from "@/lib/predict";

type Phase = "idle" | "running" | "done";

function randomHistory() {
  return Array.from({ length: 8 }, () => Number((1 + Math.random() * 6).toFixed(2)));
}

/** Flight-deck styled crash predictor: animated odds dial, climbing curve and plane. */
export function CrashGame({ name, image }: { name: string; image: string }) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [value, setValue] = useState(1);
  const [target, setTarget] = useState<number | null>(null);
  const [round, setRound] = useState<number | null>(null);
  const [history, setHistory] = useState<number[]>(() => randomHistory());
  const raf = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, []);

  const start = () => {
    if (phase === "running") return;
    const p = buildPrediction("crash");
    const t = p.kind === "crash" ? Number.parseFloat(p.multiplier) : 2;
    setTarget(t);
    setRound(p.kind === "crash" ? p.round : null);
    setPhase("running");
    setValue(1);

    const duration = 2400 + (t - 1) * 850;
    const started = performance.now();
    const step = (now: number) => {
      const k = Math.min(1, (now - started) / duration);
      const eased = 1 - Math.pow(1 - k, 2.4);
      setValue(1 + (t - 1) * eased);
      if (k < 1) {
        raf.current = requestAnimationFrame(step);
      } else {
        setValue(t);
        setPhase("done");
        setHistory((h) => [t, ...h].slice(0, 8));
      }
    };
    raf.current = requestAnimationFrame(step);
  };

  const reset = () => {
    if (raf.current) cancelAnimationFrame(raf.current);
    setPhase("idle");
    setTarget(null);
    setRound(null);
    setValue(1);
  };

  const progress = target ? Math.min(1, (value - 1) / Math.max(0.01, target - 1)) : 0;
  const circumference = 2 * Math.PI * 86;

  // Flight curve geometry (0..1 progress -> point on a quadratic climb)
  const curve = useMemo(() => {
    const w = 300;
    const h = 120;
    const px = progress * w;
    const py = h - Math.pow(progress, 1.7) * h;
    const path = `M0 ${h} Q ${px * 0.55} ${h - (h - py) * 0.35} ${px} ${py}`;
    return { w, h, px, py, path };
  }, [progress]);

  return (
    <main className="relative z-10 min-h-screen overflow-hidden pb-20">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(120%_80%_at_50%_-10%,oklch(0.66_0.26_258/0.26),transparent_65%)]" />
      <div className="pointer-events-none fixed inset-x-0 bottom-0 -z-10 h-72 bg-[radial-gradient(70%_100%_at_50%_100%,oklch(0.78_0.19_232/0.16),transparent_70%)]" />

      {/* Top bar */}
      <header className="sticky top-0 z-30 border-b border-primary/25 bg-background/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
          <Link
            to="/lobby"
            className="flex items-center gap-1.5 rounded-full border border-primary/30 px-3 py-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:border-accent hover:text-accent"
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
          <span className="gold-shimmer-text text-sm font-extrabold tracking-[0.3em]">
            Smart Odds
          </span>
          <span className="flex items-center gap-1 rounded-full border border-accent/40 px-2.5 py-1 text-[9px] font-bold tracking-widest text-accent">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent/70" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
            </span>
            LIVE
          </span>
        </div>
      </header>

      <div className="mx-auto flex max-w-md flex-col px-5">
        {/* Game logo */}
        <div className="animate-rise luxe-ring relative mt-5 overflow-hidden rounded-3xl border border-primary/30">
          <img
            src={image}
            alt={`${name} artwork`}
            width={301}
            height={180}
            className="h-36 w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/45 to-transparent" />
          <h1 className="gold-shimmer-text absolute inset-x-0 bottom-3 text-center text-2xl font-black tracking-tight">
            {name}
          </h1>
        </div>

        {/* History strip */}
        <div className="rail-scroller mt-4 overflow-x-auto">
          <div className="flex w-max gap-2">
            {history.map((h, i) => (
              <span
                key={`${h}-${i}`}
                className={`rounded-full border px-2.5 py-1 font-mono text-[11px] font-bold ${
                  h >= 2
                    ? "border-accent/50 bg-accent/10 text-accent"
                    : "border-destructive/40 bg-destructive/10 text-destructive"
                }`}
              >
                {h.toFixed(2)}x
              </span>
            ))}
          </div>
        </div>

        {/* Flight deck */}
        <section className="luxe-panel luxe-hairline animate-rise relative mt-4 overflow-hidden p-5">
          <div className="pointer-events-none absolute inset-0 opacity-[0.18] [background-image:linear-gradient(oklch(0.78_0.19_232/0.5)_1px,transparent_1px),linear-gradient(90deg,oklch(0.78_0.19_232/0.5)_1px,transparent_1px)] [background-size:26px_26px]" />

          {/* Odds dial */}
          <div className="relative mx-auto flex h-52 w-52 items-center justify-center">
            <span className="absolute inset-0 rounded-full bg-primary/20 blur-2xl" />
            <span className="absolute inset-3 rounded-full border border-primary/20" />
            <svg viewBox="0 0 200 200" className="absolute inset-0 h-full w-full -rotate-90">
              <circle
                cx="100"
                cy="100"
                r="86"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                className="text-primary/15"
              />
              <circle
                cx="100"
                cy="100"
                r="86"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={circumference * (1 - progress)}
                className="text-accent drop-shadow-[0_0_14px_oklch(0.78_0.19_232/0.9)]"
              />
            </svg>
            <div className="relative flex flex-col items-center">
              <span
                className={`font-mono text-5xl font-black tabular-nums transition-transform duration-300 ${
                  phase === "done" ? "gold-shimmer-text scale-110" : "text-foreground"
                }`}
              >
                x{value.toFixed(2)}
              </span>
              <span className="mt-1 text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                {phase === "running" ? "Flying" : phase === "done" ? "Cash out" : "Odds"}
              </span>
            </div>
          </div>

          {/* Climb curve */}
          <div className="relative mt-4">
            <svg
              viewBox={`0 0 ${curve.w} ${curve.h}`}
              className="h-24 w-full"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <path
                d={`${curve.path} L ${curve.px} ${curve.h} L 0 ${curve.h} Z`}
                className="fill-accent/15"
              />
              <path
                d={curve.path}
                fill="none"
                strokeWidth="3"
                strokeLinecap="round"
                className="stroke-accent drop-shadow-[0_0_10px_oklch(0.78_0.19_232/0.9)]"
              />
            </svg>
            <span
              className="absolute h-3 w-3 rounded-full bg-accent shadow-[0_0_12px_oklch(0.78_0.19_232/0.9)] ring-2 ring-background"
              style={{
                left: `${(curve.px / curve.w) * 100}%`,
                top: `${(curve.py / curve.h) * 100}%`,
                transform: "translate(-50%, -50%)",
              }}
            />
          </div>

          {/* HUD stats */}
          <div className="relative mt-4 grid grid-cols-3 gap-2">
            <Hud label="Target" value={target ? `x${target.toFixed(2)}` : "—"} />
            <Hud
              label="Safe"
              value={target ? `x${Math.max(1.2, target * 0.62).toFixed(2)}` : "—"}
            />
            <Hud label="Round" value={round ? `#${round}` : "—"} />
          </div>

          {phase === "done" && (
            <p className="animate-reveal relative mt-4 text-center text-sm font-bold text-accent" dir="rtl">
              اطلع كاش أوت عند x{value.toFixed(2)} 🚀
            </p>
          )}

          {/* Buttons */}
          <div className="relative mt-5 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={start}
              disabled={phase === "running"}
              className="gold-button luxe-sheen rounded-2xl px-5 py-4 text-sm font-black uppercase tracking-[0.2em] transition-transform active:scale-95 disabled:opacity-60"
            >
              <span className="relative z-10">بدأ</span>
            </button>
            <button
              type="button"
              onClick={reset}
              className="rounded-2xl border border-primary/40 px-5 py-4 text-sm font-black uppercase tracking-[0.2em] text-muted-foreground transition-all hover:border-accent hover:text-accent active:scale-95"
            >
              إعادة
            </button>
          </div>
        </section>

        <p className="mt-5 text-center text-[10px] leading-relaxed text-muted-foreground/70">
          Predictions are statistical suggestions only and never guarantee an outcome.
        </p>
      </div>
    </main>
  );
}

function Hud({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-primary/25 bg-background/50 px-2 py-2 text-center backdrop-blur-md">
      <p className="text-[8px] uppercase tracking-[0.24em] text-muted-foreground">{label}</p>
      <p className="mt-0.5 font-mono text-sm font-black text-foreground">{value}</p>
    </div>
  );
}
