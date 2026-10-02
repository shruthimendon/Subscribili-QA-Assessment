# QA Assessment Memo: Subscribili Patient Portal

## Top 3 Biggest Risks to Watch

### 1. Payments Don't Go Through (CRITICAL)
**What breaks:** If card charges fail and nobody notices, subscriptions don't start and people stop paying. That's lost money.

When I tested it: Payments work fine in the happy path (TC001-TC006, TC009). But I didn't test what happens if a card gets declined, the network drops, or payment times out. Need to add tests for those failures.

### 2. Wrong Amount Gets Charged (CRITICAL)
**What breaks:** Charge someone $500 instead of $50, they get angry and leave. Charge them $50 instead of $500, the company loses money.

When I tested it: I found a bug where monthly billing shows "Annual Billed Monthly" on the screen, which confuses people. The code might be calculating correctly, but the display is wrong. Need to verify actual amounts charged match what's displayed.

### 3. Patient Gets Wrong Plan Benefits (HIGH)
**What breaks:** Patient pays for "Smile More" plan but system shows they have "Child Smiles" benefits. They go to the dentist and get denied coverage. Legal mess.

When I tested it: The dependent selection works, but the form fields change names based on how many dependents already exist. The "Add Dependent" button always says "Dependent 1" even if it's the third dependent being added. Could cause confusion.

---

## What I Didn't Test (And Why It's OK)

**Admin dashboard for practices, the marketing website, other dental offices** — These aren't my responsibility. I focused on the patient app. That's where the money and risk actually are.

**Load testing (how many people can use it at once)** — Can't do that in the shared QA environment in 24 hours.

**Stripe integration deep dive, bank connections** — I trust those third-party systems work. I tested that we can send data to Stripe; I didn't test Stripe itself.


---

## Things That Confuse Me (Should Ask Product)

1. What happens if someone's card gets declined when renewing? Does the subscription pause, cancel, or keep trying?
2. Can someone change from expensive plan to cheap plan mid-month? How do we calculate refunds?
3. How many dependents can someone add? The app lets them add unlimited. Is that intentional?
4. When is "Full Name" required? It's required for some plans but not others. Rule?
5. Do we need a billing address? Or is it optional?

---

## What Should Be Automated vs Manual vs Just Watched

**Automate (already done - TC001 through TC009):**
- Basic signup flows for all 3 plans, both annual and monthly
- Adding dependents after login
- Changing payment method
- Making sure each signup gets a unique email

**Test manually when you have time:**
- Pressing back button on browser mid-payment (what happens?)
- Refreshing the page during payment
- What error messages show when something goes wrong
- Making sure kids-only plans actually reject adult users
- Age restrictions work correctly

**Just watch in production (monitoring/alerts):**
- How many payments succeed vs fail each day
- Any duplicate patient accounts being created
- Billing amount mismatches (is $500 being charged when plan says $50?)
- Customer complaints about being charged wrong amounts

---

