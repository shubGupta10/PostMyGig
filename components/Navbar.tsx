"use client"

import { useSession } from 'next-auth/react'
import Image from 'next/image';
import React, { useState } from 'react'
import { Button } from './ui/button';
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
  Loader2Icon,
  Loader2
} from 'lucide-react'
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';

function Navbar() {
  const { data, status } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const {handleLogout} = useAuthStore()
  const router = useRouter();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // Handle navigation with mobile menu close
  const handleNavigation = (path: string) => {
    closeMobileMenu();
    router.push(path);
  };

  // Handle logout with mobile menu close
  const handleMobileLogout = () => {
    closeMobileMenu();
    handleLogout();
  };

  if(status === 'loading'){
    return (
      <div className='w-full h-16 flex items-center justify-center'>
        <Loader2 className='h-6 w-6 animate-spin text-slate-600' />
      </div>
    )
  }

  return (
    <nav className='w-full bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex items-center justify-between h-16'>
          {/* Logo Section */}
          <div className='flex items-center flex-shrink-0'>
            <div className='flex items-center space-x-2 cursor-pointer' onClick={() => router.push('/')}>
              <div className='w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center'>
                <span className='text-slate-800 font-bold text-lg'>P</span>
              </div>
              <span className='text-xl font-semibold text-slate-900 hidden xs:block'>PostMyGig</span>
              <span className='text-lg font-semibold text-slate-900 block xs:hidden'>PostMyGig</span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <div className='hidden lg:flex items-center justify-center flex-1 px-8'>
            <ul className='flex items-center space-x-8'>
              <li>
                <a
                  href="/"
                  className='text-slate-600 hover:text-slate-900 transition-colors duration-200 font-medium px-3 py-2 rounded-md hover:bg-slate-50'
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="/view-gigs"
                  className='text-slate-600 hover:text-slate-900 transition-colors duration-200 font-medium px-3 py-2 rounded-md hover:bg-slate-50'
                >
                  Gigs
                </a>
              </li>
              {status === 'authenticated' ? <>
              <li>
                <a
                  href="/dashboard"
                  className='text-slate-600 hover:text-slate-900 transition-colors duration-200 font-medium px-3 py-2 rounded-md hover:bg-slate-50'
                >
                  Dashboard
                </a>
              </li>
              </> : null}

              <li>
                <a
                  href="/user/feedback"
                  className='text-slate-600 hover:text-slate-900 transition-colors duration-200 font-medium px-3 py-2 rounded-md hover:bg-slate-50'
                >
                  Feedback
                </a>
              </li>
            </ul>
          </div>

          {/* Desktop Auth Section */}
          <div className='hidden lg:flex items-center space-x-4 flex-shrink-0'>
            {status === 'authenticated' ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className='flex items-center space-x-2 hover:bg-slate-50 p-2 rounded-lg transition-colors duration-200'>
                    {data?.user?.image ? (
                      <Image
                        src={data.user.image}
                        height={32}
                        width={32}
                        alt='User Avatar'
                        className='rounded-full border-2 border-slate-200'
                      />
                    ) : (
                      <div className='w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center'>
                        <span className='text-slate-700 text-sm font-medium'>
                          {data?.user?.email?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                    <span className='text-sm text-slate-700 font-medium max-w-32 truncate'>
                      {data?.user?.name || data?.user?.email}
                    </span>
                    <ChevronDown className='w-4 h-4 text-slate-500 flex-shrink-0' />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{data?.user?.name}</p>
                      <p className="text-xs leading-none text-muted-foreground truncate">
                        {data?.user?.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => router.push("/user/profile")} className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600 focus:text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button onClick={() => router.push("/view-gigs")} className='bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200 shadow-sm'>
                Get Started
              </Button>
            )}
          </div>

          {/* Mobile Auth & Menu Button */}
          <div className='flex items-center space-x-2 lg:hidden'>
            {/* Mobile User Avatar (when authenticated) */}
            {status === 'authenticated' && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className='flex items-center hover:bg-slate-50 p-1.5 rounded-lg transition-colors duration-200'>
                    {data?.user?.image ? (
                      <Image
                        src={data.user.image}
                        height={28}
                        width={28}
                        alt='User Avatar'
                        className='rounded-full border-2 border-slate-200'
                      />
                    ) : (
                      <div className='w-7 h-7 bg-slate-200 rounded-full flex items-center justify-center'>
                        <span className='text-slate-700 text-xs font-medium'>
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
                      <p className="text-xs leading-none text-muted-foreground truncate">
                        {data?.user?.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => handleNavigation("/user/profile")} className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}  className="cursor-pointer text-red-600 focus:text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* Hamburger Menu Button */}
            <button
              className='text-slate-600 hover:text-slate-900 hover:bg-slate-50 p-2 rounded-lg transition-colors duration-200'
              onClick={toggleMobileMenu}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                </svg>
              ) : (
                <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 6h16M4 12h16M4 18h16' />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <div className={`lg:hidden transition-all duration-300 ease-in-out overflow-hidden ${isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}>
          <div className='py-4 border-t border-gray-100'>
            <ul className='flex flex-col space-y-1'>
              <li>
                <button
                  className='text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors duration-200 font-medium w-full text-left px-4 py-3 rounded-lg'
                  onClick={() => handleNavigation("/")}
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  className='text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors duration-200 font-medium w-full text-left px-4 py-3 rounded-lg'
                  onClick={() => handleNavigation("/view-gigs")}
                >
                  Gigs
                </button>
              </li>
              {status === 'authenticated' && (
                <li>
                  <button
                    className='text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors duration-200 font-medium w-full text-left px-4 py-3 rounded-lg'
                    onClick={() => handleNavigation("/dashboard")}
                  >
                    Dashboard
                  </button>
                </li>
              )}
              <li>
                <button
                  className='text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors duration-200 font-medium w-full text-left px-4 py-3 rounded-lg'
                  onClick={() => handleNavigation("/user/feedback")}
                >
                  Feedback
                </button>
              </li>
            </ul>

            {/* Mobile Get Started Button (when not authenticated) */}
            {status !== 'authenticated' && (
              <div className='mt-4 px-4'>
                <Button
                  className='w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-lg font-medium transition-colors duration-200 shadow-sm'
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