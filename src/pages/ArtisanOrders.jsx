import { useState, useEffect, useCallback } from 'react';
import { Layout } from '../components/layout/Layout';
import { useAuth } from '../context/AuthContext';
import { Package, Truck, CheckCircle, Clock, XCircle, Loader2, Search } from 'lucide-react';
import { artisanApi } from '../services/api';
import clsx from 'clsx';

const resolveImageUrl = (url) => {
    if (!url) return 'https://via.placeholder.com/100';
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    return url.startsWith('/') ? url : `/${url}`;
};

const statusConfig = {
    pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-700', icon: Clock },
    processing: { label: 'Processing', color: 'bg-blue-100 text-blue-700', icon: Package },
    shipped: { label: 'Shipped', color: 'bg-purple-100 text-purple-700', icon: Truck },
    delivered: { label: 'Delivered', color: 'bg-green-100 text-green-700', icon: CheckCircle },
    cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-700', icon: XCircle },
};

export function ArtisanOrders() {
    const { user } = useAuth();
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [updatingOrderId, setUpdatingOrderId] = useState(null);

    const fetchOrders = useCallback(async () => {
        setIsLoading(true);
        try {
            const result = await artisanApi.getOrders();
            if (result.success) {
                const raw = result.data;
                let ordersArray = null;

                if (Array.isArray(raw)) ordersArray = raw;
                else if (raw && Array.isArray(raw.content)) ordersArray = raw.content;
                else if (raw && Array.isArray(raw.data)) ordersArray = raw.data;
                else if (raw && raw.data && Array.isArray(raw.data.content)) ordersArray = raw.data.content;
                else if (raw && raw.data && Array.isArray(raw.data.data)) ordersArray = raw.data.data;

                if (ordersArray) {
                    const mappedOrders = ordersArray.map(o => ({
                        id: o.orderId || o.id,
                        buyerName: o.buyerName || o.user?.name || o.shippingAddress?.fullName || 'Customer',
                        date: o.orderDate || o.createdAt || new Date().toISOString(),
                        status: (o.orderStatus || o.status || 'pending').toLowerCase(),
                        total: o.totalAmount || o.total || 0,
                        items: (o.orderItems || o.items || []).map(item => ({
                            id: item.id || item.productId,
                            name: item.productName || item.product?.name || 'Product',
                            quantity: item.quantity || 1,
                            price: item.price || item.unitPrice || 0,
                            image: resolveImageUrl(item.productImage || item.product?.image || item.product?.images?.[0]),
                        })),
                        shippingAddress: o.shippingAddress || { city: 'Unknown', addressLine1: 'N/A' },
                    }));
                    mappedOrders.sort((a, b) => new Date(b.date) - new Date(a.date));
                    setOrders(mappedOrders);
                }
            }
        } catch (error) {
            console.error('Failed to fetch artisan orders:', error);
        }
        setIsLoading(false);
    }, []);

    useEffect(() => {
        if (user && user.role === 'ARTISAN') {
            fetchOrders();
        }
    }, [user, fetchOrders]);

    const handleUpdateStatus = async (orderId, newStatus) => {
        setUpdatingOrderId(orderId);
        try {
            const result = await artisanApi.updateOrderStatus(orderId, newStatus.toUpperCase());
            if (result.success) {
                setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
            } else {
                alert(result.error || 'Failed to update order status');
            }
        } catch (err) {
            console.error('Error updating status', err);
            alert('An error occurred.');
        }
        setUpdatingOrderId(null);
    };

    const filteredOrders = orders.filter(o => {
        const matchesStatus = filterStatus === 'all' || o.status === filterStatus;
        const matchesSearch = o.id.toString().toLowerCase().includes(searchQuery.toLowerCase()) || 
                              o.buyerName.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    if (!user || user.role !== 'ARTISAN') {
        return (
            <Layout>
                <div className="min-h-screen flex items-center justify-center">
                    <p className="text-stone-500">Access Restricted.</p>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="min-h-screen bg-stone-50 pt-28 pb-16">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
                        <div>
                            <h1 className="text-3xl font-serif text-stone-900">Manage Orders</h1>
                            <p className="text-stone-500 mt-2">Track and fulfill your customer orders.</p>
                        </div>
                        <div className="flex gap-3">
                            <div className="relative">
                                <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                                <input
                                    type="text"
                                    placeholder="Order ID, Customer..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10 pr-4 py-2 bg-white border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-ochre w-full md:w-64"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Filter Tabs */}
                    <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
                        {['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'].map(status => (
                            <button
                                key={status}
                                onClick={() => setFilterStatus(status)}
                                className={clsx(
                                    "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors",
                                    filterStatus === status
                                        ? "bg-stone-900 text-white"
                                        : "bg-white border border-stone-200 text-stone-600 hover:border-stone-400"
                                )}
                            >
                                {status === 'all' ? 'All Orders' : statusConfig[status]?.label || status}
                            </button>
                        ))}
                    </div>

                    {isLoading ? (
                        <div className="flex justify-center py-20">
                            <Loader2 className="w-8 h-8 animate-spin text-stone-300" />
                        </div>
                    ) : filteredOrders.length === 0 ? (
                        <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center">
                            <Package className="w-16 h-16 text-stone-200 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-stone-900 mb-1">No orders found</h3>
                            <p className="text-stone-500 text-sm">You have no orders matching this status.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {filteredOrders.map(order => {
                                const StatusIcon = statusConfig[order.status]?.icon || Package;
                                return (
                                    <div key={order.id} className="bg-white rounded-xl border border-stone-200 p-6 flex flex-col lg:flex-row gap-6 hover:shadow-sm transition-shadow">
                                        
                                        {/* Order Details (Left) */}
                                        <div className="flex-1 space-y-4">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <span className={clsx("inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium mb-2", statusConfig[order.status]?.color)}>
                                                        <StatusIcon className="w-3.5 h-3.5" /> {statusConfig[order.status]?.label}
                                                    </span>
                                                    <h3 className="text-lg font-medium text-stone-900">Order #{order.id}</h3>
                                                    <p className="text-sm text-stone-500">
                                                        Placed {new Date(order.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-lg font-semibold text-stone-900">Rs. {order.total.toLocaleString()}</p>
                                                    <p className="text-sm text-stone-500">{order.items.length} items</p>
                                                </div>
                                            </div>

                                            <div className="border-t border-stone-100 pt-4 flex gap-4">
                                                <div className="flex -space-x-3">
                                                    {order.items.slice(0, 3).map((item, idx) => (
                                                        <img key={idx} src={item.image} alt="" className="w-10 h-10 rounded-lg object-cover border-2 border-white bg-stone-100" />
                                                    ))}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-stone-900 truncate max-w-[200px]">
                                                        {order.items.map(i => i.name).join(', ')}
                                                    </p>
                                                    <p className="text-xs text-stone-500">Buyer: {order.buyerName}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Action / Fulfillment (Right) */}
                                        <div className="lg:w-64 bg-stone-50 rounded-xl p-4 flex flex-col justify-between border border-stone-100">
                                            <div>
                                                <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider mb-2">Fulfillment</h4>
                                                <p className="text-xs text-stone-600 mb-4 break-words">
                                                    <span className="font-semibold block">{order.buyerName}</span>
                                                    {order.shippingAddress.addressLine1 || order.shippingAddress.street}<br/>
                                                    {order.shippingAddress.city}
                                                </p>
                                            </div>
                                            
                                            <div>
                                                <label className="text-xs font-medium text-stone-700 block mb-1.5">Update Status</label>
                                                <select
                                                    disabled={updatingOrderId === order.id || order.status === 'cancelled'}
                                                    value={order.status}
                                                    onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                                                    className="w-full text-sm rounded-lg border border-stone-200 px-3 py-2 bg-white focus:outline-none focus:border-ochre disabled:opacity-50"
                                                >
                                                    <option value="pending">Pending</option>
                                                    <option value="processing">Processing</option>
                                                    <option value="shipped">Shipped</option>
                                                    <option value="delivered">Delivered</option>
                                                    {order.status === 'cancelled' && <option value="cancelled">Cancelled</option>}
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
}
