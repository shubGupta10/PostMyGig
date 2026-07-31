"use client"

import Image from "next/image"
import { useState } from "react"
import { Button } from "./ui/button"
import {
  Menu,
  X,
  Star,
  Settings,
  PlayCircle
} from "lucide-react"
import { useRouter } from "next/navigation"
import { DarkModeToggle } from "./DarkModeToggle"
import { cn } from "@/lib/utils"

function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const router = useRouter()

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  const handleNavigation = (path: string) => {
    closeMobileMenu()
    router.push(path)
  }

  const handleScrollTo = (id: string) => {
    closeMobileMenu()
    if (window.location.pathname !== "/") {
      router.push(`/${id}`)
    } else {
      const element = document.querySelector(id)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }

  return (
    <nav className="w-full bg-background/80 backdrop-blur-[2px] border-b border-border/50 shadow-sm sticky top-0 z-50">
      <div
        className={cn(
          "absolute inset-0 opacity-30",
          "[background-size:40px_40px]",
          "[background-image:linear-gradient(to_right,#e4e4e7_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e7_1px,transparent_1px)]",
          "dark:[background-image:linear-gradient(to_right,#262626_1px,transparent_1px),linear-gradient(to_bottom,#262626_1px,transparent_1px)]",
        )}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Section */}
          <div className="flex items-center flex-shrink-0">
            <div className="flex items-center space-x-3 cursor-pointer group" onClick={() => router.push("/")}>
              <div className="w-10 h-10 bg-transparent rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
                <Image src="/AppIcon.png" alt="App Icon" width={100} height={100} />
              </div>
              <span className="text-xl font-bold group-hover:text-primary transition-colors duration-200 text-primary">
                PostMy<span className="text-accent-foreground">Gig</span>
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center justify-center flex-1 px-8">
            <ul className="flex items-center space-x-2">
              <li>
                <button
                  onClick={() => handleScrollTo('#features')}
                  className="text-foreground dark:hover:text-background hover:text-background transition-colors duration-200 font-medium px-4 py-2 rounded-lg hover:bg-popover-foreground flex items-center space-x-2"
                >
                  <Star className="w-4 h-4" />
                  <span>Features</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleScrollTo('#how-it-works')}
                  className="text-foreground dark:hover:text-background hover:text-background transition-colors duration-200 font-medium px-4 py-2 rounded-lg hover:bg-popover-foreground flex items-center space-x-2"
                >
                  <Settings className="w-4 h-4" />
                  <span>How it works</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleScrollTo('#demo-video')}
                  className="text-foreground dark:hover:text-background hover:text-background transition-colors duration-200 font-medium px-4 py-2 rounded-lg hover:bg-popover-foreground flex items-center space-x-2"
                >
                  <PlayCircle className="w-4 h-4" />
                  <span>Demo</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Desktop Auth Section */}
          <div className="hidden lg:flex items-center space-x-4 flex-shrink-0">
            <DarkModeToggle />
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                onClick={() => handleNavigation("/auth/login")}
                className="border-border text-primary hover:bg-accent hover:border-primary px-6 py-2 rounded-lg font-medium transition-all duration-200 backdrop-blur-sm"
              >
                Sign In
              </Button>
              <Button
                onClick={() => handleNavigation("/view-gigs")}
                className="bg-primary hover:opacity-90 text-primary-foreground px-6 py-2 rounded-lg font-bold transition-opacity shadow-sm"
              >
                Get Started
              </Button>
            </div>
          </div>

          {/* Mobile Auth & Menu Button */}
          <div className="flex items-center space-x-3 lg:hidden">
            <DarkModeToggle />
            
            {/* Hamburger Menu Button */}
            <button
              className="text-foreground hover:text-primary hover:bg-accent/50 p-2 rounded-lg transition-colors duration-200 backdrop-blur-sm"
              onClick={toggleMobileMenu}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <div
          className={`lg:hidden transition-all duration-300 ease-in-out overflow-hidden ${
            isMobileMenuOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="py-4 border-t border-border/50 backdrop-blur-sm">
            <ul className="flex flex-col space-y-1">
              <li>
                <button
                  className="text-foreground hover:text-primary hover:bg-accent/50 transition-colors duration-200 font-medium w-full text-left px-4 py-3 rounded-lg flex items-center space-x-3"
                  onClick={() => handleScrollTo('#features')}
                >
                  <Star className="w-5 h-5" />
                  <span>Features</span>
                </button>
              </li>
              <li>
                <button
                  className="text-foreground hover:text-primary hover:bg-accent/50 transition-colors duration-200 font-medium w-full text-left px-4 py-3 rounded-lg flex items-center space-x-3"
                  onClick={() => handleScrollTo('#how-it-works')}
                >
                  <Settings className="w-5 h-5" />
                  <span>How it works</span>
                </button>
              </li>
              <li>
                <button
                  className="text-foreground hover:text-primary hover:bg-accent/50 transition-colors duration-200 font-medium w-full text-left px-4 py-3 rounded-lg flex items-center space-x-3"
                  onClick={() => handleScrollTo('#demo-video')}
                >
                  <PlayCircle className="w-5 h-5" />
                  <span>Demo</span>
                </button>
              </li>
            </ul>

            <div className="mt-6 px-4 space-y-3">
              <Button
                variant="outline"
                className="w-full border-border text-primary hover:bg-accent hover:border-primary py-3 rounded-lg font-medium transition-all duration-200 backdrop-blur-sm"
                onClick={() => handleNavigation("/auth/login")}
              >
                Sign In
              </Button>
              <Button
                className="w-full bg-primary hover:opacity-90 text-primary-foreground py-3 rounded-xl font-bold transition-opacity shadow-sm"
                onClick={() => handleNavigation("/view-gigs")}
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
