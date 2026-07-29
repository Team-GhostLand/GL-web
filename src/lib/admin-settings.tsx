import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import {
  ADMIN_SETTINGS_KEY,
  DEFAULT_DISCORD_INVITE,
  DEFAULT_DISCORD_WIDGET_ID,
  DEFAULT_API_ROUTE,
} from "./admin-config";
import { WORLD_SCREENSHOTS, type Screenshot } from "./assets";

export type ServerStatusMode = "auto" | "online" | "maintenance" | "offline" | "started";

/** Metadata overrides for seed (static) screenshots, keyed by id. */
export type ScreenshotOverride = Partial<
  Pick<Screenshot, "title" | "category" | "description" | "date" | "edition" | "tags">
>;

export type ModpackLink = {
  id: string;
  label: string;
  url: string;
  version: string;
  onlyAfterCountdown: boolean;
};

export type ModpackVersion = {
  id: string;
  edition: number;
  label: string;
  version: string;
  url: string;
  filename?: string;
  size?: string;
  notes?: string;
  releasedAt?: string;
};

export type AdminSettings = {
  modpackUrl: string;
  modpackVersion: string;
  modpackLinks: ModpackLink[];
  countdownTargetIso: string;
  countdownPaused: boolean;
  countdownForceStart: boolean;
  statusMode: ServerStatusMode;
  apiRoute: string;
  discordInvite: string;
  discordWidgetId: string;
  discordWebhookUrl: string;
  uploadedScreenshots: Screenshot[];
  /** Per-id metadata patches for WORLD_SCREENSHOTS */
  screenshotOverrides: Record<string, ScreenshotOverride>;
  /** Seed screenshot ids hidden from the public gallery */
  hiddenScreenshotIds: string[];
  /** Explicit gallery display order (uploaded + seed ids). */
  galleryOrder: string[];
  /** @deprecated Kept for localStorage migration; public UI uses live CI at /versions. */
  versionArchive: ModpackVersion[];
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
  apiRoute: DEFAULT_API_ROUTE,
  discordInvite: DEFAULT_DISCORD_INVITE,
  discordWidgetId: DEFAULT_DISCORD_WIDGET_ID,
  discordWebhookUrl: "",
  uploadedScreenshots: [],
  screenshotOverrides: {},
  hiddenScreenshotIds: [],
  galleryOrder: WORLD_SCREENSHOTS.map((s) => s.id),
  versionArchive: [],
};

async function readSettings(): Promise<AdminSettings> {
  try{
    const settings = { ...DEFAULT_SETTINGS, ...(await (await readApiRoute("api/settings.json")).json()) }
    if (!Array.isArray(settings.versionArchive)) {
      settings.versionArchive = [];
    }
    if (!settings.screenshotOverrides || typeof settings.screenshotOverrides !== "object") {
      settings.screenshotOverrides = {};
    }
    if (!Array.isArray(settings.hiddenScreenshotIds)) {
      settings.hiddenScreenshotIds = [];
    }
    if (!Array.isArray(settings.uploadedScreenshots)) {
      settings.uploadedScreenshots = [];
    }
    if (!Array.isArray(settings.galleryOrder) || settings.galleryOrder.length === 0) {
      const hidden = new Set(settings.hiddenScreenshotIds);
      settings.galleryOrder = [
        ...settings.uploadedScreenshots.map((s) => s.id),
        ...WORLD_SCREENSHOTS.filter((s) => !hidden.has(s.id)).map((s) => s.id),
      ];
    }
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
  }
  catch(e){
    console.error("Error fetching settings:", e)
    return DEFAULT_SETTINGS
  }
}

const settings = await readSettings()
const AdminSettingsContext = createContext<AdminSettings>(settings);

export function AdminSettingsProvider({ children }: { children: ReactNode }) {
  return (
    <AdminSettingsContext.Provider value={settings}>
      {children}
    </AdminSettingsContext.Provider>
  );
}

export function useAdminSettings() {
  const ctx = useContext(AdminSettingsContext);
  if (!ctx) throw new Error("useAdminSettings must be used inside AdminSettingsProvider");
  return ctx;
}

/** Merged gallery sorted by galleryOrder (unknown ids appended). */
export function getGalleryScreenshots(settings: AdminSettings): Screenshot[] {
  const hidden = new Set(settings.hiddenScreenshotIds ?? []);
  const overrides = settings.screenshotOverrides ?? {};
  const seeded = WORLD_SCREENSHOTS.filter((s) => !hidden.has(s.id)).map((s) => ({
    ...s,
    ...overrides[s.id],
    id: s.id,
    url: s.url,
  }));
  const byId = new Map<string, Screenshot>();
  for (const s of settings.uploadedScreenshots ?? []) byId.set(s.id, s);
  for (const s of seeded) byId.set(s.id, s);

  const order = settings.galleryOrder ?? [];
  const seen = new Set<string>();
  const ordered: Screenshot[] = [];
  for (const id of order) {
    const shot = byId.get(id);
    if (shot && !seen.has(id)) {
      ordered.push(shot);
      seen.add(id);
    }
  }
  for (const [id, shot] of byId) {
    if (!seen.has(id)) ordered.push(shot);
  }
  return ordered;
}

export function defaultGalleryOrder(settings: Pick<AdminSettings, "uploadedScreenshots" | "hiddenScreenshotIds">): string[] {
  const hidden = new Set(settings.hiddenScreenshotIds ?? []);
  return [
    ...(settings.uploadedScreenshots ?? []).map((s) => s.id),
    ...WORLD_SCREENSHOTS.filter((s) => !hidden.has(s.id)).map((s) => s.id),
  ];
}

export function isSeedScreenshot(id: string) {
  return WORLD_SCREENSHOTS.some((s) => s.id === id);
}

export function readApiRoute(route: "api/status.json" | "api/settings.json" | "modpacks" | "misc" | "worlds" | "screenshots", settings?: Pick<AdminSettings, "apiRoute">|undefined) {
  const base = settings ? settings.apiRoute : DEFAULT_API_ROUTE;
  return fetch(base+"/"+route)
}