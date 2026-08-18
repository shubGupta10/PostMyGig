import type { LandingActivityItem } from "../types"

// Helper to generate ISO date strings relative to now
const hoursAgo = (h: number) => new Date(Date.now() - 1000 * 60 * 60 * h).toISOString()
const daysAgo = (d: number) => new Date(Date.now() - 1000 * 60 * 60 * 24 * d).toISOString()

export const COMMUNITY_SUCCESS_STORIES: LandingActivityItem[] = [
  {
    _id: "story-1",
    type: "hired",
    metadata: {
      clientName: "Aarav Sharma",
      freelancerName: "Rohan Nair",
      gigTitle: "Full Stack SaaS Dashboard in Next.js 15",
      skills: ["Next.js", "TypeScript", "TailwindCSS"],
      budget: "45,000",
    },
    createdAt: hoursAgo(3),
  },
  {
    _id: "story-2",
    type: "completed",
    metadata: {
      clientName: "Meera Patel",
      freelancerName: "Sneha Reddy",
      gigTitle: "Mobile App UI/UX Design System in Figma",
      skills: ["Figma", "UI/UX", "Design Systems"],
      budget: "28,000",
    },
    createdAt: daysAgo(1),
  },
  {
    _id: "story-3",
    type: "posted",
    metadata: {
      clientName: "Vikram Malhotra",
      gigTitle: "Python Backend & OpenAI Assistant API Integration",
      skills: ["Python", "FastAPI", "OpenAI"],
      budget: "35,000",
    },
    createdAt: hoursAgo(7),
  },
  {
    _id: "story-4",
    type: "hired",
    metadata: {
      clientName: "Ananya Iyer",
      freelancerName: "Vikash Singh",
      gigTitle: "PostgreSQL Database Query Optimization & Indexing",
      skills: ["PostgreSQL", "Database Tuning", "Prisma"],
      budget: "20,000",
    },
    createdAt: daysAgo(3),
  },
  {
    _id: "story-5",
    type: "completed",
    metadata: {
      clientName: "Karthik Verma",
      freelancerName: "Priya Menon",
      gigTitle: "E-Commerce Storefront with Next.js & Stripe",
      skills: ["React", "Next.js", "Stripe"],
      budget: "55,000",
    },
    createdAt: daysAgo(5),
  },
  {
    _id: "story-6",
    type: "applied",
    metadata: {
      freelancerName: "Amit Gupta",
      gigTitle: "React Native iOS & Android Cross-Platform App",
      skills: ["React Native", "Expo", "Redux Toolkit"],
      budget: "60,000",
    },
    createdAt: daysAgo(2),
  },
  {
    _id: "story-7",
    type: "completed",
    metadata: {
      clientName: "Devika Rao",
      freelancerName: "Rahul Joshi",
      gigTitle: "Interactive Landing Page with Framer Motion",
      skills: ["React", "Framer Motion", "TailwindCSS"],
      budget: "22,000",
    },
    createdAt: daysAgo(8),
  },
  {
    _id: "story-8",
    type: "posted",
    metadata: {
      clientName: "Sanjay Singhania",
      gigTitle: "Cloudflare Workers & Edge API Architecture",
      skills: ["Cloudflare", "TypeScript", "Serverless"],
      budget: "30,000",
    },
    createdAt: daysAgo(4),
  },
  {
    _id: "story-9",
    type: "hired",
    metadata: {
      clientName: "Pooja Hegde",
      freelancerName: "Deepak Kumar",
      gigTitle: "Custom Shopify Theme & Liquid Cart Drawer",
      skills: ["Shopify", "Liquid", "JavaScript"],
      budget: "25,000",
    },
    createdAt: daysAgo(12),
  },
  {
    _id: "story-10",
    type: "completed",
    metadata: {
      clientName: "Nexus Digital Labs",
      freelancerName: "Arjun Nambiar",
      gigTitle: "WebRTC 1-on-1 Video Calling Module",
      skills: ["WebRTC", "Socket.io", "Node.js"],
      budget: "40,000",
    },
    createdAt: daysAgo(16),
  },
  {
    _id: "story-11",
    type: "hired",
    metadata: {
      clientName: "Ritu Chawla",
      freelancerName: "Tanmay Deshmukh",
      gigTitle: "Flutter Fintech Wallet & KYC Verification App",
      skills: ["Flutter", "Dart", "REST API"],
      budget: "65,000",
    },
    createdAt: daysAgo(21),
  },
  {
    _id: "story-12",
    type: "completed",
    metadata: {
      clientName: "Siddharth Jain",
      freelancerName: "Neha Kulkarni",
      gigTitle: "B2B SaaS Branding & Comprehensive Design System",
      skills: ["Branding", "Figma", "Design Tokens"],
      budget: "32,000",
    },
    createdAt: daysAgo(25),
  },
  {
    _id: "story-13",
    type: "posted",
    metadata: {
      clientName: "Zenith Commerce",
      gigTitle: "Supabase Authentication & Row Level Security Setup",
      skills: ["Supabase", "PostgreSQL", "Next.js"],
      budget: "18,000",
    },
    createdAt: daysAgo(6),
  },
  {
    _id: "story-14",
    type: "hired",
    metadata: {
      clientName: "Aditya Roy",
      freelancerName: "Manish Tiwari",
      gigTitle: "Golang High-Concurrency Microservices API",
      skills: ["Go", "gRPC", "Docker"],
      budget: "50,000",
    },
    createdAt: daysAgo(34), // ~1 month ago
  },
  {
    _id: "story-15",
    type: "completed",
    metadata: {
      clientName: "Alisha Merchant",
      freelancerName: "Gaurav Sen",
      gigTitle: "Three.js 3D Product Configurator for Web",
      skills: ["Three.js", "WebGL", "JavaScript"],
      budget: "48,000",
    },
    createdAt: daysAgo(42), // ~1 month ago
  },
  {
    _id: "story-16",
    type: "applied",
    metadata: {
      freelancerName: "Sanya Mathur",
      gigTitle: "Headless CMS Architecture with Strapi & Next.js",
      skills: ["Strapi", "Next.js", "GraphQL"],
      budget: "26,000",
    },
    createdAt: daysAgo(10),
  },
  {
    _id: "story-17",
    type: "completed",
    metadata: {
      clientName: "Karan Oberoi",
      freelancerName: "Harshit Kapoor",
      gigTitle: "Automated Web Scraping Pipeline for Real Estate",
      skills: ["Python", "Playwright", "Pandas"],
      budget: "24,000",
    },
    createdAt: daysAgo(52), // ~2 months ago
  },
  {
    _id: "story-18",
    type: "hired",
    metadata: {
      clientName: "Ishaan Sengupta",
      freelancerName: "Zoya Khan",
      gigTitle: "Executive Pitch Deck & Interactive Prototype",
      skills: ["Figma", "UI Design", "Pitch Deck"],
      budget: "30,000",
    },
    createdAt: daysAgo(65), // ~2 months ago
  },
  {
    _id: "story-19",
    type: "completed",
    metadata: {
      clientName: "Pinnacle Health",
      freelancerName: "Akash Singhal",
      gigTitle: "HIPAA-Compliant Patient Telehealth Portal",
      skills: ["Next.js", "TypeScript", "TailwindCSS"],
      budget: "70,000",
    },
    createdAt: daysAgo(72), // ~2 months ago
  },
  {
    _id: "story-20",
    type: "posted",
    metadata: {
      clientName: "Rohit Bansal",
      gigTitle: "AWS ECS Fargate & Terraform Infrastructure Setup",
      skills: ["AWS", "Terraform", "Docker"],
      budget: "42,000",
    },
    createdAt: daysAgo(14),
  },
  {
    _id: "story-21",
    type: "completed",
    metadata: {
      clientName: "Deepika Padukone",
      freelancerName: "Nikhil Aggarwal",
      gigTitle: "Multilingual Localization for iOS & Android Apps",
      skills: ["i18n", "React Native", "TypeScript"],
      budget: "22,000",
    },
    createdAt: daysAgo(80), // ~3 months ago
  },
]

export async function fetchLandingActivityFeed(): Promise<LandingActivityItem[]> {
  try {
    const res = await fetch("/api/activity/fetch-activities", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    })

    if (!res.ok) {
      return COMMUNITY_SUCCESS_STORIES
    }

    const data = await res.json()
    if (data.activityData && Array.isArray(data.activityData) && data.activityData.length > 0) {
      // Blend live DB activities at the top, followed by diverse community stories
      return [...data.activityData, ...COMMUNITY_SUCCESS_STORIES] as LandingActivityItem[]
    }

    return COMMUNITY_SUCCESS_STORIES
  } catch (error) {
    console.warn("Using community stories:", error)
    return COMMUNITY_SUCCESS_STORIES
  }
}
