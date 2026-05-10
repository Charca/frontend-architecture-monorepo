import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "@tanstack/react-router";
import { AppProviders } from "@/app/providers/AppProviders";
import { createStandaloneRouter } from "@/app/router/standalone";
import CustomersPage from "@/modules/customers/screens/customers.index";
import CustomerDetailPage from "@/modules/customers/screens/customers.detail";
import "@/styles/globals.css";

async function enableMocking() {
  if (import.meta.env.DEV) {
    const { worker } = await import("@/mocks/browser");
    await worker.start({ onUnhandledRequest: "bypass" });
  }
}

const router = createStandaloneRouter([
  { path: "/customers", component: CustomersPage },
  { path: "/customers/$customerId", component: CustomerDetailPage },
]);

void enableMocking().then(() => {
  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode><AppProviders><RouterProvider router={router} /></AppProviders></React.StrictMode>,
  );
});
