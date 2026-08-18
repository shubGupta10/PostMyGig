"use client"

import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function GigFilters({
  availableSkills = [],
  currentSearch,
  currentSkill = "",
  currentSort = ""
}: {
  availableSkills?: string[],
  currentSearch: string,
  currentSkill?: string,
  currentSort?: string
}) {

  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState(currentSearch)

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm !== currentSearch) {
        updateFilters(searchTerm, currentSkill, currentSort)
      }
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [searchTerm, currentSearch, currentSkill])

  const updateFilters = (search: string, skill: string, sort: string) => {
    const params = new URLSearchParams();
    params.set("page", "1");
    params.set("sort", sort)

    if (search.trim() !== "") params.set("search", search)
    if (skill && skill !== "all") params.set("skill", skill)

    router.push(`/view-gigs?${params.toString()}`)
  }

  return (
    <div className="w-full flex flex-col gap-4">

      {/* Top Row: Full Width Search Bar */}
      <div className="relative w-full">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search gigs by title, skills, or description..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 h-10 text-sm border-2 rounded-lg bg-background w-full"
        />
      </div>

      {/* Bottom Row: Filters aligned left and right */}
      <div className="flex flex-wrap items-center justify-between gap-4">

        {/* Left Side: Dynamic Skills Dropdown */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="w-44 sm:w-52">
            <Select value={currentSkill || "all"} onValueChange={(val) => updateFilters(searchTerm, val, currentSort)}>
              <SelectTrigger className="w-full h-10 border-2 rounded-lg bg-background text-sm">
                <SelectValue placeholder="All Skills" />
              </SelectTrigger>
              <SelectContent className="max-h-72">
                <SelectItem value="all">All Skills</SelectItem>
                {availableSkills.map((skill) => (
                  <SelectItem key={skill} value={skill}>
                    {skill}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Right Side: "Sort" filter */}
        <div className="w-36 sm:w-40">
          <Select defaultValue="newest" value={currentSort} onValueChange={(val) => updateFilters(searchTerm, currentSkill, val)}>
            <SelectTrigger className="w-full h-10 border-2 rounded-lg bg-background text-sm">
              <SelectValue placeholder="Newest First" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
            </SelectContent>
          </Select>
        </div>

      </div>
    </div>
  )
}
