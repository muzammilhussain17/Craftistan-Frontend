import { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, User } from 'lucide-react';
import { Button } from '../ui/Button';
import { useAuth } from '../../context/AuthContext';
import { ForgotPasswordModal } from './ForgotPasswordModal';
import clsx from 'clsx';
import { useNavigate } from 'react-router-dom';

export function LoginModal({ isOpen, onClose }) {
    const [isLogin, setIsLogin] = useState(true);
    const { login, signup, googleLogin } = useAuth();
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
    const navigate = useNavigate();

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        let result;
        if (isLogin) {
            result = await login(formData.email, formData.password);
            if (result.success) {
                setLoading(false);
                onClose();
            } else {
                setLoading(false);
                setError(result.error || 'Login failed. Please check your credentials.');
            }
        } else {
            result = await signup(formData);
            setLoading(false);
            if (result.success) {
                setSuccess(result.message || 'Account created! Please login.');
                setFormData({ name: '', email: '', password: '' });
                // Switch to login tab after successful signup
                setTimeout(() => setIsLogin(true), 2000);
            } else {
                setError(result.error || 'Registration failed. Please try again.');
            }
        }
    };

    const handleGoogle = () => {
        if (!window.google) {
            setError('Google Sign-In failed to load. Please refresh the page.');
            return;
        }
        setError('');
        window.google.accounts.id.initialize({
            client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
            callback: async (response) => {
                setLoading(true);
                const result = await googleLogin(response.credential);
                setLoading(false);
                if (result.success) {
                    onClose();
                } else {
                    setError(result.error || 'Google sign-in failed. Please try again.');
                }
            },
        });
        window.google.accounts.id.prompt((notification) => {
            if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
                setError('Google Sign-In was dismissed. Please try again or use email/password.');
            }
        });
    };

    const modalContent = createPortal(
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm"
                    onClick={onClose}
                />

                {/* Modal */}
                <motion.div
                    initial={{ scale: 0.95, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 20 }}
                    className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
                >
                    <button onClick={onClose} className="absolute top-4 right-4 text-stone-400 hover:text-stone-600">
                        <X className="w-5 h-5" />
                    </button>

                    <div className="p-8">
                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-serif text-stone-900 mb-2">
                                {isLogin ? 'Welcome Back' : 'Join the Community'}
                            </h2>
                            <p className="text-stone-500 text-sm">
                                {isLogin ? 'Enter your details to access your account' : 'Start your journey with us properly'}
                            </p>
                        </div>

                        {/* Tabs */}
                        <div className="flex p-1 bg-stone-100 rounded-lg mb-6">
                            <button
                                onClick={() => setIsLogin(true)}
                                className={clsx("flex-1 py-2 text-sm font-medium rounded-md transition-all", isLogin ? "bg-white shadow-sm text-stone-900" : "text-stone-500 hover:text-stone-700")}
                            >Login</button>
                            <button
                                onClick={() => setIsLogin(false)}
                                className={clsx("flex-1 py-2 text-sm font-medium rounded-md transition-all", !isLogin ? "bg-white shadow-sm text-stone-900" : "text-stone-500 hover:text-stone-700")}
                            >Sign Up</button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {!isLogin && (
                                <div>
                                    <label className="block text-xs font-medium text-stone-700 uppercase mb-1">Full Name</label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                                        <input
                                            type="text"
                                            required
                                            className="w-full pl-10 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-lg focus:ring-2 focus:ring-stone-200 focus:border-stone-400 outline-none transition-all"
                                            placeholder="YOUR NAME"
                                            value={formData.name}
                                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        />
                                    </div>
                                </div>
                            )}

                            <div>
                                <label className="block text-xs font-medium text-stone-700 uppercase mb-1">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                                    <input
                                        type="email"
                                        required
                                        className="w-full pl-10 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-lg focus:ring-2 focus:ring-stone-200 focus:border-stone-400 outline-none transition-all"
                                        placeholder="name@example.com"
                                        value={formData.email}
                                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-stone-700 uppercase mb-1">Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                                    <input
                                        type="password"
                                        required
                                        className="w-full pl-10 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-lg focus:ring-2 focus:ring-stone-200 focus:border-stone-400 outline-none transition-all"
                                        placeholder="••••••••"
                                        value={formData.password}
                                        onChange={e => setFormData({ ...formData, password: e.target.value })}
                                    />
                                </div>
                            </div>

                            {error && <p className="text-red-500 text-xs text-center bg-red-50 p-2 rounded">{error}</p>}
                            {success && <p className="text-green-600 text-xs text-center bg-green-50 p-2 rounded">{success}</p>}

                            {isLogin && (
                                <button
                                    type="button"
                                    onClick={() => setForgotPasswordOpen(true)}
                                    className="text-xs text-ochre hover:underline text-center w-full"
                                >
                                    Forgot your password?
                                </button>
                            )}

                            <Button variant="primary" className="w-full justify-center" disabled={loading}>
                                {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
                            </Button>
                        </form>

                        <div className="mt-6">
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-stone-200"></div></div>
                                <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-stone-400">Or continue with</span></div>
                            </div>

                            <button
                                onClick={handleGoogle}
                                disabled={loading}
                                className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2 border border-stone-200 rounded-lg hover:bg-stone-50 transition-colors text-stone-700 font-medium"
                            >
                                <svg className="w-5 h-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" /></svg>
                                Google
                            </button>
                        </div>
                    </div>

                </motion.div>
            </div>
        </AnimatePresence>,
        document.body
    );

    return (
        <>
            {modalContent}
            <ForgotPasswordModal
                isOpen={forgotPasswordOpen}
                onClose={() => setForgotPasswordOpen(false)}
            />
        </>
    );
}
