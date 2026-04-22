import { createPortal } from 'react-dom';
import { X, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useLanguage } from '../../context/LanguageContext';
import { Link, useNavigate } from 'react-router-dom';
import clsx from 'clsx';

export function CartSlideOver() {
    const { cartItems, cartTotal, cartCount, isCartOpen, setIsCartOpen, updateQuantity, removeFromCart, clearCart } = useCart();
    const { t } = useLanguage();
    const navigate = useNavigate();

    if (!isCartOpen) return null;

    const handleCheckout = () => {
        setIsCartOpen(false);
        navigate('/checkout');
    };

    return createPortal(
        <div className="fixed inset-0 z-[70]">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm"
                onClick={() => setIsCartOpen(false)}
            />

            {/* Slide-over Panel */}
            <div className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-2xl flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-stone-100">
                    <div className="flex items-center gap-3">
                        <ShoppingBag className="w-5 h-5 text-stone-700" />
                        <h2 className="text-lg font-serif font-bold text-stone-900">{t('yourCart')}</h2>
                        <span className="px-2 py-0.5 bg-stone-100 text-stone-600 text-xs rounded-full">
                            {cartCount} {t('items')}
                        </span>
                    </div>
                    <button
                        onClick={() => setIsCartOpen(false)}
                        className="p-2 text-stone-400 hover:text-stone-600 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Cart Items */}
                <div className="flex-1 overflow-y-auto p-6">
                    {cartItems.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center">
                            <ShoppingBag className="w-16 h-16 text-stone-200 mb-4" />
                            <p className="text-stone-500 mb-4">{t('cartEmpty')}</p>
                            <button
                                onClick={() => { setIsCartOpen(false); navigate('/shop'); }}
                                className="text-ochre underline font-medium"
                            >
                                {t('continueShopping')}
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {cartItems.map(item => (
                                <div key={item.id} className="flex gap-4">
                                    <Link
                                        to={`/product/${item.id}`}
                                        onClick={() => setIsCartOpen(false)}
                                        className="w-20 h-20 rounded-lg overflow-hidden bg-stone-100 flex-shrink-0"
                                    >
                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                    </Link>
                                    <div className="flex-1 min-w-0">
                                        <Link
                                            to={`/product/${item.id}`}
                                            onClick={() => setIsCartOpen(false)}
                                            className="font-medium text-stone-900 hover:text-ochre transition-colors line-clamp-1"
                                        >
                                            {item.name}
                                        </Link>
                                        <p className="text-sm text-stone-500 mb-2">by {item.artisan}</p>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2 bg-stone-100 rounded-full p-0.5">
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                    className="w-7 h-7 rounded-full bg-white flex items-center justify-center shadow-sm"
                                                >
                                                    <Minus className="w-3 h-3" />
                                                </button>
                                                <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    className="w-7 h-7 rounded-full bg-white flex items-center justify-center shadow-sm"
                                                >
                                                    <Plus className="w-3 h-3" />
                                                </button>
                                            </div>
                                            <span className="font-semibold text-stone-900">Rs. {(item.price * item.quantity).toLocaleString()}</span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => removeFromCart(item.id)}
                                        className="p-2 text-stone-400 hover:text-red-500 transition-colors self-start"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}

                            {cartItems.length > 0 && (
                                <button
                                    onClick={clearCart}
                                    className="text-sm text-stone-400 hover:text-red-500 underline"
                                >
                                    Clear Cart
                                </button>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer */}
                {cartItems.length > 0 && (
                    <div className="p-6 border-t border-stone-100 space-y-4">
                        <div className="flex items-center justify-between text-lg">
                            <span className="text-stone-600">{t('subtotal')}</span>
                            <span className="font-bold text-stone-900">Rs. {cartTotal.toLocaleString()}</span>
                        </div>
                        <p className="text-xs text-stone-400">Shipping calculated at checkout</p>
                        <button
                            onClick={handleCheckout}
                            className="w-full py-4 bg-stone-900 text-white rounded-xl font-medium hover:bg-stone-800 transition-colors"
                        >
                            {t('proceedToCheckout')}
                        </button>
                        <button
                            onClick={() => setIsCartOpen(false)}
                            className="w-full text-center text-stone-500 hover:text-stone-700 text-sm"
                        >
                            {t('continueShopping')}
                        </button>
                    </div>
                )}
            </div>
        </div>,
        document.body
    );
}
