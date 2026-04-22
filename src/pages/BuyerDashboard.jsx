import { Layout } from '../components/layout/Layout';
import { Button } from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { Package, Heart, Settings, ShoppingBag, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import { ordersApi } from '../services/api';

// Resolve backend image paths
const resolveImageUrl = (url) => {
    if (!url) return 'https://via.placeholder.com/100';
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    return url.startsWith('/') ? url : `/${url}`;
};

export function BuyerDashboard() {
    const { user } = useAuth();
    const { wishlist } = useWishlist();

    // Generate initials from user name
    const getInitials = (name) => {
        if (!name) return 'U';
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    const [recentOrders, setRecentOrders] = useState([]);
    const [totalOrders, setTotalOrders] = useState(0);

    const fetchRecentOrders = useCallback(async () => {
        if (!user) return;
        try {
            const result = await ordersApi.getAll();
            if (result.success) {
                const raw = result.data;
                let ordersArray = null;

                if (Array.isArray(raw)) ordersArray = raw;
                else if (raw && Array.isArray(raw.content)) ordersArray = raw.content;
                else if (raw && Array.isArray(raw.data)) ordersArray = raw.data;
                else if (raw && raw.data && Array.isArray(raw.data.content)) ordersArray = raw.data.content;
                else if (raw && raw.data && Array.isArray(raw.data.data)) ordersArray = raw.data.data;

                if (ordersArray) {
                    setTotalOrders(ordersArray.length);
                    // Map to dashboard expected format
                    const mappedOrders = ordersArray.map(o => {
                        const firstItem = (o.orderItems || o.items || [])[0] || {};
                        return {
                            id: o.orderId || o.id,
                            product: firstItem.productName || firstItem.product?.name || 'Multiple Items',
                            artisan: firstItem.artisanName || firstItem.product?.artisan || 'Craftistan Artisan',
                            status: (o.orderStatus || o.status || 'Pending'),
                            date: new Date(o.orderDate || o.createdAt || new Date()).toLocaleDateString('en-PK', { month: 'short', day: 'numeric' }),
                            image: resolveImageUrl(firstItem.productImage || firstItem.product?.image || firstItem.product?.images?.[0])
                        };
                    });
                    
                    // Sort descending and take top 3
                    mappedOrders.sort((a, b) => new Date(b.date) - new Date(a.date));
                    setRecentOrders(mappedOrders.slice(0, 3));
                }
            }
        } catch (error) {
            console.error('Failed to fetch recent orders:', error);
        }
    }, [user]);

    useEffect(() => {
        fetchRecentOrders();
    }, [fetchRecentOrders]);

    return (
        <Layout>
            <div className="max-w-7xl mx-auto px-6 py-24 min-h-screen bg-stone-50/50">
                {/* Profile Header */}
                <div className="flex flex-col md:flex-row md:items-end gap-6 mb-12">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-ochre to-terracotta text-white border-4 border-white shadow-soft-xl flex items-center justify-center text-3xl font-serif">
                        {getInitials(user?.name)}
                    </div>
                    <div className="mb-2 flex-1">
                        <h1 className="text-3xl font-serif text-stone-900">{user?.name || 'Welcome'}</h1>
                        <p className="text-stone-500">{user?.email} • Member since 2024</p>
                    </div>
                    <div className="mb-2">
                        <Link to="/profile">
                            <Button variant="outline">
                                <Settings className="w-4 h-4 mr-2" /> Edit Profile
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                    {[
                        { label: 'Orders', value: totalOrders, icon: Package, color: 'text-ochre' },
                        { label: 'Wishlist', value: wishlist.length, icon: Heart, color: 'text-red-500' },
                        { label: 'Reviews', value: 3, icon: ShoppingBag, color: 'text-green-600' },
                    ].map((stat, i) => (
                        <div key={i} className="bg-white rounded-xl p-4 border border-stone-100 shadow-soft">
                            <stat.icon className={`w-5 h-5 ${stat.color} mb-2`} />
                            <div className="text-2xl font-bold text-stone-900">{stat.value}</div>
                            <div className="text-xs text-stone-500">{stat.label}</div>
                        </div>
                    ))}
                </div>

                {/* Dashboard Content */}
                <div className="grid md:grid-cols-2 gap-8">

                    {/* Recent Orders */}
                    <div className="bg-white rounded-2xl p-6 shadow-soft border border-stone-100">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-2">
                                <Package className="w-5 h-5 text-ochre" />
                                <h2 className="text-xl font-serif text-stone-900">Recent Orders</h2>
                            </div>
                            <Link to="/orders" className="text-sm text-ochre hover:underline">View All</Link>
                        </div>

                        {recentOrders.length === 0 ? (
                            <div className="text-center py-8">
                                <Package className="w-12 h-12 text-stone-200 mx-auto mb-3" />
                                <p className="text-stone-500">No orders yet</p>
                                <Link to="/shop">
                                    <Button variant="primary" size="sm" className="mt-4">Start Shopping</Button>
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {recentOrders.map((order) => (
                                    <div key={order.id} className="flex gap-4 p-3 rounded-xl hover:bg-stone-50 transition-colors">
                                        <img src={order.image} alt={order.product} className="w-16 h-16 rounded-lg object-cover" />
                                        <div className="flex-1">
                                            <h4 className="font-medium text-stone-900">{order.product}</h4>
                                            <p className="text-sm text-stone-500">From {order.artisan}</p>
                                            <p className="text-xs text-stone-400 mt-1">{order.date}</p>
                                        </div>
                                        <span className={`self-start text-xs font-medium px-2 py-1 rounded-full ${order.status === 'Delivered' ? 'bg-green-50 text-green-600' :
                                                order.status === 'Processing' ? 'bg-ochre/10 text-ochre' :
                                                    'bg-stone-100 text-stone-600'
                                            }`}>
                                            {order.status}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Saved Items / Wishlist */}
                    <div className="bg-white rounded-2xl p-6 shadow-soft border border-stone-100">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-2">
                                <Heart className="w-5 h-5 text-red-500" />
                                <h2 className="text-xl font-serif text-stone-900">Saved Items</h2>
                            </div>
                            <Link to="/wishlist" className="text-sm text-ochre hover:underline">View All</Link>
                        </div>

                        {wishlist.length === 0 ? (
                            <div className="text-center py-8">
                                <Heart className="w-12 h-12 text-stone-200 mx-auto mb-3" />
                                <p className="text-stone-500">No saved items</p>
                                <Link to="/shop">
                                    <Button variant="outline" size="sm" className="mt-4">Browse Products</Button>
                                </Link>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 gap-4">
                                {wishlist.slice(0, 4).map((item) => (
                                    <Link key={item.id} to={`/product/${item.id}`} className="group">
                                        <div className="aspect-square bg-stone-100 rounded-xl overflow-hidden mb-2">
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                            />
                                        </div>
                                        <h4 className="font-medium text-stone-900 text-sm truncate">{item.name}</h4>
                                        <p className="text-sm text-ochre font-medium">Rs. {item.price.toLocaleString()}</p>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>

                </div>

                {/* Quick Actions */}
                <div className="mt-8 bg-gradient-to-r from-stone-900 to-stone-800 rounded-2xl p-8 text-white">
                    <h3 className="text-xl font-serif mb-4">Continue Shopping</h3>
                    <p className="text-stone-300 mb-6">Discover handcrafted treasures from Pakistan's finest artisans.</p>
                    <div className="flex gap-4">
                        <Link to="/shop">
                            <Button variant="primary" className="bg-white text-stone-900 hover:bg-stone-100">
                                Browse Products <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                        </Link>
                        <Link to="/creators">
                            <Button variant="outline" className="border-white/30 text-white hover:bg-white/10">
                                Meet Artisans
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
