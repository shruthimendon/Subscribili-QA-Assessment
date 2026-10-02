const fs = require('fs');
const path = require('path');

const COUNTER_FILE = path.join(process.cwd(), '.email-counter');

// Read email counter from file
function getEmailCounter() {
  try {
    if (fs.existsSync(COUNTER_FILE)) {
      const content = fs.readFileSync(COUNTER_FILE, 'utf-8');
      const counter = parseInt(content.trim(), 10) || 0;
      console.log(`[EMAIL] Counter file exists, read value: ${counter}, file path: ${COUNTER_FILE}`);
      return counter;
    } else {
      console.log(`[EMAIL] Counter file does not exist at: ${COUNTER_FILE}`);
    }
  } catch (e) {
    console.log(`[EMAIL] Error reading counter: ${e.message}`);
  }
  return 0;
}

// Write email counter to file
function setEmailCounter(value) {
  try {
    fs.writeFileSync(COUNTER_FILE, value.toString(), 'utf-8');
  } catch (e) {
    // Ignore write errors
  }
}

// Initialize counter from file
let emailCounter = getEmailCounter();

// Generate unique email with persistent counter
function generateUniqueEmail(baseEmail, domain) {
  emailCounter++;
  setEmailCounter(emailCounter);
  const paddedCounter = String(emailCounter).padStart(3, '0');
  const email = `${baseEmail}${paddedCounter}@${domain}`;
  console.log(`[EMAIL] Generated email: ${email}, counter now: ${emailCounter}`);
  return email;
}

// Reset counter (useful for testing)
function resetEmailCounter() {
  emailCounter = 0;
  setEmailCounter(0);
  console.log(`[EMAIL] Counter reset to 0`);
}

// Get current counter value
function getCurrentCounter() {
  return emailCounter;
}

module.exports = {
  generateUniqueEmail,
  resetEmailCounter,
  getCurrentCounter,
  getEmailCounter,
  setEmailCounter
};
