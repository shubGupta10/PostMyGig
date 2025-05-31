"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { MessageSquareIcon, MailIcon, ShieldCheckIcon, CheckIcon } from "lucide-react";

export default function HowItWorks() {
  const [hoveredStep, setHoveredStep] = useState<number | null>(null);

  return (
    <section id="how-it-works" className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            <span className="text-blue-600">Post</span>,{" "}
            <span className="text-green-600">Connect</span>, Work –{" "}
            <span className="text-gray-900">In Minutes</span>
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            Simple steps to share your work or find the perfect collaborator
          </p>
          <div className="w-16 h-1 bg-blue-600 mx-auto rounded-full mt-6"></div>
        </div>

        {/* Steps Timeline */}
        <div className="relative">
          {/* Timeline Line */}
          <motion.div 
            className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 bg-blue-200 transform -translate-y-1/2 z-0"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          />

          {/* Steps Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-10 relative z-10">
            {/* Step 1: Post a Project */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              onHoverStart={() => setHoveredStep(1)}
              onHoverEnd={() => setHoveredStep(null)}
              className="group h-full flex flex-col"
            >
              <motion.div 
                className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 md:p-8 h-full flex flex-col"
                whileHover={{ 
                  y: -8,
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" 
                }}
                transition={{ duration: 0.3 }}
              >
                {/* Step Number */}
                <motion.div 
                  className="flex items-center justify-center w-12 h-12 md:w-16 md:h-16 bg-blue-600 text-white rounded-full font-bold text-xl mx-auto mb-5 md:mb-6"
                  animate={{ 
                    scale: hoveredStep === 1 ? 1.1 : 1 
                  }}
                  transition={{ duration: 0.3 }}
                >
                  1
                </motion.div>

                <h3 className="text-xl md:text-2xl font-bold text-gray-900 text-center mb-3">
                  Post Your Project
                </h3>
                
                <p className="text-gray-600 text-center mb-5 md:mb-6">
                  List your skills or project needs with optional contact details.
                </p>

                <div className="bg-gray-50 rounded-lg p-3 md:p-4 border border-gray-200 mt-auto">
                  <div className="space-y-3">
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
                      
                      {/* Contact Options */}
                      <div className="border-t border-gray-200 pt-2 md:pt-3">
                        <div className="text-xs text-gray-500 mb-2">Contact Methods (Optional)</div>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <input type="checkbox" className="w-3 h-3 text-blue-600 border-gray-300 rounded" />
                            <span className="text-xs text-gray-600">Enable built-in chat</span>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <div className="w-full h-2 bg-gray-200 rounded mb-1"></div>
                              <div className="text-xs text-gray-400">WhatsApp (Optional)</div>
                            </div>
                            <div>
                              <div className="w-full h-2 bg-gray-200 rounded mb-1"></div>
                              <div className="text-xs text-gray-400">Email (Optional)</div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Security Note */}
                      <div className="bg-green-50 border border-green-200 rounded p-2">
                        <div className="flex items-center space-x-1">
                          <ShieldCheckIcon className="w-3 h-3 text-green-600" />
                          <span className="text-xs text-green-700 font-medium">Your privacy is protected</span>
                        </div>
                      </div>

                      {/* Post Button */}
                      <Link href="/add-gigs" className="block">
                        <button className="w-full bg-blue-600 text-white py-2 rounded text-sm font-medium transition-colors hover:bg-blue-700">
                          Post Project
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Step 2: Get Matched */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              onHoverStart={() => setHoveredStep(2)}
              onHoverEnd={() => setHoveredStep(null)}
              className="group h-full flex flex-col"
            >
              <motion.div 
                className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 md:p-8 h-full flex flex-col"
                whileHover={{ 
                  y: -8,
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" 
                }}
                transition={{ duration: 0.3 }}
              >
                {/* Step Number */}
                <motion.div 
                  className="flex items-center justify-center w-12 h-12 md:w-16 md:h-16 bg-green-600 text-white rounded-full font-bold text-xl mx-auto mb-5 md:mb-6"
                  animate={{ 
                    scale: hoveredStep === 2 ? 1.1 : 1 
                  }}
                  transition={{ duration: 0.3 }}
                >
                  2
                </motion.div>

                <h3 className="text-xl md:text-2xl font-bold text-gray-900 text-center mb-3">
                  Get Matched
                </h3>
                
                <p className="text-gray-600 text-center mb-5 md:mb-6">
                  Receive instant notifications when someone is interested in your project or skills.
                </p>

                <div className="bg-gray-50 rounded-lg p-3 md:p-4 border border-gray-200 mt-auto">
                  <div className="space-y-3">
                    {/* Notification Header */}
                    <div className="flex items-center justify-between pb-2 border-b border-gray-200">
                      <span className="text-sm font-medium text-gray-700">Notifications</span>
                      <motion.div 
                        className="w-2 h-2 bg-green-500 rounded-full"
                        animate={{ 
                          opacity: [1, 0.5, 1] 
                        }}
                        transition={{ 
                          repeat: Infinity, 
                          duration: 1.5 
                        }}
                      />
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
                            <div className="text-xs text-gray-600">Someone wants to work on your React project</div>
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
                            <div className="text-sm font-medium text-gray-900">Perfect Match</div>
                            <div className="text-xs text-gray-600">Project matches your skillset</div>
                            <div className="text-xs text-blue-600 font-medium mt-1">5 min ago</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Connection Options Preview */}
                    <div className="bg-blue-50 border border-blue-200 rounded p-2">
                      <div className="text-xs text-blue-700 font-medium mb-1">Available connection methods:</div>
                      <div className="flex flex-wrap gap-1">
                        <span className="px-2 py-1 bg-white text-blue-700 text-xs rounded border border-blue-200">💬 Built-in Chat</span>
                        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">📱 WhatsApp</span>
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">📧 Email</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Step 3: Connect & Collaborate */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
              onHoverStart={() => setHoveredStep(3)}
              onHoverEnd={() => setHoveredStep(null)}
              className="md:col-span-2 lg:col-span-1 md:max-w-md md:mx-auto lg:max-w-none lg:mx-0 w-full"
            >
              <motion.div 
                className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 md:p-8 h-full flex flex-col"
                whileHover={{ 
                  y: -8,
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" 
                }}
                transition={{ duration: 0.3 }}
              >
                {/* Step Number */}
                <motion.div 
                  className="flex items-center justify-center w-12 h-12 md:w-16 md:h-16 bg-purple-600 text-white rounded-full font-bold text-xl mx-auto mb-5 md:mb-6"
                  animate={{ 
                    scale: hoveredStep === 3 ? 1.1 : 1 
                  }}
                  transition={{ duration: 0.3 }}
                >
                  3
                </motion.div>

                <h3 className="text-xl md:text-2xl font-bold text-gray-900 text-center mb-3">
                  Connect & Collaborate
                </h3>
                
                <p className="text-gray-600 text-center mb-5 md:mb-6">
                  Choose your preferred way to connect: our secure chat system, WhatsApp, email, or any method the freelancer provided.
                </p>

                <div className="bg-gray-50 rounded-lg p-3 md:p-4 border border-gray-200 mt-auto">
                  <div className="space-y-3">
                    {/* Connection Options Header */}
                    <div className="text-sm font-medium text-gray-700 pb-2 border-b border-gray-200">
                      Choose how to connect:
                    </div>

                    {/* Connection Options */}
                    <div className="space-y-2">
                      <motion.div
                        className="bg-white border border-blue-200 rounded-lg p-3"
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <MessageSquareIcon className="w-4 h-4 text-blue-600" />
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">Built-in Chat</div>
                              <div className="text-xs text-gray-600">Secure & private messaging</div>
                            </div>
                          </div>
                          <button className="bg-blue-600 text-white px-3 py-1 rounded text-xs font-medium hover:bg-blue-700 transition-colors">
                            Start Chat
                          </button>
                        </div>
                      </motion.div>

                      <motion.div
                        className="bg-white border border-green-200 rounded-lg p-3"
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                              <span className="text-sm">📱</span>
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">WhatsApp</div>
                              <div className="text-xs text-gray-600">+91 98765 43210</div>
                            </div>
                          </div>
                          <button className="bg-green-600 text-white px-3 py-1 rounded text-xs font-medium hover:bg-green-700 transition-colors">
                            Message
                          </button>
                        </div>
                      </motion.div>

                      <motion.div
                        className="bg-white border border-gray-200 rounded-lg p-3"
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                              <MailIcon className="w-4 h-4 text-gray-600" />
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">Email</div>
                              <div className="text-xs text-gray-600">amit.dev@example.com</div>
                            </div>
                          </div>
                          <button className="bg-gray-600 text-white px-3 py-1 rounded text-xs font-medium hover:bg-gray-700 transition-colors">
                            Email
                          </button>
                        </div>
                      </motion.div>

                      {/* Privacy Note */}
                      <div className="bg-yellow-50 border border-yellow-200 rounded p-2">
                        <div className="flex items-center space-x-1">
                          <ShieldCheckIcon className="w-3 h-3 text-yellow-600" />
                          <span className="text-xs text-yellow-700 font-medium">Contact info shared only when both parties agree</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>

      </div>
    </section>
  );
}