import { fetchUserProfile } from "./services/profileService"
import { ProfileActions } from "@/components/profile/ProfileActions"
import {
  User, Mail, MapPin, Calendar, Shield, AlertTriangle, ExternalLink,
  Star, Activity, LinkIcon, UserCheck, Clock, Settings,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { formatDate } from "@/lib/helpers"
import { Metadata } from "next"
import { fetchPublicUserProfile } from "./services/profileService"
import { buildSocialImageUrl } from "@/lib/social-preview"

export async function generateMetadata({ params }: { params: Promise<{ userId: string }> }): Promise<Metadata> {
  const { userId } = await params
  const user = await fetchPublicUserProfile(userId)

  if (!user) {
    return {
      title: 'User Not Found | PostMyGig',
    }
  }

  const summary = user.skills && user.skills.length > 0 ? `Skills: ${user.skills.slice(0, 3).join(', ')}` : 'Freelancer on PostMyGig';
  const ogImageUrl = buildSocialImageUrl({
    title: user.name,
    description: summary,
    badge: 'Freelancer',
    type: 'gig',
  });
  const canonicalUrl = new URL(`/user/profile/${userId}`, 'https://www.postmygig.vercel.app').toString();

  return {
    title: `${user.name} | PostMyGig`,
    description: user.bio ? user.bio.substring(0, 160) : `Check out ${user.name}'s profile on PostMyGig.`,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${user.name} | PostMyGig`,
      description: summary,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: user.name,
        },
      ],
      type: 'website',
      url: canonicalUrl,
    },
    twitter: {
      card: "summary_large_image",
      title: `${user.name} | PostMyGig`,
      description: summary,
      images: [ogImageUrl],
      creator: "@postmygig",
    },
  }
}

function getRoleConfig(role: string) {
  switch (role) {
    case "admin": return { color: "bg-destructive text-destructive-foreground border-destructive", icon: Shield }
    case "freelancer": return { color: "bg-primary text-primary-foreground border-primary", icon: User }
    case "client": return { color: "bg-accent text-accent-foreground border-accent", icon: UserCheck }
    default: return { color: "bg-muted text-muted-foreground border-border", icon: User }
  }
}

export default async function ProfilePage() {
  const userData = await fetchUserProfile()
  const roleConfig = getRoleConfig(userData.role || "user")
  const RoleIcon = roleConfig.icon

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">

        {/* Header Card */}
        <div className="bg-card rounded-2xl border-2 border-border shadow-sm overflow-hidden mb-8">
          <div className="h-28 sm:h-36 bg-muted relative">
            <div className="absolute top-4 right-4">
              <Badge variant="outline" className={`${roleConfig.color} font-semibold`}>
                <RoleIcon className="w-3 h-3 mr-1" />
                {userData.role || "User"}
              </Badge>
            </div>
          </div>
          <div className="relative z-10 px-4 sm:px-8 pb-6 sm:pb-8">
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 sm:gap-6 -mt-14 sm:-mt-16">
              {/* Avatar */}
              <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl bg-card border-2 border-border shadow-sm overflow-hidden shrink-0">
                {userData.profilePhoto ? (
                  <img src={userData.profilePhoto} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-muted flex items-center justify-center">
                    <User className="h-12 w-12 text-muted-foreground" />
                  </div>
                )}
              </div>
              {/* Info */}
              <div className="flex-1 text-center sm:text-left pb-1">
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-1">{userData.name}</h1>
                <div className="flex flex-col sm:flex-row items-center sm:justify-start gap-3 mt-2">
                  <div className="flex items-center gap-2 text-muted-foreground text-sm">
                    <Mail className="w-4 h-4" />
                    <span>{userData.email}</span>
                  </div>
                  {userData.location && (
                    <div className="flex items-center gap-2 text-muted-foreground text-sm">
                      <MapPin className="w-4 h-4" />
                      <span>{userData.location}</span>
                    </div>
                  )}
                </div>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-3">
                  <Badge variant="outline" className="bg-muted text-foreground border-border font-medium text-xs">
                    <Calendar className="w-3 h-3 mr-1" />
                    Joined {formatDate(userData.createdAt)}
                  </Badge>
                  {userData.isBanned && (
                    <Badge variant="outline" className="bg-destructive text-destructive-foreground border-destructive font-medium text-xs">
                      <AlertTriangle className="w-3 h-3 mr-1" />
                      Banned
                    </Badge>
                  )}
                  <Badge variant="outline" className="bg-muted text-foreground border-border font-medium text-xs">
                    <Activity className="w-3 h-3 mr-1" />
                    {userData.provider || "Unknown"} Account
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">

          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">

            {/* Bio */}
            <div className="bg-card rounded-2xl border-2 border-border shadow-sm overflow-hidden">
              <div className="p-6 sm:p-8">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4">About Me</p>
                <p className="text-foreground leading-relaxed">
                  {userData.bio || "No bio available. Add a bio to tell others about yourself."}
                </p>
              </div>
            </div>

            {/* Skills */}
            <div className="bg-card rounded-2xl border-2 border-border shadow-sm overflow-hidden">
              <div className="p-6 sm:p-8">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4">Skills & Expertise</p>
                {userData.skills && userData.skills.length > 0 ? (
                  <div className="flex flex-wrap gap-2.5">
                    {userData.skills.map((skill, index) => (
                      <span key={index} className="bg-secondary text-secondary-foreground rounded-xl px-4 py-2 font-semibold text-sm">
                        {skill}
                      </span>
                    ))}
                  </div>
                ) : (
                  <div className="bg-muted rounded-xl p-8 text-center border border-border">
                    <Star className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                    <p className="text-foreground font-medium">No skills listed yet</p>
                  </div>
                )}
              </div>
            </div>

            {/* Contact Links */}
            <div className="bg-card rounded-2xl border-2 border-border shadow-sm overflow-hidden">
              <div className="p-6 sm:p-8">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4">Contact Links</p>
                {userData.contactLinks && userData.contactLinks.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {userData.contactLinks.map((link, index) => (
                      <a key={index} href={link.url} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-3 bg-muted border border-border rounded-xl p-4 hover:border-primary transition-colors">
                        <div className="w-9 h-9 bg-background rounded-lg flex items-center justify-center border border-border shrink-0">
                          <ExternalLink className="w-4 h-4 text-foreground" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-foreground font-semibold text-sm truncate">{link.label}</p>
                          <p className="text-muted-foreground text-xs truncate">{link.url}</p>
                        </div>
                      </a>
                    ))}
                  </div>
                ) : (
                  <div className="bg-muted rounded-xl p-8 text-center border border-border">
                    <LinkIcon className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                    <p className="text-foreground font-medium">No contact links available</p>
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* Right Column */}
          <div className="space-y-6">

            {/* Account Details */}
            <div className="bg-card rounded-2xl border-2 border-border shadow-sm overflow-hidden">
              <div className="p-6">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4">Account Details</p>
                <div className="space-y-0 divide-y divide-border">
                  <div className="py-3">
                    <p className="text-xs text-muted-foreground mb-1">Provider</p>
                    <p className="text-foreground font-semibold text-sm capitalize">{userData.provider || "Not available"}</p>
                  </div>
                  <div className="py-3">
                    <p className="text-xs text-muted-foreground mb-1">Member Since</p>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-foreground" />
                      <p className="text-foreground font-semibold text-sm">{formatDate(userData.createdAt)}</p>
                    </div>
                  </div>
                  <div className="py-3">
                    <p className="text-xs text-muted-foreground mb-1">Last Updated</p>
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-foreground" />
                      <p className="text-foreground font-semibold text-sm">{formatDate(userData.updatedAt)}</p>
                    </div>
                  </div>
                  <div className="py-3">
                    <p className="text-xs text-muted-foreground mb-1">Status</p>
                    <p className="text-foreground font-semibold text-sm">{userData.isBanned ? "Banned" : "Active"}</p>
                  </div>
                  <div className="py-3">
                    <p className="text-xs text-muted-foreground mb-1">Reports</p>
                    <p className="text-foreground font-semibold text-sm">{userData.reportCount ?? 0}</p>
                  </div>
                  <div className="pt-3">
                    <p className="text-xs text-muted-foreground mb-1">User ID</p>
                    <p className="text-foreground font-mono text-xs bg-muted rounded-lg px-3 py-2 border border-border truncate">
                      {userData._id}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive Client Section */}
            <ProfileActions userData={userData} />

          </div>
        </div>
      </div>
    </div>
  )
}
