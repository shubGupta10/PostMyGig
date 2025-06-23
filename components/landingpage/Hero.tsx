"use client"

import { useSession } from "next-auth/react"
import Link from "next/link"
import { cn } from "@/lib/utils"

function Hero() {
  const { data: session } = useSession()
  return (
    <section
      id="#about"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background"
    >
      {/* Simple Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-primary/10" />
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

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
          {/* Content Section */}
          <div className="text-center lg:text-left space-y-6 sm:space-y-8">
            {/* Trust Signal */}
            <div className="inline-flex items-center space-x-2 bg-card/80 backdrop-blur-sm rounded-full px-3 sm:px-4 py-2 border border-primary/20">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
              <span className="text-xs sm:text-sm font-medium  text-accent-foreground">
                Built for Freelancers, Trusted by Early Users
              </span>
            </div>

            {/* Main Headline */}
            <div className="space-y-4" style={{ fontFamily: "var(--font-serif)" }}>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-accent-foreground leading-tight">
                Share Gigs <span className="text-primary">You Can't Take</span>,{" "}
                <span className="text-primary"> Find Work You Love</span>
              </h1>

              {/* Subheadline */}
              <p className="text-xl sm:text-2xl text-muted-foreground leading-relaxed max-w-2xl">
                Too busy? Quickly post your extra gigs. Need work? Find one fast. Connect instantly via chat or email.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
              <Link
                href={session ? `/view-gigs` : "/auth/login"}
                className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold text-primary-foreground bg-primary hover:bg-primary/90 rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
                aria-label="Sign up for PostMyGig with Google or X authentication"
              >
                Start Posting Gigs
              </Link>
              <Link
                href="/view-gigs"
                className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold text-accent-foreground bg-card hover:bg-accent border-2 border-primary rounded-lg transition-colors duration-200"
                aria-label="Browse available freelance projects"
              >
                Find Gigs Now
              </Link>
            </div>

            {/* Additional Trust Elements */}
            <div className="flex flex-row flex-wrap items-center justify-center lg:justify-start gap-2 sm:gap-3 md:gap-4 lg:gap-6 text-muted-foreground">
              <div className="flex items-center space-x-1.5 sm:space-x-2 flex-shrink-0">
                <svg
                  className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-primary flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="whitespace-nowrap font-medium text-xs sm:text-sm md:text-base">No platform fees</span>
              </div>

              <div className="flex items-center space-x-1.5 sm:space-x-2 flex-shrink-0">
                <svg
                  className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-primary flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="whitespace-nowrap font-medium text-xs sm:text-sm md:text-base">
                  WhatsApp integration
                </span>
              </div>

              <div className="flex items-center space-x-1.5 sm:space-x-2 flex-shrink-0">
                <svg
                  className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-primary flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="whitespace-nowrap font-medium text-xs sm:text-sm md:text-base">Safe connections</span>
              </div>
            </div>
          </div>

          {/* Visual Section */}
          <div className="relative">
            <div className="relative bg-card rounded-xl sm:rounded-2xl shadow-2xl p-4 sm:p-6 lg:p-8 border border-border">
              {/* Mock App Interface */}
              <div className="space-y-4 sm:space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-primary rounded-lg flex items-center justify-center">
                      <span className="text-primary-foreground font-bold text-xs sm:text-sm">PG</span>
                    </div>
                    <span className="font-semibold text-card-foreground text-sm sm:text-base">PostMyGig</span>
                  </div>
                  <div className="flex space-x-1 sm:space-x-2">
                    <div className="w-2 h-2 sm:w-3 sm:h-3 bg-destructive rounded-full"></div>
                    <div className="w-2 h-2 sm:w-3 sm:h-3 bg-yellow-400 rounded-full"></div>
                    <div className="w-2 h-2 sm:w-3 sm:h-3 bg-primary rounded-full"></div>
                  </div>
                </div>

                {/* Mock Project Card - Updated to match actual design */}
                <div className="bg-muted rounded-lg p-4 sm:p-6 space-y-3 sm:space-y-4">
                  {/* Header with title, description and status */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-2 flex-1 min-w-0">
                      <h3 className="text-base sm:text-lg lg:text-xl font-bold text-foreground">
                        Full Stack Ecommerce App
                      </h3>
                      <p className="text-sm sm:text-base text-muted-foreground">
                        Need an developer to build me an Ecommerce application.
                      </p>
                    </div>
                    <div className="flex items-center space-x-1 sm:space-x-2 bg-card rounded-full px-2 sm:px-3 py-1 border border-border flex-shrink-0">
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full"></div>
                      <span className="text-xs sm:text-sm font-medium text-card-foreground">Active</span>
                    </div>
                  </div>

                  {/* Required Skills Section */}
                  <div className="space-y-2 sm:space-y-3">
                    <div className="flex items-center space-x-2">
                      <svg
                        className="w-3 h-3 sm:w-4 sm:h-4 text-primary"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                        />
                      </svg>
                      <span className="text-xs sm:text-sm font-medium text-muted-foreground">Required Skills</span>
                    </div>
                    <div className="flex flex-wrap gap-1 sm:gap-2">
                      <span className="px-2 sm:px-3 py-1 text-xs sm:text-sm font-medium text-primary bg-card border border-primary/20 rounded-full">
                        node
                      </span>
                      <span className="px-2 sm:px-3 py-1 text-xs sm:text-sm font-medium text-primary bg-card border border-primary/20 rounded-full">
                        react
                      </span>
                      <span className="px-2 sm:px-3 py-1 text-xs sm:text-sm font-medium text-primary bg-card border border-primary/20 rounded-full">
                        nextjs
                      </span>
                      <span className="px-2 sm:px-3 py-1 text-xs sm:text-sm font-medium text-primary bg-card border border-primary/20 rounded-full">
                        mongodb
                      </span>
                    </div>
                  </div>

                  {/* Footer with timing and CTA */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 pt-2">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        <span>Posted 20h ago</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span>12 days left</span>
                      </div>
                    </div>
                    <button className="bg-primary text-primary-foreground px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium hover:bg-primary/90 transition-colors flex items-center space-x-1 w-full sm:w-auto justify-center">
                      <span>Open Gig</span>
                      <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Mock Stats */}
                <div className="flex flex-row flex-wrap justify-center lg:justify-start gap-4 sm:gap-6 md:gap-8 pt-3 sm:pt-4 border-t border-border text-xs sm:text-sm">
                  <div className="flex-1 min-w-0 max-w-xs text-center">
                    <div className="font-medium text-primary">Post Projects</div>
                    <div className="text-muted-foreground">List work quickly</div>
                  </div>
                  <div className="flex-1 min-w-0 max-w-xs text-center">
                    <div className="font-medium text-primary">Get Pings</div>
                    <div className="text-muted-foreground">Replies via Notifications</div>
                  </div>
                  <div className="flex-1 min-w-0 max-w-xs text-center">
                    <div className="font-medium text-primary">Connect Freely</div>
                    <div className="text-muted-foreground">Talk directly, no limits</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute -top-2 sm:-top-4 -right-2 sm:-right-4 bg-primary/10 rounded-full p-2 sm:p-3 shadow-lg">
              <svg className="w-4 h-4 sm:w-6 sm:h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <div className="absolute -bottom-2 sm:-bottom-4 -left-2 sm:-left-4 bg-primary/10 rounded-full p-2 sm:p-3 shadow-lg">
              <svg className="w-4 h-4 sm:w-6 sm:h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
