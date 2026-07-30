import { useEffect, useState, useCallback } from "react";
import { useAdminSettings } from "@/lib/settings";
import { useI18n } from "@/lib/i18n";
import { fetchMcStatus, type McStatus } from "@/lib/mc-status";
import { cn } from "@/lib/utils";
import { RotateCw } from "lucide-react";

export function StatusBadge({ className }: { className?: string }) {
  const settings = useAdminSettings();
  const { t } = useI18n();
  const [live, setLive] = useState<McStatus | null>(null);
  const [loading, setLoading] = useState(false);

  const loadStatus = useCallback(async (bypassCache = false) => {
    if (settings.statusMode !== "auto") return;
    setLoading(true);
    try {
      const data = await fetchMcStatus(bypassCache);
      setLive(data);
    } finally {
      setLoading(false);
    }
  }, [settings.statusMode]);

  useEffect(() => {
    if (settings.statusMode !== "auto") return;
    loadStatus(false);
    const id = window.setInterval(() => loadStatus(false), 10_000);
    return () => window.clearInterval(id);
  }, [loadStatus, settings.statusMode]);

  let color = "text-muted-foreground";
  let dot = "bg-muted-foreground";
  let text: string = t("status.checking");

  if (settings.statusMode === "online" || (settings.statusMode === "auto" && live?.online)) {
    color = "text-emerald-300";
    dot = "bg-emerald-400";
    text =
      settings.statusMode === "auto" && live?.players && live?.instance && live?.version
        ? `${live.players.online}/${live.players.max} ${t("status.players")} | ${live.instance} (${live.version})`
        : t("status.online");
  } else if (settings.statusMode === "maintenance") {
    color = "text-amber-300";
    dot = "bg-amber-400";
    text = t("status.maintenance");
  } else if (settings.statusMode === "offline" || (settings.statusMode === "auto" && live && !live.online)) {
    color = "text-red-300";
    dot = "bg-red-400";
    text = t("status.offline");
  } else if (settings.statusMode === "started") {
    color = "text-primary";
    dot = "bg-primary";
    text = t("status.started");
  }

  return (
    <div
      className={cn(
        "glass inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium",
        color,
        className,
      )}
    >
      <span className={cn("h-2 w-2 rounded-full animate-pulse-dot", dot)} />
      <span className="whitespace-nowrap">{text}</span>
      {settings.statusMode === "auto" && (
        <button
          type="button"
          onClick={() => loadStatus(true)}
          className="ml-1 opacity-70 transition-opacity hover:opacity-100 focus:outline-none"
          title="Odśwież status"
        >
          <RotateCw className={cn("h-3 w-3", loading && "animate-spin")} />
        </button>
      )}
    </div>
  );
}