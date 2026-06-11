import { When, Then } from '@cucumber/cucumber'
import { expect } from '@playwright/test'
import { PlaywrightWorld } from '../../hooks/world'
import testdata from '../../fixtures/testdata.json'

When('I send a POST request to {string} with a negative price',
  async function (this: PlaywrightWorld, endpoint: string) {
    this.response = await this.apiRequest.post(endpoint, {
      headers: { Authorization: `Bearer ${this.token}` },
      data: {
        name: 'Invalid Plant',
        price: -5.0,
        quantity: 10,
        categoryId: 1,
      },
    })
  }
)

Then('the response body should contain the created plant name',
  async function (this: PlaywrightWorld) {
    const body = await this.response.json()
    expect(body.name).toBe(testdata.newPlant.name)
  }
)

Then('the response body should contain the updated plant price',
  async function (this: PlaywrightWorld) {
    const body = await this.response.json()
    expect(String(body.price)).toBe(testdata.updatedPlant.price)
  }
)
