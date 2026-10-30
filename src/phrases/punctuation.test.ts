// Every example in the punctuation guide must be an exact excerpt of code the snippet test runs.
import { expect, test } from 'vitest'
import { initialValues, plainText } from './code'
import { phrases } from './phrases'
import { marks } from './punctuation'
import { LANGUAGES, type Language } from './types'

const ranCode = (language: Language) =>
  phrases.flatMap((phrase) => [
    plainText(phrase.build(initialValues(phrase.controls)).code[language]),
    ...phrase.differences.flatMap((difference) => difference.example?.code[language] ?? []),
  ])

for (const mark of marks) {
  test(`${mark.name}: every example comes from a phrase`, () => {
    for (const language of LANGUAGES) {
      const example = mark.examples[language]
      if (example === undefined) continue
      expect(mark.languages).toContain(language)
      expect(ranCode(language).some((code) => code.includes(example)), `${language}: ${example}`).toBe(true)
    }
  })
}
