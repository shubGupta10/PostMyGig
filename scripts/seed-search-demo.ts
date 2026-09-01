import { ConnectoDatabase } from "@/lib/db";
import userModel from "@/modules/users/models/UserModel";

type DemoUserRole = "client" | "freelancer";

type DemoUserInput = {
  name: string;
  email: string;
  role: DemoUserRole;
  location: string;
  bio: string;
  skills: string[];
  yearsOfExperience?: number;
  hourlyRate?: number;
  averageRating?: number;
  totalReviews?: number;
  profilePhoto: string;
  contactLinks?: Array<{ label: string; url: string }>;
  portfolioProjects?: Array<{
    title: string;
    description: string;
    tags: string[];
    liveUrl?: string;
    githubUrl?: string;
  }>;
};

const makePortfolio = (
  title: string,
  description: string,
  tags: string[],
  liveUrl: string,
  githubUrl: string,
) => ({
  title,
  description,
  tags,
  liveUrl,
  githubUrl,
});

const makeContactLinks = (baseName: string, platform = "demo") => [
  { label: "Portfolio", url: `https://${baseName.toLowerCase().replace(/\s+/g, "-")}.portfolio.${platform}.io` },
  { label: "LinkedIn", url: `https://linkedin.com/in/${baseName.toLowerCase().replace(/\s+/g, "-")}-${platform}` },
  { label: "GitHub", url: `https://github.com/${baseName.toLowerCase().replace(/\s+/g, "-")}` },
].slice(0, 2);

const indianClients: DemoUserInput[] = [
  {
    name: "Aarav Sharma",
    email: "aarav.sharma.demo@gmail.com",
    role: "client",
    location: "Bengaluru, India",
    bio: "Product-focused founder hiring product design and engineering talent to scale a B2B SaaS platform for Indian businesses.",
    skills: ["Product Strategy", "SaaS Growth", "Hiring", "Operations", "Analytics"],
    yearsOfExperience: 8,
    hourlyRate: 48,
    averageRating: 4.9,
    totalReviews: 43,
    profilePhoto: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
    contactLinks: makeContactLinks("Aarav Sharma"),
    portfolioProjects: [
      makePortfolio("B2B onboarding redesign", "Streamlined buyer onboarding and self-serve setup flow for enterprise accounts.", ["UX", "Product", "SaaS"], "https://example.com/projects/saas-onboarding", "https://github.com/demo/saas-onboarding"),
      makePortfolio("Revenue dashboard", "Built a KPI dashboard for leadership reporting across acquisitions, churn, and conversion metrics.", ["Analytics", "Dashboard", "Metrics"], "https://example.com/projects/revenue-dashboard", "https://github.com/demo/revenue-dashboard"),
    ],
  },
  {
    name: "Meera Iyer",
    email: "meera.iyer.demo@gmail.com",
    role: "client",
    location: "Chennai, India",
    bio: "Operations lead for a healthcare platform who needs reliable design and backend support for patient experience improvements.",
    skills: ["Healthcare Ops", "User Research", "Workflow Design", "Vendor Management", "Compliance"],
    yearsOfExperience: 10,
    hourlyRate: 62,
    averageRating: 4.8,
    totalReviews: 31,
    profilePhoto: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80",
    contactLinks: makeContactLinks("Meera Iyer"),
    portfolioProjects: [
      makePortfolio("Care journey audit", "Mapped patient support journey across call center, app, and pharmacy workflows.", ["Healthcare", "Ops", "UX"], "https://example.com/projects/care-journey", "https://github.com/demo/care-journey"),
    ],
  },
  {
    name: "Rohan Patel",
    email: "rohan.patel.demo@gmail.com",
    role: "client",
    location: "Mumbai, India",
    bio: "E-commerce operator scaling a direct-to-consumer brand across India and need marketing, development, and content expertise.",
    skills: ["E-commerce", "Growth Marketing", "Brand", "CRM", "Performance"],
    yearsOfExperience: 7,
    hourlyRate: 55,
    averageRating: 4.7,
    totalReviews: 26,
    profilePhoto: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80",
    contactLinks: makeContactLinks("Rohan Patel"),
    portfolioProjects: [
      makePortfolio("Retention funnel", "Improved repeat purchase flow using lifecycle emails and product recommendation logic.", ["Marketing", "Ecommerce", "Lifecycle"], "https://example.com/projects/retention-funnel", "https://github.com/demo/retention-funnel"),
    ],
  },
  {
    name: "Nisha Nair",
    email: "nisha.nair.demo@gmail.com",
    role: "client",
    location: "Bengaluru, India",
    bio: "Startup operator building a B2B marketplace and looking for a strong front-end and platform engineering partner.",
    skills: ["Startup Ops", "UX", "Platform", "Partnerships", "Growth"],
    yearsOfExperience: 9,
    hourlyRate: 58,
    averageRating: 4.9,
    totalReviews: 38,
    profilePhoto: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=400&q=80",
    contactLinks: makeContactLinks("Nisha Nair"),
    portfolioProjects: [
      makePortfolio("Marketplace onboarding", "Designed a conversion-first marketplace onboarding sequence for supplier onboarding to featured listings.", ["Marketplace", "Onboarding", "UX"], "https://example.com/projects/marketplace-onboarding", "https://github.com/demo/marketplace-onboarding"),
    ],
  },
  {
    name: "Vikram Rao",
    email: "vikram.rao.demo@gmail.com",
    role: "client",
    location: "Hyderabad, India",
    bio: "Director of customer success helping a software team improve onboarding, reporting, and technical enablement for enterprise clients.",
    skills: ["Customer Success", "Enablement", "Product Docs", "Analytics", "Onboarding"],
    yearsOfExperience: 11,
    hourlyRate: 65,
    averageRating: 4.8,
    totalReviews: 44,
    profilePhoto: "https://images.unsplash.com/photo-1504593811423-6dd665756598?auto=format&fit=crop&w=400&q=80",
    contactLinks: makeContactLinks("Vikram Rao"),
    portfolioProjects: [
      makePortfolio("Enterprise onboarding library", "Created a reusable onboarding library for enterprise implementation and support teams.", ["CS", "Docs", "Enablement"], "https://example.com/projects/enablement-library", "https://github.com/demo/enablement-library"),
    ],
  },
  {
    name: "Sneha Kulkarni",
    email: "sneha.kulkarni.demo@gmail.com",
    role: "client",
    location: "Pune, India",
    bio: "Brand and growth strategist building a creator-led commerce business and hiring specialists across creative, analytics, and web.",
    skills: ["Brand Strategy", "Creator Economy", "Analytics", "Email", "Creative Ops"],
    yearsOfExperience: 6,
    hourlyRate: 52,
    averageRating: 4.7,
    totalReviews: 24,
    profilePhoto: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80",
    contactLinks: makeContactLinks("Sneha Kulkarni"),
    portfolioProjects: [
      makePortfolio("Creator launch system", "Built repeatable launch assets and funnels for creator-led product offers.", ["Brand", "Growth", "Creator"], "https://example.com/projects/creator-launch", "https://github.com/demo/creator-launch"),
    ],
  },
  {
    name: "Karan Singh",
    email: "karan.singh.demo@gmail.com",
    role: "client",
    location: "Delhi, India",
    bio: "Modern retail business owner looking for a design and engineering partner to improve conversion and customer trust online.",
    skills: ["Retail Ops", "UX", "Brand", "CRM", "Conversion"],
    yearsOfExperience: 8,
    hourlyRate: 50,
    averageRating: 4.6,
    totalReviews: 19,
    profilePhoto: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80",
    contactLinks: makeContactLinks("Karan Singh"),
    portfolioProjects: [
      makePortfolio("Store conversion refresh", "Designed a cleaner storefront and checkout funnel for mobile-first buyers.", ["Ecommerce", "Conversion", "UI"], "https://example.com/projects/store-refresh", "https://github.com/demo/store-refresh"),
    ],
  },
];

const americanClients: DemoUserInput[] = [
  {
    name: "Emma Johnson",
    email: "emma.johnson.demo@gmail.com",
    role: "client",
    location: "Austin, TX, United States",
    bio: "Founder of a boutique software consultancy building client portals and internal systems for service businesses.",
    skills: ["Product", "Client Portals", "Operations", "UX", "Strategy"],
    yearsOfExperience: 9,
    hourlyRate: 72,
    averageRating: 5,
    totalReviews: 57,
    profilePhoto: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80",
    contactLinks: makeContactLinks("Emma Johnson"),
    portfolioProjects: [
      makePortfolio("Client portal launch", "Rebuilt the customer portal experience into a cleaner, faster onboarding flow.", ["Portal", "UX", "SaaS"], "https://example.com/projects/client-portal", "https://github.com/demo/client-portal"),
    ],
  },
  {
    name: "Daniel Brooks",
    email: "daniel.brooks.demo@gmail.com",
    role: "client",
    location: "Seattle, WA, United States",
    bio: "Marketing and operations leader for a small agency seeking strong design and web development support for client work.",
    skills: ["Marketing", "Agency Ops", "Brand", "Analytics", "Web"],
    yearsOfExperience: 10,
    hourlyRate: 68,
    averageRating: 4.8,
    totalReviews: 41,
    profilePhoto: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
    contactLinks: makeContactLinks("Daniel Brooks"),
    portfolioProjects: [
      makePortfolio("Agency website refresh", "Modernized company site and client case studies for a more premium brand feel.", ["Brand", "Marketing", "Web"], "https://example.com/projects/agency-refresh", "https://github.com/demo/agency-refresh"),
    ],
  },
  {
    name: "Olivia Martinez",
    email: "olivia.martinez.demo@gmail.com",
    role: "client",
    location: "Chicago, IL, United States",
    bio: "Regional operations manager hiring specialists to build internal tracking tools for growth, inventory, and customer follow-up.",
    skills: ["Operations", "Inventory", "Reporting", "Automation", "Workflow"],
    yearsOfExperience: 8,
    hourlyRate: 64,
    averageRating: 4.7,
    totalReviews: 29,
    profilePhoto: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=400&q=80",
    contactLinks: makeContactLinks("Olivia Martinez"),
    portfolioProjects: [
      makePortfolio("Inventory dashboard", "Created a weekly dashboard for stock movements, fulfillment, and partner performance.", ["Ops", "Dashboard", "Analytics"], "https://example.com/projects/inventory-dashboard", "https://github.com/demo/inventory-dashboard"),
    ],
  },
];

const indianFreelancers: DemoUserInput[] = [
  {
    name: "Aditi Nair",
    email: "aditi.nair.demo@gmail.com",
    role: "freelancer",
    location: "Bengaluru, India",
    bio: "Senior product designer and front-end specialist helping startups design intuitive user journeys and high-converting interfaces.",
    skills: ["Figma", "UX Research", "React", "Next.js", "Design Systems"],
    yearsOfExperience: 6,
    hourlyRate: 35,
    averageRating: 4.9,
    totalReviews: 62,
    profilePhoto: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80",
    contactLinks: makeContactLinks("Aditi Nair"),
    portfolioProjects: [
      makePortfolio("SaaS dashboard revamp", "Redesigned a complex dashboard into a simplified, conversion-focused product experience.", ["Design", "Next.js", "UX"], "https://example.com/projects/saas-dashboard", "https://github.com/demo/saas-dashboard"),
      makePortfolio("E-commerce checkout refresh", "Improved mobile checkout flow reducing drop-off for a growing consumer brand.", ["Checkout", "UX", "Mobile"], "https://example.com/projects/checkout-refresh", "https://github.com/demo/checkout-refresh"),
    ],
  },
  {
    name: "Rohit Menon",
    email: "rohit.menon.demo@gmail.com",
    role: "freelancer",
    location: "Kochi, India",
    bio: "Full-stack engineer building scalable web products with a strong focus on performance, architecture, and shipping MVPs quickly.",
    skills: ["Node.js", "TypeScript", "React", "MongoDB", "AWS"],
    yearsOfExperience: 7,
    hourlyRate: 42,
    averageRating: 4.8,
    totalReviews: 55,
    profilePhoto: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
    contactLinks: makeContactLinks("Rohit Menon"),
    portfolioProjects: [
      makePortfolio("MVP backend platform", "Built the API and admin tooling for a multi-tenant SaaS platform used by local businesses.", ["Node.js", "MongoDB", "API"], "https://example.com/projects/mvp-backend", "https://github.com/demo/mvp-backend"),
    ],
  },
  {
    name: "Sanjana Rao",
    email: "sanjana.rao.demo@gmail.com",
    role: "freelancer",
    location: "Hyderabad, India",
    bio: "Front-end developer crafting clean, maintainable interfaces for SaaS and marketplace products across mobile and web.",
    skills: ["React", "TailwindCSS", "TypeScript", "Accessibility", "UI"],
    yearsOfExperience: 5,
    hourlyRate: 32,
    averageRating: 4.9,
    totalReviews: 48,
    profilePhoto: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80",
    contactLinks: makeContactLinks("Sanjana Rao"),
    portfolioProjects: [
      makePortfolio("Marketplace storefront", "Developed a responsive storefront and collection discovery experience for a growing marketplace.", ["React", "Tailwind", "Marketplace"], "https://example.com/projects/marketplace-storefront", "https://github.com/demo/marketplace-storefront"),
    ],
  },
  {
    name: "Vivek Sethi",
    email: "vivek.sethi.demo@gmail.com",
    role: "freelancer",
    location: "Delhi, India",
    bio: "Data and automation specialist focused on building dashboards, scripts, and reporting workflows for modern teams.",
    skills: ["Python", "SQL", "Automation", "Power BI", "Data Analysis"],
    yearsOfExperience: 6,
    hourlyRate: 38,
    averageRating: 4.7,
    totalReviews: 33,
    profilePhoto: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80",
    contactLinks: makeContactLinks("Vivek Sethi"),
    portfolioProjects: [
      makePortfolio("Sales insight dashboard", "Built an executive dashboard combining CRM, pipeline, and retention data across multiple teams.", ["SQL", "Dashboard", "Automation"], "https://example.com/projects/sales-dashboard", "https://github.com/demo/sales-dashboard"),
    ],
  },
  {
    name: "Ananya Desai",
    email: "ananya.desai.demo@gmail.com",
    role: "freelancer",
    location: "Pune, India",
    bio: "Full-stack developer delivering polished web apps for startups with a strong eye for UX and production-grade tooling.",
    skills: ["Next.js", "TypeScript", "Prisma", "PostgreSQL", "Supabase"],
    yearsOfExperience: 5,
    hourlyRate: 37,
    averageRating: 4.9,
    totalReviews: 52,
    profilePhoto: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80",
    contactLinks: makeContactLinks("Ananya Desai"),
    portfolioProjects: [
      makePortfolio("Customer portal", "Built a customer portal with secure access, billing data, and support workflows.", ["Next.js", "Auth", "Product"], "https://example.com/projects/customer-portal", "https://github.com/demo/customer-portal"),
    ],
  },
  {
    name: "Karan Joshi",
    email: "karan.joshi.demo@gmail.com",
    role: "freelancer",
    location: "Mumbai, India",
    bio: "Software engineer specializing in scalable APIs, cloud integrations, and product tooling for growing digital businesses.",
    skills: ["Node.js", "Express", "Redis", "Docker", "PostgreSQL"],
    yearsOfExperience: 8,
    hourlyRate: 45,
    averageRating: 4.8,
    totalReviews: 39,
    profilePhoto: "https://images.unsplash.com/photo-1504593811423-6dd665756598?auto=format&fit=crop&w=400&q=80",
    contactLinks: makeContactLinks("Karan Joshi"),
    portfolioProjects: [
      makePortfolio("API modernization", "Modernized a legacy API layer and reduced latency by consolidating services and caching patterns.", ["API", "Redis", "Backend"], "https://example.com/projects/api-modernization", "https://github.com/demo/api-modernization"),
    ],
  },
  {
    name: "Mitali Verma",
    email: "mitali.verma.demo@gmail.com",
    role: "freelancer",
    location: "Jaipur, India",
    bio: "Brand designer and front-end partner helping early-stage teams turn product ideas into polished, clear experiences.",
    skills: ["Brand Design", "Illustration", "Figma", "Web Design", "Marketing"],
    yearsOfExperience: 4,
    hourlyRate: 28,
    averageRating: 4.7,
    totalReviews: 24,
    profilePhoto: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80",
    contactLinks: makeContactLinks("Mitali Verma"),
    portfolioProjects: [
      makePortfolio("Founder brand kit", "Created launch assets, message hierarchy, and landing page visuals for a startup brand refresh.", ["Brand", "Figma", "Marketing"], "https://example.com/projects/brand-kit", "https://github.com/demo/brand-kit"),
    ],
  },
];

const americanFreelancers: DemoUserInput[] = [
  {
    name: "Grace Miller",
    email: "grace.miller.demo@gmail.com",
    role: "freelancer",
    location: "Austin, TX, United States",
    bio: "Senior product designer working with SaaS teams to turn product complexity into intuitive, conversion-friendly workflows.",
    skills: ["Figma", "UX Strategy", "Design Systems", "User Research", "React"],
    yearsOfExperience: 8,
    hourlyRate: 58,
    averageRating: 5,
    totalReviews: 71,
    profilePhoto: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80",
    contactLinks: makeContactLinks("Grace Miller"),
    portfolioProjects: [
      makePortfolio("Admin workflow redesign", "Simplified complex admin workflows for a SaaS platform used by operations teams.", ["UX", "Design Systems", "Product"], "https://example.com/projects/admin-workflow", "https://github.com/demo/admin-workflow"),
    ],
  },
  {
    name: "Marcus Lee",
    email: "marcus.lee.demo@gmail.com",
    role: "freelancer",
    location: "Seattle, WA, United States",
    bio: "Full-stack engineer helping startups ship polished products across front-end, API layers, and cloud deployment workflows.",
    skills: ["Next.js", "TypeScript", "Node.js", "PostgreSQL", "AWS"],
    yearsOfExperience: 9,
    hourlyRate: 61,
    averageRating: 4.9,
    totalReviews: 63,
    profilePhoto: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
    contactLinks: makeContactLinks("Marcus Lee"),
    portfolioProjects: [
      makePortfolio("Customer support portal", "Delivered a layered support portal with knowledge base, case tracking, and internal handoff flows.", ["Next.js", "Backend", "UX"], "https://example.com/projects/support-portal", "https://github.com/demo/support-portal"),
    ],
  },
  {
    name: "Rachel Adams",
    email: "rachel.adams.demo@gmail.com",
    role: "freelancer",
    location: "Chicago, IL, United States",
    bio: "Growth-focused marketer and data analyst creating funnels, landing pages, and performance dashboards for digital products.",
    skills: ["Growth Marketing", "SQL", "Analytics", "CRM", "SEO"],
    yearsOfExperience: 6,
    hourlyRate: 43,
    averageRating: 4.8,
    totalReviews: 34,
    profilePhoto: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=400&q=80",
    contactLinks: makeContactLinks("Rachel Adams"),
    portfolioProjects: [
      makePortfolio("Acquisition reporting hub", "Built a reporting suite for campaign performance and lifecycle optimization across channels.", ["Analytics", "Marketing", "Dashboards"], "https://example.com/projects/acquisition-hub", "https://github.com/demo/acquisition-hub"),
    ],
  },
];

const demoUsers: DemoUserInput[] = [
  ...indianClients,
  ...americanClients,
  ...indianFreelancers,
  ...americanFreelancers,
];

if (demoUsers.length !== 20) {
  throw new Error(`Expected 20 demo users, found ${demoUsers.length}.`);
}

const indianClientCount = indianClients.length;
const americanClientCount = americanClients.length;
const indianFreelancerCount = indianFreelancers.length;
const americanFreelancerCount = americanFreelancers.length;

if (indianClientCount !== 7 || americanClientCount !== 3 || indianFreelancerCount !== 7 || americanFreelancerCount !== 3) {
  throw new Error(
    `Invalid distribution: clients=${indianClientCount + americanClientCount} (${indianClientCount} India, ${americanClientCount} US) ` +
      `| freelancers=${indianFreelancerCount + americanFreelancerCount} (${indianFreelancerCount} India, ${americanFreelancerCount} US)`,
  );
}

async function seedSearchDemo() {
  await ConnectoDatabase();

  let created = 0;
  let updated = 0;

  for (const user of demoUsers) {
    const normalizedUser = {
      ...user,
      email: user.email.toLowerCase(),
      onboardingCompleted: true,
      activityPublic: true,
      showEmail: false,
      showContactLinks: true,
      isVerified: true,
      verificationStatus: "approved",
      provider: "credentials",
      isBanned: false,
      reportCount: 0,
      role: user.role,
    };

    const existing = await userModel.findOne({ email: normalizedUser.email }).lean();

    if (existing) {
      await userModel.updateOne({ _id: existing._id }, { $set: normalizedUser });
      updated += 1;
      continue;
    }

    await userModel.create(normalizedUser);
    created += 1;
  }

  console.log(`Search demo seed complete: ${created} created, ${updated} updated.`);
  console.log(`Total demo users: ${demoUsers.length}`);
}

seedSearchDemo()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Search demo seed failed:", error);
    process.exit(1);
  });
