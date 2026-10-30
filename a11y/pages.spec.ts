import { nav } from '../src/content'
import { checkAccessibility } from './checks'
import { expect, test } from './fixtures'
import { pages } from './site'

for (const { name, url } of pages) {
  test(name, async ({ page }) => {
    await page.goto(url)
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    await checkAccessibility(page, 'as it loads')
  })
}

test('Phone menu, open', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'The menu button only shows on small screens')
  await page.goto('/')
  await page.getByRole('button', { name: nav.menu }).click()
  await checkAccessibility(page, 'with the menu open')
})
