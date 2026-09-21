import { Page, expect } from '@playwright/test';

export class UsersPage {
  constructor(private page: Page) {}

  async openCreateUser() {
    await this.page.getByTestId('create-user-button').click();
  }

  async createUser(name: string, email: string, role: string) {
    await this.openCreateUser();
    await this.page.getByTestId('user-name').fill(name);
    await this.page.getByTestId('user-email').fill(email);
    await this.page.getByTestId('user-role').selectOption(role);
    await this.page.getByTestId('save-user-button').click();
    await expect(this.page.getByTestId('toast')).toContainText('User created');
  }

  async searchUser(name: string) {
    await this.page.getByRole('textbox').fill(name);
  }

  async expectUserVisible(name: string) {
    await expect(this.page.getByText(name, { exact: true })).toBeVisible();
  }
}
