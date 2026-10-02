# Subscribili QA Test Cases

**Total Test Cases:** 10  
**Status:** All Automated  
**Coverage:** Onboarding + Post-Login  

---

## Test Cases Summary

| TC ID | Feature | Scenario | Type | Priority | Status |
|-------|---------|----------|------|----------|--------|
| TC001 | Onboarding | Smile More (Annual) | Happy Path | High | ✅ Automated |
| TC002 | Onboarding | Smile More (Monthly) | Happy Path | High | ✅ Automated |
| TC003 | Onboarding | Child Smiles (Annual) | Happy Path | High | ✅ Automated |
| TC004 | Onboarding | Child Smiles (Monthly) | Happy Path | High | ✅ Automated |
| TC005 | Onboarding | Perio Protection (Annual) | Happy Path | High | ✅ Automated |
| TC006 | Onboarding | Perio Protection (Monthly) | Happy Path | High | ✅ Automated |
| TC007 | Onboarding | Multiple Dependents | Happy Path | Medium | ✅ Automated |
| TC008 | Dashboard | Add Dependent (Post-Login) | Happy Path | Medium | ✅ Automated |
| TC009 | Dashboard | Update Payment Details | Happy Path | Medium | ✅ Automated |
| TC019 | Dashboard | Download Packet Files | Happy Path | Low | ✅ Automated |

---

## TC001: Onboarding - Smile More (Annual)

**Feature:** Patient Onboarding  
**Priority:** HIGH - Core business flow  
**Reason:** Recurring payment + plan activation is revenue-critical  

### Preconditions
- Application accessible at https://enamel.qa.subscribili.com/
- Lantana Place location available
- Test card valid (4242 4242 4242 4242)

### Steps
1. Open home page
2. Click "Get Started" button
3. Search location: "Lantana Place"
4. Select first office result
5. Choose "Smile More" plan
6. Enter subscriber name (John Doe), DOB (15/01/1990), Gender (Male)
7. Enter responsible party (Jane Doe, Parent)
8. Keep billing as Annual (default)
9. Add dependent (James Dependent01, 01/01/1990, Smile More, Male)
10. Enter payment: Card 4242..., Expiration 12/30, CVV 123
11. Enter billing address and signature
12. Submit payment

### Expected Result
✅ Subscription created successfully
- Annual amount ($299.00) charged
- Confirmation page displayed
- Subscriber + 1 dependent enrolled
- Payment processed

---

## TC002: Onboarding - Smile More (Monthly)

**Feature:** Patient Onboarding with Monthly Billing  
**Priority:** HIGH  
**Reason:** Billing frequency variation; catches calculation errors  

### Preconditions
- Same as TC001

### Steps
- Same as TC001 except:
  - Step 8: Toggle billing to Monthly (uncheck Annual)
  - Step 12: Verify monthly amount ($49.99) displayed

### Expected Result
✅ Subscription with monthly billing
- Monthly amount ($49.99) charged
- Billing cycle set to monthly
- All other details same as TC001

---

## TC003: Onboarding - Child Smiles (Annual)

**Feature:** Child Plan Onboarding  
**Priority:** HIGH  
**Reason:** Age-restricted plans; healthcare entitlements critical  

### Steps
1-4: Same as TC001
5. Choose "Child Smiles" plan
6. Enter subscriber name (Emily Johnson), DOB (20/08/2020), Gender (Female)
7-12: Same as TC001

### Expected Result
✅ Child plan subscription
- Annual amount ($170.00)
- Child subscriber enrolled
- Plan restrictions verified

---

## TC004: Onboarding - Child Smiles (Monthly)

**Feature:** Child Plan with Monthly Billing  
**Priority:** HIGH  

### Expected Result
✅ Monthly child subscription ($29.99/month)

---

## TC005: Onboarding - Perio Protection (Annual)

**Feature:** Premium Plan Onboarding  
**Priority:** HIGH  
**Reason:** Highest revenue plan; plan-specific validation  

### Steps
1-4: Same as TC001
5. Choose "Perio Protection" plan
6. Enter subscriber (John Doe), DOB (15/01/1990), Gender (Male)
7-12: Same as TC001

### Expected Result
✅ Premium plan subscription ($499.00 annual)

---

## TC006: Onboarding - Perio Protection (Monthly)

**Feature:** Premium Plan Monthly Billing  
**Priority:** HIGH  

### Expected Result
✅ Monthly premium subscription ($59.99/month)

---

## TC007: Onboarding - Multiple Dependents

**Feature:** Multi-Dependent Enrollment  
**Priority:** MEDIUM  
**Reason:** Complex enrollment; tests dependent addition flow  

### Steps
1-7: Same as TC001
8. Add Dependent 1 (James Dependent01, 01/01/1990, Smile More, Male)
9. Add Dependent 2 (Sarah Dependent02, 02/02/2023, Child Smiles, Female)
10-12: Complete payment

### Expected Result
✅ Subscription with 3 members
- 1 subscriber (John Doe)
- 2 dependents (James, Sarah)
- Mixed plans (Smile More + Child Smiles)
- All members enrolled

---

## TC008: Post-Login - Add Dependent

**Feature:** Dashboard - Add Dependent  
**Priority:** MEDIUM  
**Reason:** Member expansion; tests post-login flows  

### Preconditions
- Subscription exists (from TC001-TC007)
- Know login email
- OTP: 4287

### Steps
1. Open home page
2. Click "Login"
3. Enter email (from onboarding)
4. Enter OTP (4287)
5. Verify dashboard loads
6. Click "Add Member"
7. Enter dependent details (James Dependent01, 01/01/1990, Smile More, Male)
8. Continue to payment
9. Enter signature and submit

### Expected Result
✅ New dependent added
- Appears in dashboard
- Success confirmation shown
- Payment processed

---

## TC009: Post-Login - Update Payment

**Feature:** Dashboard - Update Payment Method  
**Priority:** MEDIUM  
**Reason:** Payment change affects all future charges  

### Preconditions
- Active subscription

### Steps
1-5: Login (same as TC008)
6. Click "Update Payment Details"
7. Enter new card (4242...)
8. Enter billing address
9. Submit

### Expected Result
✅ Payment method updated
- New card saved
- Next charge uses new payment method

---

## TC019: Post-Login - Download Files

**Feature:** Dashboard - Download Documents  
**Priority:** LOW  
**Reason:** Non-critical feature; document distribution  

### Steps
1-5: Login (same as TC008)
6. Click "Download Packet" button
7. Select "Benefits Packet" → verify download
8. Re-open dropdown
9. Select "HSA & FSA Report" → verify download

### Expected Result
✅ Both files download
- Benefits Packet file received
- HSA & FSA Report file received
- No errors during download

---

## Automation Notes

### Test Execution
```bash
npm test                    # Run all 10 tests
npx playwright test -g "TC001"  # Single test
npm test -- --headed       # See browser
```

### Key Implementation Details
- **Email Generation:** Persistent counter (shruthi.mendon+qa010@test.com)
- **Dynamic Indices:** Dependent form fields use detected index
- **Stripe Iframes:** Accessed via contentFrame() with iteration
- **Zero Hardcoding:** All data from testData.json
- **Page Objects:** HomePage, LocationPage, PlanPage, AccountInfoPage, PaymentPage, DashboardPage, LoginPage

### Known Issues
- Modal header shows "Dependent 1" regardless of index (Bug 1)
- Monthly billing displays "Annual Billed Monthly" (Bug 5)
- See bug.md for full details

---

**Test Cases Complete**
