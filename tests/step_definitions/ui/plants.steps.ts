import { When, Then } from '@cucumber/cucumber'
import { expect } from '@playwright/test'
import { PlaywrightWorld } from '../../hooks/world'
import { PlantPage } from '../../../pages/PlantPage'
import testdata from '../../../fixtures/testdata.json'

When('I navigate to the plants page', async function (this: PlaywrightWorld) {
  const plantPage = new PlantPage(this.page)
  await plantPage.navigate()
})

Then('I should see a list of plants', async function (this: PlaywrightWorld) {
  const plantPage = new PlantPage(this.page)
  await plantPage.expectListContains('Aloe Vera')
})

Then('I should see {string} in the plant list', async function (this: PlaywrightWorld, name: string) {
  const plantPage = new PlantPage(this.page)
  await plantPage.expectListContains(name)
})

When('I click Add Plant', async function (this: PlaywrightWorld) {
  const plantPage = new PlantPage(this.page)
  await plantPage.clickAddPlant()
})

When('I fill in the plant details with fixture data {string}',
  async function (this: PlaywrightWorld, fixtureKey: string) {
    const data = (testdata as Record<string, any>)[fixtureKey]
    const plantPage = new PlantPage(this.page)
    await plantPage.fillName(data.name)
    await plantPage.fillPrice(data.price)
    await plantPage.fillQuantity(data.quantity)
    if (data.category) await plantPage.selectCategory(data.category)
  }
)

When('I fill in the plant name {string}', async function (this: PlaywrightWorld, name: string) {
  const plantPage = new PlantPage(this.page)
  await plantPage.fillName(name)
})

When('I fill in the price {string}', async function (this: PlaywrightWorld, price: string) {
  const plantPage = new PlantPage(this.page)
  await plantPage.fillPrice(price)
})

Then('I should see the new plant in the list', async function (this: PlaywrightWorld) {
  const plantPage = new PlantPage(this.page)
  await plantPage.expectListContains(testdata.newPlant.name)
})

When('I click edit for the plant {string}', async function (this: PlaywrightWorld, name: string) {
  const plantPage = new PlantPage(this.page)
  await plantPage.clickEditFor(name)
})

When('I update the price to {string}', async function (this: PlaywrightWorld, price: string) {
  const plantPage = new PlantPage(this.page)
  await plantPage.fillPrice(price)
})

When('I click delete for the plant {string}', async function (this: PlaywrightWorld, name: string) {
  const plantPage = new PlantPage(this.page)
  await plantPage.clickDeleteFor(name)
})

Then('the Add Plant button should not be visible', async function (this: PlaywrightWorld) {
  const count = await this.page.locator('[data-cy=add-plant-btn], button:has-text("Add Plant")').count()
  expect(count).toBe(0)
})
