import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { motion } from "framer-motion";
import { LogOut, Save, Timer, Play, Pause, RotateCcw, Rocket, Radio, Upload, Trash2, MessageCircle, Send } from "lucide-react";
import { ADMIN_TOKEN_KEY } from "@/lib/admin-config";
import { useAdminSettings, type ServerStatusMode, type ModpackLink } from "@/lib/admin-settings";
import type { Screenshot } from "@/lib/assets";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin — GhostLand" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: AdminPage,
});

function toLocalInput(iso: string) {
  const d = new Date(iso);
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function AdminPage() {
  const navigate = useNavigate();
  const { settings, update, reset } = useAdminSettings();
  const [authed, setAuthed] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const t = window.localStorage.getItem(ADMIN_TOKEN_KEY);
    if (!t) navigate({ to: "/login" });
    else setAuthed(true);
  }, [navigate]);

  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(null), 2200);
    return () => clearTimeout(id);
  }, [toast]);

  if (!authed) return null;

  const flash = (msg: string) => setToast(msg);

  const logout = () => {
    window.localStorage.removeItem(ADMIN_TOKEN_KEY);
    navigate({ to: "/" });
  };

  const setStatus = (mode: ServerStatusMode) => {
    update({ statusMode: mode });
    flash(`Status: ${mode}`);
  };

  const onFiles = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    const today = new Date().toISOString().split("T")[0];
    Promise.all(
      files.map(
        (f) =>
          new Promise<Screenshot>((resolve) => {
            const reader = new FileReader();
            reader.onload = () =>
              resolve({
                id: crypto.randomUUID(),
                url: String(reader.result),
                title: f.name.replace(/\.[^.]+$/, ""),
                category: "Budowle",
                description: "",
                date: today,
                edition: 8,
              });
            reader.readAsDataURL(f);
          }),
      ),
    ).then((shots) => {
      update({ uploadedScreenshots: [...shots, ...settings.uploadedScreenshots] });
      flash(`Dodano ${shots.length} zrzutów`);
      if (fileRef.current) fileRef.current.value = "";
    });
  };

  const removeShot = (id: string) => {
    update({ uploadedScreenshots: settings.uploadedScreenshots.filter((s) => s.id !== id) });
  };

  const updateLink = (index: number, patch: Partial<ModpackLink>) => {
    const updated = settings.modpackLinks.map((link, i) => (i === index ? { ...link, ...patch } : link));
    update({ modpackLinks: updated });
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-16">
      <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">/admin</p>
          <h1 className="mt-1 font-heading text-3xl font-bold text-ghost">Panel administratora</h1>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/" className="rounded-lg border border-border px-3 py-2 text-xs hover:bg-accent/20">
            ← Strona
          </Link>
          <button
            onClick={logout}
            className="inline-flex items-center gap-1.5 rounded-lg bg-destructive/20 px-3 py-2 text-xs font-medium text-red-200 hover:bg-destructive/40"
          >
            <LogOut className="h-4 w-4" /> Wyloguj
          </button>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Modpack Links */}
        <Section title="Wersje Modpacka (do 3 linków)" icon={<Save className="h-5 w-5 text-primary" />} span>
          <div className="grid gap-4 md:grid-cols-3">
            {settings.modpackLinks.slice(0, 3).map((link, i) => (
              <div key={link.id || i} className="flex flex-col gap-3 rounded-xl border border-border/60 p-4 glass">
                <p className="text-xs font-bold uppercase tracking-wider text-primary">Wersja #{i + 1}</p>
                <Field label="Etykieta / Nazwa">
                  <input
                    value={link.label}
                    onChange={(e) => updateLink(i, { label: e.target.value })}
                    placeholder="np. Główny Modpack (.mrpack)"
                    className="input"
                  />
                </Field>
                <Field label="URL pliku (.mrpack / .zip)">
                  <input
                    value={link.url}
                    onChange={(e) => updateLink(i, { url: e.target.value })}
                    placeholder="https://..."
                    className="input"
                  />
                </Field>
                <Field label="Wersja">
                  <input
                    value={link.version}
                    onChange={(e) => updateLink(i, { version: e.target.value })}
                    placeholder="8.0.0"
                    className="input"
                  />
                </Field>
                <label className="mt-1 flex items-center gap-2 text-xs text-foreground cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={link.onlyAfterCountdown}
                    onChange={(e) => updateLink(i, { onlyAfterCountdown: e.target.checked })}
                    className="rounded border-border bg-input accent-primary"
                  />
                  <span>Dostępne dopiero po zakończeniu odliczania</span>
                </label>
              </div>
            ))}
          </div>
          <div className="mt-2">
            <button onClick={() => flash("Zapisano linki modpacka.")} className="btn btn-primary">
              Zapisz i opublikuj
            </button>
          </div>
        </Section>

        {/* Countdown */}
        <Section title="Countdown" icon={<Timer className="h-5 w-5 text-primary" />}>
          <Field label="Data i godzina startu">
            <input
              type="datetime-local"
              value={toLocalInput(settings.countdownTargetIso)}
              onChange={(e) =>
                update({ countdownTargetIso: new Date(e.target.value).toISOString(), countdownForceStart: false })
              }
              className="input"
            />
          </Field>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => update({ countdownPaused: !settings.countdownPaused })}
              className={`btn ${settings.countdownPaused ? "btn-amber" : ""}`}
            >
              {settings.countdownPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
              {settings.countdownPaused ? "Wznów" : "Pauzuj"}
            </button>
            <button
              onClick={() => {
                const d = new Date();
                d.setDate(d.getDate() + 14);
                d.setHours(20, 0, 0, 0);
                update({ countdownTargetIso: d.toISOString(), countdownPaused: false, countdownForceStart: false });
                flash("Licznik zresetowany (+14 dni).");
              }}
              className="btn"
            >
              <RotateCcw className="h-4 w-4" /> Reset
            </button>
            <button
              onClick={() => update({ countdownForceStart: true })}
              className="btn btn-primary"
            >
              <Rocket className="h-4 w-4" /> Wymuś start
            </button>
          </div>
        </Section>

        {/* Status */}
        <Section title="Status serwera" icon={<Radio className="h-5 w-5 text-primary" />}>
          <Field label="Host serwera MC (mcsrvstat)">
            <input
              value={settings.mcHost}
              onChange={(e) => update({ mcHost: e.target.value })}
              className="input"
            />
          </Field>
          <div className="flex flex-wrap gap-2">
            {(["auto", "online", "maintenance", "offline", "started"] as ServerStatusMode[]).map((m) => (
              <button
                key={m}
                onClick={() => setStatus(m)}
                className={`btn ${settings.statusMode === m ? "btn-primary" : ""}`}
              >
                {m}
              </button>
            ))}
          </div>
        </Section>

        {/* Discord */}
        <Section title="Discord" icon={<MessageCircle className="h-5 w-5 text-primary" />}>
          <Field label="Link zaproszenia">
            <input
              value={settings.discordInvite}
              onChange={(e) => update({ discordInvite: e.target.value })}
              className="input"
            />
          </Field>
          <Field label="Widget ID (Server Settings → Widget)">
            <input
              value={settings.discordWidgetId}
              onChange={(e) => update({ discordWidgetId: e.target.value })}
              className="input"
            />
          </Field>
          <Field label="Webhook URL (ogłoszenia)">
            <input
              value={settings.discordWebhookUrl}
              onChange={(e) => update({ discordWebhookUrl: e.target.value })}
              className="input"
            />
          </Field>
          <AnnounceForm
            webhook={settings.discordWebhookUrl}
            onResult={(m) => flash(m)}
          />
        </Section>

        {/* Screenshots */}
        <Section title="Zrzuty ekranu — wgrywanie i edycja" icon={<Upload className="h-5 w-5 text-primary" />} span>
          <div className="flex flex-col gap-2">
            <label className="text-xs uppercase tracking-widest text-muted-foreground">Dodaj nowe zrzuty ekranu</label>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              multiple
              onChange={onFiles}
              className="text-xs text-muted-foreground file:mr-3 file:rounded-lg file:border-0 file:bg-primary file:px-3 file:py-2 file:text-xs file:font-semibold file:text-primary-foreground cursor-pointer"
            />
          </div>

          {settings.uploadedScreenshots.length === 0 ? (
            <p className="text-xs text-muted-foreground">Brak przesłanych zrzutów. Wybierz pliki powyżej, żeby dodać.</p>
          ) : (
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {settings.uploadedScreenshots.map((s) => (
                <div key={s.id} className="flex flex-col gap-2 rounded-xl border border-border/60 bg-black/40 p-3">
                  <div className="relative overflow-hidden rounded-lg">
                    <img src={s.url} alt={s.title} className="h-36 w-full object-cover" />
                    <button
                      onClick={() => removeShot(s.id)}
                      className="absolute right-2 top-2 rounded-full bg-destructive p-1.5 text-destructive-foreground transition-transform hover:scale-110"
                      title="Usuń zrzut"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <Field label="Tytuł">
                    <input
                      value={s.title}
                      onChange={(e) =>
                        update({
                          uploadedScreenshots: settings.uploadedScreenshots.map((x) =>
                            x.id === s.id ? { ...x, title: e.target.value } : x,
                          ),
                        })
                      }
                      className="input py-1 text-xs"
                    />
                  </Field>

                  <Field label="Kategoria">
                    <select
                      value={s.category}
                      onChange={(e) =>
                        update({
                          uploadedScreenshots: settings.uploadedScreenshots.map((x) =>
                            x.id === s.id ? { ...x, category: e.target.value } : x,
                          ),
                        })
                      }
                      className="input py-1 text-xs"
                    >
                      {(["Budowle", "Krajobrazy", "Fabryki", "Ekipa"] as const).map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </Field>

                  <Field label="Opis">
                    <textarea
                      value={s.description || ""}
                      onChange={(e) =>
                        update({
                          uploadedScreenshots: settings.uploadedScreenshots.map((x) =>
                            x.id === s.id ? { ...x, description: e.target.value } : x,
                          ),
                        })
                      }
                      rows={2}
                      placeholder="Dodatkowy opis zrzutu..."
                      className="input py-1 text-xs"
                    />
                  </Field>

                  <Field label="Data uploadu">
                    <input
                      type="date"
                      value={s.date || new Date().toISOString().split("T")[0]}
                      onChange={(e) =>
                        update({
                          uploadedScreenshots: settings.uploadedScreenshots.map((x) =>
                            x.id === s.id ? { ...x, date: e.target.value } : x,
                          ),
                        })
                      }
                      className="input py-1 text-xs"
                    />
                  </Field>

                  <Field label="Edycja">
                    <select
                      value={s.edition ?? ""}
                      onChange={(e) =>
                        update({
                          uploadedScreenshots: settings.uploadedScreenshots.map((x) =>
                            x.id === s.id ? { ...x, edition: e.target.value ? Number(e.target.value) : undefined } : x,
                          ),
                        })
                      }
                      className="input py-1 text-xs"
                    >
                      <option value="">— nieznana —</option>
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                        <option key={n} value={n}>
                          Edycja {n}
                        </option>
                      ))}
                    </select>
                  </Field>
                </div>
              ))}
            </div>
          )}
        </Section>

        <Section title="Reset" icon={<RotateCcw className="h-5 w-5 text-red-300" />} span>
          <button
            onClick={() => {
              if (confirm("Zresetować wszystkie ustawienia do wartości domyślnych?")) {
                reset();
                flash("Ustawienia zresetowane.");
              }
            }}
            className="btn btn-danger"
          >
            Przywróć domyślne
          </button>
        </Section>
      </div>

      {toast && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground glow-ember"
        >
          {toast}
        </motion.div>
      )}

      <style>{`
        .input { width: 100%; border-radius: 0.5rem; border: 1px solid var(--border); background: var(--input); padding: 0.5rem 0.75rem; font-size: 0.875rem; color: var(--foreground); outline: none; }
        .input:focus { border-color: var(--primary); }
        .btn { display: inline-flex; align-items: center; gap: 0.375rem; border-radius: 0.5rem; border: 1px solid var(--border); background: color-mix(in oklab, var(--card) 60%, transparent); padding: 0.5rem 0.85rem; font-size: 0.75rem; font-weight: 600; color: var(--foreground); transition: background-color .15s; }
        .btn:hover { background: color-mix(in oklab, var(--accent) 25%, transparent); }
        .btn-primary { background: var(--primary); color: var(--primary-foreground); border-color: transparent; }
        .btn-primary:hover { background: color-mix(in oklab, var(--primary) 85%, black); }
        .btn-amber { background: oklch(0.75 0.15 65 / 0.25); color: oklch(0.9 0.12 65); }
        .btn-danger { background: var(--destructive); color: var(--destructive-foreground); border-color: transparent; }
      `}</style>
    </main>
  );
}

function Section({ title, icon, children, span }: { title: string; icon: React.ReactNode; children: React.ReactNode; span?: boolean }) {
  return (
    <section className={`glass rounded-2xl p-6 ${span ? "lg:col-span-2" : ""}`}>
      <div className="mb-4 flex items-center gap-2">
        {icon}
        <h2 className="font-heading text-lg font-semibold">{title}</h2>
      </div>
      <div className="flex flex-col gap-4">{children}</div>
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block text-xs uppercase tracking-widest text-muted-foreground">
      {label}
      <div className="mt-1 normal-case tracking-normal">{children}</div>
    </label>
  );
}

function AnnounceForm({ webhook, onResult }: { webhook: string; onResult: (m: string) => void }) {
  const [content, setContent] = useState("");
  const [busy, setBusy] = useState(false);

  const send = async () => {
    if (!webhook) return onResult("Brak webhook URL.");
    if (!content.trim()) return;
    setBusy(true);
    try {
      const res = await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, username: "GhostLand" }),
      });
      onResult(res.ok ? "Ogłoszenie wysłane." : `Błąd: ${res.status}`);
      if (res.ok) setContent("");
    } catch {
      onResult("Nie udało się wysłać.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mt-2 rounded-xl border border-border/60 p-3">
      <p className="mb-2 text-xs font-semibold text-muted-foreground">Wyślij ogłoszenie</p>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={3}
        placeholder="Treść ogłoszenia…"
        className="input"
      />
      <button onClick={send} disabled={busy} className="btn btn-primary mt-2">
        <Send className="h-4 w-4" /> {busy ? "Wysyłanie…" : "Wyślij"}
      </button>
    </div>
  );
}