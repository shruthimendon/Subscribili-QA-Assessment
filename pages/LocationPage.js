class LocationPage {
  constructor(page) {
    this.page = page;
  }

  async selectOffice(index = 0) {
    const selectButton = this.page.getByTestId(`select-office-button-${index}`);
    await selectButton.waitFor({ state: 'visible', timeout: 15000 });
    await selectButton.click();
  }

  async searchFor(locationName) {
    const locationInput = this.page.getByTestId('filter-search-location-name');
    await locationInput.click();
    await locationInput.fill(locationName);
    // Wait for the first select button to appear after search
    const selectButton = this.page.getByTestId('select-office-button-0');
    await selectButton.waitFor({ state: 'visible', timeout: 15000 });
  }

  async selectFirstResult() {
    await this.selectOffice(0);
  }
}

module.exports = { LocationPage };