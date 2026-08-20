"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Zap, Share2, MessageCircle, Link as LinkIcon, CheckCircle2 } from "lucide-react"
import { motion } from "framer-motion"
import Image from "next/image"

export default function Features() {
  return (
    <section id="features" className="bg-background py-12 md:py-20 scroll-mt-16">
      <div className="mx-auto max-w-3xl lg:max-w-6xl px-4 sm:px-6">

        {/* Header */}
        <div className="text-center mb-8 sm:mb-12 md:mb-14">
          <h2
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Key Features of <span className="text-primary">PostMyGig</span>
          </h2>
        </div>

        <div className="relative">
          <div className="relative z-10 grid grid-cols-6 gap-4 sm:gap-6 lg:gap-8">

            {/* Card 1: 0% Platform Fees (col-span-2) */}
            <Card className="relative col-span-full flex overflow-hidden lg:col-span-2 border-2 border-border shadow-sm group rounded-2xl">
              <CardContent className="relative m-auto w-full p-5 sm:pt-10 sm:pb-12 sm:px-8 flex flex-col items-center">
                <div className="relative flex h-32 sm:h-40 w-full max-w-[240px] items-center justify-center">
                  <svg className="text-muted absolute inset-0 size-full" viewBox="0 0 254 104" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M112.891 97.7022C140.366 97.0802 171.004 94.6715 201.087 87.5116C210.43 85.2881 219.615 82.6412 228.284 78.2473C232.198 76.3179 235.905 73.9942 239.348 71.3124C241.85 69.2557 243.954 66.7571 245.555 63.9408C249.34 57.3235 248.281 50.5341 242.498 45.6109C239.033 42.7237 235.228 40.2703 231.169 38.3054C219.443 32.7209 207.141 28.4382 194.482 25.534C184.013 23.1927 173.358 21.7755 162.64 21.2989C161.376 21.3512 160.113 21.181 158.908 20.796C158.034 20.399 156.857 19.1682 156.962 18.4535C157.115 17.8927 157.381 17.3689 157.743 16.9139C158.104 16.4588 158.555 16.0821 159.067 15.8066C160.14 15.4683 161.274 15.3733 162.389 15.5286C179.805 15.3566 196.626 18.8373 212.998 24.462C220.978 27.2494 228.798 30.4747 236.423 34.1232C240.476 36.1159 244.202 38.7131 247.474 41.8258C254.342 48.2578 255.745 56.9397 251.841 65.4892C249.793 69.8582 246.736 73.6777 242.921 76.6327C236.224 82.0192 228.522 85.4602 220.502 88.2924C205.017 93.7847 188.964 96.9081 172.738 99.2109C153.442 101.949 133.993 103.478 114.506 103.79C91.1468 104.161 67.9334 102.97 45.1169 97.5831C36.0094 95.5616 27.2626 92.1655 19.1771 87.5116C13.839 84.5746 9.1557 80.5802 5.41318 75.7725C-0.54238 67.7259 -1.13794 59.1763 3.25594 50.2827C5.82447 45.3918 9.29572 41.0315 13.4863 37.4319C24.2989 27.5721 37.0438 20.9681 50.5431 15.7272C68.1451 8.8849 86.4883 5.1395 105.175 2.83669C129.045 0.0992292 153.151 0.134761 177.013 2.94256C197.672 5.23215 218.04 9.01724 237.588 16.3889C240.089 17.3418 242.498 18.5197 244.933 19.6446C246.627 20.4387 247.725 21.6695 246.997 23.615C246.455 25.1105 244.814 25.5605 242.63 24.5811C230.322 18.9961 217.233 16.1904 204.117 13.4376C188.761 10.3438 173.2 8.36665 157.558 7.52174C129.914 5.70776 102.154 8.06792 75.2124 14.5228C60.6177 17.8788 46.5758 23.2977 33.5102 30.6161C26.6595 34.3329 20.4123 39.0673 14.9818 44.658C12.9433 46.8071 11.1336 49.1622 9.58207 51.6855C4.87056 59.5336 5.61172 67.2494 11.9246 73.7608C15.2064 77.0494 18.8775 79.925 22.8564 82.3236C31.6176 87.7101 41.3848 90.5291 51.3902 92.5804C70.6068 96.5773 90.0219 97.7419 112.891 97.7022Z"
                      fill="currentColor"
                    />
                  </svg>
                  <motion.span
                    className="mx-auto block w-fit text-5xl md:text-6xl font-bold text-primary relative z-10"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  >
                    0%
                  </motion.span>
                </div>
                <h2 className="mt-8 sm:mt-12 text-center text-xl sm:text-2xl font-bold text-foreground">Platform Fees</h2>
                <p className="mt-2 sm:mt-3 text-center text-muted-foreground text-sm sm:text-base max-w-[240px] mx-auto">
                  Connect directly with freelancers. No commissions or hidden charges.
                </p>
              </CardContent>
            </Card>

            {/* Card 2: Share Anywhere (col-span-2) */}
            <Card className="relative col-span-full overflow-hidden sm:col-span-3 lg:col-span-2 border-2 border-border shadow-sm group rounded-2xl">
              <CardContent className="p-5 sm:pt-10 sm:pb-12 sm:px-8 flex flex-col items-center justify-center h-full">
                <div className="relative mx-auto flex h-36 sm:h-48 w-full items-center justify-center gap-3 sm:gap-6">
                  {/* Share Icons */}
                  {[
                    { Icon: Share2, text: "text-blue-500", bg: "bg-background", border: "border-blue-500" },
                    { Icon: MessageCircle, text: "text-green-500", bg: "bg-background", border: "border-green-500" },
                    { Icon: LinkIcon, text: "text-foreground", bg: "bg-muted", border: "border-border" }
                  ].map((item, i) => (
                    <motion.div
                      key={i}
                      className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full border-2 flex flex-shrink-0 items-center justify-center shadow-sm ${item.bg} ${item.border}`}
                      initial={{ scale: 0.8, opacity: 0.5 }}
                      animate={{ scale: [0.8, 1.1, 0.8], opacity: [0.5, 1, 0.5] }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        delay: i * 1, // Staggered
                      }}
                    >
                      <item.Icon className={`w-5 h-5 sm:w-7 sm:h-7 ${item.text}`} />
                    </motion.div>
                  ))}

                  {/* Floating Link Copied */}
                  <motion.div
                    className="absolute bottom-2 bg-foreground text-background text-xs sm:text-sm font-bold px-4 py-2 sm:px-6 sm:py-3 rounded-full shadow-lg border border-border z-20"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: [0, 1, 1, 0], y: [15, 0, 0, -15] }}
                    transition={{ duration: 3, repeat: Infinity, delay: 2.5, times: [0, 0.1, 0.8, 1] }}
                  >
                    Link Copied!
                  </motion.div>
                </div>
                <div className="relative z-10 mt-6 sm:mt-10 space-y-2 sm:space-y-3 text-center">
                  <h2 className="text-xl sm:text-2xl font-bold text-foreground">Share Anywhere</h2>
                  <p className="text-muted-foreground text-sm sm:text-base max-w-[240px] mx-auto">
                    Instantly share gigs on social media or direct link. Reach freelancers instantly.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Card 3: Get Matched (col-span-2) */}
            <Card className="relative col-span-full overflow-hidden sm:col-span-3 lg:col-span-2 border-2 border-border shadow-sm group rounded-2xl">
              <CardContent className="p-5 sm:pt-10 sm:pb-12 sm:px-8 flex flex-col items-center h-full">
                <div className="relative w-full h-36 sm:h-48 flex items-center justify-center overflow-hidden rounded-xl sm:rounded-2xl border-2 border-border bg-muted">
                  <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-muted to-transparent z-10 pointer-events-none"></div>
                  <div className="absolute inset-x-0 top-0 h-12 bg-gradient-to-b from-muted to-transparent z-10 pointer-events-none"></div>

                  <motion.div
                    className="flex flex-col gap-3 sm:gap-4 w-full max-w-[240px] px-3 sm:px-4"
                    animate={{ y: [50, 0, -60, -120] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", times: [0, 0.33, 0.66, 1] }}
                  >
                    {[
                      { title: "Match: React Dev", img: "https://randomuser.me/api/portraits/women/44.jpg" },
                      { title: "Match: UI Designer", img: "https://randomuser.me/api/portraits/men/32.jpg" },
                      { title: "Match: Copywriter", img: "https://randomuser.me/api/portraits/women/68.jpg" },
                      { title: "Match: React Dev", img: "https://randomuser.me/api/portraits/women/44.jpg" } // Duplicate for looping effect
                    ].map((item, i) => (
                      <div key={i} className="bg-background border-2 border-border rounded-xl p-2.5 sm:p-3 flex items-center gap-3 sm:gap-4 shadow-sm">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-background border-2 border-border overflow-hidden flex flex-shrink-0 items-center justify-center">
                          <Image src={item.img} alt="User" width={40} height={40} sizes="(max-width: 640px) 32px, 40px" className="w-full h-full object-cover" />
                        </div>
                        <span className="text-xs sm:text-sm font-bold text-foreground">{item.title}</span>
                      </div>
                    ))}
                  </motion.div>
                </div>
                <div className="relative z-10 mt-6 sm:mt-10 space-y-2 sm:space-y-3 text-center">
                  <h2 className="text-xl sm:text-2xl font-bold text-foreground">Get Matched</h2>
                  <p className="text-muted-foreground text-sm sm:text-base max-w-[240px] mx-auto">
                    Receive instant notifications when freelancers match your skills.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Card 4: Post Excess Gigs (col-span-3) */}
            <Card className="relative col-span-full overflow-hidden lg:col-span-3 border-2 border-border shadow-sm group rounded-2xl">
              <CardContent className="grid h-full p-5 sm:pt-12 sm:grid-cols-2 gap-6 sm:gap-10 sm:px-10 sm:pb-12">
                <div className="relative z-10 flex flex-col justify-between space-y-6 sm:space-y-12 lg:space-y-8">
                  <div className="relative flex aspect-square size-14 sm:size-20 rounded-full border-2 border-border before:absolute before:-inset-1.5 sm:before:-inset-2 before:rounded-full before:border-2 before:border-border bg-background">
                    <Zap className="m-auto size-6 sm:size-8 text-primary" strokeWidth={2} />
                  </div>
                  <div className="space-y-2 sm:space-y-4">
                    <h2 className="text-xl sm:text-2xl font-bold text-foreground">
                      Post Instantly
                    </h2>
                    <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                      Quickly post your extra gigs when you have too much work. Support the freelance community and manage your own load.
                    </p>
                  </div>
                </div>

                <div className="relative -mb-5 -mr-5 sm:-mb-12 sm:-mr-10 mt-4 sm:mt-8 h-fit border-l-2 border-t-2 border-border p-4 sm:p-8 sm:ml-8 bg-muted rounded-tl-[1.5rem] sm:rounded-tl-[2rem] overflow-hidden flex items-center justify-center min-h-[220px] sm:min-h-[260px]">
                  {/* Fake Form Animation */}
                  <div className="w-full max-w-[240px] sm:max-w-[260px] space-y-3 sm:space-y-4 relative z-10 bg-background border-2 border-border p-4 sm:p-5 rounded-xl sm:rounded-2xl shadow-sm">
                    <div className="space-y-2 sm:space-y-3">
                      <div className="h-2 bg-muted rounded-full w-1/3"></div>
                      <div className="h-3.5 sm:h-4 bg-border rounded-full w-full"></div>
                    </div>
                    <div className="space-y-2 sm:space-y-3">
                      <div className="h-2 bg-muted rounded-full w-1/4"></div>
                      <div className="h-3.5 sm:h-4 bg-border rounded-full w-5/6"></div>
                    </div>

                    <motion.div
                      className="mt-4 sm:mt-6 bg-primary text-primary-foreground text-xs sm:text-sm font-bold py-3 sm:py-3.5 rounded-xl text-center relative overflow-hidden shadow-sm"
                      initial={{ scale: 0.95 }}
                      animate={{ scale: [0.95, 1, 0.95] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <motion.div
                        className="absolute inset-0 bg-green-600 flex items-center justify-center text-white"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: [0, 0, 1, 1, 0], y: [30, 30, 0, 0, -30] }}
                        transition={{ duration: 4, repeat: Infinity, times: [0, 0.4, 0.5, 0.9, 1] }}
                      >
                        <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 mr-2" /> Published
                      </motion.div>
                      <span className="opacity-100">Publish Gig</span>
                    </motion.div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Card 5: Real-Time Chat (col-span-3) */}
            <Card className="relative col-span-full overflow-hidden lg:col-span-3 border-2 border-border shadow-sm group rounded-2xl">
              <CardContent className="grid h-full p-5 sm:pt-12 sm:grid-cols-2 gap-6 sm:gap-10 sm:px-10 sm:pb-12">
                <div className="relative z-10 flex flex-col justify-between space-y-6 sm:space-y-12 lg:space-y-8">
                  <div className="relative flex aspect-square size-14 sm:size-20 rounded-full border-2 border-border before:absolute before:-inset-1.5 sm:before:-inset-2 before:rounded-full before:border-2 before:border-border bg-background">
                    <MessageCircle className="m-auto size-6 sm:size-8 text-primary" strokeWidth={2} />
                  </div>
                  <div className="space-y-2 sm:space-y-4">
                    <h2 className="text-xl sm:text-2xl font-bold text-foreground">Real-Time Chat</h2>
                    <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                      Chat directly with freelancers in real-time. Full control over conversations without sharing personal info.
                    </p>
                  </div>
                </div>

                <div className="before:bg-border relative mt-4 sm:mt-8 before:absolute before:inset-0 before:mx-auto before:w-1 sm:-my-12 sm:-mr-12 bg-muted border-l-2 border-t-2 border-border p-4 sm:p-8 rounded-tl-[1.5rem] sm:rounded-tl-[2rem] overflow-hidden flex flex-col justify-center min-h-[260px] sm:min-h-[300px]">
                  <div className="relative flex w-full flex-col space-y-6 sm:space-y-8 py-3 sm:py-4 z-10">

                    {/* User 1 (Designer) */}
                    <motion.div
                      className="relative flex w-[calc(80%+1rem)] sm:w-[calc(60%+1rem)] items-center justify-end gap-2.5 sm:gap-3"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: [0, 1, 1, 0], x: [-20, 0, 0, -20] }}
                      transition={{ duration: 6, repeat: Infinity, times: [0, 0.1, 0.9, 1] }}
                    >
                      <span className="block h-fit rounded-xl border-2 border-border bg-card px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm shadow-sm font-bold">I can design this</span>
                      <div className="size-10 sm:size-12 rounded-full overflow-hidden border-2 border-border flex-shrink-0 bg-background">
                        <Image className="size-full object-cover" src="https://randomuser.me/api/portraits/men/11.jpg" alt="Designer" width={48} height={48} sizes="(max-width: 640px) 40px, 48px" />
                      </div>
                    </motion.div>

                    {/* You (Middle) */}
                    <motion.div
                      className="relative ml-[calc(20%-1rem)] sm:ml-[calc(40%-1rem)] flex items-center gap-2.5 sm:gap-3"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: [0, 0, 1, 1, 0], x: [20, 20, 0, 0, 20] }}
                      transition={{ duration: 6, repeat: Infinity, times: [0, 0.2, 0.3, 0.9, 1] }}
                    >
                      <div className="size-10 sm:size-12 rounded-full overflow-hidden border-2 border-border flex-shrink-0 bg-background">
                        <Image className="size-full object-cover" src="https://randomuser.me/api/portraits/women/12.jpg" alt="You" width={48} height={48} sizes="(max-width: 640px) 40px, 48px" />
                      </div>
                      <span className="block h-fit rounded-xl border-2 border-border bg-primary text-primary-foreground px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm shadow-sm font-bold">Awesome!</span>
                    </motion.div>

                    {/* User 2 (Writer) */}
                    <motion.div
                      className="relative flex w-[calc(80%+1rem)] sm:w-[calc(60%+1rem)] items-center justify-end gap-2.5 sm:gap-3"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: [0, 0, 1, 1, 0], x: [-20, -20, 0, 0, -20] }}
                      transition={{ duration: 6, repeat: Infinity, times: [0, 0.4, 0.5, 0.9, 1] }}
                    >
                      {/* Typing Indicator Bubble */}
                      <div className="flex items-center gap-1.5 bg-card border-2 border-border rounded-full px-3.5 sm:px-4 py-2 sm:py-3 shadow-sm">
                        <motion.div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-muted-foreground rounded-full" animate={{ y: [0, -4, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0 }} />
                        <motion.div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-muted-foreground rounded-full" animate={{ y: [0, -4, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }} />
                        <motion.div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-muted-foreground rounded-full" animate={{ y: [0, -4, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }} />
                      </div>
                      <div className="size-10 sm:size-12 rounded-full overflow-hidden border-2 border-border flex-shrink-0 bg-background">
                        <Image className="size-full object-cover" src="https://randomuser.me/api/portraits/women/68.jpg" alt="Writer" width={48} height={48} sizes="(max-width: 640px) 40px, 48px" />
                      </div>
                    </motion.div>

                  </div>
                </div>
              </CardContent>
            </Card>

          </div>
        </div>
      </div>
    </section>
  )
}
