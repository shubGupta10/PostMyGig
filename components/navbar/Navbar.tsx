import Image from "next/image"
import Link from "next/link"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/options"
import { DesktopNav } from "./DesktopNav"
import { MobileNav } from "./MobileNav"
import { UserDropdown } from "./UserDropdown"
import { DarkModeToggle } from "@/components/DarkModeToggle"

export async function Navbar() {
  const session = await getServerSession(authOptions)

  return (
    <nav className="w-full bg-background border-b border-border shadow-sm sticky top-0 z-50">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo Section */}
          <div className="flex items-center flex-shrink-0">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 bg-transparent rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
                <Image unoptimized src="/AppIcon.png" alt="App Icon" width={100} height={100} />
              </div>
              <span className="text-xl font-bold group-hover:text-primary transition-colors duration-200 text-foreground">
                PostMy<span className="text-primary">Gig</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <DesktopNav session={session} />

          {/* Desktop Auth Section */}
          <div className="hidden lg:flex items-center space-x-4 flex-shrink-0">
            <DarkModeToggle />
            <UserDropdown session={session} />
          </div>

          {/* Mobile Auth & Menu Button */}
          <MobileNav session={session} />
          
        </div>
      </div>
    </nav>
  )
}
