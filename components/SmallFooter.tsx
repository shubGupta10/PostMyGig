"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SmallFooter() {
  const pathname = usePathname();
  const currentYear = new Date().getFullYear();

  if (pathname?.includes("/huddle") || pathname?.startsWith("/chat-history")) {
    return null;
  }

  return (
    <footer className="border-t border-border bg-background py-4 px-6 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-medium text-muted-foreground">
        <p>© {currentYear} PostMyGig. All rights reserved.</p>

        <div className="flex items-center gap-6">
          <Link
            href="https://x.com/postmygig"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors flex items-center gap-1.5"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" className="h-3 w-3 fill-current">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 22.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            Follow for updates
          </Link>
          <Link
            href="/feedback"
            className="hover:text-foreground transition-colors"
          >
            Support
          </Link>
        </div>
      </div>
    </footer>
  );
}
