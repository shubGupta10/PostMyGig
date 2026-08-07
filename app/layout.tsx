import { type Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SessionProviderWrapper from "../components/SessionProviderWrapper";
import Footer from "@/components/Footer";
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
import Navbar from "@/components/Navbar";
import { AddGigButton } from "@/components/gigs/AddGigButton";
import { RoleSwitcher } from "@/components/RoleSwitcher";
import { NotificationBell } from "@/components/notification/NotificationBell";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.postmygig.vercel.app"),
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
    url: "https://postmygig.vercel.app",
    siteName: "PostMyGig",
    images: [
      {
        url: "https://postmygig.vercel.app/og-image.png",
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
    images: ["https://postmygig.vercel.app/twitter-image.png"],
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
        <meta
          name="description"
          content="Share freelance gigs you can't take, or find new projects to work on. Easy, free, and direct connections via chat. No middlemen."
        />
        <meta
          name="keywords"
          content="freelance gigs, share freelance work, post freelance projects, find freelance opportunities, gig board for freelancers, collaborate on freelance tasks"
        />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <meta property="og:title" content="PostMyGig – Find & Share Freelance Gigs for Free" />
        <meta property="og:description" content="Post extra freelance work or pick up gigs from others. Direct, fast, and free. No platform fees, no delays." />
        <meta property="og:image" content="https://postmygig.vercel.app/og-image.png" />
        <meta property="og:url" content="https://postmygig.vercel.app" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="PostMyGig – Find & Share Freelance Gigs" />
        <meta name="twitter:description" content="List extra work or find freelance projects easily. Free and direct chat with freelancers. No platform cut." />
        <meta name="twitter:image" content="https://postmygig.vercel.app/twitter-image.png" />
        <meta name="twitter:creator" content="@postmygig" />

        <script type="application/ld+json" dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "PostMyGig",
            "url": "https://www.postmygig.vercel.app",
            "logo": "https://www.postmygig.vercel.app/favicon.ico"
          })
        }} />

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
              <div className="flex min-h-screen flex-col">
                <Navbar />
                <main className="flex-1 flex flex-col pt-20 sm:pt-24">
                  <Analytics />
                  <Suspense>{children}</Suspense>
                  <Toaster />
                </main>
                <Footer />
              </div>
            )}
          </ThemeProvider>
        </SessionProviderWrapper>
      </body>
    </html>
  );
}