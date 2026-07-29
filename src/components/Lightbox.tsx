import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import { X, Calendar, Tag } from "lucide-react";

export function Lightbox({
  src,
  alt,
  category,
  description,
  date,
  edition,
  tags,
  onClose,
}: {
  src: string | null;
  alt?: string;
  category?: string;
  description?: string;
  date?: string;
  edition?: number;
  tags?: string[];
  onClose: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <AnimatePresence>
      {src && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <button
            onClick={onClose}
            className="absolute right-4 top-4 z-10 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
            aria-label="Zamknij"
          >
            <X className="h-5 w-5" />
          </button>
          <div
            className="flex max-h-[92vh] max-w-[95vw] flex-col items-center gap-3 overflow-hidden rounded-2xl border border-border/40 bg-black/70 p-3 shadow-2xl glass"
            onClick={(e) => e.stopPropagation()}
          >
            <motion.img
              src={src}
              alt={alt ?? ""}
              className="max-h-[75vh] max-w-full rounded-lg object-contain"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 24 }}
            />
            <div className="flex w-full flex-col gap-1 px-3 py-1">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="font-heading text-lg font-bold text-foreground">{alt}</h3>
                <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                  {category && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-primary/20 px-2.5 py-0.5 font-medium text-primary">
                      <Tag className="h-3 w-3" /> {category}
                    </span>
                  )}
                  {edition != null && (
                    <span className="rounded-full bg-accent/20 px-2.5 py-0.5 font-bold text-accent-foreground">
                      ED. {edition}
                    </span>
                  )}
                  {date && (
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="h-3 w-3" /> {date}
                    </span>
                  )}
                </div>
              </div>
              {description && <p className="text-xs text-muted-foreground">{description}</p>}
              {tags && tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {tags.map((t) => (
                    <span key={t} className="rounded bg-muted/40 px-2 py-0.5 text-[10px] text-muted-foreground">
                      #{t}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}