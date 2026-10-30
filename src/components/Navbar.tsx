import { useEffect, useRef, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { nav } from '../content'
import { Logo } from './Logo'
import { AppLink } from './AppLink'

const linkClass =
  'inline-flex min-h-[44px] items-center whitespace-nowrap rounded-full px-3 font-medium text-muted transition-colors hover:bg-violet-tint hover:text-ink'

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuButton = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!menuOpen) return
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      setMenuOpen(false)
      menuButton.current?.focus()
    }
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [menuOpen])

  return (
    <header className="border-b border-line bg-white">
      <nav aria-label="Main">
        <div className="page-container flex h-[72px] items-center gap-6">
          <Logo />

          <ul className="ml-auto hidden items-center gap-1 sm:flex">
            {nav.links.map((link) => (
              <li key={link.label}>
                <AppLink href={link.href} className={linkClass}>
                  {link.label}
                </AppLink>
              </li>
            ))}
          </ul>

          <button
            ref={menuButton}
            type="button"
            aria-label={nav.menu}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen((open) => !open)}
            className="ml-auto inline-flex h-11 w-11 items-center justify-center rounded-full border border-ink/15 text-ink transition-colors hover:bg-violet-tint sm:hidden"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        <div id="mobile-menu" hidden={!menuOpen} className="border-t border-line sm:hidden">
          <ul className="page-container flex flex-col py-3">
            {nav.links.map((link) => (
              <li key={link.label}>
                <AppLink
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="flex min-h-[44px] items-center rounded-xl px-3 font-medium transition-colors hover:bg-violet-tint"
                >
                  {link.label}
                </AppLink>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </header>
  )
}
