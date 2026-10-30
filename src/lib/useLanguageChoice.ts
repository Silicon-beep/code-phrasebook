import { useState } from 'react'
import { LANGUAGES, type Language } from '../phrases/types'

export type Shown = 'all' | Language

const KEY = 'code-phrasebook:show'

// Which languages to show, remembered in this browser. Storage can be blocked (private windows, strict
// settings), so every read and write is allowed to fail, and the page then just starts with all three.
function read(): Shown {
  try {
    const saved = localStorage.getItem(KEY)
    return saved && (LANGUAGES as readonly string[]).includes(saved) ? (saved as Language) : 'all'
  } catch {
    return 'all'
  }
}

export function useLanguageChoice() {
  const [shown, setShown] = useState<Shown>(read)
  const choose = (next: Shown) => {
    setShown(next)
    try {
      localStorage.setItem(KEY, next)
    } catch {
      // Not saved, but the choice still applies on this page.
    }
  }
  const languages: readonly Language[] = shown === 'all' ? LANGUAGES : [shown]
  return { shown, choose, languages }
}
