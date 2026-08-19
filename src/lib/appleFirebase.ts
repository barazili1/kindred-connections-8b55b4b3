const BASE = "https://x-men-256cc-default-rtdb.firebaseio.com/m11";

/** The only account wired to the live Firebase apple feed. */
export const APPLE_FEED_USER_ID = "1729018123";

/** Bad-apple count per row, from the bottom row (m1..m5) upwards. */
const BAD_PER_ROW = [1, 1, 1, 1, 2, 2, 2, 3, 3, 4];

type Raw = Record<string, unknown>;

function readValue(raw: Raw, key: string): string {
  const node = raw?.[key];
  if (node && typeof node === "object") {
    const inner = (node as Raw)[key];
    return String(inner ?? "0");
  }
  return String(node ?? "0");
}

/**
 * Rows ordered top-to-bottom for rendering: index 0 = m46..m50 (top),
 * index 9 = m1..m5 (bottom). `true` means a safe apple (value "0").
 */
export async function fetchAppleRows(): Promise<boolean[][]> {
  const res = await fetch(`${BASE}.json`, { cache: "no-store" });
  if (!res.ok) throw new Error("feed unavailable");
  const raw = (await res.json()) as Raw;
  const rows: boolean[][] = [];
  for (let r = 0; r < 10; r++) {
    const row: boolean[] = [];
    for (let c = 0; c < 5; c++) row.push(readValue(raw, `m${r * 5 + c + 1}`) !== "1");
    rows.push(row);
  }
  return rows.reverse();
}

/** Writes a fresh random layout to Firebase following the per-row bad counts. */
export async function randomizeAppleRows(): Promise<void> {
  const payload: Record<string, Record<string, string>> = {};
  BAD_PER_ROW.forEach((bad, r) => {
    const cols = [0, 1, 2, 3, 4];
    for (let i = cols.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cols[i], cols[j]] = [cols[j]!, cols[i]!];
    }
    const badSet = new Set(cols.slice(0, bad));
    for (let c = 0; c < 5; c++) {
      const key = `m${r * 5 + c + 1}`;
      payload[key] = { [key]: badSet.has(c) ? "1" : "0" };
    }
  });
  const res = await fetch(`${BASE}.json`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("write failed");
}

const CRASH_URL = "https://x-men-256cc-default-rtdb.firebaseio.com/pre/hipr/hipr.json";

/** Live crash multiplier for the wired account, e.g. "14.48x". */
export async function fetchCrashMultiplier(): Promise<number | null> {
  try {
    const res = await fetch(CRASH_URL, { cache: "no-store" });
    if (!res.ok) return null;
    const raw = await res.json();
    const n = Number(typeof raw === "object" && raw ? Object.values(raw as Raw)[0] : raw);
    return Number.isFinite(n) && n > 1 ? n : null;
  } catch {
    return null;
  }
}
