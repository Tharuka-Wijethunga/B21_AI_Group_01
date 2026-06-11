import { When, Then } from '@cucumber/cucumber'
import { PlaywrightWorld } from '../../hooks/world'
import { DashboardPage } from '../../pages/DashboardPage'

When('I navigate to the dashboard', async function (this: PlaywrightWorld) {
  const dashboard = new DashboardPage(this.page)
  await dashboard.navigate()
})

Then('I should see the summary statistics', async function (this: PlaywrightWorld) {
  const dashboard = new DashboardPage(this.page)
  await dashboard.expectStatsVisible()
})

Then('I should see the navigation menu', async function (this: PlaywrightWorld) {
  const dashboard = new DashboardPage(this.page)
  await dashboard.expectNavMenuVisible()
})

Then('I should see the total plants count', async function (this: PlaywrightWorld) {
  const dashboard = new DashboardPage(this.page)
  await dashboard.expectTotalPlantsVisible()
})

Then('I should see the total categories count', async function (this: PlaywrightWorld) {
  const dashboard = new DashboardPage(this.page)
  await dashboard.expectTotalCategoriesVisible()
})

Then('I should see the total sales count', async function (this: PlaywrightWorld) {
  const dashboard = new DashboardPage(this.page)
  await dashboard.expectTotalSalesVisible()
})

When('I click the categories navigation link', async function (this: PlaywrightWorld) {
  await this.page.locator('a[href*="categories"], [data-cy=nav-categories]').click()
})

When('I click the plants navigation link', async function (this: PlaywrightWorld) {
  await this.page.locator('a[href*="plants"], [data-cy=nav-plants]').click()
})
