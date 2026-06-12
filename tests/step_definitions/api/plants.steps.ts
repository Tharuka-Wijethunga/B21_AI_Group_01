import { When, Then, After } from '@cucumber/cucumber'
import { expect } from '@playwright/test'
import { PlaywrightWorld } from '../../hooks/world'

// Step definitions for the Plants API tests (API_ADMIN_PLANT_001-005 and
// API_USER_PLANT_001-005). The generic steps like "the response status should
// be 200" and "I am authenticated as admin" come from the common step files.

// remembers the id of a plant created during a scenario so we can update/delete it
type PlantWorld = PlaywrightWorld & { createdPlantId?: number }

function authHeader(world: PlaywrightWorld): Record<string, string> {
  return { Authorization: `Bearer ${world.token}` }
}

// plant names the tests create. We delete them after each scenario, otherwise
// re-running fails because the app does not allow two plants with the same
// name in the same category.
const CREATED_PLANT_NAMES = [
  'Orchid',
  'Orchid Updated',
  'Editable Plant',
  'Disposable Plant',
  'Rose Bush',
  'TestPlant',
  'Category Move',
]

After({ tags: '@plants' }, async function (this: PlaywrightWorld) {
  const login = await this.apiRequest.post('/api/auth/login', {
    data: { username: process.env.ADMIN_USER, password: process.env.ADMIN_PASS },
  })
  const adminToken = (await login.json()).token
  const list = await this.apiRequest.get('/api/plants', {
    headers: { Authorization: `Bearer ${adminToken}` },
  })
  const plants = (await list.json()) as Array<{ id: number; name: string }>
  for (const plant of plants) {
    if (CREATED_PLANT_NAMES.includes(plant.name)) {
      await this.apiRequest.delete(`/api/plants/${plant.id}`, {
        headers: { Authorization: `Bearer ${adminToken}` },
      })
    }
  }
})

// requests

When('I request the list of plants', async function (this: PlaywrightWorld) {
  this.response = await this.apiRequest.get('/api/plants', { headers: authHeader(this) })
})

When('I request the plant with id {int}', async function (this: PlaywrightWorld, id: number) {
  this.response = await this.apiRequest.get(`/api/plants/${id}`, { headers: authHeader(this) })
})

When(
  'I search plants by name {string} on page {int} with size {int}',
  async function (this: PlaywrightWorld, name: string, page: number, size: number) {
    this.response = await this.apiRequest.get(
      `/api/plants/paged?name=${encodeURIComponent(name)}&page=${page}&size=${size}`,
      { headers: authHeader(this) }
    )
  }
)

When(
  'I create a plant {string} with price {float} and quantity {int} under category {int}',
  async function (this: PlantWorld, name: string, price: number, quantity: number, categoryId: number) {
    this.response = await this.apiRequest.post(`/api/plants/category/${categoryId}`, {
      headers: authHeader(this),
      data: { name, price, quantity },
    })
    if (this.response.status() === 201) {
      const body = await this.response.json()
      this.createdPlantId = body.id
    }
  }
)

When(
  'I update the created plant with name {string}, price {float}, quantity {int} and category {int}',
  async function (this: PlantWorld, name: string, price: number, quantity: number, categoryId: number) {
    this.response = await this.apiRequest.put(`/api/plants/${this.createdPlantId}`, {
      headers: authHeader(this),
      data: { name, price, quantity, categoryId },
    })
  }
)

When(
  'I update plant {int} with name {string}, price {float}, quantity {int} and category {int}',
  async function (this: PlaywrightWorld, id: number, name: string, price: number, quantity: number, categoryId: number) {
    this.response = await this.apiRequest.put(`/api/plants/${id}`, {
      headers: authHeader(this),
      data: { name, price, quantity, categoryId },
    })
  }
)

When('I delete the created plant', async function (this: PlantWorld) {
  this.response = await this.apiRequest.delete(`/api/plants/${this.createdPlantId}`, {
    headers: authHeader(this),
  })
})

When('I delete plant {int}', async function (this: PlaywrightWorld, id: number) {
  this.response = await this.apiRequest.delete(`/api/plants/${id}`, { headers: authHeader(this) })
})

When('I request the created plant by id', async function (this: PlantWorld) {
  this.response = await this.apiRequest.get(`/api/plants/${this.createdPlantId}`, {
    headers: authHeader(this),
  })
})

// assertions

Then(
  'each plant in the list should have id, name, price, quantity and category',
  async function (this: PlaywrightWorld) {
    const body = await this.response.json()
    expect(Array.isArray(body)).toBe(true)
    for (const plant of body) {
      expect(plant).toHaveProperty('id')
      expect(plant).toHaveProperty('name')
      expect(plant).toHaveProperty('price')
      expect(plant).toHaveProperty('quantity')
      expect(plant).toHaveProperty('category')
    }
  }
)

Then(
  'the plant response should have id, name, price, quantity and category',
  async function (this: PlaywrightWorld) {
    const body = await this.response.json()
    expect(body).toHaveProperty('id')
    expect(body).toHaveProperty('name')
    expect(body).toHaveProperty('price')
    expect(body).toHaveProperty('quantity')
    // the single-plant endpoint returns a flat categoryId, the list endpoint
    // returns a nested category object, so accept either one
    const hasCategory = 'category' in body || 'categoryId' in body
    expect(hasCategory).toBe(true)
  }
)

Then(
  'the created plant should have name {string}, price {float} and quantity {int}',
  async function (this: PlaywrightWorld, name: string, price: number, quantity: number) {
    const body = await this.response.json()
    expect(body.name).toBe(name)
    expect(body.price).toBe(price)
    expect(body.quantity).toBe(quantity)
  }
)

Then(
  'the updated plant should have name {string}, price {float} and quantity {int}',
  async function (this: PlaywrightWorld, name: string, price: number, quantity: number) {
    const body = await this.response.json()
    expect(body.name).toBe(name)
    expect(body.price).toBe(price)
    expect(body.quantity).toBe(quantity)
  }
)

Then(
  'the paged response should contain totalPages, totalElements and content',
  async function (this: PlaywrightWorld) {
    const body = await this.response.json()
    expect(body).toHaveProperty('totalPages')
    expect(body).toHaveProperty('totalElements')
    expect(body).toHaveProperty('content')
    expect(Array.isArray(body.content)).toBe(true)
  }
)

Then(
  'the paged content should include a plant named {string}',
  async function (this: PlaywrightWorld, name: string) {
    const body = await this.response.json()
    const names = (body.content as Array<{ name: string }>).map((p) => p.name)
    expect(names).toContain(name)
  }
)

Then(
  'the response error message for {string} should be {string}',
  async function (this: PlaywrightWorld, field: string, message: string) {
    const body = await this.response.json()
    expect(body.details?.[field]).toBe(message)
  }
)

// checks the plant's category was actually changed by the update.
// this is expected to fail: the app accepts the update (200) but ignores the
// new category, see bug report API_BUG_PLANT_001.
Then('the updated plant category should be {int}', async function (this: PlaywrightWorld, expectedCategoryId: number) {
  const body = await this.response.json()
  expect(body.category?.id).toBe(expectedCategoryId)
})
