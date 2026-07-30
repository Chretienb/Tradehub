import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Vendor/company initials for the avatar fallback — computed here instead
// of stored, since it's fully derived from the name.
// French relative-time label, matching the shape mock data hardcoded
// ("il y a 2 heures") but computed from a real timestamp.
export function formatRelativeTime(dateString: string): string {
  const diffMs = Date.now() - new Date(dateString).getTime();
  const diffSec = Math.max(0, Math.floor(diffMs / 1000));
  if (diffSec < 60) return "à l'instant";
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `il y a ${diffMin} minute${diffMin > 1 ? "s" : ""}`;
  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `il y a ${diffHour} heure${diffHour > 1 ? "s" : ""}`;
  const diffDay = Math.floor(diffHour / 24);
  if (diffDay < 7) return `il y a ${diffDay} jour${diffDay > 1 ? "s" : ""}`;
  const diffWeek = Math.floor(diffDay / 7);
  if (diffWeek < 5) return `il y a ${diffWeek} semaine${diffWeek > 1 ? "s" : ""}`;
  const diffMonth = Math.floor(diffDay / 30);
  if (diffMonth < 12) return `il y a ${diffMonth} mois`;
  const diffYear = Math.floor(diffDay / 365);
  return `il y a ${diffYear} an${diffYear > 1 ? "s" : ""}`;
}

// Without generated Database types, the Supabase client can't tell a
// to-one embedded relation from a to-many one, so it types every embed as
// an array. This unwraps either shape to a single row.
export function unwrapOne<T>(value: T | T[] | null | undefined): T | null {
  if (Array.isArray(value)) return value[0] ?? null;
  return value ?? null;
}

export function getInitials(name: string) {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "?";
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[words.length - 1][0]).toUpperCase();
}
