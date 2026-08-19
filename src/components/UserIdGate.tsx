import { useEffect, useState } from "react";

const STORAGE_KEY = "smart-odds-user-id";

export function useUserId() {
  const [userId, setUserId] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setUserId(window.localStorage.getItem(STORAGE_KEY));
    setReady(true);
  }, []);

  const save = (id: string) => {
    window.localStorage.setItem(STORAGE_KEY, id);
    setUserId(id);
  };

  return { userId, ready, save };
}

export function UserIdGate({
  ready,
  userId,
  onSave,
}: {
  ready: boolean;
  userId: string | null;
  onSave: (id: string) => void;
}) {
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);

  const valid = /^\d{10,14}$/.test(value);

  useEffect(() => {
    if (!connecting) return;
    const t = window.setTimeout(() => {
      onSave(value);
      setConnecting(false);
    }, 2600);
    return () => window.clearTimeout(t);
  }, [connecting, value, onSave]);

  if (!ready || userId) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-5 backdrop-blur-md">
      <div className="animate-rise w-full max-w-sm rounded-3xl border border-primary/35 bg-[linear-gradient(160deg,oklch(0.16_0.05_300/0.95),oklch(0.09_0.03_300/0.97))] p-6 text-center shadow-[0_30px_80px_-30px_oklch(0_0_0/0.9)]">
        {connecting ? (
          <div dir="rtl" className="flex flex-col items-center gap-4 py-6">
            <span className="h-10 w-10 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
            <p className="text-sm font-bold text-foreground">جار ربط حسابك بالسيرفر…</p>
            <p className="text-[11px] text-muted-foreground">من فضلك انتظر لحظات</p>
          </div>
        ) : (
          <div dir="rtl" className="flex flex-col gap-4">
            <p className="text-sm font-bold leading-relaxed text-foreground">
              الرجاء ادخال ID الخاص بك للحصول علي توقعات سليمه بنسبه 90%
            </p>
            <input
              value={value}
              onChange={(e) => {
                setValue(e.target.value.replace(/\D/g, "").slice(0, 14));
                setError(null);
              }}
              inputMode="numeric"
              placeholder="ID"
              dir="ltr"
              className="w-full rounded-2xl border border-primary/30 bg-background/60 px-4 py-3 text-center text-base font-bold tracking-[0.2em] text-foreground outline-none transition-colors focus:border-primary"
            />
            {error ? <p className="text-[11px] font-semibold text-destructive">{error}</p> : null}
            <button
              type="button"
              onClick={() => {
                if (!valid) {
                  setError("الرقم يجب ان يكون من 10 الي 14 رقم");
                  return;
                }
                setConnecting(true);
              }}
              className="w-full rounded-2xl bg-foreground px-4 py-3 text-sm font-extrabold text-background transition-transform active:scale-[0.98]"
            >
              تأكيد
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
