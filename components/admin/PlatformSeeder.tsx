"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Sparkles,
  Terminal as TerminalIcon,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Copy,
  Trash2,
  ExternalLink,
  Users,
  Briefcase,
  Activity,
  Zap,
} from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"

export function PlatformSeeder() {
  const [isRunning, setIsRunning] = useState(false)
  const [logs, setLogs] = useState<string[]>([])
  const [resultSummary, setResultSummary] = useState<{
    usersCount: number
    newUsersCount: number
    gigsCount: number
    newGigsCount: number
    activityCount: number
  } | null>(null)

  const runSeeder = async () => {
    setIsRunning(true)
    setLogs(["[SYSTEM] Initializing request to /api/admin/seed-platform..."])
    setResultSummary(null)

    try {
      const res = await fetch("/api/admin/seed-platform", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || data.error || "Failed to execute seeder")
      }

      if (data.result?.logs && Array.isArray(data.result.logs)) {
        setLogs(data.result.logs)
      } else {
        setLogs((prev) => [...prev, "[SUCCESS] Seeding executed successfully."])
      }

      setResultSummary({
        usersCount: data.result?.usersCount || 18,
        newUsersCount: data.result?.newUsersCount || 0,
        gigsCount: data.result?.gigsCount || 18,
        newGigsCount: data.result?.newGigsCount || 0,
        activityCount: data.result?.activityCount || 0,
      })

      toast.success("Platform successfully seeded with authentic data!")
    } catch (err: any) {
      console.error("Seeder execution error:", err)
      setLogs((prev) => [...prev, `[ERROR] ❌ ${err.message}`])
      toast.error(err.message || "Failed to seed platform")
    } finally {
      setIsRunning(false)
    }
  }

  const copyLogs = () => {
    if (logs.length === 0) return
    navigator.clipboard.writeText(logs.join("\n"))
    toast.success("Terminal logs copied to clipboard!")
  }

  const clearLogs = () => {
    setLogs([])
    setResultSummary(null)
  }

  return (
    <div className="space-y-6">
      {/* Overview & Action Card */}
      <Card className="border-2 border-border shadow-sm rounded-2xl overflow-hidden bg-card">
        <CardHeader className="p-6 pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-primary text-primary-foreground">
                  <Sparkles className="size-5" />
                </div>
                <CardTitle className="text-xl font-bold text-foreground">
                  Platform Growth & Data Seeder
                </CardTitle>
              </div>
              <CardDescription className="mt-1 text-sm text-muted-foreground">
                Deploy 18 authentic multi-country client profiles (Indian, American, British), 18 multi-domain gigs, and live activity events in one click.
              </CardDescription>
            </div>

            <Button
              onClick={runSeeder}
              disabled={isRunning}
              className="bg-primary text-primary-foreground font-semibold h-11 px-6 rounded-xl shrink-0 shadow-sm cursor-pointer hover:opacity-90"
            >
              {isRunning ? (
                <>
                  <Loader2 className="size-4 animate-spin mr-2" />
                  <span>Seeding Platform...</span>
                </>
              ) : (
                <>
                  <Zap className="size-4 mr-2" />
                  <span>Run Platform Seeder</span>
                </>
              )}
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-6 pt-2 space-y-6">
          {/* Quick Specifications */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="bg-muted p-4 rounded-xl border border-border flex items-start gap-3">
              <Users className="size-5 text-primary mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                  Clients (18 Total)
                </p>
                <p className="text-sm font-semibold text-foreground mt-0.5">
                  6 Indian · 6 American · 6 British
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Everyday clients, emails 100% hidden
                </p>
              </div>
            </div>

            <div className="bg-muted p-4 rounded-xl border border-border flex items-start gap-3">
              <Briefcase className="size-5 text-primary mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                  Gigs (18 Total)
                </p>
                <p className="text-sm font-semibold text-foreground mt-0.5">
                  Web · Mobile · Design · SEO
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Staggered dates from 4h to 7d ago
                </p>
              </div>
            </div>

            <div className="bg-muted p-4 rounded-xl border border-border flex items-start gap-3">
              <Activity className="size-5 text-primary mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                  Activity Feed
                </p>
                <p className="text-sm font-semibold text-foreground mt-0.5">
                  Live Platform Milestones
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Populates /activity & success stories
                </p>
              </div>
            </div>
          </div>

          {/* Result Summary Bar (if executed) */}
          {resultSummary && (
            <div className="bg-primary/10 border-2 border-primary/30 p-4 rounded-xl flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-primary font-semibold text-sm">
                <CheckCircle2 className="size-5 shrink-0" />
                <span>Seeding Completed Successfully</span>
              </div>

              <div className="flex flex-wrap items-center gap-2 text-xs">
                <Badge variant="outline" className="bg-card font-medium">
                  {resultSummary.usersCount} Profiles Active ({resultSummary.newUsersCount} created)
                </Badge>
                <Badge variant="outline" className="bg-card font-medium">
                  {resultSummary.gigsCount} Gigs Live ({resultSummary.newGigsCount} created)
                </Badge>
                <Badge variant="outline" className="bg-card font-medium">
                  {resultSummary.activityCount} Activities Logged
                </Badge>
              </div>

              <div className="flex items-center gap-3">
                <Link
                  href="/view-gigs"
                  target="_blank"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                >
                  <span>View Gigs</span>
                  <ExternalLink className="size-3.5" />
                </Link>
                <Link
                  href="/activity"
                  target="_blank"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                >
                  <span>Activity Feed</span>
                  <ExternalLink className="size-3.5" />
                </Link>
              </div>
            </div>
          )}

          {/* Interactive Terminal Output Console */}
          <div className="rounded-2xl border-2 border-zinc-800 bg-zinc-950 overflow-hidden shadow-md">
            {/* Terminal Window Top Bar */}
            <div className="bg-zinc-900 px-4 py-3 border-b border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="size-3 rounded-full bg-red-500/80 inline-block" />
                <span className="size-3 rounded-full bg-yellow-500/80 inline-block" />
                <span className="size-3 rounded-full bg-green-500/80 inline-block" />
                <span className="text-xs text-zinc-400 font-mono ml-2 flex items-center gap-1.5">
                  <TerminalIcon className="size-3.5 text-zinc-400" />
                  postmygig-seeder.log
                </span>
              </div>

              <div className="flex items-center gap-1">
                {logs.length > 0 && (
                  <>
                    <button
                      onClick={copyLogs}
                      title="Copy Logs"
                      className="p-1.5 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer text-xs flex items-center gap-1"
                    >
                      <Copy className="size-3.5" />
                      <span className="hidden sm:inline">Copy</span>
                    </button>
                    <button
                      onClick={clearLogs}
                      title="Clear Terminal"
                      className="p-1.5 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer text-xs flex items-center gap-1"
                    >
                      <Trash2 className="size-3.5" />
                      <span className="hidden sm:inline">Clear</span>
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Terminal Content Screen */}
            <div className="p-4 sm:p-5 h-72 sm:h-80 overflow-y-auto font-mono text-xs text-zinc-300 leading-relaxed space-y-1.5 scrollbar-thin">
              {logs.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-zinc-500 space-y-2">
                  <TerminalIcon className="size-8 opacity-40" />
                  <p>Terminal output is ready. Click "Run Platform Seeder" above to execute.</p>
                </div>
              ) : (
                logs.map((line, index) => {
                  const isSuccess = line.includes("✓") || line.includes("🎉") || line.includes("✨")
                  const isError = line.includes("❌") || line.includes("[ERROR]")
                  const isWarning = line.includes("⚠") || line.includes("ℹ")
                  const isActivity = line.includes("⚡") || line.includes("🧹")

                  return (
                    <div
                      key={index}
                      className={`flex items-start gap-2 ${
                        isError
                          ? "text-red-400 font-semibold"
                          : isSuccess
                          ? "text-emerald-400"
                          : isWarning
                          ? "text-yellow-400"
                          : isActivity
                          ? "text-cyan-400"
                          : "text-zinc-300"
                      }`}
                    >
                      <span className="text-zinc-600 select-none">{">"}</span>
                      <span className="whitespace-pre-wrap break-all">{line}</span>
                    </div>
                  )
                })
              )}
              {isRunning && (
                <div className="flex items-center gap-2 text-primary animate-pulse pt-2">
                  <span className="size-2 rounded-full bg-primary" />
                  <span>Processing database transactions...</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
