"use client"

import React from "react"
import { X, FileText, Loader2 } from "lucide-react"

interface ChatAttachmentPreviewProps {
    file: File | null
    previewUrl: string | null
    isUploading: boolean
    uploadProgress?: number
    onRemove: () => void
}

export function ChatAttachmentPreview({
    file,
    previewUrl,
    isUploading,
    onRemove,
}: ChatAttachmentPreviewProps) {
    if (!file) return null

    const isImage = file.type.startsWith("image/")
    const formattedSize = (file.size / (1024 * 1024)).toFixed(2) + " MB"

    return (
        <div className="p-2.5 bg-muted/50 rounded-xl flex items-center justify-between gap-3 animate-in fade-in slide-in-from-bottom-2 duration-200">
            <div className="flex items-center gap-3 min-w-0">
                {isImage && previewUrl ? (
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-border shrink-0 bg-background">
                        <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                ) : (
                    <div className="w-12 h-12 rounded-lg bg-red-500/10 text-red-600 border border-red-500/20 flex flex-col items-center justify-center shrink-0">
                        <FileText className="w-5 h-5" />
                        <span className="text-[9px] font-bold uppercase">PDF</span>
                    </div>
                )}

                <div className="truncate text-xs space-y-0.5">
                    <p className="font-semibold text-foreground truncate max-w-[220px] sm:max-w-xs">{file.name}</p>
                    <p className="text-muted-foreground text-[11px]">{formattedSize}</p>
                </div>
            </div>

            <div className="flex items-center gap-2">
                {isUploading ? (
                    <div className="flex items-center gap-1.5 text-xs text-primary font-medium">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span className="hidden sm:inline">Uploading...</span>
                    </div>
                ) : (
                    <button
                        type="button"
                        onClick={onRemove}
                        className="p-1 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                        title="Remove attachment"
                    >
                        <X className="w-4 h-4" />
                    </button>
                )}
            </div>
        </div>
    )
}
