import { useEffect, useRef } from 'react'
import { Route, Routes, useLocation } from 'react-router'
import { SiteLayout } from './components/SiteLayout'
import { about } from './content'
import { HomePage } from './pages/HomePage'
import { InfoPage } from './pages/InfoPage'
import { NotFoundPage } from './pages/NotFoundPage'
import { PhrasePage } from './pages/PhrasePage'
import { PunctuationPage } from './pages/PunctuationPage'

// On every navigation: scroll to the #section if there is one, otherwise to the top, and move
// keyboard focus to the new page so screen readers start reading from there.
function RouteEffects() {
  const { pathname, hash, key } = useLocation()
  const firstLoad = useRef(true)
  useEffect(() => {
    if (hash) document.getElementById(hash.slice(1))?.scrollIntoView()
    else window.scrollTo(0, 0)
    if (firstLoad.current) {
      firstLoad.current = false
      return
    }
    if (!hash) document.getElementById('main')?.focus({ preventScroll: true })
  }, [pathname, hash, key])
  return null
}

export default function App() {
  return (
    <>
      <a
        href="#main"
        className="btn btn-dark sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50"
      >
        Skip to content
      </a>
      <RouteEffects />
      <Routes>
        <Route element={<SiteLayout />}>
          <Route index element={<HomePage />} />
          <Route path="punctuation" element={<PunctuationPage />} />
          <Route path="about" element={<InfoPage page={about} />} />
          {/* Each phrase lives at its own id, like /say-something. Unknown ids show Page not found. */}
          <Route path=":phraseId" element={<PhrasePage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </>
  )
}
