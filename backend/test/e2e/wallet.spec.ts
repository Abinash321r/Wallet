import { test, expect } from '@playwright/test';





const BASE_URL = 'http://localhost:3000';


const uniqueMobile = () => String(Math.floor(Math.random() * 9000000000) + 1000000000);

test.describe('Auth Workflow', () => {
  const mobile = uniqueMobile();
  const password = 'testpassword123';

  test('should register a new user successfully', async ({ page }) => {
    await page.goto(`${BASE_URL}/register`);

    await page.fill('input[name="mobile"]', mobile);
    await page.fill('input[name="password"]', password);
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL(`${BASE_URL}/login`);
  });

  test('should show validation error for short password', async ({ page }) => {
    await page.goto(`${BASE_URL}/register`);

    await page.fill('input[name="mobile"]', uniqueMobile());
    await page.fill('input[name="password"]', '123');
    await page.click('button[type="submit"]');

    await expect(page.locator('text=at least 6')).toBeVisible();
  });

  test('should login and redirect to dashboard', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);

    await page.fill('input[name="mobile"]', mobile);
    await page.fill('input[name="password"]', password);
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL(`${BASE_URL}/dashboard`);
    await expect(page.locator('text=Balance')).toBeVisible();
  });

  test('should show error for wrong credentials', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);

    await page.fill('input[name="mobile"]', '0000000000');
    await page.fill('input[name="password"]', 'wrongpassword');
    await page.click('button[type="submit"]');

    await expect(page.locator('text=Invalid')).toBeVisible();
    await expect(page).toHaveURL(`${BASE_URL}/login`);
  });

  test('should logout and redirect to login', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    await page.fill('input[name="mobile"]', mobile);
    await page.fill('input[name="password"]', password);
    await page.click('button[type="submit"]');
    await page.waitForURL(`${BASE_URL}/dashboard`);

    await page.click('button:has-text("Logout")');

    await expect(page).toHaveURL(`${BASE_URL}/login`);
  });
});

test.describe('Dashboard', () => {
  test('redirects unauthenticated users to login', async ({ page }) => {
    await page.goto(`${BASE_URL}/dashboard`);

    await expect(page).toHaveURL(`${BASE_URL}/login`);
  });

  test('shows zero balance for a new user', async ({ page }) => {
    const mobile = uniqueMobile();

    await page.goto(`${BASE_URL}/register`);
    await page.fill('input[name="mobile"]', mobile);
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');

    await page.goto(`${BASE_URL}/login`);
    await page.fill('input[name="mobile"]', mobile);
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    await page.waitForURL(`${BASE_URL}/dashboard`);

    await expect(page.locator('text=$0.00')).toBeVisible();
  });
});
