## Quick orientation

This is a small React + TypeScript single-page app for creating, templating and scheduling invoices. App state is in-memory and bootstrapped from `data/mockData.ts`. There is no backend wiring in the repository — most logic lives in small utility modules under `utils/`.

## Big-picture architecture (what to know first)
- Entry: `App.tsx` — central state owner (accounts, invoices, templates, schedules). It passes state and handlers down to components via props.
- UI: `components/` contains feature components (DashboardView, InvoiceForm, TemplateList, InvoiceViewer). `components/ui/` contains design-system primitives (Dialog, Button, Input, Select, Toaster).
- Business logic: `utils/` (notably `invoiceGenerator.ts`, `currencyConverter.ts`, `dateCalculator.ts`, `nbgExchangeRate.ts`) — use these for deterministic generation, currency conversion and scheduling.
- Types: `types/index.ts` is the canonical source for domain shapes (Invoice, InvoiceTemplate, Account, EmailSchedule). Prefer reading/updating types here when changing data shapes.

## Common data flows & examples
- Creating an invoice from a template: `App.tsx` -> `generateInvoiceFromTemplate(template, invoiceNumber)` (from `utils/invoiceGenerator.ts`) -> `getNextInvoiceNumber(invoices)` for numbering -> state updated in `App.tsx`.
- Currency conversions: `convertCurrency(amount, from, to)` uses local mock rates in `currencyConverter.ts`. There is also `utils/nbgExchangeRate.ts` for fetching NBG rates — it falls back to mock data if network fails.
- Scheduling / recurrence: `calculateNextDate(frequency, dayOfMonth)` in `dateCalculator.ts` determines `nextGenerationDate` for templates.

## Project-specific conventions & patterns
- Single source of truth: `App.tsx` owns live state; most components are controlled and expect props + callbacks (onSave, onEdit, onDelete). If you add a new feature, wire it through `App.tsx` unless you introduce a global store.
- Mock-first: repository uses `data/mockData.ts` for initial data; persistency and API integrations are intentionally absent — follow the mock-data shapes when creating test fixtures.
- ID strategy: many IDs are plain strings generated with `Date.now()` or explicit strings in mock data. Be defensive when parsing invoice numbers (see `getNextInvoiceNumber`).
- UI primitives: reuse components from `components/ui/` instead of creating ad-hoc inputs; they follow the same prop patterns (open/close for Dialog, value/onValueChange for Select, etc.).

## Integration points & external deps to watch
- `utils/nbgExchangeRate.ts` calls the NBG API; treat network calls as optional for local dev (the function returns mock rates on failure).
- The code imports `sonner` toaster and `lucide-react` icons (see `components/*` imports). Confirm these packages exist in `package.json` before running.

## Developer workflow notes (discoverable from repo)
- There is no discoverable `package.json` scripts or CI config in the workspace (the top-level `package.json` appears empty). Before running the app, confirm with the repository owner which package manager and scripts to use (typical commands: `npm install` then `npm run dev` for Vite / CRA projects).
- No automated tests found in the tree. If you add tests, place them alongside the module (e.g., `utils/invoiceGenerator.test.ts`) and follow the TypeScript config used by the project.

## Where to make safe, low-risk changes
- Small UI/UX: edit `components/InvoiceForm.tsx`, `TemplateForm.tsx`, or `InvoiceList.tsx` — these are isolated and fed by `App.tsx` state.
- Business logic: change `utils/*` functions for calculations or currency conversions. Remember to keep `types/index.ts` in sync when changing shapes.

## Helpful file pointers (examples to open first)
- `App.tsx` — the hub for state & handlers (example: template -> invoice flow).
- `utils/invoiceGenerator.ts` — invoice creation, numbering and template-next-date update.
- `types/index.ts` — domain model and enums.
- `data/mockData.ts` — canonical example data for development.

If anything above looks incomplete or you want more detail (scripts to run, missing package.json entries, or preferred test runner), tell me what to probe next and I will update this guidance.
