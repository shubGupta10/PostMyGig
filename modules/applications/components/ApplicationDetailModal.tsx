import { useState } from "react"
import { useSession } from "next-auth/react"

import type { Application } from "@/app/(pages)/applications/view-applications/types"
import {
  X,
  MessageSquare,
  Star,
  ExternalLink,
  XCircle,
  Check,
  Mail,
  Calendar,
  Sparkles,
  FolderGit2,
  Github,
  Code2,
  User,
  FileText,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface Props {
  application: Application
  loading: boolean
  onClose: () => void
  onAccept: (id: string, email: string) => void
  onDelete: () => void
  onContact?: (email: string) => void
  onRevoke: () => void
}

export function ApplicationDetailModal({
  application,
  loading,

  onClose,
  onAccept,
  onDelete,
  onRevoke,
}: Props) {
  const { data: session } = useSession()
  
  const match = application.matchDetails
  const portfolioProjects = application.applicant?.portfolioProjects || []
  const skills = application.applicant?.skills || []

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 sm:p-6">
      <div className="bg-card rounded-3xl border-2 border-border shadow-2xl max-w-5xl w-full max-h-[92vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 sm:p-7 border-b border-border shrink-0 bg-card">
          <div className="flex items-center gap-4 sm:gap-5 min-w-0 flex-1">
            <div className="w-16 h-16 bg-primary/10 border-2 border-primary/20 text-primary rounded-2xl flex items-center justify-center overflow-hidden shrink-0 font-bold text-2xl">
              {application.applicant?.profilePhoto ? (
                <img
                  src={application.applicant.profilePhoto}
                  alt={application.applicant?.name || "Applicant"}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <span>{(application.applicant?.name?.[0] || "?").toUpperCase()}</span>
              )}
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2.5 mb-1.5">
                <h2 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight truncate">
                  {application.applicant?.name || application.userEmail}
                </h2>
                <Badge className="border px-3 py-1 capitalize font-semibold text-xs">
                  {application.status || "Pending"}
                </Badge>
                {match && match.score > 0 && (
                  <Badge className="bg-primary text-primary-foreground font-bold px-3 py-1 text-xs border-0 shadow-xs">
                    <Sparkles className="w-3.5 h-3.5 mr-1" /> {match.score}% Match
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-4 text-muted-foreground text-xs sm:text-sm flex-wrap">
                <span className="flex items-center gap-1.5">
                  <Mail className="w-4 h-4 text-muted-foreground" /> {application.applicant?.email || application.userEmail}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-muted-foreground" /> Applied on {new Date(application.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </span>
              </div>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            className="h-10 w-10 p-0 border-2 border-border shrink-0 rounded-xl cursor-pointer hover:bg-muted"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-10 overflow-y-auto space-y-10 sm:space-y-12 flex-1">
          {/* Profile Quick Link */}
          {application.applicant?._id && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-muted/60 border border-border">
              <div className="text-sm text-muted-foreground">
                Check this candidate's public profile, client reviews, and full project history
              </div>
              <Link
                href={`/user/profile/${application.applicant._id}`}
                target="_blank"
                className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline shrink-0"
              >
                <User className="w-4 h-4" /> Full Public Profile
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}

          {/* Candidate Pitch */}
          <div className="space-y-3">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-primary" /> Candidate Pitch
            </p>
            <div className="bg-muted/40 rounded-2xl p-7 border-2 border-border">
              <p className="text-foreground leading-relaxed whitespace-pre-wrap text-base sm:text-lg">
                {application.message}
              </p>
            </div>
          </div>

          {/* Attached Proof of Work */}
          {(application.bestWorkLink || application.bestWorkDescription) && (
            <div className="space-y-3">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                <Star className="w-4 h-4 text-primary" /> Attached Proof of Work
              </p>
              <div className="bg-muted/40 rounded-2xl p-7 border-2 border-border space-y-5">
                {application.bestWorkLink && (
                  <div className="space-y-2">
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Project Link:</span>
                    <div>
                      <a
                        href={application.bestWorkLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-primary font-bold hover:underline text-base break-all"
                      >
                        <ExternalLink className="w-4 h-4 shrink-0" /> {application.bestWorkLink}
                      </a>
                    </div>
                  </div>
                )}
                {application.bestWorkDescription && (
                  <div className="space-y-2 pt-4 border-t border-border">
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Work Details:</span>
                    <p className="text-foreground leading-relaxed text-sm sm:text-base whitespace-pre-wrap">
                      {application.bestWorkDescription}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Candidate Skills */}
          {skills.length > 0 && (
            <div className="space-y-3.5">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                Skills & Capabilities ({skills.length})
              </p>
              <div className="flex flex-wrap gap-2.5">
                {skills.map((skill, sIdx) => {
                  const isMatching = match?.matchingSkills?.some(
                    (m) => m.toLowerCase() === skill.toLowerCase()
                  )
                  return (
                    <span
                      key={sIdx}
                      className={`text-xs sm:text-sm font-semibold px-4 py-2 rounded-xl border ${isMatching
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-secondary text-secondary-foreground border-border"
                        }`}
                    >
                      {isMatching && "✓ "}
                      {skill}
                    </span>
                  )
                })}
              </div>
            </div>
          )}

          {/* Featured Portfolio Projects */}
          {portfolioProjects.length > 0 && (
            <div className="space-y-5 pt-2">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2 mb-4">
                <FolderGit2 className="w-4 h-4 text-primary" />
                <span>Featured Projects</span>
                <span className="bg-muted text-muted-foreground px-2.5 py-0.5 rounded-full text-xs font-semibold">
                  {portfolioProjects.length}
                </span>
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 relative">
                {portfolioProjects.map((project, index) => (
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
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row justify-end gap-3 p-6 sm:p-7 border-t border-border shrink-0 bg-card">
          <Button
            variant="outline"
            onClick={onClose}
            className="border-2 border-border font-semibold h-12 px-6 rounded-2xl cursor-pointer hover:bg-muted text-sm"
          >
            Close
          </Button>
          <Button
            onClick={onDelete}
            variant="outline"
            disabled={loading}
            className="bg-destructive/10 text-destructive border-2 border-destructive/20 font-semibold h-12 px-6 rounded-2xl hover:bg-destructive hover:text-destructive-foreground transition-colors cursor-pointer text-sm"
          >
            <XCircle className="w-4 h-4 mr-2" /> Reject Application
          </Button>

          {["accepted", "contract_offered", "in_progress"].includes(application.status.toLowerCase()) ? (
            <>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    disabled={loading}
                    variant="destructive"
                    className="font-semibold h-12 px-6 rounded-2xl cursor-pointer shadow-xs text-sm"
                  >
                    <XCircle className="w-4 h-4 mr-2" /> Revoke Acceptance
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="rounded-2xl">
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will remove this freelancer from the project and reopen the gig so you can view or accept other applicants.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="font-semibold rounded-xl">Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={onRevoke}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90 font-semibold rounded-xl cursor-pointer"
                    >
                      Yes, Revoke
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              <Button
                onClick={() => (window.location.href = `/contracts/${application.projectId}?freelancerEmail=${application.applicant?.email || application.userEmail}`)}
                className="bg-secondary text-secondary-foreground hover:bg-secondary/80 font-semibold h-12 px-6 rounded-2xl cursor-pointer shadow-xs text-sm"
              >
                <FileText className="w-4 h-4 mr-2" /> Send Contract
              </Button>
              <Button
                onClick={() => (window.location.href = `/projects/${application.projectId}/huddle`)}
                className="bg-primary text-primary-foreground font-semibold h-12 px-6 rounded-2xl cursor-pointer shadow-xs text-sm"
              >
                <MessageSquare className="w-4 h-4 mr-2" /> Open Project Huddle
              </Button>
            </>
          ) : (
            <Button
              onClick={() => onAccept(application._id, application.applicant?.email || application.userEmail)}
              disabled={loading}
              className="bg-primary text-primary-foreground font-bold h-12 px-7 rounded-2xl cursor-pointer shadow-xs hover:opacity-90 transition-opacity text-sm"
            >
              <Check className="w-4 h-4 mr-2" /> Accept Application
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
