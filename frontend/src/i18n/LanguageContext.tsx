import { createContext, useContext, useState, ReactNode } from 'react';
import en, { Translations } from './en';
import fr from './fr';
import rw from './rw';

export type Language = 'en' | 'fr' | 'rw';

const translations: Record<Language, Translations> = { en, fr, rw };

export const languageLabels: Record<Language, string> = {
  en: 'EN',
  fr: 'FR',
  rw: 'RW',
};

export const languageNames: Record<Language, string> = {
  en: 'English',
  fr: 'Français',
  rw: 'Kinyarwanda',
};

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: 'en',
  setLang: () => {},
  t: en,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>(() => {
    const saved = localStorage.getItem('agriguide_lang');
    return (saved as Language) || 'en';
  });

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem('agriguide_lang', newLang);
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: translations[lang] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  return useContext(LanguageContext);
}
