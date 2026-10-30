import { useState } from 'react'
import { AppLink } from '../../components/AppLink'
import { languageNames, phraseUi } from '../../content'
import { wholeCpp } from '../code'
import type { CppShape, Language, Piece } from '../types'
import { CodeLines, ScrollingCode, type Lighting } from './Pieces'

// One language's code. C++ can switch between the lines that matter and the whole program around them.
export function CodePanel({
  language,
  pieces,
  shape,
  readAloud,
  ...lighting
}: { language: Language; pieces: Piece[]; shape: CppShape; readAloud?: string } & Lighting) {
  const [whole, setWhole] = useState(false)
  const canWrap = language === 'cpp' && shape !== 'whole'
  const heading = `code-${language}`
  return (
    <section aria-labelledby={heading} className="min-w-0 rounded-card border border-line bg-white shadow-soft">
      <div className="flex flex-wrap items-center justify-between gap-x-4 border-b border-line px-5 py-1.5">
        <h3 id={heading} className="py-2 text-lg font-bold">
          {languageNames[language]}
        </h3>
        {canWrap && (
          <button
            type="button"
            aria-pressed={whole}
            onClick={() => setWhole((on) => !on)}
            className="inline-flex min-h-[44px] items-center gap-3 rounded-full px-2 text-left text-sm font-semibold"
          >
            <span aria-hidden="true" className={`relative h-6 w-10 shrink-0 rounded-full transition-colors ${whole ? 'bg-ink' : 'bg-subtle'}`}>
              <span className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-[left] ${whole ? 'left-5' : 'left-1'}`} />
            </span>
            {phraseUi.wholeProgram}
          </button>
        )}
      </div>
      <ScrollingCode className="px-4 py-4 text-[15px] leading-8">
        <CodeLines pieces={canWrap && whole ? wholeCpp(pieces, shape) : pieces} language={language} {...lighting} />
      </ScrollingCode>
      {(readAloud || (canWrap && whole)) && (
        <div className="flex flex-col gap-1 border-t border-line px-5 py-3">
          {readAloud && (
            <p className="leading-relaxed text-muted">
              <span className="font-semibold text-ink">{phraseUi.readAloud}:</span> {readAloud}
            </p>
          )}
          {canWrap && whole && (
            <AppLink href="/the-whole-program" className="btn-link self-start">
              {phraseUi.wholeProgramWhy}
            </AppLink>
          )}
        </div>
      )}
    </section>
  )
}
