import { twMerge } from 'tailwind-merge';
import { BadgeCheck, Heart } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useState } from 'react';

export function ProductCard({
    image,
    title,
    creator,
    price,
    isVerified,
    className,
    onClick,
}) {
    const { t } = useLanguage();
    const [wishlisted, setWishlisted] = useState(false);

    return (
        <div
            onClick={onClick}
            className={twMerge(
                'group relative bg-white rounded-xl2 overflow-hidden cursor-pointer',
                'border border-stone-200/70',
                'shadow-xs hover:shadow-soft-lg hover:-translate-y-1',
                'transition-all duration-400',
                className
            )}
        >
            {/* Image Container */}
            <div className="relative aspect-[4/5] w-full overflow-hidden bg-stone-100">
                <img
                    src={image}
                    alt={title}
                    className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-[1.04]"
                />
                {/* Subtle gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-stone-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />

                {/* Wishlist button */}
                <button
                    onClick={(e) => { e.stopPropagation(); setWishlisted(w => !w); }}
                    className={[
                        'absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center',
                        'bg-white/90 backdrop-blur-sm shadow-soft',
                        'opacity-0 group-hover:opacity-100',
                        'transition-all duration-300',
                        'hover:scale-110',
                    ].join(' ')}
                    aria-label="Wishlist"
                >
                    <Heart
                        className={`w-4 h-4 transition-colors ${wishlisted ? 'fill-red-500 text-red-500' : 'text-stone-400'}`}
                    />
                </button>
            </div>

            {/* Content */}
            <div className="px-4 pt-4 pb-5 space-y-2">
                {/* Creator */}
                <div className="flex items-center gap-1.5">
                    <span className="text-xs text-stone-400 font-medium uppercase tracking-label">
                        {creator}
                    </span>
                    {isVerified && (
                        <BadgeCheck
                            className="w-3.5 h-3.5 text-ochre"
                            title={t('verifiedArtisan')}
                        />
                    )}
                </div>

                {/* Title */}
                <h3 className="font-serif text-base text-stone-900 leading-snug tracking-display group-hover:text-ochre-dark transition-colors">
                    {title}
                </h3>

                {/* Price */}
                <div className="flex items-center justify-between pt-1">
                    <p className="text-sm font-semibold text-stone-800">
                        {price}
                    </p>
                    <span className="text-2xs text-stone-300 uppercase tracking-label">View →</span>
                </div>
            </div>
        </div>
    );
}
