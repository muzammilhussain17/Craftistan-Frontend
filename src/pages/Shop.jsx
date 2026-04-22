import { useState, useMemo, useEffect, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { PRODUCTS as FALLBACK_PRODUCTS, CATEGORIES as FALLBACK_CATEGORIES, FILTERS } from '../data/products';
import { productsApi, categoriesApi } from '../services/api';
import { Star, Filter, ChevronDown, X, ShoppingBag, Heart, Loader2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useWishlist } from '../context/WishlistContext';
import clsx from 'clsx';

// Resolve backend image paths — relative paths are proxied via Vite → localhost:8080
const resolveImageUrl = (url) => {
    if (!url) return 'https://via.placeholder.com/400';
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    // Relative path like /uploads/... — served via Vite proxy
    return url.startsWith('/') ? url : `/${url}`;
};

export function Shop() {
    const { t, currentLang } = useLanguage();
    const [searchParams, setSearchParams] = useSearchParams();

    // Derive BOTH search and category directly from URL — never from separate state
    // This is the single source of truth so fetchProducts always has fresh values
    const searchQuery = searchParams.get('search') || '';
    const selectedCategory = searchParams.get('category') || 'all';

    const [products, setProducts] = useState(FALLBACK_PRODUCTS);
    const [categories, setCategories] = useState(FALLBACK_CATEGORIES);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const [selectedPriceRange, setSelectedPriceRange] = useState(null);
    const [selectedStyles, setSelectedStyles] = useState([]);
    const [sortBy, setSortBy] = useState('newest');
    const [showFilters, setShowFilters] = useState(false);

    // Fetch products from API
    const fetchProducts = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const params = {};
            if (searchQuery) params.search = searchQuery;
            if (selectedCategory !== 'all') params.category = selectedCategory;

            const result = await productsApi.getAll(params);

            // Log the raw response so you can inspect it in the browser console
            console.log('[Craftistan] Raw API response:', JSON.stringify(result, null, 2));

            if (result.success) {
                // Universal extractor — handles every common Spring Boot response shape:
                // 1. { data: { content: [] } }    ← ApiResponse wrapping a Page
                // 2. { data: [] }                 ← ApiResponse wrapping a plain array
                // 3. { content: [] }              ← Direct Spring Page
                // 4. []                           ← Direct array
                // 5. { success: true, data: [] }  ← Custom wrapper inside data
                const raw = result.data;
                let productArray = null;

                if (Array.isArray(raw)) {
                    productArray = raw;
                } else if (raw && Array.isArray(raw.content)) {
                    productArray = raw.content;
                } else if (raw && Array.isArray(raw.data)) {
                    productArray = raw.data;
                } else if (raw && raw.data && Array.isArray(raw.data.content)) {
                    productArray = raw.data.content;
                } else if (raw && raw.data && Array.isArray(raw.data.data)) {
                    productArray = raw.data.data;
                } else if (raw && raw.data && Array.isArray(raw.data.data?.content)) {
                    productArray = raw.data.data.content;
                }

                console.log('[Craftistan] Extracted product array:', productArray);

                if (productArray && productArray.length > 0) {
                    // SUCCESS — real products from database
                    const mappedProducts = productArray.map(p => ({
                        id: p.id,
                        name: p.name,
                        price: typeof p.price === 'number' ? p.price : parseFloat(p.price) || 0,
                        category: p.category,
                        style: p.style || 'classic',
                        image: resolveImageUrl(p.image || (p.images && p.images[0])),
                        artisan: p.artisanName || p.sellerName || p.artisan || 'Craftistan Artisan',
                        rating: p.rating || 4.5,
                        isNew: p.isNew || p.newArrival || false,
                        description: p.description,
                        stock: p.stock || p.quantity || 0,
                    }));
                    setProducts(mappedProducts);
                    console.log('[Craftistan] ✅ Loaded', mappedProducts.length, 'products from backend');
                } else if (productArray !== null) {
                    // Backend is reachable but has no products yet — show empty, NOT dummy data
                    console.log('[Craftistan] Backend connected — no products in database yet');
                    setProducts([]);
                } else {
                    // Could not extract array from response — log the shape so we can fix it
                    console.warn('[Craftistan] ⚠️ Could not extract product array from response. Raw shape:', raw);
                    console.warn('[Craftistan] Please check the backend response structure and update the extractor above.');
                    // Only fall back to dummy data when we truly cannot parse the response
                    setProducts(FALLBACK_PRODUCTS);
                }
            } else {
                // API call returned an error (non-2xx or network failure)
                console.error('[Craftistan] API error:', result.error);
                // Fall back to dummy data only when backend is unreachable
                setProducts(FALLBACK_PRODUCTS);
            }
        } catch (err) {
            console.error('[Craftistan] Network error:', err);
            setProducts(FALLBACK_PRODUCTS);
        }

        setIsLoading(false);
    }, [searchQuery, selectedCategory, currentLang]);

    // Fetch categories from API
    const fetchCategories = useCallback(async () => {
        try {
            const result = await categoriesApi.getAll();

            if (result.success && result.data) {
                const categoryData = result.data.data || result.data;
                if (Array.isArray(categoryData) && categoryData.length > 0) {
                    const mappedCategories = categoryData.map(c => ({
                        id: c.slug || c.id,
                        name: c.name,
                        icon: c.icon || '📦',
                    }));
                    setCategories(mappedCategories);
                }
            }
        } catch (err) {
            console.log('Using fallback categories');
        }
    }, []);

    // fetchProducts re-runs whenever URL-derived values change (no stale closure)
    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    // Category buttons update the URL instead of local state
    const setSelectedCategory = (cat) => {
        const newParams = new URLSearchParams(searchParams);
        if (cat === 'all') {
            newParams.delete('category');
        } else {
            newParams.set('category', cat);
        }
        setSearchParams(newParams);
    };

    const filteredProducts = useMemo(() => {
        let result = [...products];

        // Filter by price range (client-side)
        if (selectedPriceRange) {
            const range = FILTERS.priceRanges.find(r => r.id === selectedPriceRange);
            if (range) {
                result = result.filter(p => p.price >= range.min && p.price < range.max);
            }
        }

        // Filter by styles (client-side)
        if (selectedStyles.length > 0) {
            result = result.filter(p => selectedStyles.includes(p.style));
        }

        // Sort
        switch (sortBy) {
            case 'newest':
                result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
                break;
            case 'oldest':
                result.sort((a, b) => (a.isNew ? 1 : 0) - (b.isNew ? 1 : 0));
                break;
            case 'price-low':
                result.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                result.sort((a, b) => b.price - a.price);
                break;
            case 'popular':
                result.sort((a, b) => b.rating - a.rating);
                break;
            default:
                break;
        }

        return result;
    }, [products, selectedPriceRange, selectedStyles, sortBy]);

    const toggleStyle = (styleId) => {
        setSelectedStyles(prev =>
            prev.includes(styleId)
                ? prev.filter(s => s !== styleId)
                : [...prev, styleId]
        );
    };

    const clearFilters = () => {
        setSelectedCategory('all');
        setSelectedPriceRange(null);
        setSelectedStyles([]);
        setSortBy('newest');
        // Clear search from URL
        const newParams = new URLSearchParams(searchParams);
        newParams.delete('search');
        newParams.delete('category');
        setSearchParams(newParams);
    };

    const activeFilterCount = (selectedCategory !== 'all' ? 1 : 0) + (selectedPriceRange ? 1 : 0) + selectedStyles.length + (searchQuery ? 1 : 0);

    return (
        <Layout>
            <div className="min-h-screen bg-stone-50 pt-28 pb-16">
                <div className="max-w-7xl mx-auto px-6">

                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-4xl font-serif text-stone-900 mb-2">{t('shopTitle')}</h1>
                        {searchQuery ? (
                            <div className="flex items-center gap-2">
                                <p className="text-stone-500">
                                    {t('searchResults') || 'Showing results for'}: <span className="font-medium text-stone-700">"{searchQuery}"</span>
                                </p>
                                <span className="text-stone-400">({filteredProducts.length} {t('items')})</span>
                                <button
                                    onClick={() => {
                                        const newParams = new URLSearchParams(searchParams);
                                        newParams.delete('search');
                                        setSearchParams(newParams);
                                    }}
                                    className="ml-2 text-ochre hover:underline text-sm"
                                >
                                    {t('clearFilters')}
                                </button>
                            </div>
                        ) : (
                            <p className="text-stone-500">{t('heroSubtitle')}</p>
                        )}
                    </div>

                    {/* Categories */}
                    <div className="flex flex-wrap gap-3 mb-8">
                        <button
                            onClick={() => setSelectedCategory('all')}
                            className={clsx(
                                "px-4 py-2 rounded-full text-sm font-medium transition-all",
                                selectedCategory === 'all'
                                    ? "bg-stone-900 text-white"
                                    : "bg-white border border-stone-200 text-stone-600 hover:border-stone-400"
                            )}
                        >
                            {t('allProducts')}
                        </button>
                        {categories.map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => setSelectedCategory(cat.id)}
                                className={clsx(
                                    "px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2",
                                    selectedCategory === cat.id
                                        ? "bg-stone-900 text-white"
                                        : "bg-white border border-stone-200 text-stone-600 hover:border-stone-400"
                                )}
                            >
                                <span>{cat.icon}</span>
                                {cat.name}
                            </button>
                        ))}
                    </div>

                    {/* Filter Bar */}
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-8 p-4 bg-white rounded-xl border border-stone-100">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className="flex items-center gap-2 px-4 py-2 bg-stone-100 rounded-lg text-sm font-medium text-stone-700 hover:bg-stone-200 transition-colors"
                            >
                                <Filter className="w-4 h-4" />
                                Filters
                                {activeFilterCount > 0 && (
                                    <span className="w-5 h-5 flex items-center justify-center bg-stone-900 text-white text-xs rounded-full">
                                        {activeFilterCount}
                                    </span>
                                )}
                            </button>

                            {activeFilterCount > 0 && (
                                <button
                                    onClick={clearFilters}
                                    className="text-sm text-stone-500 hover:text-stone-700 underline"
                                >
                                    Clear all
                                </button>
                            )}
                        </div>

                        <div className="flex items-center gap-2">
                            <span className="text-sm text-stone-500">Sort by:</span>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="bg-transparent border border-stone-200 rounded-lg px-3 py-2 text-sm text-stone-700 focus:outline-none focus:ring-2 focus:ring-stone-200"
                            >
                                {FILTERS.sortOptions.map(opt => (
                                    <option key={opt.id} value={opt.id}>{opt.label}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Expandable Filters Panel */}
                    {showFilters && (
                        <div className="mb-8 p-6 bg-white rounded-xl border border-stone-100 grid md:grid-cols-2 gap-6">
                            {/* Price Range */}
                            <div>
                                <h3 className="text-sm font-medium text-stone-900 mb-3">Price Range</h3>
                                <div className="flex flex-wrap gap-2">
                                    {FILTERS.priceRanges.map(range => (
                                        <button
                                            key={range.id}
                                            onClick={() => setSelectedPriceRange(selectedPriceRange === range.id ? null : range.id)}
                                            className={clsx(
                                                "px-3 py-1.5 rounded-full text-xs font-medium transition-all",
                                                selectedPriceRange === range.id
                                                    ? "bg-ochre text-white"
                                                    : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                                            )}
                                        >
                                            {range.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Styles */}
                            <div>
                                <h3 className="text-sm font-medium text-stone-900 mb-3">Style</h3>
                                <div className="flex flex-wrap gap-2">
                                    {FILTERS.styles.map(style => (
                                        <button
                                            key={style.id}
                                            onClick={() => toggleStyle(style.id)}
                                            className={clsx(
                                                "px-3 py-1.5 rounded-full text-xs font-medium transition-all",
                                                selectedStyles.includes(style.id)
                                                    ? "bg-terracotta text-white"
                                                    : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                                            )}
                                        >
                                            {style.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Results Count */}
                    <p className="text-sm text-stone-500 mb-6">
                        Showing <strong>{filteredProducts.length}</strong> products
                    </p>

                    {/* Loading State */}
                    {isLoading ? (
                        <div className="flex items-center justify-center py-20">
                            <Loader2 className="w-8 h-8 animate-spin text-stone-400" />
                            <span className="ml-2 text-stone-500">Loading products...</span>
                        </div>
                    ) : (
                        /* Product Grid */
                        filteredProducts.length > 0 ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                {filteredProducts.map(product => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-16">
                                {products.length === 0 ? (
                                    <>
                                        <p className="text-stone-500 text-lg mb-2">No products in the database yet.</p>
                                        <p className="text-stone-400 text-sm">Add products from the Artisan dashboard and they will appear here.</p>
                                    </>
                                ) : (
                                    <>
                                        <p className="text-stone-500 text-lg">No products match your filters.</p>
                                        <button onClick={clearFilters} className="mt-4 text-ochre underline">Clear filters</button>
                                    </>
                                )}
                            </div>
                        )
                    )}
                </div>
            </div>
        </Layout>
    );
}

function ProductCard({ product }) {
    const { isInWishlist, toggleWishlist } = useWishlist();
    const isFavourite = isInWishlist(product.id);

    const handleFavourite = (e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleWishlist(product);
    };

    return (
        <Link to={`/product/${product.id}`} className="group bg-white rounded-xl overflow-hidden border border-stone-100 hover:shadow-lg transition-all duration-300 block">
            <div className="relative aspect-square overflow-hidden">
                <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/400?text=Product';
                    }}
                />
                {product.isNew && (
                    <span className="absolute top-3 left-3 bg-ochre text-white text-xs font-medium px-2 py-1 rounded-full">
                        New
                    </span>
                )}
                {/* Favourite Button */}
                <button
                    onClick={handleFavourite}
                    className={clsx(
                        "absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-all shadow-md",
                        isFavourite
                            ? "bg-red-500 text-white"
                            : "bg-white/90 backdrop-blur-sm text-stone-500 hover:text-red-500"
                    )}
                >
                    <Heart className={clsx("w-4 h-4", isFavourite && "fill-current")} />
                </button>
                <div className="absolute bottom-3 right-3 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md">
                    <ShoppingBag className="w-4 h-4 text-stone-700" />
                </div>
            </div>
            <div className="p-4">
                <p className="text-xs text-stone-400 mb-1">by {product.artisan}</p>
                <h3 className="font-medium text-stone-900 mb-2 line-clamp-1">{product.name}</h3>
                <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold text-stone-900">Rs. {product.price.toLocaleString()}</span>
                    <div className="flex items-center gap-1 text-xs text-stone-500">
                        <Star className="w-3.5 h-3.5 fill-ochre text-ochre" />
                        {product.rating}
                    </div>
                </div>
            </div>
        </Link>
    );
}
