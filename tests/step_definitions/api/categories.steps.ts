import { Given, When, Then } from '@cucumber/cucumber'
import { expect } from '@playwright/test'
import { PlaywrightWorld } from '../../hooks/world'
import testdata from '../../fixtures/testdata.json'

When('I send a GET request to {string}', async function (this: PlaywrightWorld, endpoint: string) {
  this.response = await this.apiRequest.get(endpoint, {
    headers: { Authorization: `Bearer ${this.token}` },
  })
})

When('I send a POST request to {string} with body from fixture {string}',
  async function (this: PlaywrightWorld, endpoint: string, fixtureKey: string) {
    const body = (testdata as Record<string, any>)[fixtureKey]
    this.response = await this.apiRequest.post(endpoint, {
      headers: { Authorization: `Bearer ${this.token}` },
      data: body,
    })
    if (this.response.ok()) {
      const responseBody = await this.response.json()
      this.lastCreatedCategoryId = responseBody.id
    }
  }
)

When('I send a PUT request to {string} with body from fixture {string}',
  async function (this: PlaywrightWorld, endpoint: string, fixtureKey: string) {
    const body = (testdata as Record<string, any>)[fixtureKey]
    this.response = await this.apiRequest.put(endpoint, {
      headers: { Authorization: `Bearer ${this.token}` },
      data: body,
    })
  }
)

When('I send a DELETE request to {string}', async function (this: PlaywrightWorld, endpoint: string) {
  this.response = await this.apiRequest.delete(endpoint, {
    headers: { Authorization: `Bearer ${this.token}` },
  })
})

When('I send a POST request to {string} with an empty name',
  async function (this: PlaywrightWorld, endpoint: string) {
    this.response = await this.apiRequest.post(endpoint, {
      headers: { Authorization: `Bearer ${this.token}` },
      data: { name: '' },
    })
  }
)

Then('the response body should contain the created category name',
  async function (this: PlaywrightWorld) {
    const body = await this.response.json()
    expect(body.name).toBe(testdata.newCategory.name)
  }
)

Then('the response body should contain the updated category name',
  async function (this: PlaywrightWorld) {
    const body = await this.response.json()
    expect(body.name).toBe(testdata.updatedCategory.name)
  }
)

Then('the response body should have an {string} field',
  async function (this: PlaywrightWorld, field: string) {
    const body = await this.response.json()
    expect(body).toHaveProperty(field)
  }
)

Then('I delete the category that was just created', async function (this: PlaywrightWorld) {
  await this.apiRequest.delete(`/api/categories/${this.lastCreatedCategoryId}`, {
    headers: { Authorization: `Bearer ${this.token}` },
  })
})

Given('I create a category to be deleted', async function (this: PlaywrightWorld) {
  const res = await this.apiRequest.post('/api/categories', {
    headers: { Authorization: `Bearer ${this.token}` },
    data: testdata.tempCategory,
  })
  const body = await res.json()
  this.tempCategoryId = body.id
})

When('I delete the category to be deleted', async function (this: PlaywrightWorld) {
  this.response = await this.apiRequest.delete(`/api/categories/${this.tempCategoryId}`, {
    headers: { Authorization: `Bearer ${this.token}` },
  })
})

When('I send a GET request to the deleted category', async function (this: PlaywrightWorld) {
  this.response = await this.apiRequest.get(`/api/categories/${this.tempCategoryId}`, {
    headers: { Authorization: `Bearer ${this.token}` },
  })
})
