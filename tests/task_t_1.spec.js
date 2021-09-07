const { test, expect } = require('@playwright/test');

test.describe('Duck duck smoke test suite ', () => {

test.beforeEach(async ({ page }) => {
  await page.goto('https://duckduckgo.com/');
});

test('duck duck go T 1', async ({ page }) => {
  const logo = page.locator('#logo_homepage_link');
  await expect(logo).toBeVisible;
});

test('T2: Check that search results contain expected text', async ({ page }) => {
  const searchInputField = page.locator('#search_form_input_homepage');
  await searchInputField.fill('Test');
  await page.click('#search_button_homepage');
  const searchResults = page.locator('#links').toBeVisible;
  const firstResult = await page.textContent('#r1-0');
  await expect(firstResult).toContain('Test');
});

test('T3: Check that Cheat sheet for MSWord is displayed', async ({ page }) => {
  const searchInputField = page.locator('#search_form_input_homepage');
  await searchInputField.fill('Microsoft word cheat sheet');
  await page.click('#search_button_homepage');
  const firstResult = await page.textContent('.c-base__title');
  await expect(firstResult).toContain('Microsoft Word 2010');
  await page.isVisible('span.chomp--link__mr');
  expect(await page.click('span.chomp--link__mr'));

  expect(await page.isVisible('h6.cheatsheet__title:has-text("Formatting")'))
});

test('T4: Check that URL shortening feature works', async ({ page }) => {
  const searchInputField = page.locator('#search_form_input_homepage');
  await searchInputField.fill('shorten www.wikipedia.com');
  await page.click('#search_button_homepage');

  const shortenURL = await page.inputValue('#shorten-url');
  await page.goto(shortenURL);
  await page.locator('#www-wikipedia-org').toBeVisible;
  
  const newPageURL = await page.url();
  expect(newPageURL).toBe("https://www.wikipedia.org/");
});

test('T5: Check that intitle functionality works', async ({ page }) => {
  const searchInputField = page.locator('#search_form_input_homepage');
  await searchInputField.fill('intitle:panda');
  await page.click('#search_button_homepage');

  const results = await page.evaluate(() => Array.from(document.querySelectorAll('div [data-nir="1"]'), element => element.textContent));
        results.forEach(result => {
            expect(result.toLowerCase()).toContain("panda");
        });
});

test('T6: Check that automatic navigation to first result works', async ({ page }) => {
  const searchInputField = page.locator('#search_form_input_homepage');
  await searchInputField.fill('!w Lithuania');
  await page.click('#search_button_homepage');
  const newLoadedPage = await page.url();
  await page.locator('h1#firstHeading:has-text("Lithuania")').toBeVisible;
});


const passwordLengthsPositive = ['8', '16', '64']
passwordLengthsPositive.forEach(passwordLength => {
  test(`T7: Check that generated passwords for length ${passwordLength} are of correct length`, async ({ page }) => {
    const searchInputField = page.locator('#search_form_input_homepage');
    await searchInputField.fill("password " + passwordLength);
    await page.click('#search_button_homepage');

    const generatedPassword = await page.textContent('h3.c-base__title');
    expect(generatedPassword.length).toEqual(+passwordLength);
  });
});


const passwordLengthsNegative = ['7', '65']
passwordLengthsNegative.forEach(passwordLength => {
  test(`T8: Check that passwords are not generated for lengths ${passwordLength}`, async ({ page }) => {
    const searchInputField = page.locator('#search_form_input_homepage');
    await searchInputField.fill("password " + passwordLength);
    await page.click('#search_button_homepage');

    const generatedPassword = await page.locator('h3.c-base__title >> visible=false');
  });
});

});