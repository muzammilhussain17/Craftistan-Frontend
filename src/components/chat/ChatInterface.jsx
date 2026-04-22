import { useState, useRef, useEffect } from 'react';
import { Send, Globe, X } from 'lucide-react';
import { MessageBubble } from './MessageBubble';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';
import clsx from 'clsx';

// Smart responses based on keywords
const getAIResponse = (message) => {
    const msg = message.toLowerCase();

    // Greetings
    if (msg.match(/^(hi|hello|hey|assalam|salam|aoa)/i)) {
        return "Hello! Welcome to Craftistan 👋 How can I help you today? I can assist with:\n• Product questions\n• Order tracking\n• Shipping info\n• Artisan inquiries";
    }

    // Order tracking
    if (msg.includes('order') && (msg.includes('track') || msg.includes('where') || msg.includes('status'))) {
        return "To track your order:\n1. Go to 'My Orders' in your profile\n2. Find your order and click 'View Details'\n3. You'll see the current status and tracking info\n\nNeed help finding a specific order? Share your order ID!";
    }

    // Shipping
    if (msg.includes('shipping') || msg.includes('delivery') || msg.includes('deliver')) {
        return "📦 Shipping Information:\n• Standard: 5-7 business days (Rs. 200)\n• Express: 2-3 business days (Rs. 450)\n• Free shipping on orders over Rs. 5,000!\n\nWe deliver across Pakistan 🇵🇰";
    }

    // Returns/Refunds
    if (msg.includes('return') || msg.includes('refund') || msg.includes('exchange')) {
        return "↩️ Our Return Policy:\n• 7-day return window\n• Items must be unused with tags\n• Refund processed within 5-7 days\n\nTo start a return, go to My Orders → Select Order → Request Return";
    }

    // Payment
    if (msg.includes('payment') || msg.includes('pay') || msg.includes('cod') || msg.includes('cash')) {
        return "💳 Payment Options:\n• Cash on Delivery (COD)\n• Credit/Debit Cards\n• JazzCash / Easypaisa\n• Bank Transfer\n\nAll payments are secure and encrypted!";
    }

    // Products
    if (msg.includes('product') || msg.includes('item') || msg.includes('buy') || msg.includes('shop')) {
        return "🛍️ Explore our handcrafted collection:\n• Textiles (Shawls, Fabrics)\n• Home Decor\n• Jewelry\n• Pottery\n• Woodwork\n\nVisit /shop to browse or search for specific items!";
    }

    // Artisan
    if (msg.includes('artisan') || msg.includes('seller') || msg.includes('craftsman') || msg.includes('maker')) {
        return "🎨 Our Artisans:\nCraftistan connects you directly with skilled artisans from:\n• Punjab\n• Sindh\n• KPK\n• Balochistan\n• Kashmir\n• Gilgit-Baltistan\n\nVisit /creators to meet our makers!";
    }

    // Contact
    if (msg.includes('contact') || msg.includes('email') || msg.includes('phone') || msg.includes('call')) {
        return "📞 Contact Us:\n• Email: support@craftistan.pk\n• Phone: +92-300-1234567\n• Hours: Mon-Sat, 9AM-6PM\n\nOr fill out the form at /contact";
    }

    // Price/Discount
    if (msg.includes('price') || msg.includes('discount') || msg.includes('sale') || msg.includes('offer')) {
        return "💰 Current Offers:\n• Free shipping over Rs. 5,000\n• 10% off first order (code: WELCOME10)\n• Seasonal sales announced on homepage!\n\nPrices are in Pakistani Rupees (Rs.)";
    }

    // Thank you
    if (msg.includes('thank') || msg.includes('thanks') || msg.includes('shukriya')) {
        return "You're welcome! 😊 Happy to help. Feel free to ask if you have more questions!\n\nEnjoy shopping at Craftistan! 🛒";
    }

    // Help
    if (msg.includes('help') || msg.includes('support')) {
        return "I'm here to help! I can assist with:\n• 🛒 Product information\n• 📦 Order tracking\n• 🚚 Shipping queries\n• ↩️ Returns & refunds\n• 💳 Payment methods\n• 🎨 Artisan info\n\nWhat would you like to know?";
    }

    // Default response
    return "Thanks for your message! I'm Craftistan's assistant. I can help with orders, products, shipping, and more.\n\nCould you please provide more details about what you need help with?";
};

export function ChatInterface({ isOpen, onClose }) {
    const { t, currentLang } = useLanguage();
    const [messages, setMessages] = useState([
        { id: 1, text: "Hello! Welcome to Craftistan 👋 I'm your shopping assistant. How can I help you today?", isBot: true, timestamp: 'Now' }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [autoTranslate, setAutoTranslate] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (isOpen) scrollToBottom();
    }, [messages, isOpen]);

    const handleSend = () => {
        if (!inputValue.trim()) return;

        const userMessage = {
            id: Date.now(),
            text: inputValue,
            isBot: false,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages(prev => [...prev, userMessage]);
        const userInput = inputValue;
        setInputValue('');
        setIsTyping(true);

        // Simulate AI thinking and respond
        setTimeout(() => {
            const aiResponse = getAIResponse(userInput);
            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                text: aiResponse,
                isBot: true,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }]);
            setIsTyping(false);
        }, 800 + Math.random() * 800);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.95 }}
                    className="fixed bottom-24 right-6 z-40 w-[350px] md:w-[400px] bg-white rounded-2xl shadow-soft-xl border border-stone-200 overflow-hidden flex flex-col max-h-[500px]"
                >
                    {/* Header */}
                    <div className="bg-gradient-to-r from-ochre to-ochre-dark p-4 flex items-center justify-between">
                        <div className="text-white">
                            <h3 className="font-serif font-bold">Craftistan Assistant</h3>
                            <p className="text-xs text-white/80 flex items-center gap-1">
                                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                                Online • Typically replies instantly
                            </p>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setAutoTranslate(!autoTranslate)}
                                className={clsx(
                                    "p-2 rounded-full transition-colors",
                                    autoTranslate ? "bg-white/20 text-white" : "text-white/70 hover:bg-white/10"
                                )}
                                title="Translate Chat"
                            >
                                <Globe className="w-4 h-4" />
                            </button>
                            <button
                                onClick={onClose}
                                className="p-2 rounded-full text-white/70 hover:bg-white/10 transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-stone-50/50">
                        {messages.map(msg => (
                            <MessageBubble
                                key={msg.id}
                                text={msg.text}
                                isBot={msg.isBot}
                                timestamp={msg.timestamp}
                            />
                        ))}

                        {/* Typing Indicator */}
                        {isTyping && (
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-ochre/10 flex items-center justify-center text-ochre text-xs font-bold">
                                    🤖
                                </div>
                                <div className="bg-white border border-stone-200 rounded-2xl px-4 py-2">
                                    <div className="flex gap-1">
                                        <span className="w-2 h-2 bg-stone-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                                        <span className="w-2 h-2 bg-stone-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                                        <span className="w-2 h-2 bg-stone-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Quick Replies */}
                    {messages.length <= 2 && (
                        <div className="px-4 py-2 border-t border-stone-100 bg-white">
                            <p className="text-xs text-stone-400 mb-2">Quick questions:</p>
                            <div className="flex flex-wrap gap-2">
                                {['Track my order', 'Shipping info', 'Return policy'].map(q => (
                                    <button
                                        key={q}
                                        onClick={() => { setInputValue(q); }}
                                        className="px-3 py-1 text-xs bg-stone-100 text-stone-600 rounded-full hover:bg-ochre/10 hover:text-ochre transition-colors"
                                    >
                                        {q}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Input */}
                    <div className="p-3 border-t border-stone-100 bg-white">
                        <div className="flex items-center gap-2">
                            <input
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                placeholder="Type a message..."
                                className="flex-1 bg-stone-100 rounded-full px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ochre/20 transition-all"
                            />
                            <button
                                onClick={handleSend}
                                className="p-2.5 bg-ochre text-white rounded-full hover:bg-ochre-dark transition-colors shadow-sm disabled:opacity-50"
                                disabled={!inputValue.trim()}
                            >
                                <Send className={clsx("w-4 h-4", currentLang !== 'en' && "rotate-180")} />
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
