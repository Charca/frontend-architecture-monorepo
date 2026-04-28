# Complexity Map

This repo starts as a clean route-oriented admin monolith. Two years later, the architecture is still recognizable, but the app becomes harder to change because scope, patterns, and business rules grow unevenly. The point is not that the original setup was wrong; it is that a simplicity-first monolith needs strong guardrails to survive growth.

## Product Drift

- Catalog grows from simple products into variants, bundles, collections, and customer-specific pricing.
- Orders pick up returns, exchanges, partial refunds, shipment issues, and internal operational notes.
- Customers become segments, wholesale accounts, store credit holders, and support records.
- Discounts evolve from flat codes into eligibility rules, stacking rules, and campaign-linked promotions.
- Settings absorb permissions, feature flags, notification rules, and operational configuration.
- Analytics begins to depend on order states, discount logic, stock health, and customer segmentation.

## Technical Drift

- Similar screens use different patterns for fetching, filtering, and mutations.
- Business logic spreads across route components, API helpers, mock handlers, and shared utilities.
- Query invalidation becomes broader and more manual as one action affects more surfaces.
- Reusable UI primitives remain, but teams bypass them for one-off admin controls.
- State ownership gets muddled between React Query, local form state, and derived UI state.
- Older code remains inline while newer areas extract hooks or helper layers.
- Utility files become catch-all places for formatting, business rules, and view logic.
- Mixed libraries appear for the same problem, such as multiple date or charting approaches.

## Team and Process Drift

- The original team grows into multiple squads with different habits.
- One team favors route-heavy pages, another extracts domain hooks, another copies nearby code.
- Deadlines reward local fixes over shared abstractions.
- Turnover erodes the original architectural intent, so conventions become inconsistent.
- Temporary flags, compatibility paths, and experiments stop feeling temporary.
- Review standards vary, so inconsistency is tolerated as long as the feature ships.

## Repo-Specific Coupling Hotspots

- Order actions affect inventory, customer history, dashboard metrics, analytics, and notifications.
- Discount changes leak into catalog display, customer segments, order totals, and attribution.
- Inventory state influences catalog badges, dashboard summaries, reorder workflows, and alerts.
- Settings start controlling tax, currency, permissions, and notification behavior across routes.
- Dashboard widgets depend on increasingly fragile aggregation logic from every other domain.

## Believable Mess Signals

- Two date libraries in use.
- Different table filtering patterns per domain.
- Repeated status-label helpers with slightly different behavior.
- Mixed query key naming and invalidation strategies.
- Shared form and table components with too many props.
- One isolated experimental feature built with a different rendering stack.
- Duplicate pricing and discount logic in both UI and data helpers.

## Workshop Framing

The architecture does not fail because it is simplistic. It fails because it scales through accumulation: more rules, more teams, more exceptions, and more local optimizations. The codebase still looks simple from far away, but it stops behaving simply when a change needs to cross domain boundaries.
