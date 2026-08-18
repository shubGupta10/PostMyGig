"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Sparkles, ArrowRight, Zap } from "lucide-react"
import { VerticalMarquee } from "./feedback/VerticalMarquee"
import { SuccessActivityCard } from "./feedback/SuccessActivityCard"
import { fetchLandingActivityFeed, COMMUNITY_SUCCESS_STORIES } from "./services/landingActivityService"
import type { LandingActivityItem } from "./types"

export default function EarlyUserFeedback() {
  const [activities, setActivities] = useState<LandingActivityItem[]>(COMMUNITY_SUCCESS_STORIES)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  useEffect(() => {
    let isMounted = true
    async function loadActivities() {
      try {
        const data = await fetchLandingActivityFeed()
        if (isMounted && data.length > 0) {
          setActivities(data)
        }
      } catch (e) {
        // keep community stories
      }
    }
    loadActivities()
    return () => {
      isMounted = false
    }
  }, [])

  const hasActivities = activities.length > 0
  const displayActivities = activities.length >= 6 ? activities : activities.length > 0 ? [...activities, ...activities] : []
  const third = Math.ceil(displayActivities.length / 3)
  const actCol1 = displayActivities.slice(0, third)
  const actCol2 = displayActivities.slice(third, third * 2)
  const actCol3 = displayActivities.slice(third * 2)

  return (
    <section id="success-stories" className="bg-background py-12 md:py-20 scroll-mt-16">
      <div className="mx-auto max-w-3xl lg:max-w-6xl px-4 sm:px-6">

        {/* Section Header */}
        <div className="mx-auto mb-8 sm:mb-12 md:mb-14 max-w-4xl text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">
            Community & Platform Success
          </p>
          <h2
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Real Connections, Real <span className="text-primary">Success</span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto font-normal">
            Live milestones recorded directly on PostMyGig — gigs posted, pitches received, talent hired, and completed projects.
          </p>
        </div>

        {/* Dynamic Display */}
        {isLoading ? (
          <div className="h-[320px] flex items-center justify-center">
            <div className="flex items-center gap-2.5 text-sm text-muted-foreground font-medium">
              <span className="size-2 rounded-full bg-primary animate-pulse" />
              <span>Fetching live platform activity...</span>
            </div>
          </div>
        ) : hasActivities ? (
          <div className="relative overflow-hidden w-full">
            <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 overflow-hidden h-[520px] sm:h-[620px] w-full">
              <VerticalMarquee reverse={false}>
                {actCol1.map((item, i) => (
                  <SuccessActivityCard key={`col1-${item._id}-${i}`} activity={item} />
                ))}
              </VerticalMarquee>

              <VerticalMarquee reverse={true} className="hidden md:flex">
                {(actCol2.length > 0 ? actCol2 : actCol1).map((item, i) => (
                  <SuccessActivityCard key={`col2-${item._id}-${i}`} activity={item} />
                ))}
              </VerticalMarquee>

              <VerticalMarquee reverse={false} className="hidden lg:flex">
                {(actCol3.length > 0 ? actCol3 : actCol1).map((item, i) => (
                  <SuccessActivityCard key={`col3-${item._id}-${i}`} activity={item} />
                ))}
              </VerticalMarquee>

              {/* Edge fade gradient overlays */}
              <div className="pointer-events-none absolute inset-x-0 top-0 h-24 sm:h-32 bg-gradient-to-b from-background to-transparent z-10" />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 sm:h-32 bg-gradient-to-t from-background to-transparent z-10" />
            </div>
          </div>
        ) : (
          <div className="bg-muted rounded-2xl border-2 border-border p-10 sm:p-14 text-center max-w-2xl mx-auto shadow-sm">
            <div className="size-12 rounded-xl bg-background border border-border flex items-center justify-center mx-auto mb-4">
              <Zap className="size-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-1">
              Live Activity Stream Ready
            </h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto mb-6">
              When clients post gigs and freelancers send pitches, real-time activity events will appear here automatically.
            </p>
            <Link
              href="/add-gigs"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground rounded-xl px-5 py-2.5 text-sm font-semibold transition-all"
            >
              <span>Post the First Gig</span>
              <ArrowRight className="size-4" />
            </Link>
          </div>
        )}

      </div>

      {/* Marquee Animations */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes scroll-up {
            0% { transform: translateY(0); }
            100% { transform: translateY(calc(-50% - 0.75rem)); }
          }
          @keyframes scroll-down {
            0% { transform: translateY(calc(-50% - 0.75rem)); }
            100% { transform: translateY(0); }
          }
          .animate-scroll-up {
            animation: scroll-up 30s linear infinite;
          }
          .animate-scroll-down {
            animation: scroll-down 30s linear infinite;
          }
        `
      }} />
    </section>
  )
}