import { When, Then } from '@cucumber/cucumber'
import { expect } from '@playwright/test'
import { PlaywrightWorld } from '../../hooks/world'
import testdata from '../../fixtures/testdata.json'

// Authenticated GET/DELETE use shared steps in categories.steps.ts.

When('I send a POST request to {string} with quantity {int}',
  async function (this: PlaywrightWorld, endpoint: string, quantity: number) {
    this.response = await this.apiRequest.post(endpoint, {
      headers: { Authorization: `Bearer ${this.token}` },
      data: { plantId: 1, quantity },
    })
  }
)

When('I send a POST request to {string} with sales data from fixture {string}',
  async function (this: PlaywrightWorld, endpoint: string, fixtureKey: string) {
    const fixture = (testdata as Record<string, any>)[fixtureKey]
    this.response = await this.apiRequest.post(endpoint, {
      headers: { Authorization: `Bearer ${this.token}` },
      data: { plantId: fixture.plantId, quantity: fixture.quantity },
    })
  }
)

When('I send a GET request to {string} without authentication',
  async function (this: PlaywrightWorld, endpoint: string) {
    this.response = await this.apiRequest.get(endpoint)
  }
)

Then('the response body should have a {string} field',
  async function (this: PlaywrightWorld, field: string) {
    const body = await this.response.json()
    const snakeField = field.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`)
    expect(body[field] ?? body[snakeField]).toBeDefined()
  }
)

Then('the response should return an error', async function (this: PlaywrightWorld) {
  expect(this.response.status()).toBeGreaterThanOrEqual(400)
})

Then('the response should contain an error message', async function (this: PlaywrightWorld) {
  const body = await this.response.json()
  const message = body.message ?? body.error ?? body.detail ?? body.title
  expect(message).toBeTruthy()
})
