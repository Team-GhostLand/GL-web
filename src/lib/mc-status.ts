export type McStatus = {
  online: boolean;
  players?: { online: number; max: number };
  motd?: string;
  version?: string;
  source?: "status.json";
};

export type GhostlandStatusJson = {
  updated_at?: string;
  timestamp?: number;
  node_name?: string;
  server?: {
    online?: boolean;
    cpu_pct?: number;
    ram_pct?: number;
    temp_c?: number;
    gpu_pct?: number;
    docker_mc?: string;
  };
  minecraft?: {
    status?: string;
    container_running?: boolean;
    active_instance?: string | null;
    active_instance_name?: string | null;
    active_world?: string | null;
    players_online?: number;
    players_max?: number;
    version?: string;
    motd?: string;
    server_icon?: {
      exists?: boolean;
      url?: string | null;
    };
    worlds?: string[];
    instances?: string[];
  };
};

let cache: { key: string; ts: number; data: McStatus } | null = null;
const TTL = 8_000;

export async function fetchMcStatus(bypassCache: boolean = false): Promise<McStatus> {
  const now = Date.now();
  const cacheKey = "default";
  if (!bypassCache && cache && cache.key === cacheKey && now - cache.ts < TTL) {
    return cache.data;
  }

  try {
    const res = await fetch(`/status.json?t=${now}`, { cache: "no-store" });
    if (res.ok) {
      const json: GhostlandStatusJson = await res.json();
      if (json && (json.minecraft || json.server)) {
        const mcStatusStr = (json.minecraft?.status || "").toUpperCase();
        const containerRunning = json.minecraft?.container_running === true;
        const isOnline = mcStatusStr === "ONLINE" || containerRunning;

        const data: McStatus = {
          online: isOnline,
          players: {
            online: json.minecraft?.players_online ?? 0,
            max: json.minecraft?.players_max ?? 0,
          },
          motd: json.minecraft?.motd,
          version: json.minecraft?.version,
          source: "status.json",
        };
        cache = { key: cacheKey, ts: now, data };
        return data;
      }
    }
  } catch {
    // ignore
  }

  const data: McStatus = { online: false, source: "status.json" };
  cache = { key: cacheKey, ts: now, data };
  return data;
}