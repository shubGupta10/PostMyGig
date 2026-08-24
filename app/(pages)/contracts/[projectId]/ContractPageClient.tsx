"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Button } from '@/components/ui/button';
import { useUploadThing } from "@/lib/uploadthing";
import { FileText, Upload, CheckCircle, Clock, ExternalLink, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { Contract } from "@/modules/contracts/models/ContractModel";
import { useRouter } from "next/navigation";

interface ContractPageClientProps {
  projectId: string;
  freelancerEmail: string;
}

export default function ContractPageClient({ projectId, freelancerEmail }: ContractPageClientProps) {
  const { data: session } = useSession();
  const router = useRouter();

  const [isUploading, setIsUploading] = useState(false);
  const [isAccepting, setIsAccepting] = useState(false);
  const [comment, setComment] = useState("");
  const [contract, setContract] = useState<Contract | null>(null);
  const [loading, setLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const [isMyTurn, setIsMyTurn] = useState(false);
  const [currentUserEmail, setCurrentUserEmail] = useState("");

  const fetchContract = async (email: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/contracts/get?projectId=${projectId}&freelancerEmail=${freelancerEmail}`);
      if (!res.ok) throw new Error("Failed to fetch contract");
      const data = await res.json();
      setContract(data.contract);
      setIsClient(data.isClient);
      setIsMyTurn(data.isMyTurn);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session?.user?.email) {
      setCurrentUserEmail(session.user.email);
      fetchContract(session.user.email);
    }
  }, [session, projectId, freelancerEmail]);

  const { startUpload } = useUploadThing("contractAttachment", {
    onClientUploadComplete: () => {
      setIsUploading(false);
    },
    onUploadError: (error: Error) => {
      setIsUploading(false);
      toast.error(`Upload failed: ${error.message}`);
    },
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      toast.error("Only PDF files are allowed for contracts.");
      return;
    }

    setIsUploading(true);
    try {
      const uploadRes = await startUpload([file]);
      if (uploadRes && uploadRes[0]) {
        if (!contract) {
          const res = await fetch("/api/contracts/create", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              projectId,
              freelancerEmail,
              fileUrl: uploadRes[0].url,
              fileName: uploadRes[0].name,
            }),
          });
          if (!res.ok) throw new Error("Failed to send contract");
          toast.success("Contract sent successfully!");
        } else {
          const res = await fetch("/api/contracts/revise", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contractId: contract._id,
              fileUrl: uploadRes[0].url,
              fileName: uploadRes[0].name,
              comment,
            }),
          });
          if (!res.ok) throw new Error("Failed to revise contract");
          toast.success("Revised contract sent!");
        }
        await fetchContract(currentUserEmail);
      }
    } catch (error: any) {
      toast.error(error.message || "An error occurred");
    } finally {
      setIsUploading(false);
    }
  };

  const handleAccept = async () => {
    if (!contract || contract.revisions.length === 0) return;
    const latestRevision = contract.revisions[contract.revisions.length - 1];

    setIsAccepting(true);
    try {
      const res = await fetch("/api/contracts/accept", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contractId: contract._id,
          finalContractUrl: latestRevision.fileUrl
        }),
      });
      if (!res.ok) throw new Error("Failed to accept contract");
      toast.success("Contract accepted! Project is now In Progress.");
      await fetchContract(currentUserEmail);
    } catch (error: any) {
      toast.error(error.message || "An error occurred");
    } finally {
      setIsAccepting(false);
    }
  };

  const revisions = contract?.revisions || [];
  const status = contract?.status || 'none';

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12 min-h-[80vh] flex flex-col">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="w-10 h-10 rounded-full border border-border"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
              Contract Exchange
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Review and sign the legal terms securely.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Card */}
      <div className="flex-1 bg-card border-2 border-border shadow-sm rounded-2xl overflow-hidden flex flex-col">
        {loading ? (
          <div className="flex-1 flex items-center justify-center py-20">
            <span className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-6">
              {revisions.length > 0 ? (
                <div className="space-y-4">
                  <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Revision History</h4>
                  <div className="space-y-4">
                    {revisions.map((rev, index) => {
                      const isMine = rev.uploadedBy === currentUserEmail;
                      return (
                        <div key={index} className={`flex flex-col p-4 sm:p-5 rounded-2xl border-2 transition-colors ${isMine ? 'bg-primary/5 border-primary/20' : 'bg-muted border-border hover:border-border/80'}`}>
                          <div className="flex justify-between items-start mb-3">
                            <span className="text-sm font-semibold text-foreground">
                              {isMine ? 'You' : (isClient ? 'Freelancer' : 'Client')} uploaded:
                            </span>
                            <span className="text-xs font-medium text-muted-foreground flex items-center gap-1.5 bg-background px-2.5 py-1 rounded-full border border-border">
                              <Clock className="w-3.5 h-3.5" />
                              {new Date(rev.timestamp).toLocaleDateString()}
                            </span>
                          </div>
                          <a
                            href={rev.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 p-3 sm:p-4 bg-background border-2 border-border rounded-xl hover:border-primary hover:shadow-sm transition-all group"
                          >
                            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                              <FileText className="w-5 h-5 text-primary" />
                            </div>
                            <span className="text-sm font-medium truncate flex-1 text-foreground group-hover:text-primary transition-colors">{rev.fileName}</span>
                            <ExternalLink className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                          </a>
                          {rev.comment && (
                            <div className="mt-4 p-3 bg-background/50 rounded-lg border border-border">
                              <p className="text-sm text-muted-foreground italic">
                                "{rev.comment}"
                              </p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="text-center py-20 px-4">
                  <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-10 h-10 text-muted-foreground opacity-50" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-2">No contract sent yet</h3>
                  {isClient ? (
                    <p className="text-sm text-muted-foreground max-w-sm mx-auto">Upload a PDF below to initiate the agreement and send it to the freelancer.</p>
                  ) : (
                    <p className="text-sm text-muted-foreground max-w-sm mx-auto">Waiting for the client to upload the initial contract document.</p>
                  )}
                </div>
              )}
            </div>

            <div className="flex-shrink-0 p-4 sm:p-6 bg-muted/30 border-t-2 border-border space-y-4">
              {status === 'active' ? (
                <div className="flex items-center justify-center gap-3 text-emerald-700 bg-emerald-50 dark:bg-emerald-950/20 py-4 rounded-xl border-2 border-emerald-200 dark:border-emerald-900 shadow-sm">
                  <CheckCircle className="w-6 h-6" />
                  <span className="font-bold">Contract Officially Accepted</span>
                </div>
              ) : isMyTurn ? (
                <>
                  {contract && revisions.length > 0 && (
                    <Button
                      onClick={handleAccept}
                      disabled={isAccepting || isUploading}
                      className="w-full h-14 bg-primary text-primary-foreground font-bold text-base rounded-xl shadow-sm hover:opacity-90 transition-opacity"
                    >
                      {isAccepting ? "Accepting..." : "Accept Latest Contract"}
                    </Button>
                  )}

                  {contract && revisions.length > 0 && (
                    <div className="relative py-2">
                      <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-border" /></div>
                      <div className="relative flex justify-center text-xs font-bold tracking-widest uppercase"><span className="bg-muted/30 px-3 text-muted-foreground">OR REVISE</span></div>
                    </div>
                  )}

                  <div className="space-y-3">
                    {contract && (
                      <input
                        type="text"
                        placeholder="Add a comment about your revisions... (optional)"
                        className="w-full h-12 px-4 text-sm font-medium rounded-xl border-2 border-border bg-background focus:outline-none focus:border-primary transition-colors"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        disabled={isUploading}
                      />
                    )}
                    <div className="relative w-full h-14 rounded-xl border-2 border-dashed border-primary bg-primary/5 hover:bg-primary/10 transition-colors flex items-center justify-center cursor-pointer">
                      <input
                        type="file"
                        accept="application/pdf"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        onChange={handleFileUpload}
                        disabled={isUploading}
                      />
                      <div className="flex items-center gap-2 text-primary font-bold text-sm">
                        <Upload className="w-5 h-5" />
                        {isUploading ? "Uploading PDF..." : (contract ? "Upload Revised PDF" : "Upload & Send Initial Contract")}
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center gap-3 text-muted-foreground bg-background py-4 rounded-xl border-2 border-border shadow-sm">
                  <Clock className="w-5 h-5" />
                  <span className="font-bold text-sm">Waiting for the other party to respond...</span>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
