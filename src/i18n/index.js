import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import en from './locales/en.json';
import ur from './locales/ur.json';
import pa from './locales/pa.json';
import ps from './locales/ps.json';
import sd from './locales/sd.json';
import bal from './locales/bal.json';

// Supported languages configuration
export const LANGUAGES = [
    { code: 'ur', name: 'اردو', nameEn: 'Urdu', flag: '🇵🇰', dir: 'rtl' },
    { code: 'en', name: 'English', nameEn: 'English', flag: '🇬🇧', dir: 'ltr' },
    { code: 'pa', name: 'پنجابی', nameEn: 'Punjabi', flag: '🇵🇰', dir: 'rtl' },
    { code: 'ps', name: 'پښتو', nameEn: 'Pashto', flag: '🇵🇰', dir: 'rtl' },
    { code: 'sd', name: 'سنڌي', nameEn: 'Sindhi', flag: '🇵🇰', dir: 'rtl' },
    { code: 'bal', name: 'بلوچی', nameEn: 'Balochi', flag: '🇵🇰', dir: 'rtl' },
];

// Get direction for a language code
export const getDirection = (langCode) => {
    const lang = LANGUAGES.find(l => l.code === langCode);
    return lang?.dir || 'ltr';
};

// Initialize i18n
i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources: {
            en: { translation: en },
            ur: { translation: ur },
            pa: { translation: pa },
            ps: { translation: ps },
            sd: { translation: sd },
            bal: { translation: bal },
        },
        fallbackLng: 'ur', // Default to Urdu for Pakistani users
        supportedLngs: ['en', 'ur', 'pa', 'ps', 'sd', 'bal'],

        detection: {
            order: ['localStorage', 'navigator'],
            caches: ['localStorage'],
        },

        interpolation: {
            escapeValue: false, // React already escapes
        },
    });

// Update document direction when language changes
i18n.on('languageChanged', (lng) => {
    const dir = getDirection(lng);
    document.documentElement.dir = dir;
    document.documentElement.lang = lng;
    localStorage.setItem('craftistan_language', lng);
});

// Set initial direction
const savedLang = localStorage.getItem('craftistan_language') || 'ur';
document.documentElement.dir = getDirection(savedLang);
document.documentElement.lang = savedLang;

export default i18n;
