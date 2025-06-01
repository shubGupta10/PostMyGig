"use client"

import { useSearchParams } from 'next/navigation'
import React, { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'

function ResetPassword() {
    const searchParams = useSearchParams();
    const token = searchParams.get("token")
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState(''); // 'success' or 'error'
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Check if token exists on component mount
    useEffect(() => {
        if (!token) {
            setMessage('Invalid or missing reset token. Please request a new password reset.');
            setMessageType('error');
        }
    }, [token]);

    const validatePassword = (password: string) => {
        if (password.length < 6) {
            return 'Password must be at least 6 characters long';
        }
        return null;
    };

    const handleResetPassword = async () => {
        if (!token) {
            setMessage('Invalid reset token');
            setMessageType('error');
            return;
        }

        if (!password || !confirmPassword) {
            setMessage('Please fill in all fields');
            setMessageType('error');
            return;
        }

        const passwordError = validatePassword(password);
        if (passwordError) {
            setMessage(passwordError);
            setMessageType('error');
            return;
        }

        if (password !== confirmPassword) {
            setMessage('Passwords do not match');
            setMessageType('error');
            return;
        }

        setIsLoading(true);
        setMessage('');

        try {
            const response = await fetch("/api/auth/forgot-password/verify-user-and-change-password", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({token: token, password: password})
            });
            
            const data = await response.json();
            
            if (response.ok) {
                setMessage('Password reset successfully! You can now login with your new password.');
                setMessageType('success');
                setPassword('');
                setConfirmPassword('');
                window.location.href = "/auth/login"
                
            } else {
                setMessage(data.message || 'Failed to reset password. Please try again.');
                setMessageType('error');
            }
        } catch (error) {
            console.error("Failed to reset password:", error);
            setMessage('Network error. Please check your connection and try again.');
            setMessageType('error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>): void => {
        if (e.key === 'Enter') {
            handleResetPassword();
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
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                        <h1 className="text-2xl font-bold text-foreground mb-2">
                            Create New Password
                        </h1>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                            Enter your new password below. Make sure it's secure and easy to remember.
                        </p>
                    </div>

                    {/* Form */}
                    <div className="space-y-6">
                        {/* New Password Field */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
                                New Password
                            </label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter your new password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    className="w-full px-4 py-3 pr-12 border border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-ring transition-colors bg-input text-foreground"
                                    disabled={isLoading}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                >
                                    {showPassword ? (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                                        </svg>
                                    ) : (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                                Password must be at least 6 characters long
                            </p>
                        </div>

                        {/* Confirm Password Field */}
                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-foreground mb-2">
                                Confirm New Password
                            </label>
                            <div className="relative">
                                <Input
                                    id="confirmPassword"
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="Confirm your new password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    className="w-full px-4 py-3 pr-12 border border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-ring transition-colors bg-input text-foreground"
                                    disabled={isLoading}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                >
                                    {showConfirmPassword ? (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                                        </svg>
                                    ) : (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
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
                            onClick={handleResetPassword}
                            disabled={isLoading || !password || !confirmPassword || !token}
                            className="w-full bg-primary hover:bg-primary/90 disabled:bg-muted disabled:cursor-not-allowed text-primary-foreground font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center"
                        >
                            {isLoading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-primary-foreground" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Updating Password...
                                </>
                            ) : (
                                'Reset Password'
                            )}
                        </button>

                    </div>
                </div>

                {/* Footer */}
                <div className="text-center mt-6">
                    <p className="text-muted-foreground text-xs">
                        Make sure to use a strong password that you haven't used before.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default ResetPassword;