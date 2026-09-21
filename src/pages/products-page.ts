import { Page, expect } from '@playwright/test';

export class ProductsPage {
  constructor(private page: Page) {}

  async openProducts() {
    await this.page.getByRole('link', { name: 'Products' }).click();
  }

  async createProduct(product: Record<string, string | number>) {
    await this.page.getByTestId('create-product-button').click();
    await this.page.getByTestId('product-name').fill(String(product.name));
    await this.page.getByTestId('product-category').fill(String(product.category));
    await this.page.getByTestId('product-price').fill(String(product.price));
    await this.page.getByTestId('product-stock').fill(String(product.stock));
    await this.page.getByTestId('product-status').selectOption(String(product.status));
    await this.page.getByTestId('save-product-button').click();
    await expect(this.page.getByTestId('toast')).toContainText('Product created');
  }

  async searchProduct(term: string) {
    await this.page.getByTestId('product-search').fill(term);
  }

  async expectProductVisible(name: string) {
    await expect(this.page.getByText(name, { exact: true })).toBeVisible();
  }

  async expectEmptyState() {
    await expect(this.page.getByText('No products found')).toBeVisible();
  }
}
