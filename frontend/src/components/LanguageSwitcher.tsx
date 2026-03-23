import { useTranslation, Language, languageNames } from '../i18n/LanguageContext';
import { Globe } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

export function LanguageSwitcher({ variant = 'light' }: { variant?: 'light' | 'dark' }) {
  const { lang, setLang } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const isLight = variant === 'light';

  const languages: { code: Language; label: string; flag: string }[] = [
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
    { code: 'rw', label: 'Kinyarwanda', flag: '🇷🇼' },
  ];

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
          isLight
            ? 'bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-50 hover:border-neutral-300 shadow-sm'
            : 'bg-white/10 border border-white/15 text-white/80 hover:bg-white/15 hover:text-white backdrop-blur-md'
        }`}
      >
        <Globe className="w-4 h-4" />
        <span>{languages.find(l => l.code === lang)?.flag} {lang.toUpperCase()}</span>
        <svg className={`w-3.5 h-3.5 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}  fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" /></svg>
      </button>

      {open && (
        <div className={`absolute right-0 top-full mt-2 w-48 rounded-2xl overflow-hidden shadow-2xl z-50 border animate-in fade-in slide-in-from-top-2 duration-200 ${
          isLight ? 'bg-white border-neutral-200' : 'bg-neutral-900 border-white/10'
        }`}>
          {languages.map((l) => (
            <button
              key={l.code}
              onClick={() => { setLang(l.code); setOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors ${
                lang === l.code
                  ? isLight ? 'bg-green-50 text-green-700' : 'bg-green-600/20 text-green-400'
                  : isLight ? 'text-neutral-700 hover:bg-neutral-50' : 'text-white/70 hover:bg-white/5 hover:text-white'
              }`}
            >
              <span className="text-lg">{l.flag}</span>
              <span>{l.label}</span>
              {lang === l.code && (
                <svg className="w-4 h-4 ml-auto text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
