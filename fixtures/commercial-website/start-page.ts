import type { Page, Locator } from '@playwright/test';
import { expect } from '@playwright/test';
import { measurePerformance, isValidUrl , perfMetrics, step} from '../../utils/performance';
import { maximumtimeElapsedLoading } from '../../const/commercial-website';

export class StartPage {
  private startPage: Page;

  constructor(public readonly page: Page) {
    this.startPage = page;
  }

  async clickAllHyperlinks(): Promise<void> {
    const links: Locator = this.page.locator('a'); // select all anchor tags
    //await links.first().waitFor(); // Wait for the links to be visible on the page
    const count = await links.count(); // Get the count of all the links

    // Click on each link
    for (let i = 0; i < count; i++) {
      const url = await links.nth(i).getAttribute('href'); // Await the promise and handle potential null
      
      if (url) {
        // Log the URL to verify it
        console.log(`Navigating to URL: ${url}`);

        // Validate the URL
        if (await isValidUrl(url)) {
          await measurePerformance(
            async () => {
              await this.page.goto(url);
            },
            `ClickLink_${i}`,
            this.page
          );
          expect(perfMetrics[step-1].timeElapsed).toBeLessThanOrEqual(maximumtimeElapsedLoading);
        } else {
          console.error(`Invalid URL: ${url}`);
        }
      } else {
        console.error(`No href attribute found for link at index ${i}`);
      }
      await this.page.goto(this.startPage.url());// Navigate to the start page after every click
    }
  }
}