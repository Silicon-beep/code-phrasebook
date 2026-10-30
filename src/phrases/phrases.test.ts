// Checks the phrase data, so the numbers, colors and "Piece by piece" table always line up.
import { describe, expect, test } from 'vitest'
import { initialValues, segment } from './code'
import { phrases } from './phrases'
import { LANGUAGES, type Piece } from './types'

// Pages whose addresses a phrase id would clash with.
const RESERVED = ['about', 'punctuation']

const numbersIn = (pieces: Piece[]) => pieces.map(segment).flatMap((piece) => (piece.part ? [piece.part] : []))

test('every phrase has its own address', () => {
  const ids = phrases.map((phrase) => phrase.id)
  expect(new Set(ids).size).toBe(ids.length)
  for (const id of ids) {
    expect(RESERVED).not.toContain(id)
    expect(id).toMatch(/^[a-z]+(-[a-z]+)*$/)
  }
})

for (const phrase of phrases) {
  describe(phrase.id, () => {
    const version = phrase.build(initialValues(phrase.controls))
    const versions = { english: version.english, ...version.code }

    test('every numbered piece belongs to a part, and stays on one line', () => {
      for (const pieces of Object.values(versions)) {
        for (const piece of pieces.map(segment)) {
          if (piece.part === undefined) continue
          expect(piece.part).toBeGreaterThanOrEqual(1)
          expect(piece.part).toBeLessThanOrEqual(phrase.parts.length)
          expect(piece.text).not.toContain('\n')
          expect(piece.text.trim()).toBe(piece.text)
        }
      }
    })

    test('each part shows up wherever it isn’t marked missing, and nowhere it is', () => {
      phrase.parts.forEach((part, i) => {
        for (const [where, pieces] of Object.entries(versions)) {
          const shown = numbersIn(pieces).includes(i + 1)
          const missing = part.missing?.[where as keyof typeof part.missing]
          expect(shown, `part ${i + 1} in ${where}`).toBe(!missing)
        }
      })
    })

    test('the English numbers its parts in the order they first appear', () => {
      const firsts = [...new Set(numbersIn(version.english))]
      expect(firsts).toEqual(firsts.map((_, i) => i + 1))
    })

    test('the code has something to show for every language', () => {
      for (const language of LANGUAGES) expect(version.code[language].length).toBeGreaterThan(0)
      if (!Array.isArray(version.output)) for (const language of LANGUAGES) expect(version.output[language]).toBeDefined()
    })

    test('"Change it" starts within its limits', () => {
      for (const control of phrase.controls ?? []) {
        if (control.kind === 'number') {
          expect(control.initial).toBeGreaterThanOrEqual(control.min)
          expect(control.initial).toBeLessThanOrEqual(control.max)
        }
        if (control.kind === 'choice') expect(control.options.map((option) => option.value)).toContain(control.initial)
        if (control.kind === 'list') expect(control.initial.length).toBeLessThanOrEqual(control.max)
      }
    })
  })
}
