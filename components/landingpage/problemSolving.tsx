import Link from "next/link"

function ProblemSolving() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Solving the <span className="text-blue-600">Work Sharing</span> Challenge
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-green-600 mx-auto rounded-full"></div>
        </div>

        {/* Problem-Solution Grid */}
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Problem Side */}
          <div className="space-y-8">
            <div className="relative">
              {/* Problem Visual */}
              <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl p-8 border border-red-100">
                <div className="space-y-6">
                  {/* Overwhelmed Freelancer Illustration */}
                  <div className="flex items-center justify-center">
                    <div className="relative">
                      {/* Freelancer Avatar */}
                      <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center">
                        <svg className="w-10 h-10 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>

                      {/* Stress indicators */}
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">!</span>
                      </div>

                      {/* Floating problems */}
                      <div className="absolute -top-8 -left-8 bg-red-100 rounded-lg p-2 text-xs text-red-700 font-medium shadow-lg">
                        Too much work
                      </div>
                      <div className="absolute -bottom-8 -right-8 bg-orange-100 rounded-lg p-2 text-xs text-orange-700 font-medium shadow-lg">
                        Hard to find help
                      </div>
                      <div className="absolute -top-8 right-0 bg-yellow-100 rounded-lg p-2 text-xs text-yellow-700 font-medium shadow-lg">
                        Scattered sharing
                      </div>
                    </div>
                  </div>

                  {/* Problem Description */}
                  <div className="text-center space-y-4">
                    <h3 className="text-2xl font-bold text-gray-900">The Problem</h3>
                    <p className="text-lg text-gray-700 leading-relaxed">
                      Freelancers juggle too many projects or struggle to find the right guy to share the work. Clients
                      need talent fast, but connections are messy.
                    </p>
                  </div>

                  {/* Problem Points */}
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <span className="text-gray-600">Overloaded with excess projects</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <span className="text-gray-600">Sharing gigs on X & WhatsApp is inefficient</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <span className="text-gray-600">Hard to find the right person to share work</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Solution Side */}
          <div className="space-y-8">
            <div className="relative">
              {/* Solution Visual */}
              <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl p-8 border border-green-100">
                <div className="space-y-6">
                  {/* Happy Freelancer Illustration */}
                  <div className="flex items-center justify-center">
                    <div className="relative">
                      {/* Freelancer Avatar */}
                      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                        <svg className="w-10 h-10 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>

                      {/* Success indicator */}
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>

                      {/* Floating solutions */}
                      <div className="absolute -top-8 -left-8 bg-green-100 rounded-lg p-2 text-xs text-green-700 font-medium shadow-lg">
                        Easy posting
                      </div>
                      <div className="absolute -bottom-8 -right-8 bg-blue-100 rounded-lg p-2 text-xs text-blue-700 font-medium shadow-lg">
                        Quick connections
                      </div>
                      <div className="absolute -top-8 right-0 bg-emerald-100 rounded-lg p-2 text-xs text-emerald-700 font-medium shadow-lg">
                        WhatsApp ready
                      </div>
                    </div>
                  </div>

                  {/* Solution Description */}
                  <div className="text-center space-y-4">
                    <h3 className="text-2xl font-bold text-gray-900">The Solution</h3>
                    <p className="text-lg text-gray-700 leading-relaxed">
                      PostMyGig lets you list projects, share extra work, or find gigs effortlessly. Connect directly
                      via WhatsApp or email, with your privacy protected.
                    </p>
                  </div>

                  {/* Solution Points */}
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-gray-700 font-medium">Effortless project listing & sharing</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-gray-700 font-medium">Direct WhatsApp & email connections</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-gray-700 font-medium">Privacy protected, secure platform</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Before/After Comparison */}
        <div className="mt-16 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Before */}
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h4 className="text-xl font-bold text-gray-900">Before PostMyGig</h4>
              <ul className="space-y-2 text-gray-600">
                <li>• Posting gigs randomly on X & WhatsApp</li>
                <li>• Struggling to find the right collaborator</li>
                <li>• Overwhelming workload with no relief</li>
                <li>• Time wasted on inefficient sharing</li>
              </ul>
            </div>

            {/* After */}
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h4 className="text-xl font-bold text-gray-900">With PostMyGig</h4>
              <ul className="space-y-2 text-gray-600">
                <li>• Centralized platform for work sharing</li>
                <li>• Find the perfect person for your gig</li>
                <li>• Reduce workload by sharing excess projects</li>
                <li>• Instant connections with right talent</li>
              </ul>
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}

export default ProblemSolving
