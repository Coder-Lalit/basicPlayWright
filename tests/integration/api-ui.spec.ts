import { test, expect } from '@/fixtures';
import { createProductPayload } from '@/test-data/users';

test.describe('@integration', () => {
  test('API creates product and UI sees it', async ({ authenticatedPage, productApi, authApi }) => {
    const login = await authApi.login('admin', 'admin123');
    const payload = createProductPayload();
    const created = await productApi.createProduct(payload, login.token);

    await authenticatedPage.goto('http://localhost:4200');
    await authenticatedPage.getByRole('link', { name: 'Products' }).click();
    await authenticatedPage.getByTestId('product-search').fill(created.name);
    await expect(authenticatedPage.getByText(created.name)).toBeVisible();

    await productApi.deleteProduct(created.id, login.token);
  });
});
