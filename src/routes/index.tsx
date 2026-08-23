import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import logo from "@/assets/brand-logo.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Smart Odds — Crash Games Lobby" },
      {
        name: "description",
        content:
          "Smart Odds: enter the lobby and play the hottest crash and instant win games.",
      },
      { property: "og:title", content: "Smart Odds — Crash Games Lobby" },
      {
        property: "og:description",
        content: "Enter the Smart Odds lobby and play the hottest crash games.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Splash,
});

const steps = ["تشغيل المحرك", "تحميل الألعاب", "تأمين الجلسة", "جاهز"];

function Splash() {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const start = Date.now();
    const id = window.setInterval(() => {
      setProgress(Math.min(100, ((Date.now() - start) / 3000) * 100));
    }, 40);
    const timeout = window.setTimeout(() => navigate({ to: "/terms" }), 3000);
    return () => {
      window.clearInterval(id);
      window.clearTimeout(timeout);
    };
  }, [navigate]);

  const step = Math.min(steps.length - 1, Math.floor((progress / 100) * steps.length));

  return (
    <main className="relative z-10 flex min-h-screen flex-col items-center justify-center px-7">
      {/* halo rings */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2">
        <span className="absolute inset-0 animate-[spin_18s_linear_infinite] rounded-full border border-primary/20" />
        <span className="absolute inset-10 animate-[spin_26s_linear_infinite_reverse] rounded-full border border-dashed border-accent/20" />
        <span className="absolute inset-24 rounded-full bg-primary/10 blur-[90px]" />
      </div>

      <div className="animate-rise flex flex-col items-center rounded-[2rem] border border-primary/25 bg-transparent px-7 py-9 backdrop-blur-[2px]">
        <img
          src={logo}
          alt="Smart Odds logo"
          width={1238}
          height={864}
          className="w-52 max-w-full rounded-2xl drop-shadow-[0_0_45px_oklch(0.48_0.16_158/0.75)]"
        />

        <h1 className="mt-6 bg-gradient-to-b from-accent via-foreground to-primary bg-clip-text text-4xl font-black tracking-[0.16em] text-transparent">
          Smart Odds
        </h1>
        <p className="mt-2 text-[10px] uppercase tracking-[0.42em] text-muted-foreground">
          platform analytics
        </p>

        <div className="mt-9 w-full max-w-[17rem]">
          <div className="h-1.5 w-full overflow-hidden rounded-full border border-border bg-transparent">
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary via-accent to-primary shadow-[0_0_18px_oklch(0.62_0.19_158/0.8)] transition-[width] duration-100 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="mt-3 flex items-center justify-between text-[10px] tracking-widest text-muted-foreground">
            <span dir="rtl" className="text-accent">
              {steps[step]}
            </span>
            <span className="font-mono tabular-nums">{Math.round(progress)}%</span>
          </div>
        </div>

        <div className="mt-6 flex gap-1.5">
          {steps.map((s, i) => (
            <span
              key={s}
              className={`h-1 w-6 rounded-full transition-colors duration-300 ${
                i <= step ? "bg-accent" : "bg-muted"
              }`}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
