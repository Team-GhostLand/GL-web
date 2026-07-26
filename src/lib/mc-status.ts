export type McStatus = {
  online: boolean;
  players?: { online: number; max: number };
  motd?: string;
};

let cache: { host: string; ts: number; data: McStatus } | null = null;
const TTL = 30_000;

export async function fetchMcStatus(host: string): Promise<McStatus> {
  if (!host) return { online: false };
  const now = Date.now();
  if (cache && cache.host === host && now - cache.ts < TTL) return cache.data;
  try {
    const res = await fetch(`https://api.mcsrvstat.us/3/${encodeURIComponent(host)}`);
    if (!res.ok) throw new Error(String(res.status));
    const json = await res.json();
    const data: McStatus = {
      online: !!json.online,
      players: json.players ? { online: json.players.online ?? 0, max: json.players.max ?? 0 } : undefined,
      motd: Array.isArray(json.motd?.clean) ? json.motd.clean.join(" ") : undefined,
    };
    cache = { host, ts: now, data };
    return data;
  } catch {
    return { online: false };
  }
}