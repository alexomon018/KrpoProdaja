# E2E Tests with Playwright

This directory contains end-to-end tests for the KrpoProdaja application using Playwright.

## Running Tests

### Run all tests (headless)
```bash
npm run test:e2e
```

### Run tests with UI mode (interactive)
```bash
npm run test:e2e:ui
```

### Run tests in headed mode (see browser)
```bash
npm run test:e2e:headed
```

### Debug tests
```bash
npm run test:e2e:debug
```

## Test Structure

- `homepage.spec.ts` - Tests for the main landing page and product grid
- `navigation.spec.ts` - Tests for navigation between different pages
- `auth.spec.ts` - Tests for authentication flows (login, register)
- `product-details.spec.ts` - Tests for product detail pages

## Prerequisites

Before running the tests, make sure you have:
1. Installed dependencies: `npm install`
2. Installed Playwright browsers: `npx playwright install`

## CI/CD Integration

The tests are configured to run in CI environments. The configuration in `playwright.config.ts` automatically:
- Starts the development server before running tests
- Retries failed tests twice in CI
- Captures screenshots on failure
- Generates HTML reports

## Writing New Tests

When adding new tests:
1. Create a new `.spec.ts` file in the `e2e` directory
2. Follow the existing test structure
3. Use descriptive test names
4. Group related tests using `test.describe()`
5. Use Playwright's built-in assertions

Example:
```typescript
import { test, expect } from '@playwright/test';

test.describe('Feature Name', () => {
  test('should do something', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Expected Title/);
  });
});
```

## Viewing Test Reports

After running tests, view the HTML report:
```bash
npx playwright show-report
```
