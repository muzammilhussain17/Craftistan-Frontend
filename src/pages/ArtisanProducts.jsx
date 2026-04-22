import { useState, useRef, useEffect, useCallback } from 'react';
import { Layout } from '../components/layout/Layout';
import { useAuth } from '../context/AuthContext';
import { Plus, Edit2, Trash2, Package, Search, X, Upload, Save, Image as ImageIcon, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { CATEGORIES } from '../data/products';
import { artisanApi, uploadApi } from '../services/api';
import clsx from 'clsx';

// Resolve backend image paths
const resolveImageUrl = (url) => {
    if (!url) return 'https://via.placeholder.com/400';
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    return url.startsWith('/') ? url : `/${url}`;
};

export function ArtisanProducts() {
    const { user } = useAuth();
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterCategory, setFilterCategory] = useState('all');
    const fileInputRef = useRef(null);

    const [formData, setFormData] = useState({
        name: '',
        price: '',
        category: 'textiles',
        style: 'traditional',
        stock: '',
        description: '',
        images: [],
    });

    const [uploadError, setUploadError] = useState('');

    // Fetch products from backend
    const fetchProducts = useCallback(async () => {
        setIsLoading(true);
        try {
            const result = await artisanApi.getProducts();

            if (result.success) {
                const raw = result.data;
                let productArray = null;

                if (Array.isArray(raw)) productArray = raw;
                else if (raw && Array.isArray(raw.content)) productArray = raw.content;
                else if (raw && Array.isArray(raw.data)) productArray = raw.data;
                else if (raw && raw.data && Array.isArray(raw.data.content)) productArray = raw.data.content;
                else if (raw && raw.data && Array.isArray(raw.data.data)) productArray = raw.data.data;
                else if (raw && raw.data && Array.isArray(raw.data.data?.content)) productArray = raw.data.data.content;

                if (productArray) {
                    const mappedProducts = productArray.map(p => ({
                        id: p.id,
                        name: p.name,
                        price: p.price,
                        category: p.category,
                        style: p.style || 'classic',
                        image: resolveImageUrl(p.image || p.images?.[0]),
                        images: (p.images || []).map(resolveImageUrl),
                        artisan: user?.name || 'Unknown',
                        rating: p.rating || 0,
                        isNew: p.isNew || false,
                        stock: p.stock || 0,
                        description: p.description || '',
                    }));
                    setProducts(mappedProducts);
                } else if (raw !== null) {
                    setProducts([]);
                }
            } else {
                console.error('API error:', result.error);
            }
        } catch (error) {
            console.error('Failed to fetch products:', error);
        }
        setIsLoading(false);
    }, [user]);

    useEffect(() => {
        if (user?.role === 'ARTISAN') {
            fetchProducts();
        }
    }, [fetchProducts, user]);

    const filteredProducts = products.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = filterCategory === 'all' || p.category === filterCategory;
        return matchesSearch && matchesCategory;
    });

    const handleOpenModal = (product = null) => {
        setUploadError('');
        if (product) {
            setEditingProduct(product);
            setFormData({
                name: product.name,
                price: product.price.toString(),
                category: product.category,
                style: product.style,
                stock: product.stock?.toString() || '10',
                description: product.description || '',
                images: product.images || [product.image],
            });
        } else {
            setEditingProduct(null);
            setFormData({
                name: '',
                price: '',
                category: 'textiles',
                style: 'traditional',
                stock: '',
                description: '',
                images: [],
            });
        }
        setShowModal(true);
    };

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        processImages(files);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
        processImages(files);
    };

    const processImages = async (files) => {
        setUploadError('');

        const remainingSlots = 5 - formData.images.length;
        if (remainingSlots <= 0) {
            setUploadError('Maximum 5 images allowed');
            return;
        }

        const filesToProcess = files.slice(0, remainingSlots);
        const validFiles = [];

        for (const file of filesToProcess) {
            if (file.size > 5 * 1024 * 1024) {
                setUploadError('Image must be less than 5MB');
                return;
            }
            validFiles.push(file);
        }

        if (validFiles.length > 0) {
            // Try uploading bulk to backend
            try {
                const result = await uploadApi.uploadImages(validFiles);
                if (result.success && result.data) {
                    const imageUrls = result.data.urls || result.data.data?.urls || result.data;
                    if (Array.isArray(imageUrls)) {
                        setFormData(prev => ({
                            ...prev,
                            images: [...prev.images, ...imageUrls]
                        }));
                        return; // Successfully uploaded all to server
                    }
                }
            } catch (error) {
                console.log('Bulk upload failed, using local fallback preview');
            }

            // Fallback to local preview if server bulk upload fails
            for (const file of validFiles) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    setFormData(prev => ({
                        ...prev,
                        images: [...prev.images, e.target.result]
                    }));
                };
                reader.readAsDataURL(file);
            }
        }
    };

    const removeImage = (index) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.images.length === 0) {
            setUploadError('Please add at least one image');
            return;
        }

        setIsSaving(true);

        try {
            const productData = {
                name: formData.name,
                price: parseInt(formData.price),
                category: formData.category,
                style: formData.style,
                description: formData.description,
                stock: parseInt(formData.stock) || 10,
                images: formData.images,
            };

            if (editingProduct) {
                // Update existing product
                const result = await artisanApi.updateProduct(editingProduct.id, productData);
                if (result.success) {
                    // Refresh products list
                    await fetchProducts();
                } else {
                    // Fallback: update locally
                    setProducts(products.map(p =>
                        p.id === editingProduct.id
                            ? { ...p, ...productData, image: formData.images[0] }
                            : p
                    ));
                }
            } else {
                // Create new product
                const result = await artisanApi.createProduct(productData);
                if (result.success) {
                    // Refresh products list
                    await fetchProducts();
                } else {
                    // Fallback: add locally
                    const newProduct = {
                        id: Date.now(),
                        ...productData,
                        image: formData.images[0],
                        artisan: user?.name || 'Unknown',
                        rating: 0,
                        isNew: true,
                    };
                    setProducts([newProduct, ...products]);
                }
            }

            setShowModal(false);
        } catch (error) {
            console.error('Error saving product:', error);
            setUploadError('Failed to save product. Please try again.');
        }

        setIsSaving(false);
    };

    const handleDelete = async (productId) => {
        if (confirm('Are you sure you want to delete this product?')) {
            try {
                const result = await artisanApi.deleteProduct(productId);
                if (result.success) {
                    await fetchProducts();
                } else {
                    // Fallback: remove locally
                    setProducts(products.filter(p => p.id !== productId));
                }
            } catch (error) {
                console.error('Error deleting product:', error);
                setProducts(products.filter(p => p.id !== productId));
            }
        }
    };

    if (!user || user.role !== 'ARTISAN') {
        return (
            <Layout>
                <div className="min-h-screen flex items-center justify-center">
                    <p className="text-stone-500">Access denied. Artisan account required.</p>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="min-h-screen bg-stone-50 pt-28 pb-16">
                <div className="max-w-6xl mx-auto px-6">

                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                        <div>
                            <h1 className="text-2xl font-serif text-stone-900">My Products</h1>
                            <p className="text-stone-500 text-sm mt-1">{products.length} products listed</p>
                        </div>
                        <Button variant="primary" onClick={() => handleOpenModal()}>
                            <Plus className="w-4 h-4 mr-2" /> Add Product
                        </Button>
                    </div>

                    {/* Search & Filter */}
                    <div className="flex flex-col md:flex-row gap-4 mb-6">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 border border-stone-200 rounded-lg focus:border-ochre focus:ring-2 focus:ring-ochre/20 outline-none"
                            />
                        </div>
                        <select
                            value={filterCategory}
                            onChange={e => setFilterCategory(e.target.value)}
                            className="px-4 py-2.5 border border-stone-200 rounded-lg focus:border-ochre outline-none"
                        >
                            <option value="all">All Categories</option>
                            {CATEGORIES.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Loading State */}
                    {isLoading ? (
                        <div className="flex items-center justify-center py-20">
                            <Loader2 className="w-8 h-8 animate-spin text-stone-400" />
                            <span className="ml-2 text-stone-500">Loading products...</span>
                        </div>
                    ) : (
                        /* Products Grid */
                        filteredProducts.length > 0 ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                {filteredProducts.map(product => (
                                    <div key={product.id} className="bg-white rounded-xl border border-stone-100 overflow-hidden group">
                                        <div className="aspect-square relative overflow-hidden">
                                            <img
                                                src={product.image}
                                                alt={product.name}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    e.target.src = 'https://via.placeholder.com/400?text=Product';
                                                }}
                                            />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() => handleOpenModal(product)}
                                                    className="p-2 bg-white rounded-full hover:bg-stone-100 transition"
                                                >
                                                    <Edit2 className="w-4 h-4 text-stone-700" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(product.id)}
                                                    className="p-2 bg-white rounded-full hover:bg-red-50 transition"
                                                >
                                                    <Trash2 className="w-4 h-4 text-red-500" />
                                                </button>
                                            </div>
                                            {product.isNew && (
                                                <span className="absolute top-2 left-2 bg-ochre text-white text-xs px-2 py-1 rounded-full">
                                                    New
                                                </span>
                                            )}
                                        </div>
                                        <div className="p-4">
                                            <h3 className="font-medium text-stone-900 line-clamp-1">{product.name}</h3>
                                            <div className="flex items-center justify-between mt-2">
                                                <span className="text-lg font-semibold text-stone-900">
                                                    Rs. {product.price.toLocaleString()}
                                                </span>
                                                <span className="text-xs text-stone-500 capitalize">
                                                    {product.category}
                                                </span>
                                            </div>
                                            <p className="text-xs text-stone-400 mt-1">Stock: {product.stock || 0}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-16 bg-white rounded-xl border border-stone-100">
                                <Package className="w-12 h-12 text-stone-300 mx-auto mb-4" />
                                <p className="text-stone-500">No products found</p>
                                <Button variant="primary" className="mt-4" onClick={() => handleOpenModal()}>
                                    <Plus className="w-4 h-4 mr-2" /> Add Your First Product
                                </Button>
                            </div>
                        )
                    )}
                </div>
            </div>

            {/* Add/Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
                    <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b border-stone-100 px-6 py-4 flex items-center justify-between">
                            <h2 className="text-xl font-serif text-stone-900">
                                {editingProduct ? 'Edit Product' : 'Add New Product'}
                            </h2>
                            <button onClick={() => setShowModal(false)} className="p-2 hover:bg-stone-100 rounded-full">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            {/* Images Upload */}
                            <div>
                                <label className="block text-sm font-medium text-stone-700 mb-2">
                                    Product Images (Max 5)
                                </label>
                                <div
                                    className="border-2 border-dashed border-stone-200 rounded-xl p-6 text-center hover:border-ochre/50 transition cursor-pointer"
                                    onClick={() => fileInputRef.current?.click()}
                                    onDragOver={(e) => e.preventDefault()}
                                    onDrop={handleDrop}
                                >
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        className="hidden"
                                        onChange={handleImageUpload}
                                    />
                                    <Upload className="w-8 h-8 text-stone-400 mx-auto mb-2" />
                                    <p className="text-sm text-stone-500">
                                        Click or drag images here
                                    </p>
                                    <p className="text-xs text-stone-400 mt-1">JPG, PNG up to 5MB each</p>
                                </div>
                                {uploadError && (
                                    <p className="text-red-500 text-sm mt-2">{uploadError}</p>
                                )}
                                {formData.images.length > 0 && (
                                    <div className="flex gap-2 mt-4 flex-wrap">
                                        {formData.images.map((img, index) => (
                                            <div key={index} className="relative w-20 h-20">
                                                <img
                                                    src={img}
                                                    alt={`Preview ${index + 1}`}
                                                    className="w-full h-full object-cover rounded-lg"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => removeImage(index)}
                                                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs"
                                                >
                                                    <X className="w-3 h-3" />
                                                </button>
                                                {index === 0 && (
                                                    <span className="absolute bottom-1 left-1 bg-ochre text-white text-[10px] px-1 rounded">
                                                        Main
                                                    </span>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Name */}
                            <div>
                                <label className="block text-sm font-medium text-stone-700 mb-1">Product Name</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-3 border border-stone-200 rounded-lg focus:border-ochre outline-none"
                                    placeholder="e.g., Handwoven Silk Scarf"
                                    required
                                />
                            </div>

                            {/* Price & Stock */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-stone-700 mb-1">Price (Rs.)</label>
                                    <input
                                        type="number"
                                        value={formData.price}
                                        onChange={e => setFormData({ ...formData, price: e.target.value })}
                                        className="w-full px-4 py-3 border border-stone-200 rounded-lg focus:border-ochre outline-none"
                                        placeholder="5000"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-stone-700 mb-1">Stock</label>
                                    <input
                                        type="number"
                                        value={formData.stock}
                                        onChange={e => setFormData({ ...formData, stock: e.target.value })}
                                        className="w-full px-4 py-3 border border-stone-200 rounded-lg focus:border-ochre outline-none"
                                        placeholder="10"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Category & Style */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-stone-700 mb-1">Category</label>
                                    <select
                                        value={formData.category}
                                        onChange={e => setFormData({ ...formData, category: e.target.value })}
                                        className="w-full px-4 py-3 border border-stone-200 rounded-lg focus:border-ochre outline-none"
                                    >
                                        {CATEGORIES.map(cat => (
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-stone-700 mb-1">Style</label>
                                    <select
                                        value={formData.style}
                                        onChange={e => setFormData({ ...formData, style: e.target.value })}
                                        className="w-full px-4 py-3 border border-stone-200 rounded-lg focus:border-ochre outline-none"
                                    >
                                        <option value="traditional">Traditional</option>
                                        <option value="modern">Modern</option>
                                        <option value="classic">Classic</option>
                                        <option value="bohemian">Bohemian</option>
                                        <option value="vintage">Vintage</option>
                                    </select>
                                </div>
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-medium text-stone-700 mb-1">Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-4 py-3 border border-stone-200 rounded-lg focus:border-ochre outline-none resize-none"
                                    rows={4}
                                    placeholder="Describe your beautiful handcrafted product..."
                                />
                            </div>

                            {/* Submit */}
                            <div className="flex gap-4 pt-4">
                                <Button type="button" variant="secondary" className="flex-1" onClick={() => setShowModal(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit" variant="primary" className="flex-1" disabled={isSaving}>
                                    {isSaving ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="w-4 h-4 mr-2" />
                                            {editingProduct ? 'Update Product' : 'Add Product'}
                                        </>
                                    )}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </Layout>
    );
}
