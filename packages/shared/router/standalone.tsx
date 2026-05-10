import { QueryClient } from "@tanstack/react-query";
import { createRootRouteWithContext, createRoute, createRouter } from "@tanstack/react-router";
import type { RouteComponent } from "@tanstack/react-router";
import { StandaloneRoot } from "@commerceos/shared/router/standalone-root";

interface StandaloneRouterContext {
  queryClient: QueryClient;
}

export interface StandaloneRoute {
  path: string;
  component: RouteComponent;
}

export function createStandaloneRouter(routes: StandaloneRoute[]) {
  const rootRoute = createRootRouteWithContext<StandaloneRouterContext>()({
    component: StandaloneRoot,
  });

  const indexRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/",
    component: routes[0]?.component ?? StandaloneRoot,
  });

  const childRoutes = routes.map((route) =>
    createRoute({
      getParentRoute: () => rootRoute,
      path: route.path,
      component: route.component,
    }),
  );

  return createRouter({
    routeTree: rootRoute.addChildren([indexRoute, ...childRoutes]),
    context: {
      queryClient: new QueryClient(),
    },
    defaultPreload: "intent",
  });
}
