"use client";

import { createContext, useContext, useSyncExternalStore } from "react";
import { translations, type Locale, type TranslationKey } from "./translations";

const LOCALE_STORAGE_KEY = "teka_locale";
const listeners = new Set<() => void>();

function subscribe(callback: () => void) {
  listeners.add(callback);
  window.addEventListener("storage", callback);
  return () => {
    listeners.delete(callback);
    window.removeEventListener("storage", callback);
  };
}

function getSnapshot(): Locale {
  const stored = window.localStorage.getItem(LOCALE_STORAGE_KEY);
  return stored && stored in translations ? (stored as Locale) : "fr";
}

function getServerSnapshot(): Locale {
  return "fr";
}

function setStoredLocale(next: Locale) {
  window.localStorage.setItem(LOCALE_STORAGE_KEY, next);
  for (const listener of listeners) listener();
}

type LanguageContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: TranslationKey) => string;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const locale = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  function t(key: TranslationKey) {
    return translations[locale][key] ?? translations.fr[key];
  }

  return (
    <LanguageContext.Provider value={{ locale, setLocale: setStoredLocale, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within a LanguageProvider");
  return ctx;
}
