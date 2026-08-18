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
    console.warn("RandomUser API unavailable or timed out, using curated fallback profiles:", err);
    return FALLBACK_CLIENTS;
  }
}

// 18 Diverse Gigs across Web, Mobile, Graphic Design, Content, & SEO
export const SEED_GIG_TEMPLATES = [
  // 1. Web Dev
  {
    title: "Next.js 15 Landing Page for Specialty Coffee Brand",
    description: "Looking for a frontend developer to build a clean, responsive single-page storefront showcasing our seasonal beans and brewing gear. We already have the Figma design ready; need pixel-perfect implementation with fast loading times and smooth image galleries.",
    budget: "25,000",
    skillsRequired: ["Next.js", "React", "TailwindCSS"],
    createdAt: hoursAgo(4),
    status: "active",
  },
  // 2. Web Dev
  {
    title: "Custom WooCommerce Theme for Ceramic Studio",
    description: "Need an experienced developer to customize our WordPress store. We need custom product grid filtering by glaze color and clay type, plus a streamlined checkout flow for international buyers.",
    budget: "32,000",
    skillsRequired: ["WordPress", "WooCommerce", "PHP", "CSS"],
    createdAt: hoursAgo(10),
    status: "active",
  },
  // 3. Web Dev
  {
    title: "Interactive Solar Savings Calculator Widget",
    description: "We want an interactive calculator widget built in React/TypeScript. Users input their average monthly electric bill and zip code, and the widget calculates estimated 10-year solar savings with a dynamic comparison chart.",
    budget: "40,000",
    skillsRequired: ["React", "TypeScript", "Chart.js"],
    createdAt: daysAgo(1),
    status: "active",
  },
  // 4. Web Dev
  {
    title: "Real Estate Property Search & Filter Interface",
    description: "Looking for a developer to implement an intuitive search UI for residential property listings. Must include price sliders, neighborhood filters, bedroom counters, and instant results update without page reloads.",
    budget: "35,000",
    skillsRequired: ["Next.js", "TailwindCSS", "JavaScript"],
    createdAt: daysAgo(2),
    status: "active",
  },
  // 5. Web Dev
  {
    title: "Shopify Custom Liquid Drawer & Custom Quote Form",
    description: "We need custom modifications on our Shopify theme. Customers should be able to request custom dimensions for wood tables directly from product pages with a dynamic pricing estimator in the cart drawer.",
    budget: "28,000",
    skillsRequired: ["Shopify", "Liquid", "JavaScript"],
    createdAt: daysAgo(3),
    status: "active",
  },
  // 6. Web Dev
  {
    title: "Service Contractor Job Estimation Web Portal",
    description: "Need a web application for our field technicians to calculate material costs and labor estimates on iPads during customer visits. Backend with PostgreSQL and clean responsive interface.",
    budget: "48,000",
    skillsRequired: ["React", "Node.js", "PostgreSQL"],
    createdAt: daysAgo(4),
    status: "active",
  },

  // 7. Mobile App
  {
    title: "React Native Yoga Routine & Class Timer App",
    description: "We are building an iOS and Android app for our studio members. The app will feature guided timer routines, routine audio playback, and weekly practice streaks. Design screens in Figma are finished.",
    budget: "55,000",
    skillsRequired: ["React Native", "Expo", "Mobile App"],
    createdAt: hoursAgo(6),
    status: "active",
  },
  // 8. Mobile App
  {
    title: "Flutter Inventory Barcode Scanner App",
    description: "Looking for a Flutter developer to build a lightweight internal app that scans QR/barcodes on parts boxes and syncs count data with our Firebase database. Must support offline caching.",
    budget: "42,000",
    skillsRequired: ["Flutter", "Dart", "Firebase"],
    createdAt: daysAgo(2),
    status: "active",
  },
  // 9. Mobile App
  {
    title: "Mobile Push Notification & Order Alert Bug Fix",
    description: "Our bakery order notification app built with React Native has a push notification delivery delay on newer Android versions. Need an experienced mobile dev to debug FCM setup and background handlers.",
    budget: "18,000",
    skillsRequired: ["React Native", "Firebase", "Android"],
    createdAt: daysAgo(5),
    status: "active",
  },
  // 10. Mobile App
  {
    title: "Audio Snippet Preview Player Component in React Native",
    description: "Need a reusable waveform audio player component for our mobile app. Must support smooth playback scrubbing, buffering indicators, and background audio playback controls.",
    budget: "22,000",
    skillsRequired: ["React Native", "Audio", "TypeScript"],
    createdAt: daysAgo(6),
    status: "active",
  },

  // 11. Graphic Design & UI/UX
  {
    title: "Figma UI/UX Redesign for Historic Architecture Firm",
    description: "We are looking for a UI/UX designer to craft a high-end, minimal web portfolio for our restoration projects. Need wireframes, high-fidelity prototypes, and component design tokens in Figma.",
    budget: "30,000",
    skillsRequired: ["Figma", "UI/UX Design", "Design Systems"],
    createdAt: hoursAgo(14),
    status: "active",
  },
  // 12. Graphic Design
  {
    title: "Brand Identity, Logo & Packaging Label Design",
    description: "Need a talented graphic designer to design packaging labels for our new line of organic sourdough loaves and branded coffee cups. Vector assets in Adobe Illustrator required.",
    budget: "20,000",
    skillsRequired: ["Logo Design", "Packaging", "Illustrator"],
    createdAt: daysAgo(3),
    status: "active",
  },
  // 13. Graphic Design
  {
    title: "Social Media Banner & Promo Asset Kit in Figma",
    description: "Seeking a designer to create a cohesive social media template system for our upcoming medical conference series. Includes LinkedIn banners, speaker announcement cards, and agenda infographics.",
    budget: "14,000",
    skillsRequired: ["Figma", "Graphic Design", "Social Media"],
    createdAt: daysAgo(4),
    status: "active",
  },
  // 14. Graphic Design
  {
    title: "Documentary Photo Book Layout & Typography",
    description: "Looking for an InDesign specialist with strong editorial typography sensibility to lay out a 120-page hardcover photography book. Must understand print margins, color profiles, and binding bleeds.",
    budget: "24,000",
    skillsRequired: ["InDesign", "Typography", "Print Design"],
    createdAt: daysAgo(7),
    status: "active",
  },

  // 15. SEO & Content
  {
    title: "Technical SEO Audit & Core Web Vitals Optimization",
    description: "Need an SEO specialist to run a full technical crawl of our website, identify indexing issues, fix schema markup, and improve LCP / CLS metrics for better search engine rankings.",
    budget: "16,000",
    skillsRequired: ["SEO", "Technical SEO", "Performance"],
    createdAt: hoursAgo(8),
    status: "active",
  },
  // 16. SEO & Content
  {
    title: "Podcast Audio Snippet Video Editing for YouTube Shorts",
    description: "We record weekly hour-long audio podcasts. Looking for a video editor to take top 3-minute clips, add animated captions, subtle B-roll, and export in 9:16 vertical format for YouTube Shorts and Reels.",
    budget: "20,000",
    skillsRequired: ["Video Editing", "Premiere Pro", "CapCut"],
    createdAt: daysAgo(1),
    status: "active",
  },
  // 17. Content & Writing
  {
    title: "Seasonal Literary Subscription Newsletter Copywriting",
    description: "Looking for an engaging writer to draft weekly book review newsletters, curate author spotlights, and write compelling emails for our monthly reading subscription boxes.",
    budget: "15,000",
    skillsRequired: ["Copywriting", "Content Writing", "Newsletter"],
    createdAt: daysAgo(5),
    status: "active",
  },
  // 18. Video & Motion
  {
    title: "Explainer Video Motion Graphics & Repair Guide",
    description: "Need a motion designer to create a clean 60-second 2D animated guide demonstrating our outdoor gear mail-in repair process for new customers. Voiceover track will be provided.",
    budget: "26,000",
    skillsRequired: ["Motion Graphics", "After Effects", "Animation"],
    createdAt: daysAgo(6),
    status: "active",
  },
];

// Seed function that safely runs on database
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
  const createdGigs: { gig: any; creator: any }[] = [];
  let newGigsCount = 0;
  const clientList = Array.from(userMap.values());

  for (let i = 0; i < SEED_GIG_TEMPLATES.length; i++) {
    const gigData = SEED_GIG_TEMPLATES[i];
    const creator = clientList[i % clientList.length];
    if (!creator) continue;

    const expiresAt = new Date(new Date(gigData.createdAt).getTime() + 30 * 24 * 60 * 60 * 1000);

    let existingGig: any = await ProjectModel.findOne({
      title: gigData.title,
    });

    if (!existingGig) {
      existingGig = await ProjectModel.create({
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
        reportCount: 0,
        createdAt: gigData.createdAt,
        updatedAt: gigData.createdAt,
      });
      newGigsCount++;
      addLog(`✓ Created active gig: "${gigData.title}" (₹${gigData.budget}) by ${creator.name}`);
    } else {
      // Ensure existing gig has valid active status and expiresAt in future
      await ProjectModel.updateOne(
        { _id: existingGig._id },
        {
          $set: {
            status: "active",
            expiresAt: expiresAt,
            displayContactLinks: false,
            AcceptedFreelancerEmail: "",
          }
        }
      );
      addLog(`ℹ Verified active status & expiry for: "${gigData.title}"`);
    }
    createdGigs.push({ gig: existingGig, creator });
  }

  // 3. Seed Realistic Activity Events
  const sampleFreelancerNames = [
    "Priya Menon",
    "Alex Rivera",
    "Liam Smith",
    "Neha Gupta",
    "Daniel Clark",
    "Zain Khan",
    "Pooja Hegde",
    "Ethan Wright",
    "Tanvi Joshi",
    "Marcus Vance",
  ];

  let activityCount = 0;

  for (let i = 0; i < createdGigs.length; i++) {
    const { gig, creator } = createdGigs[i];
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

    // For selected gigs, add 'applied' or 'hired' milestones
    if (i % 3 === 0) {
      const freelancerName = sampleFreelancerNames[i % sampleFreelancerNames.length];
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
      const freelancerName = sampleFreelancerNames[(i + 1) % sampleFreelancerNames.length];
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
    await redis.del("public-success-feed");
    await redis.del("real-time-activity-data");
    addLog("🧹 Redis caches invalidated successfully ('fetch-gigs:*', 'public-success-feed', 'real-time-activity-data')");
  } catch (e: any) {
    addLog(`⚠ Redis cache purge skipped: ${e.message}`);
  }

  addLog(`✨ Seeding complete! Profiles: ${clientsData.length} (${newUsersCount} new), Gigs: ${createdGigs.length} (${newGigsCount} new), Activities: ${activityCount}`);

  return {
    success: true,
    usersCount: clientsData.length,
    newUsersCount,
    gigsCount: createdGigs.length,
    newGigsCount,
    activityCount,
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
