"use client";

import { cn } from "@/lib/utils";
import { PlusIcon, BellIcon, MessageSquareIcon, CheckCircle2 } from "lucide-react";
import type React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

interface StepCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  visual: React.ReactNode;
}

const StepCard: React.FC<StepCardProps> = ({
  icon,
  title,
  description,
  visual,
}) => (
  <div
    className={cn(
      "relative rounded-2xl border-2 border-border bg-card p-5 sm:p-8 text-card-foreground transition-all duration-300 ease-in-out flex flex-col",
      "hover:scale-105 hover:shadow-xl hover:border-primary hover:bg-muted"
    )}
  >
    <div className="mb-4 sm:mb-6 flex h-10 w-10 sm:h-14 sm:w-14 items-center justify-center rounded-xl sm:rounded-2xl bg-background border-2 border-border text-primary shadow-sm">
      {icon}
    </div>
    <h3 className="mb-2 sm:mb-3 text-xl sm:text-2xl font-bold">{title}</h3>
    <p className="mb-6 sm:mb-8 text-sm sm:text-base font-normal text-muted-foreground leading-relaxed">{description}</p>
    
    {/* Visual Container */}
    <div className="w-full bg-background border-2 border-border rounded-xl sm:rounded-2xl p-4 sm:p-6 mt-auto overflow-hidden flex items-center justify-center min-h-[200px] sm:min-h-[240px]">
      {visual}
    </div>
  </div>
);

export default function HowItWorks({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const stepsData = [
    {
      icon: <PlusIcon className="h-5 w-5 sm:h-7 sm:w-7" />,
      title: "Post Your Project",
      description: "Create a detailed project listing with your requirements, budget, and timeline.",
      visual: (
        <div className="w-full space-y-4 relative z-10 bg-card border-2 border-border p-4 sm:p-5 rounded-xl sm:rounded-2xl shadow-sm">
          <div className="flex items-center justify-between border-b-2 border-border pb-3">
             <span className="text-xs sm:text-sm font-bold">New Gig</span>
             <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-primary animate-pulse"></div>
          </div>
          <div className="space-y-2.5 sm:space-y-3">
            <div className="h-2.5 sm:h-3 bg-muted rounded-full w-2/3"></div>
            <div className="h-3.5 sm:h-4 bg-border rounded-full w-full"></div>
            <div className="grid grid-cols-2 gap-2.5 sm:gap-3 pt-1 sm:pt-2">
               <div className="h-2 bg-muted rounded-full w-full"></div>
               <div className="h-2 bg-muted rounded-full w-full"></div>
            </div>
          </div>
          <motion.div 
            className="mt-4 sm:mt-6 bg-primary text-primary-foreground text-xs sm:text-sm font-bold py-3 sm:py-3.5 rounded-xl text-center relative overflow-hidden"
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
              <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5" /> Posted
            </motion.div>
            <span className="opacity-100">Submit Project</span>
          </motion.div>
        </div>
      )
    },
    {
      icon: <BellIcon className="h-5 w-5 sm:h-7 sm:w-7" />,
      title: "Get Matched",
      description: "Receive instant notifications when freelancers show interest or match your skills.",
      visual: (
        <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
          <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-background to-transparent z-10 pointer-events-none"></div>
          <div className="absolute inset-x-0 top-0 h-8 bg-gradient-to-b from-background to-transparent z-10 pointer-events-none"></div>
          <motion.div 
            className="flex flex-col gap-2.5 sm:gap-3 w-full"
            animate={{ y: [40, 0, -60, -120] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", times: [0, 0.33, 0.66, 1] }}
          >
            {[
              { title: "New Match!", sub: "React Developer", img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop" },
              { title: "Perfect Match", sub: "UI/UX Designer", img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop" },
              { title: "New Interest!", sub: "Backend Expert", img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop" },
              { title: "New Match!", sub: "React Developer", img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop" }
            ].map((item, i) => (
              <div key={i} className="bg-card border-2 border-border rounded-xl p-2.5 sm:p-3 shadow-sm flex items-center gap-2.5 sm:gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary overflow-hidden border-2 border-border flex-shrink-0">
                  <img src={item.img} alt={item.title} className="w-full h-full object-cover" />
                </div>
                <div>
                    <div className="text-xs sm:text-sm font-bold text-foreground">{item.title}</div>
                    <div className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">{item.sub}</div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      )
    },
    {
      icon: <MessageSquareIcon className="h-5 w-5 sm:h-7 sm:w-7" />,
      title: "Connect & Collaborate",
      description: "Choose your preferred communication method and start collaborating with no fees.",
      visual: (
        <div className="relative flex w-full flex-col space-y-4 sm:space-y-6 py-2 h-[180px] sm:h-[200px] justify-center">
          {/* Freelancer Message */}
          <motion.div 
            className="relative flex w-[calc(80%+1rem)] sm:w-[calc(60%+1rem)] items-center justify-end gap-2.5 sm:gap-3"
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: [0, 1, 1, 0], x: [-15, 0, 0, -15] }}
            transition={{ duration: 6, repeat: Infinity, times: [0, 0.1, 0.9, 1] }}
          >
            <span className="block h-fit rounded-xl border-2 border-border bg-card px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm shadow-sm font-bold">I can do this!</span>
            <div className="size-8 sm:size-10 rounded-full overflow-hidden border-2 border-border flex-shrink-0 bg-background">
              <Image className="size-full object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop" alt="User" width={40} height={40} sizes="(max-width: 640px) 32px, 40px" />
            </div>
          </motion.div>
          
          {/* Your Reply */}
          <motion.div 
            className="relative ml-[calc(20%-1rem)] sm:ml-[calc(40%-1rem)] flex items-center gap-2.5 sm:gap-3"
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: [0, 0, 1, 1, 0], x: [15, 15, 0, 0, 15] }}
            transition={{ duration: 6, repeat: Infinity, times: [0, 0.2, 0.3, 0.9, 1] }}
          >
            <div className="size-8 sm:size-10 rounded-full overflow-hidden border-2 border-border flex-shrink-0 bg-background">
              <Image className="size-full object-cover" src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop" alt="You" width={40} height={40} sizes="(max-width: 640px) 32px, 40px" />
            </div>
            <span className="block h-fit rounded-xl border-2 border-border bg-primary text-primary-foreground px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm shadow-sm font-bold">Let's talk</span>
          </motion.div>

          {/* Typing Indicator */}
          <motion.div 
            className="relative flex w-[calc(80%+1rem)] sm:w-[calc(60%+1rem)] items-center justify-end gap-2.5 sm:gap-3"
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: [0, 0, 1, 1, 0], x: [-15, -15, 0, 0, -15] }}
            transition={{ duration: 6, repeat: Infinity, times: [0, 0.4, 0.5, 0.9, 1] }}
          >
            <div className="flex items-center gap-1.5 bg-card border-2 border-border rounded-full px-3.5 sm:px-4 py-2 sm:py-3">
              <motion.div className="w-1.5 h-1.5 bg-muted-foreground rounded-full" animate={{ y: [0, -3, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0 }} />
              <motion.div className="w-1.5 h-1.5 bg-muted-foreground rounded-full" animate={{ y: [0, -3, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }} />
              <motion.div className="w-1.5 h-1.5 bg-muted-foreground rounded-full" animate={{ y: [0, -3, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }} />
            </div>
            <div className="size-8 sm:size-10 rounded-full overflow-hidden border-2 border-border flex-shrink-0 bg-background">
              <Image className="size-full object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop" alt="User" width={40} height={40} sizes="(max-width: 640px) 32px, 40px" />
            </div>
          </motion.div>
        </div>
      )
    },
  ];

  return (
    <section
      id="how-it-works"
      className={cn("w-full bg-background py-12 md:py-20 scroll-mt-16", className)}
      {...props}
    >
      <div className="mx-auto max-w-3xl lg:max-w-6xl px-4 sm:px-6">
        {/* Section Header */}
        <div className="mx-auto mb-8 sm:mb-12 md:mb-14 max-w-4xl text-center">
          <h2 
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            How <span className="text-primary">PostMyGig</span> Works
          </h2>
        </div>

        {/* Step Indicators with Connecting Line */}
        <div className="relative mx-auto mb-8 sm:mb-16 w-full">
          <div
            aria-hidden="true"
            className="absolute left-[16.6667%] top-1/2 h-1 w-[66.6667%] -translate-y-1/2 bg-border rounded-full"
          ></div>
          <div className="relative grid grid-cols-3">
            {stepsData.map((_, index) => (
              <div
                key={index}
                className="flex h-10 w-10 sm:h-14 sm:w-14 items-center justify-center justify-self-center rounded-full bg-primary font-bold text-lg sm:text-2xl text-primary-foreground border-2 sm:border-4 border-background z-10 shadow-sm"
              >
                {index + 1}
              </div>
            ))}
          </div>
        </div>

        {/* Steps Grid */}
        <div className="mx-auto grid w-full grid-cols-1 gap-4 sm:gap-6 lg:gap-8 md:grid-cols-3">
          {stepsData.map((step, index) => (
            <StepCard
              key={index}
              icon={step.icon}
              title={step.title}
              description={step.description}
              visual={step.visual}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
