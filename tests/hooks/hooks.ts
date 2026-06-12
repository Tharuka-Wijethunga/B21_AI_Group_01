import { Before, After, BeforeAll, Status, setDefaultTimeout } from '@cucumber/cucumber'
import { chromium, request } from 'playwright'
import { PlaywrightWorld } from './world'
import { resetAndSeed } from './db.setup'
import * as dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env') })

setDefaultTimeout(30 * 1000)

// Reset the database to a known seed before every run so tests are repeatable
// (no leftover changes from a previous run breaking the next one).
BeforeAll(async function () {
  await resetAndSeed()
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
