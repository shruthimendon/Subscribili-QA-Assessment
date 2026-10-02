# Bugs Found During QA Testing

## Bug 1: Add Dependent Modal Header Always Shows "Dependent 1"

**Severity:** Medium  
**Status:** Reported  
**Test Case:** TC008 (Post-login - Add dependent)

**Description:**
When adding a dependent through the post-login "Add Dependent" modal, the modal header always displays "Dependent 1" regardless of which dependent is actually being added. If a user already has 1 or more dependents and adds a new one, the header should dynamically show "Dependent 2", "Dependent 3", etc., to match the actual dependent index being added.

**Expected Behavior:**
- First dependent added: Modal shows "Dependent 1"
- Second dependent added: Modal shows "Dependent 2"
- Third dependent added: Modal shows "Dependent 3"
- And so on...

**Actual Behavior:**
Modal always shows "Dependent 1" header regardless of dependent count or index.

**Steps to Reproduce:**
1. Login to an account that already has 1+ dependents
2. Click "Add Dependent" button
3. Observe the modal header

**Impact:**
Minor UI/UX issue. Does not affect functionality, only display of dependent number in header.

**Date Discovered:** 2026-10-03  
**Discovered During:** TC008 automation testing

---

## Bug 2: Phone Number Validation Missing Country Code Prefix

**Severity:** High  
**Status:** Reported  
**Test Case:** Payment Details (TC001-TC009)

**Description:**
In the Payment Details phone number field, even when the country is selected as US (+1), if the user enters a phone number without the country code prefix, an error is displayed. The default value shows "(201) 555-0123" format, but the system requires "+1" prefix to be entered by the user. This creates confusion as the default value doesn't include the prefix but the validation requires it.

**Expected Behavior:**
- Accept phone numbers with country code prefix (e.g., +15678906789)
- Accept phone numbers in default format without prefix and auto-prepend country code
- Or clearly indicate that country code prefix is required

**Actual Behavior:**
Error displayed when phone number entered without +1 prefix, even though country US is selected.

**Date Discovered:** 2026-10-03

---

## Bug 3: Email Field Not Marked as Mandatory for US Bank Account

**Severity:** Medium  
**Status:** Reported  
**Test Case:** Payment --> US Bank Account (TC001-TC009)

**Description:**
When selecting US bank account as payment method, the Email field is not marked as mandatory in the form. Users may not understand that email is required, leading to submission errors or incomplete entries.

**Expected Behavior:**
Email field should be marked with asterisk (*) or "Required" indicator for clarity.

**Actual Behavior:**
Email field appears optional but is actually required for US bank account payments.

**Date Discovered:** 2026-10-03

---

## Bug 4: No Way to Re-add Payment Link After Removal

**Severity:** High  
**Status:** Reported  
**Test Case:** Payment Details - Subscription Creation

**Description:**
When creating a new subscription and navigating to the Payment section, if an existing payment link is shown and the user removes it, there is no way to add it back. This creates a dead end where users cannot proceed without recreating the entire subscription.

**Expected Behavior:**
- Provide an "Add Payment Link" button or similar option to re-add payment method
- Allow users to restore or undo the removal
- Prevent removal without confirmation

**Actual Behavior:**
Once payment link is removed, user cannot add it back within the same subscription creation flow.

**Date Discovered:** 2026-10-03

---

## Bug 5: Billing Frequency Display Incorrect for Monthly Billing

**Severity:** Medium  
**Status:** Reported  
**Test Case:** TC002, TC004, TC006 (Monthly Billing Cycles)

**Description:**
When billing cycle is selected as "Monthly", the Checkout Summary page displays "Annual Billed Monthly" which is incorrect and confusing. It should display "Monthly" or clarify the actual billing frequency.

**Expected Behavior:**
Checkout Summary should display:
- "Annual Billed Annually" when Annual is selected
- "Monthly" when Monthly is selected
- Or similar clear billing frequency labels

**Actual Behavior:**
Displays "Annual Billed Monthly" for monthly billing cycles, which is contradictory and misleading.

**Date Discovered:** 2026-10-03  
**Affected Test Cases:** TC002, TC004, TC006

---

## Bug 6: No Maximum Limit on Number of Dependents

**Severity:** Medium  
**Status:** Reported  
**Test Case:** TC007, TC008 (Add Dependent)

**Description:**
Users are able to add unlimited dependents to a subscription without any maximum limit. This could lead to unrealistic data entry and potential system performance issues. There should be a defined maximum number of dependents allowed per subscription.

**Expected Behavior:**
- Implement a maximum dependent limit (e.g., 5, 10, or based on business logic)
- Display error message when limit is reached
- Disable "Add Dependent" button when maximum is reached

**Actual Behavior:**
No limit on adding dependents; users can add as many as they want.

**Date Discovered:** 2026-10-03  
**Discovered During:** TC007, TC008 automation testing
