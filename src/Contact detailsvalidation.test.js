jest.setTimeout(300000); // 5 minutes
const { chromium, expect } = require('playwright/test');

describe('OrangeHRM Automation - Personal & Contact Details', () => {
  let browser, page;

  beforeAll(async () => {
    browser = await chromium.launch({ headless: false, slowMo: 200 });
    page = await browser.newPage();
    await page.goto('https://opensource-demo.orangehrmlive.com/');
  });

  afterAll(async () => {
    await browser.close();
  });

  test('Login and Update Personal & Contact Details including Country', async () => {
    // -------- LOGIN --------
    await page.fill('input[name="username"]', 'Admin');
    await page.fill('input[name="password"]', 'admin123');
    await page.click('button[type="submit"]');

    // Dashboard heading validation (avoids strict mode error)
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
    console.log('Login successful.');

    // -------- UPDATE PERSONAL DETAILS --------
    await page.getByRole('link', { name: 'My Info' }).click();
    await page.waitForSelector('h6:has-text("Personal Details")');

    const editPersonalButton = page.getByRole('button', { name: 'Edit' });
    if (await editPersonalButton.isVisible()) {
      await editPersonalButton.click();
    }

    const personalDetails = {
      firstName: 'Rambabu',
      middleName: 'Ram',
      lastName: 'Rakesh'
    };

    await page.fill('input[name="firstName"]', personalDetails.firstName);
    await page.fill('input[name="middleName"]', personalDetails.middleName);
    await page.fill('input[name="lastName"]', personalDetails.lastName);

    await page.locator('input[name="lastName"]').blur();
    await page.waitForTimeout(500);

    await page.getByRole('button', { name: 'Save' }).first().click();
    await page.locator('.oxd-toast-content--success').waitFor({ timeout: 15000 });

    console.log('Personal Details updated:', personalDetails);

    // -------- UPDATE CONTACT DETAILS --------
    await page.getByRole('link', { name: 'Contact Details' }).click();
    const contactHeader = page.locator('h6:has-text("Contact Details")');
    await contactHeader.waitFor({ state: 'visible', timeout: 15000 });

    // Robust Edit button handling
    const editContactButton = page.getByRole('button', { name: 'Edit' }).first();
    await editContactButton.scrollIntoViewIfNeeded();
    await editContactButton.waitFor({ state: 'attached', timeout: 10000 });
    await editContactButton.waitFor({ state: 'visible', timeout: 10000 });
    await editContactButton.waitFor({ state: 'enabled', timeout: 10000 });
    await editContactButton.click();

    // ===== UPDATED CONTACT DETAILS =====
    const contactDetails = {
      street1: '789 Maple Street',
      street2: 'Apt 12B',
      city: 'San Francisco',
      state: 'California',
      zipCode: '94107',
      homeTelephone: '+1-415-555-4321',
      mobile: '+1-415-555-6789',
      workTelephone: '+1-415-555-1111',
      workEmail: 'rambabu.rakesh@company.com',
      otherEmail: 'rambabu.personal@gmail.com',
      country: 'Canada'
    };

    // Fill fields
    await page.fill('input[name="street1"]', contactDetails.street1);
    await page.fill('input[name="street2"]', contactDetails.street2);
    await page.fill('input[name="city"]', contactDetails.city);
    await page.fill('input[name="state"]', contactDetails.state);
    await page.fill('input[name="zipCode"]', contactDetails.zipCode);
    await page.fill('input[name="homeTelephone"]', contactDetails.homeTelephone);
    await page.fill('input[name="mobile"]', contactDetails.mobile);
    await page.fill('input[name="workTelephone"]', contactDetails.workTelephone);
    await page.fill('input[name="workEmail"]', contactDetails.workEmail);
    await page.fill('input[name="otherEmail"]', contactDetails.otherEmail);

    // Select Country (custom dropdown)
    const countryDropdown = page.locator('label:has-text("Country") + div .oxd-select-text-input');
    await countryDropdown.click();
    await page.locator(`.oxd-select-dropdown [role="option"] >> text=${contactDetails.country}`).click();

    // Save Contact Details
    await page.getByRole('button', { name: 'Save' }).click();
    await page.locator('.oxd-toast-content--success').waitFor({ timeout: 5000 });

    console.log('Contact Details updated including Country:', contactDetails);

    // -------- VALIDATE CONTACT DETAILS --------
    const fields = [
      { selector: 'input[name="street1"]', expected: contactDetails.street1 },
      { selector: 'input[name="street2"]', expected: contactDetails.street2 },
      { selector: 'input[name="city"]', expected: contactDetails.city },
      { selector: 'input[name="state"]', expected: contactDetails.state },
      { selector: 'input[name="zipCode"]', expected: contactDetails.zipCode },
      { selector: 'input[name="homeTelephone"]', expected: contactDetails.homeTelephone },
      { selector: 'input[name="mobile"]', expected: contactDetails.mobile },
      { selector: 'input[name="workTelephone"]', expected: contactDetails.workTelephone },
      { selector: 'input[name="workEmail"]', expected: contactDetails.workEmail },
      { selector: 'input[name="otherEmail"]', expected: contactDetails.otherEmail }
    ];

    for (const field of fields) {
      const value = await page.inputValue(field.selector);
      expect(value).toBe(field.expected);
    }

    // Validate Country selection
    const selectedCountry = await page.locator('label:has-text("Country") + div .oxd-select-text-input').innerText();
    expect(selectedCountry.trim()).toBe(contactDetails.country);

    console.log('All Contact Details validated successfully including Country.');
  });
});
