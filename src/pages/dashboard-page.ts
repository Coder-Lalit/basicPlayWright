import { Page, expect } from '@playwright/test';

export class DashboardPage {
  constructor(private page: Page) {}

  async openUsers() {
    await this.page.getByRole('link', { name: 'Users' }).click();
  }

  async openProducts() {
    await this.page.getByRole('link', { name: 'Products' }).click();
  }

  async expectSummaryCounts(userCount: number, productCount: number) {
    await expect(this.page.getByTestId('user-count')).toHaveText(String(userCount));
    await expect(this.page.getByTestId('product-count')).toHaveText(String(productCount));
  }
}
