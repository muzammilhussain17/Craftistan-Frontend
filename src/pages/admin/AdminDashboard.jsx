import { useEffect, useState } from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { adminApi } from '../../services/api';
import { Users, Package, ShoppingCart, Flag, Shield, TrendingUp } from 'lucide-react';

const QUICK_ACTIONS = [
    { label: 'Pending Products', href: '/admin/products', color: 'amber' },
    { label: 'Pending Artisans', href: '/admin/artisans', color: 'purple' },
    { label: 'Open Reports', href: '/admin/reports', color: 'red' },
    { label: 'Total Users', href: '/admin/users', color: 'blue' },
];

const COLOR_MAP = {
    amber: { card: 'border-amber-500/30 bg-amber-500/5', icon: 'bg-amber-500/10 border-amber-500/30 text-amber-400', num: 'text-amber-400' },
    green: { card: 'border-green-500/30 bg-green-500/5', icon: 'bg-green-500/10 border-green-500/30 text-green-400', num: 'text-green-400' },
    red: { card: 'border-red-500/30 bg-red-500/5', icon: 'bg-red-500/10 border-red-500/30 text-red-400', num: 'text-red-400' },
    blue: { card: 'border-blue-500/30 bg-blue-500/5', icon: 'bg-blue-500/10 border-blue-500/30 text-blue-400', num: 'text-blue-400' },
    purple: { card: 'border-purple-500/30 bg-purple-500/5', icon: 'bg-purple-500/10 border-purple-500/30 text-purple-400', num: 'text-purple-400' },
};

function StatCard({ label, value, icon: Icon, color = 'amber', sub }) {
    const c = COLOR_MAP[color];
    return (
        <div className={`p-5 rounded-2xl border ${c.card} bg-gray-900`}>
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-gray-400 text-sm font-medium">{label}</p>
                    <p className="text-3xl font-bold text-white mt-1">{value?.toLocaleString() ?? '—'}</p>
                    {sub && <p className="text-xs text-gray-500 mt-1">{sub}</p>}
                </div>
                <div className={`p-3 rounded-xl border ${c.icon}`}>
                    <Icon size={20} />
                </div>
            </div>
        </div>
    );
}

export function AdminDashboard() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        adminApi.getStats()
            .then(res => {
                const data = res?.data?.data || res?.data;
                if (data) setStats(data);
            })
            .catch(err => console.error('Failed to fetch admin stats:', err))
            .finally(() => setLoading(false));
    }, []);

    return (
        <AdminLayout>
            <div className="p-4 md:p-8 max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-white">Dashboard Overview</h1>
                    <p className="text-gray-400 mt-1">Platform health at a glance</p>
                </div>

                {/* Stats Grid */}
                {loading ? (
                    <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-amber-500"></div></div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        <StatCard label="Total Buyers" value={stats?.totalBuyers || 0} icon={Users} color="blue" />
                        <StatCard
                            label="Total Artisans"
                            value={stats?.totalArtisans || 0}
                            icon={Shield}
                            color="purple"
                            sub={`${stats?.pendingArtisanVerifications || 0} pending verification`}
                        />
                        <StatCard label="Total Orders" value={stats?.totalOrders || 0} icon={ShoppingCart} color="green" />
                        <StatCard
                            label="Products Pending Approval"
                            value={stats?.pendingProducts || 0}
                            icon={Package}
                            color="amber"
                            sub={`${stats?.approvedProducts || 0} approved · ${stats?.rejectedProducts || 0} rejected`}
                        />
                        <StatCard label="Open Reports" value={stats?.openReports || 0} icon={Flag} color="red" />
                        <StatCard label="Total Products" value={stats?.totalProducts || 0} icon={TrendingUp} color="blue" />
                    </div>
                )}

                {/* Quick Actions */}
                <div className="mt-10">
                    <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {QUICK_ACTIONS.map(action => {
                            const c = COLOR_MAP[action.color];
                            let count = 0;
                            if (stats) {
                                if (action.label === 'Pending Products') count = stats.pendingProducts || 0;
                                else if (action.label === 'Pending Artisans') count = stats.pendingArtisanVerifications || 0;
                                else if (action.label === 'Open Reports') count = stats.openReports || 0;
                                else if (action.label === 'Total Users') count = (stats.totalBuyers || 0) + (stats.totalArtisans || 0);
                            }

                            return (
                                <a
                                    key={action.label}
                                    href={action.href}
                                    className={`flex flex-col gap-2 p-4 bg-gray-900 border rounded-2xl hover:scale-[1.02] transition-all ${c.card}`}
                                >
                                    <span className={`text-2xl font-bold ${c.num}`}>{loading ? '-' : count}</span>
                                    <span className="text-sm text-gray-300">{action.label}</span>
                                </a>
                            );
                        })}
                    </div>
                </div>


            </div>
        </AdminLayout>
    );
}
