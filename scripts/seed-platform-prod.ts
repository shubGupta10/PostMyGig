import { ConnectoDatabase } from "@/lib/db";
import userModel from "@/models/UserModel";
import ProjectModel from "@/models/ProjectModel";
import Activity from "@/models/ActivityModel";
import redis from "@/lib/redis";

// Helper to compute realistic staggered dates
const hoursAgo = (h: number) => new Date(Date.now() - 1000 * 60 * 60 * h);
const daysAgo = (d: number) => new Date(Date.now() - 1000 * 60 * 60 * 24 * d);

// Curated Fallback Client Profiles (Used if dynamic API is unreachable)
export const FALLBACK_CLIENTS = [
  // --- Indian Clients (6) ---
  {
    name: "Aarav Sharma",
    email: "aarav.sharma24@gmail.com",
    role: "client",
    location: "Bengaluru, India",
    bio: "Running a boutique technical talent desk and organizing local developer meetups.",
    onboardingCompleted: true,
    activityPublic: true,
    showEmail: false,
    showContactLinks: false,
    isVerified: true,
    verificationStatus: "approved",
    provider: "credentials",
  },
  {
    name: "Meera Patel",
    email: "meera.patel91@gmail.com",
    role: "client",
    location: "Mumbai, India",
    bio: "Operations coordinator at a specialty coffee brand and lifestyle retail store.",
    onboardingCompleted: true,
    activityPublic: true,
    showEmail: false,
    showContactLinks: false,
    isVerified: true,
    verificationStatus: "approved",
    provider: "credentials",
  },
  {
    name: "Vikram Malhotra",
    email: "vikram.malhotra@outlook.com",
    role: "client",
    location: "Delhi NCR, India",
    bio: "Independent property consultant building modern residential listings for urban buyers.",
    onboardingCompleted: true,
    activityPublic: true,
    showEmail: false,
    showContactLinks: false,
    isVerified: true,
    verificationStatus: "approved",
    provider: "credentials",
  },
  {
    name: "Ananya Iyer",
    email: "ananya.iyer.work@gmail.com",
    role: "client",
    location: "Chennai, India",
    bio: "Content strategist and weekly audio podcast host covering indie publishing.",
    onboardingCompleted: true,
    activityPublic: true,
    showEmail: false,
    showContactLinks: false,
    isVerified: true,
    verificationStatus: "approved",
    provider: "credentials",
  },
  {
    name: "Karthik Verma",
    email: "karthik.verma88@yahoo.com",
    role: "client",
    location: "Pune, India",
    bio: "Small parts manufacturing coordinator automating internal warehouse counts.",
    onboardingCompleted: true,
    activityPublic: true,
    showEmail: false,
    showContactLinks: false,
    isVerified: true,
    verificationStatus: "approved",
    provider: "credentials",
  },
  {
    name: "Sneha Reddy",
    email: "sneha.reddy.hyd@gmail.com",
    role: "client",
    location: "Hyderabad, India",
    bio: "Yoga instructor & wellness educator managing weekly studio cohorts and class schedules.",
    onboardingCompleted: true,
    activityPublic: true,
    showEmail: false,
    showContactLinks: false,
    isVerified: true,
    verificationStatus: "approved",
    provider: "credentials",
  },

  // --- American Clients (6) ---
  {
    name: "David Miller",
    email: "david.miller.crafts@gmail.com",
    role: "client",
    location: "Austin, TX, United States",
    bio: "Custom hardwood furniture craftsman expanding online catalog and quotation requests.",
    onboardingCompleted: true,
    activityPublic: true,
    showEmail: false,
    showContactLinks: false,
    isVerified: true,
    verificationStatus: "approved",
    provider: "credentials",
  },
  {
    name: "Sarah Jenkins",
    email: "sarah.jenkins.design@outlook.com",
    role: "client",
    location: "Seattle, WA, United States",
    bio: "Landscape architect coordinating municipal park proposals and client concept decks.",
    onboardingCompleted: true,
    activityPublic: true,
    showEmail: false,
    showContactLinks: false,
    isVerified: true,
    verificationStatus: "approved",
    provider: "credentials",
  },
  {
    name: "Michael Brown",
    email: "michael.brown.denver@gmail.com",
    role: "client",
    location: "Denver, CO, United States",
    bio: "Outdoor gear repair shop owner modernizing customer turnaround tracking and intake.",
    onboardingCompleted: true,
    activityPublic: true,
    showEmail: false,
    showContactLinks: false,
    isVerified: true,
    verificationStatus: "approved",
    provider: "credentials",
  },
  {
    name: "Emily Watson",
    email: "emily.watson.events@gmail.com",
    role: "client",
    location: "Chicago, IL, United States",
    bio: "Corporate event coordinator planning annual healthcare and professional conferences.",
    onboardingCompleted: true,
    activityPublic: true,
    showEmail: false,
    showContactLinks: false,
    isVerified: true,
    verificationStatus: "approved",
    provider: "credentials",
  },
  {
    name: "James Wilson",
    email: "james.wilson.solar@outlook.com",
    role: "client",
    location: "San Diego, CA, United States",
    bio: "Residential solar energy consultant helping families estimate roof kilowatt savings.",
    onboardingCompleted: true,
    activityPublic: true,
    showEmail: false,
    showContactLinks: false,
    isVerified: true,
    verificationStatus: "approved",
    provider: "credentials",
  },
  {
    name: "Olivia Taylor",
    email: "olivia.taylor.audio@gmail.com",
    role: "client",
    location: "Nashville, TN, United States",
    bio: "Independent recording studio manager handling songwriter tracking and track mastering.",
    onboardingCompleted: true,
    activityPublic: true,
    showEmail: false,
    showContactLinks: false,
    isVerified: true,
    verificationStatus: "approved",
    provider: "credentials",
  },

  // --- British Clients (6) ---
  {
    name: "Oliver Clarke",
    email: "oliver.clarke.heritage@gmail.com",
    role: "client",
    location: "London, United Kingdom",
    bio: "Architectural restoration surveyor documenting historic stone structures.",
    onboardingCompleted: true,
    activityPublic: true,
    showEmail: false,
    showContactLinks: false,
    isVerified: true,
    verificationStatus: "approved",
    provider: "credentials",
  },
  {
    name: "Charlotte Evans",
    email: "charlotte.evans.bakery@gmail.com",
    role: "client",
    location: "Manchester, United Kingdom",
    bio: "Artisan sourdough bakery owner managing wholesale orders across four shop branches.",
    onboardingCompleted: true,
    activityPublic: true,
    showEmail: false,
    showContactLinks: false,
    isVerified: true,
    verificationStatus: "approved",
    provider: "credentials",
  },
  {
    name: "Harry Davies",
    email: "harry.davies.photo@outlook.com",
    role: "client",
    location: "Bristol, United Kingdom",
    bio: "Independent editorial photographer publishing limited-run regional photo anthologies.",
    onboardingCompleted: true,
    activityPublic: true,
    showEmail: false,
    showContactLinks: false,
    isVerified: true,
    verificationStatus: "approved",
    provider: "credentials",
  },
  {
    name: "Sophie Thomas",
    email: "sophie.thomas.ceramics@gmail.com",
    role: "client",
    location: "Edinburgh, United Kingdom",
    bio: "Ceramics artist crafting handmade tableware for galleries and boutique cafes.",
    onboardingCompleted: true,
    activityPublic: true,
    showEmail: false,
    showContactLinks: false,
    isVerified: true,
    verificationStatus: "approved",
    provider: "credentials",
  },
  {
    name: "George Wright",
    email: "george.wright.services@gmail.com",
    role: "client",
    location: "Birmingham, United Kingdom",
    bio: "Commercial building services engineer preparing site estimates and inspection reports.",
    onboardingCompleted: true,
    activityPublic: true,
    showEmail: false,
    showContactLinks: false,
    isVerified: true,
    verificationStatus: "approved",
    provider: "credentials",
  },
  {
    name: "Emma Walker",
    email: "emma.walker.books@outlook.com",
    role: "client",
    location: "Bath, United Kingdom",
    bio: "Independent bookshop proprietor organizing monthly author reading salons and book clubs.",
    onboardingCompleted: true,
    activityPublic: true,
    showEmail: false,
    showContactLinks: false,
    isVerified: true,
    verificationStatus: "approved",
    provider: "credentials",
  },
];

// Fetch 18 Dynamic Authentic Profiles via RandomUser API (6 Indian, 6 American, 6 British)
export async function fetchDynamicClients(): Promise<any[]> {
  try {
    const [resIn, resUs, resGb] = await Promise.all([
      fetch("https://randomuser.me/api/?results=6&nat=in&inc=name,location,email,picture", { signal: AbortSignal.timeout(5000) }),
      fetch("https://randomuser.me/api/?results=6&nat=us&inc=name,location,email,picture", { signal: AbortSignal.timeout(5000) }),
      fetch("https://randomuser.me/api/?results=6&nat=gb&inc=name,location,email,picture", { signal: AbortSignal.timeout(5000) }),
    ]);

    if (!resIn.ok || !resUs.ok || !resGb.ok) {
      throw new Error("API response error from RandomUser");
    }

    const dataIn = await resIn.json();
    const dataUs = await resUs.json();
    const dataGb = await resGb.json();

    const indianBios = [
      "Running a boutique technical talent desk and organizing local developer meetups.",
      "Operations coordinator at a specialty coffee brand and lifestyle retail store.",
      "Independent property consultant building modern residential listings for urban buyers.",
      "Content strategist and weekly audio podcast host covering indie publishing.",
      "Small parts manufacturing coordinator automating internal warehouse counts.",
      "Yoga instructor & wellness educator managing weekly studio cohorts and class schedules.",
    ];

    const americanBios = [
      "Custom hardwood furniture craftsman expanding online catalog and quotation requests.",
      "Landscape architect coordinating municipal park proposals and client concept decks.",
      "Outdoor gear repair shop owner modernizing customer turnaround tracking and intake.",
      "Corporate event coordinator planning annual healthcare and professional conferences.",
      "Residential solar energy consultant helping families estimate roof kilowatt savings.",
      "Independent recording studio manager handling songwriter tracking and track mastering.",
    ];

    const britishBios = [
      "Architectural restoration surveyor documenting historic stone structures.",
      "Artisan sourdough bakery owner managing wholesale orders across four shop branches.",
      "Independent editorial photographer publishing limited-run regional photo anthologies.",
      "Ceramics artist crafting handmade tableware for galleries and boutique cafes.",
      "Commercial building services engineer preparing site estimates and inspection reports.",
      "Independent bookshop proprietor organizing monthly author reading salons and book clubs.",
    ];

    const emailDomains = ["gmail.com", "outlook.com", "yahoo.com", "icloud.com", "hotmail.com"];

    const parseClients = (results: any[], country: string, bios: string[]) => {
      return results.map((item: any, idx: number) => {
        const first = item.name?.first || "Client";
        const last = item.name?.last || `${idx + 1}`;
        const cleanName = `${first} ${last}`;
        const domain = emailDomains[idx % emailDomains.length];
        const cleanEmail = item.email || `${first.toLowerCase().replace(/[^a-z]/g, "")}.${last.toLowerCase().replace(/[^a-z]/g, "")}${Math.floor(Math.random() * 89 + 10)}@${domain}`;
        const city = item.location?.city || "Metro";

        return {
          name: cleanName,
          email: cleanEmail,
          role: "client",
          location: `${city}, ${country}`,
          bio: bios[idx % bios.length],
          profilePhoto: item.picture?.large || item.picture?.medium || "",
          onboardingCompleted: true,
          activityPublic: true,
          showEmail: false,
          showContactLinks: false,
          isVerified: true,
          verificationStatus: "approved",
          provider: "credentials",
        };
      });
    };

    const indianClients = parseClients(dataIn.results || [], "India", indianBios);
    const americanClients = parseClients(dataUs.results || [], "United States", americanBios);
    const britishClients = parseClients(dataGb.results || [], "United Kingdom", britishBios);

    return [...indianClients, ...americanClients, ...britishClients];
  } catch (err) {
    console.warn("RandomUser API unavailable or timed out, using fallback profiles:", err);
    return FALLBACK_CLIENTS;
  }
}

export async function fetchDynamicFreelancers(): Promise<string[]> {
  try {
    const res = await fetch("https://randomuser.me/api/?results=10&nat=in,us,gb&inc=name", {
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) throw new Error("RandomUser API error");
    const data = await res.json();
    return (data.results || []).map((item: any) => `${item.name.first} ${item.name.last}`);
  } catch (err) {
    console.warn("Failed to fetch dynamic freelancers:", err);
    return [];
  }
}


export const SEED_GIG_TEMPLATES = [
  // 1. Frontend / React
  {
    title: "React Dev for Direct Message Feature & UI Drawer",
    description: "Need a frontend dev to build a Direct Message interface based on existing Figma designs. The core requirement is a slide-out drawer component for active conversations, along with a 'Search for Users' input field.\n\nNeeds 'Cancel' and 'Create' buttons for initiating new threads. The Figma mockups are 100% complete and ready for handoff.\n\nMust ensure smooth animations on the drawer toggle and cleanly map the UI components to our existing REST endpoints. Stack is React, Tailwind, and TypeScript.",
    budget: "30,000",
    skillsRequired: ["React", "TypeScript", "TailwindCSS"],
    createdAt: hoursAgo(2),
    status: "active",
  },

  // 2. Python / Data
  {
    title: "Python OCR Script - Claude/GPT-4 API",
    description: "Required: A local Python script to process roughly 4,000 scanned legal PDFs and extract specific entities into a CSV. \n\nThe source files contain blurry faxes and handwritten notes. The script should use PyPDF2 and Tesseract for OCR, then pass the text to the Anthropic or OpenAI API for extraction (Date, Amount, Sender, Recipient).\n\nMust include a basic interface like Streamlit so non-developers can run it locally. Needs solid error handling to skip and log illegible pages instead of crashing.",
    budget: "55,000",
    skillsRequired: ["Python", "OpenAI API", "OCR"],
    createdAt: hoursAgo(4),
    status: "active",
  },

  // 3. Mobile App
  {
    title: "React Native Bluetooth (BLE) Fixes",
    description: "Seeking a React Native specialist to troubleshoot dropping background Bluetooth Low Energy (BLE) connections. The app connects to custom ESP32 hardware via react-native-ble-plx.\n\nData needs to sync automatically via SQLite when the hardware is within range, but the connection keeps terminating when the app is minimized.\n\nNeed this patched for Android specifically. Hardware prototypes and a test device will be shipped to you.",
    budget: "70,000",
    skillsRequired: ["React Native", "Bluetooth", "Android"],
    createdAt: daysAgo(1),
    status: "active",
  },

  // 4. DevOps
  {
    title: "AWS Fargate Setup for Legacy Laravel 7",
    description: "Looking for an AWS engineer to migrate a legacy PHP 7.4/Laravel 7 application. Currently hosted on a vulnerable VPS and needs to be containerized.\n\nTask is to write the Dockerfile, set up an ECS Fargate cluster, RDS MySQL, and ElastiCache. Need strict Security Groups configured. \n\nA clean database dump and source code repo are ready. Looking for someone who can deploy this within 48 hours to restore secure access.",
    budget: "45,000",
    skillsRequired: ["AWS", "Docker", "Laravel"],
    createdAt: hoursAgo(5),
    status: "active",
  },

  // 5. Frontend Performance
  {
    title: "Remove jQuery from Rails App (Vanilla JS)",
    description: "Task: Strip out legacy jQuery code from a large Ruby on Rails application and replace it with Vanilla JS (ES6) and Fetch API. \n\nThe current DOM manipulation is causing 3-second freezes on data-heavy tables. No new frontend frameworks needed—just clean up the existing asset pipeline, rewrite the event listeners, and optimize the table rendering.\n\nPrioritized list of the 5 worst views is ready for review.",
    budget: "38,000",
    skillsRequired: ["JavaScript", "Ruby on Rails", "Performance Optimization"],
    createdAt: daysAgo(3),
    status: "active",
  },

  // 6. Game Development
  {
    title: "Godot 4 Optimization & Memory Leaks",
    description: "Experiencing severe memory leaks in a 2D Godot 4 metroidvania project. Framerates drop from 60 to 15 after a few level transitions.\n\nNeed an expert in GDScript to profile the game, implement object pooling for projectiles/enemies, and fix the level-loading logic (queue_free) so assets actually unload.\n\nSource code and QA logs showing exact crash locations are available. Strict 3-week deadline.",
    budget: "40,000",
    skillsRequired: ["Godot", "GDScript", "Game Development"],
    createdAt: daysAgo(2),
    status: "active",
  },

  // 7. UI Design
  {
    title: "Figma Dark Mode Dashboard UI",
    description: "Need high-fidelity Figma designs for a logistics dispatch dashboard. The interface must be high-density and strictly dark mode to prevent eye strain at night.\n\nDeliverables include 4 screens: Map View, Incidents Panel, Driver Roster, and an Analytics Graph. Must map out CSS variables/design tokens for the dev team.\n\nClick heatmaps and a raw list of required data points will be provided.",
    budget: "35,000",
    skillsRequired: ["Figma", "UI/UX Design", "Dashboard Design"],
    createdAt: hoursAgo(8),
    status: "active",
  },

  // 8. Graphic Design
  {
    title: "Hot Sauce Packaging Vector Design",
    description: "Looking for a packaging designer to update a hot sauce product line for national retail. The goal is a premium, artisanal look without losing the original brand identity.\n\nDeliverables: 3 label templates (Mild, Hot, Reserve) mapped to 5oz woozy bottles, updated typography, and print-ready CMYK vector files.\n\nHistorical sketches, FDA nutritional panels, and barcodes are ready. Please share packaging portfolios.",
    budget: "45,000",
    skillsRequired: ["Packaging Design", "Illustrator", "Branding"],
    createdAt: daysAgo(4),
    status: "active",
  },

  // 9. AR / Mobile
  {
    title: "Flutter ARKit Window Measurement Tool",
    description: "Need a mobile dev to build an AR depth mapping feature inside an existing Flutter app. The tool must scan a physical window frame and calculate exact width/height in inches.\n\nAccuracy is critical. Must implement edge detection to snap to inside corners. The calculated dimensions will sync to the main cart state.\n\nFigma UI mocks and the live codebase are ready for integration.",
    budget: "60,000",
    skillsRequired: ["Flutter", "ARKit", "Mobile App"],
    createdAt: daysAgo(5),
    status: "active",
  },

  // 10. SEO
  {
    title: "Technical SEO Content Pruning",
    description: "Seeking an SEO specialist to audit a database of 1,500+ published articles. The site is suffering from keyword cannibalization.\n\nTask: Cross-reference Ahrefs/Search Console data to identify zero-traffic URLs, and create a pruning spreadsheet mapping URLs to Update, 301 Redirect, or 410 Delete.\n\nManual review is essential to avoid redirecting active newsletter landing pages. Access to GA4 and GSC provided.",
    budget: "28,000",
    skillsRequired: ["SEO", "Content Strategy", "Google Analytics"],
    createdAt: daysAgo(2),
    status: "active",
  },

  // 11. Scripting
  {
    title: "Web Scraping / Playwright Python Script",
    description: "Need a Python developer to fix existing Selenium scrapers that are failing due to new Cloudflare protections. Target sites are municipal property auction listings.\n\nThe script needs to bypass the anti-bot checks (using Playwright, undetected-chromedriver, or proxies) and extract Address, Date, and Starting Bid into JSON.\n\nThe final scripts must be Dockerized for daily cron execution. Proxy budget is covered.",
    budget: "15,000",
    skillsRequired: ["Python", "Web Scraping", "Playwright"],
    createdAt: hoursAgo(12),
    status: "active",
  },

  // 12. Copywriting
  {
    title: "UX Microcopy Writer for Billing App",
    description: "Looking for a UX writer to rewrite system-generated error messages in a dental billing portal. The current developer-written copy is confusing users.\n\nTask involves auditing 40 screens, rewriting approx. 150 elements (form validations, toasts, button labels), and creating a simple Voice and Tone Guide for future updates.\n\nStaging link and support logs available to pinpoint the most problematic flows.",
    budget: "12,000",
    skillsRequired: ["UX Writing", "Copywriting", "User Experience"],
    createdAt: daysAgo(1),
    status: "active",
  },

  // 13. Motion Graphics
  {
    title: "Lottie Animations for App Onboarding",
    description: "Required: 4 looping 2D vector animations for a fintech mobile app onboarding flow. The animations must cover Wallet Setup, Transfers, and Swaps.\n\nStrict technical requirement: Each exported Lottie JSON file must be under 500kb. Avoid complex masks or drop shadows that fail in the Bodymovin renderer.\n\nVector storyboards and brand color hex codes are provided. Turnaround: 2 weeks.",
    budget: "25,000",
    skillsRequired: ["After Effects", "Lottie", "Motion Graphics"],
    createdAt: daysAgo(6),
    status: "active",
  },

  // 14. Data Engineering
  {
    title: "Snowflake & dbt Data Modeling",
    description: "Need a Data Engineer to set up Fivetran/Airbyte connectors and sync data from Stripe, Zendesk, and Shopify into Snowflake.\n\nTask involves writing dbt models to clean and join the datasets, creating three materialized views: Daily Active Users, Churn by Cohort, and CAC.\n\nAPI credentials and current spreadsheet formulas are ready. No frontend dashboard work required.",
    budget: "60,000",
    skillsRequired: ["Data Engineering", "Snowflake", "dbt"],
    createdAt: daysAgo(3),
    status: "active",
  },

  // 15. Email Marketing
  {
    title: "Klaviyo Subscription Retention Flows",
    description: "Seeking a Klaviyo expert to build automated retention flows for a subscription e-commerce brand facing high churn.\n\nTasks: Audit the Shopify Recharge integration, build an 'Upcoming Charge' flow with a skip option, and a 30-day 'Win-back' cancellation sequence.\n\nIncludes template design and copywriting. Must have experience dealing with subscription fatigue.",
    budget: "18,000",
    skillsRequired: ["Klaviyo", "Email Marketing", "Copywriting"],
    createdAt: hoursAgo(18),
    status: "active",
  },

  // 16. Web Audio
  {
    title: "WebAudio API JS Sequencer Fix",
    description: "Need a JavaScript audio expert to fix a browser-based drum machine. The current playback drifts off-beat because it relies on setInterval loops.\n\nThe audio engine must be rebuilt using the native WebAudio API with lookahead scheduling for sample-accurate timing. Includes integrating a master compressor node.\n\nReact frontend and WAV samples are provided. 2 week deadline.",
    budget: "32,000",
    skillsRequired: ["JavaScript", "WebAudio API", "React"],
    createdAt: daysAgo(4),
    status: "active",
  },

  // 17. Technical Writing
  {
    title: "REST API Documentation Writer",
    description: "Looking for a technical writer to convert raw developer notes into public-facing REST API docs using ReadMe or Mintlify. Task covers 25 endpoints.\n\nMust generate accurate cURL, Python, and Node.js code snippets, and write onboarding guides for Authentication and Webhooks.\n\nPostman collection and internal text files are available. Must be able to test endpoints independently.",
    budget: "22,000",
    skillsRequired: ["Technical Writing", "API Documentation", "Postman"],
    createdAt: daysAgo(2),
    status: "active",
  },

  // 18. 3D Modeling
  {
    title: "3D Blender Renders for Furniture",
    description: "Required: Photorealistic 3D renders of modular sofas. Deliverables include 4 modeled components based on STEP files, 3 fabric textures (using displacement/normal maps for Boucle, Linen, Velvet).\n\nNeed 15 lifestyle scenes in lit environments. Must export transparent PNGs for a web configurator.\n\nMacro photos of physical fabrics provided. High-end architectural rendering experience required.",
    budget: "28,000",
    skillsRequired: ["Blender", "3D Rendering", "Texturing"],
    createdAt: daysAgo(5),
    status: "active",
  },

  // 19. IoT / Hardware
  {
    title: "Python IoT Script for Raspberry Pi Camera",
    description: "Need a Python script to control a Canon DSLR via a Raspberry Pi 4. The script should use gphoto2 to trigger the camera when a GPIO button is pressed.\n\nSequence: take 3 photos, use ImageMagick to composite them onto a template, and upload the final JPEG to an AWS S3 bucket.\n\nMust be fault-tolerant for network drops. Hardware rig is accessible remotely via Tailscale.",
    budget: "18,000",
    skillsRequired: ["Python", "Raspberry Pi", "IoT"],
    createdAt: daysAgo(1),
    status: "active",
  },

  // 20. Web3
  {
    title: "Solana NFT Token Gating (Next.js)",
    description: "Looking for a Web3 developer to add Solana wallet authentication to a Next.js landing page. Users must connect their Phantom wallet to verify ownership of a specific NFT.\n\nValidation must happen server-side before rendering protected content. Coordinates cannot be hidden in React state.\n\nThe Next.js frontend is already deployed, and NFTs are minted on mainnet. Must work seamlessly on mobile in-app browsers.",
    budget: "24,000",
    skillsRequired: ["Solana", "Next.js", "Web3"],
    createdAt: hoursAgo(9),
    status: "active",
  },
];

export async function seedPlatformDatabase() {
  await ConnectoDatabase();
  const logs: string[] = [];

  const addLog = (msg: string) => {
    console.log(msg);
    logs.push(`[${new Date().toLocaleTimeString()}] ${msg}`);
  };

  addLog("🚀 Initializing live client & gig seeder...");

  // 1. Fetch Dynamic Clients from API (6 Indian, 6 American, 6 British)
  addLog("🌐 Fetching authentic client profiles from RandomUser API (India, US, UK)...");
  const clientsData = await fetchDynamicClients();
  addLog(`✓ Loaded ${clientsData.length} unique client profiles (6 Indian, 6 American, 6 British)`);

  const userMap = new Map<string, any>();
  let newUsersCount = 0;

  for (const clientData of clientsData) {
    let existingUser: any = await userModel.findOne({ email: clientData.email });
    if (!existingUser) {
      existingUser = await userModel.create(clientData);
      newUsersCount++;
      addLog(`✓ Created client: ${clientData.name} (${clientData.location})`);
    } else {
      addLog(`ℹ Found existing client profile: ${clientData.name}`);
    }
    userMap.set(clientData.email, existingUser);
  }

  // 2. Seed Gigs distributed across the dynamic clients
  const newlyCreatedGigs: { gig: any; creator: any }[] = [];
  let newGigsCount = 0;
  let updatedGigsCount = 0;
  const clientList = Array.from(userMap.values());

  for (let i = 0; i < SEED_GIG_TEMPLATES.length; i++) {
    const gigData = SEED_GIG_TEMPLATES[i];
    const creator = clientList[i % clientList.length];
    if (!creator) continue;

    const expiresAt = new Date(new Date(gigData.createdAt).getTime() + 30 * 24 * 60 * 60 * 1000);

    // Find all gigs matching this title
    const allMatches = await ProjectModel.find({ title: gigData.title }).sort({ createdAt: -1 });

    let existingGig: any = null;

    if (allMatches.length > 1) {
      // Keep newest single copy, delete older duplicate copies
      existingGig = allMatches[0];
      const duplicateIds = allMatches.slice(1).map((g) => g._id);
      const duplicateIdStrings = duplicateIds.map((id) => String(id));
      await ProjectModel.deleteMany({ _id: { $in: duplicateIds } });
      await Activity.deleteMany({ gigId: { $in: duplicateIdStrings } });
      addLog(`🧹 Removed ${duplicateIds.length} duplicate copy of: "${gigData.title}"`);
    } else if (allMatches.length === 1) {
      existingGig = allMatches[0];
    }

    if (!existingGig) {
      const created = await ProjectModel.create({
        title: gigData.title,
        description: gigData.description,
        createdBy: creator.email,
        budget: gigData.budget,
        skillsRequired: gigData.skillsRequired,
        contact: { email: "", whatsapp: "", x: "" },
        displayContactLinks: false,
        status: "active",
        expiresAt: expiresAt,
        AcceptedFreelancerEmail: "",
        isFlagged: false,
        isCurated: true,
        reportCount: 0,
        createdAt: gigData.createdAt,
        updatedAt: gigData.createdAt,
      });
      newGigsCount++;
      addLog(`✓ Created gig: "${gigData.title}" (₹${gigData.budget}) by ${creator.name}`);
      newlyCreatedGigs.push({ gig: created, creator });
    } else {
      // Update existing gig in-place with realistic detailed description
      await ProjectModel.updateOne(
        { _id: existingGig._id },
        {
          $set: {
            description: gigData.description,
            budget: gigData.budget,
            skillsRequired: gigData.skillsRequired,
            isCurated: true,
            updatedAt: new Date(),
          },
        }
      );
      updatedGigsCount++;
      addLog(`✓ Refreshed realistic description for: "${gigData.title}"`);
    }
  }

  // 3. Seed Realistic Activity Events (only for newly created gigs) with dynamic freelancer names
  const dynamicFreelancerNames = await fetchDynamicFreelancers();
  let activityCount = 0;

  for (let i = 0; i < newlyCreatedGigs.length; i++) {
    const { gig, creator } = newlyCreatedGigs[i];
    const gigId = String(gig._id);
    const creatorId = String(creator._id);

    // Check if posted activity already logged
    const existingPostActivity = await Activity.findOne({ gigId, type: "posted" });
    if (!existingPostActivity) {
      await Activity.create({
        userId: creatorId,
        gigId,
        type: "posted",
        metadata: {
          clientName: creator.name || "Client",
          gigTitle: gig.title,
          skills: gig.skillsRequired || [],
          budget: gig.budget || "",
        },
        createdAt: gig.createdAt,
      });
      activityCount++;
      addLog(`⚡ Logged 'posted' activity for: "${gig.title}"`);
    }

    // For selected gigs, add 'applied' or 'hired' milestones with dynamic freelancer name
    if (i % 3 === 0) {
      const freelancerName = dynamicFreelancerNames.length > 0
        ? dynamicFreelancerNames[i % dynamicFreelancerNames.length]
        : `Freelancer ${i + 1}`;
      const appliedTime = new Date(new Date(gig.createdAt).getTime() + 1000 * 60 * 60 * 3);

      const existingApplied = await Activity.findOne({ gigId, type: "applied" });
      if (!existingApplied && appliedTime < new Date()) {
        await Activity.create({
          userId: creatorId,
          gigId,
          type: "applied",
          metadata: {
            clientName: creator.name || "Client",
            freelancerName,
            gigTitle: gig.title,
            skills: gig.skillsRequired || [],
            budget: gig.budget || "",
          },
          createdAt: appliedTime,
        });
        activityCount++;
        addLog(`⚡ Logged 'applied' pitch activity by ${freelancerName}`);
      }
    }

    if (i % 4 === 0) {
      const freelancerName = dynamicFreelancerNames.length > 0
        ? dynamicFreelancerNames[(i + 1) % dynamicFreelancerNames.length]
        : `Freelancer ${i + 2}`;
      const hiredTime = new Date(new Date(gig.createdAt).getTime() + 1000 * 60 * 60 * 8);

      const existingHired = await Activity.findOne({ gigId, type: "hired" });
      if (!existingHired && hiredTime < new Date()) {
        await Activity.create({
          userId: creatorId,
          gigId,
          type: "hired",
          metadata: {
            clientName: creator.name || "Client",
            freelancerName,
            gigTitle: gig.title,
            skills: gig.skillsRequired || [],
            budget: gig.budget || "",
          },
          createdAt: hiredTime,
        });
        activityCount++;
        addLog(`⚡ Logged 'hired' milestone: ${creator.name} hired ${freelancerName}`);
      }
    }
  }

  // 4. Invalidate Redis Caches so UI shows immediately
  try {
    const keys = await redis.keys("fetch-gigs:*");
    if (keys.length > 0) {
      await redis.del(...keys);
    }
    const trackedKeys = await redis.smembers("gig-cache-keys-for-deletion").catch(() => []);
    if (Array.isArray(trackedKeys) && trackedKeys.length > 0) {
      await redis.del(...trackedKeys);
    }
    await redis.del("gig-cache-keys-for-deletion");
    await redis.del("public-success-feed");
    await redis.del("real-time-activity-data");
    addLog("🧹 Redis caches purged completely ('fetch-gigs:*', 'gig-cache-keys-for-deletion', 'public-success-feed', 'real-time-activity-data')");
  } catch (e: any) {
    addLog(`⚠ Redis cache purge skipped: ${e.message}`);
  }

  addLog(`✨ Seeding complete! Profiles: ${clientsData.length} (${newUsersCount} new), Gigs: ${SEED_GIG_TEMPLATES.length} (${newGigsCount} new, ${updatedGigsCount} updated), Activities: ${activityCount}`);

  return {
    success: true,
    usersCount: clientsData.length,
    newUsersCount,
    gigsCount: SEED_GIG_TEMPLATES.length,
    newGigsCount,
    updatedGigsCount,
    activityCount,
    logs,
  };
}

export async function purgeCuratedPlatformData() {
  await ConnectoDatabase();
  const logs: string[] = [];
  const addLog = (msg: string) => {
    console.log(msg);
    logs.push(`[${new Date().toLocaleTimeString()}] ${msg}`);
  };

  addLog("🧹 Initializing curated platform data purge...");

  // 1. Find all curated gigs
  const curatedGigs = await ProjectModel.find({ isCurated: true }).lean();
  const curatedGigIds = curatedGigs.map((g) => g._id);
  const curatedGigIdStrings = curatedGigIds.map((id) => String(id));

  // 2. Delete curated gigs and associated activities
  const gigDeleteRes = await ProjectModel.deleteMany({ isCurated: true });
  const activityDeleteRes = await Activity.deleteMany({ gigId: { $in: curatedGigIdStrings } });

  addLog(`✓ Deleted ${gigDeleteRes.deletedCount || 0} curated gigs`);
  addLog(`✓ Deleted ${activityDeleteRes.deletedCount || 0} associated activity records`);

  // 3. Invalidate Redis caches
  try {
    const keys = await redis.keys("fetch-gigs:*");
    if (keys.length > 0) {
      await redis.del(...keys);
    }
    const trackedKeys = await redis.smembers("gig-cache-keys-for-deletion").catch(() => []);
    if (Array.isArray(trackedKeys) && trackedKeys.length > 0) {
      await redis.del(...trackedKeys);
    }
    await redis.del("gig-cache-keys-for-deletion");
    await redis.del("public-success-feed");
    await redis.del("real-time-activity-data");
    addLog("🧹 Redis caches purged completely");
  } catch (e: any) {
    addLog(`⚠ Redis cache purge skipped: ${e.message}`);
  }

  addLog(`✨ Purge complete! Curated gigs removed: ${gigDeleteRes.deletedCount || 0}`);

  return {
    success: true,
    deletedGigsCount: gigDeleteRes.deletedCount || 0,
    deletedActivitiesCount: activityDeleteRes.deletedCount || 0,
    logs,
  };
}

if (process.argv[1]?.includes("seed-platform-prod")) {
  seedPlatformDatabase()
    .then((res) => {
      console.log("Seeder finished successfully:", res);
      process.exit(0);
    })
    .catch((err) => {
      console.error("Seeder failed:", err);
      process.exit(1);
    });
}
