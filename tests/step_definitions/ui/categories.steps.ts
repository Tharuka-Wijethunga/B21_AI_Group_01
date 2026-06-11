import { When, Then } from '@cucumber/cucumber'
import { expect } from '@playwright/test'
import { PlaywrightWorld } from '../../hooks/world'
import { CategoryPage } from '../../pages/CategoryPage'
import testdata from '../../fixtures/testdata.json'

When('I navigate to the categories page', async function (this: PlaywrightWorld) {
  const categoryPage = new CategoryPage(this.page)
  await categoryPage.navigate()
})

Then('I should see a list of categories', async function (this: PlaywrightWorld) {
  const categoryPage = new CategoryPage(this.page)
  await categoryPage.expectListContains('Tropical')
})

Then('I should see {string} in the category list', async function (this: PlaywrightWorld, name: string) {
  const categoryPage = new CategoryPage(this.page)
  await categoryPage.expectListContains(name)
})

When('I click Add Category', async function (this: PlaywrightWorld) {
  const categoryPage = new CategoryPage(this.page)
  await categoryPage.clickAddCategory()
})

When('I fill in the category name with fixture data {string}',
  async function (this: PlaywrightWorld, fixtureKey: string) {
    const name = (testdata as Record<string, any>)[fixtureKey].name
    const categoryPage = new CategoryPage(this.page)
    await categoryPage.fillName(name)
  }
)

When('I fill in the category name with {string}', async function (this: PlaywrightWorld, name: string) {
  const categoryPage = new CategoryPage(this.page)
  await categoryPage.fillName(name)
})

When('I submit the form', async function (this: PlaywrightWorld) {
  const categoryPage = new CategoryPage(this.page)
  await categoryPage.submit()
})

When('I submit the form without a name', async function (this: PlaywrightWorld) {
  const categoryPage = new CategoryPage(this.page)
  await categoryPage.submit()
})

Then('I should see the new category in the list', async function (this: PlaywrightWorld) {
  const categoryPage = new CategoryPage(this.page)
  await categoryPage.expectListContains(testdata.newCategory.name)
})

When('I click edit for the category {string}', async function (this: PlaywrightWorld, name: string) {
  const categoryPage = new CategoryPage(this.page)
  await categoryPage.clickEditFor(name)
})

When('I click delete for the category {string}', async function (this: PlaywrightWorld, name: string) {
  const categoryPage = new CategoryPage(this.page)
  await categoryPage.clickDeleteFor(name)
})

When('I confirm the deletion', async function (this: PlaywrightWorld) {
  const categoryPage = new CategoryPage(this.page)
  await categoryPage.confirmDelete()
})

Then('the Add Category button should not be visible', async function (this: PlaywrightWorld) {
  const count = await this.page.locator('[data-cy=add-category-btn], button:has-text("Add Category")').count()
  expect(count).toBe(0)
})

Then('the edit buttons should not be visible', async function (this: PlaywrightWorld) {
  const count = await this.page.locator('[data-cy=edit-btn], button:has-text("Edit")').count()
  expect(count).toBe(0)
})

Then('the delete buttons should not be visible', async function (this: PlaywrightWorld) {
  const count = await this.page.locator('[data-cy=delete-btn], button:has-text("Delete")').count()
  expect(count).toBe(0)
})

Then('I should see a validation error', async function (this: PlaywrightWorld) {
  await this.page.locator('.error, .invalid-feedback, [data-cy=validation-error]').waitFor({ state: 'visible' })
})
