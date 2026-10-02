const { test, expect } = require('../utils/fixture');
const testData = require('../test-data/qa/testData.json');

// Test TC016: Login with unregistered email
test.describe('TC016: Login Validation - Unregistered Email', () => {
  test('should display error when attempting to login with unregistered email', async ({
    homePage,
    loginPage,
  }) => {
    // Step 1: Open home page
    await homePage.open();
    await homePage.verifyHomePageHeading(testData.uiText.homePageHeading);

    // Step 2: Click login button
    await loginPage.openLoginPage();
    await loginPage.verifyLoginPageVisible();

    // Step 3: Enter unregistered email
    const unregisteredEmail = testData.testEmails.unregistered;
    await loginPage.enterEmail(unregisteredEmail);

    // Step 4: Send verification code
    await loginPage.sendVerificationCode();

    // Step 5: Verify error message appears
    await loginPage.verifyErrorMessage(testData.errorMessages.unregisteredEmail);

    // Step 6: Verify still on login page
    await loginPage.verifyLoginPageVisible();

    // Step 7: Verify email field still contains the entered email
    const emailInput = loginPage.getEmailInput();
    const inputValue = await emailInput.inputValue();
    expect(inputValue).toBe(unregisteredEmail);

    // Step 8: Verify email field is still editable
    await expect(emailInput).toBeEnabled();
  });

  test('should handle multiple consecutive unregistered email attempts', async ({
    loginPage,
  }) => {
    // Open login page
    await loginPage.openLoginPage();
    await loginPage.verifyLoginPageVisible();

    // Try first unregistered email
    await loginPage.enterEmail(testData.testEmails.firstUnregistered);
    await loginPage.sendVerificationCode();
    await loginPage.verifyErrorMessage(testData.errorMessages.unregisteredEmailShort);

    // Clear and try second unregistered email
    const emailInput = loginPage.getEmailInput();
    await emailInput.clear();
    await loginPage.enterEmail(testData.testEmails.anotherUnregistered);
    await loginPage.sendVerificationCode();
    await loginPage.verifyErrorMessage(testData.errorMessages.unregisteredEmailShort);

    // Verify still on login page
    await loginPage.verifyLoginPageVisible();
  });
});

// Test TC015: Duplicate Email Registration Validation
test.describe('TC015: Registration Validation - Duplicate Email', () => {
  test('should prevent registration with duplicate email and show error', async ({
    homePage,
    locationPage,
    planPage,
    accountInfoPage,
  }) => {
    // Navigate to onboarding
    await homePage.open();
    await homePage.startEnrollment();
    await locationPage.verifyLocationPageHeading(testData.uiText.locationPageHeading);

    // Select location
    await locationPage.searchFor(testData.locationName);
    await locationPage.selectFirstResult();

    // Select plan
    const smileMorePlan = testData.plans.find(p => p.name === 'Smile More');
    await planPage.choosePlan(smileMorePlan.name);

    // Fill subscriber details
    await accountInfoPage.enterSubscriberFirstName(testData.subscriber.adultFirstName);
    await accountInfoPage.enterSubscriberLastName(testData.subscriber.adultLastName);
    await accountInfoPage.enterSubscriberDOB(testData.subscriber.adultDOB);
    await accountInfoPage.selectSubscriberGender(testData.subscriber.gender);

    // Fill responsible party details with duplicate email
    await accountInfoPage.enterResponsiblePartyFirstName(testData.responsibleParty.firstName);
    await accountInfoPage.enterResponsiblePartyLastName(testData.responsibleParty.lastName);
    await accountInfoPage.enterResponsiblePartyEmail(testData.testEmails.duplicate);

    // Move focus away to trigger validation
    await accountInfoPage.getPhoneInput().click();

    // Wait and verify error message
    const errorMessage = accountInfoPage.verifyErrorMessageVisible(/email.*already.*exists|account.*email.*already/i);
    await expect(errorMessage).toBeVisible();

    // Verify Continue to Pay button is disabled
    await expect(accountInfoPage.continueToPayButton).toBeDisabled();

    // Clear email and enter new one
    const emailInputs = accountInfoPage.getEmailInputs();
    await emailInputs.nth(1).clear();
    await accountInfoPage.enterResponsiblePartyEmail(testData.testEmails.valid);

    // Verify error disappears
    await expect(errorMessage).not.toBeVisible();

    // Verify Continue to Pay button is now enabled
    await expect(accountInfoPage.continueToPayButton).toBeEnabled();
  });

  test('should show error only when duplicate email is entered', async ({
    homePage,
    locationPage,
    planPage,
    accountInfoPage,
  }) => {
    // Navigate to onboarding
    await homePage.open();
    await homePage.startEnrollment();
    await locationPage.searchFor(testData.locationName);
    await locationPage.selectFirstResult();

    const childSmilesPlan = testData.plans.find(p => p.name === 'Child Smiles');
    await planPage.choosePlan(childSmilesPlan.name);

    // Fill subscriber details
    await accountInfoPage.enterSubscriberFirstName(testData.subscriber.childFirstName);
    await accountInfoPage.enterSubscriberLastName(testData.subscriber.childLastName);
    await accountInfoPage.enterSubscriberDOB(testData.subscriber.childDOB);
    await accountInfoPage.selectSubscriberGender(testData.subscriber.childGender);

    // Fill first few responsible party details
    await accountInfoPage.enterResponsiblePartyFirstName(testData.responsibleParty.firstName);
    await accountInfoPage.enterResponsiblePartyLastName(testData.responsibleParty.lastName);

    // Enter valid email first
    await accountInfoPage.enterResponsiblePartyEmail(testData.testEmails.valid);
    await accountInfoPage.getPhoneInput().click();

    // Verify no error is shown
    const errorMessage = accountInfoPage.verifyErrorMessageVisible(/email.*already.*exists|account.*email.*already/i);
    await expect(errorMessage).not.toBeVisible();

    // Now enter duplicate email
    const emailInputs = accountInfoPage.getEmailInputs();
    await emailInputs.nth(1).clear();
    await emailInputs.nth(1).fill(testData.testEmails.duplicate);

    // Trigger validation
    await accountInfoPage.getPhoneInput().click();

    // Verify error appears
    await expect(errorMessage).toBeVisible();
  });
});
