"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { MessageSquareIcon, MailIcon, ShieldCheckIcon, CheckIcon } from "lucide-react";

export default function HowItWorks() {
  const [hoveredStep, setHoveredStep] = useState<number | null>(null);

  return (
    <section id="how-it-works" className="py-16 md:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4" style={{ fontFamily: "var(--font-serif)" }}>
            <span className="text-primary">Post</span>,{" "}
            <span className="text-accent-foreground">Connect</span>, Work –{" "}
            <span className="text-foreground">In Minutes</span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Simple steps to share your work or find the perfect collaborator
          </p>
          <div className="w-16 h-1 bg-primary mx-auto rounded-full mt-6"></div>
        </div>

        {/* Steps Timeline */}
        <div className="relative">
          {/* Timeline Line */}
          <motion.div 
            className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 bg-primary/20 transform -translate-y-1/2 z-0"
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
                className="bg-card rounded-2xl shadow-md border border-border p-6 md:p-8 h-full flex flex-col"
                whileHover={{ 
                  y: -8,
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" 
                }}
                transition={{ duration: 0.3 }}
              >
                {/* Step Number */}
                <motion.div 
                  className="flex items-center justify-center w-12 h-12 md:w-16 md:h-16 bg-primary text-primary-foreground rounded-full font-bold text-xl mx-auto mb-5 md:mb-6"
                  animate={{ 
                    scale: hoveredStep === 1 ? 1.1 : 1 
                  }}
                  transition={{ duration: 0.3 }}
                >
                  1
                </motion.div>

                <h3 className="text-xl md:text-2xl font-bold text-card-foreground text-center mb-3">
                  Post Your Project
                </h3>
                
                <p className="text-muted-foreground text-center mb-5 md:mb-6">
                  List your skills or project needs with optional contact details.
                </p>

                <div className="bg-muted rounded-lg p-3 md:p-4 border border-border mt-auto">
                  <div className="space-y-3">
                    {/* Form Header */}
                    <div className="flex items-center space-x-2 pb-2 border-b border-border">
                      <div className="w-3 h-3 bg-primary rounded-full"></div>
                      <span className="text-sm font-medium text-muted-foreground">New Project</span>
                    </div>

                    {/* Form Fields */}
                    <div className="space-y-3">
                      <div>
                        <div className="w-full h-3 bg-input rounded mb-1"></div>
                        <div className="text-xs text-muted-foreground">Project Title</div>
                      </div>
                      <div>
                        <div className="w-full h-8 bg-input rounded mb-1"></div>
                        <div className="text-xs text-muted-foreground">Description</div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <div className="w-full h-3 bg-input rounded mb-1"></div>
                          <div className="text-xs text-muted-foreground">Budget</div>
                        </div>
                        <div>
                          <div className="w-full h-3 bg-input rounded mb-1"></div>
                          <div className="text-xs text-muted-foreground">Timeline</div>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded">React</span>
                        <span className="px-2 py-1 bg-accent/20 text-accent-foreground text-xs rounded">Node.js</span>
                        <span className="px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded">+</span>
                      </div>
                      
                      {/* Contact Options */}
                      <div className="border-t border-border pt-2 md:pt-3">
                        <div className="text-xs text-muted-foreground mb-2">Contact Methods (Optional)</div>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <input type="checkbox" className="w-3 h-3 text-primary border-border rounded" />
                            <span className="text-xs text-muted-foreground">Enable built-in chat</span>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <div className="w-full h-2 bg-input rounded mb-1"></div>
                              <div className="text-xs text-muted-foreground/70">WhatsApp (Optional)</div>
                            </div>
                            <div>
                              <div className="w-full h-2 bg-input rounded mb-1"></div>
                              <div className="text-xs text-muted-foreground/70">Email (Optional)</div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Security Note */}
                      <div className="bg-accent/10 border border-accent/30 rounded p-2">
                        <div className="flex items-center space-x-1">
                          <ShieldCheckIcon className="w-3 h-3 text-accent-foreground" />
                          <span className="text-xs text-accent-foreground font-medium">Your privacy is protected</span>
                        </div>
                      </div>

                      {/* Post Button */}
                      <Link href="/add-gigs" className="block">
                        <button className="w-full bg-primary text-primary-foreground py-2 rounded text-sm font-medium transition-colors hover:bg-primary/90">
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
                className="bg-card rounded-2xl shadow-md border border-border p-6 md:p-8 h-full flex flex-col"
                whileHover={{ 
                  y: -8,
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" 
                }}
                transition={{ duration: 0.3 }}
              >
                {/* Step Number */}
                <motion.div 
                  className="flex items-center justify-center w-12 h-12 md:w-16 md:h-16 bg-accent-foreground text-accent rounded-full font-bold text-xl mx-auto mb-5 md:mb-6"
                  animate={{ 
                    scale: hoveredStep === 2 ? 1.1 : 1 
                  }}
                  transition={{ duration: 0.3 }}
                >
                  2
                </motion.div>

                <h3 className="text-xl md:text-2xl font-bold text-card-foreground text-center mb-3">
                  Get Matched
                </h3>
                
                <p className="text-muted-foreground text-center mb-5 md:mb-6">
                  Receive instant notifications when someone is interested in your project or skills.
                </p>

                <div className="bg-muted rounded-lg p-3 md:p-4 border border-border mt-auto">
                  <div className="space-y-3">
                    {/* Notification Header */}
                    <div className="flex items-center justify-between pb-2 border-b border-border">
                      <span className="text-sm font-medium text-muted-foreground">Notifications</span>
                      <motion.div 
                        className="w-2 h-2 bg-accent-foreground rounded-full"
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
                      <div className="bg-card border border-accent/30 rounded-lg p-3">
                        <div className="flex items-start space-x-3">
                          <div className="w-8 h-8 bg-accent/20 rounded-full flex items-center justify-center">
                            <span className="text-xs font-bold text-accent-foreground">A</span>
                          </div>
                          <div className="flex-1">
                            <div className="text-sm font-medium text-card-foreground">New Interest!</div>
                            <div className="text-xs text-muted-foreground">Someone wants to work on your React project</div>
                            <div className="text-xs text-accent-foreground font-medium mt-1">2 min ago</div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-card border border-primary/20 rounded-lg p-3">
                        <div className="flex items-start space-x-3">
                          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                            <span className="text-xs font-bold text-primary">R</span>
                          </div>
                          <div className="flex-1">
                            <div className="text-sm font-medium text-card-foreground">Perfect Match</div>
                            <div className="text-xs text-muted-foreground">Project matches your skillset</div>
                            <div className="text-xs text-primary font-medium mt-1">5 min ago</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Connection Options Preview */}
                    <div className="bg-primary/5 border border-primary/20 rounded p-2">
                      <div className="text-xs text-primary font-medium mb-1">Available connection methods:</div>
                      <div className="flex flex-wrap gap-1">
                        <span className="px-2 py-1 bg-card text-primary text-xs rounded border border-primary/20">💬 Built-in Chat</span>
                        <span className="px-2 py-1 bg-accent/20 text-accent-foreground text-xs rounded">📱 WhatsApp</span>
                        <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded">📧 Email</span>
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
                className="bg-card rounded-2xl shadow-md border border-border p-6 md:p-8 h-full flex flex-col"
                whileHover={{ 
                  y: -8,
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" 
                }}
                transition={{ duration: 0.3 }}
              >
                {/* Step Number */}
                <motion.div 
                  className="flex items-center justify-center w-12 h-12 md:w-16 md:h-16 bg-accent-foreground text-accent rounded-full font-bold text-xl mx-auto mb-5 md:mb-6"
                  animate={{ 
                    scale: hoveredStep === 3 ? 1.1 : 1 
                  }}
                  transition={{ duration: 0.3 }}
                >
                  3
                </motion.div>

                <h3 className="text-xl md:text-2xl font-bold text-card-foreground text-center mb-3">
                  Connect & Collaborate
                </h3>
                
                <p className="text-muted-foreground text-center mb-5 md:mb-6">
                  Choose your preferred way to connect: our secure chat system, WhatsApp, email, or any method the freelancer provided.
                </p>

                <div className="bg-muted rounded-lg p-3 md:p-4 border border-border mt-auto">
                  <div className="space-y-3">
                    {/* Connection Options Header */}
                    <div className="text-sm font-medium text-muted-foreground pb-2 border-b border-border">
                      Choose how to connect:
                    </div>

                    {/* Connection Options */}
                    <div className="space-y-2">
                      <motion.div
                        className="bg-card border border-primary/20 rounded-lg p-3"
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                              <MessageSquareIcon className="w-4 h-4 text-primary" />
                            </div>
                            <div>
                              <div className="text-sm font-medium text-card-foreground">Built-in Chat</div>
                              <div className="text-xs text-muted-foreground">Secure & private messaging</div>
                            </div>
                          </div>
                          <button className="bg-primary text-primary-foreground px-3 py-1 rounded text-xs font-medium hover:bg-primary/90 transition-colors">
                            Start Chat
                          </button>
                        </div>
                      </motion.div>

                      <motion.div
                        className="bg-card border border-accent/30 rounded-lg p-3"
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-accent/20 rounded-full flex items-center justify-center">
                              <span className="text-sm">📱</span>
                            </div>
                            <div>
                              <div className="text-sm font-medium text-card-foreground">WhatsApp</div>
                              <div className="text-xs text-muted-foreground">+91 98765 43210</div>
                            </div>
                          </div>
                          <button className="bg-accent-foreground text-accent px-3 py-1 rounded text-xs font-medium hover:bg-accent-foreground/90 transition-colors">
                            Message
                          </button>
                        </div>
                      </motion.div>

                      <motion.div
                        className="bg-card border border-border rounded-lg p-3"
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                              <MailIcon className="w-4 h-4 text-muted-foreground" />
                            </div>
                            <div>
                              <div className="text-sm font-medium text-card-foreground">Email</div>
                              <div className="text-xs text-muted-foreground">amit.dev@example.com</div>
                            </div>
                          </div>
                          <button className="bg-muted-foreground text-background px-3 py-1 rounded text-xs font-medium hover:bg-muted-foreground/90 transition-colors">
                            Email
                          </button>
                        </div>
                      </motion.div>

                      {/* Privacy Note */}
                      <div className="bg-secondary border border-secondary/50 rounded p-2">
                        <div className="flex items-center space-x-1">
                          <ShieldCheckIcon className="w-3 h-3 text-secondary-foreground" />
                          <span className="text-xs text-secondary-foreground font-medium">Contact info shared only when both parties agree</span>
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