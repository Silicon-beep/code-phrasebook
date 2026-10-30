import { languageNames, phraseUi } from '../../content'
import type { Language, Output } from '../types'

export function Screen({ lines, small = false }: { lines: string[]; small?: boolean }) {
  return (
    <div className={`bg-ink font-mono text-white ${small ? 'rounded-xl px-3 py-2 text-sm leading-6' : 'rounded-card px-5 py-4 text-[15px] leading-7'}`}>
      {!small && (
        <div aria-hidden="true" className="mb-3 flex gap-1.5">
          {[0, 1, 2].map((dot) => (
            <span key={dot} className="h-2.5 w-2.5 rounded-full bg-white/40" />
          ))}
        </div>
      )}
      {lines.length === 0 ? (
        <p className="font-sans italic text-white/70">{phraseUi.outputNothing}</p>
      ) : (
        lines.map((line, i) => (
          <p key={i} className="whitespace-pre-wrap [overflow-wrap:anywhere]">
            {line === '' ? <span className="font-sans italic text-white/70">{phraseUi.outputEmptyLine}</span> : line}
          </p>
        ))
      )}
    </div>
  )
}

// What the program shows: one screen when every language shows the same thing, otherwise one each.
export function OutputScreens({ output, languages }: { output: Output; languages: readonly Language[] }) {
  if (Array.isArray(output)) {
    return (
      <>
        {languages.length > 1 && <p className="mb-3 text-muted">{phraseUi.sameOutput}</p>}
        <Screen lines={output} />
      </>
    )
  }
  return (
    <div className={`grid gap-4 ${languages.length > 1 ? 'md:grid-cols-3' : ''}`}>
      {languages.map((language) => (
        <div key={language} className="min-w-0">
          <p className="mb-2 font-semibold">{languageNames[language]}</p>
          <Screen lines={output[language]} />
        </div>
      ))}
    </div>
  )
}
