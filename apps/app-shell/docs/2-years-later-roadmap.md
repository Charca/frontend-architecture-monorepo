# 2 Years Later Roadmap

This roadmap keeps the current architecture and folder shape intact. The goal is to make the monolith feel historically layered: still workable, still recognizable, but increasingly harder to reason about as features, business rules, and team-specific patterns accumulate.

## 6 Months Later

The app is still coherent, but pressure is starting to show.

- Add product variants with variant-level SKU, price, and inventory.
- Add collections for merchandising and smarter catalog filtering.
- Add shipment tracking and carrier details on order pages.
- Add customer segments such as `VIP`, `Wholesale`, and `At Risk`.
- Add low-stock notifications and expiring-discount alerts.

Technical drift:

- Catalog introduces a more extracted filtering pattern than Orders and Customers.
- Analytics adds a separate date helper library instead of reusing existing utilities.
- New dashboard widgets require more cross-query invalidation after order and inventory changes.

Team/process drift:

- A second team starts contributing and follows local patterns instead of shared conventions.
- PRs optimize for shipping features, not consolidating duplicated logic.

## 1 Year Later

Cross-domain coupling is now visible in normal feature work.

- Add bundles and kits that consume multiple inventory items.
- Add returns, exchanges, and partial refunds to the order lifecycle.
- Add wholesale pricing and customer-specific price lists.
- Add discount eligibility rules by segment, category, and minimum spend.
- Add audit-log style activity history for products, orders, and discounts.

Technical drift:

- Pricing and discount logic now exists in route code, API helpers, and mock store derivations.
- Shared form components gain more props to handle unrelated workflows.
- Settings starts acting like admin infrastructure for roles, notification rules, and feature flags.
- Different domains use different patterns for optimistic updates versus refetch-after-save.

Team/process drift:

- Teams disagree on whether business logic belongs in pages, hooks, or helpers.
- Temporary compatibility code stays in place because nobody owns cleanup.
- New contributors copy nearby implementations, increasing inconsistency.

## 2 Years Later

The architecture still looks simple, but routine changes require touching too many places.

- Add multi-warehouse transfers and purchase orders for restocking.
- Add loyalty or store credit tied to customer and refund flows.
- Add campaign attribution and abandoned-cart style analytics slices.
- Add role-based permissions for sensitive actions such as refunds, price edits, and tax changes.
- Add global search across products, orders, customers, and operational actions.

Technical drift:

- Order workflows trigger updates in inventory, analytics, notifications, customer history, and dashboard summaries.
- Multiple status mappers and formatting helpers exist with slightly different rules.
- Query keys and invalidation logic are inconsistent across domains.
- One isolated high-priority feature ships with a different rendering stack and stays as a permanent exception.
- Some routes are thin shells over helpers; others are large orchestration components with embedded business logic.

Team/process drift:

- Team growth and turnover remove the original architectural intent.
- Review standards differ by squad, so consistency is negotiated case by case.
- “Temporary” experiments, flags, and workarounds become part of the steady-state codebase.

## End State To Demonstrate

By the end of this branch, the monolith should still use the same overall architecture: route-oriented screens, shared component primitives, centralized mock-backed data, and simple folder boundaries. The lesson is that even without a rewrite, the architecture becomes strained when long-lived product growth and inconsistent team choices accumulate inside it.
