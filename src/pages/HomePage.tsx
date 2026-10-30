import { useState } from 'react'
import { ArrowRight, Check } from 'lucide-react'
import { AppLink } from '../components/AppLink'
import { chapters, home, languageNames } from '../content'
import { usePageTitle } from '../lib/usePageTitle'
import { initialValues, plainText } from '../phrases/code'
import { ColorKey } from '../phrases/components/ColorKey'
import { CodeLines, ScrollingCode, Sentence } from '../phrases/components/Pieces'
import { PieceButton } from '../phrases/components/PieceTable'
import { phrases } from '../phrases/phrases'
import { LANGUAGES, type ChapterId } from '../phrases/types'

// The first phrase, small, to show how the numbers and colors work before anything else.
function FirstPhrase() {
  const phrase = phrases[0]
  const version = phrase.build(initialValues(phrase.controls))
  const [pinned, setPinned] = useState<number | null>(null)
  const [hovered, setHovered] = useState<number | null>(null)
  const lighting = { parts: phrase.parts, lit: hovered ?? pinned, onHover: setHovered }
  return (
    <section aria-labelledby="try-it" className="min-w-0 rounded-panel border border-line bg-white p-6 shadow-lift">
      <h2 id="try-it" className="text-xl font-bold">
        {home.tryTitle}
      </h2>
      <p className="mt-1 leading-relaxed text-muted">{home.tryText}</p>
      <p className="mt-5 text-xl font-medium leading-[2.3]">
        <Sentence pieces={version.english} {...lighting} />
      </p>
      <dl className="mt-3 flex flex-col gap-2">
        {LANGUAGES.map((language) => (
          <div key={language} className="min-w-0 rounded-2xl bg-canvas px-4 py-2">
            <dt className="text-sm font-semibold text-muted">{languageNames[language]}</dt>
            <dd>
              <ScrollingCode className="py-1.5 text-[15px] leading-8">
                <CodeLines pieces={version.code[language]} language={language} {...lighting} />
              </ScrollingCode>
            </dd>
          </div>
        ))}
      </dl>
      <div className="mt-4 flex flex-wrap gap-2">
        {phrase.parts.map((part, i) => (
          <PieceButton key={i} index={i} part={part} pinned={pinned} onPin={setPinned} />
        ))}
      </div>
    </section>
  )
}

export function HomePage() {
  usePageTitle()
  return (
    <>
      <section className="page-container py-12 sm:py-16">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,32rem)] lg:items-center">
          <div>
            <p className="eyebrow">{home.eyebrow}</p>
            <h1 className="mt-4 text-5xl font-bold tracking-tight sm:text-6xl">{home.title}</h1>
            <p className="mt-5 max-w-xl text-xl leading-relaxed text-muted">{home.intro}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <AppLink href={home.start.href} className="btn btn-dark">
                {home.start.label}
                <ArrowRight aria-hidden="true" className="h-5 w-5" />
              </AppLink>
              <AppLink href={home.punctuation.href} className="btn btn-outline">
                {home.punctuation.label}
              </AppLink>
            </div>
            <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-muted">
              {home.perks.map((perk) => (
                <li key={perk} className="inline-flex items-center gap-2">
                  <Check aria-hidden="true" className="h-5 w-5 text-ink" />
                  {perk}
                </li>
              ))}
            </ul>
          </div>
          <FirstPhrase />
        </div>
      </section>

      <section aria-labelledby="colors" className="page-container py-10">
        <h2 id="colors" className="text-3xl font-bold tracking-tight">
          {home.keyTitle}
        </h2>
        <p className="mb-6 mt-2 max-w-2xl text-lg leading-relaxed text-muted">{home.keyText}</p>
        <ColorKey />
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">{home.numbersText}</p>
      </section>

      <section id="phrases" aria-labelledby="phrases-title" className="page-container scroll-mt-4 py-12">
        <h2 id="phrases-title" className="text-3xl font-bold tracking-tight">
          {home.phrasesTitle}
        </h2>
        <p className="mt-2 max-w-2xl text-lg leading-relaxed text-muted">{home.phrasesIntro}</p>
        {(Object.keys(chapters) as ChapterId[]).map((chapter) => (
          <section key={chapter} aria-labelledby={`chapter-${chapter}`} className="mt-10">
            <h3 id={`chapter-${chapter}`} className="text-2xl font-bold">
              {chapters[chapter].title}
            </h3>
            <p className="mt-1 leading-relaxed text-muted">{chapters[chapter].text}</p>
            <ol className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {phrases.map((phrase, i) =>
                phrase.chapter !== chapter ? null : (
                  <li key={phrase.id}>
                    <AppLink
                      href={`/${phrase.id}`}
                      className="flex h-full flex-col rounded-card border border-line bg-white p-5 shadow-soft transition-shadow hover:shadow-lift"
                    >
                      <span className="text-sm font-semibold text-muted">{home.phraseNumber(i + 1)}</span>
                      <span className="mt-1 text-lg font-semibold">{phrase.title}</span>
                      <span className="mt-2 leading-relaxed text-muted">{plainText(phrase.build(initialValues(phrase.controls)).english)}</span>
                    </AppLink>
                  </li>
                ),
              )}
            </ol>
          </section>
        ))}
      </section>

      <section className="page-container pb-16">
        <div className="on-dark flex flex-col items-start gap-5 rounded-band bg-ink p-6 text-white sm:p-12">
          <h2 className="text-3xl font-bold tracking-tight">{home.punctuationBand.title}</h2>
          <p className="max-w-2xl text-lg leading-relaxed text-white/80">{home.punctuationBand.text}</p>
          <AppLink href={home.punctuation.href} className="btn btn-white whitespace-normal text-center">
            {home.punctuationBand.cta}
            <ArrowRight aria-hidden="true" className="h-5 w-5" />
          </AppLink>
        </div>
      </section>
    </>
  )
}
