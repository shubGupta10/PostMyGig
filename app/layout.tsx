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

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://postmygig.vercel.app"),
  title: "PostMyGig: Share & Find Freelance Projects Free",
  description:
    "List freelance projects, share extra work, or find gigs easily. Connect securely via WhatsApp or email. Built in India, open to all.",
  keywords: [
    "freelance projects",
    "share gigs",
    "find freelance work",
    "India freelancers",
    "secure connections",
  ],
  authors: [
    { name: "Shubham Kumar Gupta", url: "https://x.com/i_m_shubham45" },
  ],
  openGraph: {
    title: "PostMyGig: Share & Find Freelance Projects Free",
    description:
      "Post or find freelance projects with ease. Secure WhatsApp/email connections. Built in India for everyone.",
    url: "https://postmygig.vercel.app",
    siteName: "PostMyGig",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "PostMyGig freelance project platform",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PostMyGig: Share & Find Freelance Projects Free",
    description:
      "List projects, share gigs, or find work. Secure connections via WhatsApp/email. Join now!",
    images: ["/twitter-image.jpg"],
    creator: "@i_m_shubham45",
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