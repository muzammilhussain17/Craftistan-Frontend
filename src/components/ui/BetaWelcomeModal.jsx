import { useState, useEffect } from 'react';
import { X, Sparkles, ShieldCheck, HeartHandshake } from 'lucide-react';
import { Button } from './Button';
import { Link, useLocation } from 'react-router-dom';

export function BetaWelcomeModal() {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();

    useEffect(() => {
        // Show modal when on the main landing page, without local storage dependency, 
        // ensuring it shows on refresh
        if (location.pathname === '/') {
            const timer = setTimeout(() => {
                setIsOpen(false);
            }, 1500);
            return () => clearTimeout(timer);
        }
    }, [location.pathname]);

    const handleClose = () => {
        setIsOpen(false);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            {/* Backdrop with elegant blur */}
            <div 
                className="fixed inset-0 bg-stone-900/40 backdrop-blur-md transition-opacity duration-500"
                onClick={handleClose}
                aria-hidden="true"
            />

            {/* Modal Box */}
            <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden w-full max-w-2xl animate-scale-up border border-stone-200">
                
                {/* Close button (Floating) */}
                <button 
                    onClick={handleClose}
                    className="absolute top-4 right-4 z-10 p-2 bg-white/80 backdrop-blur-sm rounded-full text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="flex flex-col md:flex-row">
                    {/* Left Decorative Section - Image & Gradient */}
                    <div className="md:w-2/5 relative bg-stone-900 flex items-center justify-center overflow-hidden min-h-[160px] md:min-h-full">
                        <img 
                            src="https://images.pexels.com/photos/2162938/pexels-photo-2162938.jpeg?auto=compress&cs=tinysrgb&w=600"
                            alt="Craftsmanship"
                            className="absolute inset-0 w-full h-full object-cover opacity-60"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-stone-900/60 to-transparent" />
                        
                        <div className="relative z-10 text-center px-6 py-8">
                            <Sparkles className="w-10 h-10 text-ochre mx-auto mb-3 animate-pulse" />
                            <h3 className="text-xl font-serif text-white tracking-wide" style={{ fontFamily: "'Noto Nastaliq Urdu', serif" }} dir="rtl">
                                خوش آمدید
                            </h3>
                        </div>
                    </div>

                    {/* Right Content Section */}
                    <div className="md:w-3/5 p-8 md:p-10 flex flex-col justify-center bg-stone-50/50">
                        {/* Eyebrow Label */}
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-ochre/10 text-ochre-dark text-xs font-semibold uppercase tracking-wider w-fit mb-4">
                            <Sparkles className="w-3.5 h-3.5" /> Phase 1 Beta
                        </div>

                        {/* Heading */}
                        <h2 id="modal-title" className="text-2xl md:text-3xl font-serif text-stone-900 leading-tight mb-4">
                            Help Us Build the Future of Craftistan
                        </h2>

                        {/* Welcome Text */}
                        <p className="text-sm md:text-base text-stone-600 leading-relaxed mb-6 font-medium">
                            Welcome to our Beta experience! We invite you to explore the platform, go through the processes, and share your most honest feedback. Please tell us about any mistakes, flaws, or glitches you encounter, and let us know what you think we should add, remove, or update to perfect the system.
                        </p>

                        {/* Security Notice Box */}
                        <div className="bg-stone-100 rounded-xl p-4 mb-8 border border-stone-200/60 shadow-inner">
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-white rounded-lg shadow-sm shrink-0">
                                    <ShieldCheck className="w-5 h-5 text-terracotta" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-stone-900 mb-1">Note on Orders & Payments</h4>
                                    <p className="text-xs md:text-sm text-stone-600 leading-relaxed">
                                        As this is a testing phase, order placement and online payments are currently disabled. However, you can still apply as an Artisan today! Thank you for being part of our journey.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3">
                            <Button 
                                onClick={handleClose} 
                                variant="primary" 
                                className="flex-1 justify-center py-3"
                            >
                                <HeartHandshake className="w-4 h-4 mr-2" /> Start Exploring
                            </Button>
                            <Link to="/creators" className="flex-1" onClick={handleClose}>
                                <Button 
                                    variant="outline" 
                                    className="w-full justify-center py-3 bg-white hover:bg-stone-100 transition-colors"
                                >
                                    Join as Artisan
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
