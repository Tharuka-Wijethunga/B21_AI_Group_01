import { Given, When, Then } from '@cucumber/cucumber'
import { expect } from '@playwright/test'
import { PlaywrightWorld } from '../../hooks/world'
import { LoginPage } from '../../pages/LoginPage'
import { DashboardPage } from '../../pages/DashboardPage'
import { CategoryPage } from '../../pages/CategoryPage'
import { PlantPage } from '../../pages/PlantPage'

// ─── Navigation ───────────────────────────────────────────────────────────────

// UI_ADMIN_LOGIN_001 / UI_USER_LOGIN_001 / UI_ADMIN_LOGIN_003 / UI_USER_LOGIN_003
Given('I am on the login page', async function (this: PlaywrightWorld) {
  const loginPage = new LoginPage(this.page)
  await loginPage.navigate()
})

// ─── Input Actions ────────────────────────────────────────────────────────────

When('I enter the username {string}', async function (this: PlaywrightWorld, username: string) {
  const loginPage = new LoginPage(this.page)
  await loginPage.enterEmail(username)
})

When('I enter the password {string}', async function (this: PlaywrightWorld, password: string) {
  const loginPage = new LoginPage(this.page)
  await loginPage.enterPassword(password)
})

// UI_ADMIN_LOGIN_003
When('I leave the username field empty', async function (this: PlaywrightWorld) {
  // No-op: username field is intentionally left blank
})

// UI_USER_LOGIN_003
When('I leave the password field empty', async function (this: PlaywrightWorld) {
  // No-op: password field is intentionally left blank
})

When('I click the Login button', async function (this: PlaywrightWorld) {
  const loginPage = new LoginPage(this.page)
  await loginPage.submit()
})

// ─── Assertions ───────────────────────────────────────────────────────────────

// UI_ADMIN_LOGIN_001 / UI_USER_LOGIN_001 / UI_ADMIN_DASHBOARD_001 / UI_USER_DASHBOARD_001
Then('I should be redirected to the dashboard', async function (this: PlaywrightWorld) {
  const loginPage = new LoginPage(this.page)
  await loginPage.expectRedirectedToDashboard()
})

// UI_ADMIN_LOGIN_002 / UI_USER_LOGIN_002 / UI_ADMIN_LOGIN_003 / UI_USER_LOGIN_003
Then('I should remain on the login page', async function (this: PlaywrightWorld) {
  await this.page.waitForURL('**/login**')
  expect(this.page.url()).toContain('/login')
})

// UI_ADMIN_LOGIN_002 / UI_USER_LOGIN_002
Then('I should see the error message {string}',
  async function (this: PlaywrightWorld, message: string) {
    const errorLocator = this.page.locator(
      '[data-cy=error-message], .error-message, .alert-danger'
    )
    await errorLocator.waitFor({ state: 'visible' })
    await expect(errorLocator).toContainText(message)
  }
)

// UI_ADMIN_LOGIN_003 / UI_USER_LOGIN_003
Then('I should see the field validation message {string}',
  async function (this: PlaywrightWorld, message: string) {
    const validationLocator = this.page.locator('.invalid-feedback', { hasText: message }).first()
    await validationLocator.waitFor({ state: 'visible' })
    await expect(validationLocator).toBeVisible()
  }
)

// UI_ADMIN_ACCESS_001
Then('the Add Category button should be visible', async function (this: PlaywrightWorld) {
  const categoryPage = new CategoryPage(this.page)
  await categoryPage.addBtn.waitFor({ state: 'visible' })
  await expect(categoryPage.addBtn).toBeVisible()
})

// UI_ADMIN_ACCESS_002
Then('the Add Plant button should be visible', async function (this: PlaywrightWorld) {
  const plantPage = new PlantPage(this.page)
  await plantPage.addBtn.waitFor({ state: 'visible' })
  await expect(plantPage.addBtn).toBeVisible()
})

// UI_USER_LOGOUT_001
When('I click the Logout button', async function (this: PlaywrightWorld) {
  await this.page.locator('[data-cy=logout-btn], button:has-text("Logout"), a:has-text("Logout")').click()
})

Then('I should be redirected to the login page', async function (this: PlaywrightWorld) {
  await this.page.waitForURL('**/login**')
  expect(this.page.url()).toContain('/login')
})

Then('I should see the logout success message', async function (this: PlaywrightWorld) {
  const successLocator = this.page.locator(
    '[data-cy=success-message], .alert-success, .toast-success'
  )
  await successLocator.waitFor({ state: 'visible' })
  await expect(successLocator).toContainText(/logged out|success/i)
})

// UI_USER_DASHBOARD_001 — navigate to a named page via its label
When('I navigate to the {string} page',
  async function (this: PlaywrightWorld, page: string) {
    const routes: Record<string, string> = {
      dashboard:  '/ui/dashboard',
      categories: '/ui/categories',
      plants:     '/ui/plants',
      sales:      '/ui/sales',
    }
    const url = routes[page.toLowerCase()]
    if (!url) throw new Error(`Unknown page: "${page}"`)
    await this.page.goto(url)
    await this.page.waitForLoadState('networkidle')
  }
)

// UI_USER_DASHBOARD_001 — assert the named tab is highlighted active
Then('the {string} navigation tab should be highlighted as active',
  async function (this: PlaywrightWorld, tab: string) {
    const dashboard = new DashboardPage(this.page)
    await dashboard.expectNavTabActive(tab)
  }
)
