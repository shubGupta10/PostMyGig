export interface Project {
  _id: string;
  title: string;
  description: string;
  createdBy: string;
  skillsRequired?: string[];
  contact?: {
    email?: string;
    whatsapp?: string;
    x?: string;
  };
  budget: string;
  displayContactLinks?: boolean;
  AcceptedFreelancerEmail?: string;
  status: string;
  createdAt?: string;
  expiresAt?: string;
  reportCount?: number;
  isFlagged?: boolean;
}

export interface RateLimitInfo {
  isLimited: boolean;
  retryAfter: number | null;
  message: string;
  timestamp: number;
}

export interface AppliedPingHistory {
  _id: string;
  projectId: string;
  userEmail: string;
  posterEmail: string;
  message?: string;
  status: "pending" | "accepted" | "rejected";
  createdAt: string;
  updatedAt?: string;
  projectDetails?: {
    title?: string;
    category?: string;
    budget?: string;
  };
}

import type { UserUsageStats } from "@/lib/subscription/types";
import { PaginationInfo } from "../(pages)/(gig)/my-jobs/types";

export interface ClientDashboardData {
  role: "client";
  totalProjects: number;
  activeProjects: number;
  expiredProjects: number;
  totalApplicationsReceived: number;
  projects: Project[];
  usageStats?: UserUsageStats;
}

export interface FreelancerDashboardData {
  role: "freelancer";
  totalPingsSent: number;
  acceptedPingsCount: number;
  pendingPingsCount: number;
  rejectedPingsCount: number;
  appliedHistory: AppliedPingHistory[];
  pagination?: PaginationInfo;
  usageStats?: UserUsageStats;
}

export type DashboardData = ClientDashboardData | FreelancerDashboardData;

export interface FetchDashboardResult {
  data: DashboardData | null;
  rateLimitInfo: RateLimitInfo;
  error: string | null;
}
