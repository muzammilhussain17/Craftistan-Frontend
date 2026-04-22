import { Layout } from "../components/layout/Layout";
import { useLanguage } from "../context/LanguageContext";
import { Link } from "react-router-dom";
import {
    Heart, Users, Globe, Award, MapPin, Phone, Mail, Clock,
    ShoppingBag, CreditCard, Truck, RotateCcw, HelpCircle, ChevronDown,
    Shield, Package, MessageCircle, Star
} from "lucide-react";

// About Page - Comprehensive company information
export function About() {
    const { t } = useLanguage();

    const stats = [
        { value: '500+', label: t('artisans'), icon: Users },
        { value: '10,000+', label: t('products'), icon: ShoppingBag },
        { value: '6', label: t('regions'), icon: MapPin },
        { value: '50,000+', label: t('happyCustomers'), icon: Heart },
    ];

    const values = [
        {
            icon: Heart,
            title: t('preservingHeritage'),
            description: t('preservingHeritageDesc')
        },
        {
            icon: Users,
            title: t('empoweringArtisans'),
            description: t('empoweringArtisansDesc')
        },
        {
            icon: Award,
            title: t('qualityCraftsmanship'),
            description: t('qualityCraftsmanshipDesc')
        },
        {
            icon: Globe,
            title: t('sustainablePractices'),
            description: t('sustainablePracticesDesc')
        },
    ];

    const regions = [
        t('regionPunjab'),
        t('regionSindh'),
        t('regionKPK'),
        t('regionBalochistan'),
        t('regionKashmir'),
        t('regionGB'),
    ];

    return (
        <Layout>
            <div className="bg-stone-50">
                {/* Hero Section */}
                <div className="bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900 text-white py-20">
                    <div className="max-w-5xl mx-auto px-6 text-center">
                        <h1 className="text-4xl md:text-5xl font-serif text-white mb-6">{t('aboutCraftistan')}</h1>                        <p className="text-xl text-white max-w-3xl mx-auto leading-relaxed">
                            {t('aboutHeroText')}
                        </p>
                    </div>
                </div>

                {/* Stats */}
                <div className="max-w-5xl mx-auto px-6 -mt-10">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {stats.map((stat, i) => (
                            <div key={i} className="bg-white rounded-xl p-6 text-center shadow-soft border border-stone-100">
                                <stat.icon className="w-8 h-8 text-ochre mx-auto mb-2" />
                                <div className="text-3xl font-bold text-stone-900">{stat.value}</div>
                                <div className="text-sm text-stone-500">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Our Story */}
                <div className="max-w-5xl mx-auto px-6 py-16">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl font-serif text-stone-900 mb-6">{t('ourStory')}</h2>
                            <div className="space-y-4 text-stone-600 leading-relaxed">
                                <p>{t('ourStoryP1')}</p>
                                <p>{t('ourStoryP2')}</p>
                                <p>{t('ourStoryP3')}</p>
                            </div>
                        </div>
                        <div className="bg-gradient-to-br from-ochre/10 to-terracotta/10 rounded-2xl p-8">
                            <h3 className="text-xl font-serif text-stone-900 mb-4">{t('regionsWeServe')}</h3>
                            <ul className="space-y-3">
                                {regions.map((region, i) => (
                                    <li key={i} className="flex items-start gap-2 text-stone-600">
                                        <MapPin className="w-4 h-4 text-ochre mt-1 flex-shrink-0" />
                                        {region}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Our Values */}
                <div className="bg-white py-16">
                    <div className="max-w-5xl mx-auto px-6">
                        <h2 className="text-3xl font-serif text-stone-900 text-center mb-12">{t('ourValues')}</h2>
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {values.map((value, i) => (
                                <div key={i} className="text-center">
                                    <div className="w-14 h-14 bg-ochre/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <value.icon className="w-7 h-7 text-ochre" />
                                    </div>
                                    <h3 className="font-medium text-stone-900 mb-2">{value.title}</h3>
                                    <p className="text-sm text-stone-500">{value.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* CTA */}
                <div className="max-w-5xl mx-auto px-6 py-16 text-center">
                    <h2 className="text-2xl font-serif text-stone-900 mb-4">{t('readyToExplore')}</h2>
                    <p className="text-stone-500 mb-6">{t('discoverTreasures')}</p>
                    <div className="flex gap-4 justify-center">
                        <Link to="/shop" className="px-6 py-3 bg-ochre text-white rounded-lg hover:bg-ochre-dark transition-colors">
                            {t('shopNow')}
                        </Link>
                        <Link to="/creators" className="px-6 py-3 border border-stone-300 text-stone-700 rounded-lg hover:bg-stone-100 transition-colors">
                            {t('meetOurArtisans')}
                        </Link>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

// Help Center - Comprehensive FAQ and support
export function Help() {
    const { t } = useLanguage();

    const faqs = [
        {
            category: t('ordersAndShopping'),
            icon: ShoppingBag,
            questions: [
                {
                    q: t('faqHowToOrder'),
                    a: t('faqHowToOrderA')
                },
                {
                    q: t('faqModifyOrder'),
                    a: t('faqModifyOrderA')
                },
                {
                    q: t('faqTrackOrder'),
                    a: t('faqTrackOrderA')
                },
                {
                    q: t('faqAuthentic'),
                    a: t('faqAuthenticA')
                },
            ]
        },
        {
            category: t('payment'),
            icon: CreditCard,
            questions: [
                {
                    q: t('faqPaymentMethods'),
                    a: t('faqPaymentMethodsA')
                },
                {
                    q: t('faqCOD'),
                    a: t('faqCODA')
                },
                {
                    q: t('faqRefund'),
                    a: t('faqRefundA')
                },
            ]
        },
        {
            category: t('accountSettings'),
            icon: Shield,
            questions: [
                {
                    q: t('faqForgotPassword'),
                    a: t('faqForgotPasswordA')
                },
                {
                    q: t('faqBecomeArtisan'),
                    a: t('faqBecomeArtisanA')
                },
            ]
        },
    ];

    return (
        <Layout>
            <div className="bg-stone-50 min-h-screen">
                {/* Hero */}
                <div className="bg-gradient-to-br from-stone-900 to-stone-800 text-white py-16">
                    <div className="max-w-4xl mx-auto px-6 text-center">
                        <HelpCircle className="w-12 h-12 mx-auto mb-4 text-ochre" />
                        <h1 className="text-4xl font-serif text-white mb-4">{t('helpTitle')}</h1>
                        <p className="text-stone-300">{t('howCanWeHelp')}</p>
                    </div>
                </div>

                {/* Quick Links */}
                <div className="max-w-4xl mx-auto px-6 -mt-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            { icon: Package, label: t('trackOrderLink'), link: '/track-order' },
                            { icon: RotateCcw, label: t('returnsLink'), link: '/shipping-returns' },
                            { icon: MessageCircle, label: t('chatSupport'), link: '#' },
                            { icon: Mail, label: t('emailUs'), link: '/contact' },
                        ].map((item, i) => (
                            <Link key={i} to={item.link} className="bg-white rounded-xl p-4 text-center shadow-soft border border-stone-100 hover:shadow-soft-lg transition-all">
                                <item.icon className="w-6 h-6 text-ochre mx-auto mb-2" />
                                <span className="text-sm font-medium text-stone-700">{item.label}</span>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* FAQs */}
                <div className="max-w-4xl mx-auto px-6 py-12">
                    <h2 className="text-2xl font-serif text-stone-900 mb-8 text-center">{t('popularTopics')}</h2>

                    <div className="space-y-8">
                        {faqs.map((category, i) => (
                            <div key={i} className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
                                <div className="flex items-center gap-3 px-6 py-4 bg-stone-50 border-b border-stone-200">
                                    <category.icon className="w-5 h-5 text-ochre" />
                                    <h3 className="font-medium text-stone-900">{category.category}</h3>
                                </div>
                                <div className="divide-y divide-stone-100">
                                    {category.questions.map((faq, j) => (
                                        <details key={j} className="group">
                                            <summary className="flex items-center justify-between px-6 py-4 cursor-pointer hover:bg-stone-50 transition-colors">
                                                <span className="font-medium text-stone-800 pr-4">{faq.q}</span>
                                                <ChevronDown className="w-5 h-5 text-stone-400 group-open:rotate-180 transition-transform flex-shrink-0" />
                                            </summary>
                                            <p className="px-6 pb-4 text-stone-600 leading-relaxed">{faq.a}</p>
                                        </details>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Contact CTA */}
                <div className="bg-white border-t border-stone-200 py-12">
                    <div className="max-w-4xl mx-auto px-6 text-center">
                        <h3 className="text-xl font-serif text-stone-900 mb-2">{t('stillNeedHelp')}</h3>
                        <p className="text-stone-500 mb-6">{t('supportHours')}</p>
                        <div className="flex flex-wrap gap-4 justify-center">
                            <a href="mailto:support@craftistan.pk" className="flex items-center gap-2 px-5 py-2.5 bg-ochre text-white rounded-lg hover:bg-ochre-dark transition-colors">
                                <Mail className="w-4 h-4" /> support@craftistan.pk
                            </a>
                            <a href="tel:+923001234567" className="flex items-center gap-2 px-5 py-2.5 border border-stone-300 text-stone-700 rounded-lg hover:bg-stone-100 transition-colors">
                                <Phone className="w-4 h-4" /> +92-300-1234567
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

// Contact Page
export function Contact() {
    const { t } = useLanguage();
    return (
        <Layout>
            <div className="bg-stone-50 min-h-screen pb-24">
                {/* Hero Section */}
                <div className="bg-stone-900 relative pb-32 pt-20">
                    {/* Decorative pattern */}
                    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>
                    <div className="relative max-w-5xl mx-auto px-6 text-center">
                        <span className="text-ochre uppercase tracking-widest text-sm font-semibold mb-4 block">Help & Support</span>
                        <h1 className="text-4xl md:text-6xl font-serif text-white mb-6 leading-tight">{t('getInTouch')}</h1>
                        <p className="text-stone-400 text-lg max-w-2xl mx-auto">
                            {t('contactHeroText') || 'Whether you\'re an artisan looking to join our community or a customer with a question about an order, our dedicated team is here to help.'}
                        </p>
                    </div>
                </div>

                {/* Overlapping Info Cards */}
                <div className="max-w-6xl mx-auto px-6 relative -mt-16 z-10">
                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="bg-white rounded-2xl p-8 shadow-lg border border-stone-100 flex flex-col items-center text-center transform transition duration-300 hover:-translate-y-1">
                            <div className="w-14 h-14 bg-ochre/10 rounded-full flex items-center justify-center mb-6">
                                <MessageCircle className="w-6 h-6 text-ochre" />
                            </div>
                            <h3 className="text-xl font-serif text-stone-900 mb-3">Customer Support</h3>
                            <p className="text-stone-500 mb-6 text-sm">Need help with an order or have questions about a product?</p>
                            <a href="mailto:support@craftistan.pk" className="text-ochre font-medium hover:underline mt-auto">support@craftistan.pk</a>
                        </div>
                        
                        <div className="bg-white rounded-2xl p-8 shadow-lg border border-stone-100 flex flex-col items-center text-center transform transition duration-300 hover:-translate-y-1">
                            <div className="w-14 h-14 bg-ochre/10 rounded-full flex items-center justify-center mb-6">
                                <Users className="w-6 h-6 text-ochre" />
                            </div>
                            <h3 className="text-xl font-serif text-stone-900 mb-3">Artisan Partnerships</h3>
                            <p className="text-stone-500 mb-6 text-sm">Join our vibrant marketplace and share your craft with the world.</p>
                            <a href="mailto:artisans@craftistan.pk" className="text-ochre font-medium hover:underline mt-auto">artisans@craftistan.pk</a>
                        </div>

                        <div className="bg-stone-800 rounded-2xl p-8 shadow-lg border border-stone-700 flex flex-col items-center text-center text-white transform transition duration-300 hover:-translate-y-1">
                            <div className="w-14 h-14 bg-stone-700 rounded-full flex items-center justify-center mb-6">
                                <MapPin className="w-6 h-6 text-stone-300" />
                            </div>
                            <h3 className="text-xl font-serif text-white mb-3">Main Office</h3>
                            <p className="text-stone-400 mb-6 text-sm">Craftistan HQ<br/>123 Artisan Street, Gulberg III<br/>Lahore, Pakistan</p>
                            <a href="tel:+923001234567" className="text-stone-300 font-medium hover:text-white transition-colors mt-auto flex items-center gap-2">
                                <Phone className="w-4 h-4"/> +92-300-1234567
                            </a>
                        </div>
                    </div>
                </div>

                {/* Form Section */}
                <div className="max-w-5xl mx-auto px-6 mt-24">
                    <div className="bg-white rounded-[2.5rem] border border-stone-200 overflow-hidden shadow-sm flex flex-col md:flex-row">
                        {/* Form area */}
                        <div className="md:w-3/5 p-10 md:p-14">
                            <h2 className="text-3xl font-serif text-stone-900 mb-2">{t('sendMessage')}</h2>
                            <p className="text-stone-500 text-sm mb-10">We usually respond within 24 hours.</p>

                            <form className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-stone-700">{t('yourName')}</label>
                                        <input type="text" className="w-full px-5 py-3.5 bg-stone-50 border border-transparent rounded-xl focus:bg-white focus:border-ochre focus:ring-4 focus:ring-ochre/10 outline-none transition-all placeholder:text-stone-400" placeholder="John Doe" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-stone-700">{t('email')}</label>
                                        <input type="email" className="w-full px-5 py-3.5 bg-stone-50 border border-transparent rounded-xl focus:bg-white focus:border-ochre focus:ring-4 focus:ring-ochre/10 outline-none transition-all placeholder:text-stone-400" placeholder="john@example.com" />
                                    </div>
                                </div>
                                
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-stone-700">{t('subject')}</label>
                                    <select className="w-full px-5 py-3.5 bg-stone-50 border border-transparent rounded-xl focus:bg-white focus:border-ochre focus:ring-4 focus:ring-ochre/10 outline-none transition-all cursor-pointer">
                                        <option>General Inquiry</option>
                                        <option>Order Support</option>
                                        <option>Become an Artisan</option>
                                        <option>Partnership</option>
                                        <option>Press & Media</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-stone-700">{t('message')}</label>
                                    <textarea rows="5" className="w-full px-5 py-3.5 bg-stone-50 border border-transparent rounded-xl focus:bg-white focus:border-ochre focus:ring-4 focus:ring-ochre/10 outline-none transition-all resize-none placeholder:text-stone-400" placeholder="How can we help you?"></textarea>
                                </div>

                                <button type="button" className="w-full bg-stone-900 text-white py-4 rounded-xl hover:bg-ochre transition-colors font-medium flex justify-center items-center gap-2 group mt-4">
                                    {t('sendMessageBtn')}
                                    <MessageCircle className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </form>
                        </div>

                        {/* Aside decorative/extra info */}
                        <div className="md:w-2/5 bg-stone-50 p-10 md:p-14 border-t md:border-t-0 md:border-l border-stone-200 flex flex-col justify-between">
                            <div>
                                <h3 className="font-serif text-stone-900 text-xl mb-6">Why Contact Us?</h3>
                                <ul className="space-y-8 text-sm text-stone-600">
                                    <li className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm border border-stone-100 shrink-0">
                                            <Shield className="w-4 h-4 text-ochre"/>
                                        </div>
                                        <span className="leading-relaxed mt-1">Secure resolution for any order discrepancies or payment issues.</span>
                                    </li>
                                    <li className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm border border-stone-100 shrink-0">
                                            <Package className="w-4 h-4 text-ochre"/>
                                        </div>
                                        <span className="leading-relaxed mt-1">Direct assistance with shipping, tracking, and efficient returns.</span>
                                    </li>
                                    <li className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm border border-stone-100 shrink-0">
                                            <Heart className="w-4 h-4 text-ochre"/>
                                        </div>
                                        <span className="leading-relaxed mt-1">We value your feedback and continually strive to perfect our artisan marketplace.</span>
                                    </li>
                                </ul>
                            </div>

                            <div className="mt-16 pt-8 border-t border-stone-200">
                                <p className="text-xs font-semibold text-stone-400 uppercase tracking-widest mb-4">Operating Hours</p>
                                <div className="space-y-2 text-sm text-stone-600">
                                    <div className="flex justify-between items-center bg-white px-4 py-3 rounded-lg shadow-sm border border-stone-100">
                                        <span className="font-medium">Mon - Sat</span>
                                        <span className="text-ochre font-medium">9:00 AM - 6:00 PM</span>
                                    </div>
                                    <div className="flex justify-between items-center px-4 py-3">
                                        <span>Sunday</span>
                                        <span className="font-medium text-stone-400">Closed</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

// Track Order Page
export function TrackOrder() {
    const { t } = useLanguage();
    return (
        <Layout>
            <div className="max-w-2xl mx-auto px-6 py-24">
                <div className="text-center mb-8">
                    <Package className="w-12 h-12 text-ochre mx-auto mb-4" />
                    <h1 className="text-3xl font-serif text-stone-900 mb-2">Track Your Order</h1>
                    <p className="text-stone-500">Enter your order ID to see the current status</p>
                </div>
                <div className="bg-white rounded-2xl p-8 shadow-soft border border-stone-100">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-stone-700 mb-1">Order ID</label>
                            <input
                                type="text"
                                placeholder="e.g., ORD-2024-0001"
                                className="w-full px-4 py-3 border border-stone-200 rounded-lg focus:border-ochre focus:ring-2 focus:ring-ochre/20 outline-none text-lg"
                            />
                        </div>
                        <button className="w-full bg-ochre text-white py-3 rounded-lg hover:bg-ochre-dark transition-colors font-medium">
                            Track Order
                        </button>
                    </div>
                    <p className="text-center text-sm text-stone-400 mt-4">
                        You can find your order ID in the confirmation email we sent you.
                    </p>
                </div>
                <div className="text-center mt-6">
                    <Link to="/orders" className="text-ochre hover:underline">
                        Or view all your orders →
                    </Link>
                </div>
            </div>
        </Layout>
    );
}

// Shipping & Returns Page
export function ShippingReturns() {
    const { t } = useLanguage();
    return (
        <Layout>
            <div className="bg-stone-50 min-h-screen py-16">
                <div className="max-w-4xl mx-auto px-6">
                    <h1 className="text-4xl font-serif text-stone-900 text-center mb-12">Shipping & Returns</h1>

                    <div className="space-y-8">
                        {/* Shipping */}
                        <div className="bg-white rounded-2xl p-8 shadow-soft border border-stone-100">
                            <div className="flex items-center gap-3 mb-6">
                                <Truck className="w-6 h-6 text-ochre" />
                                <h2 className="text-2xl font-serif text-stone-900">Shipping Policy</h2>
                            </div>
                            <div className="space-y-4 text-stone-600">
                                <div className="grid md:grid-cols-3 gap-4 mb-6">
                                    <div className="bg-stone-50 rounded-lg p-4 text-center">
                                        <div className="text-2xl font-bold text-stone-900">5-7</div>
                                        <div className="text-sm">Days Standard</div>
                                        <div className="text-xs text-ochre mt-1">Rs. 200</div>
                                    </div>
                                    <div className="bg-stone-50 rounded-lg p-4 text-center">
                                        <div className="text-2xl font-bold text-stone-900">2-3</div>
                                        <div className="text-sm">Days Express</div>
                                        <div className="text-xs text-ochre mt-1">Rs. 450</div>
                                    </div>
                                    <div className="bg-ochre/10 rounded-lg p-4 text-center">
                                        <div className="text-2xl font-bold text-ochre">FREE</div>
                                        <div className="text-sm">Orders 5,000+</div>
                                        <div className="text-xs text-stone-500 mt-1">Standard delivery</div>
                                    </div>
                                </div>
                                <ul className="list-disc list-inside space-y-2">
                                    <li>We deliver to all cities and towns across Pakistan</li>
                                    <li>Handcrafted made-to-order items may take 7-10 business days</li>
                                    <li>You'll receive tracking information via email once shipped</li>
                                    <li>International shipping available to select countries</li>
                                </ul>
                            </div>
                        </div>

                        {/* Returns */}
                        <div className="bg-white rounded-2xl p-8 shadow-soft border border-stone-100">
                            <div className="flex items-center gap-3 mb-6">
                                <RotateCcw className="w-6 h-6 text-ochre" />
                                <h2 className="text-2xl font-serif text-stone-900">Return Policy</h2>
                            </div>
                            <div className="space-y-4 text-stone-600">
                                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                                    <div className="flex items-center gap-2 text-green-700 font-medium">
                                        <Star className="w-5 h-5" />
                                        7-Day Easy Returns on Most Items
                                    </div>
                                </div>
                                <h4 className="font-medium text-stone-800">Eligibility:</h4>
                                <ul className="list-disc list-inside space-y-2">
                                    <li>Items must be unused and in original packaging</li>
                                    <li>All tags and labels must be attached</li>
                                    <li>Return request within 7 days of delivery</li>
                                </ul>
                                <h4 className="font-medium text-stone-800 mt-4">Non-Returnable Items:</h4>
                                <ul className="list-disc list-inside space-y-2">
                                    <li>Custom/personalized products</li>
                                    <li>Made-to-order items</li>
                                    <li>Perishable goods</li>
                                    <li>Items damaged by customer</li>
                                </ul>
                                <h4 className="font-medium text-stone-800 mt-4">Refund Process:</h4>
                                <ul className="list-disc list-inside space-y-2">
                                    <li>Refund initiated within 5-7 days after return received</li>
                                    <li>Amount credited to original payment method</li>
                                    <li>COD orders refunded via bank transfer or Easypaisa/JazzCash</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="text-center mt-8">
                        <p className="text-stone-500 mb-4">Have questions about shipping or returns?</p>
                        <Link to="/contact" className="text-ochre hover:underline">Contact our support team →</Link>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
