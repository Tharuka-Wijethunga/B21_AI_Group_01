# Cypress + Cucumber + TypeScript — Test Authoring Guide
> **For AI agents and developers.** Follow these instructions exactly when creating, modifying, or extending tests in this project.

---

## Project Stack

| Tool | Purpose |
|---|---|
| Cypress | Test runner (UI + API) |
| Cucumber (`@badeball/cypress-cucumber-preprocessor`) | BDD — `.feature` files in Gherkin |
| TypeScript | Language for all step definitions, commands, page objects |
| Allure | Test reporting |
| dotenv | Environment variable management |

---

## Folder Structure (canonical reference)

```
cypress/
├── e2e/
│   ├── features/
│   │   ├── api/
│   │   │   ├── admin/
│   │   │   │   ├── categories.feature
│   │   │   │   ├── plants.feature
│   │   │   │   └── sales.feature
│   │   │   └── user/
│   │   │       ├── categories.feature
│   │   │       ├── plants.feature
│   │   │       └── sales.feature
│   │   └── ui/
│   │       ├── admin/
│   │       │   ├── categories.feature
│   │       │   ├── plants.feature
│   │       │   ├── dashboard.feature
│   │       │   └── sales.feature
│   │       └── user/
│   │           ├── categories.feature
│   │           ├── plants.feature
│   │           ├── dashboard.feature
│   │           └── sales.feature
│   └── step_definitions/
│       ├── common/
│       │   ├── auth.steps.ts
│       │   └── shared.steps.ts
│       ├── api/
│       │   ├── categories.steps.ts
│       │   ├── plants.steps.ts
│       │   └── sales.steps.ts
│       └── ui/
│           ├── categories.steps.ts
│           ├── plants.steps.ts
│           ├── dashboard.steps.ts
│           └── sales.steps.ts
├── support/
│   ├── commands.ts
│   ├── e2e.ts
│   ├── index.d.ts
│   └── pages/
│       ├── LoginPage.ts
│       ├── CategoryPage.ts
│       ├── DashboardPage.ts
│       ├── PlantPage.ts
│       └── SalesPage.ts
├── fixtures/
│   ├── admin.json
│   ├── user.json
│   └── testdata.json
└── tsconfig.json
```

---

## Folder & File Responsibilities

### `e2e/features/`
Gherkin `.feature` files only. No TypeScript. No logic. Plain English scenarios using `Given / When / Then`.

| Subfolder | What goes here |
|---|---|
| `features/api/admin/` | API scenarios executed as Admin role |
| `features/api/user/` | API scenarios executed as User role |
| `features/ui/admin/` | Browser UI scenarios executed as Admin role |
| `features/ui/user/` | Browser UI scenarios executed as User role |

> **Note:** `dashboard.feature` exists under `ui/` only — not under `api/` — because the dashboard is a UI-only concept with no dedicated API module.

### `e2e/step_definitions/`
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

### `support/`
Global helpers loaded automatically before every test via `e2e.ts`.

| File | Purpose |
|---|---|
| `e2e.ts` | Entry point — imports commands, Allure, and global hooks (`beforeEach`, `afterEach`) |
| `commands.ts` | Custom `cy.xxx()` commands (`cy.loginAsAdmin()`, `cy.loginAsUser()`, etc.) |
| `index.d.ts` | TypeScript type declarations for every custom command in `commands.ts` |

### `support/pages/`
Page Object Model (POM) classes. Each file maps to one page/section of the frontend UI. Owns all CSS selectors — step definitions must never contain raw selectors.

| File | Covers |
|---|---|
| `LoginPage.ts` | Login page — `visit()`, `enterEmail()`, `enterPassword()`, `submit()` |
| `DashboardPage.ts` | Dashboard page — stat cards, navigation links, visible widgets |
| `CategoryPage.ts` | Category management page — add, edit, delete, list |
| `PlantPage.ts` | Plant management page — add, edit, delete, list |
| `SalesPage.ts` | Sales management page — add, edit, delete, list |

### `fixtures/`
Static JSON test data. Loaded via `cy.fixture()`. Never put raw test values inside step definitions.

| File | Contains |
|---|---|
| `testdata.json` | Shared data used by both roles (new entity names, search terms, expected counts) |
| `admin.json` | Admin-specific test data |
| `user.json` | User-specific test data |

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
Files under `step_definitions/api/` must only use `cy.request()`.
Never use `cy.visit()`, `cy.get()`, or any DOM interaction in API step definitions.

### RULE 5 — UI steps never call raw API endpoints for business logic
Files under `step_definitions/ui/` interact through the browser only.
**Exception:** `cy.loginAsAdmin()` / `cy.loginAsUser()` from `commands.ts` may be used in `Background` blocks for session setup — this is an intentional shortcut, not a violation.

### RULE 6 — Page Objects own all selectors
Never hardcode a CSS selector or `data-cy` attribute inside a step definition.
Always put selectors in the relevant Page Object under `support/pages/`.

```ts
// ✅ CORRECT — selector lives in the Page Object
import CategoryPage from '../../../support/pages/CategoryPage'
When('I click Add Category', () => {
  CategoryPage.clickAddCategory()
})

// ❌ WRONG — selector hardcoded in step definition
When('I click Add Category', () => {
  cy.get('[data-cy=add-category-btn]').click()
})
```

### RULE 7 — Custom commands go in `commands.ts`, types go in `index.d.ts`
Every `Cypress.Commands.add(...)` in `commands.ts` must have a matching type in `index.d.ts`.
Both are mandatory — missing the type declaration causes a TypeScript compile error.

### RULE 8 — Use `function()` not arrow functions when accessing aliases
Cypress aliases set with `cy.wrap().as('token')` are accessed via `this.token`.
Arrow functions do not bind `this` — use `function()` in any step that reads an alias.

```ts
// ✅ CORRECT
When('I send a GET request to {string}', function (endpoint: string) {
  cy.get('@token').then((token) => {
    cy.env(['apiUrl']).then(({ apiUrl }) => {
      cy.request({
        method: 'GET',
        url: `${apiUrl}${endpoint}`,
        headers: { Authorization: `Bearer ${token}` },
      }).as('response')
    })
  })
})

// ❌ WRONG — arrow function, this.token is undefined
When('I send a GET request to {string}', (endpoint: string) => {
  // this.token does not exist here
})
```

### RULE 9 — Test data goes in `fixtures/`, never hardcoded in steps

```ts
// ✅ CORRECT
cy.fixture('testdata').then((data) => {
  cy.env(['apiUrl']).then(({ apiUrl }) => {
    cy.request('POST', `${apiUrl}/categories`, { name: data.newCategory.name })
  })
})

// ❌ WRONG
cy.request('POST', `${Cypress.env('apiUrl')}/categories`, { name: 'Tropical Plants' })
```

### RULE 10 — Credentials and URLs come from Cypress environment variables only

```ts
// ✅ CORRECT
cy.env(['apiUrl', 'adminUser']).then((env: any) => {
  // Use env.apiUrl and env.adminUser here
})

// ❌ WRONG
'http://localhost:3000/api'
'admin@example.com'
```

---

## How to Create a New API Test

### Step 1 — Write the feature file
**Location:** `cypress/e2e/features/api/{admin|user}/{module}.feature`

```gherkin
Feature: Admin - Categories API

  Background:
    Given I am authenticated as admin

  Scenario: Admin can retrieve all categories
    When I send a GET request to "/categories"
    Then the response status should be 200
    And the response should return a list

  Scenario: Admin can create a new category
    When I send a POST request to "/categories" with fixture data "newCategory"
    Then the response status should be 201
    And the response body should contain the created category name
```

### Step 2 — Add fixture data if needed
**Location:** `cypress/fixtures/testdata.json`

```json
{
  "newCategory": {
    "name": "Tropical Plants"
  }
}
```

### Step 3 — Write the step definition file
**Location:** `cypress/e2e/step_definitions/api/{module}.steps.ts`

```ts
import { When, Then } from '@badeball/cypress-cucumber-preprocessor'

let response: Cypress.Response<any>

When('I send a GET request to {string}', function (endpoint: string) {
  cy.get('@token').then((token) => {
    cy.env(['apiUrl']).then(({ apiUrl }) => {
      cy.request({
        method: 'GET',
        url: `${apiUrl}${endpoint}`,
        headers: { Authorization: `Bearer ${token}` },
      }).then((res) => { response = res })
    })
  })
})

Then('the response status should be {int}', (status: number) => {
  expect(response.status).to.eq(status)
})

Then('the response should return a list', () => {
  expect(response.body).to.be.an('array')
})
```

> `Given I am authenticated as admin` is already defined in `common/auth.steps.ts` — do not redefine it.

---

## How to Create a New UI Test

### Step 1 — Write the feature file
**Location:** `cypress/e2e/features/ui/{admin|user}/{module}.feature`

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

### Step 2 — Add or update the Page Object
**Location:** `cypress/support/pages/{Module}Page.ts`

```ts
class CategoryPage {
  private addBtn = '[data-cy=add-category-btn]'
  private nameInput = '[data-cy=category-name-input]'
  private submitBtn = '[data-cy=submit-btn]'
  private categoryList = '[data-cy=category-list]'

  navigate(): void {
    cy.visit('/admin/categories')
  }

  clickAddCategory(): void {
    cy.get(this.addBtn).click()
  }

  fillName(name: string): void {
    cy.get(this.nameInput).clear().type(name)
  }

  submit(): void {
    cy.get(this.submitBtn).click()
  }

  getList(): Cypress.Chainable {
    return cy.get(this.categoryList)
  }
}

export default new CategoryPage()
```

### Step 3 — Write the step definition file
**Location:** `cypress/e2e/step_definitions/ui/{module}.steps.ts`

```ts
import { When, Then } from '@badeball/cypress-cucumber-preprocessor'
import CategoryPage from '../../../support/pages/CategoryPage'

When('I navigate to the categories page', () => {
  CategoryPage.navigate()
})

When('I click Add Category', () => {
  CategoryPage.clickAddCategory()
})

When('I fill in the category name with fixture data {string}', (fixtureKey: string) => {
  cy.fixture('testdata').then((data) => {
    CategoryPage.fillName(data[fixtureKey].name)
  })
})

When('I submit the form', () => {
  CategoryPage.submit()
})

Then('I should see the new category in the list', () => {
  cy.fixture('testdata').then((data) => {
    CategoryPage.getList().should('contain', data.newCategory.name)
  })
})
```

> `Given I am logged in as admin` is already defined in `common/auth.steps.ts` — do not redefine it.

---

## How to Create a Dashboard UI Test

Dashboard tests are **UI only** — there is no `features/api/*/dashboard.feature` or `step_definitions/api/dashboard.steps.ts`.

**Feature file location:** `cypress/e2e/features/ui/{admin|user}/dashboard.feature`
**Step definition location:** `cypress/e2e/step_definitions/ui/dashboard.steps.ts`
**Page Object location:** `cypress/support/pages/DashboardPage.ts`

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
// support/pages/DashboardPage.ts
class DashboardPage {
  private statsWidget = '[data-cy=stats-widget]'
  private navMenu = '[data-cy=nav-menu]'

  navigate(): void {
    cy.visit('/dashboard')
  }

  getStats(): Cypress.Chainable {
    return cy.get(this.statsWidget)
  }

  getNavMenu(): Cypress.Chainable {
    return cy.get(this.navMenu)
  }
}

export default new DashboardPage()
```

---

## How to Add a Shared/Common Step

Only add to `common/` if the step is reused across **more than one module**.

**File:** `cypress/e2e/step_definitions/common/shared.steps.ts`

```ts
import { Then } from '@badeball/cypress-cucumber-preprocessor'

Then('the response status should be {int}', (status: number) => {
  cy.get('@response').its('status').should('eq', status)
})

Then('I should see a success message', () => {
  cy.get('[data-cy=success-toast]').should('be.visible')
})

Then('I should be redirected to {string}', (path: string) => {
  cy.url().should('include', path)
})
```

---

## How to Add a Custom Cypress Command

### Step 1 — Add to `commands.ts`

```ts
// cypress/support/commands.ts
Cypress.Commands.add('loginAsAdmin', () => {
  cy.env(['apiUrl', 'adminUser', 'adminPass']).then((env: any) => {
    cy.request('POST', `${env.apiUrl}/auth/login`, {
      username: env.adminUser,
      password: env.adminPass,
    }).then((res: Cypress.Response<any>) => {
      cy.wrap(res.body.token).as('token')
    })
  })
})

Cypress.Commands.add('loginAsUser', () => {
  cy.env(['apiUrl', 'testUser', 'testPass']).then((env: any) => {
    cy.request('POST', `${env.apiUrl}/auth/login`, {
      username: env.testUser,
      password: env.testPass,
    }).then((res: Cypress.Response<any>) => {
      cy.wrap(res.body.token).as('token')
    })
  })
})
```

### Step 2 — Declare the type in `index.d.ts`

```ts
// cypress/support/index.d.ts
declare namespace Cypress {
  interface Chainable {
    loginAsAdmin(): Chainable<string>
    loginAsUser(): Chainable<string>
  }
}
```

Both steps are mandatory. Skipping Step 2 causes a TypeScript compile error.

---

## File Naming Conventions

| File type | Convention | Example |
|---|---|---|
| Feature files | `{module}.feature` (lowercase) | `categories.feature` |
| Step definitions | `{module}.steps.ts` (lowercase) | `categories.steps.ts` |
| Page Objects | `{Module}Page.ts` (PascalCase) | `CategoryPage.ts` |
| Fixtures | `{context}.json` (camelCase) | `testdata.json` |
| Commands | All in one file | `commands.ts` |

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
└── YES → .feature file in cypress/e2e/features/{api|ui}/{admin|user}/
           Is it dashboard related?
           └── YES → ui/{admin|user}/dashboard.feature only (no api equivalent)

Is it TypeScript implementing a Gherkin step?
├── Reused across multiple modules?  → step_definitions/common/shared.steps.ts
├── It's a login/auth step?          → step_definitions/common/auth.steps.ts
├── It's an API step?                → step_definitions/api/{module}.steps.ts
└── It's a UI step?                  → step_definitions/ui/{module}.steps.ts

Is it a reusable cy.xxx() shortcut?
└── YES → support/commands.ts  (AND declare its type in support/index.d.ts)

Is it a CSS selector or UI interaction method?
└── YES → support/pages/{Module}Page.ts

Is it static test data (names, values, payloads)?
├── Shared across both roles? → fixtures/testdata.json
├── Admin specific?           → fixtures/admin.json
└── User specific?            → fixtures/user.json

Is it a credential, base URL, or API URL?
└── YES → .env file only — never in any TypeScript file
```

---

## Running Tests

```bash
# Run all tests
npx cypress run

# Run API tests only
npx cypress run --spec "cypress/e2e/features/api/**/*.feature"

# Run UI tests only
npx cypress run --spec "cypress/e2e/features/ui/**/*.feature"

# Run admin tests only
npx cypress run --spec "cypress/e2e/features/**/admin/*.feature"

# Run a specific module
npx cypress run --spec "cypress/e2e/features/api/admin/categories.feature"

# Open interactive runner
npx cypress open

# Generate and open Allure report
npm run allure
```

## Running Tests by Tags

```bash
# Run only API tests:
npx cypress run --env TAGS="@api"

# Run tests that have both @api AND @admin:
npx cypress run --env TAGS="@api and @admin"

# Run tests that have @api but NOT @admin:
npx cypress run --env TAGS="@api and not @admin"
```