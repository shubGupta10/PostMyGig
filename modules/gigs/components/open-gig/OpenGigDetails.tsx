"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { Switch } from "@/components/ui/switch"
import { Shield, Mail, MessageCircle, Twitter, ExternalLink } from "lucide-react"
import type { Gig } from "@/app/(pages)/(gig)/types"
import { updateContactVisibility } from "@/app/(pages)/(gig)/open-gig/[gigId]/services/gigApi"

interface OpenGigDetailsProps {
  gig: Gig
}

export function OpenGigDetails({ gig: initialGig }: OpenGigDetailsProps) {
  const { data: session } = useSession()
  const user = session?.user

  const [displayContactLinks, setDisplayContactLinks] = useState(initialGig.displayContactLinks || false)

  const toggleContactVisibility = async () => {
    try {
      const response = await updateContactVisibility(initialGig._id, !displayContactLinks)
      if (response.ok) {
        setDisplayContactLinks(!displayContactLinks)
      } else {
        const data = await response.json()
        alert(data.message || "Failed to update contact visibility")
      }
    } catch (error) {
      console.error("Error updating contact visibility:", error)
      alert("An error occurred while updating contact visibility")
    }
  }

  return (
    <div className="lg:col-span-2">
      <div className="bg-card rounded-2xl border-2 border-border shadow-sm overflow-hidden">
        
        {/* Description Section */}
        <div className="p-4 sm:p-6 lg:p-8 border-b border-border">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4">
            Project Description
          </p>
          <div className="prose prose-gray max-w-none">
            <p className="text-card-foreground leading-relaxed text-base sm:text-lg whitespace-pre-wrap">{initialGig.description}</p>
          </div>
        </div>

        {/* Skills Section */}
        <div className="p-4 sm:p-6 lg:p-8 border-b border-border">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4">
            Skills & Technologies
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {initialGig.skillsRequired.map((skill, index) => (
              <div
                key={index}
                className="bg-muted border border-border rounded-xl p-4 text-center group transition-all duration-200 cursor-pointer transform hover:-translate-y-1 hover:shadow-sm"
              >
                <span className="text-foreground font-semibold text-sm group-hover:scale-105 transition-transform duration-200 inline-block">
                  {skill.trim()}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Information Section */}
        {initialGig.contact && (initialGig.contact.email || initialGig.contact.whatsapp || initialGig.contact.x) && (
          <div className="p-4 sm:p-6 lg:p-8">
            <div className="mb-6">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4">
                Contact Information
              </p>
              <div className="flex items-center gap-3 bg-muted rounded-xl px-4 py-2 mb-8 w-fit">
                <span className="text-sm font-semibold text-foreground">
                  Public
                </span>
                <Switch checked={displayContactLinks} onCheckedChange={toggleContactVisibility} />
              </div>
            </div>
            {displayContactLinks === true || user?.email === initialGig.createdBy ? (
              <div className="flex flex-col gap-3">
                {initialGig.contact.email && (
                  <div className="bg-muted rounded-xl p-4 border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-background border border-border flex items-center justify-center shrink-0">
                        <Mail className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-foreground">Email</h4>
                        <p className="text-sm text-muted-foreground break-all">{initialGig.contact.email}</p>
                      </div>
                    </div>
                    <a
                      href={`mailto:${initialGig.contact.email}`}
                      className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-background border border-border rounded-lg text-sm font-semibold text-foreground hover:bg-muted-foreground/10 transition-colors w-full sm:w-auto"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Send Email
                    </a>
                  </div>
                )}

                {initialGig.contact.whatsapp && (
                  <div className="bg-muted rounded-xl p-4 border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-background border border-border flex items-center justify-center shrink-0">
                        <MessageCircle className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-foreground">WhatsApp</h4>
                        <p className="text-sm text-muted-foreground break-all">{initialGig.contact.whatsapp}</p>
                      </div>
                    </div>
                    <a
                      href={`https://wa.me/${initialGig.contact.whatsapp}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-background border border-border rounded-lg text-sm font-semibold text-foreground hover:bg-muted-foreground/10 transition-colors w-full sm:w-auto"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Open WhatsApp
                    </a>
                  </div>
                )}

                {initialGig.contact.x && (
                  <div className="bg-muted rounded-xl p-4 border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-background border border-border flex items-center justify-center shrink-0">
                        <Twitter className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-foreground">X (Twitter)</h4>
                        <p className="text-sm text-muted-foreground break-all">{initialGig.contact.x}</p>
                      </div>
                    </div>
                    <a
                      href={`https://x.com/${initialGig.contact.x}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-background border border-border rounded-lg text-sm font-semibold text-foreground hover:bg-muted-foreground/10 transition-colors w-full sm:w-auto"
                    >
                      <ExternalLink className="w-4 h-4" />
                      View Profile
                    </a>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-muted rounded-xl p-10 text-center border border-border">
                <Shield className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                <p className="text-foreground font-semibold">
                  Contact information is private
                </p>
                <p className="text-muted-foreground text-sm mt-1">
                  Apply to this gig to get contact details
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
