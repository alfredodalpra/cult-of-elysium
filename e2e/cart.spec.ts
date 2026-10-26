import { expect, test } from '@playwright/test'

test.describe('cart', () => {
  test('adds an item, survives a reload, and updates quantities', async ({ page }) => {
    await page.goto('/products/vow-ring-set')
    await page.getByRole('button', { name: '7', exact: true }).click()
    await page.getByRole('button', { name: 'Add to Cart' }).click()

    const drawer = page.getByRole('heading', { name: 'Cart', level: 2 }).locator('..').locator('..')
    await expect(drawer.getByRole('heading', { name: 'Vow Ring Set', level: 3 })).toBeVisible()
    await expect(drawer.getByText('Size 7')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Cart (1)' })).toBeVisible()

    await page.getByRole('button', { name: 'Increase quantity of Vow Ring Set' }).click()
    await expect(drawer.getByText('€58.00')).toBeVisible()

    // The cart lives in a cookie, so it is still there after a reload.
    await page.reload()
    await expect(page.getByRole('button', { name: 'Cart (2)' })).toBeVisible()

    await page.getByRole('button', { name: 'Cart (2)' }).click()
    const decrease = page.getByRole('button', { name: 'Decrease quantity of Vow Ring Set' })
    await decrease.click()
    await expect(page.getByRole('button', { name: 'Cart (1)' })).toBeVisible()
    await decrease.click()
    await expect(page.getByText('Your cart is empty')).toBeVisible()
  })

  test('disables checkout in the demo store', async ({ page }) => {
    await page.goto('/products/eclipse-band')
    await page.getByRole('button', { name: 'Add to Cart' }).click()
    await expect(page.getByRole('button', { name: 'Checkout' })).toBeDisabled()
    await expect(page.getByText('Demo store: checkout is disabled.')).toBeVisible()
  })
})
