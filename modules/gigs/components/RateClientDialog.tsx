"use client"

import { useState } from "react"
import { Star } from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
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
import { Button } from "@/components/ui/button"

interface RateClientDialogProps {
    gigId: string
}

export function RateClientDialog({ gigId }: RateClientDialogProps) {
    const router = useRouter()
    const [rating, setRating] = useState(0)
    const [comment, setComment] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isOpen, setIsOpen] = useState(false)

    const handleSubmit = async (e: React.MouseEvent) => {
        e.stopPropagation()
        setIsSubmitting(true)

        try {
            const res = await fetch("/api/reviews/submit-freelancer-review", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ gigId, rating, comment }),
            })

            const data = await res.json()

            if (!res.ok) throw new Error(data.error || "Failed to submit review")

            toast.success("Review published successfully!")
            setIsOpen(false)
            router.refresh()
        } catch (err: any) {
            toast.error(err.message)
        } finally {
            setIsSubmitting(false)
            setRating(0)
            setComment("")
        }
    }

    return (
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
            <AlertDialogTrigger asChild>
                <Button
                    variant="outline"
                    onClick={(e) => e.stopPropagation()}
                    className="w-full h-10 text-sm font-semibold px-5 rounded-xl border-border text-primary hover:bg-primary hover:text-primary-foreground"
                >
                    <Star className="mr-2 h-4 w-4" /> Rate Client
                </Button>
            </AlertDialogTrigger>

            <AlertDialogContent onClick={(e) => e.stopPropagation()}>
                <AlertDialogHeader>
                    <AlertDialogTitle>Rate the Client</AlertDialogTitle>
                    <AlertDialogDescription>
                        The project is completed! Please rate your experience working with this client. Once submitted, both reviews will become public!
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <div className="flex flex-col gap-4 py-4">
                    <div>
                        <p className="text-sm font-semibold mb-2">Rating</p>
                        <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        setRating(star)
                                    }}
                                    className="focus:outline-none"
                                >
                                    <Star
                                        className={`size-6 ${star <= rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground hover:text-yellow-400"
                                            } transition-colors`}
                                    />
                                </button>
                            ))}
                        </div>
                    </div>
                    <div>
                        <p className="text-sm font-semibold mb-2">Written Review</p>
                        <textarea
                            onClick={(e) => e.stopPropagation()}
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Describe what it was like working with this client..."
                            className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                    </div>
                </div>

                <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => { setRating(0); setComment(""); }}>
                        Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleSubmit}
                        disabled={rating === 0 || comment.trim() === "" || isSubmitting}
                        className="bg-primary text-primary-foreground hover:bg-primary disabled:opacity-50"
                    >
                        {isSubmitting ? "Submitting..." : "Publish Reviews"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
