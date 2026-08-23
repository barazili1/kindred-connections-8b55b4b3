import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import logo from "@/assets/brand-logo.jpg";
import paripulseLogo from "@/assets/platforms/paripulse.png";
import winwinLogo from "@/assets/platforms/winwin.png";
import stepDeposit from "@/assets/steps/step-deposit.png";
import stepId from "@/assets/steps/step-id.png";
import stepPlatform from "@/assets/steps/step-platform.png";
import stepPromo from "@/assets/steps/step-promo.png";
import stepRegister from "@/assets/steps/step-register.png";
import stepTelegram from "@/assets/steps/step-telegram.png";
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
  {
    id: "paripulse",
    name: "Paripulse",
    logo: paripulseLogo,
    url: "https://refpa22168.com/L?tag=d_3638295m_65213c_&site=3638295&ad=65213",
  },
  {
    id: "winwin",
    name: "Winwin",
    logo: winwinLogo,
    url: "https://refpa98980.com/L?tag=d_5876143m_68383c_&site=5876143&ad=68383",
  },
];

const PROMO = "Gooo33";
const TELEGRAM = "https://t.me/+tbMHcXObKvI0Zjlk";

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

  useEffect(() => {
    if (!copied) return;
    const t = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(t);
  }, [copied]);

  const selected = platforms.find((p) => p.id === platform);
  const idValid = /^\d{10,14}$/.test(value);
  const states = [Boolean(platform), registered, joined, copied, deposited, idValid];
  const done = states.filter(Boolean).length;
  const progress = Math.round((done / 6) * 100);

  const steps = [
    {
      id: "platform",
      title: "اختر المنصة",
      icon: stepPlatform,
      complete: states[0],
      content: (
        <div className="grid grid-cols-2 gap-3">
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
                className={`group relative flex flex-col items-center justify-center gap-2 rounded-2xl border p-4 transition-all duration-300 active:scale-[0.98] ${
                  active
                    ? "border-accent bg-accent/10 shadow-[0_0_30px_-12px_oklch(0.72_0.17_165/0.9)]"
                    : "border-border/40 bg-card/10 hover:border-accent/50 hover:bg-card/20"
                }`}
              >
                <span className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-full border border-accent/20 bg-background/40 transition-transform duration-300 group-hover:scale-105">
                  <img
                    src={p.logo}
                    alt={p.name}
                    width={64}
                    height={64}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover"
                  />
                </span>
                <span className="text-xs font-bold text-foreground">{p.name}</span>
                {active && (
                  <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-[10px] font-extrabold text-accent-foreground">
                    ✓
                  </span>
                )}
              </button>
            );
          })}
        </div>
      ),
    },
    {
      id: "register",
      title: `تحميل وتسجيل ${selected ? selected.name : "المنصة"}`,
      icon: stepRegister,
      complete: states[1],
      locked: !platform,
      content: (
        <a
          href={selected?.url ?? "#"}
          target="_blank"
          rel="noreferrer"
          onClick={() => selected && setRegistered(true)}
          className={`flex items-center justify-center gap-2 rounded-2xl px-5 py-4 text-sm font-extrabold transition-all active:scale-[0.98] ${
            selected
              ? "gold-button text-background"
              : "pointer-events-none bg-foreground/10 text-foreground/40"
          }`}
        >
          <span>تحميل + التسجيل</span>
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M7 17L17 7M17 7H7M17 7V17" />
          </svg>
        </a>
      ),
    },
    {
      id: "telegram",
      title: "الانضمام لقناة التليجرام",
      icon: stepTelegram,
      complete: states[2],
      content: (
        <a
          href={TELEGRAM}
          target="_blank"
          rel="noreferrer"
          onClick={() => setJoined(true)}
          className="gold-button flex items-center justify-center gap-2 rounded-2xl px-5 py-4 text-sm font-extrabold text-background transition-all active:scale-[0.98]"
        >
          <span>الانضمام للقناة</span>
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.19-.04-.27-.02-.12.03-1.99 1.27-5.62 3.72-.53.36-1.01.54-1.44.53-.47-.01-1.38-.27-2.05-.49-.82-.27-1.47-.42-1.41-.88.03-.24.37-.49 1.02-.74 3.99-1.74 6.65-2.89 7.98-3.46 3.79-1.58 4.58-1.86 5.09-1.87.11 0 .37.03.54.18.14.12.18.28.2.45-.02.07-.02.24-.04.38z" />
          </svg>
        </a>
      ),
    },
    {
      id: "promo",
      title: "نسخ البروموكود",
      icon: stepPromo,
      complete: states[3],
      content: (
        <div className="flex items-center gap-2">
          <span
            dir="ltr"
            className="flex-1 rounded-2xl border border-accent/25 bg-background/30 px-4 py-3.5 text-center text-base font-extrabold tracking-[0.25em] text-accent"
          >
            {PROMO}
          </span>
          <button
            type="button"
            onClick={() => {
              void navigator.clipboard?.writeText(PROMO);
              setCopied(true);
            }}
            className="gold-button rounded-2xl px-6 py-3.5 text-sm font-extrabold text-background transition-all active:scale-[0.98]"
          >
            {copied ? "تم ✓" : "نسخ"}
          </button>
        </div>
      ),
    },
    {
      id: "deposit",
      title: "إيداع الحد الأدنى",
      icon: stepDeposit,
      complete: states[4],
      content: (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            {["300 جنيه", "6 دولار"].map((amount) => (
              <span
                key={amount}
                className="rounded-2xl border border-accent/20 bg-card/15 px-4 py-3.5 text-center text-sm font-extrabold text-accent"
              >
                {amount}
              </span>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setDeposited(true)}
            className={`w-full rounded-2xl border px-4 py-3 text-xs font-extrabold transition-all ${
              deposited
                ? "border-accent bg-accent/15 text-accent"
                : "border-border/50 bg-background/20 text-muted-foreground hover:border-accent/60 hover:text-accent"
            }`}
          >
            {deposited ? "تم الإيداع ✓" : "تأكيد الإيداع"}
          </button>
        </div>
      ),
    },
    {
      id: "id",
      title: "إدخال الـ ID",
      icon: stepId,
      complete: states[5],
      content: (
        <div className="space-y-2">
          <input
            value={value}
            onChange={(e) => {
              setValue(e.target.value.replace(/\D/g, "").slice(0, 14));
              setError(null);
            }}
            inputMode="numeric"
            placeholder="ID"
            dir="ltr"
            className="w-full rounded-2xl border border-accent/25 bg-background/25 px-4 py-3.5 text-center text-lg font-bold tracking-[0.3em] text-foreground outline-none transition-all placeholder:tracking-normal placeholder:text-muted-foreground/60 focus:border-accent focus:bg-background/40"
          />
          <p className="text-center text-[10px] font-medium text-muted-foreground">
            أدخل رقم حسابك من 10 إلى 14 رقم
          </p>
        </div>
      ),
    },
  ];

  return (
    <>
      {checking ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-5 backdrop-blur-xl">
          <div
            dir="rtl"
            className="w-full max-w-sm overflow-hidden rounded-3xl border border-accent/30 bg-card/30 p-8 text-center backdrop-blur-2xl"
          >
            <div className="relative mx-auto h-24 w-24">
              <span className="absolute inset-0 animate-spin rounded-full border-2 border-accent/20 border-t-accent" />
              <span className="absolute inset-7 rounded-full bg-accent/40 blur-[12px]" />
            </div>
            <p className="mt-6 text-lg font-extrabold tracking-wide text-accent">
              جارٍ ربط حسابك
            </p>
            <p className="mt-2 text-xs tracking-widest text-muted-foreground">
              {selected ? selected.name : ""} — الرجاء الانتظار…
            </p>
          </div>
        </div>
      ) : null}

      <main className="relative z-10 min-h-screen pb-32" dir="rtl">
        {/* Header */}
        <header className="sticky top-0 z-30 border-b border-border/30 bg-background/40 backdrop-blur-2xl">
          <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-3">
            <div className="flex items-center gap-2.5">
              <img
                src={logo}
                alt="Smart Odds logo"
                width={1253}
                height={844}
                className="h-9 w-auto rounded-xl border border-accent/20 object-cover"
              />
              <span className="text-[11px] font-extrabold tracking-[0.2em] text-accent">
                الشروط
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-muted-foreground">التقدم</span>
              <span className="rounded-full border border-accent/30 bg-accent/5 px-3 py-0.5 text-[10px] font-bold tracking-widest text-accent">
                {done}/6
              </span>
            </div>
          </div>
          <div className="h-1 w-full bg-foreground/5">
            <span
              className="block h-full bg-accent shadow-[0_0_14px_oklch(0.72_0.17_165/0.8)] transition-[width] duration-700"
              style={{ width: `${progress}%` }}
            />
          </div>
        </header>

        <div className="mx-auto max-w-2xl px-4">
          {/* Hero */}
          <section className="relative mt-6 overflow-hidden rounded-[2rem] border border-accent/15 bg-card/10 px-5 py-8 text-center backdrop-blur-md">
            <span className="pointer-events-none absolute -top-20 left-1/2 h-48 w-48 -translate-x-1/2 rounded-full bg-accent/15 blur-[90px]" />
            <span className="pointer-events-none absolute -bottom-10 right-0 h-32 w-32 rounded-full bg-primary/20 blur-[70px]" />

            <div className="relative mx-auto w-fit">
              <div className="absolute inset-0 rounded-3xl bg-accent/20 blur-[30px]" />
              <img
                src={logo}
                alt="Smart Odds logo"
                width={1253}
                height={844}
                className="relative mx-auto w-48 max-w-full rounded-2xl border border-accent/20 object-cover shadow-[0_0_40px_-12px_oklch(0.72_0.17_165/0.6)]"
              />
            </div>

            <h1 className="relative mt-5 text-3xl font-black tracking-[0.18em] text-accent">
              الشروط
            </h1>
            <p className="relative mt-2 text-sm font-bold text-foreground">
              أكمل 6 خطوات بسيطة وابدأ مكسبك
            </p>
            <p className="relative mx-auto mt-2 max-w-xs text-xs leading-relaxed text-muted-foreground">
              نفّذ الشروط بالترتيب وادخل الـ ID علشان تفتح لك كل الألعاب والتوقعات
            </p>

            <div className="relative mt-5 flex flex-wrap items-center justify-center gap-2">
              {["اختر المنصة", "سجّل حساب", "انضم للقناة", "انسخ البرومو", "أودع", "أدخل ID"].map(
                (label, i) => (
                  <span
                    key={label}
                    className={`rounded-full px-3 py-1 text-[9px] font-bold tracking-wide ${
                      i < done
                        ? "border border-accent/40 bg-accent/10 text-accent"
                        : "border border-border/40 bg-background/20 text-muted-foreground"
                    }`}
                  >
                    {i < done ? "✓ " : ""}
                    {label}
                  </span>
                )
              )}
            </div>
          </section>

          {/* Steps */}
          <div className="mt-6 space-y-4">
            {steps.map((step, i) => (
              <Step
                key={step.id}
                index={i + 1}
                title={step.title}
                icon={step.icon}
                complete={step.complete}
                locked={step.locked}
                delay={i * 80}
              >
                {step.content}
              </Step>
            ))}
          </div>
        </div>

        {/* Sticky action */}
        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border/30 bg-background/50 px-4 py-3 backdrop-blur-2xl">
          <div className="mx-auto max-w-2xl">
            {error ? (
              <p className="animate-reveal mb-2 text-center text-xs font-semibold text-destructive">
                {error}
              </p>
            ) : null}
            <button
              type="button"
              disabled={checking}
              onClick={() => {
                if (!platform) {
                  setError("من فضلك اختر المنصة أولاً");
                  return;
                }
                if (!/\d{10,14}/.test(value)) {
                  setError("الرقم يجب أن يكون من 10 إلى 14 رقم");
                  return;
                }
                setError(null);
                setChecking(true);
              }}
              className="gold-button w-full rounded-2xl px-4 py-4 text-sm font-extrabold tracking-widest text-background transition-all active:scale-[0.98]"
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
  icon,
  complete,
  delay = 0,
  locked = false,
  children,
}: {
  index: number;
  title: string;
  icon: string;
  complete?: boolean;
  delay?: number;
  locked?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section
      className={`animate-step-in relative overflow-hidden rounded-3xl border p-5 backdrop-blur-md transition-all duration-500 ${
        locked ? "opacity-60" : ""
      } ${complete ? "border-accent/50 bg-accent/[0.06]" : "border-border/30 bg-card/10"}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <span
        className={`pointer-events-none absolute -left-10 -top-10 h-28 w-28 rounded-full blur-[60px] transition-opacity duration-500 ${
          complete ? "bg-accent/30" : "bg-accent/8"
        }`}
      />
      <div className="relative mb-4 flex items-center gap-4">
        <span className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-accent/25 bg-background/25">
          <img
            src={icon}
            alt=""
            width={512}
            height={512}
            loading="lazy"
            decoding="async"
            className="h-9 w-9 object-contain drop-shadow-[0_0_10px_oklch(0.72_0.17_165/0.5)]"
          />
          {complete && (
            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-[10px] font-extrabold text-accent-foreground">
              ✓
            </span>
          )}
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-bold tracking-[0.28em] text-accent/70">STEP {index}</p>
          <h2 className="text-sm font-extrabold tracking-wide text-foreground">{title}</h2>
        </div>
        <span
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-xs font-extrabold ${
            complete
              ? "border-accent bg-accent/20 text-accent"
              : "border-border/50 bg-background/40 text-muted-foreground"
          }`}
        >
          {complete ? "✓" : index}
        </span>
      </div>
      <div className="relative">{children}</div>
    </section>
  );
}
