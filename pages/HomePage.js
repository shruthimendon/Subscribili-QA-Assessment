const { expect } = require('@playwright/test');

class HomePage {
  constructor(page) {
    this.page = page;
    this.getStartedButton = page.locator('section').filter({ hasText: 'A New Approach to Dental' }).getByTestId('home-section1-get-started-button');
    this.loginButton = page.getByTestId('home-section1-about-button');
  }

  async open() {
    const baseURL = this.page.context()?.baseURL || process.env.BASE_URL || 'https://enamel.qa.subscribili.com';
    const url = baseURL.endsWith('/') ? baseURL : baseURL + '/';
    await this.page.goto(url, { waitUntil: 'domcontentloaded', timeout: 15000 });
  }

  async startEnrollment() {
    await this.getStartedButton.click();
    // Page navigation happens - LocationPage.searchFor will wait for elements
  }

  async openLoginPage() {
    await this.loginButton.click();
  }

  async verifyHomePageHeading(heading) {
    const headingElement = this.page.getByRole('heading', { name: heading });
    await expect(headingElement).toBeVisible();
  }
}

module.exports = { HomePage };