import { createContext, useContext, type ReactNode } from "react";
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

export type Settings = {
  modpackUrl: string;
  modpackVersion: string;
  modpackLinks: ModpackLink[];
  countdownTargetIso: string;
  countdownPaused: boolean;
  countdownForceStart: boolean;
  statusMode: ServerStatusMode;
  apiRoute: string; //This cannot actually be overridden by the API, no matter what it returns in its JSON. Always the default value is used.
  discordInvite: string;
  discordWidgetId: string;
  uploadedScreenshots: Screenshot[];
  /** Per-id metadata patches for WORLD_SCREENSHOTS */
  screenshotOverrides: Record<string, ScreenshotOverride>;
  /** Seed screenshot ids hidden from the public gallery */
  hiddenScreenshotIds: string[];
  /** Explicit gallery display order (uploaded + seed ids). */
  galleryOrder: string[];
  /** @deprecated Kept for localStorage migration; public UI uses live CI at /versions. */
  versionArchive: ModpackVersion[];
  langKey: string; //This cannot actually be overridden by the API, no matter what it returns in its JSON. Always the default value is used.
};

export const DEFAULT_SETTINGS: Settings = {
  langKey: "GL_WEB_USERCONF_LANG",
  modpackUrl: "https://ghostland.ovh/downloads/GhostLand-v8.0.mrpack",
  modpackVersion: "8.0.0",
  modpackLinks: [
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
  ],
  countdownTargetIso: defaultTarget(),
  countdownPaused: false,
  countdownForceStart: false,
  statusMode: "auto",
  apiRoute: "https://sane.ghostland.ovh/external/files/",
  discordInvite: "https://discord.gg/SrhYP3HSX",
  discordWidgetId: "",
  uploadedScreenshots: [],
  screenshotOverrides: {},
  hiddenScreenshotIds: [],
  galleryOrder: WORLD_SCREENSHOTS.map((s) => s.id),
  versionArchive: [],
};

async function readSettings(): Promise<Settings> {
  try{
    const settings = { ...DEFAULT_SETTINGS, ...(await (await readApiRoute("api/settings.json")).json()) }
    if (!Array.isArray(settings.versionArchive)) {
      settings.versionArchive = [];
    }
    if (!Array.isArray(settings.modpackLinks) || settings.modpackLinks.length === 0) {
      settings.modpackLinks = DEFAULT_SETTINGS.modpackLinks
    }
    return settings;
  }
  catch(e){
    console.error("Error fetching settings:", e)
    return DEFAULT_SETTINGS
  }
}

const settingsContents = await readSettings()
const settingsContext = createContext<Settings>(settingsContents);

export function SettingsProvider({ children }: { children: ReactNode }) {
  return (
    <settingsContext.Provider value={settingsContents}>
      {children}
    </settingsContext.Provider>
  );
}

export function useAdminSettings() {
  const ctx = useContext(settingsContext);
  if (!ctx) throw new Error("useAdminSettings must be used inside AdminSettingsProvider");
  return ctx;
}

/** Merged gallery sorted by galleryOrder (unknown ids appended). */
export function getGalleryScreenshots(settings: Settings): Screenshot[] {
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

export function defaultGalleryOrder(settings: Pick<Settings, "uploadedScreenshots" | "hiddenScreenshotIds">): string[] {
  const hidden = new Set(settings.hiddenScreenshotIds ?? []);
  return [
    ...(settings.uploadedScreenshots ?? []).map((s) => s.id),
    ...WORLD_SCREENSHOTS.filter((s) => !hidden.has(s.id)).map((s) => s.id),
  ];
}

export function isSeedScreenshot(id: string) {
  return WORLD_SCREENSHOTS.some((s) => s.id === id);
}

export function readApiRoute(route: "api/status.json" | "api/settings.json" | "modpacks" | "misc" | "screenshots", settings?: RequestInit|undefined) {
  return fetch(DEFAULT_SETTINGS.apiRoute+route, settings)
}

export function defaultTarget() {
  const d = new Date();
  d.setDate(d.getDate() + 14);
  d.setHours(20, 0, 0, 0);
  return d.toISOString();
};