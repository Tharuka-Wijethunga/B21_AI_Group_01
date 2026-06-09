import { Then } from '@cucumber/cucumber'
import { expect } from '@playwright/test'
import { PlaywrightWorld } from '../../hooks/world'

Then('the response status should be {int}', async function (this: PlaywrightWorld, status: number) {
  expect(this.response.status()).toBe(status)
})

Then('the response should return a list', async function (this: PlaywrightWorld) {
  const body = await this.response.json()
  expect(Array.isArray(body)).toBe(true)
})

Then('the response list should not be empty', async function (this: PlaywrightWorld) {
  const body = await this.response.json()
  expect(Array.isArray(body) && body.length).toBeGreaterThan(0)
})

Then('I should see a success message', async function (this: PlaywrightWorld) {
  await this.page.locator('[data-cy=success-toast], .toast-success, .alert-success').waitFor({ state: 'visible' })
})

Then('I should be redirected to {string}', async function (this: PlaywrightWorld, path: string) {
  await this.page.waitForURL(`**${path}`)
})
