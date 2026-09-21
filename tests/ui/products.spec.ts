import { test, expect } from '@/fixtures';
import { createProductPayload } from '@/test-data/users';

test.describe('@ui @regression', () => {
  test('user can create a product from the UI', async ({ authenticatedPage, productsPage }) => {
    await authenticatedPage.goto('http://localhost:4200');
    await authenticatedPage.getByRole('link', { name: 'Products' }).click();
    const payload = createProductPayload();
    await productsPage.createProduct({
      name: payload.name,
      category: payload.category,
      price: payload.price,
      stock: payload.stock,
      status: payload.status,
    });
    await productsPage.expectProductVisible(String(payload.name));
  });

  test('user can search for a product', async ({ authenticatedPage }) => {
    await authenticatedPage.goto('http://localhost:4200');
    await authenticatedPage.getByRole('link', { name: 'Products' }).click();
    await authenticatedPage.getByTestId('product-search').fill('Alpha');
    await expect(authenticatedPage.getByText('Alpha Laptop')).toBeVisible();
  });
});
