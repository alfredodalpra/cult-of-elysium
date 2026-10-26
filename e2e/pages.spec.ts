import { expect, test } from '@playwright/test'

test('search form finds products', async ({ page }) => {
  await page.goto('/search')
  await page.getByRole('searchbox', { name: 'Search products' }).fill('obsidian')
  await page.getByRole('button', { name: 'Search', exact: true }).click()

  await expect(page).toHaveURL(/\/search\?q=obsidian$/)
  await expect(page.getByText(/results? for “obsidian”/)).toBeVisible()
  await expect(page.getByRole('link', { name: /Obsidian Tear Pendant/ })).toBeVisible()
})

test('product pages have their own title, description and share image', async ({ page }) => {
  await page.goto('/products/chapelbind-bracelet')
  await expect(page).toHaveTitle('The Chapelbind Bracelet · Cult of Elysium')
  await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /heavy, glittering relic/)
  await expect(page.locator('meta[property="og:image"]').first()).toHaveAttribute('content', /coe-1\.webp$/)
})

test('product images have alt text', async ({ page }) => {
  await page.goto('/products/chapelbind-bracelet')
  const alts = await page.locator('main img').evaluateAll(imgs => imgs.map(i => i.getAttribute('alt')))
  expect(alts.length).toBeGreaterThan(0)
  for (const alt of alts) expect(alt).toBeTruthy()
})

test('collection cards show their banner and link to the collection', async ({ page }) => {
  await page.goto('/collections')
  const card = page.getByRole('link', { name: /The Binding Rite/ })
  await expect(card.locator('img')).toHaveAttribute('src', /the-binding-rite/)
  await card.click()
  await expect(page).toHaveURL(/\/collections\/the-binding-rite$/)
  await expect(page.getByRole('heading', { name: 'The Binding Rite', level: 1 })).toBeVisible()
})
