import type { Page, Locator } from '@playwright/test';
import { maximumResponseTime, commercial_website_startpage } from '../../const/commercial-website';
import { measurePerformance } from '../../utils/performance';

export class StartPage {
  constructor(public readonly page: Page) {
  }

  async clickAllHyperlinks(): Promise<void> {
    const links: Locator = this.page.locator('a'); //select all anchor tags
    await links.first().waitFor(); // Wait for the links to be visible on the page
    const count = await links.count(); // Get all the href attributes of the anchor tags

    // Click on each link
    for (let i = 0; i < count; i++) {
      await links.nth(i).click();
      const url = await links.nth(i).getAttribute('href'); // Await the promise and handle potential null

        if (url) {
        await measurePerformance(
            async () => {
            await this.page.goto(url);
            return this.page;
            },
            `ClickLink_${i}`,
            this.page
        );
        }
      this.page.goto('landingPage');
    }
  }
}