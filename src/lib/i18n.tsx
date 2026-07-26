import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { LANG_KEY } from "./admin-config";

export type Lang = "pl" | "en";

const dict = {
  pl: {
    "nav.download": "Pobierz Paczkę",
    "nav.status": "Status Serwera",
    "nav.discord": "Discord",
    "nav.screenshots": "Zrzuty Ekranu",
    "nav.lore": "Lore",
    "hero.subtitle": "Edycja 8.0 · NEOFORGE 1.21.1 · immersja, przygoda, technologia i aeronautyka!",
    "hero.description": "Porządny prywatny modpack skupiony na dobrej atmosferze i wspólnym budowaniu świata i wacky konstrukcjach.",
    "countdown.title": "Odliczanie do startu Edycji 8",
    "countdown.days": "dni",
    "countdown.hours": "godzin",
    "countdown.minutes": "minut",
    "countdown.seconds": "sekund",
    "countdown.live": "EDYCJA 8 OFICJALNIE WYSTARTOWAŁA!",
    "countdown.paused": "Odliczanie wstrzymane przez administrację",
    "download.title": "Pobierz Modpack",
    "download.cta": "Pobierz Paczkę Modyfikacji",
    "download.version": "Wersja",
    "download.howto": "Jak dołączyć",
    "download.step1": "Zainstaluj Prism Launcher lub Modrinth App.",
    "download.step2": "Zaimportuj pobrany plik .mrpack.",
    "download.step3": "Napisz na Discordzie /whitelistuj <twój_nick>.",
    "download.step4": "Poczekaj na potwierdzenie bota i wskakuj na serwer.",
    "status.online": "Serwer online",
    "status.offline": "Serwer offline",
    "status.maintenance": "Przerwa techniczna",
    "status.started": "Edycja wystartowała",
    "status.checking": "Sprawdzanie…",
    "status.players": "graczy",
    "community.title": "Dołącz do społeczności",
    "community.subtitle": "Discord GhostLand — komunikacja, bot whitelisty, ogłoszenia.",
    "community.loading": "Wczytywanie widgetu Discorda…",
    "stats.editions": "edycji",
    "stats.players": "graczy w projekcie",
    "stats.years": "lat tradycji",
    "stats.hours": "godzin developmentu",
    "lore.teaser": "Poznaj historię, ekipę i organizacje GhostLand",
    "lore.cta": "Przeczytaj Lore",
    "screenshots.title": "Zrzuty ekranu ze świata",
    "screenshots.filterAll": "Wszystkie",
    "admin.title": "Panel Administratora",
    "admin.logout": "Wyloguj",
  },
  en: {
    "nav.download": "Get Modpack",
    "nav.status": "Server Status",
    "nav.discord": "Discord",
    "nav.screenshots": "Screenshots",
    "nav.lore": "Lore",
    "hero.subtitle": "Edition 8.0 · NEOFORGE 1.21.1 · immersion, adventure, technology and aeronautics!",
    "hero.description": "A proper private modpack focused on good vibes, building the world together and wacky constructions.",
    "countdown.title": "Countdown to Edition 8 launch",
    "countdown.days": "days",
    "countdown.hours": "hours",
    "countdown.minutes": "minutes",
    "countdown.seconds": "seconds",
    "countdown.live": "EDITION 8 IS OFFICIALLY LIVE!",
    "countdown.paused": "Countdown paused by staff",
    "download.title": "Download the Modpack",
    "download.cta": "Download Modpack File",
    "download.version": "Version",
    "download.howto": "How to join",
    "download.step1": "Install Prism Launcher or Modrinth App.",
    "download.step2": "Import the downloaded .mrpack file.",
    "download.step3": "In our Discord type /whitelistuj <your_nick>.",
    "download.step4": "Wait for the bot's confirmation and hop in.",
    "status.online": "Server online",
    "status.offline": "Server offline",
    "status.maintenance": "Maintenance",
    "status.started": "Edition started",
    "status.checking": "Checking…",
    "status.players": "players",
    "community.title": "Join the community",
    "community.subtitle": "GhostLand Discord — chat, whitelist bot, announcements.",
    "community.loading": "Loading Discord widget…",
    "stats.editions": "editions",
    "stats.players": "people in the project",
    "stats.years": "years of tradition",
    "stats.hours": "hours of development",
    "lore.teaser": "Discover the history, crew and organizations of GhostLand",
    "lore.cta": "Read the Lore",
    "screenshots.title": "Screenshots from the world",
    "screenshots.filterAll": "All",
    "admin.title": "Admin Dashboard",
    "admin.logout": "Log out",
  },
} as const;

export type TranslationKey = keyof typeof dict["pl"];

const I18nContext = createContext<{ lang: Lang; setLang: (l: Lang) => void; t: (k: TranslationKey) => string } | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("pl");

  useEffect(() => {
    const saved = window.localStorage.getItem(LANG_KEY) as Lang | null;
    if (saved === "pl" || saved === "en") setLangState(saved);
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    window.localStorage.setItem(LANG_KEY, l);
  };

  const t = (k: TranslationKey) => dict[lang][k] ?? k;

  return <I18nContext.Provider value={{ lang, setLang, t }}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n outside provider");
  return ctx;
}