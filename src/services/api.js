// API Service for Craftistan Backend
// Using relative path — Vite dev proxy forwards /api → http://localhost:8080/api
const API_BASE_URL = '/api';

// Helper to get auth headers
const getAuthHeaders = () => {
    const token = localStorage.getItem('craftistan_token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
};

// Generic API call helper
const apiCall = async (endpoint, options = {}) => {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeaders(),
                ...options.headers,
            },
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || data.error || 'Request failed');
        }

        return { success: true, data };
    } catch (error) {
        return { success: false, error: error.message || 'Network error. Please try again.' };
    }
};

// Auth API
export const authApi = {
    login: async (email, password) => {
        return apiCall('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });
    },

    register: async (name, email, password, role = 'BUYER') => {
        return apiCall('/auth/register', {
            method: 'POST',
            body: JSON.stringify({ name, email, password, role }),
        });
    },

    getCurrentUser: async () => {
        return apiCall('/auth/me');
    },

    forgotPassword: async (email) => {
        return apiCall('/auth/forgot-password', {
            method: 'POST',
            body: JSON.stringify({ email }),
        });
    },

    verifyOtp: async (email, otp) => {
        return apiCall('/auth/verify-otp', {
            method: 'POST',
            body: JSON.stringify({ email, otp }),
        });
    },

    resetPassword: async (email, otp, newPassword) => {
        return apiCall('/auth/reset-password', {
            method: 'POST',
            body: JSON.stringify({ email, otp, newPassword }),
        });
    },
};

// Products API
export const productsApi = {
    getAll: async (params = {}) => {
        // Include language in request if not already present
        const lang = params.lang || getCurrentLanguage();
        const queryParams = { ...params, lang };
        const query = new URLSearchParams(queryParams).toString();
        return apiCall(`/products${query ? `?${query}` : ''}`);
    },

    getById: async (id, lang = null) => {
        const language = lang || getCurrentLanguage();
        return apiCall(`/products/${id}?lang=${language}`);
    },

    getByCategory: async (category, lang = null) => {
        const language = lang || getCurrentLanguage();
        return apiCall(`/products/category/${category}?lang=${language}`);
    },

    search: async (searchTerm, lang = null) => {
        const language = lang || getCurrentLanguage();
        return apiCall(`/products?search=${encodeURIComponent(searchTerm)}&lang=${language}`);
    },
};

// Helper to get current language from localStorage (synced with LanguageContext)
function getCurrentLanguage() {
    return localStorage.getItem('artisan_lang') || 'en';
}

// Categories API
export const categoriesApi = {
    getAll: async () => {
        return apiCall('/categories');
    },
};

// Profile API
export const profileApi = {
    get: async () => {
        return apiCall('/profile');
    },

    update: async (data) => {
        return apiCall('/profile', {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    },

    changePassword: async (currentPassword, newPassword) => {
        return apiCall('/profile/password', {
            method: 'PUT',
            body: JSON.stringify({ currentPassword, newPassword }),
        });
    },
};

// Addresses API
export const addressesApi = {
    getAll: async () => {
        return apiCall('/addresses');
    },

    create: async (address) => {
        return apiCall('/addresses', {
            method: 'POST',
            body: JSON.stringify(address),
        });
    },

    update: async (id, address) => {
        return apiCall(`/addresses/${id}`, {
            method: 'PUT',
            body: JSON.stringify(address),
        });
    },

    delete: async (id) => {
        return apiCall(`/addresses/${id}`, {
            method: 'DELETE',
        });
    },

    setDefault: async (id) => {
        return apiCall(`/addresses/${id}/default`, {
            method: 'PUT',
        });
    },
};

// Wishlist API
export const wishlistApi = {
    getAll: async () => {
        return apiCall('/wishlist');
    },

    add: async (productId) => {
        return apiCall(`/wishlist/${productId}`, {
            method: 'POST',
        });
    },

    remove: async (productId) => {
        return apiCall(`/wishlist/${productId}`, {
            method: 'DELETE',
        });
    },

    check: async (productId) => {
        return apiCall(`/wishlist/check/${productId}`);
    },

    clear: async () => {
        return apiCall('/wishlist', {
            method: 'DELETE',
        });
    },
};

// Orders API
export const ordersApi = {
    create: async (orderData) => {
        return apiCall('/orders', {
            method: 'POST',
            body: JSON.stringify(orderData),
        });
    },

    getAll: async () => {
        return apiCall('/orders');
    },

    getById: async (id) => {
        return apiCall(`/orders/${id}`);
    },

    cancel: async (id) => {
        return apiCall(`/orders/${id}/cancel`, {
            method: 'PUT',
        });
    },
};

// Reviews API
export const reviewsApi = {
    getForProduct: async (productId) => {
        return apiCall(`/products/${productId}/reviews`);
    },

    create: async (productId, review) => {
        return apiCall(`/products/${productId}/reviews`, {
            method: 'POST',
            body: JSON.stringify(review),
        });
    },

    update: async (reviewId, review) => {
        return apiCall(`/reviews/${reviewId}`, {
            method: 'PUT',
            body: JSON.stringify(review),
        });
    },

    delete: async (reviewId) => {
        return apiCall(`/reviews/${reviewId}`, {
            method: 'DELETE',
        });
    },

    markHelpful: async (reviewId) => {
        return apiCall(`/reviews/${reviewId}/helpful`, {
            method: 'POST',
        });
    },
};

// Artisan API
export const artisanApi = {
    getDashboard: async () => {
        return apiCall('/artisan/dashboard');
    },

    getProducts: async () => {
        return apiCall('/artisan/products');
    },

    createProduct: async (product) => {
        return apiCall('/artisan/products', {
            method: 'POST',
            body: JSON.stringify(product),
        });
    },

    updateProduct: async (id, product) => {
        return apiCall(`/artisan/products/${id}`, {
            method: 'PUT',
            body: JSON.stringify(product),
        });
    },

    deleteProduct: async (id) => {
        return apiCall(`/artisan/products/${id}`, {
            method: 'DELETE',
        });
    },

    getOrders: async () => {
        return apiCall('/artisan/orders');
    },

    updateOrderStatus: async (orderId, status) => {
        return apiCall(`/artisan/orders/${orderId}/status?status=${status}`, {
            method: 'PUT',
        });
    },
};

// Upload API
export const uploadApi = {
    uploadImage: async (file) => {
        const formData = new FormData();
        formData.append('file', file);

        const token = localStorage.getItem('craftistan_token');

        try {
            const response = await fetch(`${API_BASE_URL}/upload/image`, {
                method: 'POST',
                headers: {
                    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
                },
                body: formData,
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || data.error || 'Upload failed');
            }

            return { success: true, data };
        } catch (error) {
            return { success: false, error: error.message || 'Upload failed' };
        }
    },

    uploadImages: async (files) => {
        const formData = new FormData();
        Array.from(files).forEach(file => formData.append('files', file));

        const token = localStorage.getItem('craftistan_token');

        try {
            const response = await fetch(`${API_BASE_URL}/upload/images`, {
                method: 'POST',
                headers: {
                    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
                },
                body: formData,
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || data.error || 'Bulk upload failed');
            }

            return { success: true, data };
        } catch (error) {
            return { success: false, error: error.message || 'Bulk upload failed' };
        }
    },
};

// Chat API
export const chatApi = {
    sendMessage: async (message, sessionId = null, language = null) => {
        return apiCall('/chat/message', {
            method: 'POST',
            body: JSON.stringify({ message, sessionId, language }),
        });
    },

    clearSession: async (sessionId) => {
        return apiCall(`/chat/session/${sessionId}`, {
            method: 'DELETE',
        });
    },

    healthCheck: async () => {
        return apiCall('/chat/health');
    },
};

// Admin API
export const adminApi = {
    getStats: () => apiCall('/admin/stats'),

    // User Management
    getUsers: (params = {}) => apiCall(`/admin/users?${new URLSearchParams(params)}`),
    getUser: (id) => apiCall(`/admin/users/${id}`),
    updateUserStatus: (id, status) => apiCall(`/admin/users/${id}/status`, {
        method: 'PUT', body: JSON.stringify({ status }),
    }),

    // Artisan Verification
    getPendingArtisans: () => apiCall('/admin/artisans/pending'),
    verifyArtisan: (id, approved, notes = '') => apiCall(`/admin/artisans/${id}/verify`, {
        method: 'PUT', body: JSON.stringify({ approved, notes }),
    }),

    // Product Moderation
    getProducts: (params = {}) => apiCall(`/admin/products?${new URLSearchParams(params)}`),
    approveProduct: (id) => apiCall(`/admin/products/${id}/approve`, { method: 'PUT' }),
    rejectProduct: (id, notes) => apiCall(`/admin/products/${id}/reject`, {
        method: 'PUT', body: JSON.stringify({ notes }),
    }),
    toggleFeatured: (id) => apiCall(`/admin/products/${id}/feature`, { method: 'PUT' }),

    // Reviews
    hideReview: (id) => apiCall(`/admin/reviews/${id}`, { method: 'DELETE' }),
    flagReview: (id) => apiCall(`/admin/reviews/${id}/flag`, { method: 'PUT' }),

    // Reports
    getReports: (params = {}) => apiCall(`/admin/reports?${new URLSearchParams(params)}`),
    getReport: (id) => apiCall(`/admin/reports/${id}`),
    updateReportStatus: (id, status, resolutionNote = '') => apiCall(`/admin/reports/${id}/status`, {
        method: 'PUT', body: JSON.stringify({ status, resolutionNote }),
    }),
};

// Reports API (for all authenticated users)
export const reportsApi = {
    fileReport: (targetId, targetType, reason, description = '') => apiCall('/reports', {
        method: 'POST',
        body: JSON.stringify({ targetId, targetType, reason, description }),
    }),
    getMyReports: () => apiCall('/reports/my'),
};

// Notifications API
export const notificationsApi = {
    getMyNotifications: (params = {}) => apiCall(`/notifications?${new URLSearchParams(params)}`),
    getUnreadCount: () => apiCall('/notifications/unread-count'),
    markAsRead: (id) => apiCall(`/notifications/${id}/read`, { method: 'PUT' }),
    markAllAsRead: () => apiCall('/notifications/read-all', { method: 'PUT' }),
    deleteNotification: (id) => apiCall(`/notifications/${id}`, { method: 'DELETE' }),
};

export default {
    auth: authApi,
    products: productsApi,
    categories: categoriesApi,
    profile: profileApi,
    addresses: addressesApi,
    wishlist: wishlistApi,
    orders: ordersApi,
    reviews: reviewsApi,
    artisan: artisanApi,
    upload: uploadApi,
    chat: chatApi,
    admin: adminApi,
    reports: reportsApi,
    notifications: notificationsApi,
};

