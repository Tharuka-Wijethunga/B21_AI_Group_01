import { When, Then } from '@cucumber/cucumber'
import { expect } from '@playwright/test'
import { PlaywrightWorld } from '../../hooks/world'
import testdata from '../../../fixtures/testdata.json'

When('I send a POST request to {string} with quantity {int}',
  async function (this: PlaywrightWorld, endpoint: string, quantity: number) {
    this.response = await this.apiRequest.post(endpoint, {
      headers: { Authorization: `Bearer ${this.token}` },
      data: { plantId: 1, quantity },
    })
  }
)

Then('the response body should have a {string} field',
  async function (this: PlaywrightWorld, field: string) {
    const body = await this.response.json()
    expect(body).toHaveProperty(field)
  }
)
