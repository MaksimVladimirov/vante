'use client'

import { createContext, useContext } from 'react'
import type { Dictionary } from './getDictionary'
import type { Locale } from './locales'

type LangContextValue = {
  lang: Locale
  dict: Dictionary
}

const LangContext = createContext<LangContextValue | null>(null)

export function LangProvider({
  lang,
  dict,
  children,
}: LangContextValue & { children: React.ReactNode }) {
  return <LangContext.Provider value={{ lang, dict }}>{children}</LangContext.Provider>
}

export function useLang(): LangContextValue {
  const ctx = useContext(LangContext)
  if (!ctx) throw new Error('useLang must be used inside LangProvider')
  return ctx
}
