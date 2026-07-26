import { useState } from "react";
import { useAdminSettings } from "@/lib/admin-settings";
import { useI18n } from "@/lib/i18n";
import { MessageCircle, ExternalLink } from "lucide-react";

export function DiscordWidget() {
  const { settings } = useAdminSettings();
  const { t } = useI18n();
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="glass overflow-hidden rounded-2xl">
      <div className="flex items-center justify-between border-b border-border/50 px-5 py-3">
        <div className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5 text-accent" />
          <div>
            <h3 className="font-heading text-sm font-semibold">{t("community.title")}</h3>
            <p className="text-xs text-muted-foreground">{t("community.subtitle")}</p>
          </div>
        </div>
        <a
          href={settings.discordInvite}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 rounded-full bg-accent/20 px-3 py-1 text-xs font-medium text-accent-foreground hover:bg-accent/30"
        >
          {t("nav.discord")} <ExternalLink className="h-3 w-3" />
        </a>
      </div>
      <div className="relative h-[350px] bg-black/40">
        {!loaded && settings.discordWidgetId && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-xs text-muted-foreground">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent/40 border-t-accent" />
            {t("community.loading")}
          </div>
        )}
        {settings.discordWidgetId ? (
          <iframe
            title="Discord widget"
            src={`https://discord.com/widget?id=${settings.discordWidgetId}&theme=dark`}
            width="100%"
            height="100%"
            frameBorder={0}
            sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
            onLoad={() => setLoaded(true)}
            className="relative z-10"
          />
        ) : (
          <div className="flex h-full items-center justify-center px-6 text-center text-sm text-muted-foreground">
            Widget ID nie jest skonfigurowany. Kliknij „Discord" powyżej, żeby dołączyć.
          </div>
        )}
      </div>
    </div>
  );
}