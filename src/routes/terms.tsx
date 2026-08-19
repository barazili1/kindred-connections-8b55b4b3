import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import logo from "@/assets/casino-ai-logo.png";
import gooobetLogo from "@/assets/g/gooobet.png.asset.json";
import megapariLogo from "@/assets/g/megapari.png.asset.json";
import paripulseLogo from "@/assets/g/paripulse.png.asset.json";
import winwinLogo from "@/assets/g/winwin.png.asset.json";
import { ParticlesBackground } from "@/components/ParticlesBackground";
import { useUserId } from "@/components/UserIdGate";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "الشروط — Smart Odds" },
      {
        name: "description",
        content:
          "أكمل شروط التفعيل في Smart Odds: اختر المنصة، حمّل التطبيق، انضم للقناة، سجّل بالبروموكود وأودع الحد الأدنى.",
      },
      { property: "og:title", content: "الشروط — Smart Odds" },
      {
        property: "og:description",
        content: "خطوات تفعيل حسابك للحصول على توقعات Smart Odds.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: TermsPage,
});

const platforms = [
  { id: "gooobet", name: "Gooobet", logo: gooobetLogo.url, url: "https://promogooo.click/Gooo33" },
  { id: "paripulse", name: "Paripulse", logo: paripulseLogo.url, url: "https://refpa22168.com/L?tag=d_3638295m_64499c_&site=3638295&ad=64499" },
  { id: "megapari", name: "Megapari", logo: megapariLogo.url, url: "https://2787591.megapari-228091.com" },
  { id: "winwin", name: "Winwin", logo: winwinLogo.url, url: "https://refpa98980.com/L?tag=d_5876143m_94904c_&site=5876143&ad=94904" },
];

const PROMO = "Gooo33";
const TELEGRAM = "https://t.me/+SHa12LG9SFQ3YWE0";

function TermsPage() {
  const navigate = useNavigate();
  const { save } = useUserId();
  const [platform, setPlatform] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [checking, setChecking] = useState(false);
  const [joined, setJoined] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [deposited, setDeposited] = useState(false);

  useEffect(() => {
    if (!checking) return;
    const t = window.setTimeout(() => {
      save(value);
      setChecking(false);
      navigate({ to: "/lobby" });
    }, 3200);
    return () => window.clearTimeout(t);
  }, [checking, value, save, navigate]);

  const selected = platforms.find((p) => p.id === platform);
  const idValid = /^\d{10,14}$/.test(value);
  const states = [Boolean(platform), registered, joined, copied, deposited, idValid];
  const done = states.filter(Boolean).length;
  const progress = Math.round((done / 6) * 100);

  return (
    <>
      <ParticlesBackground />
      {checking ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/85 p-5 backdrop-blur-xl">
          <div
            dir="rtl"
            className="luxe-panel luxe-ring luxe-corners animate-step-in w-full max-w-sm overflow-hidden p-8 text-center"
          >
            <div className="relative mx-auto h-20 w-20">
              <span className="absolute inset-0 animate-spin rounded-full border-2 border-gold/20 border-t-gold" />
              <span className="animate-spin-slow absolute inset-2 rounded-full border border-dashed border-gold-soft/50" />
              <span className="animate-pulse-glow absolute inset-6 rounded-full bg-gold/50 blur-[8px]" />
            </div>
            <p className="gold-shimmer-text mt-6 text-base font-extrabold tracking-wide">
              جارٍ ربط حسابك بالمنصة المختارة
            </p>
            <p className="mt-2 text-[11px] tracking-widest text-muted-foreground">
              {selected ? selected.name : ""} — الرجاء الانتظار…
            </p>
            <div className="mt-6 h-1.5 w-full overflow-hidden rounded-full bg-foreground/10">
              <span className="luxe-sheen luxe-aurora block h-full w-full" />
            </div>
          </div>
        </div>
      ) : null}

      <main className="relative z-10 min-h-screen pb-28" dir="rtl">
        <div className="luxe-aurora pointer-events-none fixed inset-x-0 top-0 -z-10 h-[520px] opacity-40 blur-[110px]" />

        <header className="sticky top-0 z-30 border-b border-gold/15 bg-background/55 backdrop-blur-2xl">
          <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-2.5">
            <span className="gold-shimmer-text text-[13px] font-extrabold tracking-[0.28em]">
              SMART ODDS
            </span>
            <span className="rounded-full border border-gold/30 bg-gold/5 px-3 py-0.5 text-[10px] font-bold tracking-[0.2em] text-gold-soft">
              {done}/6
            </span>
          </div>
          <div className="h-[3px] w-full bg-foreground/5">
            <span
              className="luxe-aurora block h-full transition-[width] duration-700"
              style={{ width: `${progress}%` }}
            />
          </div>
        </header>

        <div className="mx-auto max-w-2xl px-4">
          {/* Hero */}
          <section className="animate-step-in relative flex flex-col items-center pt-9">
            <div className="pointer-events-none absolute left-1/2 top-0 h-56 w-56 -translate-x-1/2 rounded-full bg-primary/25 blur-[90px]" />
            <div className="luxe-ring relative rounded-full p-1.5">
              <img
                src={logo}
                alt="Smart Odds logo"
                width={816}
                height={816}
                className="animate-float w-24 drop-shadow-[0_0_44px_oklch(0.66_0.26_300/0.65)]"
              />
            </div>
            <div className="mt-4 flex items-center gap-3">
              <span className="h-px w-10 bg-gradient-to-l from-transparent to-gold/70" />
              <h1 className="gold-shimmer-text text-2xl font-extrabold tracking-[0.24em]">
                الشـروط
              </h1>
              <span className="h-px w-10 bg-gradient-to-r from-transparent to-gold/70" />
            </div>
            <p className="relative mt-2 max-w-xs text-center text-[11.5px] leading-relaxed text-muted-foreground">
              أكمل الخطوات الستة لتفعيل حسابك والحصول على توقعات بدقة تصل إلى 90%
            </p>
          </section>

          {/* Timeline */}
          <div className="relative mt-8 pe-1 ps-7">
            <span className="absolute inset-y-3 start-3 w-px bg-gradient-to-b from-transparent via-gold/35 to-transparent" />

            <Step index={1} title="اختر المنصة" complete={states[0]} delay={0}>
              <div className="grid grid-cols-4 gap-2">
                {platforms.map((p) => {
                  const active = platform === p.id;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => {
                        setPlatform(p.id);
                        setRegistered(false);
                      }}
                      className={`group flex h-[86px] w-full flex-col items-center justify-center gap-1.5 rounded-2xl border transition-all duration-300 hover:-translate-y-1 ${
                        active
                          ? "luxe-ring border-gold bg-[linear-gradient(180deg,oklch(0.66_0.26_300/0.28),oklch(0.5_0.22_295/0.12))] shadow-[0_0_34px_-6px_oklch(0.66_0.26_300/0.75)]"
                          : "border-gold/15 bg-background/30 hover:border-gold/50"
                      }`}
                    >
                      <span
                        className={`relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-full border transition-all duration-300 ${
                          active
                            ? "animate-reveal border-gold shadow-[0_0_20px_oklch(0.66_0.26_300/0.75)]"
                            : "border-gold/25 bg-background/60 grayscale-[0.35] group-hover:grayscale-0"
                        }`}
                      >
                        <img src={p.logo} alt={p.name} className="h-full w-full object-cover" />
                      </span>
                      <span className="w-full truncate px-1 text-center text-[10px] font-bold tracking-wide text-foreground">
                        {p.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </Step>

            <Step
              index={2}
              title={`التسجيل في منصة ${selected ? selected.name : "…"}`}
              complete={states[1]}
              delay={70}
              locked={!platform}
            >
              <a
                href={selected?.url ?? "#"}
                target="_blank"
                rel="noreferrer"
                onClick={() => selected && setRegistered(true)}
                className={`luxe-sheen block w-full rounded-2xl px-4 py-3.5 text-center text-sm font-extrabold tracking-wide transition-transform active:scale-[0.98] ${
                  selected
                    ? "gold-button"
                    : "pointer-events-none bg-foreground/15 text-foreground/40"
                }`}
              >
                التسجيل
              </a>
            </Step>

            <Step index={3} title="الانضمام إلى قناة التليجرام" complete={states[2]} delay={140}>
              <a
                href={TELEGRAM}
                target="_blank"
                rel="noreferrer"
                onClick={() => setJoined(true)}
                className="luxe-sheen block w-full rounded-2xl bg-foreground px-4 py-3.5 text-center text-sm font-extrabold text-background transition-transform active:scale-[0.98]"
              >
                انضمام
              </a>
            </Step>

            <Step index={4} title="إنشاء حساب بالبروموكود الخاص بنا" complete={states[3]} delay={210}>
              <div className="flex items-center gap-2">
                <span
                  dir="ltr"
                  className="luxe-ring flex-1 rounded-2xl border border-gold/25 bg-background/50 px-4 py-3.5 text-center text-base font-extrabold tracking-[0.3em] text-gold-soft"
                >
                  {PROMO}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    void navigator.clipboard?.writeText(PROMO);
                    setCopied(true);
                  }}
                  className="gold-button rounded-2xl px-5 py-3.5 text-sm font-extrabold transition-transform active:scale-[0.98]"
                >
                  {copied ? "تم ✓" : "نسخ"}
                </button>
              </div>
            </Step>

            <Step index={5} title="إيداع مبلغ بحد أدنى" complete={states[4]} delay={280}>
              <div className="grid grid-cols-2 gap-3">
                {["300 جنيه", "6 دولار"].map((amount) => (
                  <span
                    key={amount}
                    className="luxe-corners relative rounded-2xl border border-gold/20 bg-[linear-gradient(180deg,oklch(0.22_0.05_300/0.6),oklch(0.11_0.03_300/0.85))] px-4 py-4 text-center text-base font-extrabold text-gold-soft"
                  >
                    {amount}
                  </span>
                ))}
              </div>
              <button
                type="button"
                onClick={() => setDeposited(true)}
                className={`mt-3 w-full rounded-2xl border px-4 py-2.5 text-xs font-extrabold transition-all ${
                  deposited
                    ? "border-gold bg-gold/15 text-gold-soft"
                    : "border-gold/25 text-muted-foreground hover:border-gold/60 hover:text-gold-soft"
                }`}
              >
                {deposited ? "تم الإيداع ✓" : "تأكيد الإيداع"}
              </button>
            </Step>

            <Step index={6} title="إدخال الـ ID الخاص بك" complete={states[5]} delay={350}>
              <input
                value={value}
                onChange={(e) => {
                  setValue(e.target.value.replace(/\D/g, "").slice(0, 14));
                  setError(null);
                }}
                inputMode="numeric"
                placeholder="ID"
                dir="ltr"
                className="w-full rounded-2xl border border-gold/25 bg-background/50 px-4 py-3.5 text-center text-lg font-bold tracking-[0.3em] text-foreground outline-none transition-all placeholder:tracking-normal placeholder:text-muted-foreground/60 focus:border-gold focus:shadow-[0_0_26px_-8px_oklch(0.66_0.26_300/0.9)]"
              />
              {error ? (
                <p className="animate-reveal mt-2 text-center text-[11px] font-semibold text-destructive">
                  {error}
                </p>
              ) : null}
            </Step>
          </div>
        </div>

        {/* Sticky action */}
        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-gold/15 bg-background/70 px-4 py-3 backdrop-blur-2xl">
          <div className="mx-auto max-w-2xl">
            <button
              type="button"
              disabled={checking}
              onClick={() => {
                if (!platform) {
                  setError("من فضلك اختر المنصة أولاً");
                  return;
                }
                if (!/^\d{10,14}$/.test(value)) {
                  setError("الرقم يجب أن يكون من 10 إلى 14 رقم");
                  return;
                }
                setChecking(true);
              }}
              className="gold-button luxe-sheen w-full rounded-2xl px-4 py-4 text-sm font-extrabold tracking-[0.12em] transition-transform active:scale-[0.98]"
            >
              {checking ? "جارٍ التحقق…" : "التحقق من الشروط"}
            </button>
          </div>
        </div>
      </main>
    </>
  );
}

function Step({
  index,
  title,
  complete,
  delay = 0,
  locked = false,
  children,
}: {
  index: number;
  title: string;
  complete?: boolean | undefined;
  delay?: number | undefined;
  locked?: boolean | undefined;
  children: React.ReactNode;
}) {
  return (
    <section
      className={`animate-step-in relative mt-4 ${locked ? "opacity-60" : ""}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <span
        className={`absolute -start-7 top-4 flex h-7 w-7 items-center justify-center rounded-full border text-[11px] font-extrabold transition-all duration-500 ${
          complete
            ? "animate-reveal border-gold bg-gold/25 text-gold-soft shadow-[0_0_18px_oklch(0.66_0.26_300/0.8)]"
            : "border-gold/35 bg-background text-gold-soft/70"
        }`}
      >
        {complete ? "✓" : index}
      </span>
      <div
        className={`luxe-panel luxe-hairline luxe-corners overflow-hidden rounded-3xl p-4 pt-5 transition-all duration-500 ${
          complete ? "border-gold/55 shadow-[0_0_44px_-18px_oklch(0.66_0.26_300/0.9)]" : ""
        }`}
      >
        <h2 className="mb-3 text-[13px] font-extrabold tracking-wide text-foreground">{title}</h2>
        {children}
      </div>
    </section>
  );
}
