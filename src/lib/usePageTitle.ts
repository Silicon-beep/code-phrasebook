import { useEffect } from 'react'

const DEFAULT_TITLE = 'Code Phrasebook: everyday English next to Python, JavaScript and C++'

export function usePageTitle(title?: string) {
  useEffect(() => {
    document.title = title ? `${title} · Code Phrasebook` : DEFAULT_TITLE
  }, [title])
}
