// Each phrase page in every state a learner can reach: a piece lit up, "Change it" used, one language
// picked, and C++ showing its whole program.
import { languageNames, phraseUi } from '../src/content'
import { checkAccessibility } from './checks'
import { expect, test } from './fixtures'
import { phrasePages, pickOption, useControl } from './site'

for (const { name, url, phrase } of phrasePages) {
  test(`${name}, used`, async ({ page }) => {
    await page.goto(url)

    const first = page.getByRole('button', { name: new RegExp(`^${phraseUi.pieceButton} 1 `) })
    await first.click()
    await expect(first).toHaveAttribute('aria-pressed', 'true')
    await expect(page.locator('[data-lit]').first()).toBeVisible()
    await checkAccessibility(page, 'with piece 1 lit up', { keyboard: false })

    for (const control of phrase.controls ?? []) await useControl(page, control)
    if (phrase.controls) await checkAccessibility(page, 'after Change it', { keyboard: false })

    await pickOption(page.getByRole('group', { name: phraseUi.show }), languageNames.cpp)
    await expect(page.getByRole('heading', { level: 3, name: languageNames.python, exact: true })).toHaveCount(0)
    await checkAccessibility(page, 'showing only C++', { keyboard: false })

    if (phrase.cpp !== 'whole') {
      const whole = page.getByRole('button', { name: phraseUi.wholeProgram })
      await whole.click()
      await expect(whole).toHaveAttribute('aria-pressed', 'true')
      await expect(page.getByText('int main() {').first()).toBeVisible()
      await checkAccessibility(page, 'showing the whole C++ program', { keyboard: false })
    }
  })
}
