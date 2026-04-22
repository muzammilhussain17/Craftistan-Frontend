import { useState } from 'react';
import { Button } from '../components/ui/Button';
import { Layout } from '../components/layout/Layout';
import { useLanguage } from '../context/LanguageContext';
import { ArrowRight, ArrowUpRight, Sparkles } from 'lucide-react';

const URDU_FONT = { fontFamily: "'Noto Nastaliq Urdu', serif" };

export function Home() {
    const { t } = useLanguage();

    const categories = [
        { urdu: 'کشیدہ کاری', english: 'Embroidery', image: 'https://images.pexels.com/photos/6044266/pexels-photo-6044266.jpeg?auto=compress&cs=tinysrgb&w=800' },
        { urdu: 'مٹی کے برتن', english: 'Pottery', image: 'https://images.pexels.com/photos/2162938/pexels-photo-2162938.jpeg?auto=compress&cs=tinysrgb&w=800' },
        { urdu: 'زیورات', english: 'Jewelry', image: 'https://images.pexels.com/photos/1191531/pexels-photo-1191531.jpeg?auto=compress&cs=tinysrgb&w=800' },
        { urdu: 'قالین بافی', english: 'Carpets', image: 'https://images.pexels.com/photos/6032280/pexels-photo-6032280.jpeg?auto=compress&cs=tinysrgb&w=800' },
    ];

    const regions = [
        { urdu: 'پنجاب', english: 'Punjab', crafts: 'Phulkari · Woodwork' },
        { urdu: 'سندھ', english: 'Sindh', crafts: 'Ajrak · Ralli' },
        { urdu: 'خیبر پختونخوا', english: 'KPK', crafts: 'Brass · Carpets' },
        { urdu: 'بلوچستان', english: 'Balochistan', crafts: 'Mirror Work' },
        { urdu: 'گلگت بلتستان', english: 'Gilgit-Baltistan', crafts: 'Pashmina · Gems' },
        { urdu: 'کشمیر', english: 'Kashmir', crafts: 'Shawls · Woodcraft' },
    ];

    const stats = [
        { num: '500+', label: 'Curated Products' },
        { num: '50+', label: 'Verified Artisans' },
        { num: '6', label: 'Heritage Regions' },
    ];

    return (
        <Layout>
            <div className="relative bg-stone-100">

                {/* ─── Calligraphy Watermarks ─── */}
                <div className="fixed inset-0 pointer-events-none select-none overflow-hidden z-0" aria-hidden="true">
                    {[
                        { text: 'خوبصورتی', top: '8%', left: '4%', size: '130px', color: 'text-stone-800/[0.04]' },
                        { text: 'دستکاری', top: '28%', right: '8%', size: '110px', color: 'text-ochre/[0.05]' },
                        { text: 'میراث', top: '48%', left: '12%', size: '150px', color: 'text-terracotta/[0.04]' },
                        { text: 'روایت', top: '62%', right: '4%', size: '95px', color: 'text-stone-700/[0.05]' },
                        { text: 'کاریگری', top: '78%', left: '6%', size: '120px', color: 'text-ochre/[0.04]' },
                        { text: 'فن', top: '90%', right: '18%', size: '100px', color: 'text-terracotta/[0.05]' },
                    ].map((w, i) => (
                        <p
                            key={i}
                            className={`absolute leading-none whitespace-nowrap ${w.color}`}
                            style={{ ...URDU_FONT, fontSize: w.size, top: w.top, left: w.left, right: w.right }}
                            dir="rtl"
                        >
                            {w.text}
                        </p>
                    ))}
                </div>

                {/* ═══════════════════════════════════════════════════════
                    HERO — Dark Cinematic / Editorial
                ═══════════════════════════════════════════════════════ */}
                <section className="relative min-h-screen flex items-center -mt-24 overflow-hidden z-10">

                    {/* Full-bleed background image */}
                    <div className="absolute inset-0">
                        <img
                            src="https://images.pexels.com/photos/6044266/pexels-photo-6044266.jpeg?auto=compress&cs=tinysrgb&w=1600"
                            alt=""
                            className="w-full h-full object-cover object-center scale-[1.02]"
                            aria-hidden="true"
                        />
                        {/* Dark editorial overlay — original proven values + RTL support */}
                        <div className="absolute inset-0 bg-gradient-to-r rtl:bg-gradient-to-l from-stone-950/90 via-stone-950/70 to-stone-950/30" />
                        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/50 via-transparent to-stone-950/20" />
                    </div>

                    {/* Content */}
                    <div className="relative max-w-7xl mx-auto px-6 py-32 w-full">
                        <div className="max-w-2xl space-y-8 animate-fade-in">

                            {/* Overline — shimmer gold line */}
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-[2px] rounded-full hero-shimmer-line" />
                                <span className="label-overline text-stone-300 tracking-label">
                                    Pakistan's Premier Craft Marketplace
                                </span>
                            </div>

                            {/* Urdu Hero Title */}
                            <h1
                                className="text-6xl md:text-7xl text-white leading-tight drop-shadow-[0_2px_12px_rgba(0,0,0,0.5)]"
                                style={URDU_FONT}
                                dir="rtl"
                            >
                                پاکستان کا ورثہ
                            </h1>

                            {/* English sub-heading */}
                            <h2 className="text-2xl md:text-3xl font-serif text-stone-200 font-normal tracking-display">
                                {t('heroTitle')}
                            </h2>

                            {/* Description */}
                            <p className="text-base text-stone-400 leading-relaxed max-w-lg">
                                {t('heroSubtitle')}
                            </p>

                            {/* Poetry block */}
                            <div className="ltr:border-l-2 rtl:border-r-2 border-ochre/70 ltr:pl-5 rtl:pr-5 py-1 space-y-1">
                                <p className="text-xl text-stone-300/90" style={URDU_FONT} dir="rtl">
                                    جو کام ہاتھوں سے ہو، وہ دل سے نکلتا ہے
                                </p>
                                <p className="text-xs text-stone-500 italic">
                                    "What comes from hands, comes from the heart"
                                </p>
                            </div>

                            {/* CTA row */}
                            <div className="flex flex-wrap gap-4 pt-2">
                                <a href="/shop">
                                    <Button variant="gold" size="lg" rightIcon={<ArrowRight />} className="animate-glow-pulse">
                                        {t('shopCollection')}
                                    </Button>
                                </a>
                                <a href="/creators">
                                    <Button
                                        variant="outline"
                                        size="lg"
                                        className="border-stone-500 text-stone-300 hover:border-ochre hover:text-white bg-white/5 backdrop-blur-sm"
                                    >
                                        {t('meetCreators')}
                                    </Button>
                                </a>
                            </div>

                            {/* Language chips */}
                            <div className="flex flex-wrap gap-2 pt-1">
                                {['اردو', 'پښتو', 'سنڌي', 'بلوچی', 'شینا'].map((lang, i) => (
                                    <span
                                        key={i}
                                        className="px-3 py-1 rounded-full bg-white/[0.06] text-stone-400 text-xs border border-stone-600/80 backdrop-blur-sm hover:border-ochre/60 hover:text-stone-200 transition-colors duration-200 cursor-default"
                                        style={URDU_FONT}
                                    >
                                        {lang}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                </section>

                {/* ═══════════════════════════════════════════════════════
                    STATS BANNER — Hairline quality
                ═══════════════════════════════════════════════════════ */}
                <section className="relative z-10 border-y border-stone-700/80" style={{ background: 'linear-gradient(135deg, #0A0908 0%, #141210 50%, #0A0908 100%)' }}>
                    <div className="max-w-4xl mx-auto px-6 py-14 flex flex-col md:flex-row items-center gap-10">
                        {/* Urdu heading */}
                        <div className="text-center md:ltr:text-right md:rtl:text-left md:ltr:border-r md:rtl:border-l border-stone-700 md:ltr:pr-10 md:rtl:pl-10 md:ltr:mr-4 md:rtl:ml-4 shrink-0">
                            <p className="text-2xl text-stone-300/80" style={URDU_FONT} dir="rtl">
                                ہر دھاگے میں کہانی
                            </p>
                            <p className="text-xs text-stone-500 mt-1 uppercase tracking-label">A Story in Every Thread</p>
                        </div>

                        {/* Stats */}
                        <div className="flex gap-12 md:gap-16 flex-wrap justify-center">
                            {stats.map((s, i) => (
                                <div key={i} className="text-center">
                                    <p className="font-serif text-4xl font-bold text-white tracking-display stat-accent">{s.num}</p>
                                    <p className="label-overline text-stone-500 mt-3">{s.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ═══════════════════════════════════════════════════════
                    CATEGORIES — Editorial magazine grid
                ═══════════════════════════════════════════════════════ */}
                <section className="relative py-24 z-10">
                    <div className="max-w-7xl mx-auto px-6">
                        {/* Section header */}
                        <div className="flex items-end justify-between mb-12">
                            <div>
                                <p className="label-overline text-ochre mb-3">Our Craft Collections</p>
                                <p className="text-3xl text-stone-600/80 mb-1" style={URDU_FONT} dir="rtl">ہماری کاریگری</p>
                                <h2 className="text-3xl font-serif text-stone-900">Explore by Craft</h2>
                            </div>
                            <a href="/shop" className="hidden md:flex items-center gap-2 text-sm font-medium text-stone-500 hover:text-ochre transition-colors group">
                                View All
                                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                            </a>
                        </div>

                        {/* 4-column editorial grid */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
                            {categories.map((cat, i) => (
                                <a
                                    key={i}
                                    href="/shop"
                                    className="group relative h-72 md:h-96 rounded-xl2 overflow-hidden transition-all duration-400 hover:-translate-y-2"
                                    style={{ boxShadow: '0 4px 20px -2px rgba(20,18,16,0.08)', transition: 'transform 400ms cubic-bezier(0.25,1,0.5,1), box-shadow 400ms cubic-bezier(0.25,1,0.5,1)' }}
                                    onMouseEnter={e => e.currentTarget.style.boxShadow = '0 24px 64px -10px rgba(20,18,16,0.28), 0 0 0 1px rgba(180,108,36,0.15)'}
                                    onMouseLeave={e => e.currentTarget.style.boxShadow = '0 4px 20px -2px rgba(20,18,16,0.08)'}
                                >
                                    <img
                                        src={cat.image}
                                        alt={cat.english}
                                        className="w-full h-full object-cover group-hover:scale-[1.06] transition-transform duration-700"
                                    />
                                    {/* Stronger gradient for legibility */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-950/25 to-transparent" />

                                    {/* Ochre bottom accent — revealed on hover */}
                                    <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-ochre via-ochre-light to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />

                                    {/* Category label */}
                                    <div className="absolute bottom-0 left-0 right-0 p-5">
                                        <p className="text-xl text-white/95" style={URDU_FONT} dir="rtl">{cat.urdu}</p>
                                        <div className="flex items-center justify-between mt-1">
                                            <p className="text-sm text-stone-200 font-medium tracking-wide">{cat.english}</p>
                                            <ArrowUpRight className="w-4 h-4 text-ochre opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 duration-300" />
                                        </div>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ═══════════════════════════════════════════════════════
                    REGIONS — Clean enterprise grid
                ═══════════════════════════════════════════════════════ */}
                <section className="relative py-24 bg-ivory-warm z-10">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="flex items-end justify-between mb-12">
                            <div>
                                <p className="label-overline text-terracotta mb-3">Heritage Regions</p>
                                <p className="text-3xl text-stone-600/80 mb-1" style={URDU_FONT} dir="rtl">علاقے</p>
                                <h2 className="text-3xl font-serif text-stone-900">From Every Region</h2>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                            {regions.map((region, i) => (
                                <a
                                    key={i}
                                    href="/shop"
                                    className="group p-5 rounded-xl card-enterprise text-center"
                                >
                                    <p
                                        className="text-2xl text-ochre mb-2 group-hover:scale-110 transition-transform duration-300 inline-block"
                                        style={URDU_FONT}
                                        dir="rtl"
                                    >
                                        {region.urdu}
                                    </p>
                                    <p className="text-stone-800 font-semibold text-sm">{region.english}</p>
                                    <p className="text-stone-500 text-xs mt-1.5 leading-relaxed tracking-wide">{region.crafts}</p>
                                </a>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ═══════════════════════════════════════════════════════
                    ARTISAN CTA — Two path enterprise CTA
                ═══════════════════════════════════════════════════════ */}
                <section className="relative py-24 z-10 bg-stone-900 overflow-hidden">
                    {/* Subtle calligraphy backdrop */}
                    <p
                        className="absolute ltr:right-[-2%] rtl:left-[-2%] top-1/2 -translate-y-1/2 text-[200px] leading-none text-white/[0.025] select-none pointer-events-none whitespace-nowrap"
                        style={URDU_FONT}
                        dir="rtl"
                        aria-hidden="true"
                    >
                        سفر
                    </p>

                    <div className="max-w-5xl mx-auto px-6 relative">
                        <div className="text-center mb-16">
                            <p className="label-overline text-stone-500 mb-4">Join Our Community</p>
                            <p className="text-3xl text-stone-300/80 mb-3" style={URDU_FONT} dir="rtl">سفر شروع کریں</p>
                            <h2 className="text-4xl md:text-5xl font-serif text-white tracking-display">Begin Your Journey</h2>
                        </div>

                        {/* Two-column pathway cards */}
                        <div className="grid md:grid-cols-2 gap-5">
                            {[{
                                urdu: 'خریداری',
                                title: 'Shop the Collection',
                                desc: 'Discover thousands of authentic hand-crafted pieces from verified Pakistani artisans.',
                                cta: 'Browse Collection',
                                href: '/shop',
                                variant: 'gold',
                            }, {
                                urdu: 'کاریگر',
                                title: 'Become an Artisan',
                                desc: 'Showcase your craft to the world. Join our community of verified heritage artists.',
                                cta: 'Apply as Artisan',
                                href: '/creators',
                                variant: 'secondary',
                            }].map((card, i) => (
                                <div
                                    key={i}
                                    className="p-8 rounded-xl2 border border-stone-700/60 hover:border-stone-600 transition-all duration-300 hover:bg-stone-800/50 group"
                                    style={{
                                        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05)',
                                        transition: 'all 350ms cubic-bezier(0.25,1,0.5,1)',
                                    }}
                                    onMouseEnter={e => { e.currentTarget.style.boxShadow = 'inset 0 1px 0 rgba(255,255,255,0.05), 0 0 40px -10px rgba(180,108,36,0.18)'; }}
                                    onMouseLeave={e => { e.currentTarget.style.boxShadow = 'inset 0 1px 0 rgba(255,255,255,0.05)'; }}
                                >
                                    <p className="text-3xl text-ochre/80 mb-3" style={URDU_FONT} dir="rtl">{card.urdu}</p>
                                    <h3 className="text-xl font-serif text-white mb-3">{card.title}</h3>
                                    <p className="text-sm text-stone-400 leading-relaxed mb-6">{card.desc}</p>
                                    <a href={card.href}>
                                        <Button variant={card.variant} size="md" rightIcon={<ArrowRight />}>
                                            {card.cta}
                                        </Button>
                                    </a>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </div>
        </Layout>
    );
}