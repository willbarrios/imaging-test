import { test, expect } from '@playwright/test';
import { commercial_website_startpage, maximumtimeElapsedLoading } from '../../const/commercial-website';
import { StartPage } from '../../fixtures/commercial-website/start-page'
import { start } from 'repl';

test('pages accessed through hyperlinks are loaded before the expected time '+maximumtimeElapsedLoading+' ms', async ({ page }) => {
  await page.goto(commercial_website_startpage);
  const startPage = new StartPage(page); 
  await startPage.clickAllHyperlinks();
});