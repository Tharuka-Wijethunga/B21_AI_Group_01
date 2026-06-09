import { Before, After, BeforeAll, Status } from '@cucumber/cucumber'
import { chromium, request } from 'playwright'
import { PlaywrightWorld } from './world'
import { ensureSeedData } from './db.setup'
import * as dotenv from 'dotenv'

dotenv.config()

BeforeAll(async function () {
  await ensureSeedData()
})

Before(async function (this: PlaywrightWorld) {
  this.browser = await chromium.launch({ headless: true })
  this.context = await this.browser.newContext({
    baseURL: process.env.UI_BASE_URL,
  })
  this.page = await this.context.newPage()
  this.apiRequest = await request.newContext({
    baseURL: process.env.API_BASE_URL,
  })
})

After(async function (this: PlaywrightWorld, scenario) {
  if (scenario.result?.status === Status.FAILED) {
    const screenshot = await this.page.screenshot({ fullPage: true })
    this.attach(screenshot, 'image/png')
  }
  await this.page.close()
  await this.context.close()
  await this.browser.close()
  await this.apiRequest.dispose()
})
