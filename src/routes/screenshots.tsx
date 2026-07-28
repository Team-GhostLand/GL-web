import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { WORLD_SCREENSHOTS, type Screenshot } from "@/lib/assets";
import { useAdminSettings } from "@/lib/admin-settings";
import { useI18n } from "@/lib/i18n";
import { Lightbox } from "@/components/Lightbox";

export const Route = createFileRoute("/screenshots")({
  head: () => ({
    meta: [
      { title: "Zrzuty ekranu — GhostLand" },
      { name: "description", content: "Galeria zrzutów ekranu ze świata GhostLand: budowle, krajobrazy, fabryki i ekipa." },
      { property: "og:title", content: "Zrzuty ekranu — GhostLand" },
      { property: "og:description", content: "Galeria zrzutów ekranu ze świata GhostLand." },
      { property: "og:type", content: "website" },
    ],
  }),
  component: ScreenshotsPage,
});

const CATEGORIES: Array<Screenshot["category"] | "Wszystkie"> = ["Wszystkie", "Budowle", "Krajobrazy", "Fabryki", "Ekipa"];
const EDITIONS: Array<number | "Wszystkie"> = ["Wszystkie", 1, 2, 3, 4, 5, 6, 7, 8];

function ScreenshotsPage() {
  const { settings } = useAdminSettings();
  const { t } = useI18n();
  const [filter, setFilter] = useState<(typeof CATEGORIES)[number]>("Wszystkie");
  const [edition, setEdition] = useState<(typeof EDITIONS)[number]>("Wszystkie");
  const [active, setActive] = useState<Screenshot | null>(null);

  const all = useMemo(
    () => [...settings.uploadedScreenshots, ...WORLD_SCREENSHOTS],
    [settings.uploadedScreenshots],
  );
  const shots = all
    .filter((s) => filter === "Wszystkie" || s.category === filter)
    .filter((s) => edition === "Wszystkie" || s.edition === edition);

  return (
    <main className="mx-auto max-w-7xl px-4 py-16">
      <header className="mb-8 text-center">
        <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">Galeria</p>
        <h1 className="mt-2 font-heading text-4xl font-bold text-ember sm:text-5xl">{t("screenshots.title")}</h1>
        <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground">
          Migawki z minionych i bieżącej edycji. Wkrótce dopinamy tu automatyczny pull z kanału #screeny na Discordzie.
        </p>
      </header>

      <div className="mb-8 flex flex-wrap justify-center gap-2">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setFilter(c)}
            className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
              filter === c
                ? "bg-primary text-primary-foreground"
                : "glass text-muted-foreground hover:text-foreground"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="mb-8 flex flex-wrap justify-center gap-2">
        <span className="self-center text-[10px] uppercase tracking-widest text-muted-foreground/70">Edycja:</span>
        {EDITIONS.map((e) => (
          <button
            key={e}
            onClick={() => setEdition(e)}
            className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
              edition === e
                ? "bg-accent text-accent-foreground"
                : "glass text-muted-foreground hover:text-foreground"
            }`}
          >
            {e === "Wszystkie" ? "Wszystkie" : `Ed. ${e}`}
          </button>
        ))}
      </div>

      <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
        {shots.map((s, i) => {
          const displayDate = s.date || "2021-01-01";
          return (
            <motion.button
              key={s.id}
              onClick={() => setActive(s)}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (i % 6) * 0.05 }}
              whileHover={{ scale: 1.01 }}
              className="group mb-4 block w-full overflow-hidden rounded-xl border border-border/60 text-left glass"
            >
              <img src={s.url} alt={s.title} loading="lazy" className="w-full transition-transform duration-500 group-hover:scale-105" />
              <div className="flex flex-col gap-1 p-3 text-xs">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-semibold text-foreground">{s.title}</span>
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">{s.category}</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                  <span>
                    {displayDate}
                    {s.edition && <span className="ml-2 rounded-full bg-accent/20 px-1.5 py-0.5 text-[9px] font-bold text-accent-foreground">ED. {s.edition}</span>}
                  </span>
                  {s.description && <span className="truncate max-w-[150px] italic">{s.description}</span>}
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>

      <Lightbox
        src={active?.url ?? null}
        alt={active?.title}
        category={active?.category}
        description={active?.description}
        date={active?.date || "2021-01-01"}
        onClose={() => setActive(null)}
      />
    </main>
  );
}