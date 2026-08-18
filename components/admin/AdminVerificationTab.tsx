"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle } from "lucide-react"
import { VerificationRequest } from "./types"

interface AdminVerificationTabProps {
  requests: VerificationRequest[]
  onResolve: (userId: string, action: "approve" | "reject") => void
}

export function AdminVerificationTab({
  requests,
  onResolve,
}: AdminVerificationTabProps) {
  return (
    <Card>
      <CardHeader className="p-4 sm:p-6">
        <CardTitle className="text-base sm:text-lg">Verification Requests</CardTitle>
        <CardDescription className="text-xs sm:text-sm">
          Review users who have completed gigs and approve their verified status.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
        <div className="space-y-4">
          {requests && requests.length > 0 ? (
            requests.map((req) => (
              <Card key={req._id} className="border border-border p-4 sm:p-5">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex items-start space-x-3 sm:space-x-4 flex-1 min-w-0">
                    <Avatar className="h-9 w-9 sm:h-10 sm:w-10 border border-muted shrink-0">
                      <AvatarImage src={req.profilePhoto || ""} />
                      <AvatarFallback className="text-xs sm:text-sm">{req.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="font-semibold text-sm sm:text-base">{req.name}</h4>
                        <Badge variant="outline" className="text-[10px] sm:text-xs">{req.role}</Badge>
                      </div>
                      <p className="text-xs sm:text-sm text-muted-foreground truncate">{req.email}</p>
                      <div className="mt-3 sm:mt-4">
                        <p className="text-xs sm:text-sm font-medium mb-1.5">
                          Completed Gigs ({req.completedGigs?.length || 0}):
                        </p>
                        <ul className="text-xs sm:text-sm text-muted-foreground list-disc pl-5 space-y-1">
                          {req.completedGigs?.map((gig) => (
                            <li key={gig._id}>
                              {gig.title} - <span className="text-[10px] sm:text-xs font-semibold">{gig.budget}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-green-600 border-green-600 hover:bg-green-50 text-xs h-9 rounded-xl"
                      onClick={() => onResolve(req._id, "approve")}
                    >
                      <CheckCircle className="h-3.5 w-3.5 mr-1.5" /> Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-destructive border-destructive hover:bg-destructive/10 text-xs h-9 rounded-xl"
                      onClick={() => onResolve(req._id, "reject")}
                    >
                      <XCircle className="h-3.5 w-3.5 mr-1.5" /> Reject
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground text-xs sm:text-sm">
              No pending verification requests.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
