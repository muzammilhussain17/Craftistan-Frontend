import { useEffect, useState, useCallback } from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { adminApi } from '../../services/api';
import { CheckCircle, XCircle, Star, Package } from 'lucide-react';

const STATUS_BADGE = {
    'PENDING': 'text-amber-500 border-amber-500 bg-amber-500/10',
    'APPROVED': 'text-green-500 border-green-500 bg-green-500/10',
    'REJECTED': 'text-red-500 border-red-500 bg-red-500/10'
};

export function AdminProducts() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filter, setFilter] = useState('PENDING');
    const [rejectModal, setRejectModal] = useState(null);
    const [rejectNotes, setRejectNotes] = useState('');

    // Fetch real data
    useEffect(() => {
        setLoading(true);
        adminApi.getProducts({ status: filter })
            .then(res => {
                const data = res?.data?.data?.content || res?.data?.content || [];
                setProducts(data);
            })
            .catch(err => console.error('Failed to fetch products:', err))
            .finally(() => setLoading(false));
    }, [filter]);

    const filtered = products.filter(p => p.approvalStatus === filter);

    const updateProduct = (id, changes) =>
        setProducts(prev => prev.map(p => p.id === id ? { ...p, ...changes } : p));

    const handleApprove = async (id) => {
        try { await adminApi.approveProduct(id); } catch { }
        updateProduct(id, { approvalStatus: 'APPROVED', adminNotes: null });
    };

    const handleReject = async () => {
        if (!rejectModal) return;
        try { await adminApi.rejectProduct(rejectModal, rejectNotes); } catch { }
        updateProduct(rejectModal, { approvalStatus: 'REJECTED', adminNotes: rejectNotes });
        setRejectModal(null);
        setRejectNotes('');
    };

    const handleFeature = async (id) => {
        try { await adminApi.toggleFeatured(id); } catch { }
        updateProduct(id, { isFeatured: !products.find(p => p.id === id)?.isFeatured });
    };

    return (
        <AdminLayout>
            <div className="p-8 max-w-5xl">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-white">Product Moderation</h1>
                        <p className="text-gray-400 mt-1">Approve or reject artisan product listings</p>
                    </div>
                    <div className="flex gap-1 bg-gray-900 p-1 rounded-xl border border-gray-800">
                        {['PENDING', 'APPROVED', 'REJECTED'].map(s => {
                            const count = products.filter(p => p.approvalStatus === s).length;
                            return (
                                <button
                                    key={s}
                                    onClick={() => setFilter(s)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filter === s ? 'bg-amber-500 text-black shadow' : 'text-gray-400 hover:text-white'
                                        }`}
                                >
                                    {s} <span className="opacity-60 text-xs ml-0.5">({count})</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {loading ? (
                    <div className="text-center py-10 text-gray-500">Loading products...</div>
                ) : filtered.length === 0 ? (
                    <div className="text-center py-20 border border-gray-800 rounded-2xl bg-gray-900">
                        <Package size={40} className="mx-auto mb-4 opacity-40 text-gray-500" />
                        <p className="text-gray-400">No {filter.toLowerCase()} products</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {filtered.map(p => (
                            <div key={p.id} className="bg-gray-900 border border-gray-800 rounded-2xl p-5 flex items-center gap-4 hover:border-gray-700 transition-colors">
                                {/* Thumbnail */}
                                <div className="w-16 h-16 rounded-xl bg-gray-800 flex items-center justify-center flex-shrink-0 overflow-hidden">
                                    {p.image
                                        ? <img src={p.image} alt="" className="w-full h-full object-cover" />
                                        : <Package size={24} className="text-gray-600" />
                                    }
                                </div>
                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <h3 className="font-semibold text-white">{p.name}</h3>
                                        <span className={`text-xs px-2 py-0.5 rounded-full border ${STATUS_BADGE[p.approvalStatus]}`}>{p.approvalStatus}</span>
                                        {p.isFeatured && <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/30">⭐ Featured</span>}
                                    </div>
                                    <p className="text-sm text-gray-400 mt-0.5">by <span className="text-gray-300">{p.artisanName}</span> · Rs. {p.price?.toLocaleString()} · {p.category}</p>
                                    {p.adminNotes && <p className="text-xs text-red-400 mt-1 italic">Admin note: {p.adminNotes}</p>}
                                </div>
                                {/* Actions */}
                                <div className="flex gap-2 flex-shrink-0">
                                    <button onClick={() => handleFeature(p.id)} title="Toggle Featured"
                                        className={`p-2 rounded-xl border transition-colors ${p.isFeatured ? 'border-purple-500 text-purple-400 bg-purple-500/10' : 'border-gray-700 text-gray-500 hover:border-purple-500 hover:text-purple-400'}`}
                                    ><Star size={15} /></button>
                                    {p.approvalStatus !== 'APPROVED' && (
                                        <button onClick={() => handleApprove(p.id)}
                                            className="flex items-center gap-1.5 px-3 py-2 bg-green-500/10 border border-green-500/30 text-green-400 rounded-xl text-sm hover:bg-green-500/20 font-medium transition-colors"
                                        ><CheckCircle size={14} />Approve</button>
                                    )}
                                    {p.approvalStatus !== 'REJECTED' && (
                                        <button onClick={() => setRejectModal(p.id)}
                                            className="flex items-center gap-1.5 px-3 py-2 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl text-sm hover:bg-red-500/20 font-medium transition-colors"
                                        ><XCircle size={14} />Reject</button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Reject Modal */}
                {rejectModal && (
                    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
                        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-md shadow-2xl">
                            <h3 className="text-lg font-semibold text-white mb-1">Reject Product</h3>
                            <p className="text-gray-400 text-sm mb-4">The reason will be shown to the artisan.</p>
                            <textarea
                                className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-white text-sm resize-none h-28 focus:outline-none focus:border-amber-500 transition-colors"
                                placeholder="Rejection reason..."
                                value={rejectNotes}
                                onChange={e => setRejectNotes(e.target.value)}
                            />
                            <div className="flex gap-3 mt-4">
                                <button onClick={() => setRejectModal(null)} className="flex-1 py-2.5 border border-gray-700 text-gray-400 rounded-xl text-sm hover:border-gray-500 transition-colors">Cancel</button>
                                <button onClick={handleReject} className="flex-1 py-2.5 bg-red-500 text-white rounded-xl text-sm font-medium hover:bg-red-600 transition-colors">Reject Product</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
