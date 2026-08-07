import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { fr } from "./fr";
import { en } from "./en";

const dictionaries = { fr, en };
const STORAGE_KEY = "mn3j-lang";

const LanguageContext = createContext(null);

function resolve(dict, path) {
  return path.split(".").reduce((acc, key) => (acc == null ? acc : acc[key]), dict);
}

function interpolate(str, vars) {
  if (!vars) return str;
  return str.replace(/\{(\w+)\}/g, (_, key) => (vars[key] ?? `{${key}}`));
}

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    const saved = typeof window !== "undefined" ? window.localStorage.getItem(STORAGE_KEY) : null;
    return saved === "en" || saved === "fr" ? saved : "fr";
  });

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, lang);
    document.documentElement.lang = lang;
  }, [lang]);

  const value = useMemo(() => {
    const dict = dictionaries[lang];
    const t = (path, vars) => {
      const result = resolve(dict, path) ?? resolve(dictionaries.fr, path) ?? path;
      return typeof result === "string" ? interpolate(result, vars) : result;
    };
    return {
      lang,
      setLang,
      toggleLang: () => setLang((l) => (l === "fr" ? "en" : "fr")),
      t,
    };
  }, [lang]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within a LanguageProvider");
  return ctx;
}
