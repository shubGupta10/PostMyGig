"use client"

import { motion } from "framer-motion"
import { CheckIcon, UserIcon, AlertTriangleIcon, ShieldCheckIcon } from "lucide-react"

export default function ProblemSolving() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Solving the <span className="text-blue-600">Work Sharing</span> Challenge
          </h2>
          <div className="w-16 h-1 bg-blue-600 mx-auto rounded-full"></div>
        </motion.div>

        {/* Problem-Solution Grid - Always in same row */}
        <div className="grid grid-cols-2 gap-4 md:gap-8 lg:gap-12 items-start mb-16">
          {/* Problem Side */}
          <motion.div
            className="space-y-6 md:space-y-8"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 lg:p-8 border-2 border-red-200 shadow-lg">
              <div className="space-y-4 md:space-y-6">
                {/* Problem Icon */}
                <div className="flex items-center justify-center">
                  <div className="w-16 h-16 md:w-20 lg:w-24 md:h-20 lg:h-24 bg-red-100 rounded-full flex items-center justify-center relative">
                    <UserIcon className="w-8 h-8 md:w-10 lg:w-12 md:h-10 lg:h-12 text-red-600" />
                    <div className="absolute -top-1 -right-1 md:-top-2 md:-right-2 w-6 h-6 md:w-8 md:h-8 bg-red-500 rounded-full flex items-center justify-center">
                      <AlertTriangleIcon className="w-3 h-3 md:w-4 lg:w-5 md:h-4 lg:h-5 text-white" />
                    </div>
                  </div>
                </div>

                {/* Problem Description */}
                <div className="text-center space-y-2 md:space-y-4">
                  <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-900">The Problem</h3>
                  <p className="text-sm md:text-base lg:text-lg text-gray-700 leading-relaxed">
                    Freelancers juggle too many projects or struggle to find the right person to share the work. Clients
                    need talent fast, but connections are messy.
                  </p>
                </div>

                {/* Problem Points */}
                <div className="space-y-2 md:space-y-3 lg:space-y-4">
                  {[
                    { color: "red", text: "Overloaded with excess projects", icon: "🔥" },
                    { color: "orange", text: "Sharing gigs on X & WhatsApp is inefficient", icon: "📱" },
                    { color: "yellow", text: "Hard to find the right person to share work", icon: "🔍" },
                  ].map((point, index) => (
                    <motion.div
                      key={index}
                      className="flex items-center space-x-2 md:space-x-3 lg:space-x-4 p-2 md:p-3 lg:p-4 bg-gray-50 rounded-lg"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.8 + index * 0.2 }}
                    >
                      <div className="text-lg md:text-xl lg:text-2xl flex-shrink-0">{point.icon}</div>
                      <span className="text-xs md:text-sm lg:text-base text-gray-700 font-medium leading-tight">
                        {point.text}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Solution Side */}
          <motion.div
            className="space-y-6 md:space-y-8"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 lg:p-8 border-2 border-green-200 shadow-lg">
              <div className="space-y-4 md:space-y-6">
                {/* Solution Icon */}
                <div className="flex items-center justify-center">
                  <div className="w-16 h-16 md:w-20 lg:w-24 md:h-20 lg:h-24 bg-green-100 rounded-full flex items-center justify-center relative">
                    <UserIcon className="w-8 h-8 md:w-10 lg:w-12 md:h-10 lg:h-12 text-green-600" />
                    <div className="absolute -top-1 -right-1 md:-top-2 md:-right-2 w-6 h-6 md:w-8 md:h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <CheckIcon className="w-3 h-3 md:w-4 lg:w-5 md:h-4 lg:h-5 text-white" />
                    </div>
                  </div>
                </div>

                {/* Solution Description */}
                <div className="text-center space-y-2 md:space-y-4">
                  <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-900">The Solution</h3>
                  <p className="text-sm md:text-base lg:text-lg text-gray-700 leading-relaxed">
                    PostMyGig lets you list projects, share extra work, or find gigs effortlessly. Connect directly
                    through our real-time chat system, or reach out via email, WhatsApp, or any contact method the
                    freelancer has provided.
                  </p>
                </div>

                {/* Solution Points */}
                <div className="space-y-2 md:space-y-3 lg:space-y-4">
                  {[
                    { text: "Effortless project listing & sharing", icon: "✨" },
                    { text: "Built-in chat & email connections", icon: "💬" },
                    { text: "Privacy protected, secure platform", icon: "🔒" },
                  ].map((point, index) => (
                    <motion.div
                      key={index}
                      className="flex items-center space-x-2 md:space-x-3 lg:space-x-4 p-2 md:p-3 lg:p-4 bg-green-50 rounded-lg"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.8 + index * 0.2 }}
                    >
                      <div className="text-lg md:text-xl lg:text-2xl flex-shrink-0">{point.icon}</div>
                      <span className="text-xs md:text-sm lg:text-base text-gray-700 font-medium leading-tight">
                        {point.text}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Before/After Comparison */}
        <motion.div
          className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border-2 border-gray-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <div className="text-center mb-6 md:mb-8">
            <h3 className="text-xl md:text-2xl font-bold text-green-500 mb-2">The Transformation</h3>
            <p className="text-sm md:text-base text-gray-600">See how PostMyGig changes the freelancing game</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {/* Before */}
            <motion.div
              className="text-center space-y-4 md:space-y-6 p-4 md:p-6 bg-red-50 rounded-xl border border-red-200"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <div className="w-12 h-12 md:w-16 md:h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                <AlertTriangleIcon className="w-6 h-6 md:w-8 md:h-8 text-red-600" />
              </div>
              <h4 className="text-lg md:text-xl font-bold text-gray-900">Before PostMyGig</h4>
              <div className="space-y-2 md:space-y-3">
                {[
                  "Posting gigs randomly on X & WhatsApp",
                  "Struggling to find the right collaborator",
                  "Overwhelming workload with no relief",
                  "Time wasted on inefficient sharing",
                ].map((item, index) => (
                  <div key={index} className="flex items-center space-x-3 text-left">
                    <div className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0"></div>
                    <span className="text-sm md:text-base text-gray-600">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* After */}
            <motion.div
              className="text-center space-y-4 md:space-y-6 p-4 md:p-6 bg-green-50 rounded-xl border border-green-200"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <div className="w-12 h-12 md:w-16 md:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <ShieldCheckIcon className="w-6 h-6 md:w-8 md:h-8 text-green-600" />
              </div>
              <h4 className="text-lg md:text-xl font-bold text-gray-900">With PostMyGig</h4>
              <div className="space-y-2 md:space-y-3">
                {[
                  "Centralized platform for work sharing",
                  "Find the perfect person for your gig",
                  "Reduce workload by sharing excess projects",
                  "Instant connections with right talent",
                ].map((item, index) => (
                  <div key={index} className="flex items-center space-x-3 text-left">
                    <CheckIcon className="w-3 h-3 md:w-4 md:h-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm md:text-base text-gray-700 font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
