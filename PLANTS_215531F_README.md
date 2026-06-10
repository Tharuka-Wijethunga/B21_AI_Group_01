# Plants module tests (215531F)

My part of the group assignment: the Plants module, 20 test cases in total.

| Area        | Test IDs                   | Feature file |
|-------------|----------------------------|--------------|
| UI Admin    | UI_ADMIN_PLANT_001..005    | tests/features/ui/admin/plants.feature |
| UI User     | UI_USER_PLANT_001..005     | tests/features/ui/user/plants.feature |
| API Admin   | API_ADMIN_PLANT_001..005   | tests/features/api/admin/plants.feature |
| API User    | API_USER_PLANT_001..005    | tests/features/api/user/plants.feature |

Every scenario is tagged with its test case id (like `@UI_ADMIN_PLANT_001`) and all of
them have the `@plants` tag. Stack is Playwright + Cucumber + Allure.

## My files

- tests/features/**/plants.feature (4 feature files)
- tests/step_definitions/ui/plants.steps.ts
- tests/step_definitions/api/plants.steps.ts
- tests/pages/PlantPage.ts
- tests/fixtures/plants.json
- cucumber.plants.json (run config for just these tests)

## Setup

1. Start MySQL (database `qa_training`, root user, no password).
2. Start the app: `java -jar "QA Training App/qa-training-app.jar"` (runs on http://localhost:8080).
3. `npm install` and `npx playwright install chromium`.
4. Copy `.env.example` to `.env` and set admin=admin/admin123, testuser=testuser/test123 plus the DB settings.

## Database

The tests expect the standard seed data (plant id 1 is Peace Lily, plus Hibiscus,
Aloe Vera, Neoregelia). The framework only auto-seeds when the tables are empty, so if
the DB has leftover data, truncate the tables first and let it seed, or reload seed.sql.

The tests clean up any plants they create, so you can run them again without reseeding.
UI_USER_PLANT_003 needs a plant with quantity below 5; a hook adds one automatically if
it is missing.

## Running

```bash
# all 20 plants tests (writes results to ./allure-results)
npx cucumber-js --config cucumber.plants.json

# see progress in the console
npx cucumber-js --config cucumber.plants.json --format progress

# just the API ones, or a single test
npx cucumber-js --config cucumber.plants.json --tags "@plants and @api"
npx cucumber-js --config cucumber.plants.json --tags "@UI_ADMIN_PLANT_001"
```

Allure report:

```bash
npx allure generate allure-results --clean -o allure-report
npx allure open allure-report
```

## Notes

I had to run my tests with their own `cucumber.plants.json` config because another
module's step file (categories) has a broken import path that stops the whole suite from
compiling. I left that file alone so I don't cause merge conflicts.

Also, the Allure report only gets written if the allure reporter is the only formatter,
so my config uses allure on its own.

A couple of things in the app don't match the test case doc exactly, so my tests follow
what the app actually does: GET /api/plants/{id} returns a flat `categoryId` (the list
returns a nested `category`), and PUT /api/plants/{id} wants `categoryId` too (sending a
nested category gives a 400).
