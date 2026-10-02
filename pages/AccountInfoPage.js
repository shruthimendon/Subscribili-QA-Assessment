const { expect } = require('@playwright/test');

class AccountInfoPage {
  constructor(page) {
    this.page = page;
    this.summaryHeading = page.getByRole('heading', { name: /summary|information|details/i });
    this.billingToggle = page.getByRole('checkbox', { name: 'Billed Monthly Billed Yearly' });
    this.continueToPayButton = page.getByTestId('continue-pay-button');
    this.addMemberButton = page.getByTestId('add-member-button');
  }

  // Subscriber Details
  async enterSubscriberFirstName(firstName) {
    await this.page.getByTestId('member-info-first_name').fill(firstName);
  }

  async enterSubscriberLastName(lastName) {
    await this.page.getByTestId('member-info-last_name').fill(lastName);
  }

  async enterSubscriberDOB(dob) {
    await this.page.getByRole('textbox', { name: 'Date of Birth' }).first().fill(dob);
  }

  async selectSubscriberGender(gender) {
    await this.page.getByRole('button', { name: 'Gender' }).first().click();
    if (gender.toLowerCase() === 'male') {
      await this.page.getByTestId('subscription-info-select-gender-item-1').click();
    } else if (gender.toLowerCase() === 'female') {
      await this.page.getByTestId('subscription-info-select-gender-item-2').click();
    }
  }

  // Responsible Party Details
  async enterResponsiblePartyFullName(fullName) {
    await this.page.getByLabel('Full Name').fill(fullName);
  }

  async enterResponsiblePartyFirstName(firstName) {
    await this.page.getByTestId('member-info-first_name').fill(firstName);
  }

  async enterResponsiblePartyLastName(lastName) {
    await this.page.getByTestId('member-info-last_name').last().fill(lastName);
  }

  async enterResponsiblePartyDOB(dob) {
    await this.page.getByRole('textbox', { name: 'Date of Birth' }).last().fill(dob);
  }

  async selectResponsiblePartyRelationship(relationship) {
    await this.page.getByTestId('member-info-relationship').fill(relationship);
  }

  async enterResponsiblePartyEmail(email) {
    await this.page.getByTestId('subscription-info-email').fill(email);
  }

  async enterResponsiblePartyPhone(phone) {
    await this.page.getByTestId('subscription-info-phone-input').fill(phone);
  }

  async enterResponsiblePartyAddress(address) {
    await this.page.getByTestId('member-info-line1').fill(address);
  }

  async enterResponsiblePartyCity(city) {
    await this.page.getByTestId('member-info-city').fill(city);
  }

  async enterResponsiblePartyState(state) {
    const stateInput = this.page.getByTestId('patient-details-state-auto-complete-input');
    await stateInput.click();
    await this.page.getByRole('option', { name: state }).click();
  }

  async enterResponsiblePartyZipCode(zipCode) {
    await this.page.getByTestId('member-info-zipcode').fill(zipCode);
  }

  // Billing
  async setBillingFrequency(type) {
    // Default is annual - checkbox is checked by default
    // Only toggle if we need monthly
    const billingCheckbox = this.page.locator('input[name="subcategory"]');

    if (type === 'monthly') {
      // Uncheck for monthly billing
      await billingCheckbox.uncheck().catch(() => {});
    }
    // For annual, do nothing - it's already the default
  }

  async switchBillingFrequency() {
    await this.billingToggle.click();
  }

  async verifyBillingAmount(expectedAmount) {
    const amountText = this.page.getByText(expectedAmount.toString());
    await expect(amountText).toBeVisible();
  }

  async verifySubscriptionPeriod(period) {
    await expect(this.page.getByText(period)).toBeVisible();
  }

  async verifyPlanNameInSummary(planName) {
    await expect(this.page.getByText(planName)).toBeVisible();
  }

  // Navigation
  async continueToPayment() {
    await this.continueToPayButton.click();
    // Wait for payment page to load by checking for Stripe iframe
    await this.page.locator('iframe[name*="__privateStripeFrame"]').first().waitFor({ state: 'visible', timeout: 30000 });
  }

  // Dependent Management
  async addDependent(index = 0) {
    // First dependent uses the initial add-member-button
    if (index === 0) {
      await this.addMemberButton.click();
    } else {
      // Subsequent dependents use the "Add Dependent" button
      await this.page.getByRole('button', { name: 'Add Dependent', exact: true }).click();
    }
  }

  async enterDependentFirstName(firstName, index = 0) {
    await this.page.getByTestId(`dependent-first_name-${index}`).fill(firstName);
  }

  async enterDependentLastName(lastName, index = 0) {
    await this.page.getByTestId(`dependent-last_name-${index}`).fill(lastName);
  }

  async enterDependentDOB(dob, index = 0) {
    const region = this.page.getByRole('region', { name: new RegExp(`Dependent ${index + 1}.*Remove`) });
    await region.getByRole('textbox', { name: 'Date of Birth' }).fill(dob);
  }

  async selectDependentPlan(planName, index = 0) {
    const region = this.page.getByRole('region', { name: new RegExp(`Dependent ${index + 1}.*Remove`) });
    await region.getByRole('button', { name: 'Plan Type', exact: true }).click();
    await this.page.getByRole('option', { name: planName }).click();
  }

  async selectDependentGender(gender, index = 0) {
    const region = this.page.getByRole('region', { name: new RegExp(`Dependent ${index + 1}.*Remove`) });
    await region.getByRole('button', { name: 'Gender' }).click();
    const genderLabel = gender.toLowerCase() === 'male' ? 'Male' : 'Female';
    await this.page.getByRole('option', { name: genderLabel, exact: true }).first().click();
  }

  // Helper methods
  getAddDependentButton() {
    return this.addMemberButton;
  }

  getPhoneInput() {
    return this.page.getByTestId('subscription-info-phone-input');
  }

  getEmailInputs() {
    return this.page.getByTestId('subscription-info-email');
  }

  selectPlanOption(planName) {
    return this.page.getByRole('option', { name: planName });
  }

  verifyTextVisible(text) {
    return this.page.getByText(text);
  }

  verifyErrorMessageVisible(errorPattern) {
    return this.page.getByText(errorPattern);
  }
}

module.exports = { AccountInfoPage };
