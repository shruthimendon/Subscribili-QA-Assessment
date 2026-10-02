# Subscribili QA Assessment - Test Suite
Playwright automation suite for the Subscribili patient portal
## Quick Start

### Prerequisites
- Node.js 16+ 
- npm 
- Git

### Installation

```bash
# Clone repository
git clone <your-repo>
cd SubscribiliQAAssessment

# Install dependencies
npm install

# Install Playwright browsers
npx playwright install
```

### Clean Test Output (Before Running Tests)

```bash
# Delete old test results and report folders
rm -rf test-results playwright-report

```

**Recommended workflow:**
```bash
# 1. Clean old output
rm -rf test-results playwright-report

# 2. Run tests
npm test

# 3. View fresh report
npx playwright show-report
```

### Running Tests

```bash
# Run all tests
npm test

# Run specific test file
npx playwright test tests/onboarding-products-combinations.spec.js

# Run with headed browser (see browser UI)
npx playwright test --headed

# View HTML report (after tests complete)
npx playwright show-report
```

### Project Structure

```
SubscribiliQAAssessment/
├── playwright.config.js              # Playwright configuration
├── .env.example                      # Environment template (copy to .env)
├── package.json                      # Dependencies
├── test-data/
│   └── qa/
│       └── testData.json             # All test data (NO hardcoding)
├── pages/                            # Page Object Model classes
│   ├── HomePage.js
│   ├── LocationPage.js
│   ├── PlanPage.js
│   ├── AccountInfoPage.js
│   ├── PaymentPage.js
│   ├── DashboardPage.js
│   ├── LoginPage.js
│   └── ConfirmationPage.js
├── utils/
│   └── fixture.js                    # Fixture setup with page objects
├── tests/
│   ├── onboarding-products-combinations.spec.js  # TC001-TC007
│   └── post-login-operations.spec.js             # TC008-TC009, TC019
├── TestCases.md                      # 10 test cases (detailed)
├── bug.md                            # 6 bugs found
├── memo.md                           # 1-page strategic memo
└── README.md                         # This file
```

---

## Key Features

### Zero Hardcoding Strategy
- ✅ All test data from `test-data/qa/testData.json`
- ✅ All locators in Page Object classes (never in spec files)
- ✅ All methods reused across tests
- ✅ Dynamic email generation with persistent counter

### Email Generation (Unique per Run)
Generates: shruthi.mendon+qa010@test.com, +011, +012, etc.
Enables login tests to use same email from creation flow

### Page Object Model (POM)
- HomePage - Home page navigation
- LocationPage - Location search and selection
- PlanPage - Plan selection
- AccountInfoPage - Subscriber, responsible party, dependent details
- PaymentPage - Stripe iframe handling, payment processing
- DashboardPage - Post-login operations (add dependent, update payment)
- LoginPage - Login flow with OTP
- ConfirmationPage - Success validation

### Fixture-Based Dependency Injection
Page objects auto-instantiated and injected into tests

### Dynamic Dependent Indexing
Automatically detects existing dependents and assigns correct form field indices

### Stripe Iframe Handling
Accesses card/bank fields inside Stripe iframes with auto-scroll

---

## Test Coverage

### Onboarding (TC001–TC007)
- **TC001-006:** 6 combinations (3 plans × 2 billing types)
  - Smile More, Child Smiles, Perio Protection
  - Annual and Monthly billing cycles
- **TC007:** Multiple dependents (2 dependents in single onboarding)

### Post-Login (TC008–TC009, TC019)
- **TC008:** Add dependent after login
- **TC009:** Update payment details from dashboard


### Test Data Used
- **Location:** Lantana Place
- **Plans:** Smile More ($299 annual), Child Smiles ($170 annual), Perio Protection ($499 annual)
- **Test Card:** 4242 4242 4242 4242 (test mode)
- **OTP:** 4287 (static in QA)

---

## Assumptions & Questions

### Assumptions Made
1. Monthly billing is optional - default is annual
2. Full Name field is sometimes optional
3. Responsible Party Relationship is plan-dependent
4. Email +aliasing works per assessment spec
5. Dependent count is dynamic
6. Payment link removal is permanent once deleted
7. Modal "Dependent N" header is UI-only

### Questions I Would Ask (if I could)
1. **Billing address validation** - Is it required for card payments, or truly optional?
2. **Dependent maximum limit** - Should there be a cap (e.g., 10 max)? Currently unlimited.
3. **Email field for bank account** - Should it be marked as mandatory in the form UI?
4. **Phone number +1 prefix** - Should US country selection auto-prepend +1, or is validation wrong?
5. **Responsible Party relationship** - When is this field required vs optional across different plans?
6. **Payment decline handling** - What happens on mid-renewal payment failure? (pause, cancel, retry?)
7. **Mid-cycle plan changes** - Can patients upgrade/downgrade mid-month? How is proration calculated?
8. **Browser back-button** - Should it be allowed mid-flow, or should state prevent it?
9. **Grace period on failure** - What's the retry/grace period if payment declines?
10. **Unlimited dependents** - Is there intentionally no maximum, or is Bug 6 a missing feature?

---

## What I'd Do Next (2 More Days)

### Day 1: Error Scenarios & Coverage
- Declined card error handling
- Duplicate email signup rejection
- Invalid field validation (DOB, phone, address)
- Missing mandatory field messages

### Day 2: Extended Post-Login
- Cancel subscription state transitions
- Plan upgrade/downgrade with proration
- Benefit visibility per plan
- Dependent removal cascade

---

## What I Left Out (and Why)

### Not Tested
- Practice admin console (out of scope)
- Public marketing site (out of scope)
- Other locations (Lantana Place only)
- Stress/load testing (impractical in shared QA)
- Visual regression (low risk)
- Network timeout simulation (chaos testing)

---



### Test Data
All in testData.json - plans, subscriber, responsible party, payment methods

---

## Tools & Methods Used

### Code Generation Tool (Claude)
This test framework was built with assistance from a code generation tool for:

**Tool-Assisted Work:**
1. **Page Object Model structure** - Initial POM class scaffolding and method signatures
2. **Stripe iframe handling** - Logic for accessing nested iframe elements and form fields
3. **Email counter persistence** - File-based counter implementation for unique test emails
4. **Dynamic dependent indexing** - Algorithm to detect and count existing dependents
5. **Test documentation** - Formatting and structure for test case documentation
6. **Fixture setup** - Playwright fixture configuration with dependency injection
7. **Code organization** - Project structure and utility extraction
8. **CodeGen** - to find the locators

**What I Verified/Corrected:**
1. **Locator specificity** - Upgraded generic selectors to strict-mode compliant ones
2. **Billing toggle logic** - Corrected to only uncheck for monthly (not toggle both ways)
3. **DOB field selectors** - Split into .first() and .last() for different form sections
4. **Optional field handling** - Added try-catch for fields that don't exist in all plans
5. **Form field IDs** - Verified actual testIds against inspector, not guesses
6. **Email generation** - Enhanced with proper counter persistence and padding

**What Was Manual Work:**
- Test logic and assertions
- Determining which tests to automate
- Identifying bugs and product issues
- Architectural decisions about test coverage
- Writing the memo and strategic analysis

---

## Resources

- **Test Details:** TestCases.md
- **Bug Reports:** bug.md
- **Strategy:** memo.md

---

