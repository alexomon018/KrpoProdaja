import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('should load the homepage successfully', async ({ page }) => {
    await page.goto('/');

    // Verify page title or heading
    await expect(page).toHaveTitle(/KrpoProdaja/i);
  });

  test('should display product grid', async ({ page }) => {
    await page.goto('/');

    // Wait for products to be visible
    const productGrid = page.locator('[class*="grid"]').first();
    await expect(productGrid).toBeVisible();

    // Check if at least one product card is displayed
    const productCards = page.locator('article, [data-testid*="product"]').first();
    await expect(productCards).toBeVisible();
  });

  test('should have bottom navigation on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // Check if bottom navigation is visible
    const bottomNav = page.locator('nav').last();
    await expect(bottomNav).toBeVisible();
  });

  test('should display filter panel on desktop', async ({ page }) => {
    // Set desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/');

    // The filter panel should be visible on desktop
    // Look for filter-related text or elements
    await expect(page.getByText(/filter|filtri/i).first()).toBeVisible({ timeout: 10000 });
  });
});
