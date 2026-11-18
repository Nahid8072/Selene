const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const;

export function formatCount(value: number): string {
  return new Intl.NumberFormat("en-US").format(value);
}

export function formatBytes(bytes: number): string {
  const gigabytes = bytes / 1_000_000_000;
  if (gigabytes >= 1) {
    return `${gigabytes.toFixed(1)} GB`;
  }
  return `${Math.round(bytes / 1_000_000)} MB`;
}

export function formatPercent(part: number, whole: number): string {
  if (whole <= 0) {
    return "0%";
  }
  return `${((part / whole) * 100).toFixed(1)}%`;
}

export function formatUtc(iso: string): string {
  const date = new Date(iso);
  const day = String(date.getUTCDate()).padStart(2, "0");
  const month = MONTHS[date.getUTCMonth()];
  const year = date.getUTCFullYear();
  const hours = String(date.getUTCHours()).padStart(2, "0");
  const minutes = String(date.getUTCMinutes()).padStart(2, "0");
  return `${day} ${month} ${year}, ${hours}:${minutes} UTC`;
}

export function formatUtcCompact(iso: string): string {
  const date = new Date(iso);
  const day = String(date.getUTCDate()).padStart(2, "0");
  const month = MONTHS[date.getUTCMonth()];
  const hours = String(date.getUTCHours()).padStart(2, "0");
  const minutes = String(date.getUTCMinutes()).padStart(2, "0");
  return `${day} ${month}, ${hours}:${minutes}`;
}
