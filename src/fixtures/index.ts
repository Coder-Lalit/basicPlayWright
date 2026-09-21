import {
  test as base,
  expect,
  APIRequestContext,
  BrowserContext,
  Page,
} from '@playwright/test';
import { AuthApi } from '@/api/clients/auth-api';
import { UserApi } from '@/api/clients/user-api';
import { ProductApi } from '@/api/clients/product-api';
import { config } from '@/config/env';
import { LoginPage } from '@/pages/login-page';
import { DashboardPage } from '@/pages/dashboard-page';
import { UsersPage } from '@/pages/users-page';
import { ProductsPage } from '@/pages/products-page';

interface FixtureOptions {
  apiRequest: APIRequestContext;
  authApi: AuthApi;
  userApi: UserApi;
  productApi: ProductApi;
  loginPage: LoginPage;
  dashboardPage: DashboardPage;
  usersPage: UsersPage;
  productsPage: ProductsPage;
  authenticatedContext: BrowserContext;
  authenticatedPage: Page;
  testData: {
    user: Record<string, unknown>;
    product: Record<string, unknown>;
  };
}

export const test = base.extend<FixtureOptions>({
  apiRequest: async ({ playwright }, use) => {
    const request = await playwright.request.newContext({
      baseURL: config.apiURL,
      extraHTTPHeaders: {
        Accept: 'application/json',
      },
    });
    await use(request);
    await request.dispose();
  },
  authApi: async ({ apiRequest }, use) => {
    await use(new AuthApi(apiRequest, config.apiURL));
  },
  userApi: async ({ apiRequest }, use) => {
    await use(new UserApi(apiRequest, config.apiURL));
  },
  productApi: async ({ apiRequest }, use) => {
    await use(new ProductApi(apiRequest, config.apiURL));
  },
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  dashboardPage: async ({ page }, use) => {
    await use(new DashboardPage(page));
  },
  usersPage: async ({ page }, use) => {
    await use(new UsersPage(page));
  },
  productsPage: async ({ page }, use) => {
    await use(new ProductsPage(page));
  },
  testData: async ({}, use) => {
    await use({
      user: { name: 'Fixture User', email: 'fixture@demo.local', role: 'Viewer' },
      product: { name: 'Fixture Product', category: 'Tools', price: 99, stock: 4, status: 'Active' },
    });
  },
  authenticatedContext: async ({ browser }, use) => {
    const context = await browser.newContext({ storageState: 'playwright/.auth/user.json' });
    await use(context);
    await context.close();
  },
  authenticatedPage: async ({ browser }, use) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto('http://localhost:4200');
    await page.getByTestId('username-input').fill('admin');
    await page.getByTestId('password-input').fill('admin123');
    await page.getByTestId('login-button').click();
    await page.getByTestId('logout-button').waitFor();
    await use(page);
    await page.close();
    await context.close();
  },
});

export { expect } from '@playwright/test';
