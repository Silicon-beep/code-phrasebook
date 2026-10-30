import type { Page } from '@playwright/test'
import { footer, languageNames, nav, phraseUi } from '../src/content'
import { initialValues, segment } from '../src/phrases/code'
import { LANGUAGES } from '../src/phrases/types'
import { expect, test } from './fixtures'
import { pages, phrasePages, pickOption } from './site'

declare global {
  interface Window {
    animationFrames: number
  }
}

test.describe('Keyboard', () => {
  test('Skip to content jumps past the header', async ({ page }) => {
    for (const url of ['/', phrasePages[0].url]) {
      await page.goto(url)
      await page.keyboard.press('Tab')
      const skip = page.getByRole('link', { name: 'Skip to content' })
      await expect(skip).toBeFocused()
      await expect(skip).toBeInViewport()
      await page.keyboard.press('Enter')
      await page.keyboard.press('Tab')
      const pastHeader = await page.evaluate(() => {
        const main = document.getElementById('main')
        const focused = document.activeElement
        if (!main || !focused) return false
        return main.contains(focused) || Boolean(main.compareDocumentPosition(focused) & Node.DOCUMENT_POSITION_FOLLOWING)
      })
      expect(pastHeader, `On ${url}, the next Tab should land in the page, not the header`).toBe(true)
    }
  })

  test('Escape closes the phone menu and puts focus back on its button', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'The menu button only shows on small screens')
    await page.goto('/')
    const menu = page.getByRole('button', { name: nav.menu })
    await menu.click()
    await expect(menu).toHaveAttribute('aria-expanded', 'true')
    await page.keyboard.press('Tab')
    await page.keyboard.press('Escape')
    await expect(menu).toHaveAttribute('aria-expanded', 'false')
    await expect(menu).toBeFocused()
  })

  test('Opening another page puts focus at the start of it', async ({ page }) => {
    const link = footer.links[0]
    await page.goto('/')
    await page.getByRole('navigation', { name: 'Footer' }).getByRole('link', { name: link.label }).click()
    await expect(page).toHaveURL(new RegExp(`${link.href}$`))
    await expect(page.locator('#main')).toBeFocused()
  })

  test('A piece’s button lights up every piece with its number, and only those', async ({ page }) => {
    const { url, phrase } = phrasePages.find(({ phrase }) => phrase.id === 'make-a-decision') ?? phrasePages[0]
    const version = phrase.build(initialValues(phrase.controls))
    const all = [version.english, ...LANGUAGES.map((language) => version.code[language])].flat().map(segment)
    await page.goto(url)
    for (const number of [4, 1]) {
      const button = page.getByRole('button', { name: new RegExp(`^${phraseUi.pieceButton} ${number} `) })
      await button.focus()
      await page.keyboard.press('Enter')
      await expect(button).toHaveAttribute('aria-pressed', 'true')
      const lit = page.locator('[data-lit]')
      await expect(lit).toHaveCount(all.filter((piece) => piece.part === number && piece.text).length)
      expect(await lit.evaluateAll((pieces) => [...new Set(pieces.map((piece) => (piece as HTMLElement).dataset.part))])).toEqual([String(number)])
      await page.keyboard.press('Enter')
      await expect(page.locator('[data-lit]')).toHaveCount(0)
    }
  })

  test('Changing a value changes the English, the code and the screen', async ({ page }) => {
    await page.goto('/say-something')
    await page.getByRole('region', { name: phraseUi.tryIt }).getByLabel('Words to show').fill('Hi Sam')
    await expect(page.getByRole('region', { name: phraseUi.english })).toContainText('"Hi Sam"')
    for (const language of LANGUAGES) {
      await expect(page.getByRole('region', { name: languageNames[language] })).toContainText('"Hi Sam"')
    }
    await expect(page.getByRole('region', { name: phraseUi.output })).toContainText('Hi Sam')
  })

  test('The languages you pick are remembered on the next page', async ({ page }) => {
    await page.goto(phrasePages[0].url)
    await pickOption(page.getByRole('group', { name: phraseUi.show }), languageNames.python)
    await page.getByRole('navigation', { name: phraseUi.pager }).getByRole('link').last().click()
    await expect(page).toHaveURL(new RegExp(`${phrasePages[1].url}$`))
    await expect(page.getByRole('heading', { level: 3, name: languageNames.python, exact: true })).toBeVisible()
    await expect(page.getByRole('heading', { level: 3, name: languageNames.cpp, exact: true })).toHaveCount(0)
  })
})

test.describe('Motion', () => {
  test.skip(({ isMobile }) => isMobile, 'Motion works the same at every screen size')

  // JavaScript animations move things one animation frame at a time, so count the frames.
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      window.animationFrames = 0
      const request = window.requestAnimationFrame.bind(window)
      window.requestAnimationFrame = (callback) => {
        window.animationFrames++
        return request(callback)
      }
    })
  })

  test('With reduced motion on, nothing glides', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/make-a-decision')
    await page.getByRole('button', { name: phraseUi.wholeProgram }).click()
    await page.getByRole('button', { name: new RegExp(`^${phraseUi.pieceButton} 1 `) }).click()
    await pickOption(page.getByRole('group', { name: 'Is it raining?' }), phraseUi.controls.no)
    expect(await stillMoving(page)).toEqual([])
  })

  for (const { url } of pages) {
    test(`Nothing moves or pops up by itself: ${url}`, async ({ page }) => {
      const popups: string[] = []
      page.on('dialog', (dialog) => {
        popups.push(`${dialog.type()}: ${dialog.message()}`)
        void dialog.dismiss()
      })
      page.on('popup', (popup) => popups.push(`new window: ${popup.url()}`))
      await page.goto(url)
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible()

      const activity = await page.evaluate(async () => {
        const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))
        await wait(300) // let the first render settle
        let changes = 0
        const observer = new MutationObserver((records) => (changes += records.length))
        observer.observe(document.body, { subtree: true, childList: true, attributes: true, characterData: true })
        const frames = window.animationFrames
        await wait(1500)
        observer.disconnect()
        return {
          'changes to the page': changes,
          'animation frames': window.animationFrames - frames,
          'running animations': document.getAnimations().filter((animation) => animation.playState === 'running').length,
        }
      })
      expect(activity).toEqual({ 'changes to the page': 0, 'animation frames': 0, 'running animations': 0 })
      expect(popups).toEqual([])
      await expect(page.locator('video[autoplay], audio[autoplay]')).toHaveCount(0)
    })
  }
})

// Anything still set to animate or transition for longer than a blink. The reduced-motion rule in
// index.css cuts every one to 0.01ms.
const stillMoving = (page: Page) =>
  page.evaluate(() =>
    [...document.querySelectorAll('*')].flatMap((el) => {
      const style = getComputedStyle(el)
      const longest = (list: string) => Math.max(...list.split(',').map((t) => parseFloat(t) * (t.trim().endsWith('ms') ? 1 : 1000)))
      const ms = Math.max(longest(style.transitionDuration), style.animationName === 'none' ? 0 : longest(style.animationDuration))
      return ms > 1 ? [`<${el.tagName.toLowerCase()} class="${el.getAttribute('class') ?? ''}"> moves for ${ms}ms`] : []
    }),
  )
