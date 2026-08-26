"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { ArrowRight, Search, Play, Share2, Eye } from "lucide-react"
import { cn } from "@/lib/utils"

const MOCKUP_GIGS = [
  {
    time: "Posted 2h ago",
    title: "Full Stack SaaS Developer",
    description: "Looking for a skilled developer to build a subscription-based SaaS dashboard. The platform will allow users to manage subscriptions...",
    skills: ["react", "nextjs", "nodejs", "+4 more"],
  },
  {
    time: "Posted Jan 30, 2026",
    title: "Advertise for TELUS on your vehicle",
    description: "We are excited to share an opportunity for you to earn up to $280 weekly by participating in the TELUS Vehicle Ad campaign...",
    skills: ["driving license"],
  },
  {
    time: "Posted 5h ago",
    title: "UI/UX Mobile App Designer",
    description: "Need an experienced UI/UX designer to craft a modern iOS and Android mobile app interface for a freelance marketplace...",
    skills: ["figma", "mobile design", "tailwind", "+2 more"],
  },
  {
    time: "Posted 1d ago",
    title: "Python Data Scraping Script",
    description: "Build a robust Python script to extract daily real estate listings from multiple public sources and structure them into JSON...",
    skills: ["python", "beautifulsoup", "automation"],
  },
  {
    time: "Posted 2d ago",
    title: "AI Agent Integration Specialist",
    description: "Integrate custom OpenAI Assistant API and LangChain agents into an existing Next.js web app with streaming chat responses...",
    skills: ["openai", "langchain", "nextjs", "python"],
  },
  {
    time: "Posted 3d ago",
    title: "Shopify Store Customization",
    description: "Customize Liquid templates and implement custom cart drawer and bundle upsells for a high-converting e-commerce brand...",
    skills: ["shopify", "liquid", "javascript"],
  },
];

export default function Hero() {
  const { data: session } = useSession()
  const [isPlaying, setIsPlaying] = useState(false)

  return (
    <section
      id="#about"
      className="relative min-h-[85vh] flex flex-col items-center justify-center overflow-hidden bg-background py-12 sm:py-20 px-4 sm:px-6"
    >
      {/* Ambient Top Glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(100,74,64,0.10),transparent)] dark:bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(255,224,194,0.08),transparent)]" />

      {/* Grid Background */}
      <div
        className={cn(
          "absolute inset-0",
          "[background-size:40px_40px]",
          "[background-image:linear-gradient(to_right,rgba(0,0,0,0.07)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.07)_1px,transparent_1px)]",
          "dark:[background-image:linear-gradient(to_right,rgba(255,255,255,0.07)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.07)_1px,transparent_1px)]",
        )}
      />
      {/* Radial gradient mask to fade grid edges */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-background [mask-image:radial-gradient(ellipse_at_center,transparent_25%,black)]"></div>

      <div className="relative z-10 w-full max-w-6xl mx-auto space-y-12 sm:space-y-16">

        {/* Headline Section */}
        <div className="text-center space-y-6 sm:space-y-8 max-w-5xl mx-auto px-2">
          <h1 className="text-balance text-3xl sm:text-5xl lg:text-6xl xl:text-[4.5rem] font-bold text-accent-foreground leading-tight sm:leading-[1.1] tracking-tight" style={{ fontFamily: "var(--font-serif)" }}>
            <span>Share Gigs <br className="block sm:hidden" /> You Can't Take,</span> <br className="hidden sm:block" />
            <span className="text-primary block sm:inline-block sm:mt-2">Find Work You Love</span>
          </h1>
          <p className="text-base sm:text-xl font-normal text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Too busy? Share your extra gigs. Need work? Find gigs from other freelancers. Connect instantly via chat or WhatsApp with zero platform fees.
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
            <div className="relative w-full overflow-hidden rounded-xl bg-[#111111] border border-border" style={{ paddingBottom: "56.25%" }}>
              {!isPlaying ? (
                <div
                  onClick={() => setIsPlaying(true)}
                  className="absolute inset-0 cursor-pointer group p-3 sm:p-4 overflow-hidden select-none bg-[#111111]"
                >
                  {/* Search & Filter Bar Mockup */}
                  <div className="w-full space-y-2 sm:space-y-2.5 opacity-90 transition-opacity group-hover:opacity-100 scale-[0.80] sm:scale-95 md:scale-100 origin-top">
                    <div className="w-full rounded-xl border border-[#262626] bg-[#191919] px-3 sm:px-4 py-1.5 sm:py-2 flex items-center gap-2 sm:gap-3 text-xs text-[#b4b4b4]">
                      <Search className="w-3.5 h-3.5 text-[#b4b4b4]" />
                      <span className="truncate">Search gigs by title, skills, or description...</span>
                    </div>

                    <div className="flex items-center justify-between text-[10px] sm:text-xs">
                      <div className="px-2.5 py-1 rounded-lg border border-[#262626] bg-[#191919] text-[#eeeeee] font-medium flex items-center gap-1">
                        <span>All Skills</span>
                        <span className="opacity-60">▾</span>
                      </div>
                      <div className="px-2.5 py-1 rounded-lg border border-[#262626] bg-[#191919] text-[#eeeeee] font-medium flex items-center gap-1">
                        <span>Newest First</span>
                        <span className="opacity-60">▾</span>
                      </div>
                    </div>

                    {/* Mockup Gigs Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 sm:gap-3 pt-0.5">
                      {MOCKUP_GIGS.map((gig, idx) => (
                        <div
                          key={idx}
                          className="bg-[#191919] border border-[#262626] rounded-2xl p-2.5 sm:p-3 flex flex-col justify-between space-y-2 shadow-sm text-left"
                        >
                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between text-[9px] sm:text-[10px] text-[#b4b4b4]">
                              <span className="px-1.5 py-0.5 rounded bg-[#222222] font-medium">{gig.time}</span>
                              <Share2 className="w-3 h-3 text-[#b4b4b4]" />
                            </div>

                            <h2 className="text-xs font-bold text-[#eeeeee] line-clamp-1 leading-snug">
                              {gig.title}
                            </h2>

                            <p className="text-[10px] sm:text-[11px] text-[#b4b4b4] line-clamp-2 leading-tight">
                              {gig.description}
                            </p>
                          </div>

                          <div className="space-y-1.5 pt-0.5">
                            <div className="space-y-0.5">
                              <span className="text-[8px] sm:text-[9px] font-bold text-[#888888] uppercase tracking-wider">Required Skills</span>
                              <div className="flex flex-wrap gap-1">
                                {gig.skills.map((skill, sIdx) => (
                                  <span key={sIdx} className="px-1.5 py-0.5 rounded-full bg-[#262626] text-[9px] sm:text-[10px] text-[#eeeeee] font-medium">
                                    {skill}
                                  </span>
                                ))}
                              </div>
                            </div>

                            <div className="w-full bg-[#ffdfb5] text-[#202020] font-semibold text-[11px] py-1 rounded-xl flex items-center justify-center gap-1 shadow-sm">
                              <Eye className="w-3 h-3" />
                              <span>View Details</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 bg-black/45 group-hover:bg-black/30 transition-colors flex flex-col items-center justify-center z-20">
                    <div className="w-14 h-14 sm:w-18 sm:h-18 bg-primary text-primary-foreground rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                      <Play className="w-7 h-7 sm:w-9 sm:h-9 ml-1 fill-current" />
                    </div>
                    <span className="mt-2.5 text-xs sm:text-sm font-bold text-white tracking-wide bg-black/70 px-3.5 py-1 rounded-full backdrop-blur-sm border border-white/10">
                      Watch Demo Video
                    </span>
                  </div>
                </div>
              ) : (
                <iframe
                  className="absolute top-0 left-0 w-full h-full"
                  src="https://www.youtube.com/embed/NrLeJsz3iGg?autoplay=1"
                  title="PostMyGig Demo Video"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              )}
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}
