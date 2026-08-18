/**
 * Formats a UTC date string into a human-readable relative time label.
 * e.g. "2025-05-30T18:49:48.847Z" → "Just now", "3m ago", "2h ago", "5d ago", "May 30, 2025"
 */
export function formatTimeAgo(dateString: string): string {
  const now = new Date()
  const date = new Date(dateString)
  const diffMs = now.getTime() - date.getTime()
  const diffMinutes = Math.floor(diffMs / (1000 * 60))

  if (diffMinutes < 1) return "Just now"
  if (diffMinutes < 60) return `${diffMinutes}m ago`

  const diffHours = Math.floor(diffMinutes / 60)
  if (diffHours < 24) return `${diffHours}h ago`

  const diffDays = Math.floor(diffHours / 24)
  if (diffDays < 7) return `${diffDays}d ago`

  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
}

/**
 * Formats a UTC timestamp for chat messages.
 * < 24h → "2:30 PM", < 7d → "Mon", older → "Jan 5"
 */
export function formatTimeStamp(timestamp: string): string {
  const date = new Date(timestamp)
  const now = new Date()
  const diffInHours = Math.abs(now.getTime() - date.getTime()) / (1000 * 60 * 60)

  if (diffInHours < 24) return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  if (diffInHours < 168) return date.toLocaleDateString([], { weekday: "short" })
  return date.toLocaleDateString([], { month: "short", day: "numeric" })
}

/**
 * Returns initials from a full name string (max 2 characters).
 * e.g. "John Doe" → "JD"
 */
export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((word) => word.charAt(0))
    .join("")
    .substring(0, 2)
    .toUpperCase()
}

/**
 * Formats a date string into a long human-readable date.
 * e.g. "2025-05-30T18:49:48.847Z" → "May 30, 2025"
 */
export function formatDate(dateString: string): string {
  if (!dateString) return "Not available"
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric",
  })
}


export function getDateSectionLabel(dateString?: string | Date): string {
  if (!dateString) return "Earlier";
  const date = new Date(dateString);
  const now = new Date();

  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  if (isToday) return "Today";

  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const isYesterday =
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear();

  if (isYesterday) return "Yesterday";

  return date.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }); // e.g. "15 Aug 2026"
}

export function groupItemsByTimeline<T>(
  items: T[],
  getDate: (item: T) => string | Date | undefined
): { label: string; items: T[] }[] {
  const groupsMap = new Map<string, T[]>();

  items.forEach((item) => {
    const label = getDateSectionLabel(getDate(item));
    if (!groupsMap.has(label)) {
      groupsMap.set(label, []);
    }
    groupsMap.get(label)!.push(item);
  });

    return Array.from(groupsMap.entries()).map(([label, items]) => ({
    label,
    items,
  }));
}

export function formatActivityDate(
  dateString?: string | Date,
  prefix: "Updated" | "Posted" | "Applied" = "Updated"
): string {
  if (!dateString) return "";
  const label = getDateSectionLabel(dateString);
  if (label === "Today" || label === "Yesterday") {
    return `${prefix} ${label.toLowerCase()}`;
  }
  return `${prefix} ${label}`;
}
