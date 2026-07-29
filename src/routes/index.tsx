import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Download, MessageCircle, Terminal, ArrowRight } from "lucide-react";
import { CountdownTimer } from "@/components/CountdownTimer";
import { DiscordWidget } from "@/components/DiscordWidget";
import { useI18n } from "@/lib/i18n";
import { useAdminSettings } from "@/lib/admin-settings";
import { BANNER_URL } from "@/lib/assets";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "GhostLand 8.0 — prywatny modpack Minecraft" },
      { name: "description", content: "Odliczanie do startu 8. edycji GhostLand: mrocznego, immersyjnego modpacka NEOFORGE 1.21.1. Pobierz paczkę i dołącz przez Discord." },
      { property: "og:title", content: "GhostLand 8.0 — prywatny modpack Minecraft" },
      { property: "og:description", content: "Odliczanie do startu 8. edycji GhostLand: mroczny, immersyjny modpack NEOFORGE 1.21.1." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

function Home() {
  const { t } = useI18n();
  const { settings } = useAdminSettings();

  const stats = [
    { n: "8", label: t("stats.editions") },
    { n: "100+", label: t("stats.players") },
    { n: "5", label: t("stats.years") },
    { n: "1000+", label: t("stats.hours") },
  ];

  const targetMs = new Date(settings.countdownTargetIso).getTime();
  const countdownEnded = settings.countdownForceStart || targetMs <= Date.now();

  const availableLinks = (settings.modpackLinks || []).filter((link) => {
    if (!link.url || !link.url.trim()) return false;
    if (link.onlyAfterCountdown && !countdownEnded) return false;
    return true;
  });

  const firstLink = availableLinks[0];

  return (
    <main className="relative">
      <section className="relative flex min-h-[85vh] flex-col items-center justify-center px-4 pt-16 pb-24 text-center">
        <motion.img
          src={BANNER_URL}
          alt="GhostLand 8.0"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="mx-auto mb-8 w-full max-w-3xl animate-shimmer"
        />
        <h1 className="sr-only">GhostLand 8.0 — półprywatny modpack Minecraft NeoForge 1.21.1</h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 1 }}
          className="max-w-2xl font-heading text-base text-foreground/90 sm:text-lg"
        >
          {t("hero.subtitle")}
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 1 }}
          className="mt-3 max-w-xl text-sm text-muted-foreground"
        >
          {t("hero.description")}
        </motion.p>
      </section>

      <CountdownTimer />

      <section className="mx-auto mt-24 grid w-full max-w-6xl gap-6 px-4 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="glass rounded-2xl p-6 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center gap-2 text-primary">
              <Download className="h-5 w-5" />
              <h3 className="font-heading text-xl font-semibold">{t("download.title")}</h3>
            </div>
            {firstLink ? (
              <>
                <p className="mt-1 text-xs text-muted-foreground">
                  {t("download.version")}: <span className="font-mono text-foreground font-semibold">{firstLink.version || "8.0.0"}</span> — {firstLink.label}
                </p>
                <div className="mt-5 flex flex-wrap items-center gap-3">
                  <a
                    href={firstLink.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 font-semibold text-primary-foreground transition-all hover:scale-[1.02] glow-ember"
                  >
                    <Download className="h-5 w-5" />
                    {t("download.cta")}
                  </a>
                  <Link to="/download" className="text-xs text-muted-foreground underline underline-offset-2 hover:text-foreground">
                    Wszystkie wersje ({availableLinks.length}) →
                  </Link>
                </div>
              </>
            ) : (
              <div className="mt-4">
                <p className="font-heading text-lg font-bold text-ember">Do pobrania wkrótce!</p>
                <p className="mt-1 text-xs text-muted-foreground">Paczka zostanie udostępniona po odliczaniu.</p>
                <Link to="/download" className="mt-4 inline-block text-xs text-muted-foreground underline underline-offset-2 hover:text-foreground">
                  Zobacz stronę pobierania →
                </Link>
              </div>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="glass rounded-2xl p-6"
        >
          <div className="flex items-center gap-2 text-accent">
            <Terminal className="h-5 w-5" />
            <h3 className="font-heading text-xl font-semibold">Whitelist</h3>
          </div>
          <ol className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>1. {t("download.step1")}</li>
            <li>2. {t("download.step2")}</li>
            <li>3. {t("download.step3")}</li>
            <li>4. {t("download.step4")}</li>
          </ol>
          <a
            href={settings.discordInvite}
            target="_blank"
            rel="noreferrer"
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-accent/25 px-5 py-3 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent/40"
          >
            <MessageCircle className="h-5 w-5" />
            {t("nav.discord")}
          </a>
        </motion.div>
      </section>

      <section className="mx-auto mt-24 grid w-full max-w-6xl grid-cols-2 gap-4 px-4 md:grid-cols-4">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
            className="glass rounded-2xl p-6 text-center"
          >
            <div className="font-heading text-4xl font-bold text-ember">{s.n}</div>
            <div className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">{s.label}</div>
          </motion.div>
        ))}
      </section>

      <section className="mx-auto mt-24 w-full max-w-6xl px-4">
        <DiscordWidget />
      </section>

      <section className="mx-auto mt-24 w-full max-w-6xl px-4">
        <Link
          to="/lore"
          className="group glass flex items-center justify-between rounded-2xl p-6 transition-all hover:glow-ghost"
        >
          <div>
            <h3 className="font-heading text-2xl font-semibold text-ghost">{t("lore.teaser")}</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              8 edycji, GRA, GAY, GTA, MAGA — poznaj legendy świata GhostLand.
            </p>
          </div>
          <ArrowRight className="h-6 w-6 text-accent transition-transform group-hover:translate-x-1" />
        </Link>
      </section>
    </main>
  );
}
