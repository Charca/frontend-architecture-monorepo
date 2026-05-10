import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "@tanstack/react-router";
import { AppProviders } from "@/app/providers/AppProviders";
import { createStandaloneRouter } from "@/app/router/standalone";
import CatalogPage from "@/modules/catalog/screens/catalog.index";
import ProductDetailPage from "@/modules/catalog/screens/catalog.detail";
import NewProductPage from "@/modules/catalog/screens/catalog.new";
import "@/styles/globals.css";

async function enableMocking() {
  if (import.meta.env.DEV) {
    const { worker } = await import("@/mocks/browser");
    await worker.start({ onUnhandledRequest: "bypass" });
  }
}

const router = createStandaloneRouter([
  { path: "/catalog", component: CatalogPage },
  { path: "/catalog/new", component: NewProductPage },
  { path: "/catalog/$productId", component: ProductDetailPage },
]);

void enableMocking().then(() => {
  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode><AppProviders><RouterProvider router={router} /></AppProviders></React.StrictMode>,
  );
});
