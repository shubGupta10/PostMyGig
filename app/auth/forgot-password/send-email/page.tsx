"use client"

import { Input } from '@/components/ui/input';
import React, { useState } from 'react';
import { Clock, ShieldAlert, AlertCircle, CheckCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface EmailCooldownInfo {
    isActive: boolean;
    remainingTime: number;
    email: string;
}

function SendEmail() {
    const [registeredEmail, setRegisteredEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState(''); 
    const [emailCooldown, setEmailCooldown] = useState<EmailCooldownInfo>({
        isActive: false,
        remainingTime: 0,
        email: ""
    });

    const handleEmailCooldown = (email: string, cooldownSeconds: number = 90) => {
        setEmailCooldown({
            isActive: true,
            remainingTime: cooldownSeconds,
            email: email
        });

        // Start countdown
        const interval = setInterval(() => {
            setEmailCooldown(prev => {
                if (prev.remainingTime <= 1) {
                    clearInterval(interval);
                    setMessage('Email cooldown expired. You can now request another reset email.');
                    setMessageType('success');
                    return { isActive: false, remainingTime: 0, email: "" };
                }
                return { ...prev, remainingTime: prev.remainingTime - 1 };
            });
        }, 1000);

        const cooldownMessage = `Please wait ${Math.floor(cooldownSeconds / 60)}:${(cooldownSeconds % 60).toString().padStart(2, '0')} before requesting another password reset email.`;
        setMessage(cooldownMessage);
        setMessageType('warning');
    };

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

        if (emailCooldown.isActive && emailCooldown.email === registeredEmail) {
            const minutes = Math.floor(emailCooldown.remainingTime / 60);
            const seconds = emailCooldown.remainingTime % 60;
            const timeString = `${minutes}:${seconds.toString().padStart(2, '0')}`;
            const message = `Email cooldown active. Please wait ${timeString} before trying again.`;
            setMessage(message);
            setMessageType('warning');
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
                // Start cooldown after successful email send
                handleEmailCooldown(registeredEmail);
                setRegisteredEmail('');
            } else {
                if (response.status === 429) {
                    // Check if it's email cooldown
                    if (data.message?.toLowerCase().includes("cooldown") || 
                        data.message?.toLowerCase().includes("wait")) {
                        handleEmailCooldown(registeredEmail);
                        setMessage(data.message);
                        setMessageType('warning');
                    } else {
                        setMessage(data.message || 'Too many requests. Please try again later.');
                        setMessageType('error');
                    }
                } else {
                    setMessage(data.message || 'Failed to send email. Please try again.');
                    setMessageType('error');
                }
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

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setRegisteredEmail(value);
        
        // Clear message when email changes
        if (message) {
            setMessage('');
            setMessageType('');
        }
        
        // Clear email cooldown if email changes
        if (emailCooldown.isActive && emailCooldown.email !== value) {
            setEmailCooldown({ isActive: false, remainingTime: 0, email: "" });
        }
    };

    const EmailCooldownBanner = () => {
        if (!emailCooldown.isActive) return null;

        const minutes = Math.floor(emailCooldown.remainingTime / 60);
        const seconds = emailCooldown.remainingTime % 60;
        const timeString = `${minutes}:${seconds.toString().padStart(2, '0')}`;

        return (
            <div className="mb-6 bg-orange-50 border border-orange-200 rounded-xl p-4 dark:bg-orange-950/20 dark:border-orange-800/50">
                <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-orange-600 dark:text-orange-400 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                        <h4 className="font-semibold text-orange-800 dark:text-orange-200 mb-1">Email Cooldown Active</h4>
                        <p className="text-orange-700 dark:text-orange-300 text-sm leading-relaxed">
                            To prevent spam, there's a cooldown period between password reset email requests for the same email address.
                        </p>
                        <div className="mt-2 text-xs text-orange-600 dark:text-orange-400">
                            <strong>Email:</strong> {emailCooldown.email}
                        </div>
                        <div className="bg-orange-100 dark:bg-orange-900/30 border border-orange-200 dark:border-orange-800 rounded-lg p-3 mt-3 text-xs">
                            <div className="space-y-1">
                                <div className="flex justify-between">
                                    <span className="text-orange-800 dark:text-orange-200 font-medium">Status:</span>
                                    <span className="text-orange-800 dark:text-orange-200">Email Cooldown Active</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-orange-800 dark:text-orange-200 font-medium">Time Remaining:</span>
                                    <span className="text-orange-800 dark:text-orange-200 font-mono text-sm">{timeString}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-orange-800 dark:text-orange-200 font-medium">Next Attempt:</span>
                                    <span className="text-orange-800 dark:text-orange-200">
                                        {new Date(Date.now() + emailCooldown.remainingTime * 1000).toLocaleTimeString()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const isFormDisabled = isLoading || (emailCooldown.isActive && emailCooldown.email === registeredEmail);

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="bg-card rounded-2xl shadow-xl p-8 border border-border">
                    {/* Email Cooldown Banner */}
                    <EmailCooldownBanner />

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
                                onChange={handleEmailChange}
                                onKeyPress={handleKeyPress}
                                className={`w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-ring transition-colors bg-input text-foreground ${
                                    isFormDisabled ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                                disabled={isFormDisabled}
                            />
                            {emailCooldown.isActive && emailCooldown.email === registeredEmail && (
                                <p className="text-xs text-orange-600 dark:text-orange-400 mt-1 flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    Email cooldown active - try again in {Math.floor(emailCooldown.remainingTime / 60)}:{(emailCooldown.remainingTime % 60).toString().padStart(2, '0')}
                                </p>
                            )}
                        </div>

                        {/* Message Display */}
                        {message && (
                            <Alert
                                variant={messageType === 'error' ? 'destructive' : 'default'}
                                className={`${
                                    messageType === 'success' 
                                        ? 'bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-800/50'
                                        : messageType === 'warning'
                                        ? 'bg-orange-50 border-orange-200 dark:bg-orange-950/20 dark:border-orange-800/50'
                                        : 'bg-destructive/10 border-destructive'
                                } animate-in fade-in-50 duration-300 rounded-xl`}
                            >
                                {messageType === 'success' ? (
                                    <CheckCircle className={`h-5 w-5 ${
                                        messageType === 'success' 
                                            ? 'text-green-600 dark:text-green-400'
                                            : messageType === 'warning'
                                            ? 'text-orange-600 dark:text-orange-400'
                                            : 'text-destructive'
                                    }`} />
                                ) : messageType === 'warning' ? (
                                    <Clock className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                                ) : (
                                    <AlertCircle className="h-5 w-5 text-destructive" />
                                )}
                                <AlertDescription className={`ml-2 font-medium ${
                                    messageType === 'success' 
                                        ? 'text-green-800 dark:text-green-200'
                                        : messageType === 'warning'
                                        ? 'text-orange-700 dark:text-orange-300'
                                        : 'text-destructive'
                                }`}>
                                    {message}
                                </AlertDescription>
                            </Alert>
                        )}

                        {/* Submit Button */}
                        <button
                            onClick={handleSubmitEmail}
                            disabled={isFormDisabled || !registeredEmail}
                            className={`w-full font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center ${
                                isFormDisabled || !registeredEmail
                                    ? 'bg-muted cursor-not-allowed text-muted-foreground'
                                    : 'bg-primary hover:bg-primary/90 text-primary-foreground'
                            }`}
                        >
                            {isLoading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-primary-foreground" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Sending...
                                </>
                            ) : emailCooldown.isActive && emailCooldown.email === registeredEmail ? (
                                <div className="flex items-center gap-2">
                                    <Clock className="w-5 h-5" />
                                    Email Cooldown Active
                                </div>
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
                        Didn't receive an email? Check your spam folder or try again after the cooldown period.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default SendEmail;