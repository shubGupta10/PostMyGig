import { type Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SessionProviderWrapper from "../components/SessionProviderWrapper";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Toaster } from "@/components/ui/sonner";
import { Suspense } from "react";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next"
import { ThemeProvider } from "@/components/theme-provider"
import { SmoothCursor } from "@/components/ui/smooth-cursor";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.postmygig.xyz"),
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
    url: "https://postmygig.xyz",
    siteName: "PostMyGig",
    images: [
      {
        url: "https://postmygig.xyz/og-image.png",
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
    images: ["https://postmygig.xyz/twitter-image.png"],
    creator: "@postmygig",
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-icon.png",
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
        <meta property="og:image" content="https://postmygig.xyz/og-image.png" />
        <meta property="og:url" content="https://postmygig.xyz" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="PostMyGig – Find & Share Freelance Gigs" />
        <meta name="twitter:description" content="List extra work or find freelance projects easily. Free and direct chat with freelancers. No platform cut." />
        <meta name="twitter:image" content="https://postmygig.xyz/twitter-image.png" />
        <meta name="twitter:creator" content="@postmygig" />

        <script type="application/ld+json" dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "PostMyGig",
            "url": "https://www.postmygig.xyz",
            "logo": "https://www.postmygig.xyz/favicon.ico"
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
            <SmoothCursor />
            <Navbar />
            <Analytics />
            <Suspense>{children}</Suspense>
            <Toaster />
            <Footer />
          </ThemeProvider>
        </SessionProviderWrapper>
      </body>
    </html>
  );
}