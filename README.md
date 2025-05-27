# PostMyGig

PostMyGig is a free, privacy-first platform designed for freelancers to share and discover projects. Freelancers can list their skills, post gigs, and connect with clients through secure pings (in-app or email, with WhatsApp integration planned). Built by Shubham Kumar Gupta in Lucknow, India, PostMyGig focuses on India’s 15M+ freelancers, ensuring compliance with the Digital Personal Data Protection Act (DPDP). Currently in beta, the platform is set to launch on X and Product Hunt in June 2025, targeting 100-200 early users.

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [Roles and Permissions](#roles-and-permissions)
- [Admin Dashboard](#admin-dashboard)
- [Email Notifications](#email-notifications)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## Features
- **Gig Management**: Freelancers can create, read, update, and delete (CRUD) gigs, such as web development or design projects.
- **Secure Pings**: Connect with clients through in-app messages or email, with contacts (email/WhatsApp) kept private until approved.
- **Role-Based Access**: Tailored permissions for freelancers and admins.
- **Admin Dashboard**: Tools to moderate gigs, manage users, and view analytics.
- **Filters**: Browse gigs by skills (e.g., MERN stack) or location (e.g., India).
- **Privacy-First**: DPDP-compliant with encrypted data and secure authentication.
- **Free Tier**: No fees for listing or connecting. Premium tiers planned: Pro (₹75/month), Premium (₹375/month).

## Tech Stack
- **Frontend**: Next.js, Tailwind CSS, Shadcn UI
- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **Cache & Rate Limiting**: Redis
- **Authentication**: NextAuth.js (Google, X OAuth)
- **Email Notifications**: Nodemailer (Gmail SMTP, free for beta)
- **Hosting**: Vercel

## Installation
1. **Clone the Repository**:
   - Download or clone from the GitHub repository: `https://github.com/shubham-145/postmygig`.
2. **Install Dependencies**:
   - Navigate to the project folder and run `npm install`.
3. **Set Up Environment Variables**:
   - Create a `.env` file in the root directory with the following variables:
     - MongoDB connection URI
     - NextAuth secret and OAuth credentials (Google, X)
     - Nodemailer Gmail address and app password
     - Redis connection URL
     - Encryption key for data security
4. **Run MongoDB and Redis**:
   - Use MongoDB Atlas or a local MongoDB instance.
   - Run Redis locally or via a cloud provider.
5. **Start the Development Server**:
   - Run `npm run dev` and access at `http://localhost:3000`.

## Configuration
- **MongoDB**: Set up a `postmygig` database with schemas for gigs, users, pings, and email logs.
- **Redis**: Configure for rate limiting (10 pings/emails per user/day), session caching, and email quotas.
- **NextAuth**: Enable Google and X OAuth for secure signups.
- **Nodemailer**: Use Gmail SMTP for emails:
  - Create a Gmail account or use an existing one.
  - Enable 2FA and generate an App Password in Gmail settings.
  - Add email and password to `.env`.
- **Vercel**: Deploy the app for production, ensuring HTTPS and CORS settings.

## Usage
1. **Sign Up**: Register using Google or X OAuth.
2. **Post a Gig** (Freelancers): Navigate to the post section, enter gig details (title, skills, description), and manage gigs in the dashboard.
3. **Ping a Gig**: Send a 50-word message to a gig owner via the platform or email.
4. **Connect**: Approve pings in the dashboard to share contact details securely.
5. **Admin Tasks**: Access the admin panel to moderate gigs, manage users, or view analytics.

## Roles and Permissions
- **Freelancer**:
  - Create, update, and delete own gigs.
  - Send pings to connect with other users.
- **Admin**:
  - Moderate gigs (approve/reject).
  - Manage user accounts (e.g., ban users).
  - Access analytics on platform activity.

## Admin Dashboard
- **Features**:
  - Review and moderate gigs (e.g., approve pending listings).
  - Manage user accounts, including banning users for policy violations.
  - View analytics, such as active gigs, pings, and email metrics.
- **Access**: Restricted to admin users, secured by authentication.
- **Interface**: Built with clean, responsive design using Tailwind CSS and Shadcn UI components.

## Email Notifications
PostMyGig uses **Nodemailer** with Gmail SMTP (free, ~500 emails/day) to send transactional emails, including welcome messages and ping notifications.
- **Setup**:
  - Install Nodemailer via npm.
  - Configure Gmail SMTP with a Gmail address and App Password in `.env`.
- **Email Types**:
  - **Welcome Email**: Sent on signup, inviting users to explore the beta and provide feedback.
  - **Ping Notification**: Notifies gig owners when someone expresses interest, including the sender’s message, email, and a link to view details.
- **Privacy**:
  - Emails are sent only with user consent (via signup).
  - Messages are sanitized to prevent security risks.
  - Data is encrypted in MongoDB for storage.
- **Limits**: Gmail’s SMTP allows ~500 emails/day, suitable for the beta phase (~100-200 users, 1-3 pings/day).
- **Analytics**: Umami Cloud and Vercel Analytics.

## Contributing
- Fork the repository on GitHub.
- Create a feature branch for your changes.
- Submit a pull request with a clear description.
- Follow the project’s Code of Conduct.

## License
MIT License © 2025 Shubham Kumar Gupta

## Contact
- **Author**: Shubham Kumar Gupta
- **X**: [@i_m_shubham45](https://x.com/i_m_shubham45) (#buildinpublic)
- **GitHub Issues**: [https://github.com/shubGupta10/PostMyGig](https://github.com/shubGupta10/PostMyGig)