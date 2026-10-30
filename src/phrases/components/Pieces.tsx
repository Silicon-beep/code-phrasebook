import { Fragment, type PointerEvent, type ReactNode } from 'react'
import { phraseUi } from '../../content'
import { useKeyboardScroll } from '../../lib/useKeyboardScroll'
import { segment, toLines, tokenize, type Segment, type Token } from '../code'
import { roleStyles } from '../roles'
import type { Language, Part, Piece } from '../types'

// Which numbered piece is lit up, and how pointing at a piece lights it (and its matches) up.
export type Lighting = { parts: Part[]; lit: number | null; onHover?: (part: number | null) => void }

// A mouse or pen lights a piece up by pointing at it. On a touch screen, the Piece by piece buttons do it.
const pointing = (event: PointerEvent) => event.pointerType !== 'touch'

function Numbered({ piece, parts, lit, onHover }: { piece: Segment } & Lighting) {
  const part = piece.part ?? 0
  const style = roleStyles[piece.role ?? parts[part - 1].role]
  const isLit = lit === part
  // The number never ends up alone at the end of a line: it stays with the piece's first word.
  const [first, ...rest] = piece.text.split(' ')
  return (
    <span
      data-part={part}
      data-lit={isLit ? '' : undefined}
      onPointerEnter={(event) => pointing(event) && onHover?.(part)}
      onPointerLeave={(event) => pointing(event) && onHover?.(null)}
      className={`rounded-md border-b-2 px-1 py-0.5 box-decoration-clone transition-colors ${isLit ? style.lit : style.pill}`}
    >
      <span className="whitespace-nowrap">
        <span
          aria-hidden="true"
          className={`mr-1 inline-flex h-[18px] min-w-[18px] select-none items-center justify-center rounded-full px-1 align-[0.12em] font-sans text-[11px] font-bold leading-none ${isLit ? style.badgeLit : style.badge}`}
        >
          {part}
        </span>
        {first}
      </span>
      {rest.length > 0 && ` ${rest.join(' ')}`}
    </span>
  )
}

// A sentence: plain words, with the numbered pieces in color.
export function Sentence({ pieces, ...lighting }: { pieces: Piece[] } & Lighting) {
  return (
    <>
      {pieces.map(segment).map((piece, i) =>
        piece.part ? (
          piece.text && <Numbered key={i} piece={piece} {...lighting} />
        ) : (
          <Fragment key={i}>{piece.text}</Fragment>
        ),
      )}
    </>
  )
}

// A block of code that scrolls sideways when it's too wide, as on a phone. Then it can take keyboard
// focus, so the arrow keys scroll it, which makes it a target: at least 44px tall. It's `relative` so the
// screen-reader-only text inside it scrolls with it, instead of sticking out past the edge of the page.
export function ScrollingCode({ className = '', children }: { className?: string; children: ReactNode }) {
  const scroll = useKeyboardScroll<HTMLPreElement>()
  return (
    <pre ref={scroll.ref} tabIndex={scroll.tabIndex} className={`relative min-h-[44px] overflow-x-auto font-mono ${className}`}>
      {children}
    </pre>
  )
}

const tokenClass = (kind: NonNullable<Token['kind']>) => (kind === 'comment' ? 'italic text-muted' : roleStyles[kind].text)

// Code, line by line. Numbered pieces are in color; the rest is colored like an editor would.
// In an if/else, the line that runs is shaded and marked with an arrow.
export function CodeLines({ pieces, language, ...lighting }: { pieces: Piece[]; language: Language } & Lighting) {
  const lines = toLines(pieces)
  const marked = lines.some((line) => line.some((piece) => piece.runs))
  return (
    <code className="block">
      {lines.map((line, i) => {
        const runs = line.some((piece) => piece.runs)
        return (
          <span key={i} className={`flex rounded-md ${runs ? 'bg-ink/[0.07]' : ''}`}>
            {marked && (
              <span aria-hidden="true" className="w-6 shrink-0 select-none text-center font-sans text-ink">
                {runs ? '▶' : ''}
              </span>
            )}
            <span className="whitespace-pre pr-3">
              {line.length === 0
                ? ' '
                : line.map((piece, j) =>
                    piece.part ? (
                      <Numbered key={j} piece={piece} {...lighting} />
                    ) : (
                      tokenize(piece.text, language).map((token, k) =>
                        token.kind ? (
                          <span key={`${j}.${k}`} className={tokenClass(token.kind)}>
                            {token.text}
                          </span>
                        ) : (
                          <Fragment key={`${j}.${k}`}>{token.text}</Fragment>
                        ),
                      )
                    ),
                  )}
              {runs && <span className="sr-only select-none"> ({phraseUi.runs})</span>}
            </span>
          </span>
        )
      })}
    </code>
  )
}
