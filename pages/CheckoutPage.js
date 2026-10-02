class CheckoutPage {
  constructor(page) {
    this.page = page;
    this.summaryHeading = page.getByRole('heading', { name: 'Checkout Summary' });
    this.paymentButton = page.getByRole('button', { name: 'Continue to Pay' });
    this.billingToggle = page.getByRole('checkbox').first();
  }

  async switchBillingFrequency() {
    await this.billingToggle.click();
  }
}

module.exports = { CheckoutPage };