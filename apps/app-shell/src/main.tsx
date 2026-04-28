import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "@tanstack/react-router";
import { router } from "@/app/router/router";
import { AppProviders } from "@commerceos/shared/providers/AppProviders";
import "@commerceos/ui/styles.css";

async function enableMocking() {
  if (import.meta.env.DEV) {
    const { worker } = await import("@commerceos/shared/mocks/browser");
    await worker.start({
      onUnhandledRequest: "bypass",
    });
  }
}

void enableMocking().then(() => {
  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <AppProviders>
        <RouterProvider router={router} />
      </AppProviders>
    </React.StrictMode>,
  );
});
