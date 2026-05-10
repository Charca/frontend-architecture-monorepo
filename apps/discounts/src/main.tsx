import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "@tanstack/react-router";
import { AppProviders } from "@/app/providers/AppProviders";
import { createStandaloneRouter } from "@/app/router/standalone";
import DiscountsPage from "@/modules/discounts/screens/discounts.index";
import DiscountDetailPage from "@/modules/discounts/screens/discounts.detail";
import NewDiscountPage from "@/modules/discounts/screens/discounts.new";
import "@/styles/globals.css";

async function enableMocking() {
  if (import.meta.env.DEV) {
    const { worker } = await import("@/mocks/browser");
    await worker.start({ onUnhandledRequest: "bypass" });
  }
}

const router = createStandaloneRouter([
  { path: "/discounts", component: DiscountsPage },
  { path: "/discounts/new", component: NewDiscountPage },
  { path: "/discounts/$discountId", component: DiscountDetailPage },
]);

void enableMocking().then(() => {
  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode><AppProviders><RouterProvider router={router} /></AppProviders></React.StrictMode>,
  );
});
