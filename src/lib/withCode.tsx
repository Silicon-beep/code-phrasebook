import type { ReactNode } from 'react'

// Shows the `backticked` parts of a sentence as code.
export function withCode(text: string): ReactNode[] {
  return text.split('`').map((part, i) =>
    i % 2 === 1 ? (
      <code key={i} className="rounded-md bg-ink/[0.06] px-1.5 py-0.5 font-mono text-[0.92em] [overflow-wrap:anywhere]">
        {part}
      </code>
    ) : (
      part
    ),
  )
}
