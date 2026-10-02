const { expect } = require('@playwright/test');

class DashboardPage {
  constructor(page) {
    this.page = page;
    this.addMemberButton = page.getByTestId('add-member-button');
  }

  async addDependent(index = 0) {
    if (index === 0) {
      await this.addMemberButton.click();
    } else {
      await this.page.getByRole('button', { name: 'Add Dependent', exact: true }).click();
    }
  }

  async enterDependentFirstName(firstName, index = 0) {
    const field = this.page.getByTestId(`dependent-first_name-${index}`);
    await field.click();
    await field.clear();
    await field.type(firstName);
  }

  async enterDependentLastName(lastName, index = 0) {
    const field = this.page.getByTestId(`dependent-last_name-${index}`);
    await field.click();
    await field.clear();
    await field.type(lastName);
  }

  async enterDependentDOB(dob, index = 0) {
    const field = this.page.locator(`[id="${index}-date_of_birth"]`);
    await field.click();
    await field.fill(dob);
  }

  async selectDependentPlan(planName, index = 0) {
    const planButton = this.page.getByRole('button', { name: 'Plan Type', exact: true });
    await planButton.click();
    const option = this.page.getByRole('option', { name: planName });
    await option.click();
  }

  async selectDependentGender(gender, index = 0) {
    const genderButton = this.page.getByRole('button', { name: 'Gender' });
    await genderButton.click();
    const genderLabel = gender.toLowerCase() === 'male' ? 'Male' : 'Female';
    const option = this.page.getByRole('option', { name: genderLabel, exact: true }).first();
    await option.click();
  }

  async continueToDependentPayment() {
    const button = this.page.getByTestId('continue-pay-button');
    await button.click();
  }

  async fillSignatureName(name) {
    const typeButton = this.page.getByRole('button', { name: 'Type' });
    await typeButton.click();
    const field = this.page.getByRole('textbox', { name: 'Full legal name' });
    await field.fill(name);
  }

  async submitDependentPayment() {
    await this.page.getByTestId('payment-submit-button').click();
  }

  async verifyDependentAdded() {
    await this.page.waitForURL('**/subscription-success', { timeout: 30000 });
  }

  // Billing and Payment Methods
  async fillBillingFullName(fullName) {
    const field = this.page.getByLabel('Full name');
    await field.click();
    await field.clear();
    await field.type(fullName);
  }

  async fillBillingAddressLine1(address) {
    const field = this.page.getByLabel('Address line 1');
    await field.click();
    await field.clear();
    await field.type(address);
  }

  async fillBillingAddressLine2(address) {
    const field = this.page.getByLabel('Address line 2');
    await field.click();
    await field.clear();
    await field.type(address);
  }

  async fillBillingCity(city) {
    const field = this.page.getByLabel('City');
    await field.click();
    await field.clear();
    await field.type(city);
  }

  async selectBillingState(state) {
    const stateSelect = this.page.getByLabel('State');
    await stateSelect.click();
    await this.page.getByRole('option', { name: state }).click();
  }
}

module.exports = { DashboardPage };
