import { test, expect } from '@playwright/test';
import { commercial_website_startpage } from '.,/../../const/commercial-website';

test('has title', async ({ page }) => {
  await page.goto(commercial_website_startpage);

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Playwright/);
});