import { When, Then } from '@cucumber/cucumber'
import { expect } from '@playwright/test'
import { PlaywrightWorld } from '../../hooks/world'

// ─── API Login Steps ──────────────────────────────────────────────────────────

// API_ADMIN_LOGIN_001 / API_USER_LOGIN_001
When('I send a POST request to {string} with admin credentials',
  async function (this: PlaywrightWorld, endpoint: string) {
    this.response = await this.apiRequest.post(endpoint, {
      data: {
        username: process.env.ADMIN_USER,
        password: process.env.ADMIN_PASS,
      },
    })
    const body = await this.response.json()
    if (body.token) this.token = body.token
  }
)

When('I send a POST request to {string} with user credentials',
  async function (this: PlaywrightWorld, endpoint: string) {
    this.response = await this.apiRequest.post(endpoint, {
      data: {
        username: process.env.TEST_USER,
        password: process.env.TEST_PASS,
      },
    })
    const body = await this.response.json()
    if (body.token) this.token = body.token
  }
)

// API_ADMIN_LOGIN_002 / API_USER_LOGIN_002
When('I send a POST request to {string} with invalid admin credentials',
  async function (this: PlaywrightWorld, endpoint: string) {
    this.response = await this.apiRequest.post(endpoint, {
      data: {
        username: process.env.ADMIN_USER,
        password: 'wrongpassword',
      },
    })
  }
)

When('I send a POST request to {string} with invalid user credentials',
  async function (this: PlaywrightWorld, endpoint: string) {
    this.response = await this.apiRequest.post(endpoint, {
      data: {
        username: process.env.TEST_USER,
        password: 'wrongpassword',
      },
    })
  }
)

// API_ADMIN_LOGIN_001 / API_USER_LOGIN_001 assertion
Then('the response body should contain a valid JWT token',
  async function (this: PlaywrightWorld) {
    const body = await this.response.json()
    expect(body).toHaveProperty('token')
    expect(typeof body.token).toBe('string')
    expect(body.token.length).toBeGreaterThan(0)
  }
)
