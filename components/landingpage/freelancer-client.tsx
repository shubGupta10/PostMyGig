import Link from "next/link"

function FreelancerClient() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Built for <span className="text-blue-600">You</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Whether you're sharing work or seeking talent, PostMyGig has you covered
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-green-600 mx-auto rounded-full mt-6"></div>
        </div>

        {/* Two-Column Grid */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Freelancers Card */}
          <div className="group">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl shadow-xl border border-blue-200 overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              {/* Image Section */}
              <div className="relative h-64 bg-gradient-to-br from-blue-400 to-blue-600 overflow-hidden">
                {/* Placeholder for Indian freelancer coding */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative">
                    {/* Laptop mockup */}
                    <div className="w-32 h-20 bg-gray-800 rounded-lg shadow-lg transform rotate-12">
                      <div className="w-full h-14 bg-gray-900 rounded-t-lg p-2">
                        <div className="w-full h-full bg-green-400 rounded opacity-80"></div>
                      </div>
                    </div>

                    {/* Freelancer avatar */}
                    <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-white rounded-full shadow-lg flex items-center justify-center">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    </div>

                    {/* Code elements floating */}
                    <div className="absolute -top-2 -right-2 bg-white rounded-lg p-2 shadow-lg">
                      <div className="text-xs font-mono text-gray-700">{"<code/>"}</div>
                    </div>
                    <div className="absolute top-8 -left-8 bg-green-100 rounded-lg p-2 shadow-lg">
                      <div className="text-xs font-medium text-green-700">React</div>
                    </div>
                  </div>
                </div>

                {/* Overlay pattern */}
                <div className="absolute inset-0 bg-blue-600 opacity-20"></div>
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23ffffff' fillOpacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                  }}
                ></div>
              </div>

              {/* Content Section */}
              <div className="p-8">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                      />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">For Freelancers</h3>
                </div>

                <p className="text-lg text-gray-700 leading-relaxed mb-6">
                  List your skills, share extra projects, or find work. Connect safely, no hassle.
                </p>

                {/* Benefits */}
                <div className="space-y-3 mb-8">
                  <div className="flex items-center space-x-3">
                    <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-gray-700">Share excess work easily</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-gray-700">Connect via WhatsApp/Email</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-gray-700">No platform fees</span>
                  </div>
                </div>

                {/* CTA */}
                <Link
                  href="/post-project"
                  className="w-full inline-flex items-center justify-center px-6 py-4 text-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl group-hover:scale-105 transform"
                  aria-label="Post your skills and start sharing work"
                >
                  Post Your Skills
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>

          {/* Clients Card */}
          <div className="group">
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl shadow-xl border border-green-200 overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              {/* Image Section */}
              <div className="relative h-64 bg-gradient-to-br from-green-400 to-green-600 overflow-hidden">
                {/* Placeholder for startup team */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative">
                    {/* Team avatars */}
                    <div className="flex items-center space-x-2">
                      <div className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      </div>
                      <div className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      </div>
                      <div className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center">
                        <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>

                    {/* Project elements */}
                    <div className="absolute -top-8 -left-4 bg-white rounded-lg p-2 shadow-lg">
                      <div className="text-xs font-medium text-gray-700">New Project</div>
                    </div>
                    <div className="absolute -bottom-6 -right-4 bg-green-100 rounded-lg p-2 shadow-lg">
                      <div className="text-xs font-medium text-green-700">Hiring</div>
                    </div>
                    <div className="absolute top-6 -right-8 bg-blue-100 rounded-lg p-2 shadow-lg">
                      <div className="text-xs font-medium text-blue-700">Fast</div>
                    </div>
                  </div>
                </div>

                {/* Overlay pattern */}
                <div className="absolute inset-0 bg-green-600 opacity-20"></div>
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23ffffff' fillOpacity='0.1'%3E%3Cpath d='M30 30c0-11.046-8.954-20-20-20s-20 8.954-20 20 8.954 20 20 20 20-8.954 20-20z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                  }}
                ></div>
              </div>

              {/* Content Section */}
              <div className="p-8">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6"
                      />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">For Clients</h3>
                </div>

                <p className="text-lg text-gray-700 leading-relaxed mb-6">
                  Need talent? Post projects and connect with freelancers fast, securely.
                </p>

                {/* Benefits */}
                <div className="space-y-3 mb-8">
                  <div className="flex items-center space-x-3">
                    <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-gray-700">Find talent quickly</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-gray-700">Direct communication</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-gray-700">Secure connections</span>
                  </div>
                </div>

                {/* CTA */}
                <Link
                  href="/post-project"
                  className="w-full inline-flex items-center justify-center px-6 py-4 text-lg font-semibold text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl group-hover:scale-105 transform"
                  aria-label="Post a project and find freelancers"
                >
                  Find Freelancers
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default FreelancerClient
