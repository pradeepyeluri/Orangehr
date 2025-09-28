const { chromium } = require('playwright');

class MyInfoPage
{
    constructor()
    {
    }

    personalDetails = {
        firstName: 'Rambabu',
        middleName: 'Ram',
        lastName: 'Rakesh'
    };

    async editPersonalDetails(page)
    {
        page = page

        await page.waitForTimeout(10000);

        // Fill personal details with blur to trigger changes
        await page.fill('input[name="firstName"]', this.personalDetails.firstName);
        await page.locator('input[name="firstName"]').blur();

        await page.fill('input[name="middleName"]', this.personalDetails.middleName);
        await page.locator('input[name="middleName"]').blur();

        await page.fill('input[name="lastName"]', this.personalDetails.lastName);
        await page.locator('input[name="lastName"]').blur();

        // Small wait to ensure values are registered
        await page.waitForTimeout(500);

        // Click Save (first button to avoid strict mode issues)
        await page.getByRole('button', { name: 'Save' }).first().click();

        // Wait for success toast
        const successMsg = page.locator('.oxd-toast-content--success');
        await successMsg.waitFor({ timeout: 15000 });

        console.log('Personal Details updated successfully.');
    }

    async verifyPersonalDetails(page)
    {
        page = page
        // Read the saved values from the form to verify
        const savedFirstName = await page.inputValue('input[name="firstName"]');
        const savedMiddleName = await page.inputValue('input[name="middleName"]');
        const savedLastName = await page.inputValue('input[name="lastName"]');

        console.log(`First Name: ${savedFirstName}`);
        console.log(`Middle Name: ${savedMiddleName}`);
        console.log(`Last Name: ${savedLastName}`);

        // Optional: Jest assertions to ensure correctness
        expect(savedFirstName).toBe(this.personalDetails.firstName);
        expect(savedMiddleName).toBe(this.personalDetails.middleName);
        expect(savedLastName).toBe(this.personalDetails.lastName);

        console.log('Verified Personal Details successfully');
    }
}

module.exports = { MyInfoPage };


