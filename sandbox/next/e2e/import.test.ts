import test, { expect } from '@playwright/test'

test.describe('rootではないところからのimportができること', () => {
  test('import test', async ({ page }) => {
    await page.goto('http://localhost:3000/import_test')
    await expect(page.getByText(/Server Error|Unhandled Runtime Error/)).not.toBeVisible()
    await expect(page.getByText('OK')).toBeVisible()
  })
})
