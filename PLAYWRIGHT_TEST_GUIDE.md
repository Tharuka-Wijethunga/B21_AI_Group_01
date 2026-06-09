# Playwright + Cucumber + TypeScript — Test Authoring Guide
> **For AI agents and developers.** Follow these instructions exactly when creating, modifying, or extending tests in this project.

---

## Project Stack

| Tool | Purpose |
|---|---|
| Playwright | Test runner (UI + API) |
| Cucumber (`@cucumber/cucumber`) | BDD — `.feature` files in Gherkin |
| TypeScript | Language for all step definitions, page objects, hooks |
| Allure (`allure-cucumberjs`) | Test reporting |
| dotenv | Environment variable management |
| mysql2 | Database connectivity for pre-hook seeding |

---

## Folder Structure (canonical reference)

```
tests/
├── features/
│   ├── api/
│   │   ├── admin/
│   │   │   ├── categories.feature
│   │   │   ├── plants.feature
│   │   │   └── sales.feature
│   │   └── user/
│   │       ├── categories.feature
│   │       ├── plants.feature
│   │       └── sales.feature
│   └── ui/
│       ├── admin/
│       │   ├── categories.feature
│       │   ├── plants.feature
│       │   ├── dashboard.feature
│       │   └── sales.feature
│       └── user/
│           ├── categories.feature
│           ├── plants.feature
│           ├── dashboard.feature
│           └── sales.feature
├── step_definitions/
│   ├── common/
│   │   ├── auth.steps.ts
│   │   └── shared.steps.ts
│   ├── api/
│   │   ├── categories.steps.ts
│   │   ├── plants.steps.ts
│   │   └── sales.steps.ts
│   └── ui/
│       ├── categories.steps.ts
│       ├── plants.steps.ts
│       ├── dashboard.steps.ts
│       └── sales.steps.ts
├── pages/
│   ├── LoginPage.ts
│   ├── CategoryPage.ts
│   ├── DashboardPage.ts
│   ├── PlantPage.ts
│   └── SalesPage.ts
├── fixtures/
│   ├── admin.json
│   ├── user.json
│   └── testdata.json
└── hooks/
    ├── world.ts
    ├── hooks.ts
    └── db.setup.ts
cucumber.json
tsconfig.json
.env
```

---

## Folder & File Responsibilities

### `tests/features/`
Gherkin `.feature` files only. No TypeScript. No logic. Plain English scenarios using `Given / When / Then`.

| Subfolder | What goes here |
|---|---|
| `features/api/admin/` | API scenarios executed as Admin role |
| `features/api/user/` | API scenarios executed as User role |
| `features/ui/admin/` | Browser UI scenarios executed as Admin role |
| `features/ui/user/` | Browser UI scenarios executed as User role |

> **Note:** `dashboard.feature` exists under `ui/` only — not under `api/` — because the dashboard is a UI-only concept with no dedicated API module.

### `tests/step_definitions/`
TypeScript implementation of every Gherkin step. Mirrors the `features/` layout.

| Subfolder | What goes here |
|---|---|
| `common/auth.steps.ts` | Login steps shared across all features (`Given I am authenticated as admin`, `Given I am logged in as user`, etc.) |
| `common/shared.steps.ts` | Any other step reused across multiple modules (`Then the response status should be 200`, `Then I should see a success message`) |
| `api/categories.steps.ts` | Step implementations for `features/api/*/categories.feature` |
| `api/plants.steps.ts` | Step implementations for `features/api/*/plants.feature` |
| `api/sales.steps.ts` | Step implementations for `features/api/*/sales.feature` |
| `ui/categories.steps.ts` | Step implementations for `features/ui/*/categories.feature` |
| `ui/plants.steps.ts` | Step implementations for `features/ui/*/plants.feature` |
| `ui/dashboard.steps.ts` | Step implementations for `features/ui/*/dashboard.feature` |
| `ui/sales.steps.ts` | Step implementations for `features/ui/*/sales.feature` |

> **Note:** `api/` has no `dashboard.steps.ts` because there is no API dashboard module.

### `tests/pages/`
Page Object Model (POM) classes. Each file maps to one page/section of the frontend UI. Owns all selectors — step definitions must never contain raw selectors. **Every Page Object receives a `Page` instance via constructor injection.**

| File | Covers |
|---|---|
| `LoginPage.ts` | Login page — `navigate()`, `enterEmail()`, `enterPassword()`, `submit()` |
| `DashboardPage.ts` | Dashboard page — stat cards, navigation links, visible widgets |
| `CategoryPage.ts` | Category management page — add, edit, delete, list |
| `PlantPage.ts` | Plant management page — add, edit, delete, list |
| `SalesPage.ts` | Sales management page — add, edit, delete, list |

### `tests/fixtures/`
Static JSON test data. Loaded via `import` or `require()`. Never put raw test values inside step definitions.

| File | Contains |
|---|---|
| `testdata.json` | Shared data used by both roles (new entity names, search terms, expected counts) |
| `admin.json` | Admin-specific test data |
| `user.json` | User-specific test data |

### `tests/hooks/`
Cucumber lifecycle hooks and the shared World class. Loaded automatically by Cucumber before every scenario.

| File | Purpose |
|---|---|
| `world.ts` | `PlaywrightWorld` class — holds `page`, `apiRequest`, `response`, `token` shared across all steps in a scenario |
| `hooks.ts` | `Before` / `After` / `BeforeAll` / `AfterAll` hooks — browser lifecycle, Allure attachment, DB seeding check |
| `db.setup.ts` | Database seed helper — checks row counts and seeds via `mysql2` if tables are empty |

---

## The World Object

The `PlaywrightWorld` class is the replacement for Cypress aliases and `this` context. It lives for the duration of one scenario and is shared across all step definitions in that scenario.

```ts
// tests/hooks/world.ts
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

  constructor(options: IWorldOptions) {
    super(options)
  }
}

setWorldConstructor(PlaywrightWorld)
```

**Access pattern in step definitions:**

```ts
import { When } from '@cucumber/cucumber'
import { PlaywrightWorld } from '../../hooks/world'

When('I send a GET request to {string}', async function (this: PlaywrightWorld, endpoint: string) {
  this.response = await this.apiRequest.get(endpoint, {
    headers: { Authorization: `Bearer ${this.token}` },
  })
})
```

> Always type the step function with `this: PlaywrightWorld` so TypeScript knows what properties are available on `this`.

---

## Hooks — Browser Lifecycle and DB Seeding

```ts
// tests/hooks/hooks.ts
import { Before, After, BeforeAll, AfterAll, Status } from '@cucumber/cucumber'
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
```

---

## Rules — Read Before Creating Any File

### RULE 1 — Feature files go in `features/`, never in `step_definitions/`
`.feature` files are Gherkin only — no TypeScript, no logic.
Step implementation always goes in the matching `.steps.ts` file.

### RULE 2 — `features/` path mirrors `step_definitions/` path

| Feature file | Step definition file |
|---|---|
| `features/api/admin/categories.feature` | `step_definitions/api/categories.steps.ts` |
| `features/api/user/plants.feature` | `step_definitions/api/plants.steps.ts` |
| `features/ui/admin/dashboard.feature` | `step_definitions/ui/dashboard.steps.ts` |
| `features/ui/user/sales.feature` | `step_definitions/ui/sales.steps.ts` |
| Any feature using login steps | `step_definitions/common/auth.steps.ts` |

### RULE 3 — Never duplicate shared steps
Before writing any new `Given / When / Then`, check `common/auth.steps.ts` and `common/shared.steps.ts` first.
If the step already exists there, reuse it in the `.feature` file — do not redefine it anywhere else.

### RULE 4 — API steps never touch the DOM
Files under `step_definitions/api/` must only use `this.apiRequest` (Playwright `APIRequestContext`).
Never use `this.page.goto()`, `this.page.click()`, or any DOM interaction in API step definitions.

### RULE 5 — UI steps never call raw API endpoints for business logic
Files under `step_definitions/ui/` interact through the browser only.
**Exception:** `loginAsAdmin()` / `loginAsUser()` helpers in `common/auth.steps.ts` may be used in `Background` blocks for session setup — this is an intentional shortcut, not a violation.

### RULE 6 — Page Objects own all selectors
Never hardcode a CSS selector or `data-cy` attribute inside a step definition.
Always put selectors in the relevant Page Object under `tests/pages/`.

```ts
// ✅ CORRECT — selector lives in the Page Object
import { CategoryPage } from '../../../pages/CategoryPage'

When('I click Add Category', async function (this: PlaywrightWorld) {
  const categoryPage = new CategoryPage(this.page)
  await categoryPage.clickAddCategory()
})

// ❌ WRONG — selector hardcoded in step definition
When('I click Add Category', async function (this: PlaywrightWorld) {
  await this.page.click('[data-cy=add-category-btn]')
})
```

### RULE 7 — Page Objects receive `page` via constructor, never as a singleton
Playwright's `Page` is scenario-scoped (created fresh in `Before`). Never export a `new CategoryPage()` singleton.
Always instantiate inside step definitions: `const categoryPage = new CategoryPage(this.page)`.

```ts
// ✅ CORRECT
export class CategoryPage {
  constructor(private readonly page: Page) {}
  async clickAddCategory(): Promise<void> {
    await this.page.locator('[data-cy=add-category-btn]').click()
  }
}

// ❌ WRONG — singleton breaks parallel test isolation
export default new CategoryPage()
```

### RULE 8 — All step functions must be `async` and use `await`
Playwright operations are Promise-based. Forgetting `await` causes flaky tests with no error.

```ts
// ✅ CORRECT
When('I submit the form', async function (this: PlaywrightWorld) {
  const categoryPage = new CategoryPage(this.page)
  await categoryPage.submit()
})

// ❌ WRONG — missing async/await
When('I submit the form', function (this: PlaywrightWorld) {
  const categoryPage = new CategoryPage(this.page)
  categoryPage.submit()  // fire-and-forget, will not wait
})
```

### RULE 9 — Test data goes in `fixtures/`, never hardcoded in steps

```ts
// ✅ CORRECT
import testdata from '../../../fixtures/testdata.json'

When('I send a POST request to create a category', async function (this: PlaywrightWorld) {
  this.response = await this.apiRequest.post('/categories', {
    headers: { Authorization: `Bearer ${this.token}` },
    data: { name: testdata.newCategory.name },
  })
})

// ❌ WRONG
this.response = await this.apiRequest.post('/categories', {
  data: { name: 'Tropical Plants' },
})
```

### RULE 10 — Credentials and URLs come from `.env` via `process.env` only

```ts
// ✅ CORRECT
const apiUrl = process.env.API_BASE_URL
const adminUser = process.env.ADMIN_USER

// ❌ WRONG
'http://localhost:8080/api'
'admin@example.com'
```

### RULE 11 — Store response and token on the World object, not in module-level variables
Module-level variables are shared across scenarios and will cause cross-contamination.

```ts
// ✅ CORRECT — response stored on this (scenario-scoped)
When('I send a GET request to {string}', async function (this: PlaywrightWorld, endpoint: string) {
  this.response = await this.apiRequest.get(endpoint, {
    headers: { Authorization: `Bearer ${this.token}` },
  })
})

// ❌ WRONG — module-level variable shared across scenarios
let response: APIResponse

When('I send a GET request to {string}', async function (this: PlaywrightWorld, endpoint: string) {
  response = await this.apiRequest.get(endpoint)
})
```

---

## How to Create a New API Test

### Step 1 — Write the feature file
**Location:** `tests/features/api/{admin|user}/{module}.feature`

```gherkin
Feature: Admin - Categories API

  Background:
    Given I am authenticated as admin

  Scenario: Admin can retrieve all categories
    When I send a GET request to "/categories"
    Then the response status should be 200
    And the response should return a list

  Scenario: Admin can create a new category
    When I send a POST request to "/categories" with body from fixture "newCategory"
    Then the response status should be 201
    And the response body should contain the created category name
```

### Step 2 — Add fixture data if needed
**Location:** `tests/fixtures/testdata.json`

```json
{
  "newCategory": {
    "name": "Bromeliad"
  }
}
```

### Step 3 — Write the step definition file
**Location:** `tests/step_definitions/api/{module}.steps.ts`

```ts
import { When, Then } from '@cucumber/cucumber'
import { PlaywrightWorld } from '../../hooks/world'
import testdata from '../../../fixtures/testdata.json'

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
  }
)

Then('the response status should be {int}', async function (this: PlaywrightWorld, status: number) {
  expect(this.response.status()).toBe(status)
})

Then('the response should return a list', async function (this: PlaywrightWorld) {
  const body = await this.response.json()
  expect(Array.isArray(body)).toBe(true)
})

Then('the response body should contain the created category name',
  async function (this: PlaywrightWorld) {
    const body = await this.response.json()
    expect(body.name).toBe(testdata.newCategory.name)
  }
)
```

> `Given I am authenticated as admin` is already defined in `common/auth.steps.ts` — do not redefine it.

---

## How to Create a New UI Test

### Step 1 — Write the feature file
**Location:** `tests/features/ui/{admin|user}/{module}.feature`

```gherkin
Feature: Admin - Category Management UI

  Background:
    Given I am logged in as admin

  Scenario: Admin can add a new category
    When I navigate to the categories page
    And I click Add Category
    And I fill in the category name with fixture data "newCategory"
    And I submit the form
    Then I should see the new category in the list
```

### Step 2 — Create or update the Page Object
**Location:** `tests/pages/{Module}Page.ts`

```ts
import { Page, Locator } from 'playwright'

export class CategoryPage {
  private readonly addBtn: Locator
  private readonly nameInput: Locator
  private readonly submitBtn: Locator
  private readonly categoryList: Locator

  constructor(private readonly page: Page) {
    this.addBtn = page.locator('[data-cy=add-category-btn]')
    this.nameInput = page.locator('[data-cy=category-name-input]')
    this.submitBtn = page.locator('[data-cy=submit-btn]')
    this.categoryList = page.locator('[data-cy=category-list]')
  }

  async navigate(): Promise<void> {
    await this.page.goto('/admin/categories')
  }

  async clickAddCategory(): Promise<void> {
    await this.addBtn.click()
  }

  async fillName(name: string): Promise<void> {
    await this.nameInput.clear()
    await this.nameInput.fill(name)
  }

  async submit(): Promise<void> {
    await this.submitBtn.click()
  }

  async expectListContains(text: string): Promise<void> {
    await this.categoryList.getByText(text).waitFor({ state: 'visible' })
  }
}
```

### Step 3 — Write the step definition file
**Location:** `tests/step_definitions/ui/{module}.steps.ts`

```ts
import { When, Then } from '@cucumber/cucumber'
import { PlaywrightWorld } from '../../hooks/world'
import { CategoryPage } from '../../../pages/CategoryPage'
import testdata from '../../../fixtures/testdata.json'

When('I navigate to the categories page', async function (this: PlaywrightWorld) {
  const categoryPage = new CategoryPage(this.page)
  await categoryPage.navigate()
})

When('I click Add Category', async function (this: PlaywrightWorld) {
  const categoryPage = new CategoryPage(this.page)
  await categoryPage.clickAddCategory()
})

When('I fill in the category name with fixture data {string}',
  async function (this: PlaywrightWorld, fixtureKey: string) {
    const name = (testdata as Record<string, any>)[fixtureKey].name
    const categoryPage = new CategoryPage(this.page)
    await categoryPage.fillName(name)
  }
)

When('I submit the form', async function (this: PlaywrightWorld) {
  const categoryPage = new CategoryPage(this.page)
  await categoryPage.submit()
})

Then('I should see the new category in the list', async function (this: PlaywrightWorld) {
  const categoryPage = new CategoryPage(this.page)
  await categoryPage.expectListContains(testdata.newCategory.name)
})
```

> `Given I am logged in as admin` is already defined in `common/auth.steps.ts` — do not redefine it.

---

## How to Create a Dashboard UI Test

Dashboard tests are **UI only** — there is no `features/api/*/dashboard.feature` or `step_definitions/api/dashboard.steps.ts`.

**Feature file location:** `tests/features/ui/{admin|user}/dashboard.feature`
**Step definition location:** `tests/step_definitions/ui/dashboard.steps.ts`
**Page Object location:** `tests/pages/DashboardPage.ts`

```gherkin
Feature: Admin - Dashboard UI

  Background:
    Given I am logged in as admin

  Scenario: Admin sees the dashboard after login
    When I navigate to the dashboard
    Then I should see the summary statistics
    And I should see the navigation menu
```

```ts
// tests/pages/DashboardPage.ts
import { Page, Locator } from 'playwright'

export class DashboardPage {
  private readonly statsWidget: Locator
  private readonly navMenu: Locator

  constructor(private readonly page: Page) {
    this.statsWidget = page.locator('[data-cy=stats-widget]')
    this.navMenu = page.locator('[data-cy=nav-menu]')
  }

  async navigate(): Promise<void> {
    await this.page.goto('/dashboard')
  }

  async expectStatsVisible(): Promise<void> {
    await this.statsWidget.waitFor({ state: 'visible' })
  }

  async expectNavMenuVisible(): Promise<void> {
    await this.navMenu.waitFor({ state: 'visible' })
  }
}
```

---

## How to Add a Shared/Common Step

Only add to `common/` if the step is reused across **more than one module**.

**File:** `tests/step_definitions/common/shared.steps.ts`

```ts
import { Then } from '@cucumber/cucumber'
import { PlaywrightWorld } from '../../hooks/world'

Then('the response status should be {int}', async function (this: PlaywrightWorld, status: number) {
  expect(this.response.status()).toBe(status)
})

Then('I should see a success message', async function (this: PlaywrightWorld) {
  await this.page.locator('[data-cy=success-toast]').waitFor({ state: 'visible' })
})

Then('I should be redirected to {string}', async function (this: PlaywrightWorld, path: string) {
  await this.page.waitForURL(`**${path}`)
})
```

---

## How Auth Steps Work (replacing `commands.ts`)

Playwright has no `cy.loginAsAdmin()` equivalent. Login helpers live in `common/auth.steps.ts` and operate on `this.apiRequest` to obtain a token, storing it on `this.token`.

```ts
// tests/step_definitions/common/auth.steps.ts
import { Given } from '@cucumber/cucumber'
import { PlaywrightWorld } from '../../hooks/world'

Given('I am authenticated as admin', async function (this: PlaywrightWorld) {
  const response = await this.apiRequest.post('/auth/login', {
    data: {
      username: process.env.ADMIN_USER,
      password: process.env.ADMIN_PASS,
    },
  })
  const body = await response.json()
  this.token = body.token
})

Given('I am authenticated as user', async function (this: PlaywrightWorld) {
  const response = await this.apiRequest.post('/auth/login', {
    data: {
      username: process.env.TEST_USER,
      password: process.env.TEST_PASS,
    },
  })
  const body = await response.json()
  this.token = body.token
})

Given('I am logged in as admin', async function (this: PlaywrightWorld) {
  // Obtain token via API then inject into browser storage
  const response = await this.apiRequest.post('/auth/login', {
    data: {
      username: process.env.ADMIN_USER,
      password: process.env.ADMIN_PASS,
    },
  })
  const body = await response.json()
  this.token = body.token
  await this.context.addCookies([
    { name: 'token', value: this.token, url: process.env.UI_BASE_URL! },
  ])
})

Given('I am logged in as user', async function (this: PlaywrightWorld) {
  const response = await this.apiRequest.post('/auth/login', {
    data: {
      username: process.env.TEST_USER,
      password: process.env.TEST_PASS,
    },
  })
  const body = await response.json()
  this.token = body.token
  await this.context.addCookies([
    { name: 'token', value: this.token, url: process.env.UI_BASE_URL! },
  ])
})
```

---

## Database Seeding Pre-Hook

The `BeforeAll` hook in `hooks.ts` calls `ensureSeedData()` from `db.setup.ts` before any scenario runs. It connects to the database via `mysql2`, checks row counts, and seeds only if the tables are empty.

See `tests/hooks/db.setup.ts` for the full implementation.

### `.env` variables required for DB seeding

```
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=qa_training_db
```

---

## File Naming Conventions

| File type | Convention | Example |
|---|---|---|
| Feature files | `{module}.feature` (lowercase) | `categories.feature` |
| Step definitions | `{module}.steps.ts` (lowercase) | `categories.steps.ts` |
| Page Objects | `{Module}Page.ts` (PascalCase, named export) | `CategoryPage.ts` |
| Fixtures | `{context}.json` (camelCase) | `testdata.json` |
| Hooks / World | kebab-case or camelCase | `hooks.ts`, `world.ts`, `db.setup.ts` |

---

## Module → File Mapping (complete reference)

| Module | Feature (API Admin) | Feature (API User) | Feature (UI Admin) | Feature (UI User) | Steps (API) | Steps (UI) | Page Object |
|---|---|---|---|---|---|---|---|
| Categories | ✅ | ✅ | ✅ | ✅ | `api/categories.steps.ts` | `ui/categories.steps.ts` | `CategoryPage.ts` |
| Plants | ✅ | ✅ | ✅ | ✅ | `api/plants.steps.ts` | `ui/plants.steps.ts` | `PlantPage.ts` |
| Sales | ✅ | ✅ | ✅ | ✅ | `api/sales.steps.ts` | `ui/sales.steps.ts` | `SalesPage.ts` |
| Dashboard | ❌ | ❌ | ✅ | ✅ | ❌ none | `ui/dashboard.steps.ts` | `DashboardPage.ts` |
| Auth/Login | shared | shared | shared | shared | `common/auth.steps.ts` | `common/auth.steps.ts` | `LoginPage.ts` |

---

## Quick Decision Tree — Where Does My Code Go?

```
Is it a test scenario in plain English (Gherkin)?
└── YES → .feature file in tests/features/{api|ui}/{admin|user}/
           Is it dashboard related?
           └── YES → ui/{admin|user}/dashboard.feature only (no api equivalent)

Is it TypeScript implementing a Gherkin step?
├── Reused across multiple modules?  → step_definitions/common/shared.steps.ts
├── It's a login/auth step?          → step_definitions/common/auth.steps.ts
├── It's an API step?                → step_definitions/api/{module}.steps.ts
└── It's a UI step?                  → step_definitions/ui/{module}.steps.ts

Is it a CSS selector or UI interaction method?
└── YES → tests/pages/{Module}Page.ts  (constructor receives Page instance)

Is it scenario-scoped shared state (token, response, page)?
└── YES → PlaywrightWorld property in tests/hooks/world.ts

Is it a global setup action (DB seeding, one-time config)?
└── YES → BeforeAll hook in tests/hooks/hooks.ts
           └── Heavy logic goes in tests/hooks/db.setup.ts

Is it static test data (names, values, payloads)?
├── Shared across both roles? → fixtures/testdata.json
├── Admin specific?           → fixtures/admin.json
└── User specific?            → fixtures/user.json

Is it a credential, base URL, or DB connection string?
└── YES → .env file only — never in any TypeScript file
```

---

## Cucumber Configuration (`cucumber.json`)

```json
{
  "default": {
    "require": [
      "tests/hooks/world.ts",
      "tests/hooks/hooks.ts",
      "tests/hooks/db.setup.ts",
      "tests/step_definitions/**/*.steps.ts"
    ],
    "paths": ["tests/features/**/*.feature"],
    "requireModule": ["ts-node/register"],
    "format": [
      "allure-cucumberjs/reporter",
      "progress-bar"
    ],
    "formatOptions": {
      "resultsDir": "allure-results"
    }
  }
}
```

---

## Running Tests

```bash
# Run all tests
npx cucumber-js

# Run API tests only
npx cucumber-js --paths "tests/features/api/**/*.feature"

# Run UI tests only
npx cucumber-js --paths "tests/features/ui/**/*.feature"

# Run admin tests only
npx cucumber-js --paths "tests/features/**/admin/*.feature"

# Run a specific module
npx cucumber-js --paths "tests/features/api/admin/categories.feature"

# Generate and open Allure report
npx allure generate allure-results --clean -o allure-report && npx allure open allure-report
```

## Running Tests by Tags

```bash
# Run only API tests
npx cucumber-js --tags "@api"

# Run tests that have both @api AND @admin
npx cucumber-js --tags "@api and @admin"

# Run tests that have @api but NOT @admin
npx cucumber-js --tags "@api and not @admin"

# Run only UI tests for admin
npx cucumber-js --tags "@ui and @admin"
```

---

## Key Differences from Cypress (migration reference)

| Cypress | Playwright equivalent |
|---|---|
| `cy.visit('/path')` | `await this.page.goto('/path')` |
| `cy.get('[data-cy=x]').click()` | `await this.page.locator('[data-cy=x]').click()` |
| `cy.get('[data-cy=x]').should('be.visible')` | `await this.page.locator('[data-cy=x]').waitFor({ state: 'visible' })` |
| `cy.get('[data-cy=x]').should('contain', 'text')` | `await expect(this.page.locator('[data-cy=x]')).toContainText('text')` |
| `cy.request('GET', url, opts)` | `await this.apiRequest.get(url, opts)` |
| `cy.wrap(value).as('alias')` | `this.token = value` (World property) |
| `cy.get('@alias')` | `this.token` |
| `cy.fixture('testdata')` | `import testdata from '../fixtures/testdata.json'` |
| `Cypress.env('API_URL')` | `process.env.API_BASE_URL` |
| `Cypress.Commands.add(...)` | Method on `PlaywrightWorld` or shared helper function |
| `support/e2e.ts` beforeEach | `Before` hook in `tests/hooks/hooks.ts` |
| `support/commands.ts` | `common/auth.steps.ts` + `PlaywrightWorld` methods |
| `response.status` | `response.status()` (it's a method, not a property) |
| `response.body` | `await response.json()` (async) |
