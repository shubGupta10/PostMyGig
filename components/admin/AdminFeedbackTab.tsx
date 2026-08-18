"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
import {
  MessageSquare,
  Filter,
  Search,
  Mail,
  Clock,
  Calendar,
  Trash2,
  Loader2,
  Lightbulb,
  MessageCircle,
  AlertTriangle,
} from "lucide-react"
import SendMail from "@/app/user/admin/dashboard/sendMail"
import { Feedback } from "./types"

interface AdminFeedbackTabProps {
  feedbacks: Feedback[]
  onDeleteFeedback: (feedbackId: string) => Promise<void>
  deletingFeedbackId: string | null
}

export function AdminFeedbackTab({
  feedbacks,
  onDeleteFeedback,
  deletingFeedbackId,
}: AdminFeedbackTabProps) {
  const [feedbackTypeFilter, setFeedbackTypeFilter] = useState("all")
  const [feedbackSearchTerm, setFeedbackSearchTerm] = useState("")

  const filteredFeedbacks = feedbacks?.filter((feedback) => {
    const matchesSearch =
      feedback.name.toLowerCase().includes(feedbackSearchTerm.toLowerCase()) ||
      feedback.email.toLowerCase().includes(feedbackSearchTerm.toLowerCase()) ||
      feedback.feedback.toLowerCase().includes(feedbackSearchTerm.toLowerCase())

    const matchesType = feedbackTypeFilter === "all" || feedback.feedbackType === feedbackTypeFilter

    return matchesSearch && matchesType
  }) || []

  const getFeedbackTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "suggestion":
        return "bg-blue-500/10 text-blue-600 border border-blue-500/20"
      case "general":
        return "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
      case "complaint":
        return "bg-destructive/10 text-destructive border border-destructive/20"
      case "bug":
        return "bg-amber-500/10 text-amber-600 border border-amber-500/20"
      default:
        return "bg-muted text-muted-foreground border-border"
    }
  }

  const getFeedbackTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "suggestion":
        return <Lightbulb className="h-3.5 w-3.5" />
      case "general":
        return <MessageCircle className="h-3.5 w-3.5" />
      case "complaint":
      case "bug":
        return <AlertTriangle className="h-3.5 w-3.5" />
      default:
        return <MessageSquare className="h-3.5 w-3.5" />
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getTimeAgo = (dateString: string) => {
    const now = new Date()
    const date = new Date(dateString)
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours}h ago`
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`
    return formatDate(dateString)
  }

  return (
    <Card>
      <CardHeader className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-base sm:text-lg flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-primary" />
              Feedback Management
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">Monitor and respond to user feedback submissions</CardDescription>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <Select value={feedbackTypeFilter} onValueChange={setFeedbackTypeFilter}>
              <SelectTrigger className="w-full sm:w-40 h-10 rounded-xl">
                <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="suggestion">Suggestions</SelectItem>
                <SelectItem value="general">General</SelectItem>
                <SelectItem value="complaint">Complaints</SelectItem>
                <SelectItem value="bug">Bug Reports</SelectItem>
              </SelectContent>
            </Select>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search feedback..."
                value={feedbackSearchTerm}
                onChange={(e) => setFeedbackSearchTerm(e.target.value)}
                className="pl-9 w-full sm:w-64 h-10 rounded-xl"
              />
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
        <div className="space-y-4">
          {filteredFeedbacks && filteredFeedbacks.length > 0 ? (
            filteredFeedbacks.map((feedback) => (
              <Card
                key={feedback._id}
                className="border border-border hover:shadow-md transition-all"
              >
                <CardHeader className="pb-3 p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="flex items-start space-x-3 sm:space-x-4 flex-1 min-w-0">
                      <Avatar className="h-9 w-9 sm:h-10 sm:w-10 border-2 border-muted shrink-0">
                        <AvatarFallback className="bg-primary/10 text-primary font-semibold text-xs sm:text-sm">
                          {feedback.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <h4 className="font-semibold text-foreground text-sm sm:text-base">{feedback.name}</h4>
                          <Badge className={getFeedbackTypeColor(feedback.feedbackType)}>
                            {getFeedbackTypeIcon(feedback.feedbackType)}
                            <span className="ml-1 capitalize text-[10px] sm:text-xs">{feedback.feedbackType}</span>
                          </Badge>
                        </div>
                        <div className="flex items-center text-xs sm:text-sm text-muted-foreground mb-2 truncate">
                          <Mail className="h-3 w-3 mr-1 shrink-0" />
                          <span className="truncate">{feedback.email}</span>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-[10px] sm:text-xs text-muted-foreground">
                          <div className="flex items-center">
                            <Clock className="h-3 w-3 mr-1 shrink-0" />
                            {getTimeAgo(feedback.submittedAt)}
                          </div>
                          <div className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1 shrink-0" />
                            {formatDateTime(feedback.submittedAt)}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                      <SendMail to={feedback.email} userName={feedback.name} />
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                            disabled={deletingFeedbackId === feedback._id}
                          >
                            {deletingFeedbackId === feedback._id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Feedback</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this feedback from {feedback.name}? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => onDeleteFeedback(feedback._id)}
                              className="bg-destructive hover:bg-destructive/90"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
                  <div className="space-y-3">
                    <div className="bg-muted/30 rounded-xl p-3.5 sm:p-4 border-l-4 border-l-primary/40">
                      <p className="text-xs sm:text-sm leading-relaxed text-foreground">{feedback.feedback}</p>
                    </div>
                    <div className="text-[10px] text-muted-foreground">ID: {feedback._id.slice(-8)}</div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-12">
              <div className="mx-auto size-16 bg-muted rounded-full flex items-center justify-center mb-3">
                <MessageSquare className="size-8 text-muted-foreground" />
              </div>
              <h3 className="text-base font-semibold text-foreground mb-1">No feedback found</h3>
              <p className="text-xs sm:text-sm text-muted-foreground max-w-sm mx-auto">
                {feedbackTypeFilter !== "all" || feedbackSearchTerm
                  ? "Try adjusting your filters or search terms to find feedback."
                  : "No feedback has been submitted yet."}
              </p>
              {(feedbackTypeFilter !== "all" || feedbackSearchTerm) && (
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4 rounded-xl"
                  onClick={() => {
                    setFeedbackTypeFilter("all")
                    setFeedbackSearchTerm("")
                  }}
                >
                  Clear Filters
                </Button>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
