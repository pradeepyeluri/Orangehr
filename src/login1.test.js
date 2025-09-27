import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';

test.describe('OrangeHRM User Management', () => {

  test('Create and Delete a User', async ({ page }) => {
    const tableLoader = page.locator("//div[contains(@class,'table-loader')]");

    // Page error logging
    page.on('pageerror', e => console.log('Page error:', e.message));

    // Go to login page
    await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
    await page.waitForLoadState('domcontentloaded');
    await waitForLoader(tableLoader);

    // Login
    await fillAndVerify(page.locator("//input[@name='username']"), 'Admin', 'Username');
    await fillAndVerify(page.locator("//input[@name='password']"), 'admin123', 'Password');
    await clickElement(page.locator("//button[@type='submit']"), 'Login Button');

    // Navigate to Admin
    const adminLink = page.locator("//a[contains(.,'Admin')]");
    await adminLink.waitFor({ state: 'visible', timeout: 30000 });
    await clickElement(adminLink, 'Admin Link');
    await waitForLoader(tableLoader);

    // Add new user
    const addBtn = page.locator("//button[contains(.,'Add')]");
    await clickElement(addBtn, 'Add Button');

    // User Role selection
    await selectDropdown(page, 'User Role', 'Admin');

    // Employee Name
    const employeeInput = page.locator("//label[text()='Employee Name']/../following-sibling::div//input");
    await fillAndVerify(employeeInput, 'Peter Mac', 'Employee Name');

    const employeeOption = page.locator("//label[text()='Employee Name']/../following-sibling::div//div[@role='option' and contains(.,'Peter Mac')]");
    await clickElement(employeeOption, 'Employee selection');

    // Status
    await selectDropdown(page, 'Status', 'Enabled');

    // Generate credentials
    const username = faker.internet.userName();
    const password = faker.internet.password() + '@12345';

    await fillAndVerify(page.locator("//label[text()='Username']/../following-sibling::div//input"), username, 'Username');
    await fillAndVerify(page.locator("//label[text()='Password']/../following-sibling::div//input"), password, 'Password');
    await fillAndVerify(page.locator("//label[text()='Confirm Password']/../following-sibling::div//input"), password, 'Confirm Password');

    // Save user
    await clickElement(page.locator("//button[normalize-space(.)='Save']"), 'Save Button');

    // Search and delete user
    const searchInput = page.locator("//label[text()='Username']/../following-sibling::div//input");
    await searchInput.waitFor({ state: 'visible', timeout: 15000 });
    await fillAndVerify(searchInput, username, 'Search Username');
    await clickElement(page.locator("//button[normalize-space(.)='Search']"), 'Search Button');

    const deleteBtn = page.locator("//button/i[contains(@class,'trash')]").first();
    await deleteBtn.waitFor({ state: 'visible', timeout: 20000 });
    await clickElement(deleteBtn, 'Delete Button');
    await clickElement(page.locator("//button[normalize-space(.)='Yes, Delete']"), 'Confirm Delete');

    await waitForLoader(tableLoader);

    const noRecords = page.locator("//span[text()='No Records Found']");
    await noRecords.waitFor({ state: 'visible', timeout: 10000 });
    expect(await noRecords.count()).toBe(1);

    console.log(`User '${username}' created and deleted successfully.`);
  });

});

// -------------------- Helper Functions --------------------

async function waitForLoader(loader) {
  if ((await loader.count()) > 0) {
    await loader.waitFor({ state: 'detached', timeout: 30000 });
  }
}

async function fillAndVerify(locator, value, name) {
  await locator.waitFor({ state: 'visible', timeout: 20000 });
  await locator.fill(value);
  const entered = await locator.inputValue();
  if (entered !== value) {
    console.warn(`Warning: Expected '${value}' but got '${entered}' for ${name}`);
  }
}

async function clickElement(locator, name) {
  await locator.waitFor({ state: 'visible', timeout: 20000 });
  await locator.click();
}

async function selectDropdown(page, label, optionText) {
  const dropdown = page.locator(`//label[text()='${label}']/../following-sibling::div//i`);
  await clickElement(dropdown, `${label} dropdown`);
  const option = page.locator(`//label[text()='${label}']/../following-sibling::div//div[@role='option' and contains(.,'${optionText}')]`);
  await clickElement(option, `${optionText} selection`);
}
