# Repository Guidelines

## Project Structure & Module Organization
This workspace is the integrated React + TypeScript app shell inside the monorepo. Shell-specific code lives in `src/`.

- `src/routes/`: route-level screens, including dynamic segments such as `orders/$orderId.tsx`
- `src/app/`: app bootstrap, router setup, and providers
- `src/components/`: shell-only layout and navigation pieces
- `../../packages/ui`: low-level UI primitives and global styles
- `../../packages/shared`: shared providers, API helpers, mocks, types, and reusable components
- `../*`: domain apps that export route screens consumed by the shell
- `public/`: static assets and the MSW worker file

Use the `@/` import alias for shell-local modules. Use workspace package imports such as `@commerceos/ui`, `@commerceos/shared`, and `@commerceos/catalog` for code outside the shell.

## Build, Test, and Development Commands
Use npm workspaces from the repo root.

- `npm install`: install dependencies and link workspaces
- `npm run dev`: start the integrated Vite app shell with MSW enabled in development
- `npm run build`: run TypeScript checks, then build all Vite apps
- `npm run typecheck`: run `tsc --noEmit` across workspaces
- `npm run lint`: run ESLint across workspaces
- `npm run preview`: serve the built app shell locally

## Coding Style & Naming Conventions
Use TypeScript and function components. Follow the existing style: 2-space indentation, double quotes, semicolons, and trailing commas where the formatter leaves them. Keep route files aligned with URL structure (`catalog/index.tsx`, `catalog/$productId.tsx`).

Component files are typically kebab-case (`app-shell.tsx`, `status-badge.tsx`), while exported React components and TypeScript interfaces use PascalCase. Keep domain helpers close to their area (`src/api/orders.ts`, `src/utils/discounts.ts`).

## Testing Guidelines
There is no dedicated automated test runner configured yet. Until one is added, every change should pass `bun run lint`, `bun run typecheck`, and, when relevant, `bun run build`.

When adding tests, keep them next to the feature or under a focused `src/**/__tests__/` folder, and name files `*.test.ts` or `*.test.tsx`.

## Commit & Pull Request Guidelines
Recent commits use short, imperative subjects such as `Tailwind 4` and `CSS config`. Keep commit titles brief and descriptive; one logical change per commit.

Pull requests should include a concise summary, note affected routes or modules, link the related issue when applicable, and attach screenshots or short recordings for UI changes.
