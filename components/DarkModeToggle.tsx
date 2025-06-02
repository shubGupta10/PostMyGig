"use client"

import * as React from "react"
import { Moon, Sun, Monitor } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function DarkModeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  // Prevent hydration mismatch
  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" disabled>
        <Sun className="h-[1.5rem] w-[1.5rem]" />
        <span className="sr-only">Loading theme toggle</span>
      </Button>
    )
  }

  const getThemeIcon = () => {
    switch (resolvedTheme) {
      case 'dark':
        return <Moon className="h-[1.5rem] w-[1.5rem]" />
      case 'light':
        return <Sun className="h-[1.5rem] w-[1.5rem]" />
      default:
        return <Monitor className="h-[1.5rem] w-[1.5rem]" />
    }
  }

  const getThemeLabel = (themeValue: string) => {
    const isActive = theme === themeValue
    return (
      <div className="flex items-center gap-2">
        {themeValue === 'light' && <Sun className="h-4 w-4" />}
        {themeValue === 'dark' && <Moon className="h-4 w-4" />}
        {themeValue === 'system' && <Monitor className="h-4 w-4" />}
        <span className={isActive ? "font-medium" : ""}>{themeValue.charAt(0).toUpperCase() + themeValue.slice(1)}</span>
        {isActive && <span className="ml-auto text-xs opacity-60">✓</span>}
      </div>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon"
          className="transition-all duration-200 hover:bg-accent hover:text-accent-foreground"
        >
          <div className="relative">
            {getThemeIcon()}
          </div>
          <span className="sr-only">Toggle theme (current: {theme})</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-36">
        <DropdownMenuItem 
          onClick={() => setTheme("light")}
          className="cursor-pointer"
        >
          {getThemeLabel("light")}
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme("dark")}
          className="cursor-pointer"
        >
          {getThemeLabel("dark")}
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme("system")}
          className="cursor-pointer"
        >
          {getThemeLabel("system")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}