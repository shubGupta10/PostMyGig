import { type Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SessionProviderWrapper from "../components/SessionProviderWrapper";
import SmallFooter from "@/components/SmallFooter";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BackendWarmer } from "@/components/BackendWarmer";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { HeaderTitle } from "@/components/header-title";
import { DarkModeToggle } from "@/components/DarkModeToggle";
import { Toaster } from "@/components/ui/sonner";
import { Suspense } from "react";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next"
import { ThemeProvider } from "@/components/theme-provider"
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/options";
import { AddGigButton } from "@/components/gigs/AddGigButton";
import { RoleSwitcher } from "@/components/RoleSwitcher";
import { NotificationBell } from "@/components/notification/NotificationBell";
import { PublicLayoutWrapper } from "@/components/PublicLayoutWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import { getBaseUrl } from "@/lib/social-preview";

const baseUrl = getBaseUrl();
const siteOgImage = `${baseUrl}/api/og?title=PostMyGig&type=site&badge=PostMyGig&description=Freelance%20gigs%2C%20direct%20chat%2C%20and%20fast%20hiring.`;

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: "PostMyGig – Find & Share Freelance Gigs for Free",
  description:
    "Share freelance gigs you can't take, or find new projects to work on. Easy, free, and direct connections via chat. No middlemen.",
  keywords: [
    "freelance gigs",
    "share freelance work",
    "post freelance projects",
    "find freelance opportunities",
    "gig board for freelancers",
    "collaborate on freelance tasks",
  ],
  authors: [
    { name: "Shubham Kumar Gupta", url: "https://x.com/i_m_shubham45" },
  ],
  openGraph: {
    title: "PostMyGig – Find & Share Freelance Gigs",
    description:
      "Post extra freelance work or pick up gigs from others. Direct, fast, and free. No platform fees, no delays.",
    url: baseUrl,
    siteName: "PostMyGig",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "PostMyGig – Freelance Gig Sharing Platform",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PostMyGig – Find & Share Freelance Gigs",
    description:
      "List extra work or find freelance projects easily. Free and direct chat with freelancers. No platform cut.",
    images: ["/og-image.png"],
    creator: "@postmygig",
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-icon.png",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);
  const inNotOnboarded = session?.user && !session.user.onboardingCompleted;

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "PostMyGig",
              "url": baseUrl,
              "logo": `${baseUrl}/favicon.ico`,
            }),
          }}
        />

        <Script
          src="https://cloud.umami.is/script.js"
          data-website-id="ba1af766-a1bd-4d64-8c20-66cddf7ac5e5"
          strategy="lazyOnload"
        />
      </head>

      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionProviderWrapper>
          <ThemeProvider
            attribute='class'
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {inNotOnboarded ? (
              <div className="min-h-screen bg-background flex flex-col justify-center items-center p-6">
                <BackendWarmer />
                <Analytics />
                <Suspense>{children}</Suspense>
                <Toaster />
              </div>
            ) : session ? (
              <TooltipProvider>
                <BackendWarmer />
                <SidebarProvider>
                  <AppSidebar />
                  <SidebarInset>
                    <header className="flex h-16 shrink-0 items-center justify-between border-b border-border px-3 sm:px-4">
                      <div className="flex items-center gap-2 sm:gap-4 min-w-0">
                        <SidebarTrigger />
                        <HeaderTitle />
                      </div>
                      <div className="flex items-center gap-2 sm:gap-4 shrink-0">
                        <AddGigButton />
                        <RoleSwitcher />
                        <DarkModeToggle />
                        <NotificationBell />
                      </div>
                    </header>
                    <main className="flex-1 flex flex-col">
                      <Analytics />
                      <Suspense>{children}</Suspense>
                      <Toaster />
                    </main>
                    <SmallFooter />
                  </SidebarInset>
                </SidebarProvider>
              </TooltipProvider>
            ) : (
              <PublicLayoutWrapper>
                <Analytics />
                <Suspense>{children}</Suspense>
                <Toaster />
              </PublicLayoutWrapper>
            )}
          </ThemeProvider>
        </SessionProviderWrapper>
      </body>
    </html>
  );
}