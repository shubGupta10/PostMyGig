import { ProfileActions } from "@/modules/users/components/profile/ProfileActions"
import { GigCard } from "@/modules/gigs/components/GigCard"
import {
  User, Mail, MapPin, Calendar, Shield, AlertTriangle, ExternalLink,
  Star, Activity, LinkIcon, UserCheck, Clock, Settings,
  ShieldCheck,
  FolderGit2,
  Code2,
  MessageSquare,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { formatDate } from "@/lib/helpers"
import { Metadata } from "next"
import { fetchPublicUserProfile } from "./services/profileService"
import { buildSocialImageUrl, getBaseUrl } from "@/lib/social-preview"

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
    type: 'profile',
  });
  const canonicalUrl = `${getBaseUrl()}/user/profile/${userId}`;

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

export default async function ProfilePage({ params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params
  const userData = await fetchPublicUserProfile(userId)

  if (!userData) {
    return <div className="p-8 text-center text-xl text-muted-foreground">User not found</div>
  }
  return (
    <div className="min-h-screen bg-background p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">

        {/* Header Card */}
        <div className="bg-card rounded-2xl border-2 border-border shadow-sm overflow-hidden mb-8">
          <div className="h-28 sm:h-36 bg-muted relative">
            <div className="absolute top-4 right-4">
              <Badge variant="outline" className="font-semibold bg-muted text-muted-foreground border-border capitalize">
                <User className="w-3 h-3 mr-1" />
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
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mb-2">
                  <h1 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">{userData.name}</h1>
                  {userData.averageRating ? (
                    <Badge variant="secondary" className="text-sm font-bold ml-2 bg-yellow-500/10 text-yellow-600 border-yellow-500/20">
                      <Star className="w-4 h-4 mr-1 text-yellow-500 fill-yellow-500" />
                      {userData.averageRating} ({userData.totalReviews})
                    </Badge>
                  ) : null}
                  {userData.isVerified && (
                    <span title="Verified by PostMyGig" className="flex items-center mt-1 sm:mt-1.5">
                      <ShieldCheck className="w-7 h-7 sm:w-8 sm:h-8 text-blue-500 drop-shadow-sm" fill="currentColor" stroke="white" />
                    </span>
                  )}
                </div>
                <div className="flex flex-col sm:flex-row items-center sm:justify-start gap-4 mt-3">
                  {userData.email && (
                    <div className="flex items-center gap-2 text-muted-foreground text-sm font-medium">
                      <Mail className="w-4 h-4" />
                      <span>{userData.email}</span>
                    </div>
                  )}
                  {userData.location && (
                    <div className="flex items-center gap-2 text-muted-foreground text-sm font-medium">
                      <MapPin className="w-4 h-4" />
                      <span>{userData.location}</span>
                    </div>
                  )}
                </div>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 mt-5">
                  <Badge variant="outline" className="bg-muted/50 text-foreground border-border/50 font-medium px-3 py-1 text-xs">
                    <Calendar className="w-3.5 h-3.5 mr-1.5" />
                    Joined {formatDate(userData.createdAt)}
                  </Badge>
                  {userData.isBanned && (
                    <Badge variant="outline" className="bg-destructive/10 text-destructive-foreground border-destructive/20 font-medium px-3 py-1 text-xs">
                      <AlertTriangle className="w-3.5 h-3.5 mr-1.5" />
                      Banned
                    </Badge>
                  )}

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

            {/* Reviews & Feedback */}
            <div className="bg-card rounded-2xl border-2 border-border shadow-sm overflow-hidden">
              <div className="p-6 sm:p-8">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4">Reviews & Feedback</p>
                {userData.reviews && userData.reviews.length > 0 ? (
                  <div className="space-y-4">
                    {userData.reviews.map((review: any) => (
                      <div key={review._id} className="bg-muted border border-border rounded-xl p-4">
                        <div className="flex items-center gap-1 mb-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-4 h-4 ${star <= review.rating ? "text-yellow-500 fill-yellow-500" : "text-muted-foreground"}`}
                            />
                          ))}
                        </div>
                        <p className="text-sm text-foreground mb-2 leading-relaxed">{review.comment}</p>
                        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                          From a {review.role} • {formatDate(review.createdAt)}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-muted rounded-xl p-8 text-center border border-border">
                    <MessageSquare className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                    <p className="text-foreground font-medium">No reviews yet</p>
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
                </div>
              </div>
            </div>

            <ProfileActions userData={userData} />

          </div>
        </div>

        {/* Bottom Section 1: Featured Projects (Full Width Grid matching GigCard style) */}
        {userData.portfolioProjects && userData.portfolioProjects.length > 0 && (
          <div className="space-y-6 mt-8">
            <div className="pt-2">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4">
                Featured Projects <span className="bg-muted text-muted-foreground px-2 py-0.5 rounded-full ml-1">{userData.portfolioProjects.length}</span>
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 relative">
                {userData.portfolioProjects.map((project, index) => (
                  <div
                    key={index}
                    className="group bg-card rounded-2xl border-2 border-border shadow-sm hover:border-primary transition-colors flex flex-col h-full overflow-hidden"
                  >
                    <div className="p-6 flex flex-col h-full">
                      {/* Title and Description */}
                      <div className="space-y-2 mb-6">
                        <h2 className="text-lg sm:text-xl font-semibold text-foreground line-clamp-2">
                          {project.title}
                        </h2>
                        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                          {project.description}
                        </p>
                      </div>

                      {/* Tech Stack Skills */}
                      {project.tags && project.tags.length > 0 && (
                        <div className="mt-auto mb-6">
                          <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-3">
                            Tech Stack
                          </p>
                          <div className="flex flex-wrap items-center gap-2">
                            {project.tags.map((tag, tagIndex) => (
                              <span
                                key={tagIndex}
                                className="bg-secondary text-secondary-foreground text-xs font-semibold px-3 py-1.5 rounded-xl border border-transparent"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Action Buttons */}
                      {(project.liveUrl || project.githubUrl) && (
                        <div className={`${project.liveUrl && project.githubUrl ? "grid grid-cols-2 gap-2.5" : "flex"} ${!project.tags || project.tags.length === 0 ? "mt-auto" : ""}`}>
                          {project.liveUrl && (
                            <a
                              href={project.liveUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-full flex items-center justify-center gap-2 px-3 py-2.5 bg-primary text-primary-foreground rounded-xl font-semibold transition-opacity shadow-xs text-xs sm:text-sm cursor-pointer hover:opacity-90"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                              <span>Live Demo</span>
                            </a>
                          )}
                          {project.githubUrl && (
                            <a
                              href={project.githubUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-full flex items-center justify-center gap-2 px-3 py-2.5 bg-muted border border-border text-foreground hover:bg-accent rounded-xl font-semibold transition-colors shadow-xs text-xs sm:text-sm cursor-pointer"
                            >
                              <Code2 className="w-3.5 h-3.5" />
                              <span>GitHub</span>
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Bottom Section 2: Posted Gigs (Only rendered for Clients) */}
        {userData.role === "client" && (
          <div className="space-y-6 mt-8">
            {(() => {
              const allGigs = [...(userData.openGigs || []), ...(userData.completedGigs || [])].sort((a, b) => {
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
              })

              if (allGigs.length === 0) return null

              return (
                <div className="pt-2">
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4">
                    Posted Gigs <span className="bg-muted text-muted-foreground px-2 py-0.5 rounded-full ml-1">{allGigs.length}</span>
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 relative">
                    {allGigs.map(gig => <GigCard key={gig._id} gig={gig} />)}
                  </div>
                </div>
              )
            })()}
          </div>
        )}
      </div>
    </div>
  )
}
