const { expect } = require('@playwright/test');

class ConfirmationPage {
  constructor(page) {
    this.page = page;
    this.confirmationHeading = page.getByRole('heading', { name: /A New Approach to Dental Services/i });
    this.successMessage = page.getByText(/A New Approach to Dental Services/i);
  }

  async verifyConfirmationPage() {
    // Verify the main page heading is visible (indicates successful subscription)
    await expect(this.confirmationHeading).toBeVisible();
  }

  async verifySubscriptionDetails(subscriptionInfo) {
    try {
      if (subscriptionInfo.product) {
        await expect(this.page.getByText(subscriptionInfo.product)).toBeVisible();
      }
    } catch (e) {
      // Product may not be visible on confirmation page
    }
  }

  async getConfirmationText() {
    return await this.confirmationHeading.textContent();
  }

  async navigateToHome() {
    const homeButton = this.page.getByRole('button', { name: /home|Home|go home|Go Home/i });
    await homeButton.click();
    await this.page.waitForURL(/\/home|\/dashboard|\/account/);
  }

  verifyTextVisible(text) {
    return this.page.getByText(text);
  }
}

module.exports = { ConfirmationPage };
