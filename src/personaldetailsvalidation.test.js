const { chromium } = require('playwright');

describe('OrangeHRM Automation - Login & Personal Details', () => {
  let browser, page;

  beforeAll(async () => {
    browser = await chromium.launch({ headless: false, slowMo: 200 });
    page = await browser.newPage();
  });

  afterAll(async () => {
    await browser.close();
  });

  test('Login with valid credentials', async () => {
    await page.goto('https://opensource-demo.orangehrmlive.com/');

    await page.fill('input[name="username"]', 'Admin');
    await page.fill('input[name="password"]', 'admin123');
    await page.click('button[type="submit"]');

    const headingText = await page.textContent('h6');
    expect(headingText).toContain('Dashboard');

    console.log('Login successful.');
  });

  test('Update Personal Details', async () => {
    await page.getByRole('link', { name: 'My Info' }).click();
    await page.waitForSelector('h6:has-text("Personal Details")');

    const editButton = page.getByRole('button', { name: 'Edit' });
    if (await editButton.isVisible()) {
      await editButton.click();
    }

    // Input values
    const personalDetails = {
      firstName: 'Rambabu',
      middleName: 'Ram',
      lastName: 'Rakesh'
    };

    // Fill and verify inputs before saving
await page.fill('input[name="firstName"]', personalDetails.firstName);
await page.fill('input[name="middleName"]', personalDetails.middleName);
await page.fill('input[name="lastName"]', personalDetails.lastName);

// Force blur to trigger framework updates
await page.locator('input[name="lastName"]').blur();

// Optional: small wait to ensure values are registered
await page.waitForTimeout(500);

// Click the first Save button
await page.getByRole('button', { name: 'Save' }).first().click();

// Wait for success toast
await page.locator('.oxd-toast-content--success').waitFor({ timeout: 15000 });

// Re-read inputs to confirm save
const savedFirstName = await page.inputValue('input[name="firstName"]');
const savedMiddleName = await page.inputValue('input[name="middleName"]');
const savedLastName = await page.inputValue('input[name="lastName"]');

console.log('Saved Personal Details:');
console.log(`First Name: ${savedFirstName}`);
console.log(`Middle Name: ${savedMiddleName}`);
console.log(`Last Name: ${savedLastName}`);
  });
});
