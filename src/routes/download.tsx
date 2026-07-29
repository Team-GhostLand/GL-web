import { createFileRoute } from "@tanstack/react-router";
import { Download, MessageCircle, Package, FileArchive } from "lucide-react";
import { Link } from "@tanstack/react-router";
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
  const settings = useAdminSettings();
  const { t } = useI18n();

  const targetMs = new Date(settings.countdownTargetIso).getTime();
  const countdownEnded = settings.countdownForceStart || targetMs <= Date.now();

  const availableLinks = (settings.modpackLinks || []).filter((link) => {
    if (!link.url || !link.url.trim()) return false;
    if (link.onlyAfterCountdown && !countdownEnded) return false;
    return true;
  });

  return (
    <main className="mx-auto max-w-3xl px-4 py-16">
      <header className="text-center">
        <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">Modpack</p>
        <h1 className="mt-2 font-heading text-4xl font-bold text-ember sm:text-5xl">{t("download.title")}</h1>
      </header>

      {availableLinks.length === 0 ? (
        <div className="glass mt-10 rounded-2xl p-10 text-center">
          <Package className="mx-auto h-12 w-12 text-muted-foreground/60 animate-pulse" />
          <h2 className="mt-4 font-heading text-2xl font-bold text-ember">Do pobrania wkrótce!</h2>
          <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">
            Pliki modpacka nie są w tej chwili dostępne. Odliczanie jeszcze trwa lub opcje pobierania zostaną wkrótce aktywowane.
          </p>
        </div>
      ) : (
        <div className="mt-10 flex flex-col gap-4">
          {availableLinks.map((link) => (
            <div key={link.id} className="glass rounded-2xl p-6 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="rounded-xl bg-primary/10 p-3 text-primary">
                  <Package className="h-7 w-7" />
                </div>
                <div>
                  <h3 className="font-heading text-lg font-bold text-foreground">
                    {link.label || "Pobierz Modpack"}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {t("download.version")}: <span className="font-mono text-foreground font-semibold">{link.version || "8.0.0"}</span>
                  </p>
                </div>
              </div>
              <a
                href={link.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground glow-ember transition-transform hover:scale-105"
              >
                <Download className="h-4 w-4" />
                {t("download.cta")}
              </a>
            </div>
          ))}
        </div>
      )}

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

      <section className="mt-10 text-center">
        <Link
          to="/versions"
          className="group inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-5 py-3 text-xs font-semibold text-primary transition-all hover:border-primary hover:bg-primary/20"
        >
          <FileArchive className="h-4 w-4" />
          Pełne archiwum CI → /versions
        </Link>
        <p className="mt-2 text-[11px] text-muted-foreground/70">
          Historyczne i developerskie .mrpack z serwera CI (modpacks + dev-sharing).
        </p>
      </section>
    </main>
  );
}