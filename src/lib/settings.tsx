import { createContext, useContext, type ReactNode } from "react";

export type ServerStatusMode = "auto" | "online" | "maintenance" | "offline" | "started";

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
  modpackLinks: ModpackLink[];
  /**NOTE: This is in UTC - so (at least during summer), you gotta subtract 2, eg. if we start at 18:00, this has to be 16:00 */
  countdownTargetIso: string;
  statusMode: ServerStatusMode;
  apiRoute: string; //This cannot actually be overridden by the API, no matter what it returns in its JSON. Always the default value is used.
  discordInvite: string;
  discordWidgetId: string;
  langKey: string; //This cannot actually be overridden by the API, no matter what it returns in its JSON. Always the default value is used.
};

export const DEFAULT_SETTINGS: Settings = {
  langKey: "GL_WEB_USERCONF_LANG",
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
  statusMode: "auto",
  apiRoute: "https://sane.ghostland.ovh/external/files",
  discordInvite: "",
  discordWidgetId: "",
};

async function readSettings(): Promise<Settings> {
  try{
    const settings = { ...DEFAULT_SETTINGS, ...(await (await readApiRoute("/api/settings.json")).json()) }
    if (!Array.isArray(settings.modpackLinks) || settings.modpackLinks.length === 0) {
      settings.modpackLinks = DEFAULT_SETTINGS.modpackLinks
    }
    return settings;
  }
  catch(e){
    console.error("Error fetching settings:", e, "\n\nUsing default ones instead:\n"+JSON.stringify(DEFAULT_SETTINGS))
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

export function readApiRoute(route: "/api/status.json" | "/api/settings.json" | "/api/screenshots.json" | "/modpacks" | "/misc", settings?: RequestInit|undefined) {
  return fetch(DEFAULT_SETTINGS.apiRoute+route, settings)
}

export function defaultTarget() {
  const d = new Date();
  d.setDate(d.getDate() + 14);
  d.setHours(20, 0, 0, 0);
  return d.toISOString();
};