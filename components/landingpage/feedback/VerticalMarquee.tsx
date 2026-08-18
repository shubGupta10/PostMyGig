"use client"

import type { MarqueeProps } from "../types"

export function VerticalMarquee({ children, reverse = false, className = "" }: MarqueeProps) {
  return (
    <div className={`flex flex-col overflow-hidden h-[520px] sm:h-[620px] ${className}`}>
      <div className={`flex flex-col gap-4 sm:gap-6 ${reverse ? "animate-scroll-up" : "animate-scroll-down"}`}>
        <div className="flex flex-col gap-4 sm:gap-6 shrink-0">
          {children}
        </div>
        <div className="flex flex-col gap-4 sm:gap-6 shrink-0">
          {children}
        </div>
      </div>
    </div>
  )
}
