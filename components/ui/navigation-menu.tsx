"use client";

import * as React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronRight } from "lucide-react";
import { DarkModeToggle } from "@/components/DarkModeToggle";
import { Button } from "@/components/ui/button";

export function AnimatedNavFramer() {
  const [isVisible, setIsVisible] = React.useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const router = useRouter();

  const { scrollY } = useScroll();
  const lastScrollY = React.useRef(0);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = lastScrollY.current;
    if (latest > previous && latest > 80) {
      setIsVisible(false);
      setMobileMenuOpen(false);
    } else if (latest < previous) {
      setIsVisible(true);
    }
    lastScrollY.current = latest;
  });

  const handleScrollTo = (id: string) => {
    setMobileMenuOpen(false);
    if (window.location.pathname !== "/") {
      router.push(`/${id}`);
    } else {
      const element = document.querySelector(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <motion.header
      initial={{ y: 0 }}
      animate={{ y: isVisible ? 0 : "-100%" }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="fixed top-0 left-0 right-0 z-50 w-full"
    >
      <div className="w-full bg-card/85 backdrop-blur-xl border-b border-border/60 shadow-md rounded-b-[2rem] sm:rounded-b-[2.5rem] px-4 sm:px-8 py-3.5 transition-colors duration-200">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Brand Logo */}
          <div
            className="flex items-center gap-2 sm:gap-2.5 cursor-pointer flex-shrink-0"
            onClick={() => {
              setMobileMenuOpen(false);
              router.push("/");
            }}
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center">
              <Image src="/AppIcon.png" alt="PostMyGig" width={36} height={36} className="w-full h-full object-contain" />
            </div>
            <span className="text-lg sm:text-xl font-bold tracking-tight text-foreground">
              PostMy<span className="text-accent-foreground">Gig</span>
            </span>
          </div>

          {/* Desktop Nav Links - Plain text links without random background box */}
          <div className="hidden md:flex items-center space-x-2 lg:space-x-4">
            <button
              onClick={() => handleScrollTo("#features")}
              className="text-muted-foreground hover:text-foreground text-sm font-medium px-3.5 py-2 transition-colors whitespace-nowrap"
            >
              Features
            </button>
            <button
              onClick={() => handleScrollTo("#how-it-works")}
              className="text-muted-foreground hover:text-foreground text-sm font-medium px-3.5 py-2 transition-colors whitespace-nowrap"
            >
              How it works
            </button>
            <button
              onClick={() => handleScrollTo("#demo-video")}
              className="text-muted-foreground hover:text-foreground text-sm font-medium px-3.5 py-2 transition-colors whitespace-nowrap"
            >
              Demo
            </button>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            <DarkModeToggle />
            <Button
              onClick={() => router.push("/view-gigs")}
              className="bg-primary hover:opacity-90 text-primary-foreground text-sm font-semibold h-10 px-5 rounded-full shadow-sm whitespace-nowrap"
            >
              Get Started
            </Button>
          </div>

          {/* Mobile Right Controls */}
          <div className="flex md:hidden items-center gap-2">
            <DarkModeToggle />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-foreground hover:bg-accent/60 rounded-full transition-colors flex items-center justify-center"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-primary" /> : <Menu className="w-5 h-5 text-primary" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown Panel */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -10 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: -10 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="md:hidden overflow-hidden bg-card/95 backdrop-blur-xl border-b border-border/60 shadow-xl rounded-b-[2rem] px-5 py-5 mt-1 mx-3"
          >
            <div className="flex flex-col gap-2">
              <button
                onClick={() => handleScrollTo("#features")}
                className="flex items-center justify-between w-full px-4 py-3 text-sm font-medium text-foreground hover:bg-accent/60 rounded-xl transition-colors"
              >
                <span>Features</span>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </button>
              <button
                onClick={() => handleScrollTo("#how-it-works")}
                className="flex items-center justify-between w-full px-4 py-3 text-sm font-medium text-foreground hover:bg-accent/60 rounded-xl transition-colors"
              >
                <span>How it works</span>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </button>
              <button
                onClick={() => handleScrollTo("#demo-video")}
                className="flex items-center justify-between w-full px-4 py-3 text-sm font-medium text-foreground hover:bg-accent/60 transition-colors"
              >
                <span>Demo</span>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </button>

              {/* Bottom Middle: Get Started CTA */}
              <div className="pt-4 mt-2 border-t border-border/60 flex items-center justify-center">
                <Button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    router.push("/view-gigs");
                  }}
                  className="w-full max-w-xs bg-primary hover:opacity-90 text-primary-foreground text-sm font-semibold h-11 rounded-full shadow-sm"
                >
                  Get Started
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
