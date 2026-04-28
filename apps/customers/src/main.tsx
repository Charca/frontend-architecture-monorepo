import React from "react";
import ReactDOM from "react-dom/client";
import { createRootRoute, createRoute, createRouter, RouterProvider } from "@tanstack/react-router";
import { AppProviders } from "@commerceos/shared/providers/AppProviders";
import "@commerceos/ui/styles.css";
import { DevApp } from "./dev-app";

const rootRoute = createRootRoute({
  component: DevApp,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: DevApp,
});

const router = createRouter({
  routeTree: rootRoute.addChildren([indexRoute]),
  defaultPreload: "intent",
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AppProviders>
      <RouterProvider router={router} />
    </AppProviders>
  </React.StrictMode>,
);
