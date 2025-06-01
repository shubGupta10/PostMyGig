"use client"

import { Input } from '@/components/ui/input';
import React, { useState } from 'react';

function SendEmail() {
    const [registeredEmail, setRegisteredEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState(''); 

    const handleSubmitEmail = async () => {
        if (!registeredEmail) {
            setMessage('Please enter your email address');
            setMessageType('error');
            return;
        }

        if (!isValidEmail(registeredEmail)) {
            setMessage('Please enter a valid email address');
            setMessageType('error');
            return;
        }

        setIsLoading(true);
        setMessage('');
        
        try {
            const response = await fetch("/api/auth/forgot-password/send-registered-email", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({email: registeredEmail})
            });
            
            const data = await response.json();
            
            if (response.ok) {
                setMessage('Password reset email sent successfully! Check your inbox.');
                setMessageType('success');
                setRegisteredEmail('');
            } else {
                setMessage(data.message || 'Failed to send email. Please try again.');
                setMessageType('error');
            }
        } catch (error) {
            console.error("Failed to send email:", error);
            setMessage('Network error. Please check your connection and try again.');
            setMessageType('error');
        } finally {
            setIsLoading(false);
        }
    };

    const isValidEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>): void => {
        if (e.key === 'Enter') {
            handleSubmitEmail();
        }
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="bg-card rounded-2xl shadow-xl p-8 border border-border">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="mx-auto w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-4">
                            <svg className="w-8 h-8 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <h1 className="text-2xl font-bold text-foreground mb-2">
                            Reset Your Password
                        </h1>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                            Enter your registered email address and we'll send you a link to reset your password.
                        </p>
                    </div>

                    {/* Form */}
                    <div className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                                Email Address
                            </label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="Enter your registered email"
                                value={registeredEmail}
                                onChange={(e) => setRegisteredEmail(e.target.value)}
                                onKeyPress={handleKeyPress}
                                className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-ring transition-colors bg-input text-foreground"
                                disabled={isLoading}
                            />
                        </div>

                        {/* Message Display */}
                        {message && (
                            <div className={`p-4 rounded-lg border ${
                                messageType === 'success' 
                                    ? 'bg-secondary border-secondary text-secondary-foreground'
                                    : 'bg-destructive/10 border-destructive text-destructive'
                            }`}>
                                <div className="flex items-center">
                                    {messageType === 'success' ? (
                                        <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                    ) : (
                                        <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                    )}
                                    <span className="text-sm font-medium">{message}</span>
                                </div>
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            onClick={handleSubmitEmail}
                            disabled={isLoading || !registeredEmail}
                            className="w-full bg-primary hover:bg-primary/90 disabled:bg-muted disabled:cursor-not-allowed text-primary-foreground font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center"
                        >
                            {isLoading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-primary-foreground" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Sending...
                                </>
                            ) : (
                                'Send Reset Email'
                            )}
                        </button>

                        {/* Back to Login Link */}
                        <div className="text-center">
                            <button 
                                onClick={() => window.history.back()}
                                className="text-primary hover:text-primary/80 text-sm font-medium transition-colors"
                            >
                                ← Back to Login
                            </button>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="text-center mt-6">
                    <p className="text-muted-foreground text-xs">
                        Didn't receive an email? Check your spam folder or try again.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default SendEmail;