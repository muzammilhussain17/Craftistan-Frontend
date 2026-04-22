import { X, Check } from 'lucide-react';
import { Button } from '../ui/Button';
import clsx from 'clsx';
import { useLanguage } from '../../context/LanguageContext';

export function FilterPanel({ isOpen, onClose }) {
    const { t, currentLang } = useLanguage();
    const isRTL = currentLang !== 'en';

    return (
        <>
            {/* Backdrop */}
            <div
                className={clsx(
                    "fixed inset-0 bg-stone-900/40 backdrop-blur-sm z-[60] transition-opacity duration-300",
                    isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                )}
                onClick={onClose}
            />

            {/* Panel */}
            <div
                className={clsx(
                    "fixed top-0 bottom-0 z-[70] w-full max-w-sm bg-white shadow-2xl transition-transform duration-300 ease-out flex flex-col",
                    isRTL
                        ? (isOpen ? "left-0 translate-x-0" : "left-0 -translate-x-full")
                        : (isOpen ? "right-0 translate-x-0" : "right-0 translate-x-full")
                )}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-stone-100">
                    <h2 className="text-2xl font-serif text-stone-900">{t('filters') || 'Filters'}</h2>
                    <button
                        onClick={onClose}
                        className="p-2 text-stone-400 hover:text-stone-600 rounded-full hover:bg-stone-100 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-8">
                    {/* Categories */}
                    <div className="space-y-4">
                        <h3 className="font-medium text-stone-900">{t('categories') || 'Categories'}</h3>
                        <div className="space-y-2">
                            {['Ceramics', 'Textiles', 'Woodwork', 'Jewelry'].map((cat) => (
                                <label key={cat} className="flex items-center gap-3 text-stone-600 cursor-pointer group">
                                    <div className="w-5 h-5 rounded border border-stone-300 flex items-center justify-center transition-colors group-hover:border-ochre">
                                        {/* Mock check state */}
                                    </div>
                                    <span>{cat}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Price Range */}
                    <div className="space-y-4">
                        <h3 className="font-medium text-stone-900">{t('priceRange') || 'Price Range'}</h3>
                        <div className="flex items-center gap-4">
                            <input type="number" placeholder="Min" className="w-full px-3 py-2 rounded-lg border border-stone-200 text-sm focus:border-ochre outline-none" />
                            <span className="text-stone-400">-</span>
                            <input type="number" placeholder="Max" className="w-full px-3 py-2 rounded-lg border border-stone-200 text-sm focus:border-ochre outline-none" />
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-stone-100 bg-stone-50">
                    <div className="flex gap-4">
                        <Button variant="outline" className="flex-1" onClick={onClose}>Reset</Button>
                        <Button variant="primary" className="flex-1" onClick={onClose}>Apply</Button>
                    </div>
                </div>
            </div>
        </>
    );
}
