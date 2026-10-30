// What the accessibility checks visit. The phrase pages come from the same data the site uses, so a new
// phrase is checked as soon as it's in phrases.tsx. A new page needs adding to `pages` here.
import type { Locator, Page } from '@playwright/test'
import { about, phraseUi } from '../src/content'
import { phrases } from '../src/phrases/phrases'
import type { Control } from '../src/phrases/types'

export const phrasePages = phrases.map((phrase) => ({ name: `Phrase: ${phrase.title}`, url: `/${phrase.id}`, phrase }))

export type SitePage = { name: string; url: string }

export const pages: SitePage[] = [
  { name: 'Home', url: '/' },
  ...phrasePages.map(({ name, url }) => ({ name, url })),
  { name: 'Punctuation', url: '/punctuation' },
  { name: about.title, url: '/about' },
  { name: 'Page not found', url: '/no-such-page' },
  { name: 'Page not found, a few levels deep', url: '/no/such/page' },
]

const escape = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

// The radio buttons are hidden behind pills drawn by their labels, so pick an option the way a person
// would: by clicking its pill.
export const pickOption = (group: Locator, label: string) =>
  group.locator('label').filter({ hasText: new RegExp(`^${escape(label)}$`) }).click()

// Changes a "Change it" control to something other than its starting value.
export async function useControl(page: Page, control: Control) {
  const changeIt = page.getByRole('region', { name: phraseUi.tryIt })
  switch (control.kind) {
    case 'text':
      await changeIt.getByLabel(control.label).fill('Say "hi"')
      return
    case 'number':
      // A slider moves with the keyboard: End jumps to the biggest number.
      await changeIt.getByLabel(control.label).focus()
      await page.keyboard.press('End')
      return
    case 'yesno':
      await pickOption(changeIt.getByRole('group', { name: control.label }), control.initial ? phraseUi.controls.no : phraseUi.controls.yes)
      return
    case 'choice': {
      const other = control.options.find((option) => option.value !== control.initial)
      if (other) await pickOption(changeIt.getByRole('group', { name: control.label }), other.label)
      return
    }
    case 'list':
      await changeIt.getByRole('button', { name: phraseUi.controls.remove(control.initial[0]) }).click()
      await changeIt.getByLabel(phraseUi.controls.newItem).fill('tea')
      await changeIt.getByRole('button', { name: phraseUi.controls.add }).click()
      return
  }
}
