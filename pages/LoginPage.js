const { expect } = require('@playwright/test');

class LoginPage {
  constructor(page) {
    this.page = page;
    this.emailInput = page.getByTestId('login-otp-email-input');
    this.signinButton = page.getByTestId('signin-button');
    this.otpInput = page.getByTestId('login-form-otp-input');
  }

  async enterEmail(email) {
    await this.emailInput.fill(email);
  }

  async clickSignIn() {
    await this.signinButton.click();
  }

  async enterOTP(otp) {
    await this.otpInput.fill(otp);
  }

  async verifyLoginSuccess() {
    await this.page.waitForURL('**/dashboard', { timeout: 30000 });
  }
}

module.exports = { LoginPage };
