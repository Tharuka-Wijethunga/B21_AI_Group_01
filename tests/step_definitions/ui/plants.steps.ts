import { Given, When, Then, Before, setDefaultTimeout } from '@cucumber/cucumber'
import { expect } from '@playwright/test'
import { PlaywrightWorld } from '../../hooks/world'
import { PlantPage } from '../../pages/PlantPage'

// UI steps open a real browser and load full pages, which can take longer than
// Cucumber's default 5s step timeout, so raise it.
setDefaultTimeout(30000)

// The UI uses a normal session login form (not a token), so log in by filling
// the form at /ui/login instead of setting a cookie.
async function uiLogin(world: PlaywrightWorld, username: string, password: string): Promise<void> {
  await world.page.goto('/ui/login', { waitUntil: 'domcontentloaded' })
  await world.page.locator('input[name="username"]').fill(username)
  await world.page.locator('input[name="password"]').fill(password)
  await world.page.locator('button[type="submit"]').click()
  await world.page.waitForURL('**/ui/dashboard')
}

// The "Low" badge only shows for a plant with quantity < 5, and the seed has
// none, so create one (if it is missing) before UI_USER_PLANT_003 runs.
Before({ tags: '@UI_USER_PLANT_003' }, async function (this: PlaywrightWorld) {
  const LOW_STOCK_NAME = 'Mini Fern'
  const SUB_CATEGORY_ID = 5
  const login = await this.apiRequest.post('/api/auth/login', {
    data: { username: process.env.ADMIN_USER, password: process.env.ADMIN_PASS },
  })
  const adminToken = (await login.json()).token
  const auth = { Authorization: `Bearer ${adminToken}` }
  const list = await this.apiRequest.get('/api/plants', { headers: auth })
  const plants = (await list.json()) as Array<{ name: string }>
  if (!plants.some((p) => p.name === LOW_STOCK_NAME)) {
    await this.apiRequest.post(`/api/plants/category/${SUB_CATEGORY_ID}`, {
      headers: auth,
      data: { name: LOW_STOCK_NAME, price: 16.0, quantity: 3 },
    })
  }
})

// login

Given('I am logged into the UI as an admin', async function (this: PlaywrightWorld) {
  await uiLogin(this, process.env.ADMIN_USER!, process.env.ADMIN_PASS!)
})

Given('I am logged into the UI as a normal user', async function (this: PlaywrightWorld) {
  await uiLogin(this, process.env.TEST_USER!, process.env.TEST_PASS!)
})

// actions

When('I open the Plants page', async function (this: PlaywrightWorld) {
  await new PlantPage(this.page).navigate()
})

// alias used by the access-control (login) feature
When('I navigate to the plants page', async function (this: PlaywrightWorld) {
  await new PlantPage(this.page).navigate()
})

When('I open the Add Plant page', async function (this: PlaywrightWorld) {
  await new PlantPage(this.page).openAddForm()
})

When('I click the Add a Plant button', async function (this: PlaywrightWorld) {
  await new PlantPage(this.page).clickAddPlant()
})

When('I click the Cancel button', async function (this: PlaywrightWorld) {
  await new PlantPage(this.page).clickCancel()
})

When('I enter {string} as the plant name', async function (this: PlaywrightWorld, name: string) {
  await new PlantPage(this.page).fillName(name)
})

When(
  'I add a plant named {string} in category {string} with price {string} and quantity {string}',
  async function (this: PlaywrightWorld, name: string, category: string, price: string, quantity: string) {
    await new PlantPage(this.page).submitNewPlant({ name, category, price, quantity })
  }
)

When(
  'I edit the plant {string} setting quantity to {string}',
  async function (this: PlaywrightWorld, name: string, quantity: string) {
    const plantPage = new PlantPage(this.page)
    await plantPage.clickEditFor(name)
    await plantPage.fillQuantity(quantity)
    await plantPage.save()
  }
)

When('I search plants for {string}', async function (this: PlaywrightWorld, term: string) {
  await new PlantPage(this.page).search(term)
})

// assertions

Then('I should be on the Plants list page', async function (this: PlaywrightWorld) {
  await this.page.waitForURL('**/ui/plants')
  expect(this.page.url()).toMatch(/\/ui\/plants$/)
})

Then('I should remain on the Add Plant page', async function (this: PlaywrightWorld) {
  expect(this.page.url()).toContain('/ui/plants/add')
})

Then('I should see {string} in the plant list', async function (this: PlaywrightWorld, name: string) {
  await expect(new PlantPage(this.page).rowFor(name)).toBeVisible()
})

Then('I should not see {string} in the plant list', async function (this: PlaywrightWorld, name: string) {
  await expect(new PlantPage(this.page).rowFor(name)).toHaveCount(0)
})

Then(
  'the plant {string} should show quantity {string}',
  async function (this: PlaywrightWorld, name: string, quantity: string) {
    await expect(new PlantPage(this.page).rowFor(name)).toContainText(quantity)
  }
)

Then('the Add a Plant button should not be visible', async function (this: PlaywrightWorld) {
  await expect(new PlantPage(this.page).getAddPlantLink()).toHaveCount(0)
})

Then('the plant Edit buttons should not be visible', async function (this: PlaywrightWorld) {
  await expect(new PlantPage(this.page).getEditButtons()).toHaveCount(0)
})

Then('the plant Delete buttons should not be visible', async function (this: PlaywrightWorld) {
  await expect(new PlantPage(this.page).getDeleteButtons()).toHaveCount(0)
})

Then(
  'the plant {string} should display a {string} stock badge',
  async function (this: PlaywrightWorld, name: string, badgeText: string) {
    const badge = new PlantPage(this.page).lowBadgeFor(name)
    await expect(badge).toBeVisible()
    await expect(badge).toHaveText(new RegExp(badgeText, 'i'))
  }
)

Then('I should see the plant form error {string}', async function (this: PlaywrightWorld, message: string) {
  await expect(new PlantPage(this.page).getFormError().filter({ hasText: message })).toBeVisible()
})

Then('I should see the {string} message', async function (this: PlaywrightWorld, message: string) {
  await expect(new PlantPage(this.page).getEmptyState().filter({ hasText: message })).toBeVisible()
})
