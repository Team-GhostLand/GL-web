import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Archive,
  ChevronRight,
  Download,
  FileArchive,
  Folder,
  FolderOpen,
  Loader2,
  Package,
  RefreshCw,
  Search,
} from "lucide-react";
import {
  ROOT_TABS,
  enrichListing,
  fetchListing,
  filterFiles,
  formatBytes,
  formatModTime,
  sortFiles,
  type Project,
  type SortKey,
  type SortOrder,
  type Variant,
  type ParsedFile,
} from "@/lib/files-archive";

export const Route = createFileRoute("/versions")({
  head: () => ({
    meta: [
      { title: "Archiwum — GhostLand" },
      {
        name: "description",
        content:
          "Archiwum GhostLand: pobierz historyczne i developerskie wersje modpacków (.mrpack).",
      },
      { property: "og:title", content: "Archiwum — GhostLand" },
      { property: "og:description", content: "Archiwum plików modpacka GhostLand." },
      { property: "og:type", content: "website" },
    ],
  }),
  component: VersionsPage,
});

type TabId = (typeof ROOT_TABS)[number]["id"];

function VersionsPage() {
  const [tab, setTab] = useState<TabId>("modpacks");
  const [path, setPath] = useState("modpacks");
  const [items, setItems] = useState<ParsedFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortKey, setSortKey] = useState<SortKey>("time");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [project, setProject] = useState<Project | "All">("All");
  const [variant, setVariant] = useState<Variant | "All">("All");
  const [query, setQuery] = useState("");

  const load = useCallback(async (dir: string) => {
    setLoading(true);
    setError(null);
    try {
      const listing = await fetchListing(dir);
      setItems(enrichListing(dir, listing));
    } catch (e) {
      setItems([]);
      setError(e instanceof Error ? e.message : "Nie udało się wczytać archiwum.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load(path);
  }, [path, load]);

  const switchTab = (id: TabId, dir: string) => {
    setTab(id);
    setPath(dir);
    setProject("All");
    setVariant("All");
    setQuery("");
  };

  const crumbs = useMemo(() => {
    const parts = path.split("/").filter(Boolean);
    const out: { label: string; path: string }[] = [{ label: "files", path: "" }];
    let acc = "";
    for (const p of parts) {
      acc = acc ? `${acc}/${p}` : p;
      out.push({ label: p, path: acc });
    }
    return out;
  }, [path]);

  const visible = useMemo(() => {
    const filtered = filterFiles(items, { project, variant, query });
    return sortFiles(filtered, sortKey, sortOrder);
  }, [items, project, variant, query, sortKey, sortOrder]);

  const openDir = (name: string) => {
    const clean = name.replace(/\/$/, "");
    setPath(path ? `${path}/${clean}` : clean);
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-16">
      <motion.header
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">Archiwum</p>
        <h1 className="mt-3 font-heading text-4xl font-bold text-ember sm:text-5xl">Wersje modpacka</h1>
        <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground">
          Pełne archiwum plików do pobrania — katalogi <code className="rounded bg-muted/40 px-1.5 py-0.5 text-[11px]">modpacks</code> i{" "}
          <code className="rounded bg-muted/40 px-1.5 py-0.5 text-[11px]">misc</code>. Sortuj, filtruj i pobieraj bezpośrednio.
        </p>
      </motion.header>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
        {ROOT_TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => switchTab(t.id, t.path)}
            className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition-colors ${tab === t.id ? "bg-primary text-primary-foreground" : "glass text-muted-foreground hover:text-foreground"
              }`}
          >
            {tab === t.id ? <FolderOpen className="h-3.5 w-3.5" /> : <Folder className="h-3.5 w-3.5" />}
            {t.label}
          </button>
        ))}
        <button
          type="button"
          onClick={() => void load(path)}
          className="inline-flex items-center gap-1.5 rounded-full border border-border/60 px-3 py-2 text-xs text-muted-foreground hover:text-foreground"
          title="Odśwież"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
          Odśwież
        </button>
      </div>

      <nav className="mt-6 flex flex-wrap items-center gap-1 text-xs text-muted-foreground">
        {crumbs.map((c, i) => (
          <span key={c.path || "root"} className="inline-flex items-center gap-1">
            {i > 0 && <ChevronRight className="h-3 w-3 opacity-50" />}
            {i === crumbs.length - 1 ? (
              <span className="font-semibold text-foreground">{c.label}</span>
            ) : (
              <button
                type="button"
                className="hover:text-primary"
                onClick={() => {
                  if (!c.path) {
                    switchTab("modpacks", "modpacks");
                  } else {
                    setPath(c.path);
                    const root = c.path.split("/")[0];
                    const match = ROOT_TABS.find((t) => t.path === root);
                    if (match) setTab(match.id);
                  }
                }}
              >
                {c.label}
              </button>
            )}
          </span>
        ))}
      </nav>

      <div className="mt-4 grid gap-3 rounded-2xl border border-border/50 bg-card/30 p-4 backdrop-blur-md sm:grid-cols-2 lg:grid-cols-5">
        <label className="block text-[10px] uppercase tracking-widest text-muted-foreground lg:col-span-2">
          Szukaj
          <div className="relative mt-1">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="np. 7.1.2 Slim…"
              className="w-full rounded-lg border border-border bg-input py-2 pl-8 pr-3 text-xs text-foreground outline-none focus:border-primary"
            />
          </div>
        </label>
        <label className="block text-[10px] uppercase tracking-widest text-muted-foreground">
          Projekt
          <select
            value={project}
            onChange={(e) => setProject(e.target.value as Project | "All")}
            className="mt-1 w-full rounded-lg border border-border bg-input px-2 py-2 text-xs text-foreground outline-none focus:border-primary"
          >
            {(["All", "GhostLand", "GhostRun", "CraftMine", "Other"] as const).map((p) => (
              <option key={p} value={p}>
                {p === "All" ? "Wszystkie" : p}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-[10px] uppercase tracking-widest text-muted-foreground">
          Wariant
          <select
            value={variant}
            onChange={(e) => setVariant(e.target.value as Variant | "All")}
            className="mt-1 w-full rounded-lg border border-border bg-input px-2 py-2 text-xs text-foreground outline-none focus:border-primary"
          >
            {(["All", "Full", "Slim", "Server", "Tweakable"] as const).map((v) => (
              <option key={v} value={v}>
                {v === "All" ? "Wszystkie" : v}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-[10px] uppercase tracking-widest text-muted-foreground">
          Sortuj
          <div className="mt-1 flex gap-1">
            <select
              value={sortKey}
              onChange={(e) => setSortKey(e.target.value as SortKey)}
              className="w-full rounded-lg border border-border bg-input px-2 py-2 text-xs text-foreground outline-none focus:border-primary"
            >
              <option value="time">Czas</option>
              <option value="name">Nazwa</option>
              <option value="size">Rozmiar</option>
            </select>
            <button
              type="button"
              onClick={() => setSortOrder((o) => (o === "asc" ? "desc" : "asc"))}
              className="shrink-0 rounded-lg border border-border px-2 text-xs font-semibold hover:bg-accent/20"
              title="Kierunek sortowania"
            >
              {sortOrder === "asc" ? "↑" : "↓"}
            </button>
          </div>
        </label>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-border/50 glass">
        <div className="grid grid-cols-[1fr_auto_auto_auto] gap-2 border-b border-border/40 bg-black/20 px-4 py-2 text-[10px] uppercase tracking-wider text-muted-foreground sm:grid-cols-[1fr_100px_140px_110px]">
          <span>Nazwa</span>
          <span className="hidden text-right sm:block">Rozmiar</span>
          <span className="hidden text-right sm:block">Data</span>
          <span className="text-right">Akcja</span>
        </div>

        {loading ? (
          <div className="flex items-center justify-center gap-2 px-4 py-16 text-sm text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" /> Ładowanie archiwum…
          </div>
        ) : error ? (
          <div className="px-4 py-12 text-center">
            <Archive className="mx-auto h-10 w-10 text-muted-foreground/50" />
            <p className="mt-3 text-sm text-red-300">{error}</p>
            <p className="mt-1 text-xs text-muted-foreground">Sprawdź, czy `/external/files` jest dostępne na ghostland.ovh.</p>
            <button type="button" onClick={() => void load(path)} className="btn mt-4 inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-xs">
              <RefreshCw className="h-3.5 w-3.5" /> Spróbuj ponownie
            </button>
          </div>
        ) : visible.length === 0 ? (
          <div className="px-4 py-12 text-center">
            <Package className="mx-auto h-10 w-10 text-muted-foreground/50" />
            <p className="mt-3 text-sm text-muted-foreground">Brak plików dla wybranych filtrów.</p>
          </div>
        ) : (
          <ul className="divide-y divide-border/30">
            {visible.map((item) => {
              const name = item.entry.name.replace(/\/$/, "");
              return (
                <li
                  key={`${path}/${item.entry.name}`}
                  className="grid grid-cols-[1fr_auto] items-center gap-2 px-4 py-3 transition-colors hover:bg-white/5 sm:grid-cols-[1fr_100px_140px_110px]"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="rounded-lg bg-primary/10 p-2 text-primary">
                      {item.entry.is_dir ? <Folder className="h-4 w-4" /> : <FileArchive className="h-4 w-4" />}
                    </div>
                    <div className="min-w-0">
                      {item.entry.is_dir ? (
                        <button
                          type="button"
                          onClick={() => openDir(name)}
                          className="truncate text-left text-sm font-semibold text-foreground hover:text-primary"
                        >
                          {name}
                        </button>
                      ) : (
                        <p className="truncate text-sm font-semibold text-foreground">{name}</p>
                      )}
                      {!item.entry.is_dir && (
                        <p className="mt-0.5 flex flex-wrap gap-1.5 text-[10px] text-muted-foreground">
                          <span className="rounded bg-accent/15 px-1.5 py-0.5">{item.project}</span>
                          {item.version && (
                            <span className="rounded bg-muted/40 px-1.5 py-0.5 font-mono">v{item.version}</span>
                          )}
                          <span className="rounded bg-primary/10 px-1.5 py-0.5 text-primary">{item.variant}</span>
                          <span className="sm:hidden">{formatBytes(item.entry.size)}</span>
                        </p>
                      )}
                    </div>
                  </div>
                  <span className="hidden text-right text-xs text-muted-foreground sm:block">
                    {item.entry.is_dir ? "—" : formatBytes(item.entry.size)}
                  </span>
                  <span className="hidden text-right text-[11px] text-muted-foreground sm:block">
                    {formatModTime(item.entry.mod_time)}
                  </span>
                  <div className="flex justify-end">
                    {item.entry.is_dir ? (
                      <button
                        type="button"
                        onClick={() => openDir(name)}
                        className="rounded-lg border border-border/60 px-3 py-1.5 text-[11px] font-semibold hover:bg-accent/20"
                      >
                        Otwórz
                      </button>
                    ) : (
                      <a
                        href={item.downloadUrl}
                        className="glow-ember inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-[11px] font-semibold text-primary-foreground"
                      >
                        <Download className="h-3.5 w-3.5" />
                        Pobierz
                      </a>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
        <Link
          to="/download"
          className="inline-flex items-center gap-2 rounded-full border border-border/60 px-4 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground"
        >
          <Download className="h-4 w-4" />
          Aktualna wersja
        </Link>
        <a
          href="/external/files"
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground"
        >
          Nieprzetworzony widok
        </a>
      </div>

      <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
      </div>
    </main>
  );
}
