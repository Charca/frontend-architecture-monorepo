import { QueryClient } from "@tanstack/react-query";
import { createRootRouteWithContext, createRoute, createRouter } from "@tanstack/react-router";
import type { RouteComponent } from "@tanstack/react-router";
import { StandaloneRoot } from "@/app/router/standalone-root";
import type { RouterContext } from "@/app/router/router";

export interface StandaloneRoute {
  path: string;
  component: RouteComponent;
}

export function createStandaloneRouter(routes: StandaloneRoute[]) {
  const rootRoute = createRootRouteWithContext<RouterContext>()({
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
