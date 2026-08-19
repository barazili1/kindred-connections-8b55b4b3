import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import logo from "@/assets/casino-ai-logo.png";
import { ParticlesBackground } from "@/components/ParticlesBackground";

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
    ],
  }),
  component: Splash,
});

function Splash() {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const start = Date.now();
    const id = window.setInterval(() => {
      const pct = Math.min(100, ((Date.now() - start) / 3000) * 100);
      setProgress(pct);
    }, 30);
    const timeout = window.setTimeout(() => {
      navigate({ to: "/terms" });
    }, 3000);
    return () => {
      window.clearInterval(id);
      window.clearTimeout(timeout);
    };
  }, [navigate]);

  return (
    <>
      <ParticlesBackground />
      <main className="relative z-10 flex min-h-screen flex-col items-center justify-center px-8">
        <img
          src={logo}
          alt="Smart Odds logo"
          width={816}
          height={816}
          className="w-40 animate-pulse-glow drop-shadow-[0_0_45px_oklch(0.66_0.26_300/0.6)]"
        />

        <h1 className="mt-6 bg-gradient-to-b from-accent to-primary bg-clip-text text-4xl font-extrabold tracking-[0.15em] text-transparent">
          Smart Odds
        </h1>

        <div className="mt-10 w-full max-w-xs">
          <div className="h-2 w-full overflow-hidden rounded-full border border-border bg-transparent">
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary via-accent to-primary shadow-[0_0_18px_oklch(0.66_0.26_300/0.75)] transition-[width] duration-100 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="mt-3 text-center text-xs tracking-widest text-muted-foreground">
            LOADING {Math.round(progress)}%
          </p>
        </div>
      </main>
    </>
  );
}
