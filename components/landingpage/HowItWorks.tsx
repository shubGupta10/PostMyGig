"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  MessageSquareIcon,
  MailIcon,
  ShieldCheckIcon,
  CheckIcon,
  PlusIcon,
  BellIcon,
  ArrowRightIcon,
  UserIcon,
  ClockIcon,
} from "lucide-react"

export default function HowItWorks() {
  const [hoveredStep, setHoveredStep] = useState<number | null>(null)

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut" as const,
      },
    },
  }

  return (
    <section id="how-it-works" className="py-16 md:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <motion.div
          className="text-center mb-12 md:mb-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            How <span className="text-primary">PostMyGig</span> Works
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Three simple steps to connect with freelancers and get work done
          </p>
          <div className="w-16 h-1 bg-primary mx-auto rounded-full mt-6"></div>
        </motion.div>

        {/* Steps Container */}
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="relative">
          {/* Connection Line */}
          <div className="hidden lg:flex absolute top-24 left-0 right-0 items-center justify-center z-0">
            <div className="flex items-center w-full max-w-4xl mx-auto px-32">
              <motion.div
                className="flex-1 h-0.5 bg-gradient-to-r from-primary via-accent-foreground to-primary"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1.2, delay: 0.8 }}
              />
              <ArrowRightIcon className="w-6 h-6 text-primary mx-4" />
              <motion.div
                className="flex-1 h-0.5 bg-gradient-to-r from-primary via-accent-foreground to-primary"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1.2, delay: 1 }}
              />
            </div>
          </div>

          {/* Steps Grid */}
          <div className="grid lg:grid-cols-3 gap-8 lg:gap-12 relative z-10">
            {/* Step 1: Post Your Project */}
            <motion.div
              variants={itemVariants}
              onHoverStart={() => setHoveredStep(1)}
              onHoverEnd={() => setHoveredStep(null)}
              className="group"
            >
              <motion.div
                className="bg-card rounded-3xl border border-border p-8 h-full flex flex-col relative overflow-hidden"
                whileHover={{
                  y: -4,
                  transition: { duration: 0.3 },
                }}
              >
                {/* Step Number Badge */}
                {/* <motion.div
                  className="absolute -top-4 -right-4 w-16 h-16 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-xl shadow-lg"
                  animate={{
                    scale: hoveredStep === 1 ? 1.1 : 1,
                    rotate: hoveredStep === 1 ? 5 : 0,
                  }}
                  transition={{ duration: 0.3 }}
                >
                  01
                </motion.div> */}

                {/* Icon */}
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                  <PlusIcon className="w-8 h-8 text-primary" />
                </div>

                <h3 className="text-2xl font-bold text-card-foreground text-center mb-4">Post Your Project</h3>

                <p className="text-muted-foreground text-center mb-8 leading-relaxed">
                  Create a detailed project listing with your requirements, budget, and timeline. Add optional contact
                  methods for direct communication.
                </p>

                {/* Mock Form */}
                <div className="bg-muted/50 rounded-2xl p-6 border border-border/50 mt-auto">
                  <div className="space-y-4">
                    {/* Form Header */}
                    <div className="flex items-center justify-between pb-3 border-b border-border/50">
                      <span className="text-sm font-semibold text-card-foreground">New Project</span>
                      <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                    </div>

                    {/* Form Fields */}
                    <div className="space-y-3">
                      <div className="space-y-2">
                        <div className="h-3 bg-card rounded-md"></div>
                        <div className="text-xs text-muted-foreground">Project Title</div>
                      </div>

                      <div className="space-y-2">
                        <div className="h-8 bg-card rounded-md"></div>
                        <div className="text-xs text-muted-foreground">Description</div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <div className="h-3 bg-card rounded-md"></div>
                          <div className="text-xs text-muted-foreground">Budget</div>
                        </div>
                        <div className="space-y-2">
                          <div className="h-3 bg-card rounded-md"></div>
                          <div className="text-xs text-muted-foreground">Timeline</div>
                        </div>
                      </div>

                      {/* Skills Tags */}
                      <div className="flex flex-wrap gap-2 pt-2">
                        <span className="px-3 py-1 bg-primary/10 text-primary text-xs rounded-full font-medium">
                          React
                        </span>
                        <span className="px-3 py-1 bg-secondary/50 text-secondary-foreground text-xs rounded-full font-medium">
                          Node.js
                        </span>
                        <span className="px-2 py-1 bg-accent/20 text-accent-foreground text-xs rounded-full">+2</span>
                      </div>
                    </div>

                    {/* CTA Button */}
                    <Link href="/add-gigs" className="block pt-4">
                      <motion.button
                        className="w-full bg-primary text-primary-foreground py-3 rounded-xl text-sm font-semibold transition-all hover:bg-primary/90 hover:shadow-lg"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Post Project
                      </motion.button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Step 2: Get Matched */}
            <motion.div
              variants={itemVariants}
              onHoverStart={() => setHoveredStep(2)}
              onHoverEnd={() => setHoveredStep(null)}
              className="group"
            >
              <motion.div
                className="bg-card rounded-3xl border border-border p-8 h-full flex flex-col relative overflow-hidden"
                whileHover={{
                  y: -4,
                  transition: { duration: 0.3 },
                }}
              >
                {/* Step Number Badge */}
                {/* <motion.div
                  className="absolute -top-4 -right-4 w-16 h-16 bg-accent-foreground rounded-full flex items-center justify-center text-accent font-bold text-xl shadow-lg"
                  animate={{
                    scale: hoveredStep === 2 ? 1.1 : 1,
                    rotate: hoveredStep === 2 ? -5 : 0,
                  }}
                  transition={{ duration: 0.3 }}
                >
                  02
                </motion.div> */}

                {/* Icon */}
                <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                  <BellIcon className="w-8 h-8 text-accent-foreground" />
                </div>

                <h3 className="text-2xl font-bold text-card-foreground text-center mb-4">Get Matched</h3>

                <p className="text-muted-foreground text-center mb-8 leading-relaxed">
                  Receive instant notifications when freelancers show interest in your project or when projects match
                  your skills.
                </p>

                {/* Notifications Mock */}
                <div className="bg-muted/50 rounded-2xl p-6 border border-border/50 mt-auto">
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-center justify-between pb-3 border-b border-border/50">
                      <span className="text-sm font-semibold text-card-foreground">Recent Activity</span>
                      <motion.div
                        className="w-2 h-2 bg-accent-foreground rounded-full"
                        animate={{ opacity: [1, 0.3, 1] }}
                        transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
                      />
                    </div>

                    {/* Notification Items */}
                    <div className="space-y-3">
                      <motion.div
                        className="bg-card rounded-xl p-4 border border-primary/20"
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 1.5 }}
                      >
                        <div className="flex items-start space-x-3">
                          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                            <UserIcon className="w-5 h-5 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-semibold text-card-foreground">New Interest!</div>
                            <div className="text-xs text-muted-foreground">
                              Sarah wants to work on your React project
                            </div>
                            <div className="flex items-center space-x-1 mt-1">
                              <ClockIcon className="w-3 h-3 text-primary" />
                              <span className="text-xs text-primary font-medium">2 min ago</span>
                            </div>
                          </div>
                        </div>
                      </motion.div>

                      <motion.div
                        className="bg-card rounded-xl p-4 border border-accent/20"
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 2 }}
                      >
                        <div className="flex items-start space-x-3">
                          <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0">
                            <CheckIcon className="w-5 h-5 text-accent-foreground" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-semibold text-card-foreground">Perfect Match</div>
                            <div className="text-xs text-muted-foreground">New project matches your skillset</div>
                            <div className="flex items-center space-x-1 mt-1">
                              <ClockIcon className="w-3 h-3 text-accent-foreground" />
                              <span className="text-xs text-accent-foreground font-medium">5 min ago</span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    </div>

                    {/* Stats */}
                    <div className="bg-primary/5 rounded-xl p-3 border border-primary/10">
                      <div className="text-xs text-primary font-semibold text-center">3 new matches today</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Step 3: Connect & Collaborate */}
            <motion.div
              variants={itemVariants}
              onHoverStart={() => setHoveredStep(3)}
              onHoverEnd={() => setHoveredStep(null)}
              className="group"
            >
              <motion.div
                className="bg-card rounded-3xl border border-border p-8 h-full flex flex-col relative overflow-hidden"
                whileHover={{
                  y: -4,
                  transition: { duration: 0.3 },
                }}
              >
                {/* Step Number Badge */}
                {/* <motion.div
                  className="absolute -top-4 -right-4 w-16 h-16 bg-secondary rounded-full flex items-center justify-center text-secondary-foreground font-bold text-xl shadow-lg"
                  animate={{
                    scale: hoveredStep === 3 ? 1.1 : 1,
                    rotate: hoveredStep === 3 ? 5 : 0,
                  }}
                  transition={{ duration: 0.3 }}
                >
                  03
                </motion.div> */}

                {/* Icon */}
                <div className="w-16 h-16 bg-secondary/20 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                  <MessageSquareIcon className="w-8 h-8 text-secondary-foreground" />
                </div>

                <h3 className="text-2xl font-bold text-card-foreground text-center mb-4">Connect & Collaborate</h3>

                <p className="text-muted-foreground text-center mb-8 leading-relaxed">
                  Choose your preferred communication method and start collaborating. No platform fees, no restrictions.
                </p>

                {/* Connection Options */}
                <div className="bg-muted/50 rounded-2xl p-6 border border-border/50 mt-auto">
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="text-sm font-semibold text-card-foreground pb-3 border-b border-border/50">
                      Choose how to connect:
                    </div>

                    {/* Connection Methods */}
                    <div className="space-y-3">
                      <motion.div
                        className="bg-card border border-primary/20 rounded-xl p-4 cursor-pointer"
                        whileHover={{ scale: 1.02, borderColor: "hsl(var(--primary))" }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                              <MessageSquareIcon className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                              <div className="text-sm font-semibold text-card-foreground">Built-in Chat</div>
                              <div className="text-xs text-muted-foreground">Secure messaging</div>
                            </div>
                          </div>
                          <div className="w-2 h-2 bg-primary rounded-full"></div>
                        </div>
                      </motion.div>

                      <motion.div
                        className="bg-card border border-accent/20 rounded-xl p-4 cursor-pointer"
                        whileHover={{ scale: 1.02, borderColor: "hsl(var(--accent-foreground))" }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center">
                              <span className="text-lg">📱</span>
                            </div>
                            <div>
                              <div className="text-sm font-semibold text-card-foreground">WhatsApp</div>
                              <div className="text-xs text-muted-foreground">Direct messaging</div>
                            </div>
                          </div>
                          <div className="w-2 h-2 bg-accent-foreground rounded-full"></div>
                        </div>
                      </motion.div>

                      <motion.div
                        className="bg-card border border-border rounded-xl p-4 cursor-pointer"
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                              <MailIcon className="w-5 h-5 text-muted-foreground" />
                            </div>
                            <div>
                              <div className="text-sm font-semibold text-card-foreground">Email</div>
                              <div className="text-xs text-muted-foreground">Professional contact</div>
                            </div>
                          </div>
                          <div className="w-2 h-2 bg-muted-foreground rounded-full"></div>
                        </div>
                      </motion.div>
                    </div>

                    {/* Privacy Badge */}
                    <div className="bg-secondary/10 border border-secondary/20 rounded-xl p-3">
                      <div className="flex items-center justify-center space-x-2">
                        <ShieldCheckIcon className="w-4 h-4 text-secondary-foreground" />
                        <span className="text-xs text-secondary-foreground font-semibold">100% Privacy Protected</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
        >
          <Link href="/add-gigs">
            <motion.button
              className="bg-primary text-primary-foreground px-8 py-4 rounded-2xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              Get Started Now
              <ArrowRightIcon className="w-5 h-5 ml-2 inline" />
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
