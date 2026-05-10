import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "@tanstack/react-router";
import { router } from "./app/router/router";
import { AppProviders } from "./app/providers/AppProviders";
import { enableMocking } from "@commerceos/shared/mocks/browser";
import "@commerceos/shared/styles/globals.css";

void enableMocking().then(() => {
  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <AppProviders>
        <RouterProvider router={router} />
      </AppProviders>
    </React.StrictMode>,
  );
});
