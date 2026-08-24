"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Button } from '@/components/ui/button';
import { useUploadThing } from "@/lib/uploadthing";
import { FileText, Upload, CheckCircle, Clock, ExternalLink } from "lucide-react";
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

  const fetchContract = async () => {
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
      fetchContract();
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
        await fetchContract();
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
      await fetchContract();
    } catch (error: any) {
      toast.error(error.message || "An error occurred");
    } finally {
      setIsAccepting(false);
    }
  };

  const revisions = contract?.revisions || [];
  const status = contract?.status || 'none';

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 sm:py-10 w-full min-w-0 max-w-full">
      <div className="max-w-7xl mx-auto space-y-6 w-full min-w-0">
        
        {/* Header */}
        <div className="flex flex-col gap-1.5 mb-2">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
            Contract Exchange
          </h1>
          <p className="text-sm text-muted-foreground">
            Review and sign the legal terms securely.
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <span className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="space-y-6">
            {revisions.length === 0 ? (
              <div className="border-2 border-dashed border-border bg-card p-6 sm:p-12 text-center rounded-2xl flex flex-col items-center justify-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-secondary text-secondary-foreground rounded-2xl flex items-center justify-center mb-4 sm:mb-6 shadow-xs">
                  <FileText className="h-6 w-6 sm:h-8 sm:w-8" />
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-foreground mb-2">
                  No contract sent yet
                </h3>
                <p className="text-sm text-muted-foreground max-w-sm mb-6 sm:mb-8 leading-relaxed">
                  {isClient 
                    ? "Upload a PDF below to initiate the agreement and send it to the freelancer." 
                    : "Waiting for the client to upload the initial contract document."}
                </p>
                {isClient && (
                  <div className="relative w-full max-w-xs h-11 rounded-xl border-2 border-dashed border-primary bg-primary/5 hover:bg-primary/10 transition-colors flex items-center justify-center cursor-pointer shadow-xs">
                    <input
                      type="file"
                      accept="application/pdf"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      onChange={handleFileUpload}
                      disabled={isUploading}
                    />
                    <div className="flex items-center gap-2 text-primary font-bold text-sm">
                      <Upload className="w-4 h-4" />
                      {isUploading ? "Uploading PDF..." : "Upload Initial Contract"}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Left Column: Revision History */}
                <div className="lg:col-span-2 space-y-4">
                  <div className="flex items-center gap-2 pt-2 mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Revision History
                    </span>
                    <div className="h-px flex-1 bg-border" />
                  </div>

                  <div className="space-y-4">
                    {revisions.map((rev, index) => {
                      const isMine = rev.uploadedBy === currentUserEmail;
                      return (
                        <div key={index} className={`bg-card rounded-2xl border-2 p-4 sm:p-5 shadow-xs transition-all flex flex-col gap-4 ${isMine ? 'border-primary/30' : 'border-border'}`}>
                          <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                              <span className="w-2 h-2 rounded-full bg-primary" />
                              {isMine ? 'You uploaded a contract' : (isClient ? 'Freelancer uploaded a contract' : 'Client uploaded a contract')}
                            </div>
                            <span className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5" />
                              {new Date(rev.timestamp).toLocaleDateString()}
                            </span>
                          </div>
                          
                          <a
                            href={rev.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 p-3 sm:p-4 bg-background border-2 border-border rounded-xl hover:border-primary/50 transition-colors group"
                          >
                            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                              <FileText className="w-5 h-5 text-primary" />
                            </div>
                            <span className="text-sm font-medium truncate flex-1 text-foreground group-hover:text-primary transition-colors">{rev.fileName}</span>
                            <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
                          </a>

                          {rev.comment && (
                            <div className="p-3.5 bg-muted/50 rounded-xl border border-border/50">
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

                {/* Right Column: Actions */}
                <div className="space-y-6">
                   <div className="flex items-center gap-2 pt-2 mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Status & Actions
                    </span>
                    <div className="h-px flex-1 bg-border" />
                  </div>

                  <div className="bg-card rounded-2xl border-2 border-border p-5 shadow-xs space-y-5">
                    {status === 'active' ? (
                      <div className="flex flex-col items-center justify-center gap-2 text-emerald-700 bg-emerald-50 dark:bg-emerald-950/20 py-6 rounded-xl border-2 border-emerald-200 dark:border-emerald-900 shadow-xs text-center px-4">
                        <CheckCircle className="w-8 h-8 mb-1" />
                        <span className="font-bold">Contract Officially Accepted</span>
                        <p className="text-xs text-emerald-600/80 dark:text-emerald-400/80 font-medium">The project is now in progress.</p>
                      </div>
                    ) : isMyTurn ? (
                      <>
                        <Button
                          onClick={handleAccept}
                          disabled={isAccepting || isUploading}
                          className="w-full h-11 bg-primary text-primary-foreground font-bold text-sm rounded-xl shadow-xs transition-opacity cursor-pointer"
                        >
                          {isAccepting ? "Accepting..." : "Accept Latest Contract"}
                        </Button>

                        <div className="relative py-2">
                          <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-border" /></div>
                          <div className="relative flex justify-center text-xs font-bold tracking-widest uppercase"><span className="bg-card px-3 text-muted-foreground">OR REVISE</span></div>
                        </div>

                        <div className="space-y-3">
                          <input
                            type="text"
                            placeholder="Add a comment... (optional)"
                            className="w-full h-10 px-3 text-sm font-medium rounded-xl border-2 border-border bg-background focus:outline-none focus:border-primary transition-colors"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            disabled={isUploading}
                          />
                          <div className="relative w-full h-11 rounded-xl border-2 border-dashed border-primary bg-primary/5 hover:bg-primary/10 transition-colors flex items-center justify-center cursor-pointer">
                            <input
                              type="file"
                              accept="application/pdf"
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                              onChange={handleFileUpload}
                              disabled={isUploading}
                            />
                            <div className="flex items-center gap-2 text-primary font-bold text-sm">
                              <Upload className="w-4 h-4" />
                              {isUploading ? "Uploading..." : "Upload Revised PDF"}
                            </div>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-col items-center justify-center gap-3 text-muted-foreground bg-muted/30 py-6 px-4 text-center rounded-xl border-2 border-border shadow-xs">
                        <Clock className="w-8 h-8 opacity-50" />
                        <div>
                          <span className="font-bold text-sm text-foreground block">Pending Review</span>
                          <span className="text-xs mt-1 block">Waiting for the other party to respond.</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
