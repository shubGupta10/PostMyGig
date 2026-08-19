"use client"

import { useRouter } from "next/navigation"
import { useState, useEffect, useMemo, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Search,
  X,
  Check,
  ChevronsUpDown,
  RotateCcw,
} from "lucide-react"
import { matchAndScoreSkill, type SkillMatch } from "@/modules/gigs/services/skillMatcher"

export default function GigFilters({
  availableSkills = [],
  currentSearch,
  currentSkill = "",
  currentSort = "newest",
}: {
  availableSkills?: string[]
  currentSearch: string
  currentSkill?: string
  currentSort?: string
}) {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState(currentSearch)
  const [skillSearch, setSkillSearch] = useState("")
  const [isSkillOpen, setIsSkillOpen] = useState(false)
  const skillSearchInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setSearchTerm(currentSearch)
  }, [currentSearch])

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm !== currentSearch) {
        updateFilters(searchTerm, currentSkill, currentSort)
      }
    }, 400)

    return () => clearTimeout(timeoutId)
  }, [searchTerm, currentSearch, currentSkill, currentSort])

  useEffect(() => {
    if (isSkillOpen) {
      setTimeout(() => {
        skillSearchInputRef.current?.focus()
      }, 50)
    } else {
      setSkillSearch("")
    }
  }, [isSkillOpen])

  const updateFilters = (search: string, skill: string, sort: string) => {
    const params = new URLSearchParams()
    params.set("page", "1")
    if (sort) params.set("sort", sort)

    if (search.trim() !== "") params.set("search", search.trim())
    if (skill && skill !== "all") params.set("skill", skill)

    router.push(`/view-gigs?${params.toString()}`)
  }

  const handleSelectSkill = (skill: string) => {
    setIsSkillOpen(false)
    setSkillSearch("")
    updateFilters(searchTerm, skill, currentSort)
  }

  const handleClearSkill = (e: React.MouseEvent) => {
    e.stopPropagation()
    updateFilters(searchTerm, "all", currentSort)
  }

  const handleClearSearch = () => {
    setSearchTerm("")
    updateFilters("", currentSkill, currentSort)
  }

  const handleResetAll = () => {
    setSearchTerm("")
    setSkillSearch("")
    updateFilters("", "all", "newest")
  }

  const filteredSkills = useMemo(() => {
    const uniqueSkills = Array.from(new Set(availableSkills.filter(Boolean)))

    if (!skillSearch.trim()) {
      return uniqueSkills.map((s) => ({
        skill: s,
        score: 1,
        segments: [{ text: s, highlight: false }],
      }))
    }

    const matches: SkillMatch[] = []
    for (const s of uniqueSkills) {
      const match = matchAndScoreSkill(s, skillSearch)
      if (match) {
        matches.push(match)
      }
    }

    return matches.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score
      return a.skill.localeCompare(b.skill)
    })
  }, [availableSkills, skillSearch])

  const isSkillActive = Boolean(currentSkill && currentSkill !== "all")
  const isSearchActive = Boolean(searchTerm.trim())
  const hasActiveFilters = isSkillActive || isSearchActive || (currentSort && currentSort !== "newest")

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="relative w-full">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        <Input
          type="text"
          placeholder="Search gigs by title, skills, or description..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 pr-10 h-11 text-sm border-2 rounded-xl bg-background w-full shadow-2xs focus-visible:ring-2 focus-visible:ring-primary/20 transition-all"
        />
        {searchTerm && (
          <button
            type="button"
            onClick={handleClearSearch}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
            title="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <Popover open={isSkillOpen} onOpenChange={setIsSkillOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={isSkillOpen}
                className="w-44 sm:w-52 h-10 px-3 border-2 rounded-xl text-sm font-normal justify-between shadow-2xs transition-all cursor-pointer bg-background hover:bg-muted/60"
              >
                <span className="truncate text-foreground font-medium">
                  {isSkillActive ? currentSkill : "All Skills"}
                </span>

                <div className="flex items-center gap-1 shrink-0 ml-1">
                  {isSkillActive && (
                    <span
                      role="button"
                      tabIndex={0}
                      onClick={handleClearSkill}
                      onKeyDown={(e) => e.key === "Enter" && handleClearSkill(e as any)}
                      className="p-0.5 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                      title="Clear skill filter"
                    >
                      <X className="w-3.5 h-3.5" />
                    </span>
                  )}
                  <ChevronsUpDown className="w-3.5 h-3.5 text-muted-foreground opacity-70" />
                </div>
              </Button>
            </PopoverTrigger>

            <PopoverContent
              className="w-56 sm:w-64 p-2 rounded-xl shadow-lg border-2 border-border bg-popover text-popover-foreground z-50"
              align="start"
            >
              <div className="relative mb-2">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                <Input
                  ref={skillSearchInputRef}
                  type="text"
                  placeholder="Search skills..."
                  value={skillSearch}
                  onChange={(e) => setSkillSearch(e.target.value)}
                  className="pl-8 pr-7 h-9 text-xs border rounded-lg bg-background w-full focus-visible:ring-1"
                />
                {skillSearch && (
                  <button
                    type="button"
                    onClick={() => setSkillSearch("")}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 rounded text-muted-foreground hover:text-foreground cursor-pointer"
                    title="Clear"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <div className="max-h-60 overflow-y-auto space-y-0.5 pr-1 text-sm custom-scrollbar">
                <button
                  type="button"
                  onClick={() => handleSelectSkill("all")}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors text-left cursor-pointer ${
                    !isSkillActive
                      ? "bg-primary/10 text-primary font-semibold"
                      : "hover:bg-muted text-foreground"
                  }`}
                >
                  <span>All Skills</span>
                  {!isSkillActive && <Check className="w-3.5 h-3.5 text-primary" />}
                </button>

                {filteredSkills.map(({ skill, segments }) => {
                  const isSelected = currentSkill.toLowerCase() === skill.toLowerCase()
                  return (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => handleSelectSkill(skill)}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors text-left cursor-pointer ${
                        isSelected
                          ? "bg-primary/10 text-primary font-semibold"
                          : "hover:bg-muted text-foreground"
                      }`}
                    >
                      <span className="truncate pr-2">
                        {segments.map((seg, idx) =>
                          seg.highlight ? (
                            <span
                              key={idx}
                              className="font-bold text-primary bg-primary/15 rounded-xs px-0.5"
                            >
                              {seg.text}
                            </span>
                          ) : (
                            <span key={idx}>{seg.text}</span>
                          )
                        )}
                      </span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-primary shrink-0" />}
                    </button>
                  )
                })}

                {filteredSkills.length === 0 && (
                  <div className="py-5 px-3 text-center space-y-2">
                    <p className="text-xs text-muted-foreground">
                      No skills found matching <span className="font-semibold text-foreground">"{skillSearch}"</span>
                    </p>
                    <Button
                      type="button"
                      variant="ghost"
                      size="xs"
                      onClick={() => setSkillSearch("")}
                      className="text-primary hover:text-primary hover:bg-primary/10 cursor-pointer"
                    >
                      Clear search
                    </Button>
                  </div>
                )}
              </div>
            </PopoverContent>
          </Popover>

          {hasActiveFilters && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleResetAll}
              className="h-10 px-2.5 text-xs text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl gap-1.5 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </Button>
          )}
        </div>

        <div className="w-36 sm:w-40">
          <Select
            defaultValue="newest"
            value={currentSort || "newest"}
            onValueChange={(val) => updateFilters(searchTerm, currentSkill, val)}
          >
            <SelectTrigger className="w-full h-10 border-2 rounded-xl bg-background text-sm font-medium shadow-2xs cursor-pointer">
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-2">
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}
