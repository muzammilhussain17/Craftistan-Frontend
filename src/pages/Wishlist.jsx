import { Layout } from '../components/layout/Layout';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { Heart, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';

export function Wishlist() {
    const { wishlist, removeFromWishlist, clearWishlist } = useWishlist();
    const { addItem } = useCart();

    const handleAddToCart = (product) => {
        addItem(product);
        removeFromWishlist(product.id);
    };

    return (
        <Layout>
            <div className="min-h-screen bg-stone-50 pt-28 pb-16">
                <div className="max-w-5xl mx-auto px-6">

                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-2xl font-serif text-stone-900">My Wishlist</h1>
                            <p className="text-stone-500 text-sm mt-1">{wishlist.length} item{wishlist.length !== 1 ? 's' : ''} saved</p>
                        </div>
                        {wishlist.length > 0 && (
                            <button
                                onClick={clearWishlist}
                                className="text-sm text-red-500 hover:underline"
                            >
                                Clear All
                            </button>
                        )}
                    </div>

                    {/* Empty State */}
                    {wishlist.length === 0 ? (
                        <div className="bg-white rounded-xl border border-stone-200 p-12 text-center">
                            <Heart className="w-16 h-16 text-stone-200 mx-auto mb-4" />
                            <h2 className="text-xl font-serif text-stone-900 mb-2">Your wishlist is empty</h2>
                            <p className="text-stone-500 text-sm mb-6">Save your favorite products to buy them later</p>
                            <Link to="/shop">
                                <Button variant="primary">
                                    Explore Products <ArrowRight className="w-4 h-4 ml-2" />
                                </Button>
                            </Link>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {wishlist.map(product => (
                                <div key={product.id} className="bg-white rounded-xl border border-stone-200 overflow-hidden group">
                                    <Link to={`/product/${product.id}`}>
                                        <div className="relative aspect-square overflow-hidden">
                                            <img
                                                src={product.image}
                                                alt={product.name}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        </div>
                                    </Link>

                                    <div className="p-4">
                                        <p className="text-xs text-stone-400 mb-1">by {product.artisan}</p>
                                        <Link to={`/product/${product.id}`}>
                                            <h3 className="font-medium text-stone-900 mb-2 line-clamp-1 hover:text-ochre transition-colors">
                                                {product.name}
                                            </h3>
                                        </Link>
                                        <p className="text-lg font-semibold text-ochre mb-4">
                                            Rs. {product.price.toLocaleString()}
                                        </p>

                                        <div className="flex gap-2">
                                            <Button
                                                variant="primary"
                                                size="sm"
                                                className="flex-1"
                                                onClick={() => handleAddToCart(product)}
                                            >
                                                <ShoppingBag className="w-3.5 h-3.5 mr-1.5" /> Add to Cart
                                            </Button>
                                            <button
                                                onClick={() => removeFromWishlist(product.id)}
                                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                </div>
            </div>
        </Layout>
    );
}
