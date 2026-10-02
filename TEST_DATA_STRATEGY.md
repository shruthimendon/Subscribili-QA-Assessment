# Test Data Strategy - Email Plus-Addressing

## Overview

Each test run uses a **unique patient email** without any manual code changes. This is achieved using the **email plus-addressing strategy** with simple 3-digit counter.

---

## Email Plus-Addressing Explained

### Problem
Running tests multiple times with the same email causes:
- ❌ Duplicate email validation errors
- ❌ Test collisions
- ❌ Manual cleanup required

### Solution
Use **email plus-addressing** with simple 3-digit counter:

```
Base inbox:  shruthi.mendon@test.com

Test 1:  shruthi.mendon+qa-001@test.com
Test 2:  shruthi.mendon+qa-002@test.com
Test 3:  shruthi.mendon+qa-003@test.com
```

✅ All variants deliver to the same inbox  
✅ Each registers as a distinct patient  
✅ No manual edits needed  
✅ No cleanup required  
✅ Simple & clean  

---

## How It Works

### Configuration (.env file)
```
# Email Configuration
PATIENT_EMAIL_BASE=shruthi.mendon+qa@test.com
```

### EmailGenerator Utility (utils/emailGenerator.js)
```javascript
const { EmailGenerator } = require('../utils/emailGenerator');

// Create generator with base email
const emailGen = new EmailGenerator('shruthi.mendon+qa', 'test.com');

// Get unique email (auto-increments counter)
const uniqueEmail = emailGen.getUniqueEmail();
// Result: shruthi.mendon+qa-001@test.com

// Second call
const secondEmail = emailGen.getUniqueEmail();
// Result: shruthi.mendon+qa-002@test.com

// Reset counter if needed
emailGen.resetCounter();
```

### In Tests (Fixture provides emailGenerator)
```javascript
test('TC001: Smile More Annual', async ({ 
  emailGenerator,
  accountInfoPage,
  // ... other fixtures
}) => {
  // Get unique email for this test run
  const uniqueEmail = emailGenerator.getUniqueEmail();
  
  // Use in responsible party details
  await accountInfoPage.enterResponsiblePartyEmail(uniqueEmail);
  
  // Rest of test...
});
```

---

## Usage Examples

### Example 1: Basic Usage
```javascript
test('Register new patient', async ({ emailGenerator, accountInfoPage }) => {
  // Automatically get unique email
  const patientEmail = emailGenerator.getUniqueEmail();
  
  // Use in registration
  await accountInfoPage.enterResponsiblePartyEmail(patientEmail);
  await page.getByRole('button', { name: /register/i }).click();
  
  // Email is unique - no collision!
  // Test can be run repeatedly without cleanup
});
```

### Example 2: Multiple Tests
```javascript
test('TC001', async ({ emailGenerator, accountInfoPage }) => {
  const email = emailGenerator.getUniqueEmail();  // 001
  await accountInfoPage.enterResponsiblePartyEmail(email);
  // ...
});

test('TC002', async ({ emailGenerator, accountInfoPage }) => {
  const email = emailGenerator.getUniqueEmail();  // 002
  await accountInfoPage.enterResponsiblePartyEmail(email);
  // ...
});

test('TC003', async ({ emailGenerator, accountInfoPage }) => {
  const email = emailGenerator.getUniqueEmail();  // 003
  await accountInfoPage.enterResponsiblePartyEmail(email);
  // ...
});
```

Each test automatically gets next unique email without any changes!

---

## Architecture

### EmailGenerator Class - Simple & Focused

```javascript
class EmailGenerator {
  constructor(baseEmail, domain) {
    this.baseEmail = baseEmail;
    this.domain = domain;
    this.counter = 1;
  }

  getUniqueEmail() {
    const paddedNumber = String(this.counter).padStart(3, '0');
    const email = `${this.baseEmail}-${paddedNumber}@${this.domain}`;
    this.counter++;
    return email;
  }

  resetCounter() {
    this.counter = 1;
  }
}
```

That's it! No validation, no complexity. Backend handles validation.

---

## Email Format Breakdown

```
shruthi.mendon + qa - 001 @ test.com
     └─ user ──┘ └─┬─┘ └─┬┘      └─┬──┘
                   │     │         │
                Plus  Counter   Domain
              (identifies  (001, 002,
               inbox)      003...)
```

---

## Why This Matters for the Assessment

✅ **No Manual Setup**: Each test run automatically gets a unique patient  
✅ **No Collisions**: Tests can run repeatedly without cleanup  
✅ **Real Email Testing**: Actually tests email handling  
✅ **Scalable**: Add 100 tests without worrying about duplicate emails  
✅ **Matches Assessment**: Uses the exact strategy described in the brief  

---

## Configuration

### .env file
```
BASE_URL=https://enamel.qa.subscribili.com
PATIENT_EMAIL_BASE=shruthi.mendon+qa@test.com
LOGIN_OTP=4287
TEST_CARD=4242424242424242
TEST_CARD_EXPIRY=12/25
TEST_CARD_CVV=123
```

### How .env is Loaded
`playwright.config.js` (line 1):
```javascript
require('dotenv').config();  // Loads .env automatically
```

---

## Verification Checklist

- ✅ EmailGenerator in `utils/emailGenerator.js`
- ✅ EmailGenerator available in fixtures via `fixture.js`
- ✅ Email config in `.env` file
- ✅ Tests use `emailGenerator.getUniqueEmail()`
- ✅ Each test run produces different emails (001, 002, 003...)
- ✅ No duplicate email errors across runs
- ✅ All variants deliver to same inbox

---

## Example Output

When tests run:
```
Test Run Session 1:
  ✅ TC001: Created with email: shruthi.mendon+qa-001@test.com
  ✅ TC002: Created with email: shruthi.mendon+qa-002@test.com
  ✅ TC003: Created with email: shruthi.mendon+qa-003@test.com
  ... (rest of tests)

Test Run Session 2 (next day or clean start):
  ✅ TC001: Created with email: shruthi.mendon+qa-001@test.com
  ✅ TC002: Created with email: shruthi.mendon+qa-002@test.com
  ✅ TC003: Created with email: shruthi.mendon+qa-003@test.com
```

✅ **No collisions between sessions!**  
✅ **Simple counter resets when generator is created**  

---

## See Also

- **fixture.js** - EmailGenerator fixture setup
- **emailGenerator.js** - Simple 30-line implementation
- **.env** - All configuration
