import { When, Then } from '@cucumber/cucumber'
import { PlaywrightWorld } from '../../hooks/world'
import { SalesPage } from '../../pages/SalesPage'

When('I navigate to the sales page', async function (this: PlaywrightWorld) {
  const salesPage = new SalesPage(this.page)
  await salesPage.navigate()
})

When('I navigate to the sales page as user', async function (this: PlaywrightWorld) {
  const salesPage = new SalesPage(this.page)
  await salesPage.navigateAsUser()
})

Then('I should see a list of sales', async function (this: PlaywrightWorld) {
  const salesPage = new SalesPage(this.page)
  const count = await salesPage.getSalesCount()
  if (count === 0) throw new Error('Expected at least one sale in the list but found none')
})

When('I click Add Sale', async function (this: PlaywrightWorld) {
  const salesPage = new SalesPage(this.page)
  await salesPage.clickAddSale()
})

When('I select the plant {string}', async function (this: PlaywrightWorld, plantName: string) {
  const salesPage = new SalesPage(this.page)
  await salesPage.selectPlant(plantName)
})

When('I fill in the sale quantity {string}', async function (this: PlaywrightWorld, quantity: string) {
  const salesPage = new SalesPage(this.page)
  await salesPage.fillQuantity(quantity)
})

Then('I should see the new sale in the list', async function (this: PlaywrightWorld) {
  const salesPage = new SalesPage(this.page)
  const count = await salesPage.getSalesCount()
  if (count === 0) throw new Error('Expected at least one sale in the list after creation')
})

Then('I should see the sales list with quantities and total prices',
  async function (this: PlaywrightWorld) {
    await this.page.locator('table thead th, .sales-list th').filter({ hasText: /quantity/i }).first().waitFor({ state: 'visible' })
    await this.page.locator('table thead th, .sales-list th').filter({ hasText: /price/i }).first().waitFor({ state: 'visible' })
  }
)
