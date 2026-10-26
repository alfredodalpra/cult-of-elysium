import { expect, test, type Page } from '@playwright/test'

// Opens whichever menu the viewport uses and returns its links.
async function openShopMenu(page: Page, isMobile: boolean) {
  if (isMobile) {
    await page.getByRole('button', { name: 'Menu' }).click()
    return page.locator('#mobile-menu a')
  }
  await page.getByRole('button', { name: 'Shop' }).click()
  return page.locator('header nav ul a')
}

test('every navigation link leads to a real page', async ({ page, isMobile, request }) => {
  await page.goto('/store')
  const links = await openShopMenu(page, isMobile)
  await expect(links.first()).toBeVisible()

  const hrefs = [...new Set(await links.evaluateAll(as => as.map(a => a.getAttribute('href')!)))]
  expect(hrefs).toEqual(expect.arrayContaining(['/store', '/collections', '/about', '/search']))
  for (const href of hrefs) {
    expect((await request.get(href)).status(), href).toBe(200)
  }
})

test('mobile menu closes after choosing a link', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'mobile only')
  await page.goto('/store')
  await page.getByRole('button', { name: 'Menu' }).click()
  await page.locator('#mobile-menu').getByRole('link', { name: 'The Star Vault' }).click()
  await expect(page).toHaveURL(/\/collections\/the-star-vault$/)
  await expect(page.locator('#mobile-menu')).toBeHidden()
})

// Phone, tablet (the tightest fit for the desktop links), laptop and desktop widths.
for (const width of [390, 768, 1024, 1440]) {
  test(`navbar items never overlap at ${width}px`, async ({ page, isMobile }) => {
    test.skip(isMobile, 'widths are set explicitly; run once in the desktop project')
    await page.setViewportSize({ width, height: 900 })
    await page.goto('/store')
    const boxes = await page.locator('header nav').evaluate(nav =>
      [...nav.querySelectorAll('a, button')]
        .filter(el => (el as HTMLElement).offsetParent !== null)
        .map(el => el.getBoundingClientRect().toJSON() as DOMRect),
    )
    for (let i = 0; i < boxes.length; i++) {
      for (let j = i + 1; j < boxes.length; j++) {
        const a = boxes[i], b = boxes[j]
        const overlap = a.left < b.right && b.left < a.right && a.top < b.bottom && b.top < a.bottom
        expect(overlap, `nav items ${i} and ${j} overlap`).toBe(false)
      }
    }
  })
}

for (const path of ['/', '/store', '/products/chapelbind-bracelet', '/collections', '/search?q=ring']) {
  test(`no horizontal scrolling on ${path}`, async ({ page }) => {
    await page.goto(path)
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)
    expect(overflow).toBeLessThanOrEqual(0)
  })
}
