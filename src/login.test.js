const { chromium } = require('playwright');

describe('OrangeHRM Automation - Login & Personal Details', () => {
  let browser, page;

  // Test data for personal details
  const personalDetails = {
    firstName: 'Rambabu',
    middleName: 'Ram',
    lastName: 'Rakesh'
  };

  beforeAll(async () => {
    browser = await chromium.launch({ headless: false, slowMo: 200 }); // slowMo for observation
    page = await browser.newPage();
  });

  afterAll(async () => {
    await browser.close();
  });

  test('Login with valid credentials', async () => {
    await page.goto('https://opensource-demo.orangehrmlive.com/');

    // Enter username and password
    await page.fill('input[name="username"]', 'Admin');
    await page.fill('input[name="password"]', 'admin123');

    // Click login
    await page.click('button[type="submit"]');

    // Wait for Dashboard heading to ensure login success
    await page.waitForSelector('h6:has-text("Dashboard")');

    console.log('Login successful.');
  });

  test('Update and verify Personal Details', async () => {
    // Navigate to My Info
    await page.getByRole('link', { name: 'My Info' }).click();

    // Wait for Personal Details page to load
    await page.waitForSelector('h6:has-text("Personal Details")');

    // Click Edit button if visible
    const editButton = page.getByRole('button', { name: 'Edit' });
    if (await editButton.isVisible()) {
      await editButton.click();
    }

    // Fill personal details with blur to trigger changes
    await page.fill('input[name="firstName"]', personalDetails.firstName);
    await page.locator('input[name="firstName"]').blur();

    await page.fill('input[name="middleName"]', personalDetails.middleName);
    await page.locator('input[name="middleName"]').blur();

    await page.fill('input[name="lastName"]', personalDetails.lastName);
    await page.locator('input[name="lastName"]').blur();

    // Small wait to ensure values are registered
    await page.waitForTimeout(500);

    // Click Save (first button to avoid strict mode issues)
    await page.getByRole('button', { name: 'Save' }).first().click();

    // Wait for success toast
    const successMsg = page.locator('.oxd-toast-content--success');
    await successMsg.waitFor({ timeout: 15000 });

    console.log('Personal Details updated successfully.');

    // Read the saved values from the form to verify
    const savedFirstName = await page.inputValue('input[name="firstName"]');
    const savedMiddleName = await page.inputValue('input[name="middleName"]');
    const savedLastName = await page.inputValue('input[name="lastName"]');

    console.log('Saved Personal Details:');
    console.log(`First Name: ${savedFirstName}`);
    console.log(`Middle Name: ${savedMiddleName}`);
    console.log(`Last Name: ${savedLastName}`);

    // Optional: Jest assertions to ensure correctness
    expect(savedFirstName).toBe(personalDetails.firstName);
    expect(savedMiddleName).toBe(personalDetails.middleName);
    expect(savedLastName).toBe(personalDetails.lastName);
  });
});
