import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Loader2, Sparkles, Globe } from 'lucide-react';
import { chatApi } from '../../services/api';
import { useLanguage } from '../../context/LanguageContext';
import { useCart } from '../../context/CartContext';
import clsx from 'clsx';
import './ChatWidget.css';

const LANGUAGES = [
    { code: 'auto', label: 'Auto Detect', icon: '🌐' },
    { code: 'ur-roman', label: 'Roman Urdu', icon: '🇵🇰' },
    { code: 'ur', label: 'اردو', icon: '🇵🇰' },
    { code: 'en', label: 'English', icon: '🇬🇧' },
    { code: 'pa', label: 'پنجابی', icon: '🇵🇰' },
    { code: 'ps', label: 'پښتو', icon: '🇵🇰' },
    { code: 'sd', label: 'سنڌي', icon: '🇵🇰' },
];

const QUICK_PROMPTS = [
    { text: 'Show products', label: 'Products 🛍️' },
    { text: 'mujhay kapry dekhao', label: 'کپڑے 👗' },
    { text: 'order status', label: 'Order 📦' },
    { text: 'madad chahiye', label: 'Help ❓' },
];

export function ChatWidget() {
    const { language: appLanguage } = useLanguage();
    const { isCartOpen } = useCart();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            role: 'assistant',
            content: 'Assalam o Alaikum! 👋 Main Craftistan ka assistant hoon. Aap kaise madad kar sakta hoon?\n\n(Hello! I\'m Craftistan\'s assistant. How can I help you?)',
            timestamp: new Date(),
        }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [sessionId, setSessionId] = useState(null);
    const [selectedLanguage, setSelectedLanguage] = useState('auto');
    const [showLanguageMenu, setShowLanguageMenu] = useState(false);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    // Scroll to bottom when messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Focus input when chat opens
    useEffect(() => {
        if (isOpen) {
            inputRef.current?.focus();
        }
    }, [isOpen]);

    // Lock body scroll on mobile when chat is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    const sendMessage = async (messageText = input) => {
        if (!messageText.trim() || isLoading) return;

        const userMessage = {
            role: 'user',
            content: messageText.trim(),
            timestamp: new Date(),
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const result = await chatApi.sendMessage(
                messageText.trim(),
                sessionId,
                selectedLanguage === 'auto' ? null : selectedLanguage
            );

            if (result.success && result.data) {
                const response = result.data.data || result.data;

                // Store session ID for conversation continuity
                if (response.sessionId) {
                    setSessionId(response.sessionId);
                }

                const assistantMessage = {
                    role: 'assistant',
                    content: response.message,
                    timestamp: new Date(response.timestamp) || new Date(),
                    productSuggestions: response.productSuggestions,
                };

                setMessages(prev => [...prev, assistantMessage]);
            } else {
                setMessages(prev => [...prev, {
                    role: 'assistant',
                    content: 'Maaf kijiye, kuch masla hua. Dobara try karein.\n(Sorry, something went wrong. Please try again.)',
                    timestamp: new Date(),
                    isError: true,
                }]);
            }
        } catch (error) {
            console.error('Chat error:', error);
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: 'Network error. Please check your connection.',
                timestamp: new Date(),
                isError: true,
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const handleQuickPrompt = (prompt) => {
        sendMessage(prompt.text);
    };

    const isRtlText = (text) => {
        // Check if text contains Arabic/Urdu script
        return /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/.test(text);
    };

    // Hide entirely when cart drawer is open — prevents covering the Proceed button
    if (isCartOpen) return null;

    return (
        <div className="chat-widget-container">
            {/* Mobile backdrop — tap to close */}
            {isOpen && (
                <div
                    className="chat-mobile-backdrop"
                    onClick={() => setIsOpen(false)}
                    aria-label="Close chat"
                />
            )}

            {/* Branded Chat Toggle Button */}
            <button
                className={clsx('cartoon-chat-btn', isOpen && 'hidden')}
                onClick={() => setIsOpen(true)}
                aria-label="Open chat"
            >
                <div className="cartoon-speech-bubble">
                    Ask Craftistan AI ✦
                </div>

                {/* Premium branded SVG icon */}
                <div className="chat-fab-icon">
                    <svg viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
                        {/* Outer glow ring */}
                        <circle cx="28" cy="28" r="27" stroke="rgba(180,108,36,0.25)" strokeWidth="1.5"/>
                        {/* Main circle — deep warm dark */}
                        <circle cx="28" cy="28" r="26" fill="#0A0908"/>
                        {/* Subtle radial highlight */}
                        <circle cx="22" cy="18" r="10" fill="rgba(255,255,255,0.04)"/>
                        {/* Chat bubble body */}
                        <rect x="13" y="15" width="30" height="20" rx="7" fill="#B46C24"/>
                        {/* Chat bubble tail */}
                        <path d="M17 35 L13 42 L24 37" fill="#B46C24"/>
                        {/* Sparkle dot — top right of bubble */}
                        <circle cx="36" cy="12" r="3.5" fill="#E8A83E"/>
                        <circle cx="36" cy="12" r="1.5" fill="#0A0908"/>
                        {/* Three dots inside bubble */}
                        <circle cx="21" cy="25" r="2" fill="white" opacity="0.9"/>
                        <circle cx="28" cy="25" r="2" fill="white" opacity="0.9"/>
                        <circle cx="35" cy="25" r="2" fill="white" opacity="0.9"/>
                        {/* Craft thread arc — decorative */}
                        <path d="M20 20 Q28 17 36 20" stroke="rgba(255,255,255,0.3)" strokeWidth="1.2" strokeLinecap="round" fill="none"/>
                    </svg>
                </div>
            </button>

            {/* Chat Window */}
            <div className={clsx('chat-window', isOpen && 'open')}>
                {/* Header */}
                <div className="chat-header" style={{ position: 'relative' }}>
                    <div className="chat-header-info">
                        <div className="chat-avatar">
                            <Sparkles size={20} />
                        </div>
                        <div>
                            <h3>Craftistan Assistant</h3>
                            <span className="chat-status">
                                <span className="status-dot"></span>
                                Online - Multilingual Support
                            </span>
                        </div>
                    </div>
                    <div className="chat-header-actions">
                        {/* Language Selector */}
                        <div className="language-selector">
                            <button
                                className="language-btn"
                                onClick={() => setShowLanguageMenu(!showLanguageMenu)}
                                title="Select Language"
                            >
                                <Globe size={18} />
                            </button>
                            {showLanguageMenu && (
                                <div className="language-menu">
                                    {LANGUAGES.map(lang => (
                                        <button
                                            key={lang.code}
                                            className={clsx('language-option', selectedLanguage === lang.code && 'active')}
                                            onClick={() => {
                                                setSelectedLanguage(lang.code);
                                                setShowLanguageMenu(false);
                                            }}
                                        >
                                            <span>{lang.icon}</span>
                                            <span>{lang.label}</span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                        <button
                            className="chat-close-btn"
                            onClick={() => setIsOpen(false)}
                            aria-label="Close chat"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* Messages */}
                <div className="chat-messages">
                    {messages.map((msg, index) => (
                        <div
                            key={index}
                            className={clsx(
                                'chat-message',
                                msg.role === 'user' ? 'user' : 'assistant',
                                msg.isError && 'error'
                            )}
                        >
                            <div
                                className="message-content"
                                dir={isRtlText(msg.content) ? 'rtl' : 'ltr'}
                            >
                                {msg.content}
                            </div>

                            {/* Product Suggestions */}
                            {msg.productSuggestions && msg.productSuggestions.length > 0 && (
                                <div className="product-suggestions">
                                    {msg.productSuggestions.map(product => (
                                        <a
                                            key={product.id}
                                            href={`/product/${product.id}`}
                                            className="product-card"
                                        >
                                            {product.image && (
                                                <img src={product.image} alt={product.name} />
                                            )}
                                            <div className="product-info">
                                                <span className="product-name">{product.name}</span>
                                                <span className="product-price">Rs. {product.price}</span>
                                            </div>
                                        </a>
                                    ))}
                                </div>
                            )}

                            <span className="message-time">
                                {new Date(msg.timestamp).toLocaleTimeString([], {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </span>
                        </div>
                    ))}

                    {isLoading && (
                        <div className="chat-message assistant">
                            <div className="message-content typing">
                                <Loader2 size={16} className="animate-spin" />
                                <span>Typing...</span>
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                {/* Quick Prompts */}
                {messages.length <= 2 && (
                    <div className="quick-prompts">
                        {QUICK_PROMPTS.map((prompt, index) => (
                            <button
                                key={index}
                                className="quick-prompt-btn"
                                onClick={() => handleQuickPrompt(prompt)}
                            >
                                {prompt.label}
                            </button>
                        ))}
                    </div>
                )}

                {/* Input */}
                <div className="chat-input-container">
                    <input
                        ref={inputRef}
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Type your message... (Roman Urdu bhi chal jayega!)"
                        disabled={isLoading}
                        className="chat-input"
                        dir={isRtlText(input) ? 'rtl' : 'ltr'}
                    />
                    <button
                        className="send-btn"
                        onClick={() => sendMessage()}
                        disabled={!input.trim() || isLoading}
                    >
                        {isLoading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
                    </button>
                </div>
            </div>
        </div>
    );
}
