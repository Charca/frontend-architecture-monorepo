import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "@tanstack/react-router";
import { AppProviders } from "@/app/providers/AppProviders";
import { createStandaloneRouter } from "@/app/router/standalone";
import ProfilePage from "@/modules/users/screens/profile/profile.index";
import RolesPermissionsPage from "@/modules/users/screens/users/roles-permissions";
import UserDetailPage from "@/modules/users/screens/users/users.detail";
import UsersPage from "@/modules/users/screens/users/users.index";
import "@/styles/globals.css";

async function enableMocking() {
  if (import.meta.env.DEV) {
    const { worker } = await import("@/mocks/browser");
    await worker.start({ onUnhandledRequest: "bypass" });
  }
}

const router = createStandaloneRouter([
  { path: "/users", component: UsersPage },
  { path: "/users/$userId", component: UserDetailPage },
  { path: "/users/roles-permissions", component: RolesPermissionsPage },
  { path: "/profile", component: ProfilePage },
]);

void enableMocking().then(() => {
  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode><AppProviders><RouterProvider router={router} /></AppProviders></React.StrictMode>,
  );
});
