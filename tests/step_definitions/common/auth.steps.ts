import { Given } from '@cucumber/cucumber'
import { PlaywrightWorld } from '../../hooks/world'
import { LoginPage } from '../../pages/LoginPage'

// API auth: just get a token for API requests.
Given('I am authenticated as admin', async function (this: PlaywrightWorld) {
  const response = await this.apiRequest.post('/api/auth/login', {
    data: { username: process.env.ADMIN_USER, password: process.env.ADMIN_PASS },
  })
  this.token = (await response.json()).token
})

Given('I am authenticated as user', async function (this: PlaywrightWorld) {
  const response = await this.apiRequest.post('/api/auth/login', {
    data: { username: process.env.TEST_USER, password: process.env.TEST_PASS },
  })
  this.token = (await response.json()).token
})

Given('I am not authenticated', async function (this: PlaywrightWorld) {
  this.token = ''
})

// UI auth: get a token and also log in through the real session form.
Given('I am logged in as admin', async function (this: PlaywrightWorld) {
  const response = await this.apiRequest.post('/api/auth/login', {
    data: { username: process.env.ADMIN_USER, password: process.env.ADMIN_PASS },
  })
  this.token = (await response.json()).token
  const loginPage = new LoginPage(this.page)
  await loginPage.login(process.env.ADMIN_USER!, process.env.ADMIN_PASS!)
})

Given('I am logged in as user', async function (this: PlaywrightWorld) {
  const response = await this.apiRequest.post('/api/auth/login', {
    data: { username: process.env.TEST_USER, password: process.env.TEST_PASS },
  })
  this.token = (await response.json()).token
  const loginPage = new LoginPage(this.page)
  await loginPage.login(process.env.TEST_USER!, process.env.TEST_PASS!)
})
