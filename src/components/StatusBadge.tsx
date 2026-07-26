import { useEffect, useState } from "react";
import { useAdminSettings } from "@/lib/admin-settings";
import { useI18n } from "@/lib/i18n";
import { fetchMcStatus, type McStatus } from "@/lib/mc-status";
import { cn } from "@/lib/utils";

export function StatusBadge({ className }: { className?: string }) {
  const { settings } = useAdminSettings();
  const { t } = useI18n();
  const [live, setLive] = useState<McStatus | null>(null);

  useEffect(() => {
    let cancelled = false;
    if (settings.statusMode !== "auto") return;
    const load = async () => {
      const data = await fetchMcStatus(settings.mcHost);
      if (!cancelled) setLive(data);
    };
    load();
    const id = window.setInterval(load, 30_000);
    return () => {
      cancelled = true;
      window.clearInterval(id);
    };
  }, [settings.mcHost, settings.statusMode]);

  let color = "text-muted-foreground";
  let dot = "bg-muted-foreground";
  let text: string = t("status.checking");

  if (settings.statusMode === "online" || (settings.statusMode === "auto" && live?.online)) {
    color = "text-emerald-300";
    dot = "bg-emerald-400";
    text =
      settings.statusMode === "auto" && live?.players
        ? `${live.players.online}/${live.players.max} ${t("status.players")}`
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
      title={settings.mcHost}
    >
      <span className={cn("h-2 w-2 rounded-full animate-pulse-dot", dot)} />
      <span className="whitespace-nowrap">{text}</span>
    </div>
  );
}