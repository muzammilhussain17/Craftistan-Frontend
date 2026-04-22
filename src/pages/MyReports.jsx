import { useState, useEffect } from 'react';
import { Layout } from '../components/layout/Layout';
import { useAuth } from '../context/AuthContext';
import { reportsApi } from '../services/api';
import { ShieldAlert, Clock, CheckCircle2, AlertTriangle, Loader2 } from 'lucide-react';

export function MyReports() {
    const { user } = useAuth();
    const [reports, setReports] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchReports = async () => {
            if (!user) return;
            setIsLoading(true);
            try {
                const result = await reportsApi.getMyReports();
                if (result.success) {
                    const pageData = result.data?.data ?? result.data;
                    const rData = pageData?.content ?? pageData;
                    setReports(Array.isArray(rData) ? rData : []);
                }
            } catch (err) {
                console.error('Failed to fetch reports', err);
            }
            setIsLoading(false);
        };
        fetchReports();
    }, [user]);

    const getStatusIcon = (status) => {
        switch (status?.toLowerCase()) {
            case 'resolved': return <CheckCircle2 className="w-5 h-5 text-green-500" />;
            case 'investigating': return <AlertTriangle className="w-5 h-5 text-ochre" />;
            default: return <Clock className="w-5 h-5 text-stone-400" />;
        }
    };

    return (
        <Layout>
            <div className="bg-stone-50 min-h-screen pt-24 pb-16">
                <div className="max-w-4xl mx-auto px-6">
                    <div className="mb-8 flex items-end justify-between">
                        <div>
                            <h1 className="text-3xl font-serif text-stone-900 mb-2">My Support Reports</h1>
                            <p className="text-stone-500">Track the status of items or users you have reported.</p>
                        </div>
                    </div>

                    {isLoading ? (
                        <div className="flex justify-center py-20">
                            <Loader2 className="w-8 h-8 animate-spin text-stone-400" />
                        </div>
                    ) : reports.length === 0 ? (
                        <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center shadow-sm">
                            <ShieldAlert className="w-16 h-16 text-stone-300 mx-auto mb-4" />
                            <h2 className="text-xl font-medium text-stone-900 mb-2">No reports filed</h2>
                            <p className="text-stone-500">You haven't submitted any reports. If you encounter an issue with a product or artisan, you can report it directly from the product page.</p>
                        </div>
                    ) : (
                        <div className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-stone-50 border-b border-stone-200 text-sm font-medium text-stone-500 uppercase tracking-wider">
                                        <th className="p-4 pl-6">ID</th>
                                        <th className="p-4">Reason</th>
                                        <th className="p-4">Description</th>
                                        <th className="p-4">Status</th>
                                        <th className="p-4 pr-6">Date</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-stone-100">
                                    {reports.map((r, i) => (
                                        <tr key={r.id || i} className="hover:bg-stone-50/50 transition-colors">
                                            <td className="p-4 pl-6 text-sm font-medium text-stone-900 border-t border-stone-200">
                                                #{r.id || 'N/A'}
                                            </td>
                                            <td className="p-4 text-sm text-stone-900 border-t border-stone-200">
                                                {r.reason || 'Report'}
                                            </td>
                                            <td className="p-4 text-sm text-stone-500 max-w-[200px] truncate border-t border-stone-200">
                                                {r.description || r.details}
                                            </td>
                                            <td className="p-4 border-t border-stone-200">
                                                <div className="flex items-center gap-2">
                                                    {getStatusIcon(r.status)}
                                                    <span className="text-sm font-medium capitalize text-stone-700">
                                                        {r.status?.toLowerCase() || 'Pending'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="p-4 pr-6 text-sm text-stone-500 border-t border-stone-200">
                                                {new Date(r.createdAt || Date.now()).toLocaleDateString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
}
