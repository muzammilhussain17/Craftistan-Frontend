import { useEffect, useState, useCallback } from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { adminApi } from '../../services/api';
import { Flag, CheckCircle, AlertTriangle } from 'lucide-react';

const STATUS_BADGE = {
    OPEN: 'bg-red-500/20 text-red-400 border-red-500/30',
    IN_PROGRESS: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    RESOLVED: 'bg-green-500/20 text-green-400 border-green-500/30',
};
const TARGET_BADGE = {
    PRODUCT: 'bg-blue-500/20 text-blue-400',
    USER: 'bg-purple-500/20 text-purple-400',
    REVIEW: 'bg-orange-500/20 text-orange-400',
    ORDER: 'bg-teal-500/20 text-teal-400',
};

export function AdminReports() {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filter, setFilter] = useState('OPEN');
    const [resolveModal, setResolveModal] = useState(null);
    const [resolution, setResolution] = useState('');

    useEffect(() => {
        setLoading(true);
        adminApi.getReports({ status: filter })
            .then(res => {
                const data = res?.data?.data?.content || res?.data?.content || [];
                setReports(data);
            })
            .catch(err => console.error('Failed to fetch reports:', err))
            .finally(() => setLoading(false));
    }, [filter]);

    const updateReport = (id, changes) =>
        setReports(prev => prev.map(r => r.id === id ? { ...r, ...changes } : r));

    const handleUpdateStatus = async (id, newStatus, note = '') => {
        try { await adminApi.updateReportStatus(id, newStatus, note); } catch { }
        updateReport(id, { status: newStatus, resolutionNote: note || null });
        setResolveModal(null);
        setResolution('');
    };

    const filtered = reports.filter(r => r.status === filter);

    return (
        <AdminLayout>
            <div className="p-4 md:p-8 max-w-5xl mx-auto">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-white">Reports & Disputes</h1>
                        <p className="text-gray-400 mt-1">Investigate and resolve platform disputes</p>
                    </div>
                    <div className="flex flex-wrap gap-1 bg-gray-900 p-1 rounded-xl border border-gray-800 w-full sm:w-auto">
                        {['OPEN', 'IN_PROGRESS', 'RESOLVED'].map(s => {
                            const count = reports.filter(r => r.status === s).length;
                            return (
                                <button
                                    key={s}
                                    onClick={() => setFilter(s)}
                                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${filter === s ? 'bg-amber-500 text-black shadow' : 'text-gray-400 hover:text-white'
                                        }`}
                                >{s.replace('_', ' ')} <span className="opacity-60 text-xs">({count})</span></button>
                            );
                        })}
                    </div>
                </div>

                {loading ? (
                    <div className="text-center py-10 text-gray-500">Loading reports...</div>
                ) : filtered.length === 0 ? (
                    <div className="text-center py-20 border border-gray-800 rounded-2xl bg-gray-900">
                        <CheckCircle size={48} className="mx-auto mb-4 text-green-400 opacity-50" />
                        <p className="text-white font-medium">All clear!</p>
                        <p className="text-gray-500 text-sm mt-1">No {filter.toLowerCase().replace('_', ' ')} reports</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {filtered.map(r => (
                            <div key={r.id} className="bg-gray-900 border border-gray-800 rounded-2xl p-4 md:p-5 hover:border-gray-700 transition-colors">
                                <div className="flex flex-col md:flex-row items-start justify-between gap-4">
                                    <div className="flex items-start gap-3 md:gap-4">
                                        <div className="p-2.5 bg-red-500/10 border border-red-500/30 rounded-xl mt-0.5 flex-shrink-0">
                                            <Flag size={16} className="text-red-400" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <span className="font-semibold text-white">{r.reason}</span>
                                                <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${STATUS_BADGE[r.status]}`}>{r.status}</span>
                                                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${TARGET_BADGE[r.targetType]}`}>{r.targetType}</span>
                                            </div>
                                            <p className="text-sm text-gray-400 mt-1">
                                                By <span className="text-gray-200">{r.reporterName}</span> · Target: <span className="text-gray-300 font-mono text-xs">{r.targetId}</span>
                                            </p>
                                            {r.description && (
                                                <p className="text-sm text-gray-500 mt-2 italic bg-gray-800/50 rounded-lg px-3 py-2">&ldquo;{r.description}&rdquo;</p>
                                            )}
                                            {r.resolutionNote && (
                                                <p className="text-sm text-green-400 mt-2 bg-green-500/10 border border-green-500/20 rounded-lg px-3 py-2">
                                                    ✅ Resolution: {r.resolutionNote}
                                                </p>
                                            )}
                                            <p className="text-xs text-gray-600 mt-2">{new Date(r.createdAt).toLocaleString()}</p>
                                        </div>
                                    </div>
                                    {r.status !== 'RESOLVED' && (
                                        <div className="flex flex-wrap gap-2 flex-shrink-0 w-full md:w-auto">
                                            {r.status === 'OPEN' && (
                                                <button
                                                    onClick={() => handleUpdateStatus(r.id, 'IN_PROGRESS')}
                                                    className="px-3 py-1.5 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-xl text-xs hover:bg-amber-500/20 font-medium transition-colors"
                                                >Investigate</button>
                                            )}
                                            <button
                                                onClick={() => setResolveModal(r.id)}
                                                className="px-3 py-1.5 bg-green-500/10 border border-green-500/30 text-green-400 rounded-xl text-xs hover:bg-green-500/20 font-medium transition-colors"
                                            >Resolve</button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Resolve Modal */}
                {resolveModal && (
                    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
                        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-md shadow-2xl">
                            <h3 className="text-lg font-semibold text-white mb-1">Resolve Report</h3>
                            <p className="text-gray-400 text-sm mb-4">Describe the actions taken to resolve this dispute.</p>
                            <textarea
                                className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-white text-sm resize-none h-28 focus:outline-none focus:border-amber-500 transition-colors"
                                placeholder="e.g. Product removed, user notified, account suspended..."
                                value={resolution}
                                onChange={e => setResolution(e.target.value)}
                            />
                            <div className="flex gap-3 mt-4">
                                <button onClick={() => setResolveModal(null)} className="flex-1 py-2.5 border border-gray-700 text-gray-400 rounded-xl text-sm hover:border-gray-500 transition-colors">Cancel</button>
                                <button
                                    onClick={() => handleUpdateStatus(resolveModal, 'RESOLVED', resolution)}
                                    className="flex-1 py-2.5 bg-green-500 text-white rounded-xl text-sm font-medium hover:bg-green-600 transition-colors"
                                >Mark Resolved</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
