"use client";

import * as React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, useScroll, useMotionValueEvent, type Variants } from "framer-motion";
import { Menu } from "lucide-react";
import { DarkModeToggle } from "@/components/DarkModeToggle";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const EXPAND_SCROLL_THRESHOLD = 80;

const containerVariants: Variants = {
  expanded: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      damping: 20,
      stiffness: 300,
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
  collapsed: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      damping: 20,
      stiffness: 300,
      when: "afterChildren",
      staggerChildren: 0.04,
      staggerDirection: -1,
    },
  },
};

const itemVariants: Variants = {
  expanded: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", damping: 15 } },
  collapsed: { opacity: 0, scale: 0.8, y: -10, transition: { duration: 0.2 } },
};

export function AnimatedNavFramer() {
  const [isExpanded, setExpanded] = React.useState(true);
  const router = useRouter();

  const { scrollY } = useScroll();
  const lastScrollY = React.useRef(0);
  const scrollPositionOnCollapse = React.useRef(0);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = lastScrollY.current;

    if (isExpanded && latest > previous && latest > 150) {
      setExpanded(false);
      scrollPositionOnCollapse.current = latest;
    } else if (!isExpanded && latest < previous && (scrollPositionOnCollapse.current - latest > EXPAND_SCROLL_THRESHOLD)) {
      setExpanded(true);
    }

    lastScrollY.current = latest;
  });

  const handleScrollTo = (id: string) => {
    if (window.location.pathname !== "/") {
      router.push(`/${id}`);
    } else {
      const element = document.querySelector(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const handleNavClick = (e: React.MouseEvent) => {
    if (!isExpanded) {
      e.preventDefault();
      setExpanded(true);
    }
  };

  return (
    <div className="fixed top-3 sm:top-6 left-1/2 -translate-x-1/2 z-50 px-2 sm:px-4 max-w-[calc(100vw-1rem)] sm:max-w-full">
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={isExpanded ? "expanded" : "collapsed"}
        variants={containerVariants}
        layout
        whileHover={!isExpanded ? { scale: 1.06 } : {}}
        whileTap={!isExpanded ? { scale: 0.96 } : {}}
        onClick={handleNavClick}
        className={cn(
          "flex items-center rounded-full border border-border/60 bg-card/85 backdrop-blur-md shadow-lg shadow-black/5 transition-all duration-200",
          !isExpanded
            ? "cursor-pointer py-2 px-4 justify-center"
            : "py-1.5 sm:py-2.5 px-2.5 sm:px-6 gap-1.5 sm:gap-6"
        )}
      >
        {/* Brand / Logo */}
        <div
          className="flex items-center gap-2 cursor-pointer flex-shrink-0"
          onClick={() => {
            if (isExpanded) router.push("/");
          }}
        >
          <div className="w-7 h-7 sm:w-9 sm:h-9 bg-transparent rounded-lg flex items-center justify-center">
            <Image src="/AppIcon.png" alt="PostMyGig" width={36} height={36} className="w-full h-full object-contain" />
          </div>
          {isExpanded && (
            <span className="hidden sm:inline text-base sm:text-lg font-bold text-primary tracking-tight pr-1">
              PostMy<span className="text-accent-foreground">Gig</span>
            </span>
          )}
        </div>

        {/* Collapsed Menu Icon */}
        {!isExpanded && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center justify-center text-foreground pl-1"
          >
            <Menu className="w-5 h-5 text-primary" />
          </motion.div>
        )}

        {/* Expanded Navigation Links & Actions */}
        {isExpanded && (
          <motion.div variants={itemVariants} className="flex items-center gap-1.5 sm:gap-6">
            {/* Navigation Links - Always Visible */}
            <div className="flex items-center space-x-0.5 sm:space-x-2">
              <button
                onClick={() => handleScrollTo("#features")}
                className="text-muted-foreground hover:text-foreground text-[11px] sm:text-sm font-medium px-2 sm:px-3.5 py-1 sm:py-2 rounded-full hover:bg-accent/60 transition-colors whitespace-nowrap"
              >
                Features
              </button>
              <button
                onClick={() => handleScrollTo("#how-it-works")}
                className="text-muted-foreground hover:text-foreground text-[11px] sm:text-sm font-medium px-2 sm:px-3.5 py-1 sm:py-2 rounded-full hover:bg-accent/60 transition-colors whitespace-nowrap"
              >
                How it works
              </button>
              <button
                onClick={() => handleScrollTo("#demo-video")}
                className="text-muted-foreground hover:text-foreground text-[11px] sm:text-sm font-medium px-2 sm:px-3.5 py-1 sm:py-2 rounded-full hover:bg-accent/60 transition-colors whitespace-nowrap"
              >
                Demo
              </button>
            </div>

            {/* Actions Section */}
            <div className="flex items-center gap-1.5 sm:gap-4 pl-1.5 sm:pl-6 border-l border-border/60">
              <DarkModeToggle />
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  router.push("/view-gigs");
                }}
                className="bg-primary hover:opacity-90 text-primary-foreground text-[11px] sm:text-sm font-semibold h-7 sm:h-10 px-2.5 sm:px-5 rounded-full shadow-sm whitespace-nowrap"
              >
                Get Started
              </Button>
            </div>
          </motion.div>
        )}
      </motion.nav>
    </div>
  );
}
