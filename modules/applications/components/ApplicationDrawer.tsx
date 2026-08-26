"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import type { Application } from "@/app/(pages)/applications/view-applications/types"
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
} from "@/components/ui/drawer"
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
  Code2,
  User,
  FileText,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ExpandableText } from "@/components/ui/expandable-text"
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

export function ApplicationDrawer({
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
  const isAccepted = ["accepted", "contract_offered", "in_progress"].includes(application.status.toLowerCase())

  return (
    <Drawer open={!!application} onOpenChange={(open) => !open && onClose()} direction="right">
      <DrawerContent className="flex flex-col h-full max-w-xl w-full ml-auto">
        {/* Header */}
        <DrawerHeader className="flex-none border-b border-border px-6 py-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4 min-w-0 flex-1">
              <div className="w-14 h-14 bg-primary/10 border-2 border-primary/20 text-primary rounded-xl flex items-center justify-center overflow-hidden shrink-0 font-bold text-xl">
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
                <DrawerTitle className="text-lg font-semibold text-foreground tracking-tight truncate">
                  {application.applicant?.name || application.userEmail}
                </DrawerTitle>
                <div className="flex flex-wrap items-center gap-2 mb-1.5 mt-1">
                  <Badge className="border px-2 py-0.5 capitalize font-semibold text-[10px] sm:text-xs">
                    {application.status || "Pending"}
                  </Badge>
                  {match && match.score > 0 && !isAccepted && (
                    <Badge className="bg-primary text-primary-foreground font-bold px-2 py-0.5 text-[10px] sm:text-xs border-0 shadow-xs">
                      <Sparkles className="w-3 h-3 mr-1" /> {match.score}% Match
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-3 text-muted-foreground text-xs flex-wrap mt-2">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-muted-foreground" /> Applied {new Date(application.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </span>
                </div>
              </div>
            </div>
            <DrawerClose asChild>
              <Button
                variant="ghost"
                size="icon"
                className="shrink-0 h-8 w-8 rounded-lg"
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </Button>
            </DrawerClose>
          </div>
        </DrawerHeader>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8">
          
          {/* Profile Quick Link */}
          {application.applicant?._id && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-muted/60 border border-border">
              <div className="text-xs text-muted-foreground leading-relaxed">
                Check this candidate's public profile, client reviews, and full project history
              </div>
              <Link
                href={`/user/profile/${application.applicant._id}`}
                target="_blank"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline shrink-0"
              >
                <User className="w-3.5 h-3.5" /> Full Public Profile
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          )}

          {/* Candidate Pitch */}
          <div className="space-y-3">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-primary" /> Candidate Pitch
            </p>
            <div className="bg-muted/40 rounded-xl p-5 border border-border">
              <ExpandableText 
                text={application.message} 
                className="text-sm text-foreground whitespace-pre-wrap min-w-0 break-words" 
              />
            </div>
          </div>

          {/* Attached Proof of Work */}
          {(application.bestWorkLink || application.bestWorkDescription) && (
            <div className="space-y-3">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                <Star className="w-4 h-4 text-primary" /> Attached Proof of Work
              </p>
              <div className="bg-muted/40 rounded-xl p-5 border border-border space-y-4">
                {application.bestWorkLink && (
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Project Link:</span>
                    <div>
                      <a
                        href={application.bestWorkLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-primary font-bold hover:underline text-sm break-all"
                      >
                        <ExternalLink className="w-3.5 h-3.5 shrink-0" /> {application.bestWorkLink}
                      </a>
                    </div>
                  </div>
                )}
                {application.bestWorkDescription && (
                  <div className={`space-y-1.5 ${application.bestWorkLink ? "pt-4 border-t border-border" : ""}`}>
                    <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Work Details:</span>
                    <ExpandableText 
                      text={application.bestWorkDescription} 
                      className="text-foreground text-sm whitespace-pre-wrap min-w-0 break-words" 
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Candidate Skills */}
          {skills.length > 0 && (
            <div className="space-y-3">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                Skills & Capabilities ({skills.length})
              </p>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, sIdx) => {
                  const isMatching = match?.matchingSkills?.some(
                    (m) => m.toLowerCase() === skill.toLowerCase()
                  )
                  return (
                    <span
                      key={sIdx}
                      className={`text-[11px] sm:text-xs font-semibold px-3 py-1.5 rounded-lg border ${
                        isMatching
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
            <div className="space-y-4 pt-2 pb-6">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2 mb-2">
                <FolderGit2 className="w-4 h-4 text-primary" />
                <span>Featured Projects</span>
                <span className="bg-muted text-muted-foreground px-2 py-0.5 rounded-md text-[10px] font-semibold">
                  {portfolioProjects.length}
                </span>
              </p>
              <div className="grid grid-cols-1 gap-4 relative">
                {portfolioProjects.map((project, index) => (
                  <div
                    key={index}
                    className="group bg-card rounded-xl border border-border shadow-sm hover:border-primary transition-colors flex flex-col h-full overflow-hidden"
                  >
                    <div className="p-5 flex flex-col h-full">
                      <div className="space-y-1.5 mb-4">
                        <h2 className="text-base font-semibold text-foreground line-clamp-2">
                          {project.title}
                        </h2>
                        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                          {project.description}
                        </p>
                      </div>

                      {project.tags && project.tags.length > 0 && (
                        <div className="mt-auto mb-4">
                          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">
                            Tech Stack
                          </p>
                          <div className="flex flex-wrap items-center gap-1.5">
                            {project.tags.map((tag, tagIndex) => (
                              <span
                                key={tagIndex}
                                className="bg-secondary text-secondary-foreground text-[10px] font-semibold px-2 py-1 rounded-md border border-transparent"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {(project.liveUrl || project.githubUrl) && (
                        <div className={`${project.liveUrl && project.githubUrl ? "grid grid-cols-2 gap-2" : "flex"} ${!project.tags || project.tags.length === 0 ? "mt-auto" : ""}`}>
                          {project.liveUrl && (
                            <a
                              href={project.liveUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-full flex items-center justify-center gap-1.5 px-3 py-2 bg-primary text-primary-foreground rounded-lg font-semibold transition-opacity shadow-xs text-xs cursor-pointer hover:opacity-90"
                            >
                              <ExternalLink className="w-3 h-3" />
                              <span>Live Demo</span>
                            </a>
                          )}
                          {project.githubUrl && (
                            <a
                              href={project.githubUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-full flex items-center justify-center gap-1.5 px-3 py-2 bg-muted border border-border text-foreground hover:bg-accent rounded-lg font-semibold transition-colors shadow-xs text-xs cursor-pointer"
                            >
                              <Code2 className="w-3 h-3" />
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
        <div className="flex-none border-t border-border px-4 sm:px-6 py-4 flex flex-row flex-nowrap justify-between items-center gap-2.5 bg-card w-full overflow-x-auto no-scrollbar">
          {isAccepted ? (
            <>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    disabled={loading}
                    variant="destructive"
                    className="flex-none w-auto h-10 px-4 text-xs sm:text-sm font-semibold rounded-xl cursor-pointer whitespace-nowrap"
                  >
                    <XCircle className="w-4 h-4 mr-1.5 shrink-0" /> Revoke Acceptance
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
                className="flex-none w-auto h-10 px-4 text-xs sm:text-sm bg-secondary text-secondary-foreground hover:bg-secondary/80 font-semibold rounded-xl cursor-pointer whitespace-nowrap"
              >
                <FileText className="w-4 h-4 mr-1.5 shrink-0" /> Send Contract
              </Button>
            </>
          ) : (
            <>
              <Button
                onClick={onDelete}
                variant="outline"
                disabled={loading}
                className="flex-none w-auto h-10 px-4 text-xs sm:text-sm font-semibold rounded-xl bg-destructive/10 text-destructive border border-destructive/20 hover:bg-destructive hover:text-destructive-foreground transition-colors cursor-pointer whitespace-nowrap"
              >
                <XCircle className="w-4 h-4 mr-1.5 shrink-0" /> Reject Application
              </Button>
              <Button
                onClick={() => onAccept(application._id, application.applicant?.email || application.userEmail)}
                disabled={loading}
                className="flex-none w-auto h-10 px-4 text-xs sm:text-sm bg-primary text-primary-foreground font-bold rounded-xl hover:opacity-90 transition-opacity cursor-pointer whitespace-nowrap"
              >
                <Check className="w-4 h-4 mr-1.5 shrink-0" /> Accept Application
              </Button>
            </>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  )
}
