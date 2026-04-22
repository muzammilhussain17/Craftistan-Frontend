import { Layout } from '../components/layout/Layout';
import { Mail, Phone, MapPin, Star, Award } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const CREATORS = [
    {
        id: 1,
        name: 'Fatima Zahra',
        specialty: 'Silk Weaving & Embroidery',
        location: 'Lahore, Punjab',
        image: 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=400',
        rating: 4.9,
        products: 23,
        experience: '15 years',
        bio: 'Master artisan specializing in traditional Lahori silk work and intricate embroidery patterns passed down through generations.',
        verified: true,
    },
    {
        id: 2,
        name: 'Muhammad Usman',
        specialty: 'Handcrafted Pottery',
        location: 'Multan, Punjab',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
        rating: 4.8,
        products: 45,
        experience: '20 years',
        bio: 'Third-generation potter from Multan, known for his blue pottery and traditional camel-skin lamp designs.',
        verified: true,
    },
    {
        id: 3,
        name: 'Ayesha Bibi',
        specialty: 'Ajrak Block Printing',
        location: 'Hyderabad, Sindh',
        image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400',
        rating: 5.0,
        products: 34,
        experience: '12 years',
        bio: 'Preserving the ancient art of Sindhi Ajrak, creating stunning block-printed textiles using natural dyes.',
        verified: true,
    },
    {
        id: 4,
        name: 'Hassan Ali Khan',
        specialty: 'Woodcarving & Furniture',
        location: 'Chiniot, Punjab',
        image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
        rating: 4.7,
        products: 18,
        experience: '25 years',
        bio: 'Master woodcarver from Chiniot, crafting intricate furniture and decorative pieces from solid walnut and sheesham wood.',
        verified: true,
    },
    {
        id: 5,
        name: 'Nadia Khatun',
        specialty: 'Pashmina Shawls',
        location: 'Gilgit-Baltistan',
        image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
        rating: 4.9,
        products: 28,
        experience: '18 years',
        bio: 'Weaving authentic Pashmina shawls using traditional techniques from the mountains of Gilgit-Baltistan.',
        verified: true,
    },
    {
        id: 6,
        name: 'Abdul Rasheed',
        specialty: 'Brass & Copperwork',
        location: 'Peshawar, KPK',
        image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
        rating: 4.6,
        products: 52,
        experience: '30 years',
        bio: 'Creating stunning brass lanterns, trays, and decorative items using centuries-old Peshawari metalworking traditions.',
        verified: true,
    },
    {
        id: 7,
        name: 'Sana Mirza',
        specialty: 'Jewelry Design',
        location: 'Karachi, Sindh',
        image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
        rating: 4.8,
        products: 67,
        experience: '10 years',
        bio: 'Modern jewelry artist blending traditional Kundan and Meenakari techniques with contemporary designs.',
        verified: true,
    },
    {
        id: 8,
        name: 'Imran Shah',
        specialty: 'Leather Crafts',
        location: 'Sialkot, Punjab',
        image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400',
        rating: 4.5,
        products: 31,
        experience: '14 years',
        bio: 'Handcrafting premium leather goods including bags, journals, and accessories using ethically sourced materials.',
        verified: false,
    },
];

export function Creators() {
    const { t } = useLanguage();

    return (
        <Layout>
            <div className="min-h-screen bg-stone-50 pt-28 pb-16">
                <div className="max-w-7xl mx-auto px-6">

                    {/* Header */}
                    <div className="text-center mb-16">
                        <span className="inline-block px-4 py-1.5 bg-ochre/10 text-ochre text-sm font-medium rounded-full mb-4">
                            {t('ourArtisanCommunity')}
                        </span>
                        <h1 className="text-4xl md:text-5xl font-serif text-stone-900 mb-4">{t('meetOurCreators')}</h1>
                        <p className="text-lg text-stone-500 max-w-2xl mx-auto">
                            {t('creatorsSubtitle')}
                        </p>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
                        <div className="bg-white rounded-xl p-6 text-center border border-stone-100">
                            <p className="text-3xl font-bold text-stone-900">50+</p>
                            <p className="text-sm text-stone-500">{t('verifiedArtisans')}</p>
                        </div>
                        <div className="bg-white rounded-xl p-6 text-center border border-stone-100">
                            <p className="text-3xl font-bold text-stone-900">8</p>
                            <p className="text-sm text-stone-500">{t('regionsRepresented')}</p>
                        </div>
                        <div className="bg-white rounded-xl p-6 text-center border border-stone-100">
                            <p className="text-3xl font-bold text-stone-900">500+</p>
                            <p className="text-sm text-stone-500">{t('productsCreated')}</p>
                        </div>
                        <div className="bg-white rounded-xl p-6 text-center border border-stone-100">
                            <p className="text-3xl font-bold text-stone-900">15+</p>
                            <p className="text-sm text-stone-500">{t('craftCategories')}</p>
                        </div>
                    </div>

                    {/* Creators Grid */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {CREATORS.map(creator => (
                            <div
                                key={creator.id}
                                className="group bg-white rounded-2xl overflow-hidden border border-stone-100 hover:shadow-xl transition-all duration-300"
                            >
                                {/* Image */}
                                <div className="relative h-48 overflow-hidden">
                                    <img
                                        src={creator.image}
                                        alt={creator.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    {creator.verified && (
                                        <div className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md">
                                            <Award className="w-4 h-4 text-ochre" />
                                        </div>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="p-5">
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="font-serif text-lg font-medium text-stone-900">{creator.name}</h3>
                                        <div className="flex items-center gap-1 text-sm">
                                            <Star className="w-4 h-4 fill-ochre text-ochre" />
                                            <span className="font-medium">{creator.rating}</span>
                                        </div>
                                    </div>

                                    <p className="text-sm text-ochre font-medium mb-1">{creator.specialty}</p>

                                    <div className="flex items-center gap-1 text-xs text-stone-400 mb-3">
                                        <MapPin className="w-3 h-3" />
                                        {creator.location}
                                    </div>

                                    <p className="text-sm text-stone-500 line-clamp-2 mb-4">{creator.bio}</p>

                                    <div className="flex items-center justify-between text-xs text-stone-400 pt-3 border-t border-stone-100">
                                        <span>{creator.products} products</span>
                                        <span>{creator.experience} exp.</span>
                                    </div>

                                    {/* Contact Button */}
                                    <Link
                                        to="/contact"
                                        className="mt-4 w-full py-2.5 bg-stone-100 text-stone-700 rounded-lg text-sm font-medium hover:bg-stone-200 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <Mail className="w-4 h-4" />
                                        {t('contactArtisan')}
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* CTA */}
                    <div className="mt-16 bg-stone-900 rounded-2xl p-8 md:p-12 text-center">
                        <h2 className="text-2xl md:text-3xl font-serif text-white mb-4">{t('areYouArtisan')}</h2>
                        <p className="text-stone-400 max-w-lg mx-auto mb-6">
                            {t('joinCommunity')}
                        </p>
                        <Link
                            to="/contact"
                            className="inline-block px-8 py-3 bg-ochre text-white rounded-lg font-medium hover:bg-ochre/90 transition-colors"
                        >
                            {t('registerAsCreator')}
                        </Link>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
