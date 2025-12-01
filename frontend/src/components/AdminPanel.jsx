import React, { useEffect, useState } from 'react';
import { fetchAllUsers } from '../api';
import { Users, MapPin, Shield } from 'lucide-react';

const AdminPanel = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadUsers = async () => {
            const data = await fetchAllUsers();
            setUsers(data);
            setLoading(false);
        };
        loadUsers();
    }, []);

    if (loading) return <div className="p-8 text-center text-white">Loading Admin Data...</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 py-16">
            <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-red-500/10 rounded-xl">
                    <Shield className="w-8 h-8 text-red-500" />
                </div>
                <div>
                    <h2 className="text-3xl font-bold text-white">Admin Dashboard</h2>
                    <p className="text-text-secondary">Manage registered users and view database records.</p>
                </div>
            </div>

            <div className="bg-surface border border-gray-800 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-800/50 text-text-secondary uppercase text-xs font-bold">
                            <tr>
                                <th className="px-6 py-4">ID</th>
                                <th className="px-6 py-4">Username</th>
                                <th className="px-6 py-4">Full Name</th>
                                <th className="px-6 py-4">Location</th>
                                <th className="px-6 py-4">Role</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800">
                            {users.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-800/30 transition-colors">
                                    <td className="px-6 py-4 text-text-secondary">#{user.id}</td>
                                    <td className="px-6 py-4 font-medium text-white flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                                            {user.username[0].toUpperCase()}
                                        </div>
                                        {user.username}
                                    </td>
                                    <td className="px-6 py-4 text-gray-300">{user.full_name}</td>
                                    <td className="px-6 py-4 text-gray-300 flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-gray-500" />
                                        {user.location}
                                    </td>
                                    <td className="px-6 py-4">
                                        {user.username === 'admin' ? (
                                            <span className="bg-red-500/10 text-red-500 px-2 py-1 rounded text-xs font-bold border border-red-500/20">
                                                ADMIN
                                            </span>
                                        ) : (
                                            <span className="bg-blue-500/10 text-blue-500 px-2 py-1 rounded text-xs font-bold border border-blue-500/20">
                                                USER
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {users.length === 0 && (
                    <div className="p-8 text-center text-text-secondary">No users found.</div>
                )}
            </div>
        </div>
    );
};

export default AdminPanel;
