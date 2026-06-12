import { Given, When, Then } from '@cucumber/cucumber'
import { expect } from '@playwright/test'
import { PlaywrightWorld } from '../../hooks/world'
import testdata from '../../fixtures/testdata.json'

// Authenticated GET use shared steps in categories.steps.ts.

async function loginAs(world: PlaywrightWorld, username?: string, password?: string): Promise<string> {
  const response = await world.apiRequest.post('/api/auth/login', {
    data: { username, password },
  })
  const body = await response.json()
  return body.token
}

When('I send a POST request to sell the plant from fixture {string}',
  async function (this: PlaywrightWorld, fixtureKey: string) {
    const fixture = (testdata as Record<string, any>)[fixtureKey]
    this.response = await this.apiRequest.post(`/api/sales/plant/${fixture.plantId}?quantity=${fixture.quantity}`, {
      headers: { Authorization: `Bearer ${this.token}` },
    })
    if (this.response.ok()) {
      const body = await this.response.json()
      this.lastCreatedSaleId = body.id
    }
  }
)

When('I send a POST request to sell the plant from fixture {string} with quantity {int}',
  async function (this: PlaywrightWorld, fixtureKey: string, quantity: number) {
    const fixture = (testdata as Record<string, any>)[fixtureKey]
    this.response = await this.apiRequest.post(`/api/sales/plant/${fixture.plantId}?quantity=${quantity}`, {
      headers: { Authorization: `Bearer ${this.token}` },
    })
  }
)

Then('I delete the sale that was just created', async function (this: PlaywrightWorld) {
  await this.apiRequest.delete(`/api/sales/${this.lastCreatedSaleId}`, {
    headers: { Authorization: `Bearer ${this.token}` },
  })
})

Given('I create a sale to be deleted from fixture {string}',
  async function (this: PlaywrightWorld, fixtureKey: string) {
    const fixture = (testdata as Record<string, any>)[fixtureKey]
    const res = await this.apiRequest.post(`/api/sales/plant/${fixture.plantId}?quantity=1`, {
      headers: { Authorization: `Bearer ${this.token}` },
    })
    const body = await res.json()
    this.tempSaleId = body.id
  }
)

When('I delete the sale to be deleted', async function (this: PlaywrightWorld) {
  this.response = await this.apiRequest.delete(`/api/sales/${this.tempSaleId}`, {
    headers: { Authorization: `Bearer ${this.token}` },
  })
})

Given('I create a temporary sale as admin from fixture {string}',
  async function (this: PlaywrightWorld, fixtureKey: string) {
    const fixture = (testdata as Record<string, any>)[fixtureKey]
    this.token = await loginAs(this, process.env.ADMIN_USER, process.env.ADMIN_PASS)
    const res = await this.apiRequest.post(`/api/sales/plant/${fixture.plantId}?quantity=1`, {
      headers: { Authorization: `Bearer ${this.token}` },
    })
    const body = await res.json()
    this.tempSaleId = body.id
  }
)

Given('I switch to a regular user token', async function (this: PlaywrightWorld) {
  this.userToken = await loginAs(this, process.env.TEST_USER, process.env.TEST_PASS)
})

When('I attempt to delete that sale as the current user', async function (this: PlaywrightWorld) {
  this.response = await this.apiRequest.delete(`/api/sales/${this.tempSaleId}`, {
    headers: { Authorization: `Bearer ${this.userToken}` },
  })
})

Then('I clean up the temporary sale as admin', async function (this: PlaywrightWorld) {
  await this.apiRequest.delete(`/api/sales/${this.tempSaleId}`, {
    headers: { Authorization: `Bearer ${this.token}` },
  })
})

When('I attempt to sell the plant from fixture {string} as the current user',
  async function (this: PlaywrightWorld, fixtureKey: string) {
    const fixture = (testdata as Record<string, any>)[fixtureKey]
    this.response = await this.apiRequest.post(`/api/sales/plant/${fixture.plantId}?quantity=${fixture.quantity}`, {
      headers: { Authorization: `Bearer ${this.token}` },
    })
    if (this.response.ok()) {
      // Self-heal: the API incorrectly allowed a regular user to create a sale.
      const body = await this.response.json()
      const adminToken = await loginAs(this, process.env.ADMIN_USER, process.env.ADMIN_PASS)
      await this.apiRequest.delete(`/api/sales/${body.id}`, {
        headers: { Authorization: `Bearer ${adminToken}` },
      })
    }
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
