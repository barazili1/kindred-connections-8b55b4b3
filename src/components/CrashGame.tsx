import { Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";

import { buildPrediction } from "@/lib/predict";

type Phase = "idle" | "running" | "done";

/** Crash-style predictor: an animated odds dial that counts up to the predicted multiplier. */
export function CrashGame({ name, image }: { name: string; image: string }) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [value, setValue] = useState(1);
  const [target, setTarget] = useState<number | null>(null);
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
    setPhase("running");
    setValue(1);

    const duration = 2200 + (t - 1) * 900;
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
      }
    };
    raf.current = requestAnimationFrame(step);
  };

  const reset = () => {
    if (raf.current) cancelAnimationFrame(raf.current);
    setPhase("idle");
    setTarget(null);
    setValue(1);
  };

  const progress = target ? Math.min(1, (value - 1) / Math.max(0.01, target - 1)) : 0;
  const circumference = 2 * Math.PI * 88;

  return (
    <main className="relative z-10 min-h-screen overflow-hidden pb-20">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(120%_80%_at_50%_-10%,oklch(0.66_0.26_258/0.22),transparent_65%)]" />

      {/* Top bar */}
      <header className="sticky top-0 z-30 border-b border-primary/25 bg-background/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
          <Link
            to="/lobby"
            className="flex items-center gap-1.5 rounded-full border border-primary/30 px-3 py-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:border-primary hover:text-primary"
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
          <span className="gold-shimmer-text text-sm font-extrabold tracking-[0.32em]">
            Smart Odds
          </span>
        </div>
      </header>

      <div className="mx-auto flex max-w-md flex-col items-center px-5">
        {/* Game logo */}
        <div className="animate-rise luxe-ring relative mt-6 w-full overflow-hidden rounded-3xl border border-primary/30">
          <img
            src={image}
            alt={`${name} artwork`}
            width={301}
            height={180}
            className="h-40 w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
          <h1 className="gold-shimmer-text absolute inset-x-0 bottom-3 text-center text-2xl font-black tracking-tight">
            {name}
          </h1>
        </div>

        {/* Odds dial */}
        <div className="animate-rise relative mt-8 flex h-56 w-56 items-center justify-center">
          <span
            className={`absolute inset-0 rounded-full bg-primary/25 blur-2xl transition-opacity duration-500 ${
              phase === "running" ? "animate-pulse-glow opacity-100" : "opacity-60"
            }`}
          />
          <span
            className={`absolute inset-2 rounded-full border border-accent/30 ${
              phase === "running" ? "animate-spin-slow" : ""
            }`}
          />
          <svg viewBox="0 0 200 200" className="absolute inset-0 h-full w-full -rotate-90">
            <circle
              cx="100"
              cy="100"
              r="88"
              fill="none"
              stroke="currentColor"
              strokeWidth="7"
              className="text-primary/15"
            />
            <circle
              cx="100"
              cy="100"
              r="88"
              fill="none"
              stroke="currentColor"
              strokeWidth="7"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={circumference * (1 - progress)}
              className="text-accent drop-shadow-[0_0_14px_oklch(0.78_0.19_232/0.8)]"
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
              {phase === "running" ? "Calculating" : phase === "done" ? "Cash out" : "Odds"}
            </span>
          </div>
        </div>

        {phase === "done" && (
          <p className="animate-reveal mt-5 text-center text-sm font-bold text-accent" dir="rtl">
            اطلع كاش أوت عند x{value.toFixed(2)} 🚀
          </p>
        )}

        {/* Buttons */}
        <div className="mt-8 grid w-full grid-cols-2 gap-3">
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
            className="rounded-2xl border border-primary/40 px-5 py-4 text-sm font-black uppercase tracking-[0.2em] text-muted-foreground transition-all hover:border-primary hover:text-primary active:scale-95"
          >
            إعادة
          </button>
        </div>

        <p className="mt-6 text-center text-[10px] leading-relaxed text-muted-foreground/70">
          Predictions are statistical suggestions only and never guarantee an outcome.
        </p>
      </div>
    </main>
  );
}
