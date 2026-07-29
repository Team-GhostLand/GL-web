import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  Crown,
  Compass,
  Hammer,
  TreePine,
  TrainFront,
  Plane,
  Coins,
  Ghost,
  Archive,
  Sparkles,
  Building2,
  Landmark,
  Rocket,
  Heart,
} from "lucide-react";

export const Route = createFileRoute("/lore")({
  head: () => ({
    meta: [
      { title: "Lore GhostLand — historia, ekipa, organizacje" },
      { name: "description", content: "Historia GhostLand: 8 edycji, 5 lat, ekipa JIFO, Guzio, Midnight, Kanapkos, DjPalemkov. Organizacje GRA, GAY, GTA, MAGA." },
      { property: "og:title", content: "Lore GhostLand" },
      { property: "og:description", content: "Historia, ekipa i organizacje GhostLand." },
      { property: "og:type", content: "article" },
    ],
  }),
  component: LorePage,
});

const editions = [
  {
    n: "1 & 2",
    title: "Starożytne Akta",
    icon: Archive,
    note: "Nie mieliśmy wtedy dobrego systemu archiwizacji ani wersjonowania (np. 2.5.8 mogło być kompletnie nową edycją), a edycje były odklejone od światów (mogliśmy parę razy resetować świat na tej samej edycji). Finalnie doliczyliśmy się łącznie czterech edycji w okresie znanym oficjalnie jako „Edycje 1 i 2” (nie licząc pół-edycji, które też były w tym czasie koncepcją), dzięki niezbitemu dowodowi w postaci kanału #︱🎶・ed4-konkurs-muzyczny na Discordzie. Ta nazwa naprawdę nas uratowała! Niestety, nikt nie pamięta co dokładnie się podczas nich działo (a raczej, każdy pamięta coś innego i owe zapiski często ze sobą konfliktują), poza tym, że oryginalnie paczka działała na Forge+CurseForge, potem na Fabric+CF, a finalnie na Fabric+Modrinth — i tak już zostało.",
  },
  {
    n: 3,
    title: "Koleje Pustynne",
    icon: TrainFront,
    note: "Dodajemy Create, a wraz z nim dochodzą pociągi. Powstaje GRA — GhostLand Railway Administration — i zaczyna bardzo prężnie działać na rzecz GhostLanda. Jej głównym antagonistą staje się GeistWelt, który zaczyna budować sztuczną pustynię na planowanej trasie kolejowej, co budzi gniew KdSD (Komitetu do Spraw Depustynnienia, protoplasty GhostLand Tree Association), chcącego prezerwacji jak największej ilości naturalnego piękna Kontynentu GhostLanda. À propos tego — była to pierwsza edycja z systemem kontynentów.",
  },
  {
    n: 4,
    title: "W przestworza!",
    icon: Plane,
    note: "Główną zmianą było dodanie Man of Many Planes. W związku z tym powstało GAY — GhostLand Airplane Yeeters. Oryginalnie miało być parodią GRA, ale docelowo przerodziło się w ważny element ekosystemu GhostLand, wprowadzając standardy oznaczeń pasów na lotniskach. Jesteśmy pewni, że na edycji 8 — dzięki Create: Aeronautics — staną się jeszcze bardziej kluczowi.",
  },
  {
    n: 5,
    title: "Złota Era",
    icon: Sparkles,
    highlight: true,
    note: "Najbardziej pamiętna edycja — najwięcej się działo. Wszyscy mieszkali bardzo blisko siebie, więc było dużo szans na interakcję. Niektóre z nich pozytywne (najbardziej rozłożysta sieć GRA w historii GhostLand), a inne bolesne (powstanie Hiroszimy i Nagasaki w miejscu domu jednego z graczy).",
  },
  {
    n: 6,
    title: "Ekspansja",
    icon: Building2,
    note: "Paczka była wyjątkowo oparta na NeoForge, bardzo eksperymentalna: brak Create i kontynentów, ale za to nowe organizacje, nowe biomy, dojrzałe pipeline'y devopsowe i dużo modów technicznych. Powstały na niej największe projekty architektoniczne w historii GhostLand, np. Dwie Wieże, i jest ogólnie bardzo pozytywnie oceniana przez wszystkich fanów modów technicznych.",
  },
  {
    n: 7,
    title: "Immersja",
    icon: Landmark,
    note: "Próba replikacji sukcesu piątki — powrót na Fabric i dużo interakcji. Tym razem jednak planowaliśmy wywołać zwiększone interakcje nie poprzez rozkaz budowy baz blisko, a poprzez wprowadzenie obfitego systemu roleplayu: nacisk na politykę monetarną dzięki Create: Numismatics, powstanie kanału na Discordzie dedykowanego pisaniu backstory i trochę innych takich pierdoletów. Było całkiem fajnie, chociaż część graczy zgłaszała, że była odrobinę przytłoczona.",
  },
  {
    n: 8,
    title: "Nadchodząca",
    icon: Rocket,
    highlight: true,
    note: "NeoForge 1.21.1, a wraz z nim długo wyczekiwane przez prawie każdego w społeczności GhostLanda Create: Aeronautics. Dodatkowo, mocny focus na update'y z czasem. Zapowiada się na jeszcze lepszą niż piątka!",
  },
] as Array<{
  n: number | string;
  title: string;
  icon: typeof Archive;
  note: string;
  highlight?: boolean;
}>;

const crew = [
  { name: "JIFO", role: "Pomysłodawca, główny menedżer, oryginalny twórca, marketingowiec", icon: Crown },
  { name: "Guzio", role: "Genialny architekt, orchiestrator systemów, budowniczy devopsów", icon: Compass },
  { name: "Midnight", role: "Świetny architekt doświadczenia gracza i struktury modpacka", icon: Ghost },
  { name: "Kanapkos", role: "Specjalista od worldgenu i struktur", icon: TreePine },
  { name: "DjPalemkov", role: "Spec od fabryki i modów technicznych", icon: Hammer },
];

const orgs = [
  { abbr: "GRA", full: "GhostLand Railway Administration", desc: "Zautomatyzowane sieci kolejowe łączące wszystko ze wszystkim.", icon: TrainFront, tone: "ember" },
  { abbr: "GAY", full: "GhostLand Airplane Yeeters", desc: "Standaryzacja lotnisk i ruchu lotniczego.", icon: Plane, tone: "azure" },
  { abbr: "GTA", full: "GhostLand Tree Administration", desc: "Środowiskowcy przeciw deforestacji — zawsze.", icon: TreePine, tone: "ghost" },
  { abbr: "MAGA", full: "Money Administration GhostLand Administration", desc: "Bank centralny oficjalnej waluty edycji.", icon: Coins, tone: "ember" },
];

function LorePage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-16">
      <motion.header
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-center"
      >
        <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">Lore</p>
        <h1 className="mt-3 font-heading text-4xl font-bold text-ghost sm:text-6xl">Świat GhostLand</h1>
        <p className="mx-auto mt-4 max-w-2xl text-sm text-muted-foreground sm:text-base">
          Iwo (JIFO) chciał tylko naturalnego sukcesora szkolnego serwera Minecraft. Wyszedł projekt na lata,
          który dał ekipie doświadczenie z DevOps, UX, pipeline'ów, zarządzania zespołem, botów Discord i architektury —
          zarówno serwerowej, jak i tej w samym Minecrafcie.
        </p>
      </motion.header>

      <section className="mt-16">
        <h2 className="mb-6 font-heading text-2xl text-ember">Edycje</h2>
        <div className="relative border-l-2 border-border/60 pl-6 ml-[15px]">
          {editions.map((e, i) => (
            <motion.div
              key={String(e.n)}
              initial={{ opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="relative mb-6"
            >
              <span
                className={`absolute -left-[37px] top-1 flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-bold ring-2 ring-background ${
                  e.highlight ? "bg-primary text-primary-foreground glow-ember" : "bg-muted text-muted-foreground"
                }`}
              >
                <e.icon className="h-3.5 w-3.5" />
              </span>
              <div className={`glass rounded-xl p-4 transition-transform hover:-translate-y-0.5 ${e.highlight ? "border-primary/40" : ""}`}>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${e.highlight ? "bg-primary/20 text-primary" : "bg-muted/60 text-muted-foreground"}`}>
                    <e.icon className="h-3 w-3" />
                    Edycja {e.n}
                  </span>
                  <h3 className="font-heading text-lg font-semibold">
                    Edycja {e.n}: {e.title}
                  </h3>
                  {e.highlight && (
                    <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-bold uppercase text-primary">
                      must-see
                    </span>
                  )}
                </div>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{e.note}</p>
              </div>
            </motion.div>
          ))}
        </div>
        <div className="mt-6 flex justify-center">
          <a
            href="/versions"
            className="group inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/40 px-5 py-2.5 text-xs font-semibold text-muted-foreground backdrop-blur-md transition-all hover:border-primary/60 hover:text-primary hover:shadow-[0_0_20px_-4px_hsl(var(--primary))]"
          >
            <Archive className="h-4 w-4 transition-transform group-hover:-rotate-6" />
            Archiwum CI — wszystkie wersje
          </a>
        </div>
      </section>

      <section className="mt-16">
        <h2 className="mb-6 font-heading text-2xl text-ember">Ekipa</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {crew.map((p, i) => (
            <motion.div
              key={p.name}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              whileHover={{ y: -4 }}
              className="glass rounded-2xl p-5"
            >
              <p.icon className="h-6 w-6 text-primary" />
              <div className="mt-3 font-heading text-lg font-semibold">{p.name}</div>
              <div className="text-xs text-muted-foreground">{p.role}</div>
            </motion.div>
          ))}
        </div>
        <p className="mt-6 text-sm text-muted-foreground">
          Każda edycja to setki godzin ekipy, zwłaszcza pierwszej trójki żeby GhostLand był jak najciekawszym
          doświadczeniem.
        </p>
      </section>

      <section className="mt-16">
        <h2 className="mb-6 font-heading text-2xl text-ember">Organizacje</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {orgs.map((o, i) => (
            <motion.div
              key={o.abbr}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="glass rounded-2xl p-5"
            >
              <div className="flex items-center gap-3">
                <o.icon
                  className={`h-6 w-6 ${
                    o.tone === "ember"
                      ? "text-primary"
                      : o.tone === "azure"
                        ? "text-[oklch(0.68_0.18_240)]"
                        : "text-accent"
                  }`}
                />
                <div>
                  <div className="font-heading text-xl font-bold">{o.abbr}</div>
                  <div className="text-xs uppercase tracking-wider text-muted-foreground">{o.full}</div>
                </div>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">{o.desc}</p>
            </motion.div>
          ))}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass rounded-2xl border-dashed border-red-400/40 p-5 sm:col-span-2"
          >
            <div className="flex items-center gap-2 text-red-300">
              <Ghost className="h-5 w-5" />
              <span className="font-heading text-lg font-bold">GeistWelt</span>
              <span className="rounded-full bg-red-500/20 px-2 py-0.5 text-[10px] font-bold uppercase">
                nielegalna
              </span>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Podziemna organizacja adwokująca zmianę nazwy GhostLanda na niemieckie <em>GeistWelt</em>. Oficjalnie
              nieuznawana. Nieoficjalnie — istnieje.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="mt-16 glass rounded-2xl p-8 text-center">
        <h2 className="font-heading text-2xl text-ghost">Zamknięta whitelista</h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground">
          GhostLandy mają zamkniętą strukturę, więc wejście tylko z polecenia albo przez JIFO. Rygorystyczna whitelista
          gwarantuje dobrą atmosferę i to, że wszyscy grają fair.
        </p>
      </section>

      <motion.section
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-10 text-center text-xs text-muted-foreground"
      >
        <p className="inline-flex items-center gap-1.5">
          Strona zrobiona z <Heart className="h-3.5 w-3.5 animate-pulse text-primary" /> przez Iwo —{" "}
          <a
            href="https://jifo.dev"
            target="_blank"
            rel="noreferrer"
            className="group relative font-semibold text-foreground transition-colors hover:text-primary"
          >
            <span className="relative z-10">jifo.dev</span>
            <span className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-primary transition-transform duration-300 group-hover:scale-x-100" />
          </a>
        </p>
      </motion.section>
    </main>
  );
}