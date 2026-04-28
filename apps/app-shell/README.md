# CommerceOS Admin

CommerceOS Admin is a simple ecommerce admin panel starter app built for frontend architecture workshops. It uses a single integrated React application with mock data, MSW-backed API handlers, route-oriented screens, and straightforward state flow.

## Stack

- React
- TypeScript
- Vite
- Bun
- TanStack Router
- TanStack Query
- Tailwind CSS
- shadcn-style UI primitives
- MSW
- lucide-react

## Run

```bash
bun install
bun run dev
```

## Scripts

```bash
bun run dev
bun run build
bun run lint
bun run typecheck
```

## Notes

- All data is mocked in `src/mocks`.
- There is no real backend.
- Mutations update in-memory mock state through MSW handlers.
- The structure intentionally stays centralized and route-oriented to reflect an early frontend monolith.
