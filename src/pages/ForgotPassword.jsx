import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, KeyRound, Lock, ArrowRight, Loader2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import authApi from '../services/api';

export default function ForgotPassword() {
    const { t } = useLanguage();
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    
    // User data state
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    const handleRequestOtp = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMsg('');
        setLoading(true);
        
        try {
            const res = await authApi.auth.forgotPassword(email);
            if (res.success) {
                setSuccessMsg('A 6-digit OTP has been sent to your email. It will expire in 2 minutes.');
                setStep(2);
            } else {
                setError(res.error || 'Failed to send OTP.');
            }
        } catch (err) {
            setError('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMsg('');
        setLoading(true);
        
        try {
            const res = await authApi.auth.verifyOtp(email, otp);
            if (res.success) {
                setSuccessMsg('OTP verified successfully! Please enter your new password.');
                setStep(3);
            } else {
                setError(res.error || 'Invalid or expired OTP.');
            }
        } catch (err) {
            setError('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (newPassword !== confirmPassword) {
            setError('New passwords do not match!');
            setLoading(false);
            return;
        }

        if (newPassword.length < 8) {
            setError('Password must be at least 8 characters long.');
            setLoading(false);
            return;
        }
        
        try {
            const res = await authApi.auth.resetPassword(email, otp, newPassword);
            if (res.success) {
                navigate('/login', { state: { message: 'Password reset successfully! Please log in with your new password.' } });
            } else {
                setError(res.error || 'Failed to reset password.');
            }
        } catch (err) {
            setError('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-stone-50">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl border border-stone-100">
                <div className="text-center">
                    <div className="w-16 h-16 bg-ochre/10 text-ochre rounded-full flex items-center justify-center mx-auto mb-4">
                        {step === 1 && <Mail className="w-8 h-8" />}
                        {step === 2 && <KeyRound className="w-8 h-8" />}
                        {step === 3 && <Lock className="w-8 h-8" />}
                    </div>
                    <h2 className="text-3xl font-bold text-stone-900">
                        {step === 1 && 'Forgot Password?'}
                        {step === 2 && 'Verify OTP'}
                        {step === 3 && 'Reset Password'}
                    </h2>
                    <p className="mt-2 text-sm text-stone-600">
                        {step === 1 && 'Enter your email address to receive a verification code.'}
                        {step === 2 && 'Enter the 6-digit code sent to your email.'}
                        {step === 3 && 'Securely create your new password.'}
                    </p>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-500 p-4 rounded-xl text-sm font-medium border border-red-100 mt-6 shadow-sm flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                        {error}
                    </div>
                )}
                {successMsg && (
                    <div className="bg-terracotta/10 text-terracotta p-4 rounded-xl text-sm font-medium border border-terracotta/20 mt-6 shadow-sm flex items-center gap-2">
                         <div className="w-1.5 h-1.5 rounded-full bg-terracotta" />
                         {successMsg}
                    </div>
                )}

                {step === 1 && (
                    <form className="mt-8 space-y-6" onSubmit={handleRequestOtp}>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-stone-700">
                                Email Address
                            </label>
                            <div className="mt-1 relative">
                                <Mail className="w-5 h-5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                <input
                                    id="email"
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="appearance-none block w-full pl-10 pr-3 py-3 border border-stone-300 rounded-xl placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-ochre focus:border-transparent transition-all sm:text-sm"
                                    placeholder="Enter your registered email"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading || !email}
                            className="w-full flex items-center justify-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-ochre hover:bg-terracotta focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ochre transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Send OTP'}
                            {!loading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                        </button>
                    </form>
                )}

                {step === 2 && (
                    <form className="mt-8 space-y-6" onSubmit={handleVerifyOtp}>
                        <div>
                            <label htmlFor="otp" className="block text-sm font-medium text-stone-700">
                                6-Digit Verification Code
                            </label>
                            <div className="mt-1">
                                <input
                                    id="otp"
                                    type="text"
                                    required
                                    maxLength="6"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    className="appearance-none block w-full text-center tracking-widest text-2xl py-3 border border-stone-300 rounded-xl placeholder-stone-300 focus:outline-none focus:ring-2 focus:ring-ochre focus:border-transparent transition-all sm:text-sm font-bold text-stone-800"
                                    placeholder="••••••"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading || otp.length < 6}
                            className="w-full flex items-center justify-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-ochre hover:bg-terracotta focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ochre transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Verify Code'}
                            {!loading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                        </button>
                        
                        <div className="text-center mt-4">
                            <button 
                                type="button" 
                                onClick={handleRequestOtp} 
                                className="text-sm font-medium text-ochre hover:text-terracotta hover:underline transition-colors"
                            >
                                Resend OTP (Wait 2 minutes)
                            </button>
                        </div>
                    </form>
                )}

                {step === 3 && (
                    <form className="mt-8 space-y-6" onSubmit={handleResetPassword}>
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="new_pass" className="block text-sm font-medium text-stone-700">
                                    New Password
                                </label>
                                <div className="mt-1 relative">
                                    <Lock className="w-5 h-5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                    <input
                                        id="new_pass"
                                        type="password"
                                        required
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className="appearance-none block w-full pl-10 pr-3 py-3 border border-stone-300 rounded-xl placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-ochre focus:border-transparent transition-all sm:text-sm"
                                        placeholder="Min 8 characters"
                                    />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="confirm_pass" className="block text-sm font-medium text-stone-700">
                                    Confirm New Password
                                </label>
                                <div className="mt-1 relative">
                                    <Lock className="w-5 h-5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                    <input
                                        id="confirm_pass"
                                        type="password"
                                        required
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="appearance-none block w-full pl-10 pr-3 py-3 border border-stone-300 rounded-xl placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-ochre focus:border-transparent transition-all sm:text-sm"
                                        placeholder="Confirm above password"
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading || !newPassword || !confirmPassword}
                            className="w-full flex items-center justify-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-ochre hover:bg-terracotta focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ochre transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Set New Password'}
                        </button>
                    </form>
                )}

                <div className="mt-8 text-center pt-6 border-t border-stone-100">
                    <p className="text-sm text-stone-600">
                        {step === 1 ? 'Remember your password?' : 'Did you recall it?'}
                        <Link to="/login" className="font-medium text-sm text-ochre hover:text-terracotta ml-1 transition-colors hover:underline">
                            Log back in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
