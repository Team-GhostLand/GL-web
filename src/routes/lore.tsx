import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Crown, Compass, Hammer, TreePine, TrainFront, Plane, Coins, Ghost } from "lucide-react";

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
  { n: 1, title: "Genesis", note: "Iwo (JIFO) tworzy sukcesora szkolnego serwera Minecraft." },
  { n: 2, title: "Rozbudowa PROJEKTU", note: "Formuje się rdzeń społeczności, powstaje serwer na discordzie, pierwsze osoby oferują pomoc." },
  { n: 3, title: "FABRIC", note: "Pierwsze eksperymenty z przejściem na Fabric modloader i tego konswkwencje." },
  { n: 4, title: "Kolej", note: "Powstaje GRA - GhostLand Railway Administration i zaczyna bardzo prężnie działać na rzecz GhostLanda" },
  { n: 5, title: "Złota Era", highlight: true, note: "Najbardziej pamiętna edycja - najwięcej się działo." },
  { n: 6, title: "Ekspansja", note: "Nowe organizacje, nowe biomy, dojrzałe pipeline'y devopsowe." },
  { n: 7, title: "Immersja", note: "Nacisk na politykę monetarną i trochę dziwnych pierdoletów, ale było fajnie!" },
  { n: 8, title: "Nadchodząca", highlight: true, note: "Neoforge 1.21.1, będzie jelszcze lepsza niż 5tka!" },
];

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
        <div className="relative border-l-2 border-border/60 pl-6">
          {editions.map((e, i) => (
            <motion.div
              key={e.n}
              initial={{ opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="relative mb-6"
            >
              <span
                className={`absolute -left-[33px] top-1 flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold ${
                  e.highlight ? "bg-primary text-primary-foreground glow-ember" : "bg-muted text-muted-foreground"
                }`}
              >
                {e.n}
              </span>
              <div className={`glass rounded-xl p-4 ${e.highlight ? "border-primary/40" : ""}`}>
                <div className="flex items-center gap-2">
                  <h3 className="font-heading text-lg font-semibold">
                    Edycja {e.n}: {e.title}
                  </h3>
                  {e.highlight && (
                    <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-bold uppercase text-primary">
                      must-see
                    </span>
                  )}
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{e.note}</p>
              </div>
            </motion.div>
          ))}
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
    </main>
  );
}