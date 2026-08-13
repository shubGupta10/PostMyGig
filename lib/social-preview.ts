export interface SocialImageOptions {
  title: string;
  description?: string;
  badge?: string;
  type?: "site" | "gig";
}

const DEFAULT_ORIGIN = "https://www.postmygig.vercel.app";

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
  const origin = process.env.NEXT_PUBLIC_LIVE_URL || DEFAULT_ORIGIN;
  const params = new URLSearchParams({
    title: clampText(title, 52),
    description: clampText(description, 120),
    badge: clampText(badge, 25),
    type,
  });

  return new URL(`/api/og?${params.toString()}`, origin).toString();
}
