import { World, IWorldOptions, setWorldConstructor } from '@cucumber/cucumber'
import {
  Browser,
  BrowserContext,
  Page,
  APIRequestContext,
  APIResponse,
} from 'playwright'

export class PlaywrightWorld extends World {
  browser!: Browser
  context!: BrowserContext
  page!: Page
  apiRequest!: APIRequestContext
  response!: APIResponse
  token: string = ''
  userToken?: string
  deletedSaleFormAction?: string
  tempSaleId?: number
  lastCreatedSaleId?: number
  lastSearchTerm: string = ''
  selectedParentLabel: string = ''
  lastCreatedCategoryId: number = 0
  tempCategoryId: number = 0

  constructor(options: IWorldOptions) {
    super(options)
  }
}

setWorldConstructor(PlaywrightWorld)
