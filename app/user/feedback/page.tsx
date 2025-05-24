'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { MessageSquare, Send, Loader2 } from 'lucide-react';
import { useSession } from 'next-auth/react';

export default function FeedbackPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [feedbackType, setFeedbackType] = useState('general');
    const session = useSession();
    const user = session.data?.user;
    const userName = user?.name || 'Guest';
    const userEmail = user?.email || '';

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const form = e.target as HTMLFormElement;
        const feedback = form.feedback.value;

        const formData = {
            name: userName,
            email: userEmail,
            feedback,
            feedbackType: feedbackType, // This should now work correctly
        };

        // Debug: Log the data being sent
        console.log('Submitting feedback data:', formData);

        try {
            const res = await fetch("/api/user/feedback", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Something went wrong.");
            }

            alert("Feedback submitted successfully!");
            form.reset();
            setFeedbackType("general");
        } catch (error: any) {
            console.error("Feedback submission error:", error);
            alert(error.message || "Failed to submit feedback.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#09090b] flex items-center justify-center p-4 sm:p-6">
            <div className="w-full max-w-4xl flex flex-col md:flex-row gap-6 items-center md:items-start">
                {/* Left Side - Information */}
                <div className="w-full md:w-2/5 flex flex-col justify-center space-y-4 p-4">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">
                            Feedback
                        </h1>
                        <p className="text-lg text-gray-700 dark:text-gray-300 mb-3">
                            Share your thoughts
                        </p>
                        <p className="text-gray-600 dark:text-gray-400">
                            Let us know what you think about our service and how we can improve.
                        </p>
                    </div>
                </div>

                {/* Right Side - Form */}
                <div className="w-full md:w-3/5">
                    <Card className="border border-gray-200 dark:border-gray-800 shadow-sm bg-white dark:bg-[#09090b]">
                        <CardHeader className="pb-4">
                            <div className="flex items-center gap-2">
                                <MessageSquare className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                                <CardTitle className="text-xl text-gray-900 dark:text-gray-100">Submit Feedback</CardTitle>
                            </div>
                            <CardDescription className="text-gray-600 dark:text-gray-400">
                                Tell us what you think
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                {/* Name Input */}
                                <div className="space-y-2">
                                    <label htmlFor="name" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Name
                                    </label>
                                    <Input
                                        id="name"
                                        name="name"
                                        value={userName}
                                        placeholder="Your Name"
                                        required
                                        readOnly
                                        className="bg-gray-50 dark:bg-gray-900 border-gray-300 dark:border-gray-700"
                                    />
                                </div>

                                {/* Email Input */}
                                <div className="space-y-2">
                                    <label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Email
                                    </label>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        value={userEmail}
                                        placeholder="Your Email"
                                        required
                                        readOnly
                                        className="bg-gray-50 dark:bg-gray-900 border-gray-300 dark:border-gray-700"
                                    />
                                </div>

                                {/* Feedback Type */}
                                <div className="space-y-2">
                                    <label htmlFor="feedbackType" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Type
                                    </label>
                                    {/* Hidden input to ensure feedbackType is part of form data */}
                                    <input type="hidden" name="feedbackType" value={feedbackType} />
                                    <div className="grid grid-cols-3 gap-2 text-sm">
                                        {['general', 'suggestion', 'issue', 'bug', 'feature', 'other'].map((type) => (
                                            <button
                                                key={type}
                                                type="button"
                                                onClick={() => setFeedbackType(type)}
                                                className={`py-2 px-3 rounded-md capitalize transition-colors ${feedbackType === type
                                                        ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-700'
                                                        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700'
                                                    }`}
                                            >
                                                {type}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Feedback Textarea */}
                                <div className="space-y-2">
                                    <label htmlFor="feedback" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Message
                                    </label>
                                    <Textarea
                                        id="feedback"
                                        name="feedback"
                                        placeholder="Enter your feedback here..."
                                        required
                                        className="min-h-[120px] border-gray-300 dark:border-gray-700"
                                    />
                                </div>

                                {/* Submit Button */}
                                <Button
                                    type="submit"
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                            Submitting...
                                        </>
                                    ) : (
                                        <>
                                            <Send className="w-4 h-4 mr-2" />
                                            Submit
                                        </>
                                    )}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}