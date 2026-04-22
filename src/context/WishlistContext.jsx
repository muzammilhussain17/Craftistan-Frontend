import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { wishlistApi } from '../services/api';
import { useAuth } from './AuthContext';

// Resolve backend image paths
const resolveImageUrl = (url) => {
    if (!url) return 'https://via.placeholder.com/400';
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    return url.startsWith('/') ? url : `/${url}`;
};

const WishlistContext = createContext(null);

export const WishlistProvider = ({ children }) => {
    const [wishlist, setWishlist] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const { user, token } = useAuth();

    // Fetch wishlist from backend when logged in
    const fetchWishlist = useCallback(async () => {
        if (!user || !token) {
            // Use localStorage for guests
            const saved = localStorage.getItem('craftistan_wishlist');
            if (saved) {
                try {
                    setWishlist(JSON.parse(saved));
                } catch (e) {
                    console.error('Failed to parse wishlist:', e);
                }
            }
            return;
        }

        setIsLoading(true);
        try {
            const result = await wishlistApi.getAll();
            if (result.success) {
                const raw = result.data;
                let itemsArray = null;

                if (Array.isArray(raw)) itemsArray = raw;
                else if (raw && Array.isArray(raw.content)) itemsArray = raw.content;
                else if (raw && Array.isArray(raw.data)) itemsArray = raw.data;
                else if (raw && raw.data && Array.isArray(raw.data.content)) itemsArray = raw.data.content;
                else if (raw && raw.data && Array.isArray(raw.data.data)) itemsArray = raw.data.data;
                
                if (itemsArray) {
                    const mappedItems = itemsArray.map(item => ({
                        ...item,
                        image: resolveImageUrl(item.productImage || item.image || item.product?.image || item.product?.images?.[0])
                    }));
                    setWishlist(mappedItems);
                } else if (raw !== null) {
                    setWishlist([]);
                }
            }
        } catch (error) {
            console.error('Failed to fetch wishlist:', error);
        }
        setIsLoading(false);
    }, [user, token]);

    // Load wishlist on mount or when auth changes
    useEffect(() => {
        fetchWishlist();
    }, [fetchWishlist]);

    // Save to localStorage for guests
    useEffect(() => {
        if (!user) {
            localStorage.setItem('craftistan_wishlist', JSON.stringify(wishlist));
        }
    }, [wishlist, user]);

    const addToWishlist = async (product) => {
        if (wishlist.find(item => item.id === product.id)) {
            return; // Already in wishlist
        }

        // Optimistic update
        setWishlist(prev => [...prev, product]);

        if (user && token) {
            try {
                const result = await wishlistApi.add(product.id);
                if (!result.success) {
                    // Revert on failure
                    setWishlist(prev => prev.filter(item => item.id !== product.id));
                }
            } catch (error) {
                // Revert on error
                setWishlist(prev => prev.filter(item => item.id !== product.id));
            }
        }
    };

    const removeFromWishlist = async (productId) => {
        const removedItem = wishlist.find(item => item.id === productId);

        // Optimistic update
        setWishlist(prev => prev.filter(item => item.id !== productId));

        if (user && token) {
            try {
                const result = await wishlistApi.remove(productId);
                if (!result.success && removedItem) {
                    // Revert on failure
                    setWishlist(prev => [...prev, removedItem]);
                }
            } catch (error) {
                if (removedItem) {
                    // Revert on error
                    setWishlist(prev => [...prev, removedItem]);
                }
            }
        }
    };

    const isInWishlist = (productId) => {
        return wishlist.some(item => item.id === productId);
    };

    const toggleWishlist = async (product) => {
        if (isInWishlist(product.id)) {
            await removeFromWishlist(product.id);
        } else {
            await addToWishlist(product);
        }
    };

    const clearWishlist = async () => {
        setWishlist([]);

        if (user && token) {
            try {
                await wishlistApi.clear();
            } catch (error) {
                console.error('Failed to clear wishlist:', error);
            }
        } else {
            localStorage.removeItem('craftistan_wishlist');
        }
    };

    return (
        <WishlistContext.Provider value={{
            wishlist,
            wishlistCount: wishlist.length,
            isLoading,
            addToWishlist,
            removeFromWishlist,
            isInWishlist,
            toggleWishlist,
            clearWishlist,
            refreshWishlist: fetchWishlist,
        }}>
            {children}
        </WishlistContext.Provider>
    );
};

export const useWishlist = () => {
    const context = useContext(WishlistContext);
    if (!context) throw new Error('useWishlist must be used within a WishlistProvider');
    return context;
};
