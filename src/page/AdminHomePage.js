const { chromium } = require('playwright');

class AdminHomePage
{
    constructor()
    {
    }

    async navigateToMyInfoPage(page)
    {
        page = page

        // Navigate to My Info
        // await page.getByRole('link', { name: 'My Info' }).click();
        await page.click('//a[@href="/web/index.php/pim/viewMyDetails"]')
        await page.waitForTimeout(5000);
        // Wait for Personal Details page to load
        await page.waitForSelector('h6:has-text("Personal Details")');

        console.log('naviagte to my info page successful.');
    }
}

module.exports = { AdminHomePage };


