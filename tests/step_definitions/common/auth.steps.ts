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
  await this.page.goto('/ui/login')
  await this.page.fill('input[name="username"]', process.env.ADMIN_USER!)
  await this.page.fill('input[name="password"]', process.env.ADMIN_PASS!)
  await this.page.click('button[type="submit"]')
  await this.page.waitForLoadState('networkidle')
})

Given('I am logged in as user', async function (this: PlaywrightWorld) {
  await this.page.goto('/ui/login')
  await this.page.fill('input[name="username"]', process.env.TEST_USER!)
  await this.page.fill('input[name="password"]', process.env.TEST_PASS!)
  await this.page.click('button[type="submit"]')
  await this.page.waitForLoadState('networkidle')
})
