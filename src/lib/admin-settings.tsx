import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import {
  ADMIN_SETTINGS_KEY,
  DEFAULT_DISCORD_INVITE,
  DEFAULT_DISCORD_WIDGET_ID,
  DEFAULT_MC_HOST,
} from "./admin-config";
import type { Screenshot } from "./assets";

export type ServerStatusMode = "auto" | "online" | "maintenance" | "offline" | "started";

export type ModpackLink = {
  id: string;
  label: string;
  url: string;
  version: string;
  onlyAfterCountdown: boolean;
};

export type AdminSettings = {
  modpackUrl: string;
  modpackVersion: string;
  modpackLinks: ModpackLink[];
  countdownTargetIso: string;
  countdownPaused: boolean;
  countdownForceStart: boolean;
  statusMode: ServerStatusMode;
  mcHost: string;
  discordInvite: string;
  discordWidgetId: string;
  discordWebhookUrl: string;
  uploadedScreenshots: Screenshot[];
};

const defaultTarget = () => {
  const d = new Date();
  d.setDate(d.getDate() + 14);
  d.setHours(20, 0, 0, 0);
  return d.toISOString();
};

export const DEFAULT_MODPACK_LINKS: ModpackLink[] = [
  {
    id: "link-1",
    label: "Wersja Główna (.mrpack)",
    url: "https://ghostland.ovh/downloads/GhostLand-v8.0.mrpack",
    version: "8.0.0",
    onlyAfterCountdown: false,
  },
  {
    id: "link-2",
    label: "Wersja Alternatywna",
    url: "",
    version: "8.0.0",
    onlyAfterCountdown: false,
  },
  {
    id: "link-3",
    label: "Wersja Manualna (Zip)",
    url: "",
    version: "8.0.0",
    onlyAfterCountdown: false,
  },
];

export const DEFAULT_SETTINGS: AdminSettings = {
  modpackUrl: "https://ghostland.ovh/downloads/GhostLand-v8.0.mrpack",
  modpackVersion: "8.0.0",
  modpackLinks: DEFAULT_MODPACK_LINKS,
  countdownTargetIso: defaultTarget(),
  countdownPaused: false,
  countdownForceStart: false,
  statusMode: "auto",
  mcHost: DEFAULT_MC_HOST,
  discordInvite: DEFAULT_DISCORD_INVITE,
  discordWidgetId: DEFAULT_DISCORD_WIDGET_ID,
  discordWebhookUrl: "",
  uploadedScreenshots: [],
};

function readSettings(): AdminSettings {
  if (typeof window === "undefined") return DEFAULT_SETTINGS;
  try {
    const raw = window.localStorage.getItem(ADMIN_SETTINGS_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw);
    const settings: AdminSettings = { ...DEFAULT_SETTINGS, ...parsed };
    if (!Array.isArray(settings.modpackLinks) || settings.modpackLinks.length === 0) {
      settings.modpackLinks = [
        {
          id: "link-1",
          label: "Wersja Główna (.mrpack)",
          url: settings.modpackUrl || DEFAULT_SETTINGS.modpackUrl,
          version: settings.modpackVersion || DEFAULT_SETTINGS.modpackVersion,
          onlyAfterCountdown: false,
        },
        {
          id: "link-2",
          label: "Wersja Alternatywna",
          url: "",
          version: settings.modpackVersion || DEFAULT_SETTINGS.modpackVersion,
          onlyAfterCountdown: false,
        },
        {
          id: "link-3",
          label: "Wersja Manualna (Zip)",
          url: "",
          version: settings.modpackVersion || DEFAULT_SETTINGS.modpackVersion,
          onlyAfterCountdown: false,
        },
      ];
    }
    return settings;
  } catch {
    return DEFAULT_SETTINGS;
  }
}

type Ctx = {
  settings: AdminSettings;
  update: (patch: Partial<AdminSettings>) => void;
  reset: () => void;
};

const AdminSettingsContext = createContext<Ctx | null>(null);

export function AdminSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AdminSettings>(DEFAULT_SETTINGS);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setSettings(readSettings());
    setHydrated(true);
    const onStorage = (e: StorageEvent) => {
      if (e.key === ADMIN_SETTINGS_KEY) setSettings(readSettings());
    };
    const onCustom = () => setSettings(readSettings());
    window.addEventListener("storage", onStorage);
    window.addEventListener("gl_settings_updated", onCustom as EventListener);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("gl_settings_updated", onCustom as EventListener);
    };
  }, []);

  const update = (patch: Partial<AdminSettings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...patch };
      try {
        window.localStorage.setItem(ADMIN_SETTINGS_KEY, JSON.stringify(next));
        window.dispatchEvent(new CustomEvent("gl_settings_updated"));
      } catch (err) {
        console.error("Failed to save admin settings", err);
      }
      return next;
    });
  };

  const reset = () => update(DEFAULT_SETTINGS);

  return (
    <AdminSettingsContext.Provider value={{ settings: hydrated ? settings : DEFAULT_SETTINGS, update, reset }}>
      {children}
    </AdminSettingsContext.Provider>
  );
}

export function useAdminSettings() {
  const ctx = useContext(AdminSettingsContext);
  if (!ctx) throw new Error("useAdminSettings must be used inside AdminSettingsProvider");
  return ctx;
}