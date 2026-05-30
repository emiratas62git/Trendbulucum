"use client";
import React, { useEffect, useState } from 'react';
import { Globe, X, Check } from 'lucide-react';
import { usePathname } from 'next/navigation';

const LANGUAGE_MAP = {
    'en': 'English',
    'tr': 'Türkçe',
    'de': 'Deutsch',
    'es': 'Español',
    'fr': 'Français',
    'it': 'Italiano',
    'pt': 'Português',
    'ru': 'Русский',
    'ja': '日本語',
    'zh': '中文',
    'ar': 'العربية'
};

export default function ClientTranslationProvider({ children }) {
    const [isOpen, setIsOpen] = useState(false);
    const [currentLang, setCurrentLang] = useState('en');
    const [detectedCountry, setDetectedCountry] = useState('');
    const pathname = usePathname();

    // 1. Client-Side Page Visit Tracker
    useEffect(() => {
        const trackPageVisit = async () => {
            try {
                await fetch('/api/admin/track', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ path: pathname })
                });
            } catch (e) {
                console.warn("Analytics tracking skipped:", e);
            }
        };
        trackPageVisit();
    }, [pathname]);

    useEffect(() => {
        // 2. Google Translate Init callback
        window.googleTranslateElementInit = () => {
            new window.google.translate.TranslateElement({
                pageLanguage: 'en',
                includedLanguages: Object.keys(LANGUAGE_MAP).join(','),
                layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
                autoDisplay: false
            }, 'google_translate_element');
        };

        // 2. Load Google Translate script
        const addScript = () => {
            if (document.getElementById('google-translate-script')) return;
            const script = document.createElement('script');
            script.id = 'google-translate-script';
            script.type = 'text/javascript';
            script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
            document.body.appendChild(script);
        };
        addScript();

        // 3. Read active language from cookie googtrans
        const getCookie = (name) => {
            const value = `; ${document.cookie}`;
            const parts = value.split(`; ${name}=`);
            if (parts.length === 2) return parts.pop().split(';').shift();
            return null;
        };

        const activeCookie = getCookie('googtrans');
        if (activeCookie) {
            const lang = activeCookie.split('/').pop();
            if (LANGUAGE_MAP[lang]) {
                setCurrentLang(lang);
            }
        }

        // 4. Geo-IP automatic country detection (runs once per user session)
        const detectUserLanguage = async () => {
            try {
                const cached = localStorage.getItem('tf_geo_lang');
                const cachedCountry = localStorage.getItem('tf_geo_country');
                
                if (cached) {
                    setDetectedCountry(cachedCountry || '');
                    if (!activeCookie) {
                        applyTranslation(cached);
                    }
                    return;
                }

                console.log("Detecting country of origin via geo-IP...");
                const res = await fetch('https://ipapi.co/json/');
                if (!res.ok) throw new Error("Geo-IP request failed");
                const data = await res.json();
                
                const country = data.country_name || '';
                const languages = data.languages ? data.languages.split(',') : [];
                const primaryLang = languages[0] ? languages[0].split('-')[0].toLowerCase() : 'en';

                setDetectedCountry(country);
                localStorage.setItem('tf_geo_country', country);
                
                if (LANGUAGE_MAP[primaryLang]) {
                    localStorage.setItem('tf_geo_lang', primaryLang);
                    if (!activeCookie) {
                        console.log(`Auto-translating to ${LANGUAGE_MAP[primaryLang]} based on origin country: ${country}`);
                        applyTranslation(primaryLang);
                    }
                } else {
                    localStorage.setItem('tf_geo_lang', 'en');
                }
            } catch (err) {
                console.warn("Geo-IP detection bypassed or failed:", err);
            }
        };

        detectUserLanguage();
    }, []);

    const applyTranslation = (langCode) => {
        // English is the default page language — no cookie or reload needed
        if (langCode === 'en') {
            setCurrentLang('en');
            return;
        }

        const targetCookieValue = `/en/${langCode}`;

        // Check if the cookie is already set to this language to prevent reload loops
        const getCookieValue = (name) => {
            const value = `; ${document.cookie}`;
            const parts = value.split(`; ${name}=`);
            if (parts.length === 2) return parts.pop().split(';').shift();
            return null;
        };

        const existingCookie = getCookieValue('googtrans');

        // If already translated to this language, skip reload entirely
        if (existingCookie === targetCookieValue) {
            setCurrentLang(langCode);
            return;
        }

        // CRITICAL: Guard against infinite reload loops using sessionStorage.
        // If we already triggered a reload in this browser session for this language, stop here.
        const reloadKey = `tf_reload_${langCode}`;
        if (sessionStorage.getItem(reloadKey)) {
            // Already reloaded once for this language — just update UI state, no more reloads
            setCurrentLang(langCode);
            return;
        }

        // Set standard google translate cookies
        const domain = window.location.hostname;
        document.cookie = `googtrans=${targetCookieValue}; path=/;`;
        document.cookie = `googtrans=${targetCookieValue}; path=/; domain=${domain};`;
        document.cookie = `googtrans=${targetCookieValue}; path=/; domain=.${domain};`;

        setCurrentLang(langCode);

        // Mark that we are about to reload for this language, so after reload we don't loop
        sessionStorage.setItem(reloadKey, '1');

        // Reload once to let Google Translate initialize with the new cookie
        window.location.reload();
    };

    const handleLanguageChange = (langCode) => {
        applyTranslation(langCode);
        setIsOpen(false);
    };

    const resetTranslation = () => {
        const domain = window.location.hostname;
        document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${domain};`;
        document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${domain};`;

        // Clear all reload guards so language can be re-applied cleanly
        Object.keys(LANGUAGE_MAP).forEach(lang => {
            sessionStorage.removeItem(`tf_reload_${lang}`);
        });

        setCurrentLang('en');
        window.location.reload();
    };

    return (
        <>
            {children}

            {/* Hidden element for Google Translate script initialization */}
            <div id="google_translate_element" style={{ display: 'none' }} />

            {/* Premium Glassmorphic Floating Language Switcher Widget */}
            <div className="translate-widget-container">
                <button 
                    onClick={() => setIsOpen(!isOpen)} 
                    className="translate-trigger-btn"
                    title="Change Language"
                >
                    <Globe size={20} />
                    <span className="lang-code-badge">{currentLang.toUpperCase()}</span>
                </button>

                {isOpen && (
                    <div className="translate-modal">
                        <div className="translate-modal-header">
                            <div>
                                <h4>Automatic Translation</h4>
                                {detectedCountry && <span className="detected-country-text">Detected country: {detectedCountry}</span>}
                            </div>
                            <button onClick={() => setIsOpen(false)} className="close-modal-btn">
                                <X size={16} />
                            </button>
                        </div>

                        <div className="languages-grid">
                            {Object.entries(LANGUAGE_MAP).map(([code, name]) => (
                                <button
                                    key={code}
                                    onClick={() => handleLanguageChange(code)}
                                    className={`lang-option-btn ${currentLang === code ? 'active' : ''}`}
                                >
                                    <span>{name}</span>
                                    {currentLang === code && <Check size={14} className="active-check-icon" />}
                                </button>
                            ))}
                        </div>

                        {currentLang !== 'en' && (
                            <button onClick={resetTranslation} className="reset-lang-btn">
                                Show Original (English)
                            </button>
                        )}
                    </div>
                )}
            </div>

            <style jsx global>{`
                .translate-widget-container {
                    position: fixed;
                    bottom: 24px;
                    right: 24px;
                    z-index: 99999;
                    font-family: 'Inter', sans-serif;
                }

                .translate-trigger-btn {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    background: rgba(15, 23, 42, 0.75);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    backdrop-filter: blur(12px);
                    -webkit-backdrop-filter: blur(12px);
                    color: white;
                    padding: 10px 16px;
                    border-radius: 9999px;
                    cursor: pointer;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3), inset 0 1px 1px rgba(255, 255, 255, 0.1);
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }

                .translate-trigger-btn:hover {
                    background: rgba(139, 92, 246, 0.2);
                    border-color: rgba(139, 92, 246, 0.5);
                    box-shadow: 0 0 15px rgba(139, 92, 246, 0.3);
                    transform: translateY(-2px);
                }

                .lang-code-badge {
                    font-size: 0.75rem;
                    font-weight: 700;
                    background: rgba(139, 92, 246, 0.3);
                    color: #c084fc;
                    padding: 2px 6px;
                    border-radius: 4px;
                    border: 1px solid rgba(139, 92, 246, 0.3);
                }

                .translate-modal {
                    position: absolute;
                    bottom: 60px;
                    right: 0;
                    width: 320px;
                    background: rgba(15, 23, 42, 0.9);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    backdrop-filter: blur(20px);
                    -webkit-backdrop-filter: blur(20px);
                    border-radius: 16px;
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
                    padding: 16px;
                    animation: slideUp 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                }

                @keyframes slideUp {
                    from { transform: translateY(10px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }

                .translate-modal-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    margin-bottom: 14px;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
                    padding-bottom: 8px;
                }

                .translate-modal-header h4 {
                    margin: 0;
                    color: white;
                    font-size: 0.95rem;
                    font-weight: 600;
                }

                .detected-country-text {
                    font-size: 0.7rem;
                    color: #94a3b8;
                    display: block;
                    margin-top: 2px;
                }

                .close-modal-btn {
                    background: transparent;
                    border: none;
                    color: #94a3b8;
                    cursor: pointer;
                    padding: 2px;
                    border-radius: 4px;
                }

                .close-modal-btn:hover {
                    color: white;
                    background: rgba(255, 255, 255, 0.05);
                }

                .languages-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 6px;
                    max-height: 220px;
                    overflow-y: auto;
                    margin-bottom: 12px;
                    padding-right: 4px;
                }

                /* Custom Scrollbar for Languages */
                .languages-grid::-webkit-scrollbar {
                    width: 4px;
                }
                .languages-grid::-webkit-scrollbar-track {
                    background: rgba(255, 255, 255, 0.02);
                }
                .languages-grid::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 2px;
                }

                .lang-option-btn {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    background: rgba(255, 255, 255, 0.03);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    color: #cbd5e1;
                    padding: 8px 12px;
                    border-radius: 8px;
                    font-size: 0.8rem;
                    cursor: pointer;
                    text-align: left;
                    transition: all 0.2s ease;
                }

                .lang-option-btn:hover {
                    background: rgba(255, 255, 255, 0.08);
                    border-color: rgba(255, 255, 255, 0.15);
                    color: white;
                }

                .lang-option-btn.active {
                    background: rgba(139, 92, 246, 0.2);
                    border-color: rgba(139, 92, 246, 0.4);
                    color: #a78bfa;
                    font-weight: 600;
                }

                .active-check-icon {
                    color: #a78bfa;
                }

                .reset-lang-btn {
                    width: 100%;
                    background: transparent;
                    border: 1px dashed rgba(255, 255, 255, 0.2);
                    color: #94a3b8;
                    padding: 8px;
                    border-radius: 8px;
                    font-size: 0.75rem;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    margin-top: 4px;
                }

                .reset-lang-btn:hover {
                    border-color: rgba(239, 68, 68, 0.5);
                    color: #f87171;
                    background: rgba(239, 68, 68, 0.05);
                }

                /* Hide Google Translate top bar & branding banner if visible */
                .goog-te-banner-frame, 
                .skiptranslate, 
                iframe.goog-te-banner-frame {
                    display: none !important;
                }
                body {
                    top: 0px !important;
                }
            `}</style>
        </>
    );
}
