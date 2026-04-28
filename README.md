# CommerceOS Frontend Architecture Monorepo

This repo is the workspace-based version of the CommerceOS frontend. It uses plain npm workspaces, with no task runner such as Turborepo.

## Workspace Layout

- `apps/app-shell`: integrated CommerceOS app shell, router, login, layout, navigation, dashboard, and upload middleware.
- `apps/*`: independently runnable domain Vite apps for analytics, catalog, customers, discounts, inventory, orders, profile, roles/permissions, search, settings, and users.
- `packages/ui`: low-level UI primitives and shared Tailwind 4 global styles.
- `packages/shared`: shared API clients, mocks, providers, auth utilities, types, hooks, formatting helpers, and reusable app components.
- `packages/tooling`: shared TypeScript, ESLint, and Vite config helpers.

## Commands

- `npm install`: install dependencies and link workspaces.
- `npm run dev`: start the integrated app shell.
- `npm run dev --workspace=@commerceos/catalog`: start a single module app.
- `npm run typecheck`: typecheck every workspace.
- `npm run lint`: lint every workspace.
- `npm run build`: build every runnable app workspace.
- `npm run preview`: preview the integrated app shell build.

The app shell is the primary user-facing runtime. Module apps expose route screens to the shell and also include a minimal local Vite entrypoint for isolated development.
