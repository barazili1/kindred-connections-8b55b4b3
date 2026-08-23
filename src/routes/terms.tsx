import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";

import logo from "@/assets/brand-logo.jpg";
import gooobetLogo from "@/assets/platforms/gooobet.png";
import megapariLogo from "@/assets/platforms/megapari.png";
import paripulseLogo from "@/assets/platforms/paripulse.png";
import winwinLogo from "@/assets/platforms/winwin.png";
import { useUserId } from "@/components/UserIdGate";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "الشروط — Smart Odds" },
      {
        name: "description",
        content:
          "أكمل شروط التفعيل في Smart Odds: اختر المنصة، سجّل بالبروموكود، انضم للقناة وأودع الحد الأدنى.",
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
  { id: "gooobet", name: "Gooobet", logo: gooobetLogo, url: "https://promogooo.click/Gooo33" },
  {
    id: "paripulse",
    name: "Paripulse",
    logo: paripulseLogo,
    url: "https://refpa22168.com/L?tag=d_3638295m_64499c_&site=3638295&ad=64499",
  },
  { id: "megapari", name: "Megapari", logo: megapariLogo, url: "https://2787591.megapari-228091.com" },
  {
    id: "winwin",
    name: "Winwin",
    logo: winwinLogo,
    url: "https://refpa98980.com/L?tag=d_5876143m_94904c_&site=5876143&ad=94904",
  },
];

const PROMO = "Gooo33";
const TELEGRAM = "https://t.me/+SHa12LG9SFQ3YWE0";
const VIDEO_URL =
  "https://www.image2url.com/r2/default/videos/1787173591197-279815ad-1f2b-4d40-ae23-080397e53271.mp4";

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
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    el.muted = false;
    el.volume = 1;
    void el.play().catch(() => {
      const unlock = () => {
        el.muted = false;
        void el.play();
      };
      window.addEventListener("pointerdown", unlock, { once: true });
      window.addEventListener("touchstart", unlock, { once: true });
    });
  }, []);

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
      {checking ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/60 p-5 backdrop-blur-xl">
          <div
            dir="rtl"
            className="animate-step-in w-full max-w-sm overflow-hidden rounded-3xl border border-accent/30 bg-card/25 p-8 text-center backdrop-blur-xl"
          >
            <div className="relative mx-auto h-20 w-20">
              <span className="absolute inset-0 animate-spin rounded-full border-2 border-accent/20 border-t-accent" />
              <span className="animate-pulse-glow absolute inset-6 rounded-full bg-accent/50 blur-[10px]" />
            </div>
            <p className="mt-6 text-base font-extrabold tracking-wide text-accent">
              جارٍ ربط حسابك بالمنصة المختارة
            </p>
            <p className="mt-2 text-[11px] tracking-widest text-muted-foreground">
              {selected ? selected.name : ""} — الرجاء الانتظار…
            </p>
          </div>
        </div>
      ) : null}

      <main className="relative z-10 min-h-screen pb-28" dir="rtl">
        {/* Header */}
        <header className="sticky top-0 z-30 border-b border-accent/15 bg-background/30 backdrop-blur-2xl">
          <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-2.5">
            <span className="text-[13px] font-extrabold tracking-[0.28em] text-accent">
              SMART ODDS
            </span>
            <span className="rounded-full border border-accent/30 bg-accent/5 px-3 py-0.5 text-[10px] font-bold tracking-[0.2em] text-accent">
              {done}/6
            </span>
          </div>
          <div className="h-[3px] w-full bg-foreground/5">
            <span
              className="block h-full bg-accent transition-[width] duration-700"
              style={{ width: `${progress}%` }}
            />
          </div>
        </header>

        <div className="mx-auto max-w-2xl px-4">
          {/* Hero */}
          <section className="animate-step-in flex flex-col items-center pt-8">
            <img
              src={logo}
              alt="Smart Odds logo"
              width={1253}
              height={844}
              className="animate-float w-56 max-w-full rounded-3xl border border-accent/20 shadow-[0_0_60px_-18px_oklch(0.68_0.18_158/0.7)]"
            />

            <h1 className="mt-5 text-2xl font-extrabold tracking-[0.24em] text-accent">الشـروط</h1>
            <p className="mt-3 text-center text-[13px] font-extrabold text-foreground">
              اسكربت نسبة الحظ RTB جاهز بالسيستم
            </p>
            <p className="mt-2 max-w-xs text-center text-[11.5px] leading-relaxed text-muted-foreground">
              سجل دلوقتي وابدأ مكسبك ونفذ الشروط واحصل على نسبه حظ مضمونه 100%
            </p>

            <div className="mt-5 flex h-[200px] w-[350px] max-w-full shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-accent/25 bg-card/20 backdrop-blur-sm">
              <video
                ref={videoRef}
                src={VIDEO_URL}
                width={350}
                height={200}
                autoPlay
                playsInline
                loop
                controls
                preload="metadata"
                className="block max-h-full max-w-full object-contain"
              />
            </div>
          </section>

          {/* Steps */}
          <div className="mt-8 space-y-3">
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
                      className={`flex h-[86px] w-full flex-col items-center justify-center gap-1.5 rounded-2xl border transition-all duration-300 ${
                        active
                          ? "border-accent bg-accent/10 shadow-[0_0_30px_-10px_oklch(0.68_0.18_158/0.9)]"
                          : "border-accent/15 bg-card/15 hover:border-accent/50"
                      }`}
                    >
                      <span className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full border border-accent/25 bg-background/30">
                        <img
                          src={p.logo}
                          alt={p.name}
                          width={64}
                          height={64}
                          decoding="async"
                          className="h-full w-full object-cover"
                        />
                      </span>
                      <span className="w-full truncate px-1 text-center text-[10px] font-bold text-foreground">
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
              delay={60}
              locked={!platform}
            >
              <a
                href={selected?.url ?? "#"}
                target="_blank"
                rel="noreferrer"
                onClick={() => selected && setRegistered(true)}
                className={`block w-full rounded-2xl px-4 py-3.5 text-center text-sm font-extrabold transition-transform active:scale-[0.98] ${
                  selected ? "gold-button" : "pointer-events-none bg-foreground/15 text-foreground/40"
                }`}
              >
                التسجيل
              </a>
            </Step>

            <Step index={3} title="الانضمام إلى قناة التليجرام" complete={states[2]} delay={120}>
              <a
                href={TELEGRAM}
                target="_blank"
                rel="noreferrer"
                onClick={() => setJoined(true)}
                className="gold-button block w-full rounded-2xl px-4 py-3.5 text-center text-sm font-extrabold transition-transform active:scale-[0.98]"
              >
                انضمام
              </a>
            </Step>

            <Step index={4} title="إنشاء حساب بالبروموكود الخاص بنا" complete={states[3]} delay={180}>
              <div className="flex items-center gap-2">
                <span
                  dir="ltr"
                  className="flex-1 rounded-2xl border border-accent/25 bg-background/25 px-4 py-3.5 text-center text-base font-extrabold tracking-[0.3em] text-accent"
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

            <Step index={5} title="إيداع مبلغ بحد أدنى" complete={states[4]} delay={240}>
              <div className="grid grid-cols-2 gap-3">
                {["300 جنيه", "6 دولار"].map((amount) => (
                  <span
                    key={amount}
                    className="rounded-2xl border border-accent/20 bg-card/20 px-4 py-4 text-center text-base font-extrabold text-accent"
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
                    ? "border-accent bg-accent/15 text-accent"
                    : "border-accent/25 text-muted-foreground hover:border-accent/60 hover:text-accent"
                }`}
              >
                {deposited ? "تم الإيداع ✓" : "تأكيد الإيداع"}
              </button>
            </Step>

            <Step index={6} title="إدخال الـ ID الخاص بك" complete={states[5]} delay={300}>
              <input
                value={value}
                onChange={(e) => {
                  setValue(e.target.value.replace(/\D/g, "").slice(0, 14));
                  setError(null);
                }}
                inputMode="numeric"
                placeholder="ID"
                dir="ltr"
                className="w-full rounded-2xl border border-accent/25 bg-background/25 px-4 py-3.5 text-center text-lg font-bold tracking-[0.3em] text-foreground outline-none transition-all placeholder:tracking-normal placeholder:text-muted-foreground/60 focus:border-accent"
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
        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-accent/15 bg-background/40 px-4 py-3 backdrop-blur-2xl">
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
              className="gold-button w-full rounded-2xl px-4 py-4 text-sm font-extrabold tracking-[0.12em] transition-transform active:scale-[0.98]"
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
      className={`animate-step-in relative rounded-3xl border p-4 backdrop-blur-md transition-all duration-500 ${
        locked ? "opacity-60" : ""
      } ${complete ? "border-accent/50 bg-accent/[0.06]" : "border-accent/15 bg-card/15"}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="mb-3 flex items-center gap-2">
        <span
          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-[11px] font-extrabold ${
            complete
              ? "border-accent bg-accent/20 text-accent"
              : "border-accent/35 bg-background/40 text-muted-foreground"
          }`}
        >
          {complete ? "✓" : index}
        </span>
        <h2 className="text-[13px] font-extrabold tracking-wide text-foreground">{title}</h2>
      </div>
      {children}
    </section>
  );
}
