import type { ContactData } from "@/app/(pages)/applications/view-applications/types"
import { X, Mail, ExternalLink, User2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Props {
  contactData: ContactData
  onClose: () => void
}

export function ContactModal({ contactData, onClose }: Props) {
  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-2xl border-2 border-border shadow-sm max-w-lg w-full max-h-[90vh] overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary text-primary-foreground rounded-xl flex items-center justify-center">
              <User2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">Contact Information</h2>
              <p className="text-sm text-muted-foreground">Connect with the accepted applicant</p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={onClose} className="h-9 w-9 p-0 border-border shrink-0">
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)] space-y-6">
          {/* Email */}
          <div>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3 flex items-center gap-2">
              <Mail className="w-3.5 h-3.5" /> Email Address
            </p>
            <div className="bg-muted rounded-xl p-4 border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <span className="text-foreground font-medium break-all">{contactData.email}</span>
              <Button size="sm" onClick={() => window.open(`mailto:${contactData.email}`, "_blank")}
                className="bg-primary text-primary-foreground font-medium shrink-0">
                <Mail className="w-4 h-4 mr-2" /> Send Email
              </Button>
            </div>
          </div>

          {/* Contact Links */}
          {contactData.contactLinks && contactData.contactLinks.length > 0 ? (
            <div>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3 flex items-center gap-2">
                <ExternalLink className="w-3.5 h-3.5" /> Additional Links
              </p>
              <div className="space-y-3">
                {contactData.contactLinks.map((link, i) => (
                  <div key={i} className="bg-muted rounded-xl p-4 border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-semibold text-foreground">{link.label}</p>
                      <p className="text-muted-foreground text-sm break-all">{link.url}</p>
                    </div>
                    <Button size="sm" onClick={() => window.open(link.url, "_blank")}
                      className="bg-primary text-primary-foreground font-medium shrink-0">
                      <ExternalLink className="w-4 h-4 mr-2" /> Visit
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-muted rounded-xl p-8 text-center border border-border">
              <ExternalLink className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-foreground font-medium">No additional contact methods</p>
              <p className="text-muted-foreground text-sm mt-1">Reach them via email above</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end p-6 border-t border-border">
          <Button variant="outline" onClick={onClose} className="border-border font-medium">Close</Button>
        </div>
      </div>
    </div>
  )
}
