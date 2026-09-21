# Interview Guide

## 1. Why Playwright?

What to show: UI automation with built-in waiting, browser coverage, and API testing in one framework.
Why it matters: It demonstrates a modern automation stack that reduces custom infrastructure and improves reliability.
Possible question: Why not use Selenium or a custom wrapper?
Expected answer: Playwright offers faster development, better stability, built-in waits, and strong browser coverage without excessive helper code.

## 2. Architecture

What to show: Separation between tests, pages, APIs, fixtures, config, and data.
Why it matters: It signals maintainability and scalability.
Possible question: How do you keep the framework maintainable as it grows?
Expected answer: By keeping tests intent-driven, layering selectors in page objects, and reusing fixtures and APIs.

## 3. Authentication

What to show: Storage state and pre-authenticated flows.
Why it matters: It shows optimization and realistic enterprise patterns.
Possible question: Why not log in for every test?
Expected answer: It slows execution and creates unnecessary duplication; storage state is faster and more stable.

## 4. Fixtures

What to show: Shared context, authentication, and request setup through fixtures.
Why it matters: It reduces duplication and improves reliability.
Possible question: Why are fixtures useful?
Expected answer: They centralize setup and teardown so tests stay readable and consistent.

## 5. API + UI

What to show: Creating data via API, then validating it in the UI.
Why it matters: It illustrates a scalable and resilient automation strategy.
Possible question: Why use API setup?
Expected answer: It is typically faster, more deterministic, and reduces UI dependency.

## 6. Parallelization

What to show: Browser projects and worker-based test distribution.
Why it matters: It highlights execution speed and CI readiness.
Possible question: How do you avoid flaky parallel execution?
Expected answer: By keeping tests isolated, using unique data, and avoiding shared state.

## 7. Sharding

What to show: The suite split across shards and CI jobs.
Why it matters: It scales execution horizontally.
Possible question: How is sharding different from workers?
Expected answer: Workers divide the suite within a machine; sharding splits the total test set across machines or jobs.

## 8. CI/CD

What to show: GitHub Actions jobs for smoke and regression plus report upload.
Why it matters: It shows production-like execution flows.
Possible question: What is the value of separate smoke and regression jobs?
Expected answer: Fast feedback for critical tests and deeper validation in slower suites.

## 9. Docker

What to show: Containerized Playwright runtime.
Why it matters: It demonstrates portability and consistency.
Possible question: Why use Docker here?
Expected answer: It removes workstation drift and creates reproducible execution environments.

## 10. Scaling to 10,000 tests

What to show: Shards, containers, and worker management.
Why it matters: It demonstrates strategic thinking beyond a toy framework.
Possible question: How would you scale further?
Expected answer: Add more shards, distributed reporting, dynamic allocation, and smarter test selection.

## 11. Flaky test management

What to show: Retry metrics and flaky detection.
Why it matters: Reliability is a core quality metric.
Possible question: What do you do with flaky tests?
Expected answer: Treat them as defects, analyze root causes, and track them as a separate quality signal.

## 12. Observability

What to show: HTML report, traces, screenshots, videos, and network diagnostics.
Why it matters: It helps teams debug quickly and build confidence.
Possible question: Why is trace data valuable?
Expected answer: It shows DOM state, steps, network calls, and timing around a failure.

## 13. Trade-offs

What to show: API-first setup, selective browser coverage, and careful execution tuning.
Why it matters: It demonstrates engineering judgment instead of dogmatic automation patterns.
Possible question: What is not worth over-abstracting?
Expected answer: Keep the framework simple, readable, and aligned with actual test needs.
