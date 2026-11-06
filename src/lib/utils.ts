import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { formatDistanceToNowStrict, differenceInDays, format } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

export function formatRelative(date: Date | string) {
  return formatDistanceToNowStrict(new Date(date), { addSuffix: true });
}

export function journeyDayNumber(
  startDate: Date | string,
  at: Date | string = new Date()
) {
  return Math.max(1, differenceInDays(new Date(at), new Date(startDate)) + 1);
}

export function formatJourneyDay(
  startDate: Date | string,
  at: Date | string = new Date()
) {
  return `Day ${journeyDayNumber(startDate, at)}`;
}

export function formatJourneyDuration(startDate: Date | string) {
  const days = journeyDayNumber(startDate);
  if (days < 7) return `${days} day${days === 1 ? "" : "s"}`;
  if (days < 30) {
    const weeks = Math.floor(days / 7);
    return `${weeks} week${weeks === 1 ? "" : "s"}`;
  }
  const months = Math.floor(days / 30);
  return `${months} month${months === 1 ? "" : "s"}`;
}

export function formatDate(date: Date | string) {
  return format(new Date(date), "MMM d, yyyy");
}

/** Editorial short date, e.g. 13/09 */
export function formatShortDate(date: Date | string) {
  return format(new Date(date), "dd/MM");
}

export function categoryHashtag(category: string) {
  const label = CATEGORY_LABELS[category] ?? category;
  return `#${label.replace(/\s+/g, "")}`;
}

export function formatCompactCount(n: number) {
  if (n < 1000) return String(n);
  if (n < 10000) return `${(n / 1000).toFixed(1).replace(/\.0$/, "")}k`;
  return `${Math.round(n / 1000)}k`;
}

export function firstLine(text: string, max = 72) {
  const line = text.split(/\n+/)[0]?.trim() ?? "";
  if (line.length <= max) return line;
  return `${line.slice(0, max - 1).trimEnd()}…`;
}

export function displayName(name: string) {
  return name.split(" ")[0] || name;
}

export const CATEGORY_LABELS: Record<string, string> = {
  FITNESS: "Fitness & Health",
  LEARNING: "Learning",
  CAREER: "Career",
  TRAVEL: "Travel",
  CREATIVITY: "Creativity",
  PERSONAL_GROWTH: "Personal Growth",
  LIFESTYLE: "Lifestyle",
  BUILDING: "Building",
  OTHER: "Other",
};

/** Shorter labels for Discover filter chips */
export const DISCOVER_CATEGORY_CHIPS: Array<{
  value: string;
  label: string;
}> = [
  { value: "ALL", label: "All" },
  { value: "FITNESS", label: "Fitness" },
  { value: "LEARNING", label: "Learning" },
  { value: "CAREER", label: "Career" },
  { value: "BUILDING", label: "Building" },
  { value: "CREATIVITY", label: "Creativity" },
  { value: "TRAVEL", label: "Travel" },
  { value: "PERSONAL_GROWTH", label: "Personal Growth" },
  { value: "LIFESTYLE", label: "Lifestyle" },
];

export const STATUS_LABELS: Record<string, string> = {
  ACTIVE: "Active",
  PAUSED: "Paused",
  COMPLETED: "Completed",
  DRAFT: "Draft",
};

export const CATEGORIES = Object.keys(CATEGORY_LABELS) as Array<
  keyof typeof CATEGORY_LABELS
>;
