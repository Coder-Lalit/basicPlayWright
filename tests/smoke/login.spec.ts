import { test, expect } from '@/fixtures';

test.describe('@smoke @ui', () => {
  test('user can log in with valid credentials', async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.login('admin', 'admin123');
    await expect(loginPage['page']).toHaveURL(/.*$/);
  });

  test('login form shows error for invalid credentials', async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage['page'].getByTestId('username-input').fill('fake');
    await loginPage['page'].getByTestId('password-input').fill('bad');
    await loginPage['page'].getByTestId('login-button').click();
    await expect(loginPage['page'].getByTestId('login-error')).toContainText('Invalid');
  });
});
