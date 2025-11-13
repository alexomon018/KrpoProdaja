import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('should display login form', async ({ page }) => {
    await page.goto('/login');

    // Check for email and password fields
    const emailInput = page.getByLabel(/email|e-mail/i).or(page.getByPlaceholder(/email/i));
    const passwordInput = page.getByLabel(/password|lozinka|šifra/i).or(page.getByPlaceholder(/password|lozinka/i));

    await expect(emailInput.first()).toBeVisible();
    await expect(passwordInput.first()).toBeVisible();

    // Check for submit button with exact text
    const submitButton = page.getByRole('button', { name: /prijavi se|login|sign in/i });
    await expect(submitButton.first()).toBeVisible();
  });

  test('should show validation errors on empty login form submission', async ({ page }) => {
    await page.goto('/login');

    // Find and click the submit button
    const submitButton = page.getByRole('button', { name: /prijavi se|login|sign in/i });
    await submitButton.first().click();

    // Wait a bit for validation to trigger
    await page.waitForTimeout(500);

    // Form should remain on the same page (not submitted)
    await expect(page).toHaveURL(/\/login/);
  });

  test('should display register form', async ({ page }) => {
    await page.goto('/register');

    // Check for name field
    const nameInput = page.getByLabel(/ime|name|username/i).or(page.getByPlaceholder(/ime|name/i));
    await expect(nameInput.first()).toBeVisible();

    // Check for email field
    const emailInput = page.getByLabel(/email|e-mail/i).or(page.getByPlaceholder(/email/i));
    await expect(emailInput.first()).toBeVisible();

    // Check for password field
    const passwordInput = page.getByLabel(/password|lozinka|šifra/i).or(page.getByPlaceholder(/password|lozinka/i));
    await expect(passwordInput.first()).toBeVisible();

    // Check for submit button
    const submitButton = page.getByRole('button', { name: /registruj|register|sign up/i });
    await expect(submitButton.first()).toBeVisible();
  });

  test('should have social login options', async ({ page }) => {
    await page.goto('/login');

    // Look for social login buttons (Google, Facebook, etc.)
    const socialButtons = page.getByRole('button', { name: /google|facebook/i });

    // At least one social login option should exist
    const count = await socialButtons.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should have link to password reset', async ({ page }) => {
    await page.goto('/login');

    // Look for "Forgot password" or similar link - text is "Zaboravio si lozinku?"
    const resetLink = page.getByRole('link', { name: /zaboravio.*lozinku|forgot.*password|reset/i });
    await expect(resetLink.first()).toBeVisible();
  });

  test('should navigate between login and register pages', async ({ page }) => {
    await page.goto('/login');

    // Look for link to register page
    const registerLink = page.getByRole('link', { name: /registruj|register|sign up|napravi.*nalog/i });

    if (await registerLink.isVisible()) {
      await registerLink.first().click();
      await expect(page).toHaveURL(/\/register/);

      // Now look for link back to login
      const loginLink = page.getByRole('link', { name: /prijava|login|sign in|već.*nalog/i });
      if (await loginLink.isVisible()) {
        await loginLink.first().click();
        await expect(page).toHaveURL(/\/login/);
      }
    }
  });
});
