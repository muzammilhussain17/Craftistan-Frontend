import { useState, useEffect, useCallback, useRef } from 'react';
import { Layout } from '../components/layout/Layout';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { User, Mail, Lock, MapPin, Plus, Edit2, Trash2, Save, X, Camera, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { profileApi, addressesApi, uploadApi } from '../services/api';
import clsx from 'clsx';

export function ProfileSettings() {
    const { user, logout } = useAuth();
    const { t } = useLanguage();
    const [activeTab, setActiveTab] = useState('profile');
    const [isEditing, setIsEditing] = useState(false);
    const [showAddAddress, setShowAddAddress] = useState(false);

    // Profile form state
    const [profileData, setProfileData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: '',
        avatar: user?.avatar || null,
    });
    
    const fileInputRef = useRef(null);
    const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

    // Password form state
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    // Addresses state (mock data)
    const [addresses, setAddresses] = useState([
        { id: 1, label: 'Home', fullName: 'Muzammil Hussain', phone: '0300-1234567', address: '123 Main Street', city: 'Lahore', postalCode: '54000', isDefault: true },
        { id: 2, label: 'Office', fullName: 'Muzammil Hussain', phone: '0300-1234567', address: '456 Business Avenue', city: 'Lahore', postalCode: '54000', isDefault: false },
    ]);

    const [newAddress, setNewAddress] = useState({
        label: '', fullName: '', phone: '', address: '', city: '', postalCode: ''
    });

    const tabs = [
        { id: 'profile', label: 'Profile', icon: User },
        { id: 'password', label: 'Password', icon: Lock },
        { id: 'addresses', label: 'Addresses', icon: MapPin },
    ];

    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const { updateUser } = useAuth();

    // Fetch addresses from backend
    const fetchAddresses = useCallback(async () => {
        try {
            const result = await addressesApi.getAll();
            if (result.success) {
                const raw = result.data;
                let addressData = null;

                if (Array.isArray(raw)) addressData = raw;
                else if (raw && Array.isArray(raw.content)) addressData = raw.content;
                else if (raw && Array.isArray(raw.data)) addressData = raw.data;
                else if (raw && raw.data && Array.isArray(raw.data.content)) addressData = raw.data.content;
                else if (raw && raw.data && Array.isArray(raw.data.data)) addressData = raw.data.data;

                if (addressData) {
                    setAddresses(addressData);
                }
            }
        } catch (error) {
            console.error('Failed to fetch addresses:', error);
        }
    }, []);

    useEffect(() => {
        if (user) {
            fetchAddresses();
        }
    }, [user, fetchAddresses]);

    const handleProfileSave = async (e) => {
        e.preventDefault();
        setIsSaving(true);

        try {
            const result = await profileApi.update({
                name: profileData.name,
                phone: profileData.phone,
                avatar: profileData.avatar,
            });

            if (result.success) {
                // Update local user state
                updateUser({ name: profileData.name, avatar: profileData.avatar });
                setIsEditing(false);
                alert('Profile updated successfully!');
            } else {
                alert(result.error || 'Failed to update profile');
            }
        } catch (error) {
            console.error('Profile update error:', error);
            alert('Failed to update profile');
        }

        setIsSaving(false);
    };

    const handleAvatarUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploadingAvatar(true);
        try {
            const uploadRes = await uploadApi.uploadImage(file);
            if (uploadRes.success) {
                const imageUrl = uploadRes.data.url || uploadRes.data;
                setProfileData(prev => ({ ...prev, avatar: imageUrl }));
                
                // Immediately save the avatar to profile
                const updateRes = await profileApi.update({
                    name: profileData.name,
                    phone: profileData.phone,
                    avatar: imageUrl,
                });
                if (updateRes.success) {
                    updateUser({ avatar: imageUrl });
                }
            } else {
                alert(uploadRes.error || 'Failed to upload image');
            }
        } catch (err) {
            console.error('Avatar upload failed', err);
            alert('An error occurred during upload.');
        } finally {
            if (fileInputRef.current) fileInputRef.current.value = '';
            setIsUploadingAvatar(false);
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            alert('Passwords do not match!');
            return;
        }

        setIsSaving(true);

        try {
            const result = await profileApi.changePassword(
                passwordData.currentPassword,
                passwordData.newPassword
            );

            if (result.success) {
                setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                alert('Password changed successfully!');
            } else {
                alert(result.error || 'Failed to change password');
            }
        } catch (error) {
            console.error('Password change error:', error);
            alert('Failed to change password');
        }

        setIsSaving(false);
    };

    const handleAddAddress = async (e) => {
        e.preventDefault();
        setIsSaving(true);

        try {
            const result = await addressesApi.create(newAddress);

            if (result.success) {
                await fetchAddresses();
                setNewAddress({ label: '', fullName: '', phone: '', address: '', city: '', postalCode: '' });
                setShowAddAddress(false);
            } else {
                // Fallback: add locally
                const id = Date.now();
                setAddresses([...addresses, { ...newAddress, id, isDefault: false }]);
                setNewAddress({ label: '', fullName: '', phone: '', address: '', city: '', postalCode: '' });
                setShowAddAddress(false);
            }
        } catch (error) {
            console.error('Add address error:', error);
        }

        setIsSaving(false);
    };

    const handleDeleteAddress = async (id) => {
        if (confirm('Are you sure you want to delete this address?')) {
            try {
                const result = await addressesApi.delete(id);
                if (result.success) {
                    await fetchAddresses();
                } else {
                    setAddresses(addresses.filter(a => a.id !== id));
                }
            } catch (error) {
                setAddresses(addresses.filter(a => a.id !== id));
            }
        }
    };

    const handleSetDefault = async (id) => {
        try {
            const result = await addressesApi.setDefault(id);
            if (result.success) {
                await fetchAddresses();
            } else {
                setAddresses(addresses.map(a => ({ ...a, isDefault: a.id === id })));
            }
        } catch (error) {
            setAddresses(addresses.map(a => ({ ...a, isDefault: a.id === id })));
        }
    };

    if (!user) {
        return (
            <Layout>
                <div className="min-h-screen flex items-center justify-center">
                    <p className="text-stone-500">Please login to view your profile.</p>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="min-h-screen bg-stone-50 pt-28 pb-16">
                <div className="max-w-4xl mx-auto px-6">

                    {/* Header */}
                    <div className="flex items-center gap-6 mb-8">
                        <div className="relative">
                            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-ochre to-terracotta flex items-center justify-center text-white text-3xl font-bold overflow-hidden shadow-sm">
                                {profileData.avatar || user.avatar ? (
                                    <img src={profileData.avatar || user.avatar} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    user.name?.charAt(0).toUpperCase() || 'U'
                                )}
                            </div>
                            <input 
                                type="file" 
                                ref={fileInputRef} 
                                onChange={handleAvatarUpload} 
                                accept="image/*" 
                                className="hidden" 
                            />
                            <button 
                                onClick={() => fileInputRef.current?.click()}
                                disabled={isUploadingAvatar}
                                className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center text-stone-600 hover:text-ochre transition-colors disabled:opacity-50"
                            >
                                {isUploadingAvatar ? <Loader2 className="w-4 h-4 animate-spin" /> : <Camera className="w-4 h-4" />}
                            </button>
                        </div>
                        <div>
                            <h1 className="text-2xl font-serif text-stone-900">{user.name}</h1>
                            <p className="text-stone-500">{user.email}</p>
                            <span className="inline-block mt-1 px-3 py-1 bg-ochre/10 text-ochre text-xs font-medium rounded-full">
                                {user.role || 'BUYER'}
                            </span>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-2 mb-8 border-b border-stone-200">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={clsx(
                                    "flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors",
                                    activeTab === tab.id
                                        ? "border-ochre text-ochre"
                                        : "border-transparent text-stone-500 hover:text-stone-700"
                                )}
                            >
                                <tab.icon className="w-4 h-4" />
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Profile Tab */}
                    {activeTab === 'profile' && (
                        <div className="bg-white rounded-xl border border-stone-200 p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-lg font-medium text-stone-900">Personal Information</h2>
                                {!isEditing && (
                                    <Button variant="secondary" size="sm" onClick={() => setIsEditing(true)}>
                                        <Edit2 className="w-4 h-4 mr-2" /> Edit
                                    </Button>
                                )}
                            </div>

                            <form onSubmit={handleProfileSave} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-stone-700 mb-1">Full Name</label>
                                    <input
                                        type="text"
                                        value={profileData.name}
                                        onChange={e => setProfileData({ ...profileData, name: e.target.value })}
                                        disabled={!isEditing}
                                        className={clsx(
                                            "w-full px-4 py-2 border rounded-lg outline-none transition-all",
                                            isEditing ? "border-stone-300 focus:border-ochre focus:ring-2 focus:ring-ochre/20" : "border-transparent bg-stone-50"
                                        )}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-stone-700 mb-1">Email Address</label>
                                    <input
                                        type="email"
                                        value={profileData.email}
                                        onChange={e => setProfileData({ ...profileData, email: e.target.value })}
                                        disabled={!isEditing}
                                        className={clsx(
                                            "w-full px-4 py-2 border rounded-lg outline-none transition-all",
                                            isEditing ? "border-stone-300 focus:border-ochre focus:ring-2 focus:ring-ochre/20" : "border-transparent bg-stone-50"
                                        )}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-stone-700 mb-1">Phone Number</label>
                                    <input
                                        type="tel"
                                        value={profileData.phone}
                                        onChange={e => setProfileData({ ...profileData, phone: e.target.value })}
                                        disabled={!isEditing}
                                        placeholder="0300-1234567"
                                        className={clsx(
                                            "w-full px-4 py-2 border rounded-lg outline-none transition-all",
                                            isEditing ? "border-stone-300 focus:border-ochre focus:ring-2 focus:ring-ochre/20" : "border-transparent bg-stone-50"
                                        )}
                                    />
                                </div>

                                {isEditing && (
                                    <div className="flex gap-3 pt-4">
                                        <Button type="submit" variant="primary">
                                            <Save className="w-4 h-4 mr-2" /> Save Changes
                                        </Button>
                                        <Button type="button" variant="secondary" onClick={() => setIsEditing(false)}>
                                            Cancel
                                        </Button>
                                    </div>
                                )}
                            </form>
                        </div>
                    )}

                    {/* Password Tab */}
                    {activeTab === 'password' && (
                        <div className="bg-white rounded-xl border border-stone-200 p-6">
                            <h2 className="text-lg font-medium text-stone-900 mb-6">Change Password</h2>

                            <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
                                <div>
                                    <label className="block text-sm font-medium text-stone-700 mb-1">Current Password</label>
                                    <input
                                        type="password"
                                        value={passwordData.currentPassword}
                                        onChange={e => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                        required
                                        className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:border-ochre focus:ring-2 focus:ring-ochre/20 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-stone-700 mb-1">New Password</label>
                                    <input
                                        type="password"
                                        value={passwordData.newPassword}
                                        onChange={e => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                        required
                                        minLength={8}
                                        className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:border-ochre focus:ring-2 focus:ring-ochre/20 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-stone-700 mb-1">Confirm New Password</label>
                                    <input
                                        type="password"
                                        value={passwordData.confirmPassword}
                                        onChange={e => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                        required
                                        className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:border-ochre focus:ring-2 focus:ring-ochre/20 outline-none"
                                    />
                                </div>

                                <Button type="submit" variant="primary" className="mt-4">
                                    <Lock className="w-4 h-4 mr-2" /> Update Password
                                </Button>
                            </form>
                        </div>
                    )}

                    {/* Addresses Tab */}
                    {activeTab === 'addresses' && (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-medium text-stone-900">Saved Addresses</h2>
                                <Button variant="primary" size="sm" onClick={() => setShowAddAddress(true)}>
                                    <Plus className="w-4 h-4 mr-2" /> Add Address
                                </Button>
                            </div>

                            {/* Address Cards */}
                            <div className="grid md:grid-cols-2 gap-4">
                                {addresses.map(addr => (
                                    <div key={addr.id} className={clsx(
                                        "bg-white rounded-xl border p-5 relative",
                                        addr.isDefault ? "border-ochre" : "border-stone-200"
                                    )}>
                                        {addr.isDefault && (
                                            <span className="absolute top-3 right-3 px-2 py-0.5 bg-ochre/10 text-ochre text-xs font-medium rounded">
                                                Default
                                            </span>
                                        )}
                                        <p className="font-medium text-stone-900">{addr.label}</p>
                                        <p className="text-sm text-stone-600 mt-1">{addr.fullName}</p>
                                        <p className="text-sm text-stone-500">{addr.phone}</p>
                                        <p className="text-sm text-stone-500 mt-2">{addr.address}</p>
                                        <p className="text-sm text-stone-500">{addr.city}, {addr.postalCode}</p>

                                        <div className="flex gap-3 mt-4 pt-4 border-t border-stone-100">
                                            {!addr.isDefault && (
                                                <button
                                                    onClick={() => handleSetDefault(addr.id)}
                                                    className="text-xs text-ochre hover:underline"
                                                >
                                                    Set as Default
                                                </button>
                                            )}
                                            <button className="text-xs text-stone-500 hover:text-stone-700">
                                                <Edit2 className="w-3 h-3 inline mr-1" /> Edit
                                            </button>
                                            <button
                                                onClick={() => handleDeleteAddress(addr.id)}
                                                className="text-xs text-red-500 hover:text-red-700"
                                            >
                                                <Trash2 className="w-3 h-3 inline mr-1" /> Delete
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Add Address Modal */}
                            {showAddAddress && (
                                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                                    <div className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm" onClick={() => setShowAddAddress(false)} />
                                    <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg p-6">
                                        <button onClick={() => setShowAddAddress(false)} className="absolute top-4 right-4 text-stone-400 hover:text-stone-600">
                                            <X className="w-5 h-5" />
                                        </button>
                                        <h3 className="text-lg font-medium text-stone-900 mb-4">Add New Address</h3>

                                        <form onSubmit={handleAddAddress} className="space-y-4">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-stone-700 mb-1">Label</label>
                                                    <input
                                                        type="text"
                                                        placeholder="Home, Office, etc."
                                                        value={newAddress.label}
                                                        onChange={e => setNewAddress({ ...newAddress, label: e.target.value })}
                                                        required
                                                        className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:border-ochre outline-none text-sm"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-stone-700 mb-1">Full Name</label>
                                                    <input
                                                        type="text"
                                                        value={newAddress.fullName}
                                                        onChange={e => setNewAddress({ ...newAddress, fullName: e.target.value })}
                                                        required
                                                        className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:border-ochre outline-none text-sm"
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-stone-700 mb-1">Phone</label>
                                                <input
                                                    type="tel"
                                                    placeholder="0300-1234567"
                                                    value={newAddress.phone}
                                                    onChange={e => setNewAddress({ ...newAddress, phone: e.target.value })}
                                                    required
                                                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:border-ochre outline-none text-sm"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-stone-700 mb-1">Street Address</label>
                                                <input
                                                    type="text"
                                                    value={newAddress.address}
                                                    onChange={e => setNewAddress({ ...newAddress, address: e.target.value })}
                                                    required
                                                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:border-ochre outline-none text-sm"
                                                />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-stone-700 mb-1">City</label>
                                                    <input
                                                        type="text"
                                                        value={newAddress.city}
                                                        onChange={e => setNewAddress({ ...newAddress, city: e.target.value })}
                                                        required
                                                        className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:border-ochre outline-none text-sm"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-stone-700 mb-1">Postal Code</label>
                                                    <input
                                                        type="text"
                                                        value={newAddress.postalCode}
                                                        onChange={e => setNewAddress({ ...newAddress, postalCode: e.target.value })}
                                                        required
                                                        className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:border-ochre outline-none text-sm"
                                                    />
                                                </div>
                                            </div>

                                            <div className="flex gap-3 pt-4">
                                                <Button type="submit" variant="primary">Save Address</Button>
                                                <Button type="button" variant="secondary" onClick={() => setShowAddAddress(false)}>Cancel</Button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                </div>
            </div>
        </Layout>
    );
}
