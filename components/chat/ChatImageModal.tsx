"use client"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Download, X } from "lucide-react"

interface ChatImageModalProps {
    imageUrl: string | null
    fileName?: string
    isOpen: boolean
    onClose: () => void
}

export function ChatImageModal({ imageUrl, fileName, isOpen, onClose }: ChatImageModalProps) {
    if (!imageUrl) return null

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-4xl p-2 bg-background backdrop-blur-md border-border">
                <DialogTitle className="sr-only">Image Preview</DialogTitle>

                <div className="relative flex flex-col items-center justify-center">
                    <div className="absolute top-2 right-2 flex items-center gap-2 z-10">
                        <a
                            href={imageUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            download={fileName || "image"}
                            className="p-2 rounded-lg bg-card hover:bg-card text-foreground border border-border shadow-xs transition-colors"
                            title="Download Image"
                        >
                            <Download className="w-4 h-4" />
                        </a>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-lg bg-card/80 hover:bg-card text-foreground border border-border shadow-xs transition-colors cursor-pointer"
                            title="Close"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                    <img
                        src={imageUrl}
                        alt={fileName || "Preview"}
                        className="max-h-[80vh] w-auto max-w-full rounded-lg object-contain shadow-md"
                    />
                </div>
            </DialogContent>
        </Dialog >
    )
}