import { useState, useRef, useEffect } from 'react';
import { Bell, Package, MessageSquare, Star, Check, X, Info } from 'lucide-react';
import clsx from 'clsx';
import { notificationsApi } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export function NotificationDropdown() {
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const dropdownRef = useRef(null);
    const { user } = useAuth(); // Assume we have auth context to check if logged in

    // Fetch notifications
    const fetchNotifications = async () => {
        if (!user) return;
        try {
            const result = await notificationsApi.getMyNotifications({ size: 10 });
            if (result.success && result.data?.content) {
                setNotifications(result.data.content);
            }
            
            const countResult = await notificationsApi.getUnreadCount();
            if (countResult.success) {
                setUnreadCount(countResult.data);
            }
        } catch (err) {
            console.error('Failed to fetch notifications', err);
        }
    };

    // Initial fetch
    useEffect(() => {
        fetchNotifications();
        
        // Optional: Polling every 30 seconds
        const intervalId = setInterval(fetchNotifications, 30000);
        return () => clearInterval(intervalId);
    }, [user]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [isOpen]);

    const markAsRead = async (id, isCurrentlyRead) => {
        if (isCurrentlyRead) return;
        try {
            const result = await notificationsApi.markAsRead(id);
            if (result.success) {
                setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
                setUnreadCount(prev => Math.max(0, prev - 1));
            }
        } catch (e) {
            console.error(e);
        }
    };

    const markAllAsRead = async () => {
        try {
            const result = await notificationsApi.markAllAsRead();
            if (result.success) {
                setNotifications(prev => prev.map(n => ({ ...n, read: true })));
                setUnreadCount(0);
            }
        } catch (e) {
            console.error(e);
        }
    };

    const deleteNotification = async (id) => {
        try {
            const result = await notificationsApi.deleteNotification(id);
            if (result.success) {
                const notifToDelete = notifications.find(n => n.id === id);
                setNotifications(prev => prev.filter(n => n.id !== id));
                if (notifToDelete && !notifToDelete.read) {
                    setUnreadCount(prev => Math.max(0, prev - 1));
                }
            }
        } catch (e) {
            console.error(e);
        }
    };

    const getIconInfo = (type) => {
        switch (type) {
            case 'ORDER': return { icon: Package, color: 'text-blue-500 bg-blue-50' };
            case 'MESSAGE': return { icon: MessageSquare, color: 'text-green-500 bg-green-50' };
            case 'REVIEW': return { icon: Star, color: 'text-ochre bg-ochre/10' };
            case 'SYSTEM': return { icon: Info, color: 'text-purple-500 bg-purple-50' };
            default: return { icon: Bell, color: 'text-stone-500 bg-stone-50' };
        }
    };

    const formatTime = (isoString) => {
        if (!isoString) return '';
        const d = new Date(isoString);
        return d.toLocaleDateString() + ' ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    if (!user) return null;

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Bell Button */}
            <button
                onClick={() => {
                    setIsOpen(!isOpen);
                    if (!isOpen && unreadCount > 0) {
                        fetchNotifications();
                    }
                }}
                className="relative p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-full transition-colors"
                aria-label="Notifications"
            >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-terracotta text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white pointer-events-none">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-stone-100 overflow-hidden z-50 transform origin-top-right transition-all">
                    {/* Header */}
                    <div className="flex items-center justify-between px-5 py-4 border-b border-stone-100 bg-stone-50/50">
                        <h3 className="font-medium text-stone-900">Notifications</h3>
                        {unreadCount > 0 && (
                            <button
                                onClick={markAllAsRead}
                                className="text-xs font-medium text-ochre hover:text-terracotta transition-colors flex items-center gap-1"
                            >
                                <Check className="w-3 h-3"/> Mark all read
                            </button>
                        )}
                    </div>

                    {/* Notifications List */}
                    <div className="max-h-[24rem] overflow-y-auto no-scrollbar">
                        {notifications.length === 0 ? (
                            <div className="p-8 text-center text-stone-400">
                                <Bell className="w-10 h-10 mx-auto mb-3 opacity-20" />
                                <p className="text-sm font-medium text-stone-500">No notifications yet</p>
                                <p className="text-xs mt-1">We'll let you know when things happen</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-stone-50">
                                {notifications.map(notification => {
                                    const { icon: Icon, color } = getIconInfo(notification.type);
                                    return (
                                        <div
                                            key={notification.id}
                                            className={clsx(
                                                "flex items-start gap-4 p-5 transition-colors cursor-pointer group",
                                                !notification.read ? "bg-ochre/5 hover:bg-ochre/10" : "bg-white hover:bg-stone-50"
                                            )}
                                            onClick={() => markAsRead(notification.id, notification.read)}
                                        >
                                            <div className={clsx(
                                                "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5",
                                                color
                                            )}>
                                                <Icon className="w-5 h-5" />
                                            </div>

                                            <div className="flex-1 min-w-0 pt-0.5">
                                                <div className="flex items-start justify-between gap-2 mb-1">
                                                    <p className={clsx(
                                                        "text-sm leading-tight pr-4",
                                                        !notification.read ? "font-semibold text-stone-900" : "font-medium text-stone-700"
                                                    )}>
                                                        {notification.title}
                                                    </p>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            deleteNotification(notification.id);
                                                        }}
                                                        className="opacity-0 group-hover:opacity-100 text-stone-400 hover:text-stone-600 transition-opacity p-1 -mr-2 -mt-1 hover:bg-stone-100 rounded"
                                                        aria-label="Dismiss"
                                                    >
                                                        <X className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>
                                                <p className={clsx(
                                                    "text-sm mt-1 mb-2 leading-relaxed whitespace-pre-wrap break-words",
                                                    !notification.read ? "text-stone-700 font-medium" : "text-stone-500"
                                                )}>
                                                    {notification.message}
                                                </p>
                                                <span className="text-[11px] font-medium text-stone-400">
                                                    {formatTime(notification.createdAt)}
                                                </span>
                                            </div>

                                            {!notification.read && (
                                                <div className="w-2 h-2 bg-terracotta rounded-full flex-shrink-0 mt-2 shadow-sm" />
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
