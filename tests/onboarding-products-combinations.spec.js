const { test, expect } = require('../utils/fixture');
const testData = require('../test-data/qa/testData.json');
const { generateUniqueEmail } = require('../utils/emailGenerator');

// Reusable helper functions for onboarding flow
async function navigateToLocationSelection(homePage) {
  await homePage.open();
  await homePage.verifyHomePageHeading(testData.uiText.homePageHeading);
  await homePage.startEnrollment();
}

async function selectLocation(locationPage) {
  await locationPage.searchFor(testData.locationName);
  await locationPage.selectFirstResult();
}

async function selectProductAndNavigateToCheckout(planPage, accountInfoPage, productName) {
  await planPage.choosePlan(productName);
}

async function fillSubscriberDetails(accountInfoPage, subscriberData) {
  await accountInfoPage.enterSubscriberFirstName(subscriberData.firstName);
  await accountInfoPage.enterSubscriberLastName(subscriberData.lastName);
  await accountInfoPage.enterSubscriberDOB(subscriberData.dob);
  await accountInfoPage.selectSubscriberGender(subscriberData.gender);
}

async function fillResponsiblePartyDetails(accountInfoPage, rpData) {
  await accountInfoPage.enterResponsiblePartyFirstName(rpData.firstName);
  await accountInfoPage.enterResponsiblePartyLastName(rpData.lastName);
  const rpFullName = `${rpData.firstName} ${rpData.lastName}`;
  // Try to fill full name if the field exists
  try {
    await accountInfoPage.enterResponsiblePartyFullName(rpFullName);
  } catch (e) {
    // Full name field might not exist for all plans
  }
  // Try to fill relationship if it exists on the form
  try {
    await accountInfoPage.selectResponsiblePartyRelationship(rpData.relationship);
  } catch (e) {
    // Relationship field might not exist for all plans
  }
  await accountInfoPage.enterResponsiblePartyDOB(rpData.dob);
  await accountInfoPage.enterResponsiblePartyEmail(rpData.email);
  await accountInfoPage.enterResponsiblePartyPhone(rpData.phone);
  await accountInfoPage.enterResponsiblePartyAddress(rpData.address);
  await accountInfoPage.enterResponsiblePartyCity(rpData.city);
  await accountInfoPage.enterResponsiblePartyState(rpData.state);
  await accountInfoPage.enterResponsiblePartyZipCode(rpData.zipCode);
}

async function fillPaymentDetails(paymentPage, cardData) {
  await paymentPage.enterCardNumber(cardData.cardNumber);
  await paymentPage.enterCardExpiration(cardData.expiration);
  await paymentPage.enterCardCVV(cardData.cvv);
  await paymentPage.selectHSAFSAOption('Yes');
}

async function fillBankDetails(paymentPage, bankData) {
  await paymentPage.enterBankFullName(bankData.accountHolderName);
  await paymentPage.enterBankAddressLine1(bankData.routingNumber);
  await paymentPage.enterBankCity(bankData.accountNumber);
  await paymentPage.enterSignatureName(bankData.accountHolderName);
}

async function addDependents(accountInfoPage, dependentsData) {
  for (let i = 0; i < dependentsData.length; i++) {
    await accountInfoPage.addDependent(i);
    const dependent = dependentsData[i];
    await accountInfoPage.enterDependentFirstName(dependent.firstName, i);
    await accountInfoPage.enterDependentLastName(dependent.lastName, i);
    await accountInfoPage.enterDependentDOB(dependent.dob, i);
    if (dependent.planName) {
      await accountInfoPage.selectDependentPlan(dependent.planName, i);
    }
    if (dependent.gender) {
      await accountInfoPage.selectDependentGender(dependent.gender, i);
    }
  }
}

// Data-driven test approach for all 6 product combinations
const productCombinations = [
  {
    testId: 'TC001',
    plan: testData.plans.find(p => p.name === 'Smile More'),
    billingType: 'annual',
    expectedPeriod: '12 months',
    subscriberFirstName: testData.subscriber.adultFirstName,
    subscriberLastName: testData.subscriber.adultLastName,
    subscriberDOB: testData.subscriber.adultDOB,
    subscriberGender: testData.subscriber.gender,
  },
  {
    testId: 'TC002',
    plan: testData.plans.find(p => p.name === 'Smile More'),
    billingType: 'monthly',
    expectedPeriod: '1 month',
    subscriberFirstName: testData.subscriber.adultFirstName,
    subscriberLastName: testData.subscriber.adultLastName,
    subscriberDOB: testData.subscriber.adultDOB,
    subscriberGender: testData.subscriber.gender,
  },
  {
    testId: 'TC003',
    plan: testData.plans.find(p => p.name === 'Child Smiles'),
    billingType: 'annual',
    expectedPeriod: '12 months',
    subscriberFirstName: testData.subscriber.childFirstName,
    subscriberLastName: testData.subscriber.childLastName,
    subscriberDOB: testData.subscriber.childDOB,
    subscriberGender: testData.subscriber.childGender,
  },
  {
    testId: 'TC004',
    plan: testData.plans.find(p => p.name === 'Child Smiles'),
    billingType: 'monthly',
    expectedPeriod: '1 month',
    subscriberFirstName: testData.subscriber.childFirstName,
    subscriberLastName: testData.subscriber.childLastName,
    subscriberDOB: testData.subscriber.childDOB,
    subscriberGender: testData.subscriber.childGender,
  },
  {
    testId: 'TC005',
    plan: testData.plans.find(p => p.name === 'Perio Protection'),
    billingType: 'annual',
    expectedPeriod: '12 months',
    subscriberFirstName: testData.subscriber.adultFirstName,
    subscriberLastName: testData.subscriber.adultLastName,
    subscriberDOB: testData.subscriber.adultDOB,
    subscriberGender: testData.subscriber.gender,
  },
  {
    testId: 'TC006',
    plan: testData.plans.find(p => p.name === 'Perio Protection'),
    billingType: 'monthly',
    expectedPeriod: '1 month',
    subscriberFirstName: testData.subscriber.adultFirstName,
    subscriberLastName: testData.subscriber.adultLastName,
    subscriberDOB: testData.subscriber.adultDOB,
    subscriberGender: testData.subscriber.gender,
  },
  {
    testId: 'TC007',
    plan: testData.plans.find(p => p.name === 'Child Smiles'),
    billingType: 'annual',
    expectedPeriod: '12 months',
    subscriberFirstName: testData.subscriber.childFirstName,
    subscriberLastName: testData.subscriber.childLastName,
    subscriberDOB: testData.subscriber.childDOB,
    subscriberGender: testData.subscriber.childGender,
    dependents: [
      {
        firstName: testData.dependents[0].firstName,
        lastName: testData.dependents[0].lastName,
        dob: testData.dependents[0].dob,
        planName: testData.dependents[0].planName,
        gender: testData.dependents[0].gender
      },
      {
        firstName: testData.dependents[1].firstName,
        lastName: testData.dependents[1].lastName,
        dob: testData.dependents[1].dob,
        planName: testData.dependents[1].planName,
        gender: testData.dependents[1].gender

      }
    ]
  },
];

// Data-driven tests using parametrization
productCombinations.forEach((combo, index) => {
  const expectedAmount = combo.billingType === 'annual'
    ? `$${combo.plan.annualPrice}`
    : `$${combo.plan.monthlyPrice}`;

  test(`${combo.testId}: Complete onboarding for ${combo.plan.name} - ${combo.billingType}`, async ({
    homePage,
    locationPage,
    planPage,
    accountInfoPage,
    paymentPage,
    confirmationPage,
  }) => {
    // Step 1: Navigate to location selection
    await navigateToLocationSelection(homePage);

    // Step 2: Select location
    await selectLocation(locationPage);

    // Step 4: Select product
    await selectProductAndNavigateToCheckout(planPage, accountInfoPage, combo.plan.name);

    // Step 4b: Set billing frequency
    await accountInfoPage.setBillingFrequency(combo.billingType);

    // Step 5: Fill subscriber details
    await fillSubscriberDetails(accountInfoPage, {
      firstName: combo.subscriberFirstName,
      lastName: combo.subscriberLastName,
      dob: combo.subscriberDOB,
      gender: combo.subscriberGender,
    });

    // Step 7: Fill responsible party details with unique email
    const uniqueEmail = generateUniqueEmail(testData.email.baseEmail, testData.email.domain);
    const rpDataWithUniqueEmail = { ...testData.responsibleParty, email: uniqueEmail };
    await fillResponsiblePartyDetails(accountInfoPage, rpDataWithUniqueEmail);

    // Step 8: Add dependents if defined
    if (combo.dependents && combo.dependents.length > 0) {
      await addDependents(accountInfoPage, combo.dependents);
    }

    // Step 9: Continue to payment
    await accountInfoPage.continueToPayment();
    await paymentPage.verifyPageLoaded();

    // Step 10: Fill payment details
    await fillPaymentDetails(paymentPage, testData.paymentCard);
    const rpFullName = `${testData.responsibleParty.firstName} ${testData.responsibleParty.lastName}`;
    await fillBankDetails(paymentPage, { ...testData.bankAccount, accountHolderName: rpFullName });

    // Step 11: Start subscription
    await paymentPage.startSubscription();

    // Step 13: Verify confirmation page
    await confirmationPage.verifyConfirmationPage();
    await confirmationPage.verifySubscriptionDetails({
      product: combo.plan.name,
      amount: expectedAmount,
      period: combo.expectedPeriod,
    });
  });
});
