"use client"

import { useLayoutEffect, useRef } from "react"
import { useSidebar } from "@/components/ui/sidebar"

export function SidebarAutoCollapser() {
    const { setOpen } = useSidebar()
    const hasCollapsed = useRef(false)

    useLayoutEffect(() => {
        if (!hasCollapsed.current) {
            setOpen(false)
            hasCollapsed.current = true
        }
    }, [setOpen])

    return null
}
