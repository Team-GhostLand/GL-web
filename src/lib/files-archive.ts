/** Client for GhostLand CI file archive at /modules/ci (host Caddy file_server browse JSON).
 *  Served directly from disk — independent of the legacy aux stack on :2137.
 */

import { DEFAULT_SETTINGS } from "./settings";

export const PATH_BASE = DEFAULT_SETTINGS.apiRoute;

export type ListingEntry = {
  name: string;
  size: number;
  url: string;
  mod_time: string;
  mode?: number;
  is_dir: boolean;
  is_symlink?: boolean;
};

export type Project = "GhostLand" | "GhostRun" | "CraftMine" | "Other";
export type Variant = "Full" | "Slim" | "Server" | "Tweakable" | "Other";
export type SortKey = "name" | "size" | "time";
export type SortOrder = "asc" | "desc";

export type ParsedFile = {
  entry: ListingEntry;
  project: Project;
  version: string;
  variant: Variant;
  hidden: boolean;
  downloadUrl: string;
};

function normalizePath(path: string): string {
  return path.replace(/^\/+|\/+$/g, "");
}

/** Resolve a browse-relative URL against the current CI directory path. */
export function resolveCiUrl(dirPath: string, relativeUrl: string): string {
  const cleanRel = relativeUrl.replace(/^\.\//, "");
  const base = normalizePath(dirPath);
  const joined = base ? `${PATH_BASE}/${base}/${cleanRel}` : `${PATH_BASE}/${cleanRel}`;
  // Preserve encoding already present in Caddy JSON urls; encode remaining spaces.
  return joined.replace(/ /g, "%20");
}

export async function fetchCiListing(path = ""): Promise<ListingEntry[]> {
  const clean = normalizePath(path);
  const url = clean ? `${PATH_BASE}/${clean}/` : `${PATH_BASE}/`;
  const res = await fetch(url, {
    headers: { Accept: "application/json" },
  });
  if (!res.ok) {
    throw new Error(`CI listing failed (${res.status})`);
  }
  const data = (await res.json()) as ListingEntry[];
  if (!Array.isArray(data)) {
    throw new Error("CI listing returned unexpected payload");
  }
  return data;
}

export function parseCiFilename(name: string): Omit<ParsedFile, "entry" | "downloadUrl"> {
  const base = name.replace(/\/$/, "");
  const hidden = base === "latest_server.mrpack" || base.startsWith("latest_server.");

  let project: Project = "Other";
  if (/^GhostLand/i.test(base)) project = "GhostLand";
  else if (/^GhostRun/i.test(base)) project = "GhostRun";
  else if (/^CraftMine/i.test(base)) project = "CraftMine";

  let variant: Variant = "Full";
  if (/Server Edition/i.test(base)) variant = "Server";
  else if (/Slim Edition/i.test(base)) variant = "Slim";
  else if (/Tweakable Edition/i.test(base)) variant = "Tweakable";
  else if (!/\.mrpack$/i.test(base) && !/\.zip$/i.test(base)) variant = "Other";

  const versionMatch = base.match(
    /(?:GhostLand|GhostRun|CraftMine)\s+([0-9]+(?:\.[0-9]+)*(?:[a-z][0-9]*)?)/i,
  );
  const version = versionMatch?.[1] ?? "";

  return { project, version, variant, hidden };
}

export function enrichListing(dirPath: string, entries: ListingEntry[]): ParsedFile[] {
  return entries.map((entry) => {
    const meta = parseCiFilename(entry.name.replace(/\/$/, ""));
    return {
      entry,
      ...meta,
      downloadUrl: resolveCiUrl(dirPath, entry.url),
    };
  });
}

export function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes < 0) return "—";
  if (bytes < 1024) return `${bytes} B`;
  const units = ["KB", "MB", "GB", "TB"];
  let n = bytes;
  let i = -1;
  do {
    n /= 1024;
    i += 1;
  } while (n >= 1024 && i < units.length - 1);
  return `${n.toFixed(n >= 10 || i === 0 ? 0 : 1)} ${units[i]}`;
}

export function formatModTime(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString("pl-PL", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function sortCiFiles(
  items: ParsedFile[],
  key: SortKey,
  order: SortOrder,
): ParsedFile[] {
  const dirFirst = (a: ParsedFile, b: ParsedFile) => {
    if (a.entry.is_dir !== b.entry.is_dir) return a.entry.is_dir ? -1 : 1;
    return 0;
  };

  const cmp = (a: ParsedFile, b: ParsedFile) => {
    const d = dirFirst(a, b);
    if (d !== 0) return d;
    let r = 0;
    if (key === "name") r = a.entry.name.localeCompare(b.entry.name, "pl", { sensitivity: "base" });
    else if (key === "size") r = a.entry.size - b.entry.size;
    else r = new Date(a.entry.mod_time).getTime() - new Date(b.entry.mod_time).getTime();
    return order === "asc" ? r : -r;
  };

  return items.slice().sort(cmp);
}

export function filterCiFiles(
  items: ParsedFile[],
  opts: {
    project?: Project | "All";
    variant?: Variant | "All";
    query?: string;
    includeHidden?: boolean;
  },
): ParsedFile[] {
  const q = (opts.query ?? "").trim().toLowerCase();
  return items.filter((item) => {
    if (!opts.includeHidden && item.hidden && !item.entry.is_dir) return false;
    if (opts.project && opts.project !== "All" && !item.entry.is_dir && item.project !== opts.project) {
      return false;
    }
    if (opts.variant && opts.variant !== "All" && !item.entry.is_dir && item.variant !== opts.variant) {
      return false;
    }
    if (q && !item.entry.name.toLowerCase().includes(q)) return false;
    return true;
  });
}

export const CI_ROOT_TABS = [
  { id: "modpacks", label: "Modpacks", path: "modpacks" },
  { id: "dev-sharing", label: "Dev sharing", path: "dev-sharing" },
] as const;
