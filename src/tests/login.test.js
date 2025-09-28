const { chromium } = require('playwright');
const { LoginPage } = require('../page/LoginPage');
const { AdminHomePage } = require('../page/AdminHomePage')
const { MyInfoPage } = require('../page/MyInfoPage')

jest.useRealTimers();

describe('OrangeHRM Automation - Login & Personal Details', () =>
{
  jest.setTimeout(120000);
  let browser, page;

  // Test data for personal details
  const personalDetails = {
    firstName: 'Rambabu',
    middleName: 'Ram',
    lastName: 'Rakesh'
  };

  beforeAll(async () =>
  {
    browser = await chromium.launch({ headless: false, slowMo: 200 }); // slowMo for observation
    page = await browser.newPage();
    page.setDefaultTimeout(60000); // Set default timeout to 60 seconds 

  });

  afterAll(async () =>
  {
    await browser.close();
  });

  test('Login with valid credentials', async () =>
  {
    const loginPage = new LoginPage(page);
    await loginPage.login('Admin', 'admin123');

    const adminHomePage = new AdminHomePage();
    await adminHomePage.navigateToMyInfoPage(page);

    const myInfoPage = new MyInfoPage();
    await myInfoPage.editPersonalDetails(page);
    await myInfoPage.verifyPersonalDetails(page);


    // Click Edit button if visible
    // const editButton = page.getByRole('button', { name: 'Edit' });
    // if (await editButton.isVisible())
    // {
    //   await editButton.click();
    // }

  });

  // test('Update and verify Personal Details', async () => {
  //   // Navigate to My Info
  //   await page.getByRole('link', { name: 'My Info' }).click();

  //   // Wait for Personal Details page to load
  //   await page.waitForSelector('h6:has-text("Personal Details")');

  //   // Click Edit button if visible
  //   const editButton = page.getByRole('button', { name: 'Edit' });
  //   if (await editButton.isVisible()) {
  //     await editButton.click();
  //   }

  //   // Fill personal details with blur to trigger changes
  //   await page.fill('input[name="firstName"]', personalDetails.firstName);
  //   await page.locator('input[name="firstName"]').blur();

  //   await page.fill('input[name="middleName"]', personalDetails.middleName);
  //   await page.locator('input[name="middleName"]').blur();

  //   await page.fill('input[name="lastName"]', personalDetails.lastName);
  //   await page.locator('input[name="lastName"]').blur();

  //   // Small wait to ensure values are registered
  //   await page.waitForTimeout(500);

  //   // Click Save (first button to avoid strict mode issues)
  //   await page.getByRole('button', { name: 'Save' }).first().click();

  //   // Wait for success toast
  //   const successMsg = page.locator('.oxd-toast-content--success');
  //   await successMsg.waitFor({ timeout: 15000 });

  //   console.log('Personal Details updated successfully.');

  //   // Read the saved values from the form to verify
  //   const savedFirstName = await page.inputValue('input[name="firstName"]');
  //   const savedMiddleName = await page.inputValue('input[name="middleName"]');
  //   const savedLastName = await page.inputValue('input[name="lastName"]');

  //   console.log('Saved Personal Details:');
  //   console.log(`First Name: ${savedFirstName}`);
  //   console.log(`Middle Name: ${savedMiddleName}`);
  //   console.log(`Last Name: ${savedLastName}`);

  //   // Optional: Jest assertions to ensure correctness
  //   expect(savedFirstName).toBe(personalDetails.firstName);
  //   expect(savedMiddleName).toBe(personalDetails.middleName);
  //   expect(savedLastName).toBe(personalDetails.lastName);
  // });
});
