import { useLanguage } from '../../context/LanguageContext';

export function Footer() {
    const { t } = useLanguage();

    return (
        <footer className="bg-stone-900 text-stone-50 pt-20 pb-10 rounded-t-[2.5rem] mt-20 relative overflow-hidden">
            {/* Decorative Texture/Pattern Overlay */}
            <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="grid md:grid-cols-4 gap-12 mb-16">
                    {/* Brand Column */}
                    <div className="space-y-6">
                        <h2 className="text-3xl font-serif font-bold tracking-tight">Craftistan.</h2>
                        <p className="text-stone-400 text-sm leading-relaxed max-w-xs">
                            {t('footerMission')}
                        </p>
                        <div className="font-urdu text-lg text-ochre-light dir-rtl" dir="rtl">
                            {t('footerTagline')}
                        </div>
                    </div>

                    {/* Links Column 1 - Shop */}
                    <div>
                        <h3 className="font-serif text-lg mb-6 text-stone-200">{t('shop')}</h3>
                        <ul className="space-y-4 text-stone-400 text-sm">
                            <li><a href="/shop?category=new-arrivals" className="hover:text-white transition-colors">{t('newArrivals')}</a></li>
                            <li><a href="/shop?category=home-decor" className="hover:text-white transition-colors">{t('homeDecor')}</a></li>
                            <li><a href="/shop?category=textiles" className="hover:text-white transition-colors">{t('textiles')}</a></li>
                            <li><a href="/shop?category=jewelry" className="hover:text-white transition-colors">{t('jewelry')}</a></li>
                        </ul>
                    </div>

                    {/* Links Column 2 - Story */}
                    <div>
                        <h3 className="font-serif text-lg mb-6 text-stone-200">{t('story')}</h3>
                        <ul className="space-y-4 text-stone-400 text-sm">
                            <li><a href="/about" className="hover:text-white transition-colors">{t('aboutUs')}</a></li>
                            <li><a href="/about" className="hover:text-white transition-colors">{t('ourArtisans')}</a></li>
                            <li><a href="/about" className="hover:text-white transition-colors">{t('impactReport')}</a></li>
                            <li><a href="/about" className="hover:text-white transition-colors">{t('journal')}</a></li>
                        </ul>
                    </div>

                    {/* Links Column 3 - Support */}
                    <div>
                        <h3 className="font-serif text-lg mb-6 text-stone-200">{t('support')}</h3>
                        <ul className="space-y-4 text-stone-400 text-sm">
                            <li><a href="/help" className="hover:text-white transition-colors">{t('helpCenter')}</a></li>
                            <li><a href="/shipping-returns" className="hover:text-white transition-colors">{t('shippingReturns')}</a></li>
                            <li><a href="/track-order" className="hover:text-white transition-colors">{t('trackOrder')}</a></li>
                            <li><a href="/contact" className="hover:text-white transition-colors">{t('contact')}</a></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-stone-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-stone-500">
                    <p>{t('rightsReserved')}</p>
                    <div className="flex items-center gap-6">
                        <a href="/about" className="hover:text-stone-300">{t('privacyPolicy')}</a>
                        <a href="/about" className="hover:text-stone-300">{t('termsOfService')}</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}

