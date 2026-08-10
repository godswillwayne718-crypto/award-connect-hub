/**
 * Timestamp helpers for the chat module. All formatting is pinned to UTC so
 * server-rendered markup matches the client and never triggers a hydration
 * mismatch.
 */
const time = new Intl.DateTimeFormat("en-GB", {
  hour: "2-digit",
  minute: "2-digit",
  hour12: true,
  timeZone: "UTC",
});

const weekday = new Intl.DateTimeFormat("en-GB", { weekday: "short", timeZone: "UTC" });

const fullDate = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

const dayLabel = new Intl.DateTimeFormat("en-GB", {
  weekday: "long",
  day: "numeric",
  month: "long",
  timeZone: "UTC",
});

function dayKey(d: Date) {
  return `${d.getUTCFullYear()}-${d.getUTCMonth()}-${d.getUTCDate()}`;
}

/** Compact stamp for inbox rows: time today, weekday this week, else a date. */
export function formatChatStamp(iso: string, now = new Date()): string {
  const d = new Date(iso);
  if (dayKey(d) === dayKey(now)) return time.format(d);
  const days = (now.getTime() - d.getTime()) / 86_400_000;
  if (days < 7) return weekday.format(d);
  return fullDate.format(d);
}

/** Message bubble time. */
export function formatMessageTime(iso: string): string {
  return time.format(new Date(iso));
}

/** Date separator label inside a conversation. */
export function formatDaySeparator(iso: string, now = new Date()): string {
  const d = new Date(iso);
  if (dayKey(d) === dayKey(now)) return "Today";
  const yesterday = new Date(now.getTime() - 86_400_000);
  if (dayKey(d) === dayKey(yesterday)) return "Yesterday";
  return dayLabel.format(d);
}

export function isSameDay(a: string, b: string): boolean {
  return dayKey(new Date(a)) === dayKey(new Date(b));
}
