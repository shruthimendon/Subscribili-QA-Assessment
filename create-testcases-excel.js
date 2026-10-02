const XLSX = require('xlsx');
const path = require('path');

const testCases = [
  {
    'TC ID': 'TC001',
    'Test Case Name': 'Onboarding - Smile More (Annual)',
    'Feature': 'Onboarding',
    'Description': 'Complete enrollment for Smile More plan with annual billing',
    'Steps': '1. Open home page\n2. Click "Get Started" button\n3. Search and select Lantana Place location\n4. Click select office button\n5. Choose "Smile More" plan\n6. Enter subscriber name (John Doe) and DOB (15/01/1990)\n7. Select Gender (Male)\n8. Enter responsible party details (Jane Doe, Parent)\n9. Keep billing as Annual (default)\n10. Add dependent 1: James Dependent01, DOB 01/01/1990, Plan: Smile More\n11. Enter payment card details (4242424242424242, 12/30, 123)\n12. Enter billing address and signature\n13. Submit payment\n14. Verify success page',
    'Expected Result': 'Subscription created successfully for Smile More plan with annual billing. Confirmation page displayed.',
    'Status': 'Automated',
    'Priority': 'P0',
    'Type': 'Functional'
  },
  {
    'TC ID': 'TC002',
    'Test Case Name': 'Onboarding - Smile More (Monthly)',
    'Feature': 'Onboarding',
    'Description': 'Complete enrollment for Smile More plan with monthly billing',
    'Steps': '1. Open home page\n2. Click "Get Started" button\n3. Search and select Lantana Place location\n4. Click select office button\n5. Choose "Smile More" plan\n6. Enter subscriber name (John Doe) and DOB (15/01/1990)\n7. Select Gender (Male)\n8. Enter responsible party details (Jane Doe, Parent)\n9. Toggle billing to Monthly\n10. Add dependent 1: James Dependent01, DOB 01/01/1990, Plan: Smile More\n11. Enter payment card details\n12. Enter billing address and signature\n13. Submit payment\n14. Verify success page with monthly billing',
    'Expected Result': 'Subscription created with monthly billing cycle. Monthly amount displayed correctly.',
    'Status': 'Automated',
    'Priority': 'P0',
    'Type': 'Functional'
  },
  {
    'TC ID': 'TC003',
    'Test Case Name': 'Onboarding - Child Smiles (Annual)',
    'Feature': 'Onboarding',
    'Description': 'Complete enrollment for Child Smiles plan with annual billing',
    'Steps': '1. Open home page\n2. Click "Get Started" button\n3. Search and select Lantana Place location\n4. Click select office button\n5. Choose "Child Smiles" plan\n6. Enter subscriber name (Emily Johnson) and DOB (20/08/2020)\n7. Select Gender (Female)\n8. Enter responsible party details (Jane Doe, Parent)\n9. Keep billing as Annual (default)\n10. Add dependent 1: Sarah Dependent02, DOB 02/02/2023, Plan: Child Smiles\n11. Enter payment card details\n12. Enter billing address and signature\n13. Submit payment\n14. Verify success page',
    'Expected Result': 'Subscription created for Child Smiles plan with annual billing. Annual amount $170.00 displayed.',
    'Status': 'Automated',
    'Priority': 'P0',
    'Type': 'Functional'
  },
  {
    'TC ID': 'TC004',
    'Test Case Name': 'Onboarding - Child Smiles (Monthly)',
    'Feature': 'Onboarding',
    'Description': 'Complete enrollment for Child Smiles plan with monthly billing',
    'Steps': '1. Open home page\n2. Click "Get Started" button\n3. Search and select Lantana Place location\n4. Click select office button\n5. Choose "Child Smiles" plan\n6. Enter subscriber name (Emily Johnson) and DOB (20/08/2020)\n7. Select Gender (Female)\n8. Enter responsible party details (Jane Doe, Parent)\n9. Toggle billing to Monthly\n10. Add dependent 1: Sarah Dependent02, DOB 02/02/2023, Plan: Child Smiles\n11. Enter payment card details\n12. Enter billing address and signature\n13. Submit payment\n14. Verify success page with monthly billing',
    'Expected Result': 'Subscription created with monthly billing. Monthly amount $29.99 displayed.',
    'Status': 'Automated',
    'Priority': 'P0',
    'Type': 'Functional'
  },
  {
    'TC ID': 'TC005',
    'Test Case Name': 'Onboarding - Perio Protection (Annual)',
    'Feature': 'Onboarding',
    'Description': 'Complete enrollment for Perio Protection plan with annual billing',
    'Steps': '1. Open home page\n2. Click "Get Started" button\n3. Search and select Lantana Place location\n4. Click select office button\n5. Choose "Perio Protection" plan\n6. Enter subscriber name (John Doe) and DOB (15/01/1990)\n7. Select Gender (Male)\n8. Enter responsible party details (Jane Doe, Parent)\n9. Keep billing as Annual (default)\n10. Add dependent 1: James Dependent01, DOB 01/01/1990, Plan: Smile More\n11. Enter payment card details\n12. Enter billing address and signature\n13. Submit payment\n14. Verify success page',
    'Expected Result': 'Subscription created for Perio Protection plan with annual billing. Annual amount $499.00 displayed.',
    'Status': 'Automated',
    'Priority': 'P0',
    'Type': 'Functional'
  },
  {
    'TC ID': 'TC006',
    'Test Case Name': 'Onboarding - Perio Protection (Monthly)',
    'Feature': 'Onboarding',
    'Description': 'Complete enrollment for Perio Protection plan with monthly billing',
    'Steps': '1. Open home page\n2. Click "Get Started" button\n3. Search and select Lantana Place location\n4. Click select office button\n5. Choose "Perio Protection" plan\n6. Enter subscriber name (John Doe) and DOB (15/01/1990)\n7. Select Gender (Male)\n8. Enter responsible party details (Jane Doe, Parent)\n9. Toggle billing to Monthly\n10. Add dependent 1: James Dependent01, DOB 01/01/1990, Plan: Smile More\n11. Enter payment card details\n12. Enter billing address and signature\n13. Submit payment\n14. Verify success page with monthly billing',
    'Expected Result': 'Subscription created with monthly billing. Monthly amount $59.99 displayed.',
    'Status': 'Automated',
    'Priority': 'P0',
    'Type': 'Functional'
  },
  {
    'TC ID': 'TC007',
    'Test Case Name': 'Onboarding - Multiple Dependents',
    'Feature': 'Onboarding',
    'Description': 'Complete enrollment with 2 dependents to verify dependent addition flow',
    'Steps': '1. Open home page\n2. Click "Get Started" button\n3. Search and select Lantana Place location\n4. Click select office button\n5. Choose "Smile More" plan\n6. Enter subscriber name (John Doe) and DOB (15/01/1990)\n7. Select Gender (Male)\n8. Enter responsible party details (Jane Doe, Parent)\n9. Keep billing as Annual (default)\n10. Add dependent 1: James Dependent01, DOB 01/01/1990, Plan: Smile More, Gender: Male\n11. Add dependent 2: Sarah Dependent02, DOB 02/02/2023, Plan: Child Smiles, Gender: Female\n12. Enter payment card details\n13. Enter billing address and signature\n14. Submit payment\n15. Verify success page with all 3 members (subscriber + 2 dependents)',
    'Expected Result': 'Subscription created successfully with 2 dependents added. All members visible in subscription details.',
    'Status': 'Automated',
    'Priority': 'P1',
    'Type': 'Functional'
  },
  {
    'TC ID': 'TC008',
    'Test Case Name': 'Post-Login - Add Dependent',
    'Feature': 'Dashboard',
    'Description': 'Add a new dependent to existing subscription after login',
    'Steps': '1. Open home page\n2. Click "Login" button\n3. Enter email from TC001-TC007 registration\n4. Click "Sign In"\n5. Enter OTP (4287)\n6. Click "Sign In"\n7. Verify dashboard loads successfully\n8. Click "Add Member" button\n9. Enter dependent first name (James)\n10. Enter dependent last name (Dependent01)\n11. Select plan type (Smile More)\n12. Enter DOB (01/01/1990)\n13. Select gender (Male)\n14. Click continue\n15. Enter signature name (Jane Doe)\n16. Submit payment\n17. Verify dependent added message',
    'Expected Result': 'New dependent successfully added to subscription. Confirmation message displayed. Dependent appears in dashboard.',
    'Status': 'Automated',
    'Priority': 'P1',
    'Type': 'Functional'
  },
  {
    'TC ID': 'TC009',
    'Test Case Name': 'Post-Login - Update Payment Details',
    'Feature': 'Dashboard',
    'Description': 'Update payment card and billing details from dashboard',
    'Steps': '1. Open home page\n2. Click "Login" button\n3. Enter email from TC001-TC007 registration\n4. Click "Sign In"\n5. Enter OTP (4287)\n6. Click "Sign In"\n7. Verify dashboard loads successfully\n8. Click "Update Payment Details" button\n9. Enter new card number (4242424242424242)\n10. Enter expiration (12/30)\n11. Enter CVV (123)\n12. Enter full name (Jane Doe)\n13. Enter billing address (123 Main Street, Apt 2B)\n14. Enter city (New York)\n15. Click update button\n16. Verify payment updated successfully',
    'Expected Result': 'Payment details updated successfully. New card details saved. Confirmation message displayed.',
    'Status': 'Automated',
    'Priority': 'P1',
    'Type': 'Functional'
  },
  {
    'TC ID': 'TC019',
    'Test Case Name': 'Post-Login - Download Packet Files',
    'Feature': 'Dashboard',
    'Description': 'Download Benefits Packet and HSA & FSA Report files from dashboard',
    'Steps': '1. Open home page\n2. Click "Login" button\n3. Enter email from TC001-TC007 registration\n4. Click "Sign In"\n5. Enter OTP (4287)\n6. Click "Sign In"\n7. Verify dashboard loads successfully\n8. Locate "Download Packet" button in dashboard\n9. Click "Download Packet" dropdown button\n10. Verify dropdown menu appears with options:\n    - Benefits Packet\n    - HSA & FSA Report\n11. Click "Benefits Packet" option\n12. Wait for file download to complete\n13. Verify file downloads with correct filename\n14. Click "Download Packet" dropdown again\n15. Click "HSA & FSA Report" option\n16. Wait for file download to complete\n17. Verify file downloads with correct filename',
    'Expected Result': 'Both Benefits Packet and HSA & FSA Report files download successfully. Files have correct names. No errors during download process.',
    'Status': 'Automated',
    'Priority': 'P2',
    'Type': 'Functional'
  }
];

// Create a new workbook
const workbook = XLSX.utils.book_new();
const worksheet = XLSX.utils.json_to_sheet(testCases);

// Set column widths
const columnWidths = [
  { wch: 8 },   // TC ID
  { wch: 40 },  // Test Case Name
  { wch: 15 },  // Feature
  { wch: 50 },  // Description
  { wch: 100 }, // Steps
  { wch: 60 },  // Expected Result
  { wch: 12 },  // Status
  { wch: 8 },   // Priority
  { wch: 12 }   // Type
];

worksheet['!cols'] = columnWidths;

// Add worksheet to workbook
XLSX.utils.book_append_sheet(workbook, worksheet, 'Test Cases');

// Write the file
const outputPath = path.join(process.env.USERPROFILE, 'Downloads', 'TestCases_Complete.xlsx');
XLSX.writeFile(workbook, outputPath);

console.log('✅ TestCases_Complete.xlsx created successfully');
console.log('📁 Location:', outputPath);
console.log('📊 Total test cases:', testCases.length);
console.log('\nTest Cases:');
testCases.forEach(tc => {
  console.log(`  - ${tc['TC ID']}: ${tc['Test Case Name']}`);
});
