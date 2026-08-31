"use client"

import { useState, useEffect } from "react"
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerClose,
} from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X, SlidersHorizontal, Star } from "lucide-react"
import type { SearchFilters } from "../services/searchService"

interface FilterDrawerProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    currentFilters: SearchFilters
    onApply: (filters: SearchFilters) => void
}

export function FilterDrawer({
    open,
    onOpenChange,
    currentFilters,
    onApply,
}: FilterDrawerProps) {
    const [localFilters, setLocalFilters] = useState<SearchFilters>(currentFilters)

    useEffect(() => {
        if (open) {
            setLocalFilters(currentFilters)
        }
    }, [open, currentFilters])

    const handleApply = () => {
        onApply(localFilters)
        onOpenChange(false)
    }

    const handleClear = () => {
        const emptyFilters: SearchFilters = {}
        setLocalFilters(emptyFilters)
        onApply(emptyFilters)
        onOpenChange(false)
    }

    return (
        <Drawer open={open} onOpenChange={onOpenChange} direction="right">
            <DrawerContent className="flex flex-col h-full max-w-md w-full ml-auto rounded-none border-l">

                {/* Header (Sticky) */}
                <DrawerHeader className="flex-none flex items-center justify-between border-b border-border px-6 py-5">
                    <DrawerTitle className="text-xl font-bold flex items-center gap-2">
                        <SlidersHorizontal className="w-5 h-5 text-primary cursor-pointer" />
                        Filters
                    </DrawerTitle>
                    <DrawerClose asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full cursor-pointer">
                            <X className="w-4 h-4" />
                        </Button>
                    </DrawerClose>
                </DrawerHeader>

                {/* Scrollable Body */}
                <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8">
                    {/* Experience Filter */}
                    <div className="space-y-4">
                        <Label className="text-base font-semibold">Minimum Experience</Label>
                        <div className="flex items-center gap-3">
                            <Input
                                type="number"
                                min="0"
                                placeholder="e.g. 2"
                                value={localFilters.minExperience || ""}
                                onChange={(e) => setLocalFilters({ ...localFilters, minExperience: e.target.value ? Number(e.target.value) : undefined })}
                                className="w-full h-12 bg-background border-2 border-border focus-visible:ring-primary/20 rounded-xl"
                            />
                            <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">Years</span>
                        </div>
                    </div>

                    {/* Hourly Rate Filter */}
                    <div className="space-y-4">
                        <Label className="text-base font-semibold">Hourly Rate (USD)</Label>
                        <div className="flex items-center gap-4">
                            <div className="flex-1">
                                <Input
                                    type="number"
                                    min="0"
                                    placeholder="Min"
                                    value={localFilters.minRate || ""}
                                    onChange={(e) => setLocalFilters({ ...localFilters, minRate: e.target.value ? Number(e.target.value) : undefined })}
                                    className="w-full h-12 bg-background border-2 border-border focus-visible:ring-primary/20 rounded-xl"
                                />
                            </div>
                            <span className="text-muted-foreground font-medium">to</span>
                            <div className="flex-1">
                                <Input
                                    type="number"
                                    min="0"
                                    placeholder="Max"
                                    value={localFilters.maxRate || ""}
                                    onChange={(e) => setLocalFilters({ ...localFilters, maxRate: e.target.value ? Number(e.target.value) : undefined })}
                                    className="w-full h-12 bg-background border-2 border-border focus-visible:ring-primary/20 rounded-xl"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Rating Filter */}
                    <div className="space-y-4">
                        <Label className="text-base font-semibold">Minimum Rating</Label>
                        <div className="flex items-center gap-3">
                            <Input
                                type="number"
                                min="0"
                                max="5"
                                step="0.1"
                                placeholder="e.g. 4.5"
                                value={localFilters.minRating || ""}
                                onChange={(e) => setLocalFilters({ ...localFilters, minRating: e.target.value ? Number(e.target.value) : undefined })}
                                className="w-full h-12 bg-background border-2 border-border focus-visible:ring-primary/20 rounded-xl"
                            />
                            <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
                        </div>
                    </div>
                </div>

                {/* Footer Actions (Sticky) */}
                <div className="flex-none flex items-center gap-4 border-t border-border px-6 py-5 bg-background">
                    <Button
                        variant="outline"
                        onClick={handleClear}
                        className="flex-1 h-12 rounded-xl font-semibold border-2 cursor-pointer"
                    >
                        Clear All
                    </Button>
                    <Button
                        onClick={handleApply}
                        className="flex-1 h-12 rounded-xl font-semibold bg-primary text-primary-foreground hover:opacity-90 cursor-pointer"
                    >
                        Apply Filters
                    </Button>
                </div>
            </DrawerContent>
        </Drawer>
    )
}
