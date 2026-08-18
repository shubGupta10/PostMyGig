"use client"

import type { MarqueeProps } from "../types"

export function VerticalMarquee({ children, reverse = false, className = "" }: MarqueeProps) {
  return (
    <div className={`flex flex-col overflow-hidden h-[580px] sm:h-[660px] lg:h-[720px] ${className}`}>
      <div className={`flex flex-col gap-5 sm:gap-6 hover:[animation-play-state:paused] ${reverse ? "animate-scroll-up" : "animate-scroll-down"}`}>
        <div className="flex flex-col gap-5 sm:gap-6 shrink-0">
          {children}
        </div>
        <div className="flex flex-col gap-5 sm:gap-6 shrink-0">
          {children}
        </div>
      </div>
    </div>
  )
}
