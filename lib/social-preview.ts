export interface SocialImageOptions {
  title: string;
  description?: string;
  badge?: string;
  type?: "site" | "gig" | "profile";
}

export const DEFAULT_ORIGIN = "https://postmygig.vercel.app";

export function getBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_LIVE_URL && !process.env.NEXT_PUBLIC_LIVE_URL.includes("localhost")) {
    return process.env.NEXT_PUBLIC_LIVE_URL.replace(/\/$/, "");
  }
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return DEFAULT_ORIGIN;
}

function clampText(value: string, maxLength: number) {
  if (!value) return "";
  if (value.length <= maxLength) return value;
  return `${value.slice(0, Math.max(0, maxLength - 1)).trimEnd()}…`;
}

export function buildSocialImageUrl({
  title,
  description = "Freelance gigs, direct chat, and fast hiring.",
  badge = "PostMyGig",
  type = "gig",
}: SocialImageOptions) {
  const origin = getBaseUrl();
  const params = new URLSearchParams({
    title: clampText(title, 52),
    description: clampText(description, 120),
    badge: clampText(badge, 25),
    type,
  });

  return `${origin}/api/og?${params.toString()}`;
}
