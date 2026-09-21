import { test, expect } from '@/fixtures';

test.describe('@regression @slow', () => {
  test('slow API response is handled correctly', async ({ authApi, productApi }) => {
    const login = await authApi.login('admin', 'admin123');
    const start = Date.now();
    const response = await productApi.getSlowProducts(login.token, 2000);
    const duration = Date.now() - start;
    expect(response.length).toBeGreaterThan(0);
    expect(duration).toBeGreaterThan(1500);
  });

  test('browser waits correctly for network to settle', async ({ authenticatedPage }) => {
    await authenticatedPage.goto('http://localhost:4200');
    await authenticatedPage.getByRole('link', { name: 'Products' }).click();
    await expect(authenticatedPage.getByTestId('product-table-body')).toBeVisible();
  });
});
