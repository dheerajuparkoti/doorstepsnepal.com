// "use client";

// import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
// import { translations, type Language } from "./translations";

// interface I18nContextType {
//   language: Language;
//   locale: Language;
//   setLanguage: (lang: Language) => void;
//   t: typeof translations.en;
// }

// const I18nContext = createContext<I18nContextType | undefined>(undefined);

// export function I18nProvider({ children }: { children: ReactNode }) {
//   const [language, setLanguageState] = useState<Language>("en");

//   useEffect(() => {
//     const saved = localStorage.getItem("language") as Language;
//     if (saved && (saved === "en" || saved === "ne")) {
//       setLanguageState(saved);
//     }
//   }, []);

//   const setLanguage = (lang: Language) => {
//     setLanguageState(lang);
//     localStorage.setItem("language", lang);
//   };

//   const t = translations[language];

//   return (
//     <I18nContext.Provider value={{ language, locale: language, setLanguage, t }}>
//       {children}
//     </I18nContext.Provider>
//   );
// }

// export function useI18n() {
//   const context = useContext(I18nContext);
//   if (context === undefined) {
//     throw new Error("useI18n must be used within an I18nProvider");
//   }
//   return context;
// }


// lib/i18n/context.tsx (UPDATED)
"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { translations, type Language } from "./translations";

interface I18nContextType {
  language: Language;
  locale: Language;
  setLanguage: (lang: Language) => void;
  t: typeof translations.en;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Read from localStorage first (client preference)
    const saved = localStorage.getItem("language") as Language;
    
    // Also check document.cookie for server-set language
    const cookieLang = document.cookie
      .split('; ')
      .find(row => row.startsWith('language='))
      ?.split('=')[1] as Language;

    // Priority: localStorage > cookie > default
    const initialLang = saved || cookieLang || 'en';
    
    if (initialLang && (initialLang === "en" || initialLang === "ne")) {
      setLanguageState(initialLang);
      // Sync cookie with localStorage
      if (saved) {
        document.cookie = `language=${saved}; path=/; max-age=31536000`;
      }
    }
    
    setIsInitialized(true);
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("language", lang);
    document.cookie = `language=${lang}; path=/; max-age=31536000`;
  };

  const t = translations[language];

  return (
    <I18nContext.Provider value={{ language, locale: language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error("useI18n must be used within an I18nProvider");
  }
  return context;
}