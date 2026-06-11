import { Given } from '@cucumber/cucumber'
import { PlaywrightWorld } from '../../hooks/world'

Given('I am authenticated as admin', async function (this: PlaywrightWorld) {
  const response = await this.apiRequest.post('/api/auth/login', {
    data: {
      username: process.env.ADMIN_USER,
      password: process.env.ADMIN_PASS,
    },
  })
  const body = await response.json()
  this.token = body.token
})

Given('I am authenticated as user', async function (this: PlaywrightWorld) {
  const response = await this.apiRequest.post('/api/auth/login', {
    data: {
      username: process.env.TEST_USER,
      password: process.env.TEST_PASS,
    },
  })
  const body = await response.json()
  this.token = body.token
})

Given('I am logged in as admin', async function (this: PlaywrightWorld) {
  const response = await this.apiRequest.post('/api/auth/login', {
    data: {
      username: process.env.ADMIN_USER,
      password: process.env.ADMIN_PASS,
    },
  })
  const body = await response.json()
  this.token = body.token
  await this.context.addCookies([
    { name: 'token', value: this.token!, url: process.env.UI_BASE_URL! },
  ])
})

Given('I am logged in as user', async function (this: PlaywrightWorld) {
  const response = await this.apiRequest.post('/api/auth/login', {
    data: {
      username: process.env.TEST_USER,
      password: process.env.TEST_PASS,
    },
  })
  const body = await response.json()
  this.token = body.token
  await this.context.addCookies([
    { name: 'token', value: this.token!, url: process.env.UI_BASE_URL! },
  ])
})
