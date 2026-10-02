const base = require('@playwright/test');
const { HomePage } = require('../pages/HomePage');
const { LocationPage } = require('../pages/LocationPage');
const { PlanPage } = require('../pages/PlanPage');
const { CheckoutPage } = require('../pages/CheckoutPage');
const { AccountInfoPage } = require('../pages/AccountInfoPage');
const { PaymentPage } = require('../pages/PaymentPage');
const { ConfirmationPage } = require('../pages/ConfirmationPage');
const { LoginPage } = require('../pages/LoginPage');
const { DashboardPage } = require('../pages/DashboardPage');
const { EmailGenerator } = require('./emailGenerator');
const testData = require('../test-data/qa/testData.json');

exports.test = base.test.extend({
  homePage: async ({ page }, use) => use(new HomePage(page)),
  locationPage: async ({ page }, use) => use(new LocationPage(page)),
  planPage: async ({ page }, use) => use(new PlanPage(page)),
  checkoutPage: async ({ page }, use) => use(new CheckoutPage(page)),
  accountInfoPage: async ({ page }, use) => use(new AccountInfoPage(page)),
  paymentPage: async ({ page }, use) => use(new PaymentPage(page)),
  confirmationPage: async ({ page }, use) => use(new ConfirmationPage(page)),
  loginPage: async ({ page }, use) => use(new LoginPage(page)),
  dashboardPage: async ({ page }, use) => use(new DashboardPage(page)),
  emailGenerator: async ({}, use) => {
    const emailGen = new EmailGenerator(
      testData.email.baseEmail,
      testData.email.domain
    );
    use(emailGen);
  },
});

exports.expect = base.expect;
