import { Link } from "@tanstack/react-router";
import { Download, MessageCircle, Images, ScrollText } from "lucide-react";
import { LOGO_URL } from "@/lib/assets";
import { StatusBadge } from "./StatusBadge";
import { useI18n } from "@/lib/i18n";
import { useAdminSettings } from "@/lib/admin-settings";

export function Navbar() {
  const { t, lang, setLang } = useI18n();
  const { settings } = useAdminSettings();

  return (
    <header
      className="sticky top-0 z-40 border-b border-border/50 backdrop-blur-md"
      style={{ background: "color-mix(in oklab, var(--background) 70%, transparent)" }}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
        <Link to="/" className="group flex items-center gap-3">
          <img
            src={LOGO_URL}
            alt="GhostLand 8"
            className="h-10 w-10 animate-glitch drop-shadow-[0_0_10px_oklch(0.55_0.20_285/0.6)]"
          />
          <span className="hidden font-heading text-lg font-bold tracking-wide text-ghost sm:inline">
            GhostLand<span className="text-ember">·8</span>
          </span>
        </Link>

        <div className="flex items-center gap-1 sm:gap-3">
          <Link
            to="/download"
            className="hidden items-center gap-1.5 rounded-full bg-primary/15 px-3 py-1.5 text-xs font-semibold text-primary transition-colors hover:bg-primary/25 sm:inline-flex"
          >
            <Download className="h-4 w-4" />
            {t("nav.download")}
          </Link>
          <StatusBadge className="hidden sm:inline-flex" />
          <Link
            to="/screenshots"
            className="hidden items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground md:inline-flex"
          >
            <Images className="h-4 w-4" />
            {t("nav.screenshots")}
          </Link>
          <Link
            to="/lore"
            className="hidden items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground md:inline-flex"
          >
            <ScrollText className="h-4 w-4" />
            {t("nav.lore")}
          </Link>
          <a
            href={settings.discordInvite}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full bg-accent/20 px-3 py-1.5 text-xs font-medium text-accent-foreground transition-colors hover:bg-accent/35"
          >
            <MessageCircle className="h-4 w-4" />
            <span className="hidden sm:inline">{t("nav.discord")}</span>
          </a>
          <button
            onClick={() => setLang(lang === "pl" ? "en" : "pl")}
            className="rounded-full border border-border px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground"
            aria-label="Language"
          >
            {lang.toUpperCase()}
          </button>
        </div>
      </nav>
    </header>
  );
}