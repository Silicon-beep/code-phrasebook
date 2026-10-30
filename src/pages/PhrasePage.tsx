import { useState } from 'react'
import { useParams } from 'react-router'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { AppLink } from '../components/AppLink'
import { Segmented } from '../components/Segmented'
import { chapters, languageNames, phraseUi } from '../content'
import { useLanguageChoice, type Shown } from '../lib/useLanguageChoice'
import { usePageTitle } from '../lib/usePageTitle'
import { initialValues } from '../phrases/code'
import { CodePanel } from '../phrases/components/CodePanel'
import { Differences } from '../phrases/components/Differences'
import { OutputScreens } from '../phrases/components/OutputScreen'
import { Sentence } from '../phrases/components/Pieces'
import { PieceTable } from '../phrases/components/PieceTable'
import { TryIt } from '../phrases/components/TryIt'
import { getPhrase, phrases } from '../phrases/phrases'
import { LANGUAGES, type Phrase } from '../phrases/types'
import { NotFoundPage } from './NotFoundPage'

export function PhrasePage() {
  const { phraseId } = useParams()
  const phrase = getPhrase(phraseId)
  if (!phrase) return <NotFoundPage />
  // A new phrase starts fresh: its own "Change it" values, nothing lit up.
  return <PhraseView key={phrase.id} phrase={phrase} />
}

const SHOW_OPTIONS: { value: Shown; label: string }[] = [
  { value: 'all', label: phraseUi.allLanguages },
  ...LANGUAGES.map((language) => ({ value: language, label: languageNames[language] })),
]

function SectionTitle({ id, children }: { id: string; children: string }) {
  return (
    <h2 id={id} className="text-3xl font-bold tracking-tight">
      {children}
    </h2>
  )
}

function PhraseView({ phrase }: { phrase: Phrase }) {
  usePageTitle(phrase.title)
  const index = phrases.indexOf(phrase)
  const [values, setValues] = useState(() => initialValues(phrase.controls))
  const [pinned, setPinned] = useState<number | null>(null)
  const [hovered, setHovered] = useState<number | null>(null)
  const { shown, choose, languages } = useLanguageChoice()
  const version = phrase.build(values)
  const picture = phrase.picture(values)
  const lighting = { parts: phrase.parts, lit: hovered ?? pinned, onHover: setHovered }
  const [previous, next] = [phrases[index - 1], phrases[index + 1]]

  return (
    <article className="page-container max-w-5xl py-10 sm:py-14">
      <p className="eyebrow">{phraseUi.eyebrow(chapters[phrase.chapter].title, index + 1, phrases.length)}</p>
      <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">{phrase.title}</h1>
      <p className="mt-4 max-w-2xl text-xl leading-relaxed text-muted">{phrase.idea}</p>
      <p className="mt-2 text-lg text-muted">
        {phraseUi.term}: <strong className="font-semibold text-ink">{phrase.term}</strong>
      </p>

      <div className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)] lg:items-start">
        <div className="flex min-w-0 flex-col gap-6">
          <section aria-labelledby="in-english" className="rounded-card border border-line bg-white p-6 shadow-soft">
            <h2 id="in-english" className="eyebrow">
              {phraseUi.english}
            </h2>
            <p className="mt-3 text-[1.375rem] font-medium leading-[2.3] sm:text-2xl sm:leading-[2.3]">
              <Sentence pieces={version.english} {...lighting} />
            </p>
          </section>
          {phrase.controls && (
            <TryIt controls={phrase.controls} values={values} onChange={(id, value) => setValues((old) => ({ ...old, [id]: value }))} />
          )}
        </div>
        <figure className="flex min-w-0 flex-col items-center gap-5 rounded-card border border-line bg-canvas p-6">
          <div aria-hidden="true" className="flex w-full justify-center">
            {picture.visual}
          </div>
          <figcaption className="text-center font-medium leading-relaxed text-muted">{picture.caption}</figcaption>
        </figure>
      </div>

      <section aria-labelledby="in-code" className="mt-14">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionTitle id="in-code">{phraseUi.code}</SectionTitle>
          <Segmented label={phraseUi.show} options={SHOW_OPTIONS} value={shown} onChange={choose} inline />
        </div>
        <div className="mt-5 flex flex-col gap-4">
          {languages.map((language) => (
            <CodePanel
              key={language}
              language={language}
              pieces={version.code[language]}
              shape={phrase.cpp}
              readAloud={version.readAloud?.[language]}
              {...lighting}
            />
          ))}
        </div>
      </section>

      <section aria-labelledby="on-screen" className="mt-14">
        <SectionTitle id="on-screen">{phraseUi.output}</SectionTitle>
        <div aria-live="polite" className="mt-5">
          <OutputScreens output={version.output} languages={languages} />
        </div>
      </section>

      <section aria-labelledby="piece-by-piece" className="mt-14">
        <SectionTitle id="piece-by-piece">{phraseUi.pieces}</SectionTitle>
        <p className="mb-5 mt-2 max-w-2xl leading-relaxed text-muted">{phraseUi.piecesText}</p>
        <PieceTable version={version} parts={phrase.parts} languages={languages} pinned={pinned} onPin={setPinned} />
      </section>

      <section aria-labelledby="differences" className="mt-14">
        <SectionTitle id="differences">{phraseUi.differences}</SectionTitle>
        <div className="mt-5">
          <Differences differences={phrase.differences} languages={languages} />
        </div>
      </section>

      <nav aria-label={phraseUi.pager} className="mt-16 grid gap-3 border-t border-line pt-8 sm:grid-cols-2">
        {previous ? (
          <AppLink href={`/${previous.id}`} className="flex min-h-[44px] items-center gap-3 rounded-card border border-line bg-white p-4 shadow-soft transition-shadow hover:shadow-lift">
            <ArrowLeft aria-hidden="true" className="h-5 w-5 shrink-0" />
            <span>
              <span className="block text-sm font-semibold text-muted">{phraseUi.previous}</span>
              <span className="block font-semibold">{previous.title}</span>
            </span>
          </AppLink>
        ) : (
          <span />
        )}
        <AppLink
          href={next ? `/${next.id}` : '/#phrases'}
          className="flex min-h-[44px] items-center justify-end gap-3 rounded-card bg-ink p-4 text-right text-white shadow-soft transition-colors hover:bg-violet-dark sm:col-start-2"
        >
          <span>
            <span className="block text-sm font-semibold text-white/80">{next ? phraseUi.next : phraseUi.allPhrases}</span>
            <span className="block font-semibold">{next ? next.title : phraseUi.backToStart}</span>
          </span>
          <ArrowRight aria-hidden="true" className="h-5 w-5 shrink-0" />
        </AppLink>
      </nav>
    </article>
  )
}
