# EverAfter — Testing Strategy

> **Stack:** Next.js 14 (App Router) · TypeScript · Tailwind CSS · Supabase · Stripe  
> **Last updated:** 2026-09-27

---

## Table of Contents

1. [Testing Philosophy](#1-testing-philosophy)
2. [Test Types](#2-test-types)
3. [Tech Stack](#3-tech-stack)
4. [What to Test at Each Level](#4-what-to-test-at-each-level)
5. [Critical E2E Flows](#5-critical-e2e-flows)
6. [Test Data Strategy](#6-test-data-strategy)
7. [CI Configuration](#7-ci-configuration)
8. [Coverage Targets](#8-coverage-targets)
9. [Testing the Public Wedding Site](#9-testing-the-public-wedding-site)
10. [Accessibility Testing](#10-accessibility-testing)
11. [Feature Testing Checklist](#11-feature-testing-checklist)
12. [Manual Testing Scenarios](#12-manual-testing-scenarios)

---

## 1. Testing Philosophy

**Test the right things, not everything.**

EverAfter is a multi-tenant SaaS with real guests submitting RSVPs, real couples paying for subscriptions, and real DNS records being managed. A bug in RSVP submission or Stripe billing has direct, user-visible consequences. A missed CSS class does not.

### Guiding principles

| Principle | What it means in practice |
|-----------|--------------------------|
| **Test behaviour, not implementation** | Test that submitting a valid RSVP creates a row in `guest_responses` — not that `useState` was called twice. |
| **Prioritise high-blast-radius paths** | A bug in the Stripe webhook handler or the subdomain middleware affects every tenant. These get integration + E2E coverage first. |
| **Don't test the framework** | Don't unit-test Next.js routing, Supabase's own client methods, or Stripe's SDK. Test how *we* use them. |
| **Fail fast in CI, fail loudly in production** | Unit and integration tests run on every push. E2E runs on PRs to `main`. Alerts fire on production anomalies. |
| **A slow test suite is an ignored test suite** | Target < 3 min for unit + integration, < 10 min for E2E critical paths. Parallelise aggressively. |

### Testing pyramid for EverAfter

```
         /\
        /E2E\          ~15% — core flows only
       /------\
      /  Integ  \      ~25% — API routes, server actions, DB queries
     /------------\
    /  Unit tests   \  ~60% — pure logic, validators, formatters, hooks
   /________________\
```

---

## 2. Test Types

### 2.1 Unit Tests
Pure functions with no I/O. Run in milliseconds. No database, no network, no Supabase.

**Target:** Business logic that is easy to get wrong and expensive when broken.

### 2.2 Integration Tests
Test a slice of the system end-to-end within the process boundary — an API route handler, a server action, or a Supabase query — with a real (seeded) test database.

**Target:** Routes, server actions, database access patterns, Stripe webhook handling.

### 2.3 End-to-End (E2E) Tests
Drive a real browser (Chromium) against the running application. Validates that all layers integrate correctly from the user's perspective.

**Target:** The five critical flows listed in [Section 5](#5-critical-e2e-flows).

---

## 3. Tech Stack

### Unit & Integration — Jest + React Testing Library

```jsonc
// package.json (dev dependencies)
{
  "jest": "^29",
  "jest-environment-jsdom": "^29",
  "@testing-library/react": "^15",
  "@testing-library/user-event": "^14",
  "@testing-library/jest-dom": "^6",
  "ts-jest": "^29",
  "msw": "^2"           // API mocking for integration tests
}
```

**Jest config** (`jest.config.ts`):

```typescript
import type { Config } from 'jest';
import nextJest from 'next/jest.js';

const createJestConfig = nextJest({ dir: './' });

const config: Config = {
  testEnvironment: 'node',          // default; override per-file for React components
  setupFilesAfterFramework: ['<rootDir>/tests/setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  testPathPattern: [
    '<rootDir>/src/**/*.test.ts',
    '<rootDir>/src/**/*.test.tsx',
    '<rootDir>/tests/integration/**/*.test.ts',
  ],
  coverageProvider: 'v8',
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.stories.tsx',
    '!src/app/**/page.tsx',   // pages are covered by E2E
    '!src/types/**',
  ],
};

export default createJestConfig(config);
```

### E2E & API — Playwright

```jsonc
// package.json (dev dependencies)
{
  "@playwright/test": "^1.44",
  "axe-playwright": "^2"   // accessibility assertions in E2E
}
```

**Playwright config** (`playwright.config.ts`):

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 4 : 2,
  reporter: [['html'], ['github']],
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:3000',
    trace: 'on-first-retry',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'mobile-safari',
      use: { ...devices['iPhone 14'] },
    },
  ],
  webServer: {
    command: 'pnpm dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

### API Testing

API routes are tested at two levels:

- **Integration:** Use `supertest` or Next.js's `createServer` to fire HTTP requests against route handlers with a seeded Supabase test database.
- **E2E:** Playwright's `request` context for testing public-facing API endpoints (e.g., `/api/rsvp`, `/api/webhooks/stripe`) without a browser.

---

## 4. What to Test at Each Level

### 4.1 Unit Tests

Focus on **pure functions** — anything that takes inputs and returns outputs with no side effects.

| Module | Examples |
|--------|---------|
| `src/lib/dates.ts` | `formatWeddingDate()`, `getDaysUntilWedding()`, timezone handling |
| `src/lib/seating.ts` | `assignSeat()`, `detectConflicts()`, `balanceTableCapacity()` |
| `src/lib/rsvp.ts` | `validateRsvpPayload()`, `parsePlusOneCount()`, `normaliseDietaryRestrictions()` |
| `src/lib/pricing.ts` | `getPlanLimits()`, `isFeatureAllowed()`, `calculateProration()` |
| `src/lib/csv.ts` | `parseGuestCsv()`, column mapping, error row detection |
| `src/lib/slug.ts` | `generateSlug()`, collision handling, reserved word filtering |
| `src/hooks/useRsvpForm.ts` | Form state transitions, validation error messages |

**Example unit test:**

```typescript
// src/lib/rsvp.test.ts
import { validateRsvpPayload } from './rsvp';

describe('validateRsvpPayload', () => {
  it('accepts a valid RSVP with one plus-one', () => {
    const result = validateRsvpPayload({
      guestId: 'guest_123',
      attending: true,
      plusOneCount: 1,
      dietaryRestrictions: ['vegan'],
    });
    expect(result.success).toBe(true);
  });

  it('rejects plusOneCount above the guest allowance', () => {
    const result = validateRsvpPayload({
      guestId: 'guest_123',
      attending: true,
      plusOneCount: 3,   // max allowed is 1
      dietaryRestrictions: [],
    });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].path).toContain('plusOneCount');
  });

  it('rejects empty guestId', () => {
    const result = validateRsvpPayload({ guestId: '', attending: true, plusOneCount: 0, dietaryRestrictions: [] });
    expect(result.success).toBe(false);
  });
});
```

### 4.2 Integration Tests

Test **API routes and server actions** against a real Supabase test database (seeded per-suite, rolled back after).

| Area | What to test |
|------|-------------|
| `POST /api/rsvp` | Happy path, duplicate submission, invalid payload, rate-limiting |
| `POST /api/webhooks/stripe` | `checkout.session.completed`, `invoice.payment_failed`, `customer.subscription.deleted` |
| `GET /api/wedding/[slug]` | Correct tenant data returned, 404 for unknown slug, data isolation |
| Server action: `createCouple` | Inserts couple + owner profile + default wedding, returns correct slug |
| Server action: `importGuests` | Parses CSV, inserts guests, returns error rows |
| Server action: `updateSeating` | Conflict detection, capacity enforcement, optimistic locking |
| Supabase RLS policies | A guest cannot read another tenant's data via direct API call |

**Example integration test:**

```typescript
// tests/integration/rsvp-route.test.ts
import { createTestClient, seedWedding, cleanupWedding } from '../helpers/db';

describe('POST /api/rsvp', () => {
  let weddingId: string;

  beforeAll(async () => {
    weddingId = await seedWedding({ slug: 'test-wedding-rsvp' });
  });

  afterAll(async () => {
    await cleanupWedding(weddingId);
  });

  it('creates a guest response for a valid payload', async () => {
    const res = await fetch('http://localhost:3000/api/rsvp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        weddingId,
        guestId: 'guest_abc',
        attending: true,
        plusOneCount: 0,
        dietaryRestrictions: [],
      }),
    });
    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body.data.id).toBeTruthy();
  });

  it('returns 409 on duplicate submission', async () => {
    // submit twice
    const payload = { weddingId, guestId: 'guest_dup', attending: true, plusOneCount: 0, dietaryRestrictions: [] };
    await fetch('http://localhost:3000/api/rsvp', { method: 'POST', body: JSON.stringify(payload), headers: { 'Content-Type': 'application/json' } });
    const res = await fetch('http://localhost:3000/api/rsvp', { method: 'POST', body: JSON.stringify(payload), headers: { 'Content-Type': 'application/json' } });
    expect(res.status).toBe(409);
  });
});
```

### 4.3 E2E Tests

Test **complete user journeys** in a real browser. Do NOT re-test validation rules that are already covered by unit tests. Focus on: does the whole system work together?

See [Section 5](#5-critical-e2e-flows) for the five mandatory flows.

---

## 5. Critical E2E Flows

These flows **must** have full Playwright coverage before any code reaches production. They are tagged `@critical` and run as a blocking gate on the `main` branch.

### 5.1 Guest RSVP Submission

**Scenario:** A guest navigates to the wedding subdomain, finds their name, submits their RSVP, and sees the confirmation screen.

```typescript
// tests/e2e/rsvp.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Guest RSVP submission @critical', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to seeded test wedding subdomain
    await page.goto('http://the-smiths.localhost:3000/rsvp');
  });

  test('guest can find their name and submit attending', async ({ page }) => {
    await page.getByPlaceholder('Search for your name').fill('Jane');
    await page.getByText('Jane Doe').click();
    await page.getByLabel('Yes, I will attend').check();
    await page.getByLabel('Dietary restrictions').selectOption('vegan');
    await page.getByRole('button', { name: 'Submit RSVP' }).click();
    await expect(page.getByText('See you at the wedding!')).toBeVisible();
  });

  test('guest can decline', async ({ page }) => {
    await page.getByPlaceholder('Search for your name').fill('John');
    await page.getByText('John Smith').click();
    await page.getByLabel("Sorry, I can't make it").check();
    await page.getByRole('button', { name: 'Submit RSVP' }).click();
    await expect(page.getByText('We will miss you')).toBeVisible();
  });

  test('submitted RSVP reflects in couple dashboard', async ({ page, context }) => {
    // Submit RSVP as guest
    // ...
    // Open new tab as authenticated couple
    const dashPage = await context.newPage();
    await dashPage.goto('http://localhost:3000/dashboard/guests');
    await expect(dashPage.getByText('Jane Doe').locator('..').getByText('Attending')).toBeVisible();
  });
});
```

### 5.2 Couple Signup and Onboarding

**Scenario:** A new couple signs up, completes the onboarding wizard, and reaches their dashboard with a live wedding URL.

```typescript
// tests/e2e/onboarding.spec.ts
test('couple can sign up and complete onboarding @critical', async ({ page }) => {
  await page.goto('/signup');
  await page.getByLabel('Email').fill(`test+${Date.now()}@example.com`);
  await page.getByLabel('Password').fill('SecurePass123!');
  await page.getByRole('button', { name: 'Create account' }).click();

  // Email verification is bypassed in test env via SUPABASE_BYPASS_EMAIL_CONFIRM=true
  await expect(page).toHaveURL(/\/onboarding/);

  await page.getByLabel("Partner 1 name").fill('Alex');
  await page.getByLabel("Partner 2 name").fill('Jordan');
  await page.getByLabel('Wedding date').fill('2027-06-15');
  await page.getByLabel('Wedding site URL').fill('alex-and-jordan');
  await page.getByRole('button', { name: 'Create my wedding site' }).click();

  await expect(page).toHaveURL(/\/dashboard/);
  await expect(page.getByText('alex-and-jordan.everafter.app')).toBeVisible();
});
```

### 5.3 Stripe Checkout Flow

**Scenario:** A couple on the free plan clicks "Upgrade", completes Stripe Checkout, and gains access to premium features.

> **Note:** Use Stripe test mode + test card `4242 4242 4242 4242`. The Stripe CLI must be running in the test environment to forward webhooks.

```typescript
// tests/e2e/billing.spec.ts
test('couple can upgrade from free to premium @critical', async ({ page }) => {
  await loginAsCouple(page, 'free-couple@example.com');
  await page.goto('/dashboard/billing');
  await page.getByRole('button', { name: 'Upgrade to Premium' }).click();

  // Redirects to Stripe Checkout
  await page.waitForURL(/checkout\.stripe\.com/);
  await page.getByLabel('Card number').fill('4242 4242 4242 4242');
  await page.getByLabel('Expiration').fill('12/27');
  await page.getByLabel('CVC').fill('123');
  await page.getByLabel('Name on card').fill('Alex Jordan');
  await page.getByRole('button', { name: 'Subscribe' }).click();

  // Redirects back to EverAfter success URL
  await page.waitForURL(/\/dashboard\/billing\?success=true/);
  await expect(page.getByText('Premium')).toBeVisible();

  // Verify premium feature is now accessible
  await page.goto('/dashboard/custom-domain');
  await expect(page.getByRole('heading', { name: 'Custom Domain' })).toBeVisible();
});
```

### 5.4 Custom Domain Setup

**Scenario:** A premium couple adds a custom domain, the UI shows DNS instructions, and the system validates CNAME propagation.

```typescript
// tests/e2e/custom-domain.spec.ts
test('couple can initiate custom domain setup @critical', async ({ page }) => {
  await loginAsPremiumCouple(page);
  await page.goto('/dashboard/custom-domain');

  await page.getByLabel('Your domain').fill('www.alexandjordan.com');
  await page.getByRole('button', { name: 'Add domain' }).click();

  // DNS instructions panel
  await expect(page.getByText('Add a CNAME record')).toBeVisible();
  await expect(page.getByText('cname.everafter.app')).toBeVisible();

  // Verify pending status
  await expect(page.getByText('Pending verification')).toBeVisible();
});

// DNS propagation itself is tested via integration tests with a mock DNS resolver
```

### 5.5 Planner Adding a Couple

**Scenario:** A wedding planner (agency plan) creates a couple on their behalf, sets up the wedding, and the couple can log in to their dedicated dashboard.

```typescript
// tests/e2e/planner.spec.ts
test('planner can create a couple account @critical', async ({ page }) => {
  await loginAsPlanner(page);
  await page.goto('/planner/couples/new');

  await page.getByLabel('Partner 1 name').fill('Sam');
  await page.getByLabel('Partner 2 name').fill('Riley');
  await page.getByLabel('Partner 1 email').fill(`couple+${Date.now()}@example.com`);
  await page.getByLabel('Wedding date').fill('2027-08-20');
  await page.getByRole('button', { name: 'Create couple' }).click();

  await expect(page.getByText('Couple created')).toBeVisible();
  await expect(page.getByText('sam-and-riley')).toBeVisible();

  // Couple appears in planner's couple list
  await page.goto('/planner/couples');
  await expect(page.getByText('Sam & Riley')).toBeVisible();
});
```

---

## 6. Test Data Strategy

### 6.1 Factories

Use typed factory functions (not static fixtures) so tests can create minimal, targeted data.

```typescript
// tests/factories/wedding.ts
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';

const supabase = createClient<Database>(
  process.env.SUPABASE_TEST_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

interface WeddingFactoryOptions {
  slug?: string;
  partnerOneName?: string;
  partnerTwoName?: string;
  weddingDate?: string;
  plan?: 'free' | 'premium' | 'agency';
}

export async function createWedding(opts: WeddingFactoryOptions = {}): Promise<string> {
  const slug = opts.slug ?? `test-wedding-${Date.now()}`;
  const { data, error } = await supabase
    .from('weddings')
    .insert({
      slug,
      partner_one_name: opts.partnerOneName ?? 'Test Partner One',
      partner_two_name: opts.partnerTwoName ?? 'Test Partner Two',
      wedding_date: opts.weddingDate ?? '2027-01-01',
      plan: opts.plan ?? 'free',
    })
    .select('id')
    .single();

  if (error) throw error;
  return data.id;
}

export async function destroyWedding(id: string): Promise<void> {
  await supabase.from('weddings').delete().eq('id', id);
}
```

```typescript
// tests/factories/guest.ts
export async function createGuest(weddingId: string, overrides = {}) {
  const { data, error } = await supabase
    .from('guests')
    .insert({
      wedding_id: weddingId,
      full_name: 'Test Guest',
      email: `guest+${Date.now()}@example.com`,
      plus_one_allowed: false,
      ...overrides,
    })
    .select('id')
    .single();
  if (error) throw error;
  return data.id;
}
```

### 6.2 Fixtures

Static JSON fixtures live in `tests/fixtures/` for complex, stable data like CSV files or Stripe webhook payloads.

```
tests/
  fixtures/
    guests-valid.csv          # 20 guests, valid format
    guests-missing-email.csv  # intentionally malformed
    stripe-webhook-checkout-completed.json
    stripe-webhook-invoice-failed.json
    stripe-webhook-subscription-deleted.json
```

### 6.3 Database Isolation

- Each integration test suite seeds its own data and tears it down in `afterAll`.
- All test data uses a unique slug/ID prefix (e.g., `test-` or `e2e-`) to allow safe cleanup.
- Never run integration or E2E tests against the production database. Use `SUPABASE_TEST_URL` pointing to a dedicated `everafter_test` Supabase project.

### 6.4 Stripe Test Mode

All billing tests use Stripe test keys (`sk_test_...`). The Stripe CLI (`stripe listen --forward-to localhost:3000/api/webhooks/stripe`) is started as part of CI setup.

```yaml
# In CI (see Section 7)
- name: Start Stripe CLI webhook forwarding
  run: stripe listen --forward-to localhost:3000/api/webhooks/stripe &
  env:
    STRIPE_API_KEY: ${{ secrets.STRIPE_TEST_SECRET_KEY }}
```

---

## 7. CI Configuration

### 7.1 GitHub Actions Workflow

```yaml
# .github/workflows/test.yml
name: Test Suite

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true

jobs:
  unit-integration:
    name: Unit & Integration Tests
    runs-on: ubuntu-latest
    timeout-minutes: 10
    services:
      # No Docker needed — using hosted Supabase test project
    env:
      SUPABASE_TEST_URL: ${{ secrets.SUPABASE_TEST_URL }}
      SUPABASE_SERVICE_ROLE_KEY: ${{ secrets.SUPABASE_TEST_SERVICE_ROLE_KEY }}
      NEXT_PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.SUPABASE_TEST_ANON_KEY }}
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v3
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'
      - run: pnpm install --frozen-lockfile
      - run: pnpm test:ci
      - name: Upload coverage
        uses: codecov/codecov-action@v4
        with:
          token: ${{ secrets.CODECOV_TOKEN }}

  e2e:
    name: E2E Tests (Critical Flows)
    runs-on: ubuntu-latest
    timeout-minutes: 20
    needs: unit-integration
    env:
      PLAYWRIGHT_BASE_URL: http://localhost:3000
      SUPABASE_TEST_URL: ${{ secrets.SUPABASE_TEST_URL }}
      STRIPE_SECRET_KEY: ${{ secrets.STRIPE_TEST_SECRET_KEY }}
      STRIPE_WEBHOOK_SECRET: ${{ secrets.STRIPE_TEST_WEBHOOK_SECRET }}
      SUPABASE_BYPASS_EMAIL_CONFIRM: true
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v3
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'
      - run: pnpm install --frozen-lockfile
      - run: pnpm playwright install chromium --with-deps
      - name: Build application
        run: pnpm build
      - name: Start Stripe webhook forwarding
        run: stripe listen --forward-to localhost:3000/api/webhooks/stripe &
      - name: Run E2E tests
        run: pnpm test:e2e --grep @critical
      - uses: actions/upload-artifact@v4
        if: failure()
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 7
```

### 7.2 Package.json Scripts

```jsonc
{
  "scripts": {
    "test": "jest --watch",
    "test:ci": "jest --ci --coverage --forceExit",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:e2e:headed": "playwright test --headed",
    "test:coverage": "jest --coverage --coverageReporter=lcov"
  }
}
```

---

## 8. Coverage Targets

> Chasing 100% coverage is counterproductive. These targets reflect meaningful confidence without encouraging test theatre.

| Layer | Target | Notes |
|-------|--------|-------|
| `src/lib/**` (pure logic) | **85%** | High value, easy to test |
| `src/app/api/**` (route handlers) | **75%** | Integration tests count |
| `src/components/**` (React) | **60%** | Test behaviour, not rendering |
| `src/app/**/page.tsx` (pages) | **E2E only** | Don't unit-test pages |
| `src/hooks/**` | **70%** | State logic matters |
| **Overall** | **70%** | Enforced in CI via `--coverageThreshold` |

```typescript
// jest.config.ts
coverageThreshold: {
  global: {
    lines: 70,
    functions: 70,
    branches: 65,
    statements: 70,
  },
  './src/lib/': {
    lines: 85,
  },
},
```

CI **will fail** if thresholds are not met.

---

## 9. Testing the Public Wedding Site

The public-facing wedding site (served from `[slug].everafter.app` or a custom domain) has unique testing requirements.

### 9.1 Subdomain Routing in Tests

Playwright needs to resolve subdomains in local test runs. Set `baseURL` per-project and use the `Host` header approach in CI:

```typescript
// tests/e2e/public-site.spec.ts
test.use({ baseURL: 'http://the-smiths.localhost:3000' });

test('public wedding site shows correct couple names', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Smith');
});
```

For CI (where subdomain DNS may not resolve), override with:
```
PLAYWRIGHT_BASE_URL=http://localhost:3000
X_FORWARDED_HOST=the-smiths.everafter.app
```

And in middleware, honour the `x-forwarded-host` header for tenant resolution.

### 9.2 What to Test on the Public Site

| Test | Type |
|------|------|
| Correct wedding details displayed | E2E |
| RSVP form renders and submits | E2E (see §5.1) |
| Photo gallery loads images | E2E |
| Page is publicly accessible (no auth required) | Integration |
| Unpublished wedding returns 404 | Integration |
| Deleted wedding returns 410 Gone | Integration |
| OG meta tags are correct for social sharing | Integration (curl-based) |
| Page renders within 2s (LCP) | Playwright performance assertion |

### 9.3 Performance Assertion

```typescript
test('public site LCP is under 2s', async ({ page }) => {
  await page.goto('/');
  const lcp = await page.evaluate(() =>
    new Promise<number>((resolve) => {
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        resolve(entries[entries.length - 1].startTime);
      }).observe({ type: 'largest-contentful-paint', buffered: true });
    })
  );
  expect(lcp).toBeLessThan(2000);
});
```

---

## 10. Accessibility Testing

### 10.1 Automated — axe-core via axe-playwright

Run axe on every E2E test page visit to catch WCAG 2.1 AA violations automatically.

```typescript
// tests/e2e/helpers/a11y.ts
import { checkA11y, injectAxe } from 'axe-playwright';
import type { Page } from '@playwright/test';

export async function assertA11y(page: Page, context?: string) {
  await injectAxe(page);
  await checkA11y(page, context, {
    runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa'] },
    detailedReport: true,
    detailedReportOptions: { html: true },
  });
}
```

```typescript
// Usage in any E2E test
test('RSVP page is accessible', async ({ page }) => {
  await page.goto('/rsvp');
  await assertA11y(page);
});
```

### 10.2 Component-Level — jest-axe

```typescript
// src/components/RsvpForm.test.tsx
import { axe, toHaveNoViolations } from 'jest-axe';
expect.extend(toHaveNoViolations);

it('has no axe violations', async () => {
  const { container } = render(<RsvpForm weddingId="test" guests={[]} />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

### 10.3 Manual Accessibility Testing

Run these manually before each major release. Use **NVDA + Chrome** on Windows, **VoiceOver + Safari** on macOS/iOS.

| Scenario | Tool | Pass Criteria |
|----------|------|--------------|
| Navigate RSVP form with keyboard only | Keyboard | All fields reachable via Tab; form submittable |
| RSVP form with screen reader | NVDA / VoiceOver | All labels announced; error messages announced on submit |
| Dashboard with screen reader | NVDA / VoiceOver | Data tables have accessible headers |
| Colour contrast on wedding themes | browser DevTools / Colour Contrast Analyser | AA minimum (4.5:1 text, 3:1 UI) |
| Zoom to 200% | Browser zoom | No content truncated or overlapping |
| Focus ring visible | Keyboard | Clear focus indicator on all interactive elements |

---

## 11. Feature Testing Checklist

Use this checklist when implementing or reviewing any new feature.

```markdown
## Feature: [Name]

### Unit tests
- [ ] All new pure functions in `src/lib/` have unit tests
- [ ] Validation schemas are tested with valid + invalid inputs
- [ ] Edge cases (empty, null, overflow) are covered

### Integration tests
- [ ] New API routes are tested (happy path + error paths)
- [ ] New server actions are tested
- [ ] RLS policies are tested (correct tenant isolation)
- [ ] Stripe webhook handling is tested with fixture payloads

### E2E tests
- [ ] Core user flow is tested if this is a user-facing feature
- [ ] Mobile viewport tested (iPhone 14 at minimum)
- [ ] Feature is tagged @critical if it affects billing, RSVP, or onboarding

### Accessibility
- [ ] axe-core assertion passes on affected pages
- [ ] Keyboard navigation manually verified
- [ ] All form inputs have visible labels

### Manual QA
- [ ] Tested in Chrome, Firefox, and Safari
- [ ] Tested on iOS Safari (real device or BrowserStack)
- [ ] Edge cases listed in §12 considered
```

---

## 12. Manual Testing Scenarios

These scenarios are difficult or impractical to automate fully. They must be executed by a QA engineer or the feature author before release.

---

### 12.1 RSVP Form Edge Cases

#### Plus-one variations

| Scenario | Steps | Expected |
|----------|-------|----------|
| Guest allowed 0 plus-ones | Load RSVP as such a guest | Plus-one field hidden or disabled |
| Guest allowed 1 plus-one, brings 0 | Submit without adding a plus-one | Accepted; no plus-one record created |
| Guest allowed 1 plus-one, brings 1 | Fill plus-one name and submit | Both records created; dashboard shows 2 attendees |
| Guest allowed 2 plus-ones, brings 1 | Fill one plus-one name | Accepted; 1 plus-one record |
| Guest allowed 1 plus-one, tries to submit 2 | Manipulate DOM/API to submit 2 | API returns 422; no records created |
| Guest with plus-one declines | Attend: No, plus-one name filled | Submit accepted; plus-one ignored; 0 attendees |
| Plus-one name is blank | Attempt submit with blank plus-one name field | Validation error: "Please enter your guest's name" |
| Plus-one with special characters | Name: `O'Brien-García` | Stored correctly; displayed correctly |

#### Dietary restrictions

| Scenario | Expected |
|----------|----------|
| No restrictions selected | Submitted successfully; field is `[]` in DB |
| Multiple restrictions (vegan + nut allergy) | Both stored and shown in dashboard |
| Restriction text > 500 chars | Validation error shown; not submitted |
| Guest changes restriction after initial submission | Update accepted; new value shown in dashboard |

#### Submission timing

| Scenario | Expected |
|----------|----------|
| RSVP submitted after the couple's RSVP deadline | Form shows "RSVP deadline has passed" message; no submission |
| RSVP re-submitted (same guest) | Update the existing record; no duplicate |
| Network failure mid-submit | Error toast shown; form data retained; retryable |
| Submit button double-clicked | Only one submission created; button disabled after first click |

---

### 12.2 Guest List Import (CSV)

#### File format variations

| Scenario | Steps | Expected |
|----------|-------|----------|
| Valid CSV, 50 guests | Upload `guests-valid.csv` | All 50 imported; success message |
| CSV with BOM (Excel export) | Upload Excel-generated CSV | BOM stripped; import succeeds |
| Semicolon-delimited CSV | Upload `;`-delimited file | Detected and handled; or clear error shown |
| Windows CRLF line endings | Upload file with `\r\n` | Imported correctly |
| CSV with extra empty rows | Trailing blank lines at end | Empty rows ignored; no null guests created |
| Header row has unexpected casing | `Full Name` vs `full_name` | Case-insensitive column matching |
| Missing required column (`full_name`) | Upload without name column | Import fails; error shows missing column name |
| Email column present but some blank | Some guests have no email | Imported without email; flagged in UI as incomplete |
| Duplicate names in import | `John Smith` appears twice | Both rows imported; UI flags duplicates for review |
| 500+ guests (large file) | Upload 500-row CSV | Processes in batches; progress indicator shown; no timeout |
| Non-CSV file (XLSX, PDF) | Upload `.xlsx` directly | Error: "Please upload a CSV file" |

---

### 12.3 Seating Chart Conflicts

| Scenario | Steps | Expected |
|----------|-------|----------|
| Assign same guest to two tables | Drag guest to Table A, then Table B | Guest removed from Table A automatically |
| Table over capacity | Drag 11th guest to a 10-person table | Error: "Table is at capacity"; guest not placed |
| Remove guest from seating | Unassign a guest | Seat freed; table count updates immediately |
| Delete a table with assigned guests | Delete Table B which has 5 guests | Warning: "5 guests will become unassigned"; confirm required |
| Guest removed from guest list but still in seating | Delete guest from guest list | Guest removed from seating chart; seat freed |
| Drag-and-drop on mobile | Touch drag on iPad Safari | Guest moves correctly; no ghost images stuck |
| Two planners editing simultaneously | Open dashboard in two browsers, both move guests | Last write wins; other user sees stale state warning |
| Export seating chart as PDF | Click "Export PDF" | PDF generated with table names, guest names, dietary info |

---

### 12.4 Custom Domain DNS Propagation

> DNS propagation cannot be fully automated in CI. These tests require a real domain and DNS changes.

| Scenario | Steps | Expected |
|----------|-------|----------|
| Add domain, no DNS configured | Enter domain, save, click "Check DNS" immediately | Status: "Pending — CNAME not found" |
| CNAME pointed to wrong target | Set CNAME to competitor's host | Status: "Incorrect CNAME target" with correct value shown |
| CNAME correct, propagating | Correct CNAME set but DNS not yet propagated globally | Status: "Verifying — can take up to 48 hours" |
| CNAME propagated, TLS provisioned | After full propagation | Status: "Active"; domain loads with valid HTTPS cert |
| Wildcard domain (`*.alexandjordan.com`) | Enter wildcard domain | Rejected with explanation; only specific subdomains supported |
| Domain already used by another couple | Enter a domain already in use | Error: "This domain is already in use" |
| Remove active custom domain | Click "Remove domain" on active domain | Domain removed; site reverts to `slug.everafter.app` |
| TLS certificate expiry | (Simulated) Let cert expire | Auto-renewal triggered; alert sent to couple and support |
| Non-existent domain | Enter `thisdoesnotexist12345.com` | DNS check fails gracefully: "Domain not found" |

---

### 12.5 Stripe Subscription Lifecycle

All manual billing tests use Stripe test mode. Use the [Stripe test card numbers](https://stripe.com/docs/testing#cards) and the Stripe Dashboard to trigger events.

#### Upgrade flow

| Scenario | Steps | Expected |
|----------|-------|----------|
| Free → Premium | Click Upgrade, complete Stripe Checkout with `4242...` | Plan shows Premium; premium features unlocked immediately |
| Free → Premium (3D Secure required) | Use card `4000 0025 0000 3155` | 3DS challenge presented; on success, upgraded |
| Free → Premium (card declined) | Use card `4000 0000 0000 9995` | Stripe shows decline reason; user returned to billing page with error |
| Free → Agency | Upgrade to Agency plan | Couple management features unlocked; seat limit increased |

#### Downgrade flow

| Scenario | Steps | Expected |
|----------|-------|----------|
| Premium → Free (mid-period) | Downgrade in billing settings | Downgrades at period end; premium features remain until then; banner shown |
| Premium → Free (features over limit) | Downgrade when using 3 custom domains (limit: 1) | Warning shown listing over-limit resources; couple must remove excess before downgrade confirms |

#### Cancellation flow

| Scenario | Steps | Expected |
|----------|-------|----------|
| Cancel subscription | Click Cancel, confirm | `cancel_at_period_end: true` in Stripe; access remains until period end; "Cancelled" badge shown |
| Reactivate before period end | Click "Reactivate" after cancelling | Cancellation reversed; badge removed |
| Cancellation period ends | Wait for `customer.subscription.deleted` webhook | Account downgraded to free; premium features locked |

#### Invoice failure flow

| Scenario | Steps | Expected |
|----------|-------|----------|
| First invoice failure | Trigger `invoice.payment_failed` via Stripe CLI | Email sent to couple; in-app banner: "Payment failed — update card" |
| Card updated after failure | Couple updates card via Stripe portal | Stripe retries; on success, subscription resumes normally |
| Repeated failures → subscription cancelled | Stripe exhausts retries (4 attempts by default) | `customer.subscription.deleted` fired; account downgraded; final email sent |
| Invoice for annual plan | Upgrade to annual plan, check invoice | Invoice shows annual amount; next renewal date correct |
| Refund issued | Issue refund via Stripe Dashboard | Refund confirmation email sent; plan not affected (refunds don't auto-cancel) |
