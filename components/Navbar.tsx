"use client"

import { useSession } from "next-auth/react"
import Image from "next/image"
import { useState, useEffect } from "react"
import { Button } from "./ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  ChevronDown,
  Menu,
  X,
  User,
  Settings,
  LogOut,
  Home,
  Briefcase,
  LayoutDashboard,
  MessageSquare,
  Shield,
  User2Icon,
  MessageCircleCodeIcon,
} from "lucide-react"
import { useAuthStore } from "@/store/useAuthStore"
import { useRouter } from "next/navigation"

function Navbar() {
  const { data, status } = useSession()
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const { handleLogout } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    setIsClient(true)
  }, [])

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  // Handle navigation with mobile menu close
  const handleNavigation = (path: string) => {
    closeMobileMenu()
    router.push(path)
  }

  // Handle logout with mobile menu close
  const handleMobileLogout = () => {
    closeMobileMenu()
    handleLogout()
  }

  if (!isClient || status === "loading") {
    return (
      <nav className="w-full bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo Section Skeleton */}
            <div className="flex items-center flex-shrink-0">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
                <div className="hidden sm:block w-32 h-6 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>

            {/* Desktop Navigation Links Skeleton */}
            <div className="hidden lg:flex items-center justify-center flex-1 px-8">
              <div className="flex items-center space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="px-4 py-2 rounded-lg">
                    <div className="w-16 h-4 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Desktop Auth Section Skeleton */}
            <div className="hidden lg:flex items-center space-x-4 flex-shrink-0">
              <div className="flex items-center space-x-3 p-2 rounded-lg">
                <div className="w-9 h-9 bg-gray-200 rounded-full animate-pulse"></div>
                <div className="flex flex-col space-y-1">
                  <div className="w-20 h-3 bg-gray-200 rounded animate-pulse"></div>
                  <div className="w-24 h-2 bg-gray-200 rounded animate-pulse"></div>
                </div>
                <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>

            {/* Mobile Section Skeleton */}
            <div className="flex items-center space-x-3 lg:hidden">
              <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
              <div className="w-6 h-6 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </nav>
    )
  }

  return (
    <nav className="w-full bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Section */}
          <div className="flex items-center flex-shrink-0">
            <div className="flex items-center space-x-3 cursor-pointer group" onClick={() => router.push("/")}>
              <div className="w-10 h-10 bg-transparent rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
                <Image src='/AppIcon.png' alt="App Icon" width={100} height={100} />
              </div>
              <span className="text-xl font-bold group-hover:text-blue-600 transition-colors duration-200 hidden sm:block text-blue-600">
                PostMy<span className="text-emerald-600">Gig</span>
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center justify-center flex-1 px-8">
            <ul className="flex items-center space-x-2">
              <li>
                <a
                  href="/"
                  className="text-gray-600 hover:text-blue-600 transition-colors duration-200 font-medium px-4 py-2 rounded-lg hover:bg-blue-50 flex items-center space-x-2"
                >
                  <Home className="w-4 h-4" />
                  <span>Home</span>
                </a>
              </li>
              <li>
                <a
                  href="/view-gigs"
                  className="text-gray-600 hover:text-blue-600 transition-colors duration-200 font-medium px-4 py-2 rounded-lg hover:bg-blue-50 flex items-center space-x-2"
                >
                  <Briefcase className="w-4 h-4" />
                  <span>Gigs</span>
                </a>
              </li>
              {status === "authenticated" && (
                <li>
                  <a
                    href="/dashboard"
                    className="text-gray-600 hover:text-blue-600 transition-colors duration-200 font-medium px-4 py-2 rounded-lg hover:bg-blue-50 flex items-center space-x-2"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    <span>Dashboard</span>
                  </a>
                </li>
              )}
              {/* Add Admin Dashboard to desktop navigation */}
              {status === "authenticated" && data?.user?.role === 'admin' && (
                <li>
                  <a
                    href="/user/admin/dashboard"
                    className="text-gray-600 hover:text-blue-600 transition-colors duration-200 font-medium px-4 py-2 rounded-lg hover:bg-blue-50 flex items-center space-x-2"
                  >
                    <Shield className="w-4 h-4" />
                    <span>Admin</span>
                  </a>
                </li>
              )}
              <li>
                <a
                  href="/user/feedback"
                  className="text-gray-600 hover:text-blue-600 transition-colors duration-200 font-medium px-4 py-2 rounded-lg hover:bg-blue-50 flex items-center space-x-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Feedback</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Desktop Auth Section */}
          <div className="hidden lg:flex items-center space-x-4 flex-shrink-0">
            {status === "authenticated" ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center space-x-3 hover:bg-gray-50 p-2 rounded-lg transition-colors duration-200 border border-transparent hover:border-gray-200">
                    {data?.user?.image ? (
                      <Image
                        src={data.user.image || "/placeholder.svg"}
                        height={36}
                        width={36}
                        alt="User Avatar"
                        className="rounded-full border-2 border-blue-200"
                      />
                    ) : (
                      <div className="w-9 h-9 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-medium">
                          {data?.user?.email?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                    <div className="flex flex-col items-start">
                      <span className="text-sm text-gray-900 font-medium max-w-32 truncate">
                        {data?.user?.name || "User"}
                      </span>
                      <span className="text-xs text-gray-500 max-w-32 truncate">{data?.user?.email}</span>
                    </div>
                    <ChevronDown className="w-4 h-4 text-gray-500 flex-shrink-0" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{data?.user?.name}</p>
                      <p className="text-xs leading-none text-muted-foreground truncate">{data?.user?.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => router.push("/user/profile")} className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>

                   <DropdownMenuItem onClick={() => router.push("/user-gigs")} className="cursor-pointer">
                    <User2Icon className="mr-2 h-4 w-4" />
                    Your Gigs
                  </DropdownMenuItem>

                     <DropdownMenuItem onClick={() => router.push("/chat-history")} className="cursor-pointer">
                    <MessageCircleCodeIcon className="mr-2 h-4 w-4" />
                    Your Chats
                  </DropdownMenuItem>

                  {data?.user?.role === 'admin' ? (
                    <>
                      <DropdownMenuItem className="cursor-pointer" onClick={() => router.push("/user/admin/dashboard")}>
                        <Shield className="mr-2 h-4 w-4" />
                        Admin Dashboard
                      </DropdownMenuItem>
                    </>
                  ) : null}

                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600 focus:text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  onClick={() => router.push("/auth/login")}
                  className="border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300 px-6 py-2 rounded-lg font-medium transition-all duration-200"
                >
                  Sign In
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Auth & Menu Button */}
          <div className="flex items-center space-x-3 lg:hidden">
            {/* Mobile User Avatar (when authenticated) */}
            {status === "authenticated" && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center hover:bg-gray-50 p-1.5 rounded-lg transition-colors duration-200">
                    {data?.user?.image ? (
                      <Image
                        src={data.user.image || "/placeholder.svg"}
                        height={32}
                        width={32}
                        alt="User Avatar"
                        className="rounded-full border-2 border-blue-200"
                      />
                    ) : (
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-medium">
                          {data?.user?.email?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{data?.user?.name}</p>
                      <p className="text-xs leading-none text-muted-foreground truncate">{data?.user?.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => handleNavigation("/user/profile")} className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  {/* Add Admin Dashboard to mobile dropdown */}
                  {data?.user?.role === 'admin' && (
                    <DropdownMenuItem className="cursor-pointer" onClick={() => handleNavigation("/user/admin/dashboard")}>
                      <Shield className="mr-2 h-4 w-4" />
                      Admin Dashboard
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleMobileLogout}
                    className="cursor-pointer text-red-600 focus:text-red-600"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* Hamburger Menu Button */}
            <button
              className="text-gray-600 hover:text-blue-600 hover:bg-blue-50 p-2 rounded-lg transition-colors duration-200"
              onClick={toggleMobileMenu}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <div
          className={`lg:hidden transition-all duration-300 ease-in-out overflow-hidden ${isMobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
            }`}
        >
          <div className="py-4 border-t border-gray-100">
            <ul className="flex flex-col space-y-1">
              <li>
                <button
                  className="text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors duration-200 font-medium w-full text-left px-4 py-3 rounded-lg flex items-center space-x-3"
                  onClick={() => handleNavigation("/")}
                >
                  <Home className="w-5 h-5" />
                  <span>Home</span>
                </button>
              </li>
              <li>
                <button
                  className="text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors duration-200 font-medium w-full text-left px-4 py-3 rounded-lg flex items-center space-x-3"
                  onClick={() => handleNavigation("/view-gigs")}
                >
                  <Briefcase className="w-5 h-5" />
                  <span>Gigs</span>
                </button>
              </li>
              {status === "authenticated" && (
                <li>
                  <button
                    className="text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors duration-200 font-medium w-full text-left px-4 py-3 rounded-lg flex items-center space-x-3"
                    onClick={() => handleNavigation("/dashboard")}
                  >
                    <LayoutDashboard className="w-5 h-5" />
                    <span>Dashboard</span>
                  </button>
                </li>
              )}
              {/* Add Admin Dashboard to mobile menu */}
              {status === "authenticated" && data?.user?.role === 'admin' && (
                <li>
                  <button
                    className="text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors duration-200 font-medium w-full text-left px-4 py-3 rounded-lg flex items-center space-x-3"
                    onClick={() => handleNavigation("/user/admin/dashboard")}
                  >
                    <Shield className="w-5 h-5" />
                    <span>Admin Dashboard</span>
                  </button>
                </li>
              )}
              <li>
                <button
                  className="text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors duration-200 font-medium w-full text-left px-4 py-3 rounded-lg flex items-center space-x-3"
                  onClick={() => handleNavigation("/user/feedback")}
                >
                  <MessageSquare className="w-5 h-5" />
                  <span>Feedback</span>
                </button>
              </li>
            </ul>

            {/* Mobile Auth Buttons (when not authenticated) */}
            {status !== "authenticated" && (
              <div className="mt-6 px-4 space-y-3">
                <Button
                  variant="outline"
                  className="w-full border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300 py-3 rounded-lg font-medium transition-all duration-200"
                  onClick={() => handleNavigation("/auth/signin")}
                >
                  Sign In
                </Button>
                <Button
                  className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white py-3 rounded-lg font-medium transition-all duration-200 shadow-sm"
                  onClick={() => handleNavigation("/view-gigs")}
                >
                  Get Started
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar