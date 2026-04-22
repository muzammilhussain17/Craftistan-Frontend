import { Layout } from '../components/layout/Layout';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { TrendingUp, Users, ShoppingBag, ArrowUpRight, Package, BarChart3, ClipboardList, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Link } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import { artisanApi } from '../services/api';

// Resolve backend image paths
const resolveImageUrl = (url) => {
    if (!url) return 'https://via.placeholder.com/100';
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    return url.startsWith('/') ? url : `/${url}`;
};

export function ArtisanDashboard() {
    const { t } = useLanguage();
    const { user } = useAuth();
    
    const [statsData, setStatsData] = useState({ totalSales: 0, activeOrders: 0, profileViews: 0 });
    const [recentOrders, setRecentOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchDashboardData = useCallback(async () => {
        setIsLoading(true);
        try {
            // Fetch stats
            const statsRes = await artisanApi.getDashboard();
            if (statsRes.success) {
                const data = statsRes.data?.data || statsRes.data || {};
                setStatsData({
                    totalSales: data.totalSales || data.revenue || 0,
                    activeOrders: data.activeOrders || data.pendingOrders || 0,
                    profileViews: data.profileViews || data.views || 0
                });
            }

            // Fetch recent orders
            const ordersRes = await artisanApi.getOrders();
            if (ordersRes.success) {
                const raw = ordersRes.data;
                let ordersArray = null;

                if (Array.isArray(raw)) ordersArray = raw;
                else if (raw && Array.isArray(raw.content)) ordersArray = raw.content;
                else if (raw && Array.isArray(raw.data)) ordersArray = raw.data;
                else if (raw && raw.data && Array.isArray(raw.data.content)) ordersArray = raw.data.content;
                else if (raw && raw.data && Array.isArray(raw.data.data)) ordersArray = raw.data.data;

                if (ordersArray) {
                    // Sort descending and take top 3
                    const sorted = [...ordersArray].sort((a, b) => new Date(b.orderDate || b.createdAt) - new Date(a.orderDate || a.createdAt));
                    setRecentOrders(sorted.slice(0, 3));
                }
            }
        } catch (err) {
            console.error('Failed to fetch artisan dashboard data:', err);
        }
        setIsLoading(false);
    }, []);

    useEffect(() => {
        if (user) fetchDashboardData();
    }, [user, fetchDashboardData]);

    const stats = [
        { title: 'Total Sales', value: `Rs. ${statsData.totalSales.toLocaleString()}`, change: '+12%', icon: TrendingUp, color: 'text-ochre' },
        { title: 'Active Orders', value: statsData.activeOrders.toString(), change: 'Pending', icon: ShoppingBag, color: 'text-terracotta' },
        { title: 'Profile Views', value: statsData.profileViews.toLocaleString(), change: '+24%', icon: Users, color: 'text-stone-600' },
    ];

    return (
        <Layout>
            <div className="max-w-7xl mx-auto px-6 py-24 min-h-screen bg-stone-50/50">
                <div className="mb-12">
                    <h1 className="text-4xl font-serif text-stone-900 mb-2">Welcome back, {user?.name || 'Artisan'}.</h1>
                    <p className="text-stone-500">Here's how your shop is performing today.</p>
                </div>

                {/* Stats Grid */}
                <div className="grid md:grid-cols-3 gap-6 mb-12">
                    {stats.map((stat) => (
                        <div key={stat.title} className="bg-white p-6 rounded-2xl shadow-soft border border-stone-100 group hover:shadow-soft-lg transition-all">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-stone-500 text-sm font-medium uppercase tracking-wider">{stat.title}</span>
                                <span className={`p-2 rounded-full bg-stone-50 ${stat.color}`}>
                                    <stat.icon className="w-5 h-5" />
                                </span>
                            </div>
                            <div className="flex items-end gap-3">
                                <h3 className="text-3xl font-serif text-stone-900">{stat.value}</h3>
                                <span className="text-sm font-medium text-green-600 mb-1 flex items-center">
                                    {stat.change}
                                    <ArrowUpRight className="w-3 h-3 ml-0.5" />
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Content Section */}
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Recent Activity */}
                    <div className="lg:col-span-2 bg-white rounded-2xl shadow-soft border border-stone-100 p-8">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-serif text-stone-900">Recent Orders</h2>
                            <Link to="/orders" className="text-sm text-ochre hover:underline">View All</Link>
                        </div>
                        
                        {isLoading ? (
                            <div className="flex justify-center py-8">
                                <Loader2 className="w-8 h-8 animate-spin text-stone-300" />
                            </div>
                        ) : recentOrders.length === 0 ? (
                            <div className="text-center py-8">
                                <Package className="w-12 h-12 text-stone-200 mx-auto mb-3" />
                                <p className="text-stone-500">No orders yet</p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {recentOrders.map((order, i) => {
                                    const firstItem = (order.orderItems || order.items || [])[0] || {};
                                    const productName = firstItem.productName || firstItem.product?.name || `Order ${order.orderId || order.id}`;
                                    const buyerName = order.buyerName || order.user?.name || order.shippingAddress?.fullName || 'Customer';
                                    const orderDate = order.orderDate || order.createdAt || new Date();
                                    const timeAgo = Math.floor((new Date() - new Date(orderDate)) / (1000 * 60 * 60)); // hours
                                    const timeDisplay = timeAgo < 24 ? `${timeAgo} hrs ago` : new Date(orderDate).toLocaleDateString('en-PK');
                                    const status = order.orderStatus || order.status || 'Processing';
                                    const image = resolveImageUrl(firstItem.productImage || firstItem.product?.image || firstItem.product?.images?.[0]);

                                    return (
                                        <div key={order.orderId || order.id || i} className="flex items-center justify-between pb-6 border-b border-stone-100 last:border-0 last:pb-0">
                                            <div className="flex items-center gap-4">
                                                <img src={image} className="w-12 h-12 bg-stone-100 rounded-lg object-cover" alt="" />
                                                <div>
                                                    <h4 className="font-medium text-stone-900">{productName}</h4>
                                                    <p className="text-sm text-stone-500">Ordered by {buyerName} • {timeDisplay}</p>
                                                </div>
                                            </div>
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                                status.toLowerCase() === 'delivered' ? 'bg-green-100 text-green-700' :
                                                status.toLowerCase() === 'shipped' ? 'bg-blue-100 text-blue-700' :
                                                status.toLowerCase() === 'cancelled' ? 'bg-red-100 text-red-700' :
                                                'bg-ochre/10 text-ochre-dark'
                                            }`}>
                                                {status}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-stone-900 text-stone-50 rounded-2xl p-8 shadow-soft-lg">
                        <h2 className="text-xl font-serif mb-6 text-white">Quick Actions</h2>
                        <div className="space-y-4">
                            <Link to="/artisan/products">
                                <Button variant="primary" className="w-full justify-start bg-white/10 hover:bg-white/20 border-transparent text-white">
                                    <Package className="w-4 h-4 mr-2" /> Manage Products
                                </Button>
                            </Link>
                            <Link to="/orders" className="block mt-3">
                                <Button variant="primary" className="w-full justify-start bg-white/10 hover:bg-white/20 border-transparent text-white">
                                    <ClipboardList className="w-4 h-4 mr-2" /> View Orders
                                </Button>
                            </Link>
                            <Link to="/profile" className="block mt-3">
                                <Button variant="primary" className="w-full justify-start bg-white/10 hover:bg-white/20 border-transparent text-white">
                                    <BarChart3 className="w-4 h-4 mr-2" /> Profile Settings
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
