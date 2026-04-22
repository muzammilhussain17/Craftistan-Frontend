import { useState, useEffect } from 'react';
import { Search, ShoppingBag, Heart, User, Menu, Globe, ChevronDown, Settings } from 'lucide-react';
import { Button } from '../ui/Button';
import clsx from 'clsx';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { LoginModal } from '../auth/LoginModal';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { NotificationDropdown } from './NotificationDropdown';

export function Header() {
    const [isScrolled, setIsScrolled] = useState(false);
    const { currentLang, setLanguage, languages, t } = useLanguage();
    const { user, logout } = useAuth();
    const { cartCount, setIsCartOpen } = useCart();
    const { wishlistCount } = useWishlist();
    const [langMenuOpen, setLangMenuOpen] = useState(false);
    const [loginOpen, setLoginOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const [shopMenuOpen, setShopMenuOpen] = useState(false);

    // White text only on the home page hero (transparent header over dark image)
    // All other pages have light backgrounds — keep dark text there
    const useLightText = location.pathname === '/' && !isScrolled;

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
            setSearchQuery('');
            setMobileMenuOpen(false);
        }
    };

    // Main navigation links - use translation keys
    const mainLinks = [
        { key: 'about', href: '/about' },
        { key: 'contact', href: '/contact' },
        { key: 'helpCenter', href: '/help' },
    ];

    // Shop category links for dropdown - use translation keys
    const shopCategories = [
        { key: 'allProducts', href: '/shop' },
        { key: 'newArrivals', href: '/shop?category=new-arrivals' },
        { key: 'homeDecor', href: '/shop?category=home-decor' },
        { key: 'textiles', href: '/shop?category=textiles' },
        { key: 'jewelry', href: '/shop?category=jewelry' },
    ];

    // Combined for mobile menu
    const mobileNavLinks = [
        { key: 'shop', href: '/shop' },
        { key: 'newArrivals', href: '/shop?category=new-arrivals' },
        { key: 'homeDecor', href: '/shop?category=home-decor' },
        { key: 'textiles', href: '/shop?category=textiles' },
        { key: 'jewelry', href: '/shop?category=jewelry' },
        { key: 'about', href: '/about' },
        { key: 'contact', href: '/contact' },
        { key: 'helpCenter', href: '/help' },
    ];

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header
            className={clsx(
                "fixed w-full z-50 transition-all duration-[350ms] border-b",
                isScrolled
                    ? "bg-white/[0.94] backdrop-blur-xl h-16 shadow-soft border-stone-200/80"
                    : "bg-transparent h-24 border-transparent"
            )}
        >
            <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">

                {/* Left: Branding & Nav */}
                <div className="flex items-center gap-8">
                    <a href="/" className={clsx(
                        "font-serif text-2xl font-bold z-50 relative tracking-editorial transition-colors duration-300",
                        useLightText ? "text-white hover:text-ochre" : "text-stone-900 hover:text-ochre"
                    )}>
                        Craftistan.
                    </a>

                    <nav className="hidden md:flex items-center gap-6">
                        {/* Shop Dropdown */}
                        <div
                            className="relative"
                            onMouseEnter={() => setShopMenuOpen(true)}
                            onMouseLeave={() => setShopMenuOpen(false)}
                        >
                            <a
                                href="/shop"
                                className={clsx(
                                    "flex items-center gap-1 text-sm font-medium transition-colors duration-300 tracking-wide",
                                    useLightText ? "text-stone-200 hover:text-white" : "text-stone-500 hover:text-stone-900"
                                )}
                            >
                                Shop
                                <ChevronDown className="w-3 h-3" />
                            </a>

                            {shopMenuOpen && (
                                <div className="absolute top-full ltr:left-0 rtl:right-0 mt-3 w-52 bg-white rounded-xl shadow-soft-lg border border-stone-200/60 py-1.5 overflow-hidden animate-slide-up">
                                    {shopCategories.map(cat => (
                                        <a
                                            key={cat.key}
                                            href={cat.href}
                                            className="block px-4 py-2.5 text-sm text-stone-500 hover:bg-stone-50 hover:text-stone-900 hover:pl-5 transition-all duration-200"
                                        >
                                            {t(cat.key)}
                                        </a>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Other Main Links */}
                        {mainLinks.map(link => (
                            <a key={link.key} href={link.href} className={clsx(
                                "text-sm font-medium transition-colors duration-300 tracking-wide",
                                useLightText ? "text-stone-200 hover:text-white" : "text-stone-500 hover:text-stone-900"
                            )}>
                                {t(link.key)}
                            </a>
                        ))}
                    </nav>
                </div>


                {/* Center: Search (Desktop) */}
                <div className="hidden md:flex flex-1 max-w-md mx-6 rtl:mr-12 ltr:ml-12">
                    <form onSubmit={handleSearch} className="relative w-full group">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder={t('searchPlaceholder')}
                            className={clsx(
                                "w-full py-2.5 rounded-full text-sm transition-all duration-300 outline-none",
                                "pl-10 pr-4 rtl:pl-4 rtl:pr-10",
                                "bg-stone-50 border border-stone-200/80 text-stone-800 placeholder:text-stone-400",
                                "focus:bg-white focus:border-stone-300 focus:ring-2 focus:ring-stone-100 focus:shadow-soft",
                                "hover:border-stone-300"
                            )}
                        />
                        <Search className={clsx(
                            "absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-400 group-hover:text-stone-500 transition-colors",
                            "left-3.5 rtl:left-auto rtl:right-3.5"
                        )} />
                    </form>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-1 md:gap-2">
                    {/* Language Switcher */}
                    <div className="relative hidden md:block">
                        <button
                            onClick={() => setLangMenuOpen(!langMenuOpen)}
                            className={clsx(
                                "flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-full transition-colors",
                                useLightText
                                    ? "text-stone-200 hover:text-white hover:bg-white/10"
                                    : "text-stone-600 hover:text-stone-900 hover:bg-stone-100"
                            )}
                            aria-label="Select Language"
                        >
                            <Globe className="w-4 h-4" />
                            <span className="uppercase">{currentLang}</span>
                            <ChevronDown className="w-3 h-3 ml-1" />
                        </button>

                        {langMenuOpen && (
                            <div className="absolute top-full ltr:right-0 rtl:left-0 mt-2 w-40 bg-white rounded-xl shadow-soft-lg border border-stone-100 py-2 overflow-hidden">
                                {languages.map((lang) => (
                                    <button
                                        key={lang.code}
                                        onClick={() => {
                                            setLanguage(lang.code);
                                            setLangMenuOpen(false);
                                        }}
                                        className={clsx(
                                            "w-full text-left px-4 py-2 text-sm hover:bg-stone-50 transition-colors",
                                            currentLang === lang.code ? "text-ochre font-medium" : "text-stone-600"
                                        )}
                                    >
                                        {lang.name}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="w-px h-6 bg-stone-200 mx-1 hidden md:block"></div>

                    {/* Notifications - only for logged in users */}
                    {user && <NotificationDropdown />}

                    <Link to="/wishlist" className={clsx(
                        "p-2.5 rounded-full transition-colors relative",
                        useLightText ? "text-stone-200 hover:text-white hover:bg-white/10" : "text-stone-600 hover:text-stone-900 hover:bg-stone-100"
                    )} aria-label="Favorites">
                        <Heart className="w-5 h-5" />
                        {wishlistCount > 0 && (
                            <span className="absolute -top-1 ltr:-right-1 rtl:-left-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                                {wishlistCount > 9 ? '9+' : wishlistCount}
                            </span>
                        )}
                    </Link>

                    <button
                        onClick={() => setIsCartOpen(true)}
                        className={clsx(
                            "p-2.5 rounded-full transition-colors relative",
                            useLightText ? "text-stone-200 hover:text-white hover:bg-white/10" : "text-stone-600 hover:text-stone-900 hover:bg-stone-100"
                        )}
                        aria-label="Cart"
                    >
                        <ShoppingBag className="w-5 h-5" />
                        {cartCount > 0 && (
                            <span className="absolute -top-1 ltr:-right-1 rtl:-left-1 w-5 h-5 bg-ochre text-white text-xs font-bold rounded-full flex items-center justify-center">
                                {cartCount > 9 ? '9+' : cartCount}
                            </span>
                        )}
                    </button>

                    {/* User Actions */}
                    {user ? (
                        <div className="relative hidden md:block">
                            <button
                                onClick={() => setUserMenuOpen(!userMenuOpen)}
                                className="flex items-center gap-2 px-1 pl-1.5 pr-3.5 py-1 rounded-full border border-stone-200/80 hover:border-stone-300 hover:shadow-soft transition-all duration-300 bg-white"
                            >
                                <div className="w-7 h-7 rounded-full bg-stone-100 overflow-hidden ring-1 ring-stone-200">
                                    {user.avatar ? <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" /> : <User className="w-4 h-4 m-1.5 text-stone-400" />}
                                </div>
                                <span className="text-xs font-semibold text-stone-700 max-w-[90px] truncate tracking-wide">{user.name}</span>
                                <ChevronDown className="w-3 h-3 text-stone-400" />
                            </button>

                            {userMenuOpen && (
                                <div className="absolute top-full ltr:right-0 rtl:left-0 mt-2 w-52 bg-white rounded-xl shadow-soft-xl border border-stone-200/60 py-1.5 overflow-hidden animate-slide-up">
                                    <div className="px-4 py-3 border-b border-stone-100">
                                        <p className="text-2xs text-stone-400 uppercase tracking-label font-semibold mb-0.5">Signed in as</p>
                                        <p className="text-sm font-semibold text-stone-900 truncate">{user.email}</p>
                                    </div>
                                    {[{
                                        label: 'Dashboard',
                                        action: () => navigate(user.role === 'ADMIN' ? '/admin' : user.role === 'ARTISAN' ? '/artisan' : '/buyer')
                                    }, {
                                        label: 'Profile & Settings',
                                        action: () => navigate('/profile')
                                    }, {
                                        label: 'My Orders',
                                        action: () => navigate('/orders')
                                    }].map(item => (
                                        <button
                                            key={item.label}
                                            onClick={() => { item.action(); setUserMenuOpen(false); }}
                                            className="w-full text-left px-4 py-2.5 text-sm text-stone-600 hover:bg-stone-50 hover:text-stone-900 transition-all duration-200 hover:pl-5"
                                        >
                                            {item.label}
                                        </button>
                                    ))}
                                    <div className="border-t border-stone-100 mt-1 pt-1">
                                        <button
                                            onClick={() => { setUserMenuOpen(false); logout(); navigate('/'); }}
                                            className="w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-50/60 hover:text-red-700 transition-all duration-200"
                                        >
                                            Sign Out
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <button
                            onClick={() => setLoginOpen(true)}
                            className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-stone-900 text-white text-xs font-semibold tracking-wide hover:bg-stone-800 hover:shadow-soft-lg transition-all duration-300 hover:-translate-y-px"
                        >
                            <User className="w-3.5 h-3.5" />
                            <span>Sign In</span>
                        </button>
                    )}

                    <button
                        className={clsx(
                            "md:hidden p-2",
                            useLightText ? "text-white" : "text-stone-600"
                        )}
                        aria-label="Menu"
                        onClick={() => setMobileMenuOpen(true)}
                    >
                        <Menu className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <LoginModal isOpen={loginOpen} onClose={() => setLoginOpen(false)} />

            {/* Mobile Menu Overlay */}
            {mobileMenuOpen && (
                <div className="fixed inset-0 z-[60] md:hidden">
                    <div className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)}></div>
                    <div className="absolute ltr:right-0 rtl:left-0 top-0 bottom-0 w-[80%] max-w-sm bg-white shadow-2xl p-6 flex flex-col overflow-y-auto">
                        <div className="flex items-center justify-between mb-8">
                            <span className="text-xl font-serif font-bold text-stone-900">Menu</span>
                            <button onClick={() => setMobileMenuOpen(false)} className="p-2 text-stone-400 hover:text-stone-600">
                                <ChevronDown className="w-6 h-6 rotate-90" /> {/* Chevron as close icon alternative or just X */}
                            </button>
                        </div>
                        <nav className="flex flex-col gap-4">
                            {mobileNavLinks.map(link => (
                                <a key={link.key} href={link.href} className="text-lg font-medium text-stone-600 py-2 border-b border-stone-100">{t(link.key)}</a>
                            ))}
                            <a href="/track-order" className="text-lg font-medium text-stone-600 py-2 border-b border-stone-100">{t('trackOrder')}</a>
                            <a href="/shipping-returns" className="text-lg font-medium text-stone-600 py-2 border-b border-stone-100">{t('shippingReturns')}</a>
                        </nav>
                        {/* Mobile Search */}
                        <form onSubmit={handleSearch} className="mt-6 relative">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder={t('searchPlaceholder')}
                                className="w-full py-3 pl-10 pr-4 rounded-full text-sm bg-stone-100 border border-stone-200 text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-300"
                            />
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                        </form>
                        <div className="mt-8 pt-8 border-t border-stone-100 space-y-4">
                            {user ? (
                                <>
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-10 h-10 rounded-full bg-stone-200 overflow-hidden">
                                            {user.avatar ? <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" /> : <User className="w-6 h-6 m-2 text-stone-500" />}
                                        </div>
                                        <div>
                                            <p className="font-medium text-stone-900">{user.name}</p>
                                            <p className="text-sm text-stone-500">{user.email}</p>
                                        </div>
                                    </div>
                                    <button onClick={() => { navigate(user.role === 'ADMIN' ? '/admin' : user.role === 'ARTISAN' ? '/artisan' : '/buyer'); setMobileMenuOpen(false); }} className="w-full py-3 bg-stone-100 text-stone-900 rounded-lg font-medium">Dashboard</button>
                                    <button onClick={() => { logout(); setMobileMenuOpen(false); navigate('/'); }} className="w-full py-3 text-red-600 font-medium">Sign Out</button>
                                </>
                            ) : (
                                <button onClick={() => { setLoginOpen(true); setMobileMenuOpen(false); }} className="w-full py-3 bg-stone-900 text-white rounded-lg font-medium shadow-md">Sign In / Sign Up</button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}
