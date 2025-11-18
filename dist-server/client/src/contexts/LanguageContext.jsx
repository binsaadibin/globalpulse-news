import { createContext, useContext, useState, useEffect } from 'react';
var LanguageContext = createContext(undefined);
export function LanguageProvider(_a) {
    var children = _a.children;
    var _b = useState(function () {
        var stored = localStorage.getItem('language');
        return stored || 'en';
    }), language = _b[0], setLanguage = _b[1];
    useEffect(function () {
        document.documentElement.setAttribute('lang', language);
        localStorage.setItem('language', language);
    }, [language]);
    return (<LanguageContext.Provider value={{ language: language, setLanguage: setLanguage }}>
      {children}
    </LanguageContext.Provider>);
}
export function useLanguage() {
    var context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within LanguageProvider');
    }
    return context;
}
