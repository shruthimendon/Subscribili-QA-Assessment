const { expect } = require('@playwright/test');

class PaymentPage {
  constructor(page) {
    this.page = page;
  }

  // Card Payment via Stripe iframe
  async enterCardNumber(cardNumber) {
    // Find the first Stripe iframe and fill card number
    const frames = this.page.locator('iframe[name*="__privateStripeFrame"]');
    const firstFrame = frames.nth(0);
    const frameContent = firstFrame.contentFrame();
    await frameContent.getByRole('textbox', { name: 'Card number' }).fill(cardNumber);
  }

  async enterCardExpiration(expiration) {
    const frames = this.page.locator('iframe[name*="__privateStripeFrame"]');
    const firstFrame = frames.nth(0);
    const frameContent = firstFrame.contentFrame();
    await frameContent.getByRole('textbox', { name: 'Expiration date' }).fill(expiration);
  }

  async enterCardCVV(cvv) {
    const frames = this.page.locator('iframe[name*="__privateStripeFrame"]');
    const firstFrame = frames.nth(0);
    const frameContent = firstFrame.contentFrame();
    await frameContent.getByRole('textbox', { name: 'Security code' }).fill(cvv);
  }

  // HSA/FSA Selection
  async selectHSAFSAOption(option) {
    if (option === 'Yes' || option === 'yes') {
      await this.page.getByRole('radio', { name: 'Yes' }).check();
    } else {
      await this.page.getByRole('radio', { name: 'No' }).check();
    }
  }

  // Bank Account Fields via Stripe iframe
  async selectBankAccount() {
    const frames = this.page.locator('iframe[name*="__privateStripeFrame"]');
    const firstFrame = frames.nth(0);
    const frameContent = firstFrame.contentFrame();
    await frameContent.getByRole('button', { name: 'US bank account' }).click();
  }

  async enterBankFullName(fullName) {
    // Find any Stripe iframe and scroll its checkout_stripe_payment container
    const iframes = this.page.locator('iframe[name*="__privateStripeFrame"]');
    const count = await iframes.count();

    for (let i = 0; i < count; i++) {
      const frameContent = iframes.nth(i).contentFrame();
      try {
        const field = frameContent.getByRole('textbox', { name: 'Full name' });
        await field.waitFor({ state: 'visible', timeout: 3000 });
        await field.click();
        await field.fill(fullName);
        return;
      } catch (e) {
        continue;
      }
    }
  }

  async enterBankAddressLine1(address) {
    const iframes = this.page.locator('iframe[name*="__privateStripeFrame"]');
    const count = await iframes.count();

    for (let i = 0; i < count; i++) {
      const frameContent = iframes.nth(i).contentFrame();
      try {
        const field = frameContent.getByRole('textbox', { name: 'Address line' });
        await field.waitFor({ state: 'visible', timeout: 3000 });
        await field.click();
        await field.fill(address);
        return;
      } catch (e) {
        continue;
      }
    }
  }

  async enterBankCity(city) {
    const iframes = this.page.locator('iframe[name*="__privateStripeFrame"]');
    const count = await iframes.count();

    for (let i = 0; i < count; i++) {
      const frameContent = iframes.nth(i).contentFrame();
      try {
        const field = frameContent.getByRole('textbox', { name: 'City' });
        await field.waitFor({ state: 'visible', timeout: 3000 });
        await field.click();
        await field.fill(city);
        return;
      } catch (e) {
        continue;
      }
    }
  }

  async enterRoutingNumber(routingNumber) {
    const frameContent = this.page.locator('iframe[name*="__privateStripeFrame"]').nth(0).contentFrame();
    await frameContent.getByRole('textbox', { name: 'Routing number' }).fill(routingNumber);
  }

  async enterAccountNumber(accountNumber) {
    const frameContent = this.page.locator('iframe[name*="__privateStripeFrame"]').nth(0).contentFrame();
    await frameContent.getByRole('textbox', { name: 'Account number' }).fill(accountNumber);
  }

  async enterSignatureName(name) {
    // Scroll the paper element (MuiDrawer modal) down to reveal signature section
    const paperElement = this.page.locator('.MuiPaper-root.MuiDrawer-paper');
    await paperElement.evaluate(el => el.scrollTop = el.scrollHeight);

    // Click Type button to enable signature input
    await this.page.getByRole('button', { name: 'Type' }).click();

    // Fill the Full legal name field
    const field = this.page.locator('input[placeholder="Full legal name"]').or(this.page.getByLabel('Full legal name'));
    await field.click();
    await field.fill(name);
  }

  // Payment Actions
  async startSubscription() {
    await this.page.getByTestId('payment-submit-button').click();
  }

  async submitPayment() {
    await this.page.getByTestId('payment-submit-button').click();
  }

  async verifyPageLoaded() {
    // Wait for Stripe iframe to load (optional - some payment flows may not have it)
    try {
      await this.page.locator('iframe[name*="__privateStripeFrame"]').first().waitFor({ state: 'visible', timeout: 5000 });
    } catch (e) {
      // Stripe iframe may not be present for all payment flows
    }
  }

  // Helper methods
  getCardNumberInput() {
    const frames = this.page.locator('iframe[name*="__privateStripeFrame"]');
    return frames.nth(0).contentFrame().getByRole('textbox', { name: 'Card number' });
  }

  getExpirationInput() {
    const frames = this.page.locator('iframe[name*="__privateStripeFrame"]');
    return frames.nth(0).contentFrame().getByRole('textbox', { name: 'Expiration date' });
  }

  getCVVInput() {
    const frames = this.page.locator('iframe[name*="__privateStripeFrame"]');
    return frames.nth(0).contentFrame().getByRole('textbox', { name: 'Security code' });
  }

  getSaveButton() {
    return this.page.getByTestId('payment-submit-button');
  }

  getSuccessMessage() {
    return this.page.getByText(/success|Success|updated|Updated/i);
  }

  getValidationErrorMessage() {
    return this.page.getByText(/required|Required|please enter|Please Enter/i);
  }

  async verifyCardLastFourDigits(cardNumber) {
    const lastFour = cardNumber.slice(-4);
    await expect(this.page.getByText(lastFour)).toBeVisible();
  }

  async verifyStartSubscriptionButtonEnabled() {
    const button = this.page.getByTestId('payment-submit-button');
    await button.scrollIntoViewIfNeeded();
    await expect(button).toBeEnabled();
  }

  async scrollToSubmitButton() {
    const button = this.page.getByTestId('payment-submit-button');
    await button.scrollIntoViewIfNeeded();
  }
}

module.exports = { PaymentPage };
