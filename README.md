# PostMyGig

A modern, privacy-first freelance marketplace and real-time collaboration platform designed for independent developers, designers, and creators to discover projects, pitch proposals, and collaborate securely.

---

## 🌟 Overview

**PostMyGig** simplifies the freelance workflow by eliminating clutter and prioritizing privacy. Freelancers can showcase their portfolios, discover curated gigs, and send targeted proposals ("pings"). Clients can post gigs, review candidate pitches, and seamlessly transition into a dedicated real-time collaboration space (**Project Huddle**) with live chat and file sharing.

The platform is architected as a fullstack **Next.js 15 App Router** application paired with a dedicated **Socket.io real-time microservice**.

---

## 🚀 Key Features

### 1. 🔐 Authentication, Security & Privacy
- **Multi-Provider Auth**: Built on NextAuth.js supporting **Google OAuth**, **GitHub OAuth**, and **Email/Password credentials** (bcrypt-hashed).
- **Email Verification**: 6-digit OTP verification code sent via Nodemailer on email signup.
- **Password Recovery**: Secure password reset flow with expiring verification tokens.
- **Onboarding Flow**: Role selection (`freelancer` vs `client`), bio, skills tags, location, and social links.
- **Granular Privacy Controls**: Toggles to show/hide email, contact links (WhatsApp, X), and public activity feed.
- **DPDP Act Compliance**: Complete one-click account deletion (`/api/user/delete-account`) that purges all user data and triggers an automated confirmation email.

### 2. 💼 Gig & Project Lifecycle Management
- **Smart Gig Management**: Post, edit, filter, and manage freelance gigs with budget, required skills, and contact preferences.
- **45-Day Active Cycle**: Automatic 45-day expiration via automated background cron jobs with one-click gig relisting/renewal (`/api/gigs/renew-gig`).
- **Project Status Transitions**: Structured lifecycle from `active` ➔ `assigned` ➔ `completed` / `expired` / `rejected`.
- **Project Completion**: Clients can mark completed gigs, closing the project and logging verified milestone activity.

### 3. 🎯 Proposal & Application Workflow ("Pings")
- **Targeted Pings**: Freelancers pitch clients with structured proposals, custom notes, and portfolio links.
- **Client Application Management**: Review applicant profiles, compare skill match percentages, and manage candidate status (`/applications/view-applications`).
- **1-Click Review Actions**: **Accept**, **Reject**, or **Revoke** applications with automated transactional email alerts sent to freelancers.
- **Proposals Tracker**: Freelancer dashboard (`/user/proposals`) to monitor submitted proposals, review statuses, and jump directly into active chats.

### 4. 💬 Real-Time Collaboration ("Project Huddle")
- **Dedicated Socket Microservice**: Powered by Express, Socket.io, and Helmet with JWT handshake authentication.
- **Project-Based Chat Rooms**: Automatic private room creation upon application acceptance.
- **Media & File Attachments**: Powered by **UploadThing**, supporting images (PNG, JPG, WEBP with interactive zoom modal) and PDF documents with inline preview and download.
- **Online Presence & Read Receipts**: Live user online/offline indicators and message status indicators.
- **Redis Rate Limiting**: Token-bucket / sliding-window rate limiting (10 messages/minute per user) backed by Upstash Redis.
- **Automated Message TTL**: MongoDB automatic 20-day TTL expiration index on chat history.

### 5. 🎨 Freelancer Portfolios & Skill Matcher
- **Interactive Portfolio Showcase**: Add featured projects with title, description, technology tags, live demo links, and GitHub repository links.
- **Skill Matcher Engine**: Automatically calculates match percentage and highlights overlapping skills between freelancer profiles and gig requirements.
- **Public & Private Profiles**: Shareable public profile pages (`/user/profile/[id]`) with verified badges and activity feeds.

### 6. ⚡ Subscriptions & Quota Engine
- **Free vs. Pro Tiers**: Feature limits managed via an internal subscription engine (`lib/subscription`):
  - **Clients**: Free (15 gigs/month) vs. Pro (50 gigs/month + featured listings).
  - **Freelancers**: Free (30 pings/month) vs. Pro (100 pings/month + priority pitch).
- **Upgrade Workflow**: Transparent pricing page (`/pricing`) and role-tailored tier management.

### 7. 🛡️ Admin Dashboard & Moderation
- **User Verification Queue**: Freelancers can request verification; admins review portfolios and grant verified badges (`isVerified`).
- **Gig Moderation & Flagging**: Review reported gigs (`ReportSchema`), take down violating listings, and ban offending accounts.
- **Feedback Management**: In-app feedback dialog with admin tools to resolve queries and reply directly via email.

### 8. ⏰ Scheduled Cron Jobs & Background Tasks
- **Automated Web Crons (via [cron-job.org](https://cron-job.org/))**:
  - Endpoints secured with HTTP `Authorization: Bearer <CRON_SECRET>` header verification.
  - **`expire-projects`** (`/api/cron/expire-projects`): Daily automated check marking projects older than 45 days as expired and notifying gig owners to renew.
  - **`cleanup-chat-attachments`** (`/api/cron/cleanup-chat-attachments`): Periodic cleanup of orphaned chat uploads.
  - **`send-emails-weekly`** (`/api/cron/send-emails-weekly`): Automated weekly digests highlighting new and trending gigs.

### 9. 📧 Transactional Email Suite (Nodemailer)
8+ responsive, branded HTML email templates:
- Email Signup OTP Verification
- New Ping / Proposal Notification
- Application Acceptance & Rejection Notices
- Project Huddle Chat Room Invitation
- Password Reset Link (with 15-min expiry)
- 45-Day Gig Expiration & Renewal Reminder
- Weekly Curated Gigs Digest
- Account Deletion Confirmation

---

## 🛠️ Tech Stack

### Frontend & Web Application (`postmygig/`)
- **Framework**: [Next.js 15](https://nextjs.org/) (App Router, Turbopack, React 19)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/), Radix UI primitives, [next-themes](https://github.com/pacocoursey/next-themes) (Dark/Light mode)
- **Animations & Icons**: [Framer Motion](https://www.framer.com/motion/), [Lucide React](https://lucide.dev/)
- **UI Feedback**: [Sonner](https://sonner.emilkowal.ski/) (Toast notifications)
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/)
- **Authentication**: [NextAuth.js v4](https://next-auth.js.org/) (Google, GitHub, Credentials)
- **SEO & Social**: [next-sitemap](https://github.com/iamvishnusankar/next-sitemap), Dynamic OpenGraph images via `@/app/api/og`

### Real-Time Chat Server (`postmygig-chat-server/`)
- **Runtime**: Node.js & Express 5 (ES Modules)
- **WebSockets**: [Socket.io](https://socket.io/) (CORS & JWT authentication)
- **Security**: [Helmet](https://helmetjs.github.io/), JSON Web Tokens (JWT)
- **Rate Limiting**: [Upstash Redis](https://upstash.com/)

### Database, Cloud & Storage
- **Database**: MongoDB Atlas / Local MongoDB with [Mongoose](https://mongoosejs.com/)
- **Cache & Rate Limiting**: [Upstash Redis](https://upstash.com/redis) & `@upstash/ratelimit`
- **Scheduled Cron Service**: [cron-job.org](https://cron-job.org/) (Secured with `CRON_SECRET` Bearer token authentication)
- **File Storage**: [UploadThing](https://uploadthing.com/) (Images & PDFs)
- **Email Service**: [Nodemailer](https://nodemailer.com/) (Gmail SMTP / Custom SMTP)

---

## 📂 Repository Structure

```
freelancer-board/
├── postmygig/                     # Next.js 15 Fullstack Application
│   ├── app/                       # App Router routes, API endpoints, and pages
│   │   ├── (pages)/               # Gig listing, creation, pricing, chat & applications
│   │   ├── api/                   # REST API routes (auth, gigs, user, admin, cron, socket)
│   │   ├── auth/                  # Login, register, verify-code, forgot-password
│   │   ├── dashboard/             # Role-aware user dashboard
│   │   ├── onboarding/            # Profile onboarding wizard
│   │   ├── projects/              # Detailed project views
│   │   └── user/                  # Admin, profile, proposals, settings, feedback
│   ├── components/                # Modular React & UI components
│   │   ├── chat/                  # Chat components, file preview, image modal
│   │   ├── dashboard/             # Metrics, charts, listings
│   │   ├── gigs/                  # Gig cards, forms, filter controls
│   │   ├── ui/                    # Reusable Radix / Tailwind UI primitives
│   │   └── ChatSystem.tsx         # Main real-time chat interface
│   ├── lib/                       # Helpers, DB connection, auth, email, socket client
│   │   ├── (socket)/              # Socket.io client connector & event listeners
│   │   ├── email/                 # Nodemailer configuration & HTML templates
│   │   ├── subscription/          # Plans, quotas, limits engine
│   │   └── options.ts             # NextAuth configuration
│   ├── models/                    # Mongoose database models
│   │   ├── UserModel.ts           # Users, roles, portfolios, privacy settings
│   │   ├── ProjectModel.ts        # Gigs, statuses, budgets, contacts
│   │   ├── ChatModel.ts           # Messages, attachments, 20-day TTL
│   │   ├── SubscriptionModel.ts   # Tier tracking & limits
│   │   └── ActivityModel.ts       # Platform activity timeline
│   └── types.d.ts                 # Global TypeScript definitions
│
└── postmygig-chat-server/         # Real-Time WebSocket Microservice
    ├── controllers/               # Socket event & room handlers
    ├── middleware/                # JWT auth verification
    ├── model/                     # Chat schema for socket server
    ├── routes/                    # Chat REST routes
    ├── util/                      # Redis client & DB connection
    └── index.js                   # Server entrypoint
```

---

## ⚙️ Installation & Setup

### Prerequisites
- **Node.js**: v18.17+ or v20+
- **MongoDB**: Local instance or [MongoDB Atlas](https://www.mongodb.com/atlas) cluster
- **Redis**: [Upstash Redis](https://upstash.com/) account (or local Redis)
- **UploadThing**: Account for chat file uploads ([UploadThing](https://uploadthing.com/))
- **Email**: Gmail with App Password or custom SMTP server

---

### Step 1: Clone the Repository
```bash
git clone https://github.com/shubGupta10/PostMyGig.git
cd freelancer-board
```

---

### Step 2: Configure Environment Variables

#### 1. Next.js App (`postmygig/.env`):
Create `postmygig/.env` (or copy `.env.example`) with the following variables:
```env
# Environment & Base URLs
NODE_ENV=development
NEXT_PUBLIC_LIVE_URL=http://localhost:3000
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000

# MongoDB Connections
MONGO_LOCAL_URI=mongodb://localhost:27017/PostMyGig
MONGO_PROD_URI=your_mongodb_connection_string

# NextAuth.js Authentication
NEXTAUTH_SECRET=your_nextauth_secret_key
NEXTAUTH_URL=http://localhost:3000

# OAuth Providers
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

# Upstash Redis (Cache & Chat Rate Limiting)
UPSTASH_REDIS_REST_URL=your_upstash_redis_url
UPSTASH_REDIS_REST_TOKEN=your_upstash_redis_token

# Email Configuration (Nodemailer / Gmail SMTP)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=465
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password

# Resend Email Fallback
RESENT_API_KEY=your_resend_api_key

# Cron Job Authentication (cron-job.org)
CRON_SECRET=your_cron_secret_token

# UploadThing (Chat File & PDF Attachments)
UPLOADTHING_TOKEN=your_uploadthing_token
```

#### 2. Chat Server (`postmygig-chat-server/.env`):
Create `postmygig-chat-server/.env` with the following variables:
```env
PORT=5000
FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:5000
JWT_SECRET=your_nextauth_secret_key
MONGODB_URI=your_mongodb_connection_string
UPSTASH_REDIS_REST_URL=your_upstash_redis_url
UPSTASH_REDIS_REST_TOKEN=your_upstash_redis_token
```

---

### Step 3: Install Dependencies & Run

#### 1. Start the Chat Server:
```bash
cd postmygig-chat-server
npm install
npm run dev
```
*Chat server will be running on `http://localhost:5000`.*

#### 2. Start the Next.js Web App:
```bash
cd ../postmygig
npm install
npm run dev
```
*Web app will be running on `http://localhost:3000`.*

---

## 🚦 Available Scripts

### In `postmygig/`:
| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts Next.js dev server with Turbopack |
| `npm run build` | Builds the production bundle & generates sitemap |
| `npm run start` | Starts the production server |
| `npm run lint` | Runs ESLint checks |

### In `postmygig-chat-server/`:
| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts Socket.io server with Nodemon auto-reload |

---

## 📄 License & Author

Distributed under the **MIT License**.

- **Author**: Shubham Kumar Gupta
- **X (Twitter)**: [@i_m_shubham45](https://x.com/i_m_shubham45)
- **GitHub**: [shubGupta10](https://github.com/shubGupta10)
- **Repository**: [https://github.com/shubGupta10/PostMyGig](https://github.com/shubGupta10/PostMyGig)