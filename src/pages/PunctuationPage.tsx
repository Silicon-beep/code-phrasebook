import { ArrowLeft } from 'lucide-react'
import { AppLink } from '../components/AppLink'
import { languageNames, punctuationPage } from '../content'
import { usePageTitle } from '../lib/usePageTitle'
import { withCode } from '../lib/withCode'
import { ExampleCode } from '../phrases/components/Differences'
import { marks } from '../phrases/punctuation'
import { LANGUAGES } from '../phrases/types'

export function PunctuationPage() {
  const copy = punctuationPage
  usePageTitle(copy.title)
  return (
    <div className="page-container max-w-5xl py-10 sm:py-14">
      <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">{copy.title}</h1>
      <p className="mt-4 max-w-2xl text-xl leading-relaxed text-muted">{copy.intro}</p>

      <ul className="mt-10 grid gap-4 md:grid-cols-2">
        {marks.map((mark) => (
          <li key={mark.name} className="flex min-w-0 flex-col rounded-card border border-line bg-white p-6 shadow-soft">
            <div className="flex items-center gap-4">
              <span
                aria-hidden="true"
                className="flex h-16 min-w-[4rem] shrink-0 items-center justify-center rounded-2xl bg-green-tint px-3 font-mono text-2xl font-bold text-green-dark"
              >
                {mark.symbol}
              </span>
              <div className="min-w-0">
                <h2 className="text-xl font-bold">{mark.name}</h2>
                <p className="text-muted">
                  {copy.english}: {mark.english}
                </p>
              </div>
            </div>
            <p className="mt-4 text-lg leading-relaxed">{withCode(mark.meaning)}</p>
            <p className="mt-3 text-sm font-semibold text-muted">
              {copy.usedIn}: {mark.languages.map((language) => languageNames[language]).join(', ')}
            </p>
            {Object.keys(mark.examples).length > 0 && (
              <dl className="mt-4 flex flex-col gap-2">
                {LANGUAGES.map((language) => {
                  const example = mark.examples[language]
                  return example === undefined ? null : (
                    <div key={language} className="min-w-0 rounded-2xl bg-canvas px-4 py-2">
                      <dt className="text-sm font-semibold text-muted">{languageNames[language]}</dt>
                      <dd>
                        <ExampleCode code={example} language={language} />
                      </dd>
                    </div>
                  )
                })}
              </dl>
            )}
          </li>
        ))}
      </ul>

      <AppLink href="/#phrases" className="btn-link mt-10">
        <ArrowLeft aria-hidden="true" className="h-5 w-5" />
        {copy.back}
      </AppLink>
    </div>
  )
}
