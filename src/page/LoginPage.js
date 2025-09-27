const { chromium } = require('playwright');
class LoginPage {
  constructor() {
    // Mock user data (in real-world apps, this comes from a database or API)
    this.users = [
      { username: "admin", password: "admin123" },
      { username: "testuser", password: "test123" }
    ];
  }

  async login(username, password, page) {
    page = page 

   await page.goto('https://opensource-demo.orangehrmlive.com/');

    // Enter username and password
    await page.fill('input[name="username"]', 'Admin');
    await page.fill('input[name="password"]', 'admin123');

    // Click login
    await page.click('button[type="submit"]');


    // Wait for Dashboard heading to ensure login success 
    await page.waitForSelector('h6:has-text("Dashboard")');

    console.log('Login successful.');
    //  const user = this.users.find(
    //   (u) => u.username === username && u.password === password
    // );

    // if (user) {
    //   console.log(`✅ Login successful for user: ${username}`);
    //   return true;
    // } else {
    //   console.log("❌ Invalid username or password");
    //   return false;
    // }
  }
}

module.exports = { LoginPage };


