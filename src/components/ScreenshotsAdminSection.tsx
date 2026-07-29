import { useRef, useState, type ChangeEvent } from "react";
import {
  Upload,
  Trash2,
  EyeOff,
  Eye,
  Check,
  X,
  GripVertical,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
  sortableKeyboardCoordinates,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  useAdminSettings,
  getGalleryScreenshots,
  isSeedScreenshot,
} from "@/lib/admin-settings";
import { WORLD_SCREENSHOTS, type Screenshot } from "@/lib/assets";

const SCREENSHOT_CATEGORIES = ["Budowle", "Krajobrazy", "Fabryki", "Ekipa"] as const;
const MAX_SHOT_BYTES = 5 * 1024 * 1024;

type PendingShot = Screenshot & { fileName: string; tooLarge?: boolean };

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block text-xs uppercase tracking-widest text-muted-foreground">
      {label}
      <div className="mt-1 normal-case tracking-normal">{children}</div>
    </label>
  );
}

function ScreenshotMetaFields({
  value,
  onChange,
}: {
  value: Pick<Screenshot, "title" | "category" | "description" | "date" | "edition" | "tags">;
  onChange: (patch: Partial<Screenshot>) => void;
}) {
  return (
    <>
      <Field label="Tytuł">
        <input
          value={value.title}
          onChange={(e) => onChange({ title: e.target.value })}
          className="input py-1 text-xs"
        />
      </Field>
      <Field label="Kategoria">
        <select
          value={value.category}
          onChange={(e) => onChange({ category: e.target.value })}
          className="input py-1 text-xs"
        >
          {SCREENSHOT_CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Opis">
        <textarea
          value={value.description || ""}
          onChange={(e) => onChange({ description: e.target.value })}
          rows={2}
          placeholder="Dodatkowy opis zrzutu..."
          className="input py-1 text-xs"
        />
      </Field>
      <Field label="Data">
        <input
          type="date"
          value={value.date || ""}
          onChange={(e) => onChange({ date: e.target.value })}
          className="input py-1 text-xs"
        />
      </Field>
      <Field label="Edycja">
        <select
          value={value.edition ?? ""}
          onChange={(e) => onChange({ edition: e.target.value ? Number(e.target.value) : undefined })}
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
      <Field label="Tagi (oddzielone przecinkami)">
        <input
          value={(value.tags || []).join(", ")}
          onChange={(e) =>
            onChange({
              tags: e.target.value
                .split(",")
                .map((t) => t.trim())
                .filter(Boolean),
            })
          }
          placeholder="np. wieża, nocą, mgła"
          className="input py-1 text-xs"
        />
      </Field>
    </>
  );
}

function SortableShotCard({
  shot,
  seed,
  onRemove,
  onMoveUp,
  onMoveDown,
  onMeta,
}: {
  shot: Screenshot;
  seed: boolean;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onMeta: (patch: Partial<Screenshot>) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: shot.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.85 : 1,
    zIndex: isDragging ? 20 : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex flex-col gap-2 rounded-xl border border-border/60 bg-black/40 p-3"
    >
      <div className="relative overflow-hidden rounded-lg">
        <img src={shot.url} alt={shot.title} className="h-36 w-full object-cover" />
        <button
          onClick={onRemove}
          className="absolute right-2 top-2 rounded-full bg-destructive p-1.5 text-destructive-foreground transition-transform hover:scale-110"
          title={seed ? "Ukryj zrzut" : "Usuń zrzut"}
        >
          {seed ? <EyeOff className="h-4 w-4" /> : <Trash2 className="h-4 w-4" />}
        </button>
        <span className="absolute bottom-2 left-2 rounded bg-black/70 px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
          {seed ? "seed" : "upload"}
        </span>
      </div>
      <div className="flex items-center gap-1">
        <button
          type="button"
          className="btn cursor-grab active:cursor-grabbing px-2"
          title="Przeciągnij"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-4 w-4" />
        </button>
        <button type="button" className="btn px-2" title="W górę" onClick={onMoveUp}>
          <ChevronUp className="h-4 w-4" />
        </button>
        <button type="button" className="btn px-2" title="W dół" onClick={onMoveDown}>
          <ChevronDown className="h-4 w-4" />
        </button>
        <span className="ml-auto text-[10px] uppercase tracking-wider text-muted-foreground">kolejność</span>
      </div>
      <ScreenshotMetaFields value={shot} onChange={onMeta} />
    </div>
  );
}

export function ScreenshotsAdminSection({ flash }: { flash: (m: string) => void }) {
  const { settings, update } = useAdminSettings();
  const fileRef = useRef<HTMLInputElement>(null);
  const [pending, setPending] = useState<PendingShot[]>([]);
  const [tab, setTab] = useState<"gallery" | "hidden">("gallery");

  const gallery = getGalleryScreenshots(settings);
  const orderIds = gallery.map((s) => s.id);
  const hiddenSeeds = WORLD_SCREENSHOTS.filter((s) => settings.hiddenScreenshotIds.includes(s.id)).map((s) => ({
    ...s,
    ...settings.screenshotOverrides[s.id],
    id: s.id,
    url: s.url,
  }));

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const onFiles = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    const today = new Date().toISOString().split("T")[0];
    Promise.all(
      files.map(
        (f) =>
          new Promise<PendingShot>((resolve) => {
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
                tags: [],
                fileName: f.name,
                tooLarge: f.size > MAX_SHOT_BYTES,
              });
            reader.readAsDataURL(f);
          }),
      ),
    ).then((shots) => {
      setPending((prev) => [...shots, ...prev]);
      if (fileRef.current) fileRef.current.value = "";
      flash(`Przygotowano ${shots.length} — uzupełnij metadane i zatwierdź.`);
    });
  };

  const commitPending = () => {
    if (!pending.length) return;
    const oversized = pending.filter((p) => p.tooLarge);
    if (
      oversized.length &&
      !confirm(`${oversized.length} plik(ów) > 5 MB — localStorage może się przepełnić. Kontynuować?`)
    ) {
      return;
    }
    const shots: Screenshot[] = pending.map((p) => ({
      id: p.id,
      url: p.url,
      title: p.title,
      category: p.category,
      description: p.description,
      date: p.date,
      edition: p.edition,
      tags: p.tags,
    }));
    const newIds = shots.map((s) => s.id);
    update({
      uploadedScreenshots: [...shots, ...settings.uploadedScreenshots],
      galleryOrder: [...newIds, ...(settings.galleryOrder ?? orderIds).filter((id) => !newIds.includes(id))],
    });
    setPending([]);
    flash(`Dodano ${shots.length} zrzutów do galerii.`);
  };

  const patchUploaded = (id: string, patch: Partial<Screenshot>) => {
    update({
      uploadedScreenshots: settings.uploadedScreenshots.map((x) => (x.id === id ? { ...x, ...patch } : x)),
    });
  };

  const patchSeed = (id: string, current: Screenshot, patch: Partial<Screenshot>) => {
    const merged = { ...current, ...patch };
    update({
      screenshotOverrides: {
        ...settings.screenshotOverrides,
        [id]: {
          title: merged.title,
          category: merged.category,
          description: merged.description,
          date: merged.date,
          edition: merged.edition,
          tags: merged.tags,
        },
      },
    });
  };

  const setOrder = (next: string[]) => update({ galleryOrder: next });

  const moveBy = (id: string, delta: -1 | 1) => {
    const idx = orderIds.indexOf(id);
    if (idx < 0) return;
    const j = idx + delta;
    if (j < 0 || j >= orderIds.length) return;
    setOrder(arrayMove(orderIds, idx, j));
  };

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = orderIds.indexOf(String(active.id));
    const newIndex = orderIds.indexOf(String(over.id));
    if (oldIndex < 0 || newIndex < 0) return;
    setOrder(arrayMove(orderIds, oldIndex, newIndex));
  };

  const removeShot = (s: Screenshot) => {
    if (isSeedScreenshot(s.id)) {
      if (!confirm(`Ukryć „${s.title}” w galerii publicznej?`)) return;
      update({
        hiddenScreenshotIds: [...settings.hiddenScreenshotIds, s.id],
        galleryOrder: (settings.galleryOrder ?? orderIds).filter((id) => id !== s.id),
      });
      flash("Ukryto zrzut seed.");
      return;
    }
    if (!confirm(`Usunąć „${s.title}” na stałe?`)) return;
    update({
      uploadedScreenshots: settings.uploadedScreenshots.filter((x) => x.id !== s.id),
      galleryOrder: (settings.galleryOrder ?? orderIds).filter((id) => id !== s.id),
    });
    flash("Usunięto zrzut.");
  };

  const restoreSeed = (id: string) => {
    update({
      hiddenScreenshotIds: settings.hiddenScreenshotIds.filter((x) => x !== id),
      galleryOrder: [...(settings.galleryOrder ?? orderIds).filter((x) => x !== id), id],
    });
    flash("Przywrócono zrzut do galerii.");
  };

  return (
    <section className="glass rounded-2xl p-6 lg:col-span-2">
      <div className="mb-4 flex items-center gap-2">
        <Upload className="h-5 w-5 text-primary" />
        <h2 className="font-heading text-lg font-semibold">Zrzuty ekranu — wgrywanie i edycja</h2>
      </div>
      <div className="flex flex-col gap-4">
        <p className="text-xs text-muted-foreground">
          Wybierz pliki, uzupełnij metadane w kolejce, potem zatwierdź. Przeciągnij karty (lub ↑/↓), żeby ustawić
          kolejność na publicznej galerii.
        </p>

        <div className="flex flex-col gap-2">
          <label className="text-xs uppercase tracking-widest text-muted-foreground">Dodaj nowe zrzuty ekranu</label>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            multiple
            onChange={onFiles}
            className="cursor-pointer text-xs text-muted-foreground file:mr-3 file:rounded-lg file:border-0 file:bg-primary file:px-3 file:py-2 file:text-xs file:font-semibold file:text-primary-foreground"
          />
        </div>

        {pending.length > 0 && (
          <div className="rounded-xl border border-primary/40 bg-primary/5 p-4">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm font-semibold text-primary">
                Kolejka uploadu ({pending.length}) — ustaw metadane przed dodaniem
              </p>
              <div className="flex gap-2">
                <button onClick={() => setPending([])} className="btn">
                  <X className="h-4 w-4" /> Anuluj wszystkie
                </button>
                <button onClick={commitPending} className="btn btn-primary">
                  <Check className="h-4 w-4" /> Dodaj do galerii
                </button>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {pending.map((s) => (
                <div key={s.id} className="flex flex-col gap-2 rounded-xl border border-border/60 bg-black/40 p-3">
                  <div className="relative overflow-hidden rounded-lg">
                    <img src={s.url} alt={s.title} className="h-36 w-full object-cover" />
                    <button
                      onClick={() => setPending((prev) => prev.filter((p) => p.id !== s.id))}
                      className="absolute right-2 top-2 rounded-full bg-destructive p-1.5 text-destructive-foreground"
                      title="Usuń z kolejki"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                    {s.tooLarge && (
                      <span className="absolute bottom-2 left-2 rounded bg-amber-500/90 px-2 py-0.5 text-[10px] font-bold text-black">
                        &gt; 5 MB
                      </span>
                    )}
                  </div>
                  <p className="truncate text-[10px] text-muted-foreground">{s.fileName}</p>
                  <ScreenshotMetaFields
                    value={s}
                    onChange={(patch) =>
                      setPending((prev) => prev.map((p) => (p.id === s.id ? { ...p, ...patch } : p)))
                    }
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-2 border-b border-border/40 pb-2">
          <button onClick={() => setTab("gallery")} className={`btn ${tab === "gallery" ? "btn-primary" : ""}`}>
            Galeria ({gallery.length})
          </button>
          <button onClick={() => setTab("hidden")} className={`btn ${tab === "hidden" ? "btn-primary" : ""}`}>
            Ukryte seed ({hiddenSeeds.length})
          </button>
        </div>

        {tab === "gallery" &&
          (gallery.length === 0 ? (
            <p className="text-xs text-muted-foreground">Galeria pusta.</p>
          ) : (
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
              <SortableContext items={orderIds} strategy={rectSortingStrategy}>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {gallery.map((s) => (
                    <SortableShotCard
                      key={s.id}
                      shot={s}
                      seed={isSeedScreenshot(s.id)}
                      onRemove={() => removeShot(s)}
                      onMoveUp={() => moveBy(s.id, -1)}
                      onMoveDown={() => moveBy(s.id, 1)}
                      onMeta={(patch) =>
                        isSeedScreenshot(s.id) ? patchSeed(s.id, s, patch) : patchUploaded(s.id, patch)
                      }
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          ))}

        {tab === "hidden" &&
          (hiddenSeeds.length === 0 ? (
            <p className="text-xs text-muted-foreground">Brak ukrytych zrzutów seed.</p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {hiddenSeeds.map((s) => (
                <div key={s.id} className="flex flex-col gap-2 rounded-xl border border-border/60 bg-black/40 p-3 opacity-80">
                  <img src={s.url} alt={s.title} className="h-36 w-full rounded-lg object-cover grayscale" />
                  <p className="text-sm font-semibold">{s.title}</p>
                  <button onClick={() => restoreSeed(s.id)} className="btn btn-primary">
                    <Eye className="h-4 w-4" /> Przywróć
                  </button>
                </div>
              ))}
            </div>
          ))}
      </div>
    </section>
  );
}
