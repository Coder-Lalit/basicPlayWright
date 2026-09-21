import { chromium, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

async function globalSetup() {
  const storageFile = path.join(process.cwd(), 'playwright/.auth/user.json');
  const dir = path.dirname(storageFile);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto('http://localhost:4200');
  await page.getByTestId('username-input').fill('admin');
  await page.getByTestId('password-input').fill('admin123');
  await page.getByTestId('login-button').click();
  await expect(page.getByTestId('logout-button')).toBeVisible();
  await context.storageState({ path: storageFile });
  await browser.close();
}

export default globalSetup;
