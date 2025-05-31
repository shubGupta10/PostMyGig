"use client"

import { useSession } from "next-auth/react"
import Link from "next/link"

function Hero() {
  const { data: session } = useSession();
  return (
    <section id="#about" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Background SVG Pattern */}
      <div className="absolute inset-0 opacity-5">
        <svg className="w-full h-full" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#3B82F6" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#grid)" />
        </svg>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content Section */}
          <div className="text-center lg:text-left space-y-8">
            {/* Trust Signal */}
            <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 border border-green-200">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-green-700">Built in India, trusted by early users</span>
            </div>

            {/* Main Headline */}
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Share & Find <span className="text-blue-600">Freelance Projects</span>,{" "}
                <span className="text-green-600">Free and Simple</span>
              </h1>

              {/* Subheadline */}
              <p className="text-xl sm:text-2xl text-gray-600 leading-relaxed max-w-2xl">
                Post projects, share extra work, or find gigs. Connect safely via WhatsApp or email in minutes.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link
                href={session ? `/view-gigs` : '/auth/login'}
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
                aria-label="Sign up for PostMyGig with Google or X authentication"
              >
                Get Started Free
              </Link>
              <Link
                href="/view-gigs"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-blue-600 bg-white hover:bg-gray-50 border-2 border-blue-600 rounded-lg transition-colors duration-200"
                aria-label="Browse available freelance projects"
              >
                Explore Projects
              </Link>
            </div>

            {/* Additional Trust Elements */}
            <div className="flex flex-row items-center justify-center lg:justify-start gap-2 xs:gap-3 sm:gap-4 md:gap-6 lg:gap-8 text-xs xs:text-sm sm:text-base text-gray-500 overflow-x-auto scrollbar-hide">
              <div className="flex items-center space-x-1.5 xs:space-x-2 sm:space-x-3 flex-shrink-0">
                <svg className="w-3.5 h-3.5 xs:w-4 xs:h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="whitespace-nowrap font-medium text-xs xs:text-sm sm:text-base">No platform fees</span>
              </div>

              <div className="flex items-center space-x-1.5 xs:space-x-2 sm:space-x-3 flex-shrink-0">
                <svg className="w-3.5 h-3.5 xs:w-4 xs:h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="whitespace-nowrap font-medium text-xs xs:text-sm sm:text-base">WhatsApp integration</span>
              </div>

              <div className="flex items-center space-x-1.5 xs:space-x-2 sm:space-x-3 flex-shrink-0">
                <svg className="w-3.5 h-3.5 xs:w-4 xs:h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="whitespace-nowrap font-medium text-xs xs:text-sm sm:text-base">Safe connections</span>
              </div>
            </div>

          </div>

          {/* Visual Section */}
          <div className="relative">
            <div className="relative bg-white rounded-2xl shadow-2xl p-8 border border-gray-200">
              {/* Mock App Interface */}
              <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-sm">PG</span>
                    </div>
                    <span className="font-semibold text-gray-900">PostMyGig</span>
                  </div>
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  </div>
                </div>

                {/* Mock Project Card - Updated to match actual design */}
                <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                  {/* Header with title, description and status */}
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <h3 className="text-xl font-bold text-gray-900">Full Stack Ecommerce App</h3>
                      <p className="text-gray-600">Need an developer to build me an Ecommerce application.</p>
                    </div>
                    <div className="flex items-center space-x-2 bg-white rounded-full px-3 py-1 border border-gray-200">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm font-medium text-gray-700">Active</span>
                    </div>
                  </div>

                  {/* Required Skills Section */}
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                        />
                      </svg>
                      <span className="text-sm font-medium text-gray-700">Required Skills</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 text-sm font-medium text-green-700 bg-white border border-green-200 rounded-full">
                        node
                      </span>
                      <span className="px-3 py-1 text-sm font-medium text-green-700 bg-white border border-green-200 rounded-full">
                        react
                      </span>
                      <span className="px-3 py-1 text-sm font-medium text-green-700 bg-white border border-green-200 rounded-full">
                        nextjs
                      </span>
                      <span className="px-3 py-1 text-sm font-medium text-green-700 bg-white border border-green-200 rounded-full">
                        mongodb
                      </span>
                    </div>
                  </div>

                  {/* Footer with timing and CTA */}
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        <span>Posted 20h ago</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span>12 days left</span>
                      </div>
                    </div>
                    <button className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors flex items-center space-x-1">
                      <span>Open Gig</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Mock Stats */}
                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200 text-sm">
                  <div className="text-center">
                    <div className="font-medium text-blue-500">Post Projects</div>
                    <div className="text-gray-500">List work quickly</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium text-blue-500">Get Pings</div>
                    <div className="text-gray-500">Replies via Notifications</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium text-blue-500">Connect Freely</div>
                    <div className="text-gray-500">Talk directly, no limits</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute -top-4 -right-4 bg-green-100 rounded-full p-3 shadow-lg">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <div className="absolute -bottom-4 -left-4 bg-blue-100 rounded-full p-3 shadow-lg">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
