import { games, type Game } from "@/data/games";

export type PredictionKind =
  | "crash"
  | "dice"
  | "thimbles"
  | "mines"
  | "goal"
  | "slot"
  | "wheel"
  | "swamp"
  | "gems"
  | "eastern"
  | "apple"
  | "cashout"
  | "none";

/** Arabic display names. Falls back to the original name when unmapped. */
const arabicNames: Record<string, string> = {
  Aviator: "أفياتور",
  Spaceman: "سبيس مان",
  "Penalty Shoot-Out Street": "ضربات الجزاء",
  "Doodle Crash": "دودل كراش",
  Zeppelin: "زبلن",
  "To Mars and Beyond": "إلى المريخ وما بعده",
  "Cricket Crash": "كريكيت كراش",
  "Save the Hamster": "أنقذ الهامستر",
  "Goblin Run": "جري العفريت",
  "Quantum X": "كوانتم إكس",
  "High Flyer": "الطائر العالي",
  "F777 Fighter": "المقاتلة F777",
  Mriya: "ميريا",
  "Long Ball": "الكرة الطويلة",
  "Cricket Boom": "كريكيت بوم",
  "Cash or Crash 2": "كاش أو كراش 2",
  "Crash Puck": "كراش باك",
  "Crash Touchdown": "كراش تاتش داون",
  "Space Blaze": "لهيب الفضاء",
  "Cash It Multiplayer": "كاش إت جماعي",
  "Cash or Crash": "كاش أو كراش",
  "Crash Birds Multiplayer": "طيور الكراش جماعي",
  "Kick It Multiplayer": "كيك إت جماعي",
  "Lucky Crumbling": "الحظ المتساقط",
  "Crash, Hamster, Crash!": "اجرِ يا هامستر!",
  "Crash Birds": "طيور الكراش",
  "Fortune Tumble": "دوّامة الحظ",
  "Triple Cash Or Crash": "تريبل كاش أو كراش",
  "Cash Galaxy": "مجرّة الكاش",
  "Stormy Witch": "الساحرة العاصفة",
  "Need for X": "نيد فور إكس",
  "9 Coins Easter": "9 عملات",
  "Raider Jane's Crypt of Fortune": "مقبرة الحظ",
  "Big Bass Crash": "بيج باس كراش",
  "Rocket Race": "سباق الصواريخ",
  "Monster Go Shopping": "الوحش يتسوّق",
  "Fly To Universe": "طِر للكون",
  "Deep Rush": "أعماق الإثارة",
  "Sky Lantern": "فانوس السماء",
  "Double Bubble": "دابل بابل",
  "Fair Crash": "فير كراش",
  "Space XY": "سبيس XY",
  "Top Eagle": "النسر الذهبي",
  "Limbo XY": "ليمبو XY",
  "Gift X": "هدية X",
  "Dragon's Crash": "كراش التنين",
  "Arizona Smith and the Mayan Treasure": "كنز المايا",
  "Magnify Man": "الرجل المكبّر",
  "Chicken Road": "طريق الفرخة",
  Plinko: "بلينكو",
  "Chicken Road 2.0": "طريق الفرخة 2.0",
  "Hamster Run": "جري الهامستر",
  "Lucky Mines": "مناجم الحظ",
  Tower: "البرج",
  "Air Crash": "الطيارة",
  "777": "٧٧٧",
  Thimbles: "الكبايات",
  "Swamp Land": "الضفدعة",
  "Eastern Nights": "ليالي الشرق",
  "Gems & Mines": "الجواهر والمناجم",
  "Goal!": "جول!",
  Dice: "الزهر",
  Crash: "كراش",
  "Crash Point": "نقطة الكراش",
  "Vampire Curse": "لعنة الفامبير",
  Crystal: "الكريستال",
  "Apple of Fortune": "تفاحة الحظ",
  "Burning Hot": "الفواكه الملتهبة",
};

export function arabicName(name: string) {
  return arabicNames[name] ?? name;
}


export function slugify(name: string) {
  return name
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export const instantGames: Game[] = games.filter((g) => g.category === "instant");

export function getGameBySlug(slug: string): Game | undefined {
  return games.find((g) => slugify(g.name) === slug);
}

const kindByName: Record<string, PredictionKind> = {
  "Air Crash": "crash",
  Crash: "crash",
  "Crash Point": "crash",
  Dice: "dice",
  Thimbles: "thimbles",
  "Gems & Mines": "mines",
  "Goal!": "goal",
  Goal: "goal",
  "Swamp Land": "swamp",
  "Eastern Nights": "eastern",
  "Apple of Fortune": "apple",
  Crystal: "none",
  "Vampire Curse": "none",
  "777": "none",
  "Burning Hot": "none",
};

export function getKind(name: string): PredictionKind {
  return kindByName[name] ?? "slot";
}

const slotSymbols = ["7", "★", "♦", "♣", "♥", "🔔", "🍒", "💎"];
const gemSymbols = ["🔷", "🔶", "💎", "❤️", "💚", "💜", "🔺"];

export type Prediction =
  | { kind: "crash"; multiplier: string; safeCashout: string; round: number }
  | { kind: "dice"; target: number; direction: "over" | "under"; chance: number }
  | { kind: "thimbles"; pick: number }
  | { kind: "mines"; safe: number[]; total: number }
  | { kind: "goal"; pick: number; corners: number }
  | { kind: "slot"; reels: string[][]; spins: number; payline: number }
  | { kind: "wheel"; segment: string }
  | { kind: "cashout"; steps: { step: number; multiplier: string }[] }
  | {
      kind: "eastern";
      rows: { multiplier: string; safe: number }[];
      cols: number;
      cashoutRow: number;
    }
  | { kind: "apple"; rows: { multiplier: string; safe: number; cols: number }[] }
  | { kind: "none" }
  | { kind: "swamp"; rows: { multiplier: string; safe: number }[]; cols: number }
  | { kind: "gems"; grid: string[]; cluster: number[]; cols: number };

function rnd(min: number, max: number) {
  return min + Math.random() * (max - min);
}

export function buildPrediction(kind: PredictionKind): Prediction {
  switch (kind) {
    case "crash": {
      const m = rnd(1.6, 9.4);
      return {
        kind: "crash",
        multiplier: `${m.toFixed(2)}x`,
        safeCashout: `${Math.max(1.2, m * 0.62).toFixed(2)}x`,
        round: Math.floor(rnd(100000, 999999)),
      };
    }
    case "dice": {
      const over = Math.random() > 0.5;
      const target = Math.round(rnd(over ? 12 : 46, over ? 52 : 88));
      return {
        kind: "dice",
        target,
        direction: over ? "over" : "under",
        chance: Math.round(over ? 100 - target : target),
      };
    }
    case "thimbles":
      return { kind: "thimbles", pick: Math.floor(rnd(0, 3)) };
    case "mines": {
      const total = 25;
      const safe = new Set<number>();
      while (safe.size < 5) safe.add(Math.floor(rnd(0, total)));
      return { kind: "mines", safe: [...safe], total };
    }
    case "goal":
      return { kind: "goal", pick: Math.floor(rnd(0, 2)), corners: Math.round(rnd(2, 4)) };
    case "wheel":
      return { kind: "wheel", segment: `x${Math.round(rnd(2, 40))}` };
    case "none":
      return { kind: "none" };
    case "cashout": {
      const count = Math.floor(rnd(1, 4)); // 1 – 3 خانات عشوائية
      const steps: { step: number; multiplier: string }[] = [];
      let step = Math.floor(rnd(2, 5));
      let m = rnd(1.3, 2.1);
      for (let i = 0; i < count; i++) {
        steps.push({ step, multiplier: `x${m.toFixed(2)}` });
        step += Math.floor(rnd(2, 5));
        m *= rnd(1.4, 2.3);
      }
      return { kind: "cashout", steps };
    }
    case "eastern": {
      const cols = 5;
      let m = rnd(1.15, 1.35);
      const rows = Array.from({ length: 10 }, () => {
        const row = { multiplier: `x${m.toFixed(2)}`, safe: Math.floor(rnd(0, cols)) };
        m *= rnd(1.25, 1.6);
        return row;
      }).reverse();
      return { kind: "eastern", rows, cols, cashoutRow: Math.floor(rnd(0, rows.length)) };
    }
    case "apple": {
      let m = rnd(1.2, 1.45);
      const rows = Array.from({ length: 10 }, () => {
        const cols = 5;
        const row = { multiplier: `x${m.toFixed(2)}`, safe: Math.floor(rnd(0, cols)), cols };
        m *= rnd(1.3, 1.6);
        return row;
      }).reverse();
      return { kind: "apple", rows };
    }
    case "swamp": {
      const cols = 5;
      const mults = [27.16, 5.43, 2.17, 1.3];
      return {
        kind: "swamp",
        cols,
        rows: mults.map((m) => ({ multiplier: `x${m.toFixed(2)}`, safe: Math.floor(rnd(0, cols)) })),
      };
    }
    case "gems": {
      const cols = 7;
      const grid = Array.from(
        { length: cols * cols },
        () => gemSymbols[Math.floor(Math.random() * gemSymbols.length)]!,
      );
      const start = Math.floor(rnd(0, cols * (cols - 2)));
      const cluster = [start, start + 1, start + 2, start + cols, start + cols + 1].filter(
        (n) => n < cols * cols,
      );
      const sym = gemSymbols[Math.floor(Math.random() * gemSymbols.length)]!;
      for (const i of cluster) grid[i] = sym;
      return { kind: "gems", grid, cluster, cols };
    }
    default: {
      const reels = Array.from({ length: 3 }, () =>
        Array.from({ length: 3 }, () => slotSymbols[Math.floor(Math.random() * slotSymbols.length)]!),
      );
      return { kind: "slot", reels, spins: Math.round(rnd(3, 14)), payline: Math.round(rnd(1, 3)) };
    }
  }
}

/** Random enter-game delay: 1–5 minutes from now. */
export function buildEnterDelayMs() {
  return Math.round(rnd(60_000, 180_000));
}

/** Exact entry time in 12-hour Hours:Minutes format, e.g. "7:43 PM". */
export function formatEnterTime(ts: number) {
  const d = new Date(ts);
  let h = d.getHours();
  const ampm = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${h}:${mm} ${ampm}`;
}

