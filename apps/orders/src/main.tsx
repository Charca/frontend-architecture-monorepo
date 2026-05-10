import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "@tanstack/react-router";
import { AppProviders } from "@/app/providers/AppProviders";
import { createStandaloneRouter } from "@/app/router/standalone";
import OrdersPage from "@/modules/orders/screens/orders.index";
import OrderDetailPage from "@/modules/orders/screens/orders.detail";
import "@/styles/globals.css";

async function enableMocking() {
  if (import.meta.env.DEV) {
    const { worker } = await import("@/mocks/browser");
    await worker.start({ onUnhandledRequest: "bypass" });
  }
}

const router = createStandaloneRouter([
  { path: "/orders", component: OrdersPage },
  { path: "/orders/$orderId", component: OrderDetailPage },
]);

void enableMocking().then(() => {
  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode><AppProviders><RouterProvider router={router} /></AppProviders></React.StrictMode>,
  );
});
