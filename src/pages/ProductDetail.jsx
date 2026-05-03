import { useParams, useNavigate, Link } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import { Layout } from '../components/layout/Layout';
import { PRODUCTS as FALLBACK_PRODUCTS } from '../data/products';
import { productsApi, reviewsApi, reportsApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useLanguage } from '../context/LanguageContext';
import { Star, Minus, Plus, ShoppingBag, Heart, Truck, Shield, RefreshCw, Loader2, ThumbsUp, MessageSquare, Trash2, Edit2, AlertTriangle, X } from 'lucide-react';
import clsx from 'clsx';

// Resolve backend image paths — relative paths are proxied via Vite → localhost:8080
const resolveImageUrl = (url) => {
    if (!url) return 'https://via.placeholder.com/400?text=Craftistan';
    
    // If it's already a full URL (Cloudinary, etc.), return as is
    if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
        return url;
    }
    
    // For relative paths starting with /api, it's proxied via Vite
    if (url.startsWith('/api') || url.startsWith('api')) {
        return url.startsWith('/') ? url : `/${url}`;
    }

    // Default: relative path from root
    return url.startsWith('/') ? url : `/${url}`;
};

export function ProductDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const { isInWishlist, toggleWishlist } = useWishlist();
    const { t, currentLang } = useLanguage();
    const { user } = useAuth();

    const [product, setProduct] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [addedToCart, setAddedToCart] = useState(false);

    // Reviews State
    const [reviews, setReviews] = useState([]);
    const [isSubmittingReview, setIsSubmittingReview] = useState(false);
    const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
    const [editingReviewId, setEditingReviewId] = useState(null);

    // Reporting State
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);
    const [reportForm, setReportForm] = useState({ reason: '', description: '' });
    const [isSubmittingReport, setIsSubmittingReport] = useState(false);
    const [reportSuccess, setReportSuccess] = useState(false);

    const isFavourite = product ? isInWishlist(product.id) : false;

    // Fetch product from API
    const fetchProduct = useCallback(async () => {
        setIsLoading(true);

        try {
            const result = await productsApi.getById(id);

            if (result.success && result.data) {
                const productData = result.data.data || result.data;

                // Map backend product to frontend format
                const mappedProduct = {
                    id: productData.id,
                    name: productData.name,
                    price: productData.price,
                    category: productData.category,
                    style: productData.style || 'classic',
                    image: resolveImageUrl(productData.images?.[0] || productData.image),
                    images: (productData.images || [productData.image]).map(resolveImageUrl),
                    artisan: productData.artisanName || 'Craftistan Artisan',
                    rating: productData.rating || 4.5,
                    isNew: productData.isNew || false,
                    description: productData.description || `This exquisite piece is handcrafted by our skilled artisans, representing the finest traditions of Pakistani craftsmanship.`,
                    stock: productData.stock || 10,
                };

                setProduct(mappedProduct);

                // Fetch reviews
                try {
                    const reviewResult = await reviewsApi.getForProduct(id);
                    if (reviewResult.success) {
                        // Backend returns: { success, data: Page<ReviewDto> } where Page has .content array
                        const pageData = reviewResult.data?.data ?? reviewResult.data;
                        const rData = pageData?.content ?? pageData;
                        if (Array.isArray(rData)) {
                            setReviews(rData);
                        }
                    }
                } catch (rErr) {
                    console.error('Failed to fetch reviews', rErr);
                }

                // Fetch related products
                if (mappedProduct.category) {
                    const relatedResult = await productsApi.getByCategory(mappedProduct.category);
                    if (relatedResult.success && relatedResult.data) {
                        const relatedData = relatedResult.data.data || relatedResult.data.content || relatedResult.data;
                        if (Array.isArray(relatedData)) {
                            const related = relatedData
                                .filter(p => p.id !== mappedProduct.id)
                                .slice(0, 4)
                                .map(p => ({
                                    id: p.id,
                                    name: p.name,
                                    price: p.price,
                                    image: resolveImageUrl(p.images?.[0] || p.image),
                                }));
                            setRelatedProducts(related);
                        }
                    }
                }
            } else {
                // Fallback to local data
                const localProduct = FALLBACK_PRODUCTS.find(p => p.id === parseInt(id));
                if (localProduct) {
                    setProduct(localProduct);
                    const related = FALLBACK_PRODUCTS
                        .filter(p => p.category === localProduct.category && p.id !== localProduct.id)
                        .slice(0, 4);
                    setRelatedProducts(related);
                }
            }
        } catch (error) {
            console.error('Error fetching product:', error);
            // Fallback to local data
            const localProduct = FALLBACK_PRODUCTS.find(p => p.id === parseInt(id));
            if (localProduct) {
                setProduct(localProduct);
                const related = FALLBACK_PRODUCTS
                    .filter(p => p.category === localProduct.category && p.id !== localProduct.id)
                    .slice(0, 4);
                setRelatedProducts(related);
            }
        }

        setIsLoading(false);
    }, [id, currentLang]); // Refetch when language changes

    useEffect(() => {
        fetchProduct();
        // Reset quantity when product changes
        setQuantity(1);
        setAddedToCart(false);
    }, [fetchProduct]);

    if (isLoading) {
        return (
            <Layout>
                <div className="min-h-screen flex items-center justify-center">
                    <Loader2 className="w-8 h-8 animate-spin text-stone-400" />
                    <span className="ml-2 text-stone-500">Loading product...</span>
                </div>
            </Layout>
        );
    }

    if (!product) {
        return (
            <Layout>
                <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                        <h1 className="text-2xl font-serif text-stone-900 mb-4">Product Not Found</h1>
                        <Link to="/shop" className="text-ochre underline">Back to Shop</Link>
                    </div>
                </div>
            </Layout>
        );
    }

    const handleAddToCart = () => {
        addToCart(product, quantity);
        setAddedToCart(true);
        setTimeout(() => setAddedToCart(false), 2000);
    };

    const handleBuyNow = () => {
        addToCart(product, quantity);
        navigate('/checkout');
    };

    // Review Handlers
    const submitReview = async (e) => {
        e.preventDefault();
        if (!user) return navigate('/shop'); // Or trigger login
        if (!reviewForm.comment.trim()) return;

        setIsSubmittingReview(true);
        try {
            if (editingReviewId) {
                const res = await reviewsApi.update(editingReviewId, reviewForm);
                if (res.success) {
                    setReviews(reviews.map(r => r.id === editingReviewId ? { ...r, ...reviewForm } : r));
                    setEditingReviewId(null);
                    setReviewForm({ rating: 5, comment: '' });
                }
            } else {
                const res = await reviewsApi.create(id, reviewForm);
                if (res.success) {
                    const newRev = res.data?.data || res.data || { ...reviewForm, id: Date.now(), userName: user.name, createdAt: new Date().toISOString(), helpfulCount: 0 };
                    // If backend doesn't return hydrated object perfectly, we fake it for optimistic UI
                    setReviews([{
                        ...newRev,
                        user: { name: user.name, id: user.id },
                        userName: user.name
                    }, ...reviews]);
                    setReviewForm({ rating: 5, comment: '' });
                }
            }
        } catch (error) {
            console.error('Review submission failed', error);
        }
        setIsSubmittingReview(false);
    };

    const handleDeleteReview = async (reviewId) => {
        if (!confirm('Are you sure you want to delete this review?')) return;
        try {
            const res = await reviewsApi.delete(reviewId);
            if (res.success) {
                setReviews(reviews.filter(r => r.id !== reviewId));
            }
        } catch (error) {
            console.error('Failed to delete review', error);
        }
    };

    const handleMarkHelpful = async (reviewId) => {
        if (!user) return;
        try {
            const res = await reviewsApi.markHelpful(reviewId);
            if (res.success) {
                setReviews(reviews.map(r => r.id === reviewId ? { ...r, helpfulCount: (r.helpfulCount || 0) + 1 } : r));
            }
        } catch (error) {
            console.error('Failed to mark helpful', error);
        }
    };

    const submitReport = async (e) => {
        e.preventDefault();
        setIsSubmittingReport(true);
        try {
            // reportsApi.fileReport(targetId, targetType, reason, description)
            const result = await reportsApi.fileReport(
                String(product.id),
                'PRODUCT',
                reportForm.reason,
                reportForm.description
            );
            if (result.success) {
                setReportSuccess(true);
                setTimeout(() => {
                    setIsReportModalOpen(false);
                    setReportSuccess(false);
                    setReportForm({ reason: '', description: '' });
                }, 2000);
            }
        } catch (err) {
            console.error('Failed to file report', err);
        }
        setIsSubmittingReport(false);
    };

    return (
        <Layout>
            <div className="min-h-screen bg-stone-50 pt-28 pb-16">
                <div className="max-w-7xl mx-auto px-6">

                    {/* Breadcrumb */}
                    <nav className="flex items-center gap-2 text-sm text-stone-500 mb-8">
                        <Link to="/" className="hover:text-stone-700">Home</Link>
                        <span>/</span>
                        <Link to="/shop" className="hover:text-stone-700">Shop</Link>
                        <span>/</span>
                        <span className="text-stone-900">{product.name}</span>
                    </nav>

                    {/* Product Section */}
                    <div className="grid lg:grid-cols-2 gap-12 mb-16">
                        {/* Image */}
                        <div className="relative">
                            <div className="aspect-square rounded-2xl overflow-hidden bg-white border border-stone-100">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.target.src = 'https://via.placeholder.com/400?text=Product';
                                    }}
                                />
                            </div>
                            {product.isNew && (
                                <span className="absolute top-4 left-4 bg-ochre text-white text-sm font-medium px-3 py-1.5 rounded-full">
                                    New Arrival
                                </span>
                            )}
                            <button
                                onClick={() => toggleWishlist(product)}
                                className={clsx(
                                    "absolute top-4 right-4 w-12 h-12 rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-all",
                                    isFavourite ? "bg-red-500 text-white" : "bg-white text-stone-400 hover:text-red-500"
                                )}
                            >
                                <Heart className={clsx("w-5 h-5", isFavourite && "fill-current")} />
                            </button>
                        </div>

                        {/* Details */}
                        <div className="flex flex-col">
                            <p className="text-sm text-ochre font-medium mb-2">Handcrafted by {product.artisan}</p>
                            <h1 className="text-3xl lg:text-4xl font-serif text-stone-900 mb-4">{product.name}</h1>

                            {/* Rating */}
                            <div className="flex items-center gap-2 mb-6">
                                <div className="flex items-center gap-1">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className={clsx(
                                                "w-4 h-4",
                                                i < Math.floor(product.rating) ? "fill-ochre text-ochre" : "text-stone-300"
                                            )}
                                        />
                                    ))}
                                </div>
                                <span className="text-sm text-stone-500">({product.rating} rating)</span>
                            </div>

                            {/* Price */}
                            <div className="text-3xl font-semibold text-stone-900 mb-6">
                                Rs. {product.price.toLocaleString()}
                            </div>

                            {/* Description */}
                            <p className="text-stone-600 leading-relaxed mb-8">
                                {product.description}
                            </p>

                            {/* Style Badge */}
                            <div className="flex items-center gap-2 mb-8">
                                <span className="text-sm text-stone-500">Style:</span>
                                <span className="px-3 py-1 bg-stone-100 text-stone-700 text-sm rounded-full capitalize">
                                    {product.style}
                                </span>
                            </div>

                            {/* Quantity Selector */}
                            <div className="flex items-center gap-4 mb-8">
                                <span className="text-sm font-medium text-stone-700">{t('quantity')}:</span>
                                <div className="flex items-center gap-3 bg-stone-100 rounded-full p-1">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm hover:shadow-md transition-shadow"
                                    >
                                        <Minus className="w-4 h-4" />
                                    </button>
                                    <span className="w-8 text-center font-medium">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(Math.min(product.stock || 10, quantity + 1))}
                                        className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm hover:shadow-md transition-shadow"
                                    >
                                        <Plus className="w-4 h-4" />
                                    </button>
                                </div>
                                {product.stock && (
                                    <span className="text-sm text-stone-400">({product.stock} in stock)</span>
                                )}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-4 mb-8">
                                <button
                                    onClick={handleAddToCart}
                                    className={clsx(
                                        "flex-1 flex items-center justify-center gap-2 py-4 rounded-xl font-medium transition-all",
                                        addedToCart
                                            ? "bg-green-500 text-white"
                                            : "bg-stone-100 text-stone-900 hover:bg-stone-200"
                                    )}
                                >
                                    <ShoppingBag className="w-5 h-5" />
                                    {addedToCart ? t('added') || 'Added!' : t('addToCart')}
                                </button>
                                <button
                                    onClick={handleBuyNow}
                                    className="flex-1 bg-stone-900 text-white py-4 rounded-xl font-medium hover:bg-stone-800 transition-colors"
                                >
                                    {t('buyNow')}
                                </button>
                            </div>

                            {/* Trust Badges */}
                            <div className="grid grid-cols-3 gap-4 pt-8 border-t border-stone-200">
                                <div className="text-center">
                                    <Truck className="w-6 h-6 mx-auto text-stone-400 mb-2" />
                                    <p className="text-xs text-stone-500">{t('freeShipping')}</p>
                                </div>
                                <div className="text-center">
                                    <Shield className="w-6 h-6 mx-auto text-stone-400 mb-2" />
                                    <p className="text-xs text-stone-500">{t('securePayment')}</p>
                                </div>
                                <div className="text-center">
                                    <RefreshCw className="w-6 h-6 mx-auto text-stone-400 mb-2" />
                                    <p className="text-xs text-stone-500">{t('easyReturns')}</p>
                                </div>
                            </div>

                            {/* Report Product Action */}
                            <div className="mt-8 flex justify-end">
                                <button 
                                    onClick={() => {
                                        if (!user) return navigate('/shop');
                                        setIsReportModalOpen(true);
                                    }}
                                    className="flex items-center gap-1.5 text-xs text-stone-400 hover:text-red-500 transition-colors"
                                >
                                    <AlertTriangle className="w-3.5 h-3.5" /> Report Issue
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Reviews Section */}
                    <div className="mb-16 pt-16 border-t border-stone-200">
                        <div className="flex items-center gap-3 mb-8">
                            <MessageSquare className="w-6 h-6 text-stone-900" />
                            <h2 className="text-2xl font-serif text-stone-900">Customer Reviews</h2>
                            <span className="bg-stone-100 text-stone-600 px-3 py-1 rounded-full text-sm font-medium">
                                {reviews.length}
                            </span>
                        </div>

                        <div className="grid lg:grid-cols-3 gap-12">
                            {/* Write Review Form */}
                            <div className="lg:col-span-1">
                                <div className="bg-white p-6 rounded-2xl border border-stone-100 shadow-sm sticky top-24">
                                    <h3 className="text-lg font-serif text-stone-900 mb-4">
                                        {editingReviewId ? 'Edit Review' : 'Write a Review'}
                                    </h3>
                                    {user ? (
                                        <form onSubmit={submitReview} className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-stone-700 mb-2">Rating</label>
                                                <div className="flex gap-1">
                                                    {[1, 2, 3, 4, 5].map((star) => (
                                                        <button
                                                            key={star}
                                                            type="button"
                                                            onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                                                            className="p-1 hover:scale-110 transition-transform"
                                                        >
                                                            <Star className={clsx("w-6 h-6", star <= reviewForm.rating ? "fill-ochre text-ochre" : "text-stone-300")} />
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-stone-700 mb-2">Review</label>
                                                <textarea
                                                    required
                                                    rows={4}
                                                    value={reviewForm.comment}
                                                    onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                                                    className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-ochre/20 focus:border-ochre resize-none text-sm"
                                                    placeholder="Share your thoughts about this product..."
                                                ></textarea>
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    type="submit"
                                                    disabled={isSubmittingReview || !reviewForm.comment.trim()}
                                                    className="flex-1 bg-stone-900 text-white py-3 rounded-xl text-sm font-medium hover:bg-stone-800 disabled:opacity-50 transition-colors"
                                                >
                                                    {isSubmittingReview ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : (editingReviewId ? 'Update Review' : 'Post Review')}
                                                </button>
                                                {editingReviewId && (
                                                    <button
                                                        type="button"
                                                        onClick={() => { setEditingReviewId(null); setReviewForm({ rating: 5, comment: '' }); }}
                                                        className="px-4 py-3 bg-stone-100 text-stone-600 rounded-xl text-sm font-medium hover:bg-stone-200 transition-colors"
                                                    >
                                                        Cancel
                                                    </button>
                                                )}
                                            </div>
                                        </form>
                                    ) : (
                                        <div className="text-center py-6">
                                            <p className="text-sm text-stone-600 mb-4">Please log in to share your experience.</p>
                                            <Link to="/shop" className="text-ochre font-medium hover:underline text-sm">Sign in to review</Link>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Reviews List */}
                            <div className="lg:col-span-2 space-y-6">
                                {reviews.length === 0 ? (
                                    <div className="bg-stone-50 rounded-2xl p-8 text-center border border-stone-100 border-dashed">
                                        <Star className="w-12 h-12 text-stone-300 mx-auto mb-3" />
                                        <h3 className="text-lg font-medium text-stone-900 mb-1">No reviews yet</h3>
                                        <p className="text-sm text-stone-500">Be the first to review this handcrafted piece.</p>
                                    </div>
                                ) : (
                                    reviews.map((review) => {
                                        const isOwner = user && (review.userId === user.id || review.user?.id === user.id);
                                        return (
                                            <div key={review.id} className="bg-white p-6 rounded-2xl border border-stone-100 shadow-sm flex gap-4">
                                                <div className="w-10 h-10 rounded-full bg-ochre/10 flex items-center justify-center text-ochre font-serif shrink-0">
                                                    {(review.userName || review.user?.name || 'A')[0].toUpperCase()}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-start justify-between mb-2">
                                                        <div>
                                                            <h4 className="font-medium text-stone-900">{review.userName || review.user?.name || 'Verified Buyer'}</h4>
                                                            <div className="flex items-center gap-2 mt-1">
                                                                <div className="flex">
                                                                    {[...Array(5)].map((_, i) => (
                                                                        <Star key={i} className={clsx("w-3.5 h-3.5", i < review.rating ? "fill-ochre text-ochre" : "fill-stone-200 text-stone-200")} />
                                                                    ))}
                                                                </div>
                                                                <span className="text-xs text-stone-400">
                                                                    {new Date(review.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <p className="text-stone-600 text-sm leading-relaxed mb-4">
                                                        {review.comment}
                                                    </p>
                                                    <div className="flex items-center gap-4 text-xs font-medium">
                                                        <button 
                                                            onClick={() => handleMarkHelpful(review.id)}
                                                            className="flex items-center gap-1.5 text-stone-500 hover:text-ochre transition-colors"
                                                        >
                                                            <ThumbsUp className="w-3.5 h-3.5" />
                                                            Helpful ({review.helpfulCount || 0})
                                                        </button>
                                                        {isOwner && (
                                                            <>
                                                                <button 
                                                                    onClick={() => { setEditingReviewId(review.id); setReviewForm({ rating: review.rating, comment: review.comment }); window.scrollTo({ top: 300, behavior: 'smooth' }); }}
                                                                    className="flex items-center gap-1.5 text-blue-600 hover:text-blue-700 transition-colors"
                                                                >
                                                                    <Edit2 className="w-3.5 h-3.5" /> Edit
                                                                </button>
                                                                <button 
                                                                    onClick={() => handleDeleteReview(review.id)}
                                                                    className="flex items-center gap-1.5 text-red-500 hover:text-red-700 transition-colors"
                                                                >
                                                                    <Trash2 className="w-3.5 h-3.5" /> Delete
                                                                </button>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Related Products */}
                    {relatedProducts.length > 0 && (
                        <div>
                            <h2 className="text-2xl font-serif text-stone-900 mb-6">{t('youMayLike')}</h2>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                {relatedProducts.map(p => (
                                    <Link
                                        key={p.id}
                                        to={`/product/${p.id}`}
                                        className="group bg-white rounded-xl overflow-hidden border border-stone-100 hover:shadow-lg transition-all"
                                    >
                                        <div className="aspect-square overflow-hidden">
                                            <img
                                                src={p.image}
                                                alt={p.name}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                onError={(e) => {
                                                    e.target.src = 'https://via.placeholder.com/400?text=Product';
                                                }}
                                            />
                                        </div>
                                        <div className="p-4">
                                            <h3 className="font-medium text-stone-900 text-sm line-clamp-1">{p.name}</h3>
                                            <p className="text-stone-600 font-semibold">Rs. {p.price.toLocaleString()}</p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Report Modal */}
            {isReportModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-fade-in" onClick={() => setIsReportModalOpen(false)}>
                    <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl p-6" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-serif text-stone-900">Report Product</h3>
                            <button onClick={() => setIsReportModalOpen(false)} className="text-stone-400 hover:text-stone-600">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {reportSuccess ? (
                            <div className="text-center py-8">
                                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                                    <Shield className="w-6 h-6 text-green-600" />
                                </div>
                                <h4 className="text-lg font-medium text-stone-900 mb-2">Report Submitted</h4>
                                <p className="text-sm text-stone-500">Thank you for helping us maintain a safe community. Our team will review this shortly.</p>
                            </div>
                        ) : (
                            <form onSubmit={submitReport} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-stone-700 mb-1">Reason</label>
                                    <select 
                                        required
                                        className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-ochre/20 focus:border-ochre text-sm"
                                        value={reportForm.reason}
                                        onChange={(e) => setReportForm({ ...reportForm, reason: e.target.value })}
                                    >
                                        <option value="">Select a reason</option>
                                        <option value="fake">Counterfeit or Fake Product</option>
                                        <option value="inaccurate">Inaccurate Description</option>
                                        <option value="offensive">Offensive Content</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-stone-700 mb-1">Description</label>
                                    <textarea
                                        required
                                        rows={4}
                                        value={reportForm.description}
                                        onChange={(e) => setReportForm({ ...reportForm, description: e.target.value })}
                                        className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-ochre/20 focus:border-ochre resize-none text-sm"
                                        placeholder="Please provide details about the issue..."
                                    ></textarea>
                                </div>
                                <button
                                    type="submit"
                                    disabled={isSubmittingReport || !reportForm.reason || !reportForm.description.trim()}
                                    className="w-full bg-red-600 text-white py-3 rounded-xl text-sm font-medium hover:bg-red-700 disabled:opacity-50 transition-colors flex justify-center"
                                >
                                    {isSubmittingReport ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Submit Report'}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            )}
        </Layout>
    );
}
