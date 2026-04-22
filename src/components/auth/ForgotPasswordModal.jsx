import { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react';
import { Button } from '../ui/Button';
import clsx from 'clsx';
import { authApi } from '../../services/api';

export function ForgotPasswordModal({ isOpen, onClose }) {
    const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password, 4: Success
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [passwords, setPasswords] = useState({ newPassword: '', confirmPassword: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleSendOtp = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        // Call API to send OTP
        try {
            const res = await authApi.forgotPassword(email);
            if (res.success) {
                setStep(2);
            } else {
                setError(res.error || 'Failed to send OTP.');
            }
        } catch (err) {
            setError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setError('');
        const otpValue = otp.join('');

        if (otpValue.length !== 6) {
            setError('Please enter the complete OTP');
            return;
        }

        setLoading(true);
        // Call API to verify OTP
        try {
            const res = await authApi.verifyOtp(email, otpValue);
            if (res.success) {
                setStep(3);
            } else {
                setError(res.error || 'Invalid or expired OTP.');
            }
        } catch (err) {
            setError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setError('');

        if (passwords.newPassword !== passwords.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (passwords.newPassword.length < 8) {
            setError('Password must be at least 8 characters');
            return;
        }

        setLoading(true);
        // Call API to reset password
        try {
            const res = await authApi.resetPassword(email, otp.join(''), passwords.newPassword);
            if (res.success) {
                setStep(4);
            } else {
                setError(res.error || 'Failed to reset password.');
            }
        } catch (err) {
            setError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleOtpChange = (index, value) => {
        if (value.length > 1) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto-focus next input
        if (value && index < 5) {
            const nextInput = document.getElementById(`otp-${index + 1}`);
            nextInput?.focus();
        }
    };

    const handleOtpKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            const prevInput = document.getElementById(`otp-${index - 1}`);
            prevInput?.focus();
        }
    };

    const handleClose = () => {
        setStep(1);
        setEmail('');
        setOtp(['', '', '', '', '', '']);
        setPasswords({ newPassword: '', confirmPassword: '' });
        setError('');
        onClose();
    };

    return createPortal(
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm"
                    onClick={handleClose}
                />

                {/* Modal */}
                <motion.div
                    initial={{ scale: 0.95, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 20 }}
                    className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
                >
                    <button onClick={handleClose} className="absolute top-4 right-4 text-stone-400 hover:text-stone-600 z-10">
                        <X className="w-5 h-5" />
                    </button>

                    <div className="p-8">
                        {/* Progress Indicator */}
                        {step < 4 && (
                            <div className="flex items-center justify-center gap-2 mb-6">
                                {[1, 2, 3].map(s => (
                                    <div
                                        key={s}
                                        className={clsx(
                                            "w-2 h-2 rounded-full transition-all",
                                            step >= s ? "bg-ochre w-6" : "bg-stone-200"
                                        )}
                                    />
                                ))}
                            </div>
                        )}

                        {/* Step 1: Enter Email */}
                        {step === 1 && (
                            <>
                                <div className="text-center mb-8">
                                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-ochre/10 flex items-center justify-center">
                                        <Mail className="w-8 h-8 text-ochre" />
                                    </div>
                                    <h2 className="text-2xl font-serif text-stone-900 mb-2">Forgot Password?</h2>
                                    <p className="text-stone-500 text-sm">Enter your email and we'll send you a verification code</p>
                                </div>

                                <form onSubmit={handleSendOtp} className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-medium text-stone-700 uppercase mb-1">Email Address</label>
                                        <input
                                            type="email"
                                            required
                                            value={email}
                                            onChange={e => setEmail(e.target.value)}
                                            placeholder="name@example.com"
                                            className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-lg focus:ring-2 focus:ring-ochre/20 focus:border-ochre outline-none transition-all"
                                        />
                                    </div>

                                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                                    <Button type="submit" variant="primary" className="w-full justify-center" disabled={loading}>
                                        {loading ? 'Sending...' : 'Send OTP'} <ArrowRight className="w-4 h-4 ml-2" />
                                    </Button>
                                </form>
                            </>
                        )}

                        {/* Step 2: Enter OTP */}
                        {step === 2 && (
                            <>
                                <div className="text-center mb-8">
                                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
                                        <Lock className="w-8 h-8 text-green-600" />
                                    </div>
                                    <h2 className="text-2xl font-serif text-stone-900 mb-2">Verify OTP</h2>
                                    <p className="text-stone-500 text-sm">Enter the 6-digit code sent to<br /><strong>{email}</strong></p>
                                </div>

                                <form onSubmit={handleVerifyOtp} className="space-y-6">
                                    <div className="flex justify-center gap-2">
                                        {otp.map((digit, index) => (
                                            <input
                                                key={index}
                                                id={`otp-${index}`}
                                                type="text"
                                                inputMode="numeric"
                                                pattern="[0-9]*"
                                                maxLength={1}
                                                value={digit}
                                                onChange={e => handleOtpChange(index, e.target.value)}
                                                onKeyDown={e => handleOtpKeyDown(index, e)}
                                                className="w-12 h-14 text-center text-xl font-bold border-2 border-stone-200 rounded-lg focus:border-ochre focus:ring-2 focus:ring-ochre/20 outline-none transition-all"
                                            />
                                        ))}
                                    </div>

                                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                                    <Button type="submit" variant="primary" className="w-full justify-center" disabled={loading}>
                                        {loading ? 'Verifying...' : 'Verify Code'} <ArrowRight className="w-4 h-4 ml-2" />
                                    </Button>

                                    <button
                                        type="button"
                                        onClick={() => setStep(1)}
                                        className="w-full text-center text-sm text-stone-500 hover:text-stone-700"
                                    >
                                        <ArrowLeft className="w-4 h-4 inline mr-1" /> Back to email
                                    </button>
                                </form>
                            </>
                        )}

                        {/* Step 3: New Password */}
                        {step === 3 && (
                            <>
                                <div className="text-center mb-8">
                                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-ochre/10 flex items-center justify-center">
                                        <Lock className="w-8 h-8 text-ochre" />
                                    </div>
                                    <h2 className="text-2xl font-serif text-stone-900 mb-2">Create New Password</h2>
                                    <p className="text-stone-500 text-sm">Enter a strong password for your account</p>
                                </div>

                                <form onSubmit={handleResetPassword} className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-medium text-stone-700 uppercase mb-1">New Password</label>
                                        <input
                                            type="password"
                                            required
                                            minLength={8}
                                            value={passwords.newPassword}
                                            onChange={e => setPasswords({ ...passwords, newPassword: e.target.value })}
                                            placeholder="••••••••"
                                            className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-lg focus:ring-2 focus:ring-ochre/20 focus:border-ochre outline-none transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-stone-700 uppercase mb-1">Confirm Password</label>
                                        <input
                                            type="password"
                                            required
                                            value={passwords.confirmPassword}
                                            onChange={e => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                                            placeholder="••••••••"
                                            className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-lg focus:ring-2 focus:ring-ochre/20 focus:border-ochre outline-none transition-all"
                                        />
                                    </div>

                                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                                    <Button type="submit" variant="primary" className="w-full justify-center" disabled={loading}>
                                        {loading ? 'Resetting...' : 'Reset Password'} <ArrowRight className="w-4 h-4 ml-2" />
                                    </Button>
                                </form>
                            </>
                        )}

                        {/* Step 4: Success */}
                        {step === 4 && (
                            <div className="text-center py-6">
                                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
                                    <CheckCircle className="w-10 h-10 text-green-600" />
                                </div>
                                <h2 className="text-2xl font-serif text-stone-900 mb-2">Password Reset!</h2>
                                <p className="text-stone-500 text-sm mb-6">Your password has been successfully reset. You can now login with your new password.</p>

                                <Button variant="primary" className="w-full justify-center" onClick={handleClose}>
                                    Back to Login
                                </Button>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>,
        document.body
    );
}
