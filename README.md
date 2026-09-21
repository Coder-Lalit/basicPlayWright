# Playwright Enterprise QA Framework

A production-style Playwright + TypeScript automation framework built to demonstrate enterprise-grade QA architecture, including authentication, API automation, fixtures, reporting, advanced execution strategies, and scalable test design.

## Overview

This project combines:

- Playwright Test for UI automation
- APIRequestContext for REST automation
- Page Object Model using reusable page objects and components
- Storage state setup for efficient authenticated runs
- Demo web app for local execution without external services
- HTML and JSON reporting with trace and artifact retention
- Docker and GitHub Actions support for CI usage
- Documentation for architecture, scaling, debugging, and interview preparation

## Stack

- Node.js 18+
- TypeScript
- Playwright
- Express demo app
- ESLint + Prettier
- Docker
- GitHub Actions

## Folder structure

- src/
  - api/clients/
  - components/
  - config/
  - constants/
  - demo-server/
  - fixtures/
  - models/
  - pages/
  - test-data/
  - utils/
- tests/
  - api/
  - ui/
  - integration/
  - smoke/
  - regression/
- docs/
- .github/workflows/

## Local setup

1. Install dependencies:
   npm install
2. Install Playwright browsers:
   npx playwright install --with-deps chromium firefox webkit
3. Start the demo app:
   PORT=4200 npm run dev:app
4. Run tests:
   npm test

## Key commands

- Run UI tests: npm run test:ui
- Run API tests: npm run test:api
- Run smoke tests: npm run test:smoke
- Run regression tests: npm run test:regression
- Run headed mode: npm run test:headed
- Type check: npm run typecheck
- Lint: npm run lint
- Format: npm run format

## Test tagging

- Smoke: npx playwright test --grep @smoke
- Regression: npx playwright test --grep @regression
- API: npx playwright test --grep @api
- UI: npx playwright test --grep @ui

## Parallel execution

- Default workers follow environment variable WORKERS or config setting.
- Example: WORKERS=4 npx playwright test

## Sharding

- Example: npx playwright test --shard=1/4
- Example: npx playwright test --shard=2/4

## Docker

Build:

docker build -t playwright-qa-framework .

Run:

docker run --rm -v $(pwd)/artifacts:/app/artifacts playwright-qa-framework

## CI/CD

The repository includes workflow examples under .github/workflows, with smoke and regression jobs and sharded execution.

## Reporting

The framework generates:

- HTML report in playwright-report
- JSON results in test-results/results.json
- Trace retained on failure
- Screenshots and videos retained on failure

Open the HTML report:

npx playwright show-report

## Debugging

- Use --debug for interactive debugging.
- Inspect trace with npx playwright show-trace
- Retain artifacts from failures under test-results/artifacts

## Project principles

- Independent tests
- Prefer API setup over UI setup
- Use semantic locators
- Use fixtures and page objects
- Avoid arbitrary waits
- Make flaky tests visible

## Interview demo guidance

This framework illustrates how a senior QA engineer would build a scalable automation architecture with reusable business flows, layered test design, and an execution model that scales from local runs to CI and larger containerized environments.

## Important note

This project includes a local demo app to ensure the automation framework is runnable without hidden external dependencies. The app demonstrates login, products, users, search, API auth, and delayed endpoints for synchronization testing.
