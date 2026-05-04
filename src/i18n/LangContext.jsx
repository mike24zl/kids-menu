import { createContext, useContext, useState } from 'react'
import { translations } from './translations'

const LangContext = createContext(null)

export function LangProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem('km_lang') || 'en')

  function switchLang(next) {
    setLang(next)
    localStorage.setItem('km_lang', next)
  }

  return (
    <LangContext.Provider value={{ lang, switchLang, t: translations[lang] }}>
      {children}
    </LangContext.Provider>
  )
}

export function useLang() {
  return useContext(LangContext)
}
