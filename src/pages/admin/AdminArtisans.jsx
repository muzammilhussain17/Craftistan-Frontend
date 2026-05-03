import { useEffect, useState, useCallback } from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { adminApi } from '../../services/api';
import { CheckCircle, XCircle, User, Clock } from 'lucide-react';

export function AdminArtisans() {
    const [artisans, setArtisans] = useState([]);
    const [loading, setLoading] = useState(false);
    const [rejectModal, setRejectModal] = useState(null);
    const [notes, setNotes] = useState('');
    const [actionDone, setActionDone] = useState({});

    const fetchArtisans = useCallback(async () => {
        setLoading(true);
        try {
            const res = await adminApi.getPendingArtisans();
            if (res?.success) {
                const data = res.data?.data?.content || res.data?.content || [];
                setArtisans(data);
            }
        } catch (err) {
            console.error('Failed to fetch artisans:', err);
        }
        setLoading(false);
    }, []);

    useEffect(() => { fetchArtisans(); }, [fetchArtisans]);

    const handleVerify = async (id, approved) => {
        try { await adminApi.verifyArtisan(id, approved, notes); } catch { }
        setActionDone(prev => ({ ...prev, [id]: approved ? 'approved' : 'rejected' }));
        setRejectModal(null);
        setNotes('');
    };

    const pending = artisans.filter(a => !actionDone[a.id]);
    const done = artisans.filter(a => actionDone[a.id]);

    return (
        <AdminLayout>
            <div className="p-4 md:p-8 max-w-5xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-white">Artisan Verification</h1>
                    <p className="text-gray-400 mt-1">Review artisan applications before they can list products publicly</p>
                </div>

                {/* Pending count badge */}
                {pending.length > 0 && (
                    <div className="mb-5 flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 rounded-xl px-4 py-3">
                        <Clock size={16} className="text-amber-400" />
                        <span className="text-amber-300 text-sm font-medium">{pending.length} artisan{pending.length > 1 ? 's' : ''} awaiting verification</span>
                    </div>
                )}

                {/* Pending artisans */}
                <div className="space-y-3">
                    {pending.map(a => (
                        <div key={a.id} className="bg-gray-900 border border-gray-800 rounded-2xl p-4 md:p-5 flex flex-col md:flex-row items-start md:items-center gap-4 hover:border-gray-700 transition-colors">
                            <div className="flex gap-4 w-full md:w-auto md:flex-1 min-w-0">
                                <div className="w-12 h-12 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center flex-shrink-0">
                                    <span className="text-amber-400 font-bold text-lg">{a.name[0]}</span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold text-white">{a.name}</h3>
                                    <p className="text-sm text-gray-400">{a.email} · {a.phone || 'No phone'}</p>
                                    <div className="flex flex-wrap gap-2 md:gap-3 mt-1 text-xs text-gray-500">
                                        {a.region && <span>📍 {a.region}</span>}
                                        {a.craftSpecialty && <span>🎨 {a.craftSpecialty}</span>}
                                        <span>Joined {new Date(a.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-2 flex-shrink-0 w-full md:w-auto md:justify-end">
                                <button
                                    onClick={() => handleVerify(a.id, true)}
                                    className="flex items-center gap-1.5 px-4 py-2 bg-green-500/10 border border-green-500/30 text-green-400 rounded-xl text-sm hover:bg-green-500/20 transition-colors font-medium"
                                ><CheckCircle size={15} />Approve</button>
                                <button
                                    onClick={() => setRejectModal(a.id)}
                                    className="flex items-center gap-1.5 px-4 py-2 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl text-sm hover:bg-red-500/20 transition-colors font-medium"
                                ><XCircle size={15} />Reject</button>
                            </div>
                        </div>
                    ))}

                    {pending.length === 0 && !loading && (
                        <div className="text-center py-20 border border-gray-800 rounded-2xl bg-gray-900">
                            <CheckCircle size={48} className="mx-auto mb-4 text-green-400 opacity-50" />
                            <p className="text-white font-medium">All caught up!</p>
                            <p className="text-gray-500 text-sm mt-1">No pending artisan verifications</p>
                        </div>
                    )}

                    {loading && <div className="text-center py-10 text-gray-500">Loading artisans...</div>}
                </div>

                {/* Already actioned */}
                {done.length > 0 && (
                    <div className="mt-6">
                        <p className="text-xs text-gray-600 uppercase tracking-wider mb-3">Actioned this session</p>
                        <div className="space-y-2">
                            {done.map(a => (
                                <div key={a.id} className="bg-gray-900/50 border border-gray-800 rounded-xl px-4 py-3 flex items-center gap-3 opacity-60">
                                    <span className="text-sm text-gray-300">{a.name}</span>
                                    {actionDone[a.id] === 'approved'
                                        ? <span className="text-xs px-2 py-0.5 rounded bg-green-500/20 text-green-400">Approved</span>
                                        : <span className="text-xs px-2 py-0.5 rounded bg-red-500/20 text-red-400">Rejected</span>}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Reject Modal */}
                {rejectModal && (
                    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
                        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-md shadow-2xl">
                            <h3 className="text-lg font-semibold text-white mb-1">Reject Application</h3>
                            <p className="text-gray-400 text-sm mb-4">The reason will be shown to the artisan.</p>
                            <textarea
                                className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-white text-sm resize-none h-24 focus:outline-none focus:border-amber-500 transition-colors"
                                placeholder="Reason for rejection (optional)..."
                                value={notes}
                                onChange={e => setNotes(e.target.value)}
                            />
                            <div className="flex gap-3 mt-4">
                                <button onClick={() => setRejectModal(null)} className="flex-1 py-2.5 border border-gray-700 text-gray-400 rounded-xl text-sm hover:border-gray-500 transition-colors">Cancel</button>
                                <button onClick={() => handleVerify(rejectModal, false)} className="flex-1 py-2.5 bg-red-500 text-white rounded-xl text-sm font-medium hover:bg-red-600 transition-colors">Reject</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
