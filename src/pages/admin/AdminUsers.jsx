import { useEffect, useState, useCallback } from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { adminApi } from '../../services/api';
import { User } from 'lucide-react';

const STATUS_BADGE = {
    ACTIVE: 'bg-green-500/20 text-green-400 border-green-500/30',
    SUSPENDED: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    BANNED: 'bg-red-500/20 text-red-400 border-red-500/30',
};
const ROLE_BADGE = {
    BUYER: 'bg-blue-500/20 text-blue-400',
    ARTISAN: 'bg-purple-500/20 text-purple-400',
    ADMIN: 'bg-amber-500/20 text-amber-400',
};

export function AdminUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [roleFilter, setRoleFilter] = useState('');

    useEffect(() => {
        setLoading(true);
        const params = {};
        if (roleFilter) params.role = roleFilter;
        adminApi.getUsers(params)
            .then(res => {
                const data = res?.data?.data?.content || res?.data?.content || [];
                setUsers(data);
            })
            .catch(err => console.error('Failed to fetch users:', err))
            .finally(() => setLoading(false));
    }, [roleFilter]);

    const handleStatus = async (id, newStatus) => {
        try { await adminApi.updateUserStatus(id, newStatus); } catch { }
        setUsers(prev => prev.map(u => u.id === id ? { ...u, accountStatus: newStatus } : u));
    };

    const filtered = roleFilter ? users.filter(u => u.role === roleFilter) : users;

    return (
        <AdminLayout>
            <div className="p-8">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-white">User Management</h1>
                        <p className="text-gray-400 mt-1">{filtered.length} user{filtered.length !== 1 ? 's' : ''} found</p>
                    </div>
                    <div className="flex gap-1 bg-gray-900 p-1 rounded-xl border border-gray-800">
                        {['', 'BUYER', 'ARTISAN'].map(r => (
                            <button
                                key={r}
                                onClick={() => setRoleFilter(r)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${roleFilter === r ? 'bg-amber-500 text-black shadow' : 'text-gray-400 hover:text-white'
                                    }`}
                            >{r || 'All'}</button>
                        ))}
                    </div>
                </div>

                <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-800 bg-gray-950/50">
                                <th className="text-left px-5 py-3 text-xs text-gray-500 font-semibold uppercase tracking-wider">User</th>
                                <th className="text-left px-5 py-3 text-xs text-gray-500 font-semibold uppercase tracking-wider">Role</th>
                                <th className="text-left px-5 py-3 text-xs text-gray-500 font-semibold uppercase tracking-wider">Status</th>
                                <th className="text-left px-5 py-3 text-xs text-gray-500 font-semibold uppercase tracking-wider">Joined</th>
                                <th className="text-left px-5 py-3 text-xs text-gray-500 font-semibold uppercase tracking-wider">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="5" className="px-5 py-10 text-center text-gray-500">Loading users...</td></tr>
                            ) : filtered.length === 0 ? (
                                <tr><td colSpan="5" className="px-5 py-10 text-center text-gray-500">No users found</td></tr>
                            ) : filtered.map((u, i) => (
                                <tr
                                    key={u.id}
                                    className={`border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors ${i === filtered.length - 1 ? 'border-none' : ''
                                        }`}
                                >
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-400/30 to-amber-600/30 border border-amber-500/20 flex items-center justify-center flex-shrink-0">
                                                <span className="text-amber-400 font-semibold text-sm">{u.name[0]}</span>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-white">{u.name}</p>
                                                <p className="text-xs text-gray-500">{u.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-5 py-4">
                                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${ROLE_BADGE[u.role]}`}>{u.role}</span>
                                    </td>
                                    <td className="px-5 py-4">
                                        <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${STATUS_BADGE[u.accountStatus] || STATUS_BADGE.ACTIVE}`}>
                                            {u.accountStatus || 'ACTIVE'}
                                        </span>
                                    </td>
                                    <td className="px-5 py-4 text-sm text-gray-500">
                                        {new Date(u.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-5 py-4">
                                        <select
                                            className="bg-gray-800 border border-gray-700 text-sm text-gray-300 rounded-lg px-3 py-1.5 focus:outline-none focus:border-amber-500 transition-colors cursor-pointer"
                                            value={u.accountStatus || 'ACTIVE'}
                                            onChange={e => handleStatus(u.id, e.target.value)}
                                        >
                                            <option value="ACTIVE">✅ Active</option>
                                            <option value="SUSPENDED">⏸ Suspend</option>
                                            <option value="BANNED">🚫 Ban</option>
                                        </select>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
}
