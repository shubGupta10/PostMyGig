"use client"

import { useSession } from "next-auth/react"
import Link from "next/link"
import { ArrowRight, Search } from "lucide-react"
import { cn } from "@/lib/utils"

export default function Hero() {
  const { data: session } = useSession()
  return (
    <section
      id="#about"
      className="relative min-h-[85vh] flex flex-col items-center justify-center overflow-hidden bg-background py-12 sm:py-20 px-4 sm:px-6"
    >
      {/* Grid Background */}
      <div
        className={cn(
          "absolute inset-0",
          "[background-size:40px_40px]",
          "[background-image:linear-gradient(to_right,#e4e4e7_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e7_1px,transparent_1px)]",
          "dark:[background-image:linear-gradient(to_right,#262626_1px,transparent_1px),linear-gradient(to_bottom,#262626_1px,transparent_1px)]",
        )}
      />
      {/* Radial gradient for the container to give a faded look */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-background [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>

      <div className="relative z-10 w-full max-w-6xl mx-auto space-y-12 sm:space-y-16">

        {/* Headline Section */}
        <div className="text-center space-y-6 sm:space-y-8 max-w-5xl mx-auto px-2">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl xl:text-[4.5rem] font-bold text-accent-foreground leading-tight sm:leading-[1.1] tracking-tight" style={{ fontFamily: "var(--font-serif)" }}>
            <span>Share Gigs You Can't Take,</span> <br className="hidden sm:block" />
            <span className="text-primary block sm:inline-block sm:mt-2">Find Work You Love</span>
          </h1>
          <p className="text-base sm:text-xl font-normal text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Too busy? Quickly post your extra gigs. Need work? Find one fast. Connect instantly via chat or email with zero platform fees.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-4">
            <Link
              href={session ? "/add-gigs" : "/auth/login"}
              className="inline-flex items-center justify-center w-full sm:w-auto h-12 sm:h-14 px-6 sm:px-8 font-semibold text-base sm:text-lg text-primary-foreground bg-primary hover:opacity-90 rounded-xl transition-opacity shadow-sm"
            >
              Start Posting Gigs <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
            <Link
              href="/view-gigs"
              className="inline-flex items-center justify-center w-full sm:w-auto h-12 sm:h-14 px-6 sm:px-8 font-semibold text-base sm:text-lg text-accent-foreground bg-card hover:bg-accent border-2 border-primary rounded-xl transition-colors shadow-sm"
            >
              <Search className="w-5 h-5 mr-2" /> Find Gigs Now
            </Link>
          </div>
        </div>

        {/* Video Demo Section */}
        <div id="demo-video" className="w-full max-w-5xl mx-auto mt-12 sm:mt-24 scroll-mt-24">
          <div className="relative bg-card rounded-2xl shadow-sm border-2 border-border p-2 sm:p-3 overflow-hidden">
            <div className="relative w-full overflow-hidden rounded-xl bg-muted border border-border" style={{ paddingBottom: "56.25%" }}>
              <iframe
                className="absolute top-0 left-0 w-full h-full"
                src="https://www.youtube.com/embed/NrLeJsz3iGg"
                title="PostMyGig Demo Video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                loading="lazy"
              ></iframe>
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}
