import { createFileRoute } from "@tanstack/react-router";
import { Download, MessageCircle, Package } from "lucide-react";
import { useAdminSettings } from "@/lib/admin-settings";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/download")({
  head: () => ({
    meta: [
      { title: "Pobierz modpack — GhostLand 8.0" },
      { name: "description", content: "Pobierz najnowszą wersję modpacka GhostLand i dowiedz się, jak dołączyć do serwera przez Discord." },
      { property: "og:title", content: "Pobierz modpack — GhostLand 8.0" },
      { property: "og:description", content: "Pobierz najnowszą wersję modpacka GhostLand." },
      { property: "og:type", content: "website" },
    ],
  }),
  component: DownloadPage,
});

function DownloadPage() {
  const { settings } = useAdminSettings();
  const { t } = useI18n();

  return (
    <main className="mx-auto max-w-3xl px-4 py-16">
      <header className="text-center">
        <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">Modpack</p>
        <h1 className="mt-2 font-heading text-4xl font-bold text-ember sm:text-5xl">{t("download.title")}</h1>
      </header>

      <div className="glass mt-10 rounded-2xl p-8 text-center">
        <Package className="mx-auto h-10 w-10 text-primary" />
        <p className="mt-3 text-xs uppercase tracking-widest text-muted-foreground">
          {t("download.version")}
        </p>
        <p className="font-mono text-lg font-semibold">{settings.modpackVersion}</p>
        <a
          href={settings.modpackUrl}
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 font-semibold text-primary-foreground glow-ember transition-transform hover:scale-105"
        >
          <Download className="h-5 w-5" />
          {t("download.cta")}
        </a>
      </div>

      <section className="glass mt-6 rounded-2xl p-8">
        <h2 className="font-heading text-xl font-semibold">{t("download.howto")}</h2>
        <ol className="mt-4 space-y-3 text-sm text-muted-foreground">
          <li><span className="mr-2 font-bold text-primary">1.</span>{t("download.step1")}</li>
          <li><span className="mr-2 font-bold text-primary">2.</span>{t("download.step2")}</li>
          <li><span className="mr-2 font-bold text-primary">3.</span>{t("download.step3")}</li>
          <li><span className="mr-2 font-bold text-primary">4.</span>{t("download.step4")}</li>
        </ol>
        <a
          href={settings.discordInvite}
          target="_blank"
          rel="noreferrer"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-accent/25 px-5 py-3 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent/40"
        >
          <MessageCircle className="h-4 w-4" />
          {t("nav.discord")}
        </a>
      </section>
    </main>
  );
}