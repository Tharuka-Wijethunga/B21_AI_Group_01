import { When, Then } from '@cucumber/cucumber'
import { expect } from '@playwright/test'
import { PlaywrightWorld } from '../../hooks/world'
import { SalesPage } from '../../pages/SalesPage'
import testdata from '../../fixtures/testdata.json'

When('I navigate to the sales page', async function (this: PlaywrightWorld) {
  const salesPage = new SalesPage(this.page)
  await salesPage.navigate()
})

Then('the sales page should load successfully', async function (this: PlaywrightWorld) {
  const salesPage = new SalesPage(this.page)
  await salesPage.expectPageLoaded()
})

Then('the sales records table should display correctly', async function (this: PlaywrightWorld) {
  const salesPage = new SalesPage(this.page)
  await salesPage.expectSalesTableDisplayed()
})

When('I click Add Sale', async function (this: PlaywrightWorld) {
  const salesPage = new SalesPage(this.page)
  await salesPage.clickAddSale()
})

When('I select the plant from fixture {string}',
  async function (this: PlaywrightWorld, fixtureKey: string) {
    const plant = (testdata as Record<string, any>)[fixtureKey].plant
    const salesPage = new SalesPage(this.page)
    await salesPage.selectPlant(plant)
  }
)

When('I fill in the sale quantity {string}',
  async function (this: PlaywrightWorld, quantity: string) {
    const salesPage = new SalesPage(this.page)
    await salesPage.fillQuantity(quantity)
  }
)

When('I fill in the sale quantity from fixture {string}',
  async function (this: PlaywrightWorld, fixtureKey: string) {
    const fixture = (testdata as Record<string, any>)[fixtureKey]
    const quantity = String(fixture.quantityLabel ?? fixture.quantity)
    const salesPage = new SalesPage(this.page)
    await salesPage.fillQuantity(quantity)
  }
)

When('I submit the sale form', async function (this: PlaywrightWorld) {
  const salesPage = new SalesPage(this.page)
  await salesPage.submit()
})

Then('I should see a sales success message', async function (this: PlaywrightWorld) {
  const salesPage = new SalesPage(this.page)
  await salesPage.expectSuccessToast()
})

Then('the sale should be displayed in the sales records',
  async function (this: PlaywrightWorld) {
    const salesPage = new SalesPage(this.page)
    const plant = testdata.newSale.plant
    await salesPage.expectListContains(plant)
  }
)

When('I click delete for the sale with plant from fixture {string}',
  async function (this: PlaywrightWorld, fixtureKey: string) {
    const plant = (testdata as Record<string, any>)[fixtureKey].plant
    const salesPage = new SalesPage(this.page)
    this.deletedSaleFormAction = await salesPage.clickDeleteForPlant(plant)
  }
)

When('I confirm the sale deletion', async function (this: PlaywrightWorld) {
  const salesPage = new SalesPage(this.page)
  await salesPage.confirmDelete()
})

Then('the sale should be removed from the sales records',
  async function (this: PlaywrightWorld) {
    const salesPage = new SalesPage(this.page)
    await salesPage.expectSaleFormRemoved(this.deletedSaleFormAction ?? '')
  }
)

Then('the sale form should show a validation error',
  async function (this: PlaywrightWorld) {
    const salesPage = new SalesPage(this.page)
    await salesPage.expectFormValidationError()
  }
)

When('I navigate to the sales page as user', async function (this: PlaywrightWorld) {
  const salesPage = new SalesPage(this.page)
  await salesPage.navigateAsUser()
})

When('I attempt to access the admin sales page as user',
  async function (this: PlaywrightWorld) {
    const salesPage = new SalesPage(this.page)
    await salesPage.navigateToAdminAsUser()
  }
)

Then('the Add Sale button should not be visible', async function (this: PlaywrightWorld) {
  const count = await this.page
    .locator('[data-cy=add-sale-btn], a:has-text("Sell Plant"), a[href="/ui/sales/new"]')
    .count()
  expect(count).toBe(0)
})

Then('the sales delete buttons should not be visible', async function (this: PlaywrightWorld) {
  const count = await this.page
    .locator('[data-cy=delete-sale-btn], button:has-text("Delete"), [aria-label="Delete sale"]')
    .count()
  expect(count).toBe(0)
})

Then('I should see an access denied message', async function (this: PlaywrightWorld) {
  const salesPage = new SalesPage(this.page)
  await salesPage.expectAccessDenied()
})
