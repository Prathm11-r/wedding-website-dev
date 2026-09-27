# EverAfter — Accessibility Guide

> Multi-tenant wedding website builder · Next.js 14 · Supabase · Stripe · Vercel · Resend

---

## Table of Contents

1. [Accessibility Commitment](#1-accessibility-commitment)
2. [Semantic HTML Requirements](#2-semantic-html-requirements)
3. [Keyboard Navigation Requirements](#3-keyboard-navigation-requirements)
4. [Focus Management](#4-focus-management)
5. [Color Contrast Requirements](#5-color-contrast-requirements)
6. [Typography Accessibility](#6-typography-accessibility)
7. [Form Accessibility](#7-form-accessibility)
8. [Image Accessibility](#8-image-accessibility)
9. [ARIA Usage Guidelines](#9-aria-usage-guidelines)
10. [Screen Reader Testing](#10-screen-reader-testing)
11. [Public Wedding Site Accessibility](#11-public-wedding-site-accessibility)
12. [Component Accessibility Checklist](#12-component-accessibility-checklist)
13. [Known Risks with the Color Palette](#13-known-risks-with-the-color-palette)

---

## 1. Accessibility Commitment

EverAfter targets **WCAG 2.1 Level AA** compliance across all product surfaces:

- The **couple's dashboard** (`app.everafter.app`) — used by the couple to build and manage their site
- The **public wedding site** (`<slug>.everafter.app`, custom domains) — viewed by all wedding guests

### Why This Matters Beyond Compliance

Wedding sites are shared with every guest — grandparents, elderly relatives, people with low vision, individuals who rely on screen readers, and guests who may have motor impairments. Inaccessible wedding sites exclude real people from participating in one of the most meaningful events of a couple's life.

The couple's dashboard is a professional tool: couples should not be disadvantaged by disabilities when building their site.

> [!IMPORTANT]
> Accessibility is a **non-negotiable product requirement**, not a post-launch polish item. Features with accessibility issues will not be merged to `main`. The Lighthouse accessibility score must remain **≥ 90** on every PR.

### Legal Context

EverAfter operates globally. Accessibility regulations apply in key markets:
- **USA**: ADA (Americans with Disabilities Act) — courts increasingly apply this to web applications
- **EU**: European Accessibility Act (EAA), effective 2025
- **UK**: Equality Act 2010
- **Australia**: Disability Discrimination Act 1992

WCAG 2.1 AA compliance is the recognized technical standard across all these regulations.

---

## 2. Semantic HTML Requirements

Semantic HTML is the foundation of accessibility. It provides meaning to assistive technologies without requiring additional ARIA.

### 2.1 Document Structure

Every page must have a clear, logical heading hierarchy:

```html
<!-- ✅ Correct heading hierarchy -->
<h1>Sarah & Tom's Wedding</h1>   <!-- One per page, identifies the page -->
  <h2>Our Story</h2>
  <h2>The Ceremony</h2>
    <h3>Venue</h3>
    <h3>Schedule</h3>
  <h2>RSVP</h2>

<!-- ❌ Skipping heading levels -->
<h1>Sarah & Tom's Wedding</h1>
  <h3>Our Story</h3>  <!-- h2 skipped — screen reader users lose structure -->
```

**Rules:**
- One `<h1>` per page — the primary page title.
- Do not skip heading levels (h1 → h3 without h2).
- Do not choose heading levels based on visual size — use CSS for styling. Heading level communicates structure, not appearance.

### 2.2 Landmark Regions

Every page must include these landmark elements:

```html
<header>      <!-- Site header / navigation -->
<nav>         <!-- Primary navigation (aria-label="Main navigation") -->
<main>        <!-- Primary page content — one per page -->
<footer>      <!-- Site footer -->
<aside>       <!-- Supplementary content (e.g., sidebars) -->
```

Multiple `<nav>` elements are allowed — distinguish them with `aria-label`:

```html
<nav aria-label="Main navigation">...</nav>
<nav aria-label="Breadcrumb">...</nav>
```

### 2.3 Interactive Elements

| Purpose | Correct Element | Never Use |
|---|---|---|
| Navigation links | `<a href="...">` | `<div onClick>`, `<span onClick>` |
| Submit / trigger action | `<button>` | `<div onClick>`, `<span onClick>` |
| Form inputs | `<input>`, `<select>`, `<textarea>` | Styled `<div>` with JS |
| Data tables | `<table>` with `<th scope>` | CSS grid styled as a table |

> [!CAUTION]
> Using `<div>` or `<span>` with an `onClick` handler produces an element that is not reachable by keyboard and not announced by screen readers. This is one of the most common and most serious accessibility failures. If you must use a non-semantic element as interactive, you must add `role="button"`, `tabindex="0"`, and keyboard event handlers — but using `<button>` is always preferable.

### 2.4 Lists

Use `<ul>` / `<ol>` / `<li>` for groups of related items. Screen readers announce list length, which helps users orient themselves.

```html
<!-- Navigation items, feature lists, guest lists — all should use list markup -->
<ul>
  <li><a href="/story">Our Story</a></li>
  <li><a href="/ceremony">Ceremony</a></li>
  <li><a href="/rsvp">RSVP</a></li>
</ul>
```

---

## 3. Keyboard Navigation Requirements

All interactive functionality must be fully operable by keyboard alone, using only standard keys.

### 3.1 Standard Key Bindings

| Key | Expected Behavior |
|---|---|
| `Tab` | Move focus to the next interactive element |
| `Shift+Tab` | Move focus to the previous interactive element |
| `Enter` | Activate links, buttons |
| `Space` | Activate buttons, checkboxes |
| `Arrow keys` | Navigate within components (menus, radio groups, sliders, date pickers) |
| `Escape` | Close modal dialogs, dismiss menus, cancel |
| `Home` / `End` | First / last item in a list or menu |

### 3.2 Focus Order

The keyboard focus order must follow the visual and logical reading order of the page. Test by tabbing through every page — if focus jumps unexpectedly to a distant area of the page, investigate `tabindex` misuse.

**Prohibited:**
- `tabindex` values > 0 (e.g., `tabindex="2"`) — these disrupt natural tab order and are almost never necessary
- `tabindex="-1"` on elements that should be naturally focusable (use only for programmatically focused elements like modal containers)

### 3.3 Focus Visibility

Every focused element must have a **clearly visible focus indicator**. The browser's default outline is often too subtle (especially in Chromium with the thin blue ring).

Configure a consistent, high-visibility focus style in Tailwind:

```javascript
// tailwind.config.ts — extend default focus ring
theme: {
  extend: {
    ringColor: {
      DEFAULT: '#1C1C1C',  // Dark ring on light backgrounds
    },
    ringOffsetWidth: {
      DEFAULT: '2px',
    },
  },
},
```

Apply globally and consistently:

```css
/* globals.css */
:focus-visible {
  outline: 3px solid #1C1C1C;
  outline-offset: 3px;
  border-radius: 2px;
}

/* Suppress focus ring for mouse users (only show for keyboard navigation) */
:focus:not(:focus-visible) {
  outline: none;
}
```

> [!NOTE]
> Use `:focus-visible` (not `:focus`) for focus styles. `:focus-visible` only shows the outline when the element was reached via keyboard, preventing the ring from appearing on mouse clicks — a common UX complaint that leads teams to remove focus styles entirely (which is the wrong fix).

### 3.4 Keyboard Traps

Keyboard focus must never become "trapped" in a component from which the user cannot escape using the keyboard, **except** for modal dialogs where trapping focus is intentional and correct (see §4.1).

Test every dropdown, tooltip, popover, and disclosure widget to confirm focus can always leave the component.

---

## 4. Focus Management

### 4.1 Modal Dialogs

When a modal opens, focus must move into the modal and be trapped within it until the modal closes.

When a modal closes, focus must return to the element that triggered it.

Implementation requirements:

```typescript
// Use a library that implements this correctly, such as:
// - Radix UI Dialog (recommended — built-in focus trap, escape key, aria)
// - Headless UI Dialog
// - Your own implementation using focus-trap-react

import * as Dialog from '@radix-ui/react-dialog';

export function DeleteSiteModal({ trigger, siteId }: Props) {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <Dialog.Content
          className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 ..."
          aria-describedby="delete-description"
        >
          <Dialog.Title>Delete Wedding Site</Dialog.Title>
          <Dialog.Description id="delete-description">
            This will permanently delete your wedding site and all guest data.
            This action cannot be undone.
          </Dialog.Description>
          {/* Modal content */}
          <Dialog.Close asChild>
            <button aria-label="Close dialog">×</button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
```

Radix UI `Dialog` handles:
- Focus trap within the dialog
- Return focus to trigger on close
- `Escape` key to close
- `aria-modal="true"` on the content
- `role="dialog"` on the content

### 4.2 Route Transitions (Next.js App Router)

When navigating between pages, screen reader users need to know that the page content has changed. The App Router does not announce route changes automatically.

Add a live region announcer to the root layout:

```typescript
// components/RouteAnnouncer.tsx
'use client';
import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';

export function RouteAnnouncer() {
  const pathname = usePathname();
  const announcerRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    // Announce the new page title to screen readers after navigation
    const pageTitle = document.title;
    if (announcerRef.current) {
      announcerRef.current.textContent = '';
      // Small delay ensures the DOM has updated before announcing
      setTimeout(() => {
        if (announcerRef.current) {
          announcerRef.current.textContent = `Navigated to ${pageTitle}`;
        }
      }, 100);
    }
  }, [pathname]);

  return (
    <p
      ref={announcerRef}
      aria-live="polite"
      aria-atomic="true"
      className="sr-only"  // Visually hidden but available to screen readers
    />
  );
}
```

### 4.3 Dynamic Content Updates

When content updates dynamically (RSVP count changes, toast notifications, inline validation errors), use `aria-live` regions to announce the changes:

```html
<!-- Polite: waits for user to finish current interaction before announcing -->
<div aria-live="polite" aria-atomic="true">
  {{ rsvpCount }} guests attending
</div>

<!-- Assertive: interrupts immediately — use only for errors or urgent alerts -->
<div role="alert" aria-live="assertive">
  Payment failed. Please check your card details.
</div>
```

### 4.4 Toast Notifications

Toast notifications must be announced by screen readers. Use `role="status"` (equivalent to `aria-live="polite"`) for success toasts and `role="alert"` (equivalent to `aria-live="assertive"`) for error toasts:

```tsx
// Toast container — always present in DOM even when empty
<div aria-live="polite" aria-atomic="true" className="sr-only" id="toast-announcer" />

// When a toast shows, also update the announcer:
document.getElementById('toast-announcer')!.textContent = toastMessage;
```

---

## 5. Color Contrast Requirements

### 5.1 WCAG AA Contrast Ratios

| Text Type | Minimum Contrast Ratio (WCAG AA) | Enhanced (WCAG AAA) |
|---|---|---|
| Normal text (< 18pt / < 14pt bold) | **4.5:1** | 7:1 |
| Large text (≥ 18pt / ≥ 14pt bold) | **3:1** | 4.5:1 |
| UI components & graphical objects | **3:1** | — |
| Decorative elements | No requirement | — |

### 5.2 EverAfter Palette — Contrast Analysis

| Foreground | Background | Ratio | WCAG AA (Normal) | WCAG AA (Large) | Status |
|---|---|---|---|---|---|
| `#1C1C1C` (near-black) | `#FFFFFF` | **18.1:1** | ✅ Pass | ✅ Pass | Primary body text |
| `#1C1C1C` | `#F9F5F0` (cream) | **17.0:1** | ✅ Pass | ✅ Pass | Cream background sections |
| `#C9A96E` (gold) | `#FFFFFF` | **~2.6:1** | ❌ **FAIL** | ❌ **FAIL** | ⚠️ See §13 |
| `#C9A96E` | `#1C1C1C` | **~6.9:1** | ✅ Pass | ✅ Pass | Gold on dark bg |
| `#FFFFFF` | `#C9A96E` | **~2.6:1** | ❌ **FAIL** | ❌ **FAIL** | ⚠️ See §13 |
| `#FFFFFF` | `#1C1C1C` | **18.1:1** | ✅ Pass | ✅ Pass | Light text on dark |
| `#4B5563` (gray-600) | `#FFFFFF` | **7.0:1** | ✅ Pass | ✅ Pass | Secondary text |
| `#6B7280` (gray-500) | `#FFFFFF` | **4.6:1** | ✅ Pass | ✅ Pass | Placeholder text |
| `#9CA3AF` (gray-400) | `#FFFFFF` | **2.8:1** | ❌ **FAIL** | ✅ Pass | Avoid for small text |

> [!CAUTION]
> The brand gold `#C9A96E` on white (`#FFFFFF`) achieves only ~2.6:1 contrast ratio. This **fails WCAG AA for all text** (minimum 4.5:1 for normal text, 3:1 for large text). See §13 for full documentation of this issue and all mitigations.

### 5.3 Verified Safe Combinations

Use only these combinations for text:

```css
/* ✅ Safe: dark text on light backgrounds */
color: #1C1C1C;   background: #FFFFFF;      /* 18.1:1 */
color: #1C1C1C;   background: #F9F5F0;      /* 17.0:1 */
color: #4B5563;   background: #FFFFFF;      /* 7.0:1 */

/* ✅ Safe: gold text only on dark background */
color: #C9A96E;   background: #1C1C1C;      /* ~6.9:1 */

/* ✅ Safe: light text on dark backgrounds */
color: #FFFFFF;   background: #1C1C1C;      /* 18.1:1 */
color: #F9F5F0;   background: #1C1C1C;      /* 17.0:1 */
```

### 5.4 Contrast Checking Tools

- **Automated**: `eslint-plugin-jsx-a11y` with `color-contrast` rule (limited — requires manual check for dynamic values)
- **Figma**: [Contrast plugin](https://www.figma.com/community/plugin/748533339900865323) — check all designs before implementation
- **Browser**: [Colour Contrast Analyser (CCA)](https://www.tpgi.com/color-contrast-checker/) — eyedropper tool for real-pixel checking
- **Online**: [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)

Run contrast checks on every new color combination introduced in design or code.

---

## 6. Typography Accessibility

### 6.1 Minimum Font Sizes

| Context | Minimum Size |
|---|---|
| Body copy | `16px` (1rem) |
| Form labels | `16px` (1rem) |
| Form helper text / error messages | `14px` (0.875rem) — use sparingly |
| Button text | `14px` (0.875rem) minimum; `16px` preferred |
| Captions / fine print | `12px` (0.75rem) — only for legally required disclosures |

Never use `px` units for font sizes in CSS — use `rem` so that the type scales correctly when users adjust their browser's base font size.

```css
/* ❌ Fixed px — overrides user preference */
font-size: 16px;

/* ✅ rem — respects user base font size setting */
font-size: 1rem;
```

### 6.2 Line Height

| Context | Minimum Line Height |
|---|---|
| Body copy | `1.5` (150%) |
| Headings | `1.2` (120%) |
| Form inputs | `1.5` |

WCAG 1.4.12 (Text Spacing, AA) requires that no content or functionality is lost when users set line height to 1.5× the font size. Ensure all text containers are flexible enough to accommodate this.

### 6.3 Text Resize

All text must remain readable and all layout must remain functional when the user zooms to 200% (WCAG 1.4.4). Test by using `Ctrl+` / `Cmd+` zoom in the browser — content should reflow, not clip or overlap.

Do not disable user zoom with `<meta name="viewport" content="user-scalable=no">` — this is an accessibility violation.

### 6.4 Letter Spacing and Text Transforms

`text-transform: uppercase` makes text harder to read for some users (dyslexia). Use uppercase sparingly — only for short labels (button text, badges) and never for body copy.

Avoid `letter-spacing` values larger than `0.12em` on body text — excessive letter spacing reduces readability for users with cognitive disabilities.

---

## 7. Form Accessibility

Forms appear in the dashboard (site builder, account settings, billing) and on public wedding sites (RSVP form). All forms must meet the same standard.

### 7.1 Labels

Every form control must have a visible, programmatically associated label:

```html
<!-- ✅ Explicit label using htmlFor / for -->
<label htmlFor="guest-name">Full Name</label>
<input id="guest-name" type="text" name="guestName" />

<!-- ✅ Wrapping label (implicit association) -->
<label>
  Full Name
  <input type="text" name="guestName" />
</label>

<!-- ❌ Placeholder as the only label — disappears on input, fails WCAG -->
<input type="text" placeholder="Full Name" />

<!-- ❌ aria-label with no visible label — fails WCAG 2.5.3 (Label in Name) if visual label differs -->
<input type="text" aria-label="Full Name" />
```

`placeholder` attributes are permitted for additional guidance but must **never** be the sole label for an input.

### 7.2 Required Fields

Mark required fields both visually and programmatically:

```html
<!-- Visual asterisk + programmatic required attribute -->
<label htmlFor="email">
  Email Address
  <span aria-hidden="true">*</span>
  <span className="sr-only">(required)</span>
</label>
<input
  id="email"
  type="email"
  required
  aria-required="true"
/>

<!-- Inform users at the top of the form what * means -->
<p>Fields marked with <span aria-hidden="true">*</span> are required.</p>
```

### 7.3 Error Messages

Error messages must be:
- **Visible** — adjacent to the field, not just in a banner at the top
- **Descriptive** — explain what is wrong and how to fix it
- **Programmatically associated** with the field via `aria-describedby`
- **Announced** when they appear (via `aria-live` or `role="alert"`)

```tsx
// ✅ Accessible error message pattern
const [error, setError] = useState('');
const errorId = 'email-error';

<div>
  <label htmlFor="email">Email Address</label>
  <input
    id="email"
    type="email"
    aria-describedby={error ? errorId : undefined}
    aria-invalid={error ? 'true' : 'false'}
    className={error ? 'border-red-600' : 'border-gray-300'}
  />
  {error && (
    <p id={errorId} role="alert" className="text-red-700 text-sm mt-1">
      {error}
    </p>
  )}
</div>
```

### 7.4 Success States

Communicate successful submission clearly and announce it to screen readers:

```tsx
{submitted && (
  <div role="status" aria-live="polite" className="text-green-700">
    <CheckIcon aria-hidden="true" />
    Your RSVP has been received. We look forward to seeing you!
  </div>
)}
```

### 7.5 Fieldset and Legend for Groups

Use `<fieldset>` and `<legend>` for groups of related inputs (radio buttons, checkboxes, date fields):

```html
<fieldset>
  <legend>Will you be attending?</legend>
  <label>
    <input type="radio" name="attendance" value="yes" /> Yes, I'll be there
  </label>
  <label>
    <input type="radio" name="attendance" value="no" /> No, I can't make it
  </label>
</fieldset>
```

### 7.6 Autocomplete Attributes

Use `autocomplete` attributes to help users with motor impairments autofill common fields:

```html
<input type="text"  name="name"  autocomplete="name" />
<input type="email" name="email" autocomplete="email" />
<input type="tel"   name="phone" autocomplete="tel" />
```

---

## 8. Image Accessibility

### 8.1 Alt Text Policy

| Image Type | Alt Text Requirement | Example |
|---|---|---|
| Informative (content) | Describe what the image shows meaningfully | `alt="Sarah and Tom at their proposal site, Eiffel Tower in the background"` |
| Decorative (pure visual) | Empty alt (`alt=""`) — screen readers skip it | `alt=""` |
| Functional (buttons, links) | Describe the action / destination | `alt="Download our save the date card"` |
| Photographs of people | Identify the subjects if known | `alt="Tom's parents, Robert and Linda, at the rehearsal dinner"` |
| Text in image | Transcribe the text | `alt="Invitation text: You are invited to the wedding of..."` |

**Prohibited:**
- `alt="image"` / `alt="photo"` / `alt="pic"` — meaningless
- Using the filename as alt text — `alt="DSC_0047.jpg"` — meaningless
- Alt text longer than ~150 characters — use `aria-describedby` linking to a longer description instead

### 8.2 Couple-Uploaded Photos — Prompting for Alt Text

The photo upload UI in the dashboard must prompt couples to provide alt text for each uploaded photo:

```tsx
// After upload completes:
<div>
  <Image src={photo.thumbnailUrl} alt="" aria-hidden="true" width={80} height={60} />
  <label htmlFor={`alt-${photo.id}`}>
    Describe this photo for guests who cannot see it
    <span className="sr-only">(optional but recommended)</span>
  </label>
  <input
    id={`alt-${photo.id}`}
    type="text"
    placeholder="e.g., The couple dancing at their first dance"
    maxLength={150}
  />
</div>
```

If no alt text is provided, use a contextual fallback (not an empty string, since these are informative photos):

```typescript
const altText = photo.altText || `Wedding photo uploaded by ${site.coupleName}`;
```

### 8.3 Background Images

CSS background images (`background-image`) are not exposed to screen readers — they are inherently decorative. This is correct for hero backgrounds used purely for atmosphere. Never convey information through a CSS background image.

### 8.4 SVG Icons

Icons must have accessible text if they convey meaning:

```tsx
// ❌ Icon with no accessible label
<HeartIcon className="w-6 h-6 text-gold" />

// ✅ Icon with aria-label (standalone, functional icon)
<button aria-label="Add to favorites">
  <HeartIcon className="w-6 h-6" aria-hidden="true" />
</button>

// ✅ Icon decorative (label is provided by adjacent text)
<button>
  <HeartIcon className="w-6 h-6" aria-hidden="true" />
  <span>Favorite</span>
</button>
```

Always add `aria-hidden="true"` to icon SVGs to prevent screen readers from announcing the raw SVG path data.

---

## 9. ARIA Usage Guidelines

ARIA (Accessible Rich Internet Applications) attributes extend the accessibility of HTML. They should supplement — never replace — semantic HTML.

### 9.1 The First Rule of ARIA

> **Do not use ARIA if a native HTML element with the required semantics already exists.**

```html
<!-- ❌ Reinventing a button with ARIA -->
<div role="button" tabindex="0" onclick="...">Save</div>

<!-- ✅ Use the native element -->
<button onclick="...">Save</button>
```

### 9.2 ARIA Roles

Use ARIA roles only when no semantic HTML alternative exists:

| Situation | Correct ARIA |
|---|---|
| Custom dropdown menu | `role="menu"`, `role="menuitem"` |
| Tab interface | `role="tablist"`, `role="tab"`, `role="tabpanel"` |
| Progress indicator | `role="progressbar"` with `aria-valuenow`, `aria-valuemin`, `aria-valuemax` |
| Custom checkbox | `role="checkbox"` with `aria-checked` |
| Live region | `aria-live="polite"` or `role="status"` / `role="alert"` |

### 9.3 Common Patterns

**Disclosure / Accordion:**

```html
<button
  aria-expanded="false"
  aria-controls="story-content"
>
  Our Story
</button>
<div id="story-content" hidden>
  <!-- Content shown when aria-expanded="true" and hidden removed -->
</div>
```

**Progress (upload):**

```html
<div
  role="progressbar"
  aria-valuenow="65"
  aria-valuemin="0"
  aria-valuemax="100"
  aria-label="Photo upload progress"
>
  65%
</div>
```

**Status messages (non-error feedback):**

```html
<!-- Added to DOM when action completes — screen reader reads it immediately -->
<div role="status">
  Site published successfully.
</div>
```

### 9.4 aria-label vs aria-labelledby vs aria-describedby

| Attribute | Use When |
|---|---|
| `aria-label` | No visible label text exists; label is only needed for screen readers |
| `aria-labelledby` | A visible element serves as the label; point to its `id` |
| `aria-describedby` | Additional descriptive text supplements the existing label (error messages, hints) |

### 9.5 ARIA Anti-Patterns to Avoid

- `aria-label` on a `<div>` that isn't interactive — screen readers ignore it
- Redundant ARIA: `<button aria-role="button">` — already implicit
- `aria-hidden="true"` on the `<body>` — hides the entire page
- `role="presentation"` on interactive elements — removes all semantics including keyboard access
- Overusing `aria-live="assertive"` — should only be used for errors and urgent alerts; polite is sufficient for status updates

---

## 10. Screen Reader Testing

### 10.1 Testing Matrix

Test all new features with at least two screen reader / browser combinations before merging:

| Screen Reader | Browser | Platform | Priority |
|---|---|---|---|
| **NVDA** (free) | Firefox | Windows | High |
| **JAWS** | Chrome / Edge | Windows | High |
| **VoiceOver** | Safari | macOS / iOS | High |
| **TalkBack** | Chrome | Android | Medium |
| **Narrator** | Edge | Windows | Low |

> [!NOTE]
> NVDA + Firefox and VoiceOver + Safari represent the majority of real-world screen reader users. If you can only test two combinations, test these.

### 10.2 Testing Procedure

For every new page or significant component change, complete this screen reader walkthrough:

1. **Navigation**: Tab through the entire page — does focus order match visual order?
2. **Landmarks**: Use screen reader landmark navigation — are all sections discoverable?
3. **Headings**: Use heading navigation — does the hierarchy make sense out of visual context?
4. **Interactive elements**: Activate every button, link, and form control by keyboard — do they work?
5. **Dynamic content**: Trigger updates (form submissions, modals, toasts) — are changes announced?
6. **Forms**: Complete the RSVP form from start to finish — are errors announced? Is success confirmed?
7. **Images**: Navigate to all images — are alt texts meaningful?

### 10.3 Automated Testing

Automated tools catch approximately 30–40% of accessibility issues. They are necessary but not sufficient.

**Tools in use:**

- **`eslint-plugin-jsx-a11y`** — catches common ARIA misuse and missing attributes at write time
- **`axe-core`** (via `@axe-core/playwright` or `jest-axe`) — automated WCAG audits in CI
- **Lighthouse Accessibility** — Lighthouse score ≥ 90 required on every PR

**Playwright + axe-core integration:**

```typescript
// tests/accessibility/rsvp-form.test.ts
import { test, expect } from '@playwright/test';
import { checkA11y } from 'axe-playwright';

test('RSVP form meets WCAG 2.1 AA', async ({ page }) => {
  await page.goto('/demo'); // demo wedding site
  await checkA11y(page, undefined, {
    runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa'] },
  });
});
```

---

## 11. Public Wedding Site Accessibility

### 11.1 Why Public Sites Need Extra Attention

The public wedding site is the highest-visibility, highest-traffic surface. Its audience includes:

- **Elderly guests** — may have low vision, reduced motor dexterity, unfamiliarity with web conventions
- **Guests with disabilities** — screen reader users, keyboard-only users, users with cognitive disabilities
- **International guests** — the site may be in a different language; clear structure helps when language comprehension is impaired

The couple's dashboard audience is the couple and their planner — a more technically capable, consistent audience. The public site's audience is unpredictable.

### 11.2 Minimum Requirements for All Wedding Site Themes

Every wedding site theme shipped by EverAfter must pass these requirements. Themes that fail are not released.

- **Language attribute**: `<html lang="en">` (or the couple's chosen language)
- **Page title**: Meaningful `<title>` tag — e.g., "Sarah & Tom's Wedding | June 14, 2027"
- **Skip navigation**: A "Skip to main content" link as the first focusable element
- **Heading hierarchy**: Logical h1 → h2 → h3 structure
- **Focus visible**: All interactive elements have visible focus styles
- **RSVP form**: Fully keyboard-operable and screen-reader-tested
- **Color contrast**: All text meets 4.5:1 (normal) or 3:1 (large) — **no exceptions**
- **Images**: All images have appropriate alt text
- **Videos**: Any video has captions and audio description
- **No autoplay media**: Music or video does not autoplay without user consent

### 11.3 Skip Navigation Link

```html
<!-- First element in <body> — visually hidden until focused -->
<a
  href="#main-content"
  class="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 
         focus:z-50 focus:bg-white focus:text-gray-900 focus:px-4 focus:py-2 
         focus:rounded focus:shadow-lg focus:outline-none"
>
  Skip to main content
</a>

<!-- ... navigation ... -->

<main id="main-content" tabindex="-1">
  <!-- Page content -->
</main>
```

The `tabindex="-1"` on `<main>` allows it to receive programmatic focus (when the skip link is activated) without placing it in the natural tab order.

### 11.4 Couple-Controlled Content Risks

Couples write their own content (ceremony details, story, custom messages). This content is beyond EverAfter's direct control for accessibility. However, the platform should:

1. **Validate heading structure** in the rich text editor — warn if the couple adds an `<h1>` in the body (there should only be one h1).
2. **Prompt for alt text** on every image upload (§8.2).
3. **Provide accessibility tips** in the dashboard editor: "Make your site accessible to all guests" with specific guidance.
4. **Not allow custom CSS** that could remove focus styles or set `color: white; background: white`.

### 11.5 RSVP Form — Specific Requirements

The RSVP form is the single most critical interactive element on the public wedding site. It must be fully accessible.

- All fields have visible labels (not just placeholders)
- Required fields are marked with `*` and explained
- Dietary preference / accessibility needs field is included with sufficient space
- Form errors are announced and described per §7.3
- Success confirmation is announced per §7.4
- The form works without JavaScript (progressive enhancement) — at minimum, graceful degradation with a mailto fallback or a clear error message

---

## 12. Component Accessibility Checklist

Use this checklist when building or reviewing any UI component.

### Navigation / Links

- [ ] Uses `<a>` element with valid `href`
- [ ] Link text is descriptive (no "click here" or "read more" without context)
- [ ] External links indicate they open in a new tab (`aria-label="...(opens in new tab)"` or visible icon with screen-reader text)
- [ ] Active / current page link has `aria-current="page"`

### Buttons

- [ ] Uses `<button>` element (not `<div>` or `<span>`)
- [ ] Has descriptive text or `aria-label` for icon-only buttons
- [ ] Loading state communicates status: `aria-busy="true"` or `aria-label="Saving..."`
- [ ] Disabled state uses `disabled` attribute (not just visual styling)

### Modal Dialogs

- [ ] Focus moves into modal on open
- [ ] Focus is trapped within modal while open
- [ ] Focus returns to trigger element on close
- [ ] `Escape` key closes the modal
- [ ] Has `role="dialog"` and `aria-modal="true"`
- [ ] Has `aria-labelledby` pointing to the dialog title

### Dropdown Menus

- [ ] Trigger button has `aria-expanded` (true/false)
- [ ] Trigger button has `aria-haspopup="menu"` (or `"listbox"` for selects)
- [ ] `Escape` closes the menu and returns focus to trigger
- [ ] Arrow keys navigate menu items
- [ ] `Home` / `End` move to first/last item

### Forms

- [ ] Every input has a visible, associated `<label>`
- [ ] Required fields have `required` and `aria-required="true"`
- [ ] Error messages use `aria-describedby` and `aria-invalid="true"`
- [ ] Error messages use `role="alert"` for immediate announcement
- [ ] `autocomplete` attributes present on relevant fields

### Images

- [ ] All `<img>` elements have `alt` attribute
- [ ] Informative images have meaningful alt text
- [ ] Decorative images have `alt=""`
- [ ] Icon SVGs have `aria-hidden="true"`
- [ ] Icon buttons have `aria-label`

### Data Tables

- [ ] Uses `<table>`, `<th>`, `<td>` (not CSS grid styled as a table)
- [ ] Column headers use `<th scope="col">`
- [ ] Row headers (if any) use `<th scope="row">`
- [ ] `<caption>` describes the table's purpose

### Tabs

- [ ] Tab list uses `role="tablist"`
- [ ] Individual tabs use `role="tab"` with `aria-selected`
- [ ] Tab panels use `role="tabpanel"` with `aria-labelledby` pointing to tab
- [ ] Arrow keys navigate between tabs (not Tab key — Tab moves to panel)

### Accordions / Disclosures

- [ ] Toggle uses `<button>` with `aria-expanded`
- [ ] `aria-controls` points to the panel `id`
- [ ] Panel uses `hidden` attribute when collapsed (or `display: none`)

### Toast Notifications

- [ ] Success toasts use `role="status"` (polite)
- [ ] Error toasts use `role="alert"` (assertive)
- [ ] Toasts are dismissed with keyboard (Escape or dedicated close button)
- [ ] Auto-dismiss respects `prefers-reduced-motion`

---

## 13. Known Risks with the Color Palette

### 13.1 The Gold-on-White Contrast Failure

> [!CAUTION]
> **This is the most critical known accessibility issue in the EverAfter design system.** It must be understood by every engineer and designer.

The EverAfter brand gold `#C9A96E` placed on a white `#FFFFFF` background achieves a contrast ratio of approximately **2.6:1**.

This **fails WCAG 2.1 AA** for:
- Normal text (minimum 4.5:1 required) — fails
- Large text ≥ 18pt or bold ≥ 14pt (minimum 3:1 required) — fails
- UI components and graphical objects (minimum 3:1 required) — fails

To pass WCAG AA for normal text, the gold would need to be darkened to approximately **#7D5E2A** (4.5:1 against white). For large text only, approximately **#9A7240** (3:1 against white).

### 13.2 Approved Mitigations

The following mitigations are **mandatory** and enforced in code review:

#### Mitigation 1 — Gold is Decorative Only on White Backgrounds

`#C9A96E` on `#FFFFFF` is permitted **only for purely decorative visual elements** — ornamental dividers, floral SVG accents, borders, background patterns. These elements convey no information, so the WCAG contrast requirement does not apply to decorative elements.

```tsx
{/* ✅ Gold used decoratively — no information conveyed */}
<div className="h-px bg-gold-400 my-8" aria-hidden="true" />

{/* ❌ Gold used for text on white — FAILS WCAG AA */}
<h2 className="text-gold-400">Our Story</h2>
```

#### Mitigation 2 — All Text Uses Dark Color

All text on white or cream backgrounds uses `#1C1C1C` (near-black, 18.1:1) or `#4B5563` (gray-600, 7.0:1). Never use gold for body text, headings, labels, or error messages on light backgrounds.

```tsx
{/* ✅ Heading in near-black — 18.1:1 on white */}
<h2 className="text-gray-950 font-playfair text-3xl">Our Story</h2>

{/* Decorative gold underline accent beneath — purely visual */}
<div className="w-16 h-0.5 bg-gold-400 mt-2" aria-hidden="true" />
```

#### Mitigation 3 — Gold Text Only on Dark Backgrounds

Gold `#C9A96E` on `#1C1C1C` achieves ~6.9:1 and **passes WCAG AA** for normal text. If the brand gold must appear as text, it must only do so on a dark (`#1C1C1C`) background.

```tsx
{/* ✅ Gold text on dark background — 6.9:1 */}
<section className="bg-gray-950 py-16">
  <p className="text-gold-400 text-lg font-playfair italic">
    Together forever
  </p>
</section>
```

#### Mitigation 4 — Interactive Elements Must Use High-Contrast Colors

Buttons, links, and any interactive element must meet the 3:1 minimum for UI components and the 4.5:1 minimum if they contain text.

```tsx
{/* ❌ Gold button on white — text fails 4.5:1, border fails 3:1 */}
<button className="border border-gold-400 text-gold-400">
  RSVP Now
</button>

{/* ✅ Dark button with sufficient contrast */}
<button className="bg-gray-950 text-white hover:bg-gray-800">
  RSVP Now
</button>

{/* ✅ Gold button only when dark background provides contrast */}
<button className="bg-gold-400 text-gray-950">
  {/* bg-gold-400 (#C9A96E) with text-gray-950 (#1C1C1C) = ~6.9:1 ✅ */}
  RSVP Now
</button>
```

### 13.3 Couple-Chosen Theme Colors

Couples can customize their wedding site's primary color. The theme color picker must:

1. **Prevent** selecting a foreground color that would fail contrast on the theme background.
2. **Automatically calculate** the contrast ratio as the user picks a color.
3. **Display a warning** if the selected color fails WCAG AA: _"This color may be hard for some guests to read. Try a darker shade."_
4. **Offer accessible alternatives** — suggested similar colors that pass contrast.

```typescript
// Contrast ratio calculation utility
function getContrastRatio(hex1: string, hex2: string): number {
  const lum1 = getRelativeLuminance(hex1);
  const lum2 = getRelativeLuminance(hex2);
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  return (lighter + 0.05) / (darker + 0.05);
}

function getRelativeLuminance(hex: string): number {
  const rgb = hexToRgb(hex);
  const [r, g, b] = [rgb.r, rgb.g, rgb.b].map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

// In the theme color picker:
const ratio = getContrastRatio(selectedColor, '#FFFFFF');
const passesAA = ratio >= 4.5;
const passesAALarge = ratio >= 3.0;
```

### 13.4 Ongoing Monitoring

Every time a new color is introduced to the design system or Tailwind config:
1. Document it in the palette table in §5.2 with its contrast ratio.
2. Verify it against all backgrounds it will be used on.
3. If it fails, document clearly what it may and may not be used for.

No color should enter the codebase without a documented contrast analysis.

---

*Last updated: September 2026 · EverAfter Engineering*
