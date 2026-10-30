import { TriangleAlert } from 'lucide-react'
import { languageNames, phraseUi } from '../../content'
import { withCode } from '../../lib/withCode'
import type { Difference, Language } from '../types'
import { Screen } from './OutputScreen'
import { CodeLines, ScrollingCode } from './Pieces'

const Chip = ({ children }: { children: string }) => (
  <span className="rounded-full border border-line bg-canvas px-3 py-0.5 text-sm font-semibold text-muted">{children}</span>
)

// Plain code with no numbered pieces, colored like an editor would.
export const ExampleCode = ({ code, language }: { code: string; language: Language }) => (
  <ScrollingCode className="mt-1 py-2.5 text-sm leading-6">
    <CodeLines pieces={[code]} language={language} parts={[]} lit={null} />
  </ScrollingCode>
)

function Example({ example, languages }: { example: NonNullable<Difference['example']>; languages: readonly Language[] }) {
  const shown = languages.filter((language) => example.code[language] !== undefined)
  if (shown.length === 0) return null
  return (
    <div className="mt-4 grid gap-3 md:grid-cols-[repeat(auto-fit,minmax(15rem,1fr))]">
      {shown.map((language) => (
        <figure key={language} className="min-w-0 rounded-2xl border border-line bg-canvas p-3">
          <figcaption className="text-sm font-semibold">
            {phraseUi.example} · {languageNames[language]}
          </figcaption>
          <ExampleCode code={example.code[language] ?? ''} language={language} />
          <p className="mb-1 mt-2 text-sm font-semibold text-muted">{phraseUi.screenSays}</p>
          <Screen lines={example.output[language] ?? []} small />
        </figure>
      ))}
    </div>
  )
}

// What changes from one language to another. Differences about languages that aren't shown are left out.
export function Differences({ differences, languages }: { differences: Difference[]; languages: readonly Language[] }) {
  const relevant = differences.filter((difference) => !difference.languages || difference.languages.some((l) => languages.includes(l)))
  return (
    <ul className="flex flex-col gap-4">
      {relevant.map((difference, i) => (
        <li key={i} className={`rounded-card bg-white p-5 shadow-soft ${difference.watchOut ? 'border-2 border-ink' : 'border border-line'}`}>
          <div className="flex flex-wrap items-center gap-2">
            {difference.watchOut && (
              <span className="mr-1 inline-flex items-center gap-1.5 font-bold">
                <TriangleAlert aria-hidden="true" className="h-5 w-5" />
                {phraseUi.watchOut}
              </span>
            )}
            {difference.languages ? (
              difference.languages.map((language) => <Chip key={language}>{languageNames[language]}</Chip>)
            ) : (
              <Chip>{phraseUi.allLanguages}</Chip>
            )}
          </div>
          <p className="mt-3 text-lg leading-relaxed">{withCode(difference.text)}</p>
          {difference.example && <Example example={difference.example} languages={languages} />}
        </li>
      ))}
    </ul>
  )
}
