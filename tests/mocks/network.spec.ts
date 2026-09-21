import { test, expect } from '@playwright/test';

test.describe('@ui @regression', () => {
  test('handles a simulated 500 response', async ({ page }) => {
    await page.route('**/api/products', async (route) => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Simulated server error' }),
      });
    });

    await page.goto('http://localhost:4200');
    await page.getByTestId('username-input').fill('admin');
    await page.getByTestId('password-input').fill('admin123');
    await page.getByTestId('login-button').click();
    await page.getByRole('link', { name: 'Products' }).click();
    await expect(page.getByRole('heading', { name: 'Products' })).toBeVisible();
  });

  test('blocks analytics calls from loading', async ({ page }) => {
    await page.route('**/*', async (route) => {
      if (route.request().url().includes('analytics')) {
        await route.abort();
      } else {
        route.continue();
      }
    });

    await page.goto('http://localhost:4200');
    await expect(page.getByTestId('username-input')).toBeVisible();
  });
});
