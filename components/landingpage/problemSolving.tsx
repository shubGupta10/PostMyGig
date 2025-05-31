"use client"

import { motion } from "framer-motion"
import { CheckIcon, UserIcon, AlertTriangleIcon, ShieldCheckIcon } from "lucide-react"

export default function ProblemSolving() {
  return (
    <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <motion.div
          className="text-center mb-12 sm:mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Solving the <span className="text-blue-600">Work Sharing</span> Challenge
          </h2>
          <div className="w-12 sm:w-16 h-1 bg-blue-600 mx-auto rounded-full"></div>
        </motion.div>

        {/* Problem-Solution Grid - Column on mobile, Row on desktop */}
        <div className="flex flex-col min-[800px]:grid min-[800px]:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-start mb-12 sm:mb-16">
          {/* Problem Side */}
          <motion.div
            className="w-full space-y-6 md:space-y-8"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="bg-white rounded-xl md:rounded-2xl p-4 sm:p-6 lg:p-8 border-2 border-red-200 shadow-lg">
              <div className="space-y-4 sm:space-y-6">
                {/* Problem Icon */}
                <div className="flex items-center justify-center">
                  <div className="w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 lg:w-24 lg:h-24 bg-red-100 rounded-full flex items-center justify-center relative">
                    <UserIcon className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 text-red-600" />
                    <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 bg-red-500 rounded-full flex items-center justify-center">
                      <AlertTriangleIcon className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-4 md:h-4 lg:w-5 lg:h-5 text-white" />
                    </div>
                  </div>
                </div>

                {/* Problem Description */}
                <div className="text-center space-y-2 sm:space-y-3 md:space-y-4">
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">The Problem</h3>
                  <p className="text-sm sm:text-base lg:text-lg text-gray-700 leading-relaxed px-2">
                    Freelancers juggle too many projects or struggle to find the right person to share the work. Clients
                    need talent fast, but connections are messy.
                  </p>
                </div>

                {/* Problem Points */}
                <div className="space-y-2 sm:space-y-3 lg:space-y-4">
                  {[
                    { color: "red", text: "Overloaded with excess projects", icon: "🔥" },
                    { color: "orange", text: "Sharing gigs on X & WhatsApp is inefficient", icon: "📱" },
                    { color: "yellow", text: "Hard to find the right person to share work", icon: "🔍" },
                  ].map((point, index) => (
                    <motion.div
                      key={index}
                      className="flex items-center justify-center space-x-3 sm:space-x-4 p-3 sm:p-4 bg-gray-50 rounded-lg"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.8 + index * 0.2 }}
                    >
                      <div className="text-base sm:text-lg md:text-xl lg:text-2xl flex-shrink-0">{point.icon}</div>
                      <span className="text-xs sm:text-sm lg:text-base text-gray-700 font-medium leading-relaxed text-center">
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
            className="w-full space-y-6 md:space-y-8"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="bg-white rounded-xl md:rounded-2xl p-4 sm:p-6 lg:p-8 border-2 border-green-200 shadow-lg">
              <div className="space-y-4 sm:space-y-6">
                {/* Solution Icon */}
                <div className="flex items-center justify-center">
                  <div className="w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 lg:w-24 lg:h-24 bg-green-100 rounded-full flex items-center justify-center relative">
                    <UserIcon className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 text-green-600" />
                    <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <CheckIcon className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-4 md:h-4 lg:w-5 lg:h-5 text-white" />
                    </div>
                  </div>
                </div>

                {/* Solution Description */}
                <div className="text-center space-y-2 sm:space-y-3 md:space-y-4">
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">The Solution</h3>
                  <p className="text-sm sm:text-base lg:text-lg text-gray-700 leading-relaxed px-2">
                    PostMyGig lets you list work, share tasks, or find gigs. Contact others directly using chat, email,
                    WhatsApp, or any contact method the freelancer has added.
                  </p>
                </div>

                {/* Solution Points */}
                <div className="space-y-2 sm:space-y-3 lg:space-y-4">
                  {[
                    { text: "Effortless project listing & sharing", icon: "✨" },
                    { text: "Built-in chat & email connections", icon: "💬" },
                    { text: "Privacy protected, secure platform", icon: "🔒" },
                  ].map((point, index) => (
                    <motion.div
                      key={index}
                      className="flex items-center justify-center space-x-3 sm:space-x-4 p-3 sm:p-4 bg-green-50 rounded-lg"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.8 + index * 0.2 }}
                    >
                      <div className="text-base sm:text-lg md:text-xl lg:text-2xl flex-shrink-0">{point.icon}</div>
                      <span className="text-xs sm:text-sm lg:text-base text-gray-700 font-medium leading-relaxed text-center">
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
          className="bg-white rounded-2xl p-4 sm:p-6 md:p-8 shadow-lg border-2 border-gray-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <div className="text-center mb-6 sm:mb-8">
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-green-500 mb-2">The Transformation</h3>
            <p className="text-sm sm:text-base text-gray-600">See how PostMyGig changes the freelancing game</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            {/* Before */}
            <motion.div
              className="text-center space-y-4 sm:space-y-6 p-4 sm:p-6 bg-red-50 rounded-xl border border-red-200"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                <AlertTriangleIcon className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-red-600" />
              </div>
              <h4 className="text-base sm:text-lg md:text-xl font-bold text-gray-900">Before PostMyGig</h4>
              <div className="space-y-2 sm:space-y-3">
                {[
                  "Posting gigs randomly on X & WhatsApp",
                  "Struggling to find the right collaborator",
                  "Overwhelming workload with no relief",
                  "Time wasted on inefficient sharing",
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-center space-x-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0"></div>
                    <span className="text-xs sm:text-sm md:text-base text-gray-600 leading-relaxed text-center">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* After */}
            <motion.div
              className="text-center space-y-4 sm:space-y-6 p-4 sm:p-6 bg-green-50 rounded-xl border border-green-200"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <ShieldCheckIcon className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-green-600" />
              </div>
              <h4 className="text-base sm:text-lg md:text-xl font-bold text-gray-900">With PostMyGig</h4>
              <div className="space-y-2 sm:space-y-3">
                {[
                  "Centralized platform for work sharing",
                  "Find the perfect person for your gig",
                  "Reduce workload by sharing excess projects",
                  "Instant connections with right talent",
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-center space-x-3">
                    <CheckIcon className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 flex-shrink-0" />
                    <span className="text-xs sm:text-sm md:text-base text-gray-700 font-medium leading-relaxed text-center">
                      {item}
                    </span>
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
