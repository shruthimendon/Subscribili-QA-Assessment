class PlanPage {
  constructor(page) {
    this.page = page;
    this.planMap = {
      'Smile More': 0,
      'Child Smiles': 1,
      'Perio Protection': 2
    };
  }

  async choosePlan(planNameOrIndex) {
    // Wait for plan page to load
    await this.page.locator('input[name="subcategory"]').waitFor({ state: 'visible', timeout: 30000 });

    // Support both plan name string and index number
    let planIndex = planNameOrIndex;

    if (typeof planNameOrIndex === 'string') {
      planIndex = this.planMap[planNameOrIndex];
      if (planIndex === undefined) {
        throw new Error(`Unknown plan name: ${planNameOrIndex}`);
      }
    }

    const selectButton = this.page.getByTestId(`select-plan-${planIndex}`);
    await selectButton.waitFor({ state: 'visible', timeout: 15000 });
    await selectButton.click();
  }
}

module.exports = { PlanPage };