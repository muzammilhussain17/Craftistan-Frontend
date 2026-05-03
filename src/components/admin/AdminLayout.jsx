import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
    LayoutDashboard, Users, Package, ShoppingCart,
    Star, Flag, LogOut, ChevronRight, Shield, Menu, X
} from 'lucide-react';

const NAV_ITEMS = [
    { path: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
    { path: '/admin/artisans', label: 'Artisan Verification', icon: Shield },
    { path: '/admin/users', label: 'Users', icon: Users },
    { path: '/admin/products', label: 'Products', icon: Package },
    { path: '/admin/reports', label: 'Reports & Disputes', icon: Flag },
];

export function AdminLayout({ children }) {
    const { logout, user } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleLogout = () => { logout(); navigate('/'); };

    const isActive = (item) => item.exact
        ? location.pathname === item.path
        : location.pathname.startsWith(item.path);

    return (
        <div className="min-h-screen bg-gray-950 flex relative">
            {/* Mobile menu overlay */}
            {isMobileMenuOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-gray-900 border-r border-gray-800 flex flex-col transform transition-transform duration-300 ease-in-out lg:transform-none ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                {/* Logo */}
                <div className="p-6 border-b border-gray-800 flex justify-between items-center">
                    <div>
                        <Link to="/" className="flex items-center gap-2">
                            <span className="text-xl font-bold text-white">Craftistan</span>
                            <span className="bg-amber-500 text-black text-xs font-bold px-2 py-0.5 rounded">ADMIN</span>
                        </Link>
                        <p className="text-xs text-gray-500 mt-1">Super Admin Panel</p>
                    </div>
                    <button onClick={() => setIsMobileMenuOpen(false)} className="lg:hidden text-gray-400 hover:text-white">
                        <X size={20} />
                    </button>
                </div>

                {/* Admin info */}
                <div className="px-4 py-3 border-b border-gray-800">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-black font-bold text-sm">
                            {user?.name?.[0]?.toUpperCase() || 'A'}
                        </div>
                        <div>
                            <p className="text-sm font-medium text-white">{user?.name}</p>
                            <p className="text-xs text-amber-400">Super Admin</p>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-1">
                    {NAV_ITEMS.map(item => {
                        const Icon = item.icon;
                        const active = isActive(item);
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${active
                                    ? 'bg-amber-500 text-black font-semibold'
                                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                                    }`}
                            >
                                <Icon size={16} />
                                <span className="flex-1">{item.label}</span>
                                {active && <ChevronRight size={14} />}
                            </Link>
                        );
                    })}
                </nav>

                {/* Logout */}
                <div className="p-4 border-t border-gray-800">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-3 py-2 w-full rounded-lg text-sm text-gray-400 hover:text-red-400 hover:bg-gray-800 transition-colors"
                    >
                        <LogOut size={16} />
                        <span>Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* Main content */}
            <main className="flex-1 overflow-auto w-full lg:w-auto h-screen">
                {/* Mobile header bar */}
                <div className="lg:hidden p-4 border-b border-gray-800 bg-gray-900 flex items-center gap-3 sticky top-0 z-30">
                    <button onClick={() => setIsMobileMenuOpen(true)} className="text-gray-400 hover:text-white">
                        <Menu size={24} />
                    </button>
                    <span className="text-lg font-bold text-white">Craftistan Admin</span>
                </div>
                {children}
            </main>
        </div>
    );
}
