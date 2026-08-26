"use client"

import { useState, useRef, useEffect } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"

interface ExpandableTextProps {
  text: string
  maxLines?: number
  className?: string
}

export function ExpandableText({ text, maxLines = 5, className = "" }: ExpandableTextProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isTruncated, setIsTruncated] = useState(false)
  const textRef = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    if (textRef.current) {
      const lineHeight = parseFloat(getComputedStyle(textRef.current).lineHeight || "24")
      const maxHeight = lineHeight * maxLines
      if (textRef.current.scrollHeight > maxHeight) {
        setIsTruncated(true)
      } else {
        setIsTruncated(false)
      }
    }
  }, [text, maxLines])

  return (
    <div className="space-y-2">
      <div
        className={`relative ${!isExpanded && isTruncated ? "overflow-hidden" : ""}`}
        style={{
          maxHeight: !isExpanded && isTruncated ? `calc(${maxLines} * 1.5em)` : "none",
        }}
      >
        <p ref={textRef} className={`${className} leading-relaxed`}>
          {text}
        </p>
        {!isExpanded && isTruncated && (
          <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-background to-transparent" />
        )}
      </div>

      {isTruncated && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-1 text-xs font-bold text-primary hover:underline bg-transparent border-none p-0 cursor-pointer"
        >
          {isExpanded ? (
            <>Show Less <ChevronUp className="w-3 h-3" /></>
          ) : (
            <>Show More <ChevronDown className="w-3 h-3" /></>
          )}
        </button>
      )}
    </div>
  )
}
