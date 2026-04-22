import { createContext, useContext, useState, useEffect } from 'react';
import { translations, languages } from '../data/translations';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
    // Load from localStorage or default to 'en'
    const [currentLang, setCurrentLang] = useState(() => {
        const saved = localStorage.getItem('artisan_lang');
        return saved && translations[saved] ? saved : 'en';
    });

    // helper to get translation
    const t = (key) => {
        return translations[currentLang]?.[key] || translations['en']?.[key] || key;
    };

    const setLanguage = (langCode) => {
        if (translations[langCode]) {
            setCurrentLang(langCode);
            localStorage.setItem('artisan_lang', langCode);
        }
    };

    // Effect to handle Direction and Document Settings
    useEffect(() => {
        const langConfig = languages.find(l => l.code === currentLang);
        const dir = langConfig?.dir || 'ltr';

        document.documentElement.dir = dir;
        document.documentElement.lang = currentLang;

        // Optional: Add specific font class to body if needed for base font switching
        // document.body.className = langConfig.font || ''; 

    }, [currentLang]);

    return (
        <LanguageContext.Provider value={{ currentLang, setLanguage, t, languages }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}
