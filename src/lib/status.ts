export const STALE_AFTER_S = 180;

export type ServiceStatus = { name: string; state: 'up' | 'down'; uptime: string | null };
export type StatusPayload = {
  generatedAt: number;
  host: { load1: number; mem_used_pct: number; uptime_s: number };
  services: ServiceStatus[];
};

/** True when the file is older than STALE_AFTER_S. `generatedAt` is Unix seconds, `nowMs` is Date.now(). */
export function isStale(generatedAt: number, nowMs: number): boolean {
  return nowMs / 1000 - generatedAt > STALE_AFTER_S;
}

const num = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v);

/** Returns the payload if it has the expected shape, otherwise null. */
export function parseStatus(data: unknown): StatusPayload | null {
  if (typeof data !== 'object' || data === null) return null;
  const d = data as Record<string, any>;
  if (!num(d.generatedAt)) return null;
  const h = d.host;
  if (typeof h !== 'object' || h === null || !num(h.load1) || !num(h.mem_used_pct) || !num(h.uptime_s)) return null;
  if (!Array.isArray(d.services)) return null;
  for (const s of d.services) {
    if (typeof s !== 'object' || s === null) return null;
    if (typeof s.name !== 'string') return null;
    if (s.state !== 'up' && s.state !== 'down') return null;
    if (s.uptime !== null && typeof s.uptime !== 'string') return null;
  }
  return {
    generatedAt: d.generatedAt,
    host: { load1: h.load1, mem_used_pct: h.mem_used_pct, uptime_s: h.uptime_s },
    services: d.services.map((s: ServiceStatus) => ({ name: s.name, state: s.state, uptime: s.uptime })),
  };
}

/** "45 s", "5 min", "3 h", "2 days" */
export function formatAgo(seconds: number): string {
  const s = Math.max(0, Math.round(seconds));
  if (s < 60) return `${s} s`;
  if (s < 3600) return `${Math.floor(s / 60)} min`;
  if (s < 86400) return `${Math.floor(s / 3600)} h`;
  const d = Math.floor(s / 86400);
  return `${d} ${d === 1 ? 'day' : 'days'}`;
}
