import { useState, useEffect, useCallback } from 'react';
import { Layout } from '../components/layout/Layout';
import { useAuth } from '../context/AuthContext';
import { Package, Eye, ChevronRight, Truck, CheckCircle, Clock, XCircle, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ordersApi } from '../services/api';
import clsx from 'clsx';

// Resolve backend image paths
const resolveImageUrl = (url) => {
    if (!url) return 'https://via.placeholder.com/100';
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    return url.startsWith('/') ? url : `/${url}`;
};

// Mock order data
const MOCK_ORDERS = [
    {
        id: 'ORD-2024-0001',
        date: '2024-01-15',
        status: 'delivered',
        total: 25500,
        items: [
            { id: 1, name: 'Pashmina Shawl', quantity: 1, price: 22000, image: 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=100' },
            { id: 2, name: 'Beaded Anklet Pair', quantity: 1, price: 3500, image: 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=100' },
        ],
        shippingAddress: { fullName: 'Muzammil Hussain', city: 'Lahore' },
    },
    {
        id: 'ORD-2024-0002',
        date: '2024-01-18',
        status: 'shipped',
        total: 18000,
        items: [
            { id: 3, name: 'Carved Wooden Mirror Frame', quantity: 1, price: 18000, image: 'https://images.unsplash.com/photo-1618220179428-22790b461013?w=100' },
        ],
        shippingAddress: { fullName: 'Muzammil Hussain', city: 'Lahore' },
    },
    {
        id: 'ORD-2024-0003',
        date: '2024-01-20',
        status: 'processing',
        total: 12500,
        items: [
            { id: 4, name: 'Ceramic Tea Set', quantity: 1, price: 12000, image: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=100' },
        ],
        shippingAddress: { fullName: 'Muzammil Hussain', city: 'Islamabad' },
    },
    {
        id: 'ORD-2024-0004',
        date: '2024-01-10',
        status: 'cancelled',
        total: 8500,
        items: [
            { id: 5, name: 'Hand-Woven Silk Scarf', quantity: 1, price: 8500, image: 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=100' },
        ],
        shippingAddress: { fullName: 'Muzammil Hussain', city: 'Karachi' },
    },
];

const statusConfig = {
    pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-700', icon: Clock },
    processing: { label: 'Processing', color: 'bg-blue-100 text-blue-700', icon: Package },
    shipped: { label: 'Shipped', color: 'bg-purple-100 text-purple-700', icon: Truck },
    delivered: { label: 'Delivered', color: 'bg-green-100 text-green-700', icon: CheckCircle },
    cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-700', icon: XCircle },
};

export function OrderHistory() {
    const { user } = useAuth();
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [filterStatus, setFilterStatus] = useState('all');
    const [isCancelling, setIsCancelling] = useState(false);

    const fetchOrders = useCallback(async () => {
        if (!user) {
            setIsLoading(false);
            return;
        }
        setIsLoading(true);
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
                    const mappedOrders = ordersArray.map(o => ({
                        id: o.orderId || o.id,
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
                        shippingAddress: o.shippingAddress || { fullName: user.name, city: 'Unknown' },
                    }));
                    
                    // Sort by newest first
                    mappedOrders.sort((a, b) => new Date(b.date) - new Date(a.date));
                    
                    setOrders(mappedOrders.length > 0 ? mappedOrders : MOCK_ORDERS);
                } else if (raw !== null) {
                    setOrders([]);
                }
            } else {
                setOrders(MOCK_ORDERS);
            }
        } catch (error) {
            console.error('Failed to fetch orders:', error);
            setOrders(MOCK_ORDERS);
        }
        setIsLoading(false);
    }, [user]);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    const handleCancelOrder = async (orderId) => {
        if (!confirm('Are you sure you want to cancel this order? This action cannot be undone.')) return;
        setIsCancelling(true);
        try {
            const result = await ordersApi.cancel(orderId);
            if (result.success) {
                // Update local list
                setOrders(orders.map(o => o.id === orderId ? { ...o, status: 'cancelled' } : o));
                if (selectedOrder && selectedOrder.id === orderId) {
                    setSelectedOrder({ ...selectedOrder, status: 'cancelled' });
                }
            } else {
                alert(result.error || 'Failed to cancel the order. It might have already shipped.');
            }
        } catch (error) {
            console.error('Cancel order error:', error);
            alert('An error occurred while trying to cancel.');
        }
        setIsCancelling(false);
    };

    const filteredOrders = filterStatus === 'all'
        ? orders
        : orders.filter(o => o.status === filterStatus);

    if (!user) {
        return (
            <Layout>
                <div className="min-h-screen flex items-center justify-center">
                    <p className="text-stone-500">Please login to view your orders.</p>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="min-h-screen bg-stone-50 pt-28 pb-16">
                <div className="max-w-5xl mx-auto px-6">

                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-2xl font-serif text-stone-900">Order History</h1>
                            <p className="text-stone-500 text-sm mt-1">Track and manage your orders</p>
                        </div>
                        <Link to="/shop" className="text-ochre hover:underline text-sm font-medium">
                            Continue Shopping →
                        </Link>
                    </div>

                    {/* Filter Tabs */}
                    <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                        {['all', 'processing', 'shipped', 'delivered', 'cancelled'].map(status => (
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

                    {/* Orders List */}
                    {isLoading ? (
                        <div className="flex items-center justify-center py-20">
                            <Loader2 className="w-8 h-8 animate-spin text-stone-400" />
                            <span className="ml-2 text-stone-500">Loading orders...</span>
                        </div>
                    ) : filteredOrders.length === 0 ? (
                        <div className="bg-white rounded-xl border border-stone-200 p-12 text-center">
                            <Package className="w-12 h-12 text-stone-300 mx-auto mb-4" />
                            <p className="text-stone-500">No orders found</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {filteredOrders.map(order => {
                                const StatusIcon = statusConfig[order.status]?.icon || Package;
                                return (
                                    <div key={order.id} className="bg-white rounded-xl border border-stone-200 overflow-hidden">
                                        {/* Order Header */}
                                        <div className="flex flex-col md:flex-row md:items-center justify-between p-4 border-b border-stone-100 bg-stone-50/50">
                                            <div className="flex items-center gap-4">
                                                <div>
                                                    <p className="font-medium text-stone-900">{order.id}</p>
                                                    <p className="text-xs text-stone-500">Placed on {new Date(order.date).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4 mt-3 md:mt-0">
                                                <span className={clsx(
                                                    "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium",
                                                    statusConfig[order.status]?.color
                                                )}>
                                                    <StatusIcon className="w-3.5 h-3.5" />
                                                    {statusConfig[order.status]?.label}
                                                </span>
                                                <span className="font-semibold text-stone-900">Rs. {order.total.toLocaleString()}</span>
                                            </div>
                                        </div>

                                        {/* Order Items */}
                                        <div className="p-4">
                                            <div className="flex items-center gap-4">
                                                <div className="flex -space-x-3">
                                                    {order.items.slice(0, 3).map((item, idx) => (
                                                        <img
                                                            key={idx}
                                                            src={item.image}
                                                            alt={item.name}
                                                            className="w-12 h-12 rounded-lg object-cover border-2 border-white"
                                                        />
                                                    ))}
                                                    {order.items.length > 3 && (
                                                        <div className="w-12 h-12 rounded-lg bg-stone-100 border-2 border-white flex items-center justify-center text-xs font-medium text-stone-600">
                                                            +{order.items.length - 3}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-sm text-stone-700">
                                                        {order.items.map(i => i.name).join(', ').substring(0, 50)}
                                                        {order.items.map(i => i.name).join(', ').length > 50 ? '...' : ''}
                                                    </p>
                                                    <p className="text-xs text-stone-500 mt-0.5">
                                                        {order.items.length} item{order.items.length > 1 ? 's' : ''} • Ship to {order.shippingAddress.city}
                                                    </p>
                                                </div>
                                                <button
                                                    onClick={() => setSelectedOrder(order)}
                                                    className="flex items-center gap-1 text-sm text-ochre hover:underline"
                                                >
                                                    View Details <ChevronRight className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* Order Detail Modal */}
                    {selectedOrder && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                            <div className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm" onClick={() => setSelectedOrder(null)} />
                            <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[80vh] overflow-y-auto">
                                <div className="sticky top-0 bg-white border-b border-stone-200 p-4 flex items-center justify-between">
                                    <h3 className="text-lg font-medium text-stone-900">Order {selectedOrder.id}</h3>
                                    <button onClick={() => setSelectedOrder(null)} className="text-stone-400 hover:text-stone-600">
                                        ✕
                                    </button>
                                </div>

                                <div className="p-6 space-y-6">
                                    {/* Status */}
                                    <div className="flex items-center gap-3">
                                        <span className={clsx(
                                            "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium",
                                            statusConfig[selectedOrder.status]?.color
                                        )}>
                                            {statusConfig[selectedOrder.status]?.label}
                                        </span>
                                        <span className="text-sm text-stone-500">
                                            Ordered on {new Date(selectedOrder.date).toLocaleDateString('en-PK', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                                        </span>
                                    </div>

                                    {/* Items */}
                                    <div>
                                        <h4 className="font-medium text-stone-900 mb-3">Items ({selectedOrder.items.length})</h4>
                                        <div className="space-y-3">
                                            {selectedOrder.items.map((item, idx) => (
                                                <div key={idx} className="flex items-center gap-4 p-3 bg-stone-50 rounded-lg">
                                                    <img src={item.image} alt={item.name} className="w-16 h-16 rounded-lg object-cover" />
                                                    <div className="flex-1">
                                                        <p className="font-medium text-stone-900">{item.name}</p>
                                                        <p className="text-sm text-stone-500">Qty: {item.quantity}</p>
                                                    </div>
                                                    <p className="font-semibold text-stone-900">Rs. {item.price.toLocaleString()}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Shipping */}
                                    <div>
                                        <h4 className="font-medium text-stone-900 mb-2">Shipping Address</h4>
                                        <p className="text-stone-600">{selectedOrder.shippingAddress.fullName}</p>
                                        <p className="text-stone-500 text-sm">{selectedOrder.shippingAddress.city}</p>
                                    </div>

                                    {/* Total & Actions */}
                                    <div className="border-t border-stone-200 pt-4 space-y-4">
                                        <div className="flex items-center justify-between text-lg mb-4">
                                            <span className="font-medium text-stone-900">Total</span>
                                            <span className="font-bold text-stone-900">Rs. {selectedOrder.total.toLocaleString()}</span>
                                        </div>
                                        
                                        {/* Action Buttons */}
                                        {(selectedOrder.status === 'pending' || selectedOrder.status === 'processing') && (
                                            <div className="flex justify-end">
                                                <button
                                                    onClick={() => handleCancelOrder(selectedOrder.id)}
                                                    disabled={isCancelling}
                                                    className="flex items-center gap-2 px-6 py-2.5 bg-red-50 text-red-600 rounded-xl font-medium hover:bg-red-100 disabled:opacity-50 transition-colors"
                                                >
                                                    {isCancelling ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
                                                    Cancel Order
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </Layout>
    );
}
