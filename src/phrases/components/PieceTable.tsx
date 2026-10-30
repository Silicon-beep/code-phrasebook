import { Fragment } from 'react'
import { languageNames, phraseUi, roles } from '../../content'
import { segment } from '../code'
import { roleStyles } from '../roles'
import type { Language, Part, Role, Version } from '../types'

type Where = Language | 'english'

// The pieces with one number in the English or in one language, or why there aren't any.
function cellFor(version: Version, parts: Part[], index: number, where: Where) {
  const pieces = (where === 'english' ? version.english : version.code[where]).map(segment)
  const found = new Map<string, Role>()
  for (const piece of pieces) {
    if (piece.part === index + 1 && piece.text) found.set(piece.text, piece.role ?? parts[index].role)
  }
  return { found: [...found], missing: parts[index].missing?.[where] ?? '' }
}

// In the wide table, code never breaks mid-word, so the columns size themselves to it. In the narrow
// cards, it can break anywhere rather than run off the edge.
function Cell({ version, parts, index, where, wide }: { version: Version; parts: Part[]; index: number; where: Where; wide: boolean }) {
  const { found, missing } = cellFor(version, parts, index, where)
  const note = where === 'english' ? parts[index].note : undefined
  const code = where === 'english' ? '' : `font-mono ${wide ? 'whitespace-nowrap' : '[overflow-wrap:anywhere]'}`
  return (
    <>
      {found.length === 0 ? (
        <span className="italic text-muted">{missing}</span>
      ) : (
        <span className="flex flex-wrap items-center gap-1.5">
          {found.map(([text, role], i) => (
            <Fragment key={text}>
              {i > 0 && <span className="text-muted">…</span>}
              <span className={`rounded-md border-b-2 px-1.5 py-0.5 ${roleStyles[role].pill} ${code}`}>
                {text}
              </span>
            </Fragment>
          ))}
        </span>
      )}
      {note && <span className="mt-1 block text-sm text-muted">({note})</span>}
    </>
  )
}

export function PieceButton({ index, part, pinned, onPin }: { index: number; part: Part; pinned: number | null; onPin: (part: number | null) => void }) {
  const number = index + 1
  const pressed = pinned === number
  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={() => onPin(pressed ? null : number)}
      className={`relative inline-flex min-h-[44px] items-center gap-2 rounded-full border px-3 text-left text-sm font-semibold transition-colors ${
        pressed ? 'border-ink bg-ink text-white' : 'border-ink/25 bg-white hover:border-ink'
      }`}
    >
      <span className="sr-only">{phraseUi.pieceButton} </span>
      <span
        className={`inline-flex h-6 min-w-[24px] items-center justify-center rounded-full px-1.5 text-xs font-bold ${roleStyles[part.role].badge}`}
      >
        {number}
      </span>{' '}
      {roles[part.role].one}
    </button>
  )
}

// Every numbered part, in the English and in each language shown: a table on wide screens, cards on
// narrow ones. Each part's button lights its pieces up above.
export function PieceTable({
  version,
  parts,
  languages,
  pinned,
  onPin,
}: {
  version: Version
  parts: Part[]
  languages: readonly Language[]
  pinned: number | null
  onPin: (part: number | null) => void
}) {
  const where: Where[] = ['english', ...languages]
  const label = (w: Where) => (w === 'english' ? phraseUi.englishColumn : languageNames[w])
  return (
    <>
      <div className="hidden overflow-hidden rounded-card border border-line bg-white shadow-soft lg:block">
        <table className="w-full text-left">
          <thead className="bg-canvas">
            <tr>
              <th scope="col" className="px-4 py-3 text-sm font-semibold text-muted">
                {phraseUi.pieceColumn}
              </th>
              {where.map((w) => (
                <th key={w} scope="col" className="px-4 py-3 text-sm font-semibold text-muted">
                  {label(w)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {parts.map((part, i) => (
              <tr key={i} className="border-t border-line align-top">
                <th scope="row" className="w-px whitespace-nowrap px-4 py-3 font-normal">
                  <PieceButton index={i} part={part} pinned={pinned} onPin={onPin} />
                </th>
                {where.map((w) => (
                  <td key={w} className="px-4 py-3 align-middle">
                    <Cell version={version} parts={parts} index={i} where={w} wide />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ul className="flex flex-col gap-3 lg:hidden">
        {parts.map((part, i) => (
          <li key={i} className="rounded-card border border-line bg-white p-4 shadow-soft">
            <PieceButton index={i} part={part} pinned={pinned} onPin={onPin} />
            <dl className="mt-3 grid gap-x-4 gap-y-3 sm:grid-cols-[7rem_minmax(0,1fr)]">
              {where.map((w) => (
                <Fragment key={w}>
                  <dt className="text-sm font-semibold text-muted sm:pt-1">{label(w)}</dt>
                  <dd className="min-w-0">
                    <Cell version={version} parts={parts} index={i} where={w} wide={false} />
                  </dd>
                </Fragment>
              ))}
            </dl>
          </li>
        ))}
      </ul>
    </>
  )
}
