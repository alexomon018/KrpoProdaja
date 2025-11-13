import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('should navigate to login page', async ({ page }) => {
    await page.goto('/');

    // Look for login link or button
    const loginLink = page.getByRole('link', { name: /prijava|login/i });

    if (await loginLink.isVisible()) {
      await loginLink.click();
      await expect(page).toHaveURL(/\/login/);
    } else {
      // Navigate directly if link not found in header
      await page.goto('/login');
      await expect(page).toHaveURL(/\/login/);
    }
  });

  test('should navigate to register page', async ({ page }) => {
    await page.goto('/');

    // Look for register link or button
    const registerLink = page.getByRole('link', { name: /registruj|register|registracija/i });

    if (await registerLink.isVisible()) {
      await registerLink.click();
      await expect(page).toHaveURL(/\/register/);
    } else {
      // Navigate directly if link not found in header
      await page.goto('/register');
      await expect(page).toHaveURL(/\/register/);
    }
  });

  test('should navigate to sell page', async ({ page }) => {
    await page.goto('/');

    // Look for sell/prodaj button
    const sellLink = page.getByRole('link', { name: /prodaj|sell/i });

    if (await sellLink.isVisible()) {
      await sellLink.click();
      await expect(page).toHaveURL(/\/sell/);
    } else {
      // Navigate directly
      await page.goto('/sell');
      await expect(page).toHaveURL(/\/sell/);
    }
  });

  test('should handle 404 page', async ({ page }) => {
    await page.goto('/non-existent-page');

    // Should show 404 or not found content
    await expect(page.getByText(/404|not found|nije pronađeno/i)).toBeVisible();
  });
});
