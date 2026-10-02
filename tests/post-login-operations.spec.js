const { test, expect } = require('../utils/fixture');
const testData = require('../test-data/qa/testData.json');
const { generateUniqueEmail } = require('../utils/emailGenerator');

test('TC008: Add dependent via login', async ({
  homePage,
  loginPage,
  dashboardPage,
  paymentPage,
}) => {
  // Open home page and login
  await homePage.open();
  await homePage.openLoginPage();

  const tc008Email = generateUniqueEmail(testData.email.baseEmail, testData.email.domain);
  await loginPage.enterEmail(tc008Email);
  await loginPage.clickSignIn();
  await loginPage.enterOTP(testData.defaultOTP);
  await loginPage.clickSignIn();
  await loginPage.verifyLoginSuccess();

  // Wait for add member button to be ready
  await dashboardPage.addMemberButton.waitFor({ state: 'visible' });

  // Count existing dependents by counting "Dependent N" headings
  const dependentHeadings = await dashboardPage.page.locator('text=/^Dependent \\d+$/').count();
  const dependentIndex = dependentHeadings;
  console.log(`Found ${dependentHeadings} existing dependents, using index ${dependentIndex} for new dependent`);

  // Add dependent with dynamic index
  const dependent1 = testData.dependents[0];
  await dashboardPage.addDependent(dependentIndex);

  // Wait for the "Add Dependent" modal to appear
  await dashboardPage.page.getByRole('heading', { name: 'Add Dependent' }).waitFor({ state: 'visible', timeout: 10000 });

  await dashboardPage.enterDependentFirstName(dependent1.firstName, dependentIndex);
  await dashboardPage.enterDependentLastName(dependent1.lastName, dependentIndex);
  await dashboardPage.selectDependentPlan(dependent1.planName, dependentIndex);
  await dashboardPage.enterDependentDOB(dependent1.dob, dependentIndex);
  await dashboardPage.selectDependentGender(dependent1.gender, dependentIndex);

  // Continue to payment
  await dashboardPage.continueToDependentPayment();
  await paymentPage.verifyPageLoaded();

  // Fill signature
  const rpFullName = `${testData.responsibleParty.firstName} ${testData.responsibleParty.lastName}`;
  await dashboardPage.fillSignatureName(rpFullName);

  // Submit
  await dashboardPage.submitDependentPayment();
  await dashboardPage.verifyDependentAdded();

  // Verify subscription success message
  await expect(dashboardPage.page.getByText('Your subscription has been created')).toBeVisible();

  // Click login button on success page
  await dashboardPage.page.getByRole('button', { name: 'Login' }).click();
});

test('TC009: Post-login - Update Billing and Payment', async ({
  homePage,
  loginPage,
  dashboardPage,
  paymentPage,
}) => {
  // Open home page and login
  await homePage.open();
  await homePage.openLoginPage();

  const testEmail = generateUniqueEmail(testData.email.baseEmail, testData.email.domain);
  await loginPage.enterEmail(testEmail);
  await loginPage.clickSignIn();
  await loginPage.enterOTP(testData.defaultOTP);
  await loginPage.clickSignIn();
  await loginPage.verifyLoginSuccess();

  // Click on update payment details button
  const updatePaymentButton = dashboardPage.page.getByTestId('update-card-popup-button');
  await updatePaymentButton.click();

  // Fill card details using paymentPage methods (same as onboarding TC001)
  await paymentPage.enterCardNumber(testData.paymentCard.cardNumber);
  await paymentPage.enterCardExpiration(testData.paymentCard.expiration);
  await paymentPage.enterCardCVV(testData.paymentCard.cvv);

  // Fill billing details using PaymentPage methods (handles Stripe iframes)
  const fullName = `${testData.responsibleParty.firstName} ${testData.responsibleParty.lastName}`;
  const addressLine1 = testData.responsibleParty.address.split(',')[0];
  const city = testData.responsibleParty.city;

  await paymentPage.enterBankFullName(fullName);
  await paymentPage.enterBankAddressLine1(addressLine1);
  await paymentPage.enterBankCity(city);

  // Submit the billing and payment update
  await paymentPage.page.getByTestId('payment-submit-button').click();
});

test('TC019: Post-login - Download Packet files', async ({
  homePage,
  loginPage,
  dashboardPage,
}) => {
  // Open home page and login
  await homePage.open();
  await homePage.openLoginPage();

  const testEmail = generateUniqueEmail(testData.email.baseEmail, testData.email.domain);
  await loginPage.enterEmail(testEmail);
  await loginPage.clickSignIn();
  await loginPage.enterOTP(testData.defaultOTP);
  await loginPage.clickSignIn();
  await loginPage.verifyLoginSuccess();

  // Access Download Packet dropdown
  const downloadPacketButton = dashboardPage.page.getByRole('button', { name: /Download Packet/i });
  await expect(downloadPacketButton).toBeVisible();
  await downloadPacketButton.click();

  // Verify dropdown options are visible
  const benefitsPacketOption = dashboardPage.page.getByRole('menuitem', { name: 'Benefits Packet' });
  const hsaFsaReportOption = dashboardPage.page.getByRole('menuitem', { name: 'HSA & FSA Report' });

  await expect(benefitsPacketOption).toBeVisible();
  await expect(hsaFsaReportOption).toBeVisible();

  // Click Benefits Packet download
  const downloadPromise1 = dashboardPage.page.waitForEvent('download');
  await benefitsPacketOption.click();
  const download1 = await downloadPromise1;

  // Verify file was downloaded
  await expect(download1.suggestedFilename()).toContain('benefits');

  // Re-open dropdown and download HSA & FSA Report
  await downloadPacketButton.click();
  const downloadPromise2 = dashboardPage.page.waitForEvent('download');
  await hsaFsaReportOption.click();
  const download2 = await downloadPromise2;

  // Verify file was downloaded
  await expect(download2.suggestedFilename()).toContain('hsa');
});
