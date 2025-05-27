"use client";

import { useRouter, useParams } from 'next/navigation'
import React, { useState, useRef, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, CheckCircle, Mail, ArrowLeft, Shield, RefreshCw, Clock } from "lucide-react"

function VerifyCode() {
    const params = useParams();
    const router = useRouter();
    const userId = params?.userId;
    console.log("User ID:", userId);


    const [verifyCode, setVerifyCode] = useState(['', '', '', '', '', '']);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [isResending, setIsResending] = useState(false);
    const [resendCooldown, setResendCooldown] = useState(0);
    const [timeLeft, setTimeLeft] = useState(600);

    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    useEffect(() => {
        if (timeLeft > 0) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [timeLeft]);

    // Resend cooldown effect
    useEffect(() => {
        if (resendCooldown > 0) {
            const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [resendCooldown]);


    const handleInputChange = (index: number, value: string) => {
        // Only allow single digit
        if (value.length > 1) return;

        // Only allow numbers
        if (value && !/^\d$/.test(value)) return;

        const newCode = [...verifyCode];
        newCode[index] = value;
        setVerifyCode(newCode);
        setError('');

        // Auto-focus next input
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }

        // Auto-submit when all fields are filled
        if (newCode.every(digit => digit !== '') && !isLoading) {
            handleVerify(newCode.join(''));
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
        // Handle backspace
        if (e.key === 'Backspace' && !verifyCode[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }

        // Handle paste
        if (e.key === 'Enter' && verifyCode.every(digit => digit !== '')) {
            handleVerify(verifyCode.join(''));
        }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const paste = e.clipboardData.getData('text');
        const digits = paste.replace(/\D/g, '').slice(0, 6).split('');

        if (digits.length === 6) {
            setVerifyCode(digits);
            handleVerify(digits.join(''));
        }
    };

    const handleVerify = async (code?: string) => {
        const codeToVerify = code || verifyCode.join('');

        if (codeToVerify.length !== 6) {
            setError('Please enter all 6 digits');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            const response = await fetch("/api/auth/verify-code", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ userId: userId, code: codeToVerify })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Verification failed');
            }

            setSuccess(true);
            router.push('/auth/login');

        } catch (error) {
            console.error('Verification error:', error);
            setError(error instanceof Error ? error.message : 'Verification failed. Please try again.');
            // Clear the code on error
            setVerifyCode(['', '', '', '', '', '']);
            inputRefs.current[0]?.focus();
        } finally {
            setIsLoading(false);
        }
    };

    const handleResendCode = async () => {
        if (resendCooldown > 0) return;

        setIsResending(true);
        setError('');

        try {
            const response = await fetch("/api/auth/resend-code", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ userId: userId })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to resend code');
            }

            setResendCooldown(60); // 60 seconds cooldown
            setTimeLeft(600); // Reset timer to 10 minutes
            setVerifyCode(['', '', '', '', '', '']);
            inputRefs.current[0]?.focus();

        } catch (error) {
            console.error('Resend error:', error);
            setError(error instanceof Error ? error.message : 'Failed to resend code. Please try again.');
        } finally {
            setIsResending(false);
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    if (success) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
                <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 text-center">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full mb-6 shadow-lg">
                        <CheckCircle className="h-10 w-10 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-3">Email Verified! ✨</h1>
                    <p className="text-gray-600 mb-6">Your account has been successfully verified. Redirecting you to login...</p>
                    <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
            <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-emerald-500 to-teal-600 px-8 py-6 text-white">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-white/80 hover:text-white transition-colors duration-200 mb-4"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back
                    </button>
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                            <Mail className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold">Verify Your Email</h1>
                            <p className="text-emerald-100">Enter the 6-digit code we sent you</p>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-8">
                    {/* Timer */}
                    <div className="flex items-center justify-center gap-2 mb-6 p-3 bg-gray-50 rounded-xl">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-600">
                            Code expires in: <span className="font-mono font-semibold text-orange-600">{formatTime(timeLeft)}</span>
                        </span>
                    </div>

                    {/* Error Alert */}
                    {error && (
                        <Alert variant="destructive" className="mb-6 border-red-200 bg-red-50 animate-in fade-in-50 duration-300 rounded-xl">
                            <AlertCircle className="h-5 w-5 text-red-600" />
                            <AlertDescription className="text-red-800 ml-2 font-medium">
                                {error}
                            </AlertDescription>
                        </Alert>
                    )}

                    {/* Instructions */}
                    <div className="text-center mb-8">
                        <p className="text-gray-600 leading-relaxed">
                            We've sent a verification code to your email address.
                            Please enter it below to complete your registration.
                        </p>
                    </div>

                    {/* Verification Code Inputs */}
                    <div className="flex justify-center gap-3 mb-8" onPaste={handlePaste}>
                        {verifyCode.map((digit, index) => (
                            <input
                                key={index}
                                ref={(el) => { inputRefs.current[index] = el }}
                                type="text"
                                value={digit}
                                onChange={(e) => handleInputChange(index, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                className="w-14 h-14 text-center text-2xl font-bold border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-emerald-500 focus:outline-none transition-all duration-200 disabled:bg-gray-50 disabled:cursor-not-allowed"
                                maxLength={1}
                                disabled={isLoading}
                                autoComplete="off"
                            />
                        ))}
                    </div>

                    {/* Manual Verify Button */}
                    <Button
                        onClick={() => handleVerify()}
                        className="w-full h-14 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-lg rounded-xl shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed mb-6"
                        disabled={isLoading || verifyCode.some(digit => digit === '')}
                    >
                        {isLoading ? (
                            <div className="flex items-center gap-3">
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Verifying...
                            </div>
                        ) : (
                            <div className="flex items-center gap-3">
                                <Shield className="w-5 h-5" />
                                Verify Email
                            </div>
                        )}
                    </Button>

                    {/* Resend Code */}
                    <div className="text-center">
                        <p className="text-gray-600 mb-3">Didn't receive the code?</p>
                        <Button
                            onClick={handleResendCode}
                            variant="outline"
                            className="border-2 border-gray-200 hover:border-emerald-300 hover:bg-emerald-50 text-gray-700 font-semibold px-6 py-3 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={isResending || resendCooldown > 0 || timeLeft === 0}
                        >
                            {isResending ? (
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                                    Sending...
                                </div>
                            ) : resendCooldown > 0 ? (
                                <div className="flex items-center gap-2">
                                    <RefreshCw className="w-4 h-4" />
                                    Resend in {resendCooldown}s
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <RefreshCw className="w-4 h-4" />
                                    Resend Code
                                </div>
                            )}
                        </Button>
                    </div>

                    {/* Help Text */}
                    <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                        <div className="flex gap-3">
                            <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <span className="text-white text-xs font-bold">?</span>
                            </div>
                            <div className="text-sm text-blue-800">
                                <p className="font-semibold mb-1">Having trouble?</p>
                                <ul className="space-y-1 text-blue-700">
                                    <li>• Check your spam/junk folder</li>
                                    <li>• Make sure you entered the correct email</li>
                                    <li>• The code expires after 10 minutes</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default VerifyCode;