import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAdminSettings } from "@/lib/settings";
import { useI18n } from "@/lib/i18n";
import { Download, Sparkles } from "lucide-react";
import { Link } from "@tanstack/react-router";

function useCountdown(targetIso: string) {
  const target = useMemo(() => new Date(targetIso).getTime(), [targetIso]);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  });

  const diff = Math.max(0, target - now);
  return {
    d: Math.floor(diff / 86_400_000),
    h: Math.floor((diff / 3_600_000) % 24),
    m: Math.floor((diff / 60_000) % 60),
    s: Math.floor((diff / 1000) % 60),
    done: diff === 0,
  };
}

function Digit({ value, label }: { value: number; label: string }) {
  const padded = value.toString().padStart(2, "0");
  const isLarge = padded.length > 2;
  const fontSizeClass = isLarge
    ? "text-3xl sm:text-5xl font-bold"
    : "text-4xl sm:text-6xl font-bold";

  return (
    <div className="glass flex flex-col items-center justify-center rounded-2xl px-3 py-4 sm:px-6 sm:py-5 min-w-[76px] sm:min-w-[110px] w-auto transition-all">
      <div className="relative flex h-12 w-full items-center justify-center overflow-hidden sm:h-16">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div
            key={padded}
            initial={{ y: "-100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 26 }}
            className={`absolute inset-0 flex items-center justify-center font-heading tabular-nums text-ember ${fontSizeClass}`}
          >
            {padded}
          </motion.div>
        </AnimatePresence>
      </div>
      <span className="mt-1 text-[10px] uppercase tracking-[0.2em] text-muted-foreground sm:text-xs">{label}</span>
    </div>
  );
}

export function CountdownTimer() {
  const settings = useAdminSettings();
  const { t } = useI18n();
  const { d, h, m, s, done } = useCountdown(settings.countdownTargetIso);

  return (
    <section className="mx-auto flex w-full max-w-4xl flex-col items-center gap-6 px-4">
      <h2 className="font-heading text-sm uppercase tracking-[0.4em] text-muted-foreground">
        {t("countdown.title")}
      </h2>

      <AnimatePresence mode="wait">
        {done ? (
          <motion.div
            key="live"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col items-center gap-6 text-center"
          >
            <motion.div
              animate={{ scale: [1, 1.03, 1] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
              className="flex items-center gap-3 rounded-full glass px-6 py-3 glow-ember"
            >
              <Sparkles className="h-5 w-5 text-primary" />
              <span className="font-heading text-lg font-semibold text-ember sm:text-2xl">
                {t("countdown.live")}
              </span>
              <Sparkles className="h-5 w-5 text-primary" />
            </motion.div>
            <Link
              to="/download"
              className="group inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 font-semibold text-primary-foreground glow-ember transition-transform hover:scale-105"
            >
              <Download className="h-5 w-5" />
              {t("download.cta")}
            </Link>
          </motion.div>
        ) : (
          <motion.div
            key="ticking"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex flex-wrap items-center justify-center gap-3 sm:gap-5"
          >
            <Digit value={d} label={t("countdown.days")} />
            <span className="font-heading text-3xl text-muted-foreground sm:text-5xl">:</span>
            <Digit value={h} label={t("countdown.hours")} />
            <span className="font-heading text-3xl text-muted-foreground sm:text-5xl">:</span>
            <Digit value={m} label={t("countdown.minutes")} />
            <span className="font-heading text-3xl text-muted-foreground sm:text-5xl">:</span>
            <Digit value={s} label={t("countdown.seconds")} />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}