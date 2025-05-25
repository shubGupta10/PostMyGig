import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SessionProviderWrapper from "../components/SessionProviderWrapper";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Toaster } from "@/components/ui/sonner"
import { Suspense } from 'react'

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
  description: "List freelance projects, share extra work, or find gigs easily. Connect securely via WhatsApp or email. Built in India, open to all.",
  keywords: ["freelance projects", "share gigs", "find freelance work", "India freelancers", "secure connections"],
  authors: [{ name: "Shubham Kumar Gupta", url: "https://x.com/your-username" }],
  openGraph: {
    title: "PostMyGig: Share & Find Freelance Projects Free",
    description: "Post or find freelance projects with ease. Secure WhatsApp/email connections. Built in India for everyone.",
    url: "https://www.postmygig.vercel.app", // Replace with your domain
    siteName: "PostMyGig",
    images: [
      {
        url: "/og-image.jpg", // Add a 1200x630 image in /public
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
    description: "List projects, share gigs, or find work. Secure connections via WhatsApp/email. Join now!",
    images: ["/twitter-image.jpg"], // Add a 1200x627 image in /public
    creator: "@i_m_shubham45", 
  },
  icons: {
    icon: "/favicon.ico", // Add favicon in /public
    apple: "/apple-icon.png", // Add 180x180 icon for Apple devices
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SessionProviderWrapper>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <Navbar />
          <Suspense>
          {children}
          </Suspense>
          <Toaster />
          <Footer />
        </body>
      </html>
    </SessionProviderWrapper>
  );
}
