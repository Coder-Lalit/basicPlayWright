import { Page, expect } from '@playwright/test';

export class LoginPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/');
  }

  async login(username: string, password: string) {
    await this.page.getByTestId('username-input').fill(username);
    await this.page.getByTestId('password-input').fill(password);
    await this.page.getByTestId('login-button').click();
    await expect(this.page.getByTestId('logout-button')).toBeVisible();
  }

  async expectLoginErrorVisible() {
    await expect(this.page.getByTestId('login-error')).toBeVisible();
  }
}
