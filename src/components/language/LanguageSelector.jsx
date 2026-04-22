import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { LANGUAGES } from '../../i18n';
import './LanguageSelector.css';

export function LanguageSelector({ variant = 'default' }) {
    const { i18n, t } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const currentLanguage = LANGUAGES.find(l => l.code === i18n.language) || LANGUAGES[0];

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const changeLanguage = (langCode) => {
        i18n.changeLanguage(langCode);
        setIsOpen(false);
    };

    return (
        <div className={`language-selector ${variant}`} ref={dropdownRef}>
            <button
                className="language-trigger"
                onClick={() => setIsOpen(!isOpen)}
                aria-label={t('common.selectLanguage')}
            >
                <Globe size={18} />
                <span className="current-lang">{currentLanguage.name}</span>
                <ChevronDown size={16} className={`chevron ${isOpen ? 'open' : ''}`} />
            </button>

            {isOpen && (
                <div className="language-dropdown">
                    <div className="dropdown-header">
                        {t('common.selectLanguage')}
                    </div>
                    <div className="language-options">
                        {LANGUAGES.map(lang => (
                            <button
                                key={lang.code}
                                className={`language-option ${i18n.language === lang.code ? 'active' : ''}`}
                                onClick={() => changeLanguage(lang.code)}
                            >
                                <span className="lang-flag">{lang.flag}</span>
                                <span className="lang-name">{lang.name}</span>
                                <span className="lang-name-en">{lang.nameEn}</span>
                                {i18n.language === lang.code && (
                                    <Check size={16} className="check-icon" />
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
