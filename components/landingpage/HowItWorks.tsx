import Link from "next/link"

function HowItWorks() {
  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            <span className="text-blue-600">Post</span>, <span className="text-green-600">Connect</span>, Work –{" "}
            <span className="text-gray-900">In Minutes</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Simple steps to share your work or find the perfect collaborator
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-green-600 mx-auto rounded-full mt-6"></div>
        </div>

        {/* Steps Timeline */}
        <div className="relative">
          {/* Timeline Line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-blue-200 via-green-200 to-blue-200 transform -translate-y-1/2 z-0"></div>

          {/* Steps Grid */}
          <div className="grid lg:grid-cols-3 gap-8 lg:gap-12 relative z-10">
            {/* Step 1: Post a Project */}
            <div className="group">
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                {/* Step Number */}
                <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full font-bold text-xl mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  1
                </div>

                {/* Step Title */}
                <h3 className="text-2xl font-bold text-gray-900 text-center mb-4">Post a Project</h3>
                <p className="text-gray-600 text-center mb-6">List your skills or client needs quickly.</p>

                {/* Visual Mockup - Project Form */}
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="space-y-4">
                    {/* Form Header */}
                    <div className="flex items-center space-x-2 pb-2 border-b border-gray-200">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span className="text-sm font-medium text-gray-700">New Project</span>
                    </div>

                    {/* Form Fields */}
                    <div className="space-y-3">
                      <div>
                        <div className="w-full h-3 bg-gray-200 rounded mb-1"></div>
                        <div className="text-xs text-gray-500">Project Title</div>
                      </div>
                      <div>
                        <div className="w-full h-8 bg-gray-200 rounded mb-1"></div>
                        <div className="text-xs text-gray-500">Description</div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <div className="w-full h-3 bg-gray-200 rounded mb-1"></div>
                          <div className="text-xs text-gray-500">Budget</div>
                        </div>
                        <div>
                          <div className="w-full h-3 bg-gray-200 rounded mb-1"></div>
                          <div className="text-xs text-gray-500">Timeline</div>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">React</span>
                        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">Node.js</span>
                        <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded">+</span>
                      </div>
                    </div>

                    {/* Security Note */}
                    <div className="bg-green-50 border border-green-200 rounded p-2">
                      <div className="flex items-center space-x-1">
                        <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="text-xs text-green-700 font-medium">No contact info required</span>
                      </div>
                    </div>

                    {/* Post Button */}
                    <button className="w-full bg-blue-600 text-white py-2 rounded text-sm font-medium">
                      Post Project
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2: Get Pings */}
            <div className="group">
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                {/* Step Number */}
                <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full font-bold text-xl mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  2
                </div>

                {/* Step Title */}
                <h3 className="text-2xl font-bold text-gray-900 text-center mb-4">Get Pings</h3>
                <p className="text-gray-600 text-center mb-6">Receive interest safely via email or WhatsApp.</p>

                {/* Visual Mockup - Notifications */}
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="space-y-3">
                    {/* Notification Header */}
                    <div className="flex items-center justify-between pb-2 border-b border-gray-200">
                      <span className="text-sm font-medium text-gray-700">Notifications</span>
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    </div>

                    {/* Notification Items */}
                    <div className="space-y-2">
                      <div className="bg-white border border-green-200 rounded-lg p-3">
                        <div className="flex items-start space-x-3">
                          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                            <span className="text-xs font-bold text-green-600">A</span>
                          </div>
                          <div className="flex-1">
                            <div className="text-sm font-medium text-gray-900">New Interest!</div>
                            <div className="text-xs text-gray-600">Someone wants your React project</div>
                            <div className="text-xs text-green-600 font-medium mt-1">2 min ago</div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white border border-blue-200 rounded-lg p-3">
                        <div className="flex items-start space-x-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-xs font-bold text-blue-600">R</span>
                          </div>
                          <div className="flex-1">
                            <div className="text-sm font-medium text-gray-900">Project Match</div>
                            <div className="text-xs text-gray-600">Perfect fit for your skills</div>
                            <div className="text-xs text-blue-600 font-medium mt-1">5 min ago</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Contact Options */}
                    <div className="bg-blue-50 border border-blue-200 rounded p-2">
                      <div className="text-xs text-blue-700 font-medium mb-1">Choose how to connect:</div>
                      <div className="flex space-x-2">
                        <button className="flex-1 bg-green-600 text-white py-1 px-2 rounded text-xs font-medium">
                          WhatsApp
                        </button>
                        <button className="flex-1 bg-blue-600 text-white py-1 px-2 rounded text-xs font-medium">
                          Email
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3: Connect Freely */}
            <div className="group">
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                {/* Step Number */}
                <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-green-500 text-white rounded-full font-bold text-xl mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  3
                </div>

                {/* Step Title */}
                <h3 className="text-2xl font-bold text-gray-900 text-center mb-4">Connect Freely</h3>
                <p className="text-gray-600 text-center mb-6">Chat directly on WhatsApp or email, your way.</p>

                {/* Visual Mockup - WhatsApp Chat */}
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="space-y-3">
                    {/* WhatsApp Header */}
                    <div className="bg-green-600 text-white p-2 rounded-t-lg flex items-center space-x-2">
                      <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                        <span className="text-xs font-bold text-green-600">A</span>
                      </div>
                      <div>
                        <div className="text-sm font-medium">Amit K.</div>
                        <div className="text-xs opacity-90">React Developer</div>
                      </div>
                      <div className="ml-auto">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                        </svg>
                      </div>
                    </div>

                    {/* Chat Messages */}
                    <div className="space-y-2 p-2">
                      <div className="bg-white rounded-lg p-2 max-w-xs">
                        <div className="text-xs text-gray-800">
                          Hi! I'm interested in your React project. Can we discuss?
                        </div>
                        <div className="text-xs text-gray-500 mt-1">2:30 PM</div>
                      </div>
                      <div className="bg-green-500 text-white rounded-lg p-2 max-w-xs ml-auto">
                        <div className="text-xs">Let's talk about the requirements.</div>
                        <div className="text-xs opacity-75 mt-1">2:32 PM</div>
                      </div>
                      <div className="bg-white rounded-lg p-2 max-w-xs">
                        <div className="text-xs text-gray-800">Perfect! When can we start?</div>
                        <div className="text-xs text-gray-500 mt-1">2:35 PM</div>
                      </div>
                    </div>

                    {/* Privacy Note */}
                    <div className="bg-yellow-50 border border-yellow-200 rounded p-2">
                      <div className="flex items-center space-x-1">
                        <svg className="w-3 h-3 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="text-xs text-yellow-700 font-medium">Contact shared securely</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Security Note */}
        <div className="mt-16 text-center">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 max-w-4xl mx-auto">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Privacy Protected</h3>
            </div>
            <p className="text-lg text-gray-600 mb-6">
              Your contact info stays private until you choose to share. Connect safely and build trust naturally.
            </p>
            <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>No spam or unwanted contacts</span>
              </div>
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>You control who sees your info</span>
              </div>
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Secure platform, trusted connections</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HowItWorks
