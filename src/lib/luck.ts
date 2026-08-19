import { games } from "@/data/games";

export type LuckLevel = "hot" | "stable" | "unstable";

export type LuckInfo = {
  level: LuckLevel;
  luck: number;
};

const MIN_MS = 60_000;
const ANCHOR = Date.UTC(2026, 0, 1);

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Rotating slot whose length is a deterministic 5–15 minutes. */
export function getLuckSlot(now: number) {
  let start = ANCHOR;
  let index = 0;
  // walk forward in deterministic slots (cheap: max a few thousand iterations)
  for (;;) {
    const rng = mulberry32(index * 2654435761 + 12345);
    const duration = Math.round((5 + rng() * 10) * MIN_MS);
    if (now < start + duration || index > 200_000) {
      return { index, start, endsAt: start + duration };
    }
    start += duration;
    index += 1;
  }
}

export function getLuckMap(slotIndex: number): Record<string, LuckInfo> {
  const rng = mulberry32(slotIndex * 9301 + 49297);
  const pool = games.map((g) => g.name);
  // Fisher–Yates with seeded rng
  for (let i = pool.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    const tmp = pool[i] as string;
    pool[i] = pool[j] as string;
    pool[j] = tmp;
  }

  const map: Record<string, LuckInfo> = {};
  pool.forEach((name, i) => {
    if (i < 10) map[name] = { level: "hot", luck: 90 };
    else if (i < 20) map[name] = { level: "stable", luck: 70 };
    else map[name] = { level: "unstable", luck: 35 };
  });
  return map;
}

export const luckLabels: Record<LuckLevel, string> = {
  hot: "ننصحك بتجربة الألعاب",
  stable: "ألعاب مستقرة",
  unstable: "ألعاب غير مستقرة حالياً — لا ننصحك باللعب الآن",
};

export const luckShortLabels: Record<LuckLevel, string> = {
  hot: "ننصحك بتجربتها",
  stable: "مستقرة",
  unstable: "غير مستقرة حالياً",
};
