const { test, expect } = require('@playwright/test');

test('basic test', async ({ page }) => {
  await page.goto('https://playwright.dev/');
  const title = page.locator('.navbar__inner .navbar__title');
  await expect(title).toHaveText('Playwright');
});

test('duck duck go T 1', async ({ page }) => {
  await page.goto('https://duckduckgo.com/');
  const logo = page.locator('#logo_homepage_link');
  await expect(logo).toBeVisible;
});

test('T2: Check that search results contain expected text', async ({ page }) => {
  await page.goto('https://duckduckgo.com/');
  const searchInputField = page.locator('#search_form_input_homepage');
  await searchInputField.fill('Test');
  await page.click('#search_button_homepage');
  const searchResults = page.locator('#links').toBeVisible;
  const firstResult = await page.textContent('#r1-0');
  await expect(firstResult).toContain('Test');
});

test('T3: Check that Cheat sheet for MSWord is displayed', async ({ page }) => {
  await page.goto('https://duckduckgo.com/');
  const searchInputField = page.locator('#search_form_input_homepage');
  await searchInputField.fill('Microsoft word cheat sheet');
  await page.click('#search_button_homepage');
  const firstResult = await page.textContent('.c-base__title');
  await expect(firstResult).toContain('Microsoft Word 2010');
  await page.isVisible('span.chomp--link__mr');
  expect(await page.click('span.chomp--link__mr')).click;

  expect(await page.isVisible('h6.cheatsheet__title:has-text("Formatting")'))
});

test('T4: Check that URL shortening feature works', async ({ page }) => {
  await page.goto('https://duckduckgo.com/');
  const searchInputField = page.locator('#search_form_input_homepage');
  await searchInputField.fill('shorten www.wikipedia.com');
  await page.click('#search_button_homepage');

  const shortenURL = await page.inputValue('#shorten-url');
  await page.goto(shortenURL);
  await page.locator('#www-wikipedia-org').toBeVisible;
  
  const newPageURL = await page.url();
  expect(newPageURL).toBe("https://www.wikipedia.org/");
});