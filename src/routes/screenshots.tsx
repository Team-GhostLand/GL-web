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

function ScreenshotsPage() {
  const { settings } = useAdminSettings();
  const { t } = useI18n();
  const [filter, setFilter] = useState<(typeof CATEGORIES)[number]>("Wszystkie");
  const [active, setActive] = useState<Screenshot | null>(null);

  const all = useMemo(
    () => [...settings.uploadedScreenshots, ...WORLD_SCREENSHOTS],
    [settings.uploadedScreenshots],
  );
  const shots = filter === "Wszystkie" ? all : all.filter((s) => s.category === filter);

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

      <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
        {shots.map((s, i) => (
          <motion.button
            key={s.id}
            onClick={() => setActive(s)}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: (i % 6) * 0.05 }}
            whileHover={{ scale: 1.01 }}
            className="group mb-4 block w-full overflow-hidden rounded-xl border border-border/60 text-left"
          >
            <img src={s.url} alt={s.title} loading="lazy" className="w-full transition-transform duration-500 group-hover:scale-105" />
            <div className="flex items-center justify-between px-3 py-2 text-xs">
              <span className="font-medium text-foreground">{s.title}</span>
              <span className="text-muted-foreground">{s.category}</span>
            </div>
          </motion.button>
        ))}
      </div>

      <Lightbox src={active?.url ?? null} alt={active?.title} onClose={() => setActive(null)} />
    </main>
  );
}