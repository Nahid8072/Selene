export function unavailable(): string {
  return "Unavailable";
}

export function formatWhen(value: string | null | undefined): string {
  if (!value) return unavailable();
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return unavailable();
  return new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "medium" }).format(date);
}

export function formatDuration(start: string | null, end: string | null): string {
  if (!start || !end) return unavailable();
  const ms = new Date(end).getTime() - new Date(start).getTime();
  if (!Number.isFinite(ms) || ms < 0) return unavailable();
  if (ms < 1000) return `${ms} ms`;
  return `${(ms / 1000).toFixed(2)} s`;
}

export function formatMillis(value: number | null | undefined): string {
  if (value == null || !Number.isFinite(value)) return unavailable();
  if (Math.abs(value) < 1000) return `${value.toFixed(value < 100 ? 1 : 0)} ms`;
  return `${(value / 1000).toFixed(2)} s`;
}

export function formatRate(value: number | null): string {
  if (value == null || !Number.isFinite(value)) return unavailable();
  return `${value.toFixed(3)} /s`;
}

export function numberOrNull(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

export function shortenIdentifier(value: string): string {
  if (value.length <= 16) return value;
  return `${value.slice(0, 8)}...${value.slice(-4)}`;
}

export function armLabel(arm: string): string {
  if (arm === "standard_git") return "Standard Git";
  if (arm === "optimized_git") return "Optimized Git";
  if (arm === "selene") return "Selene";
  return arm;
}
