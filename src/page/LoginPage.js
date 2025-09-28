const { chromium } = require('playwright');
const { PlayWrightHelper, PlaywrightHelper } = require('../utilities/PlaywrightHelper')

class LoginPage
{
  page;
  usernameTextbox;
  passwordTextbox;
  submitButton;

  constructor(page)
  {
    // Mock user data (in real-world apps, this comes from a database or API)
    this.users = [
      { username: "admin", password: "admin123" },
      { username: "testuser", password: "test123" }
    ];

    this.page = page;
    this.usernameTextbox = this.page.locator('input[name="username"]');
    this.passwordTextbox = this.page.locator('input[name="password"]');
    this.submitButton = this.page.locator('button[type="submit"]');
  }

  async login(username, password)
  {
    // page = page

    await this.page.goto('https://opensource-demo.orangehrmlive.com/');

    // await this.page.waitForTimeout(10000);

    // Enter username and password
    // await page.fill('input[name="username"]', 'Admin');    
    // await page.fill('input[name="password"]', 'admin123');

    PlaywrightHelper.fill(await this.usernameTextbox, 'Admin')
    await this.page.waitForTimeout(3000);
    PlaywrightHelper.fill(await this.passwordTextbox, 'admin123')
    await this.page.waitForTimeout(3000);

    // Click login
    // await page.click('button[type="submit"]');
    PlaywrightHelper.click(await this.submitButton)



    // Wait for Dashboard heading to ensure login success 
    await this.page.waitForSelector('h6:has-text("Dashboard")');

    console.log('Login successful.');
  }
}

module.exports = { LoginPage };


