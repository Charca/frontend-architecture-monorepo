import { randomUUID } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { serve } from "@hono/node-server";
import { cors } from "hono/cors";
import type { Context } from "hono";
import { Hono } from "hono";
import {
  authenticateUser,
  createDiscount,
  createProduct,
  exportStoreSnapshot,
  getAccount,
  getAccountPermissions,
  getAccountUser,
  getAccountUsers,
  getAnalyticsOverview,
  getCurrentUser,
  getDashboardSummary,
  getCustomer,
  getDiscount,
  getOrder,
  getProduct,
  getSessionFromToken,
  getSettings,
  hasPermission,
  importStoreSnapshot,
  listCustomers,
  listDiscounts,
  listInventory,
  listOrders,
  listProducts,
  setStorePersistHandler,
  switchSessionAccount,
  updateAccount,
  updateAccountPermissions,
  updateAccountUser,
  updateCurrentUser,
  updateCustomer,
  updateDiscount,
  updateInventory,
  updateOrder,
  updateProduct,
  updateSettings,
  type StoreSnapshot,
} from "@commerceos/shared/mocks/data/store";
import type {
  Account,
  AccountMember,
  AccountPermissionPolicy,
  AuthSession,
  Customer,
  Discount,
  InventoryItem,
  Order,
  Product,
  SettingsData,
} from "@commerceos/shared/types";

const app = new Hono();
const port = Number(process.env.PORT ?? "3001");
const appRoot = path.resolve(import.meta.dirname, "..");
const dataDir = path.join(appRoot, "data");
const dbFilePath = path.join(dataDir, "db.json");
const uploadsDir = path.join(dataDir, "uploads");

let persistTask = Promise.resolve();

function parseAuthToken(authHeader: string | null) {
  return authHeader?.startsWith("Bearer ") ? authHeader.replace("Bearer ", "") : null;
}

function requireSession(request: Request) {
  const session = getSessionFromToken(parseAuthToken(request.headers.get("Authorization")));
  if (!session) {
    return { error: "Unauthorized" as const, status: 401 as const };
  }

  return { session };
}

function requirePermission(request: Request, permission: Parameters<typeof hasPermission>[1]) {
  const sessionResult = requireSession(request);
  if ("error" in sessionResult) {
    return sessionResult;
  }

  if (!hasPermission(sessionResult.session, permission)) {
    return { error: "Forbidden" as const, status: 403 as const };
  }

  return sessionResult;
}

function requireActiveAccount(request: Request, accountId: string) {
  const sessionResult = requireSession(request);
  if ("error" in sessionResult) {
    return sessionResult;
  }

  const canAccessAccount = sessionResult.session.memberships.some((membership) => membership.account.id === accountId);
  if (!canAccessAccount) {
    return { error: "Account not available for current user" as const, status: 403 as const };
  }

  return sessionResult;
}

function queuePersist(snapshot: StoreSnapshot) {
  persistTask = persistTask
    .then(async () => {
      await fs.mkdir(dataDir, { recursive: true });
      await fs.writeFile(dbFilePath, JSON.stringify(snapshot, null, 2));
    })
    .catch((error) => {
      console.error("Failed to persist DB file", error);
    });
}

async function bootStorePersistence() {
  await fs.mkdir(dataDir, { recursive: true });
  await fs.mkdir(uploadsDir, { recursive: true });

  try {
    const raw = await fs.readFile(dbFilePath, "utf8");
    importStoreSnapshot(JSON.parse(raw) as Partial<StoreSnapshot>);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
      throw error;
    }
  }

  setStorePersistHandler((snapshot) => {
    queuePersist(snapshot);
  });

  queuePersist(exportStoreSnapshot());
}

function getExtensionFromMimeType(mimeType: string) {
  switch (mimeType) {
    case "image/jpeg":
      return ".jpg";
    case "image/png":
      return ".png";
    case "image/webp":
      return ".webp";
    case "image/gif":
      return ".gif";
    case "image/svg+xml":
      return ".svg";
    default:
      return "";
  }
}

function getUploadFileName(originalName: string, mimeType: string) {
  const parsedExtension = path.extname(originalName).toLowerCase();
  const extension = parsedExtension || getExtensionFromMimeType(mimeType) || ".bin";
  return `${Date.now()}-${randomUUID()}${extension}`;
}

app.use("/api/*", cors());

app.get("/health", (c) => c.json({ ok: true }));

app.post("/api/auth/login", async (c) => {
  const payload = (await c.req.json()) as { email: string; password: string };
  const session = authenticateUser(payload.email, payload.password);

  if (!session) {
    return c.json({ message: "Invalid email or password" }, 401);
  }

  return c.json(session satisfies AuthSession);
});

app.get("/api/auth/session", (c) => {
  const session = getSessionFromToken(parseAuthToken(c.req.header("Authorization") ?? null));
  if (!session) {
    return c.json({ message: "Unauthorized" }, 401);
  }

  return c.json(session);
});

app.post("/api/auth/logout", (c) => c.body(null, 204));

app.post("/api/auth/switch-account", async (c) => {
  const sessionResult = requireSession(c.req.raw);
  if ("error" in sessionResult) {
    return c.json({ message: sessionResult.error }, sessionResult.status);
  }

  const payload = (await c.req.json()) as { accountId: string };
  const nextSession = switchSessionAccount(parseAuthToken(c.req.header("Authorization") ?? null), payload.accountId);
  if (!nextSession) {
    return c.json({ message: "Account not available for current user" }, 403);
  }

  return c.json(nextSession);
});

app.get("/api/me", (c) => {
  const result = requireSession(c.req.raw);
  if ("error" in result) {
    return c.json({ message: result.error }, result.status);
  }

  const user = getCurrentUser(result.session.user.id);
  return user ? c.json(user) : c.json({ message: "Not found" }, 404);
});

app.patch("/api/me", async (c) => {
  const result = requireSession(c.req.raw);
  if ("error" in result) {
    return c.json({ message: result.error }, result.status);
  }

  const payload = (await c.req.json()) as Partial<AccountMember>;
  const user = updateCurrentUser(result.session.user.id, payload);
  return user ? c.json(user) : c.json({ message: "Not found" }, 404);
});

app.get("/api/dashboard/summary", (c) => {
  const result = requirePermission(c.req.raw, "dashboard.view");
  if ("error" in result) {
    return c.json({ message: result.error }, result.status);
  }

  return c.json(getDashboardSummary(result.session.activeAccount.id));
});

app.get("/api/products", (c) => {
  const result = requirePermission(c.req.raw, "catalog.view");
  if ("error" in result) {
    return c.json({ message: result.error }, result.status);
  }

  return c.json(listProducts(result.session.activeAccount.id));
});

app.post("/api/products", async (c) => {
  const result = requirePermission(c.req.raw, "catalog.edit");
  if ("error" in result) {
    return c.json({ message: result.error }, result.status);
  }

  const payload = (await c.req.json()) as Omit<Product, "id">;
  return c.json(createProduct(result.session.activeAccount.id, payload), 201);
});

app.get("/api/products/:id", (c) => {
  const result = requirePermission(c.req.raw, "catalog.view");
  if ("error" in result) {
    return c.json({ message: result.error }, result.status);
  }

  const product = getProduct(result.session.activeAccount.id, c.req.param("id"));
  return product ? c.json(product) : c.json({ message: "Not found" }, 404);
});

app.patch("/api/products/:id", async (c) => {
  const result = requirePermission(c.req.raw, "catalog.edit");
  if ("error" in result) {
    return c.json({ message: result.error }, result.status);
  }

  const payload = (await c.req.json()) as Partial<Product>;
  return c.json(updateProduct(result.session.activeAccount.id, c.req.param("id"), payload));
});

app.get("/api/inventory", (c) => {
  const result = requirePermission(c.req.raw, "inventory.view");
  if ("error" in result) {
    return c.json({ message: result.error }, result.status);
  }

  return c.json(listInventory(result.session.activeAccount.id));
});

app.patch("/api/inventory/:id", async (c) => {
  const result = requirePermission(c.req.raw, "inventory.edit");
  if ("error" in result) {
    return c.json({ message: result.error }, result.status);
  }

  const payload = (await c.req.json()) as Partial<InventoryItem>;
  return c.json(updateInventory(result.session.activeAccount.id, c.req.param("id"), payload));
});

app.get("/api/orders", (c) => {
  const result = requirePermission(c.req.raw, "orders.view");
  if ("error" in result) {
    return c.json({ message: result.error }, result.status);
  }

  return c.json(listOrders(result.session.activeAccount.id));
});

app.get("/api/orders/:id", (c) => {
  const result = requirePermission(c.req.raw, "orders.view");
  if ("error" in result) {
    return c.json({ message: result.error }, result.status);
  }

  const order = getOrder(result.session.activeAccount.id, c.req.param("id"));
  return order ? c.json(order) : c.json({ message: "Not found" }, 404);
});

app.patch("/api/orders/:id", async (c) => {
  const result = requireSession(c.req.raw);
  if ("error" in result) {
    return c.json({ message: result.error }, result.status);
  }

  const payload = (await c.req.json()) as Partial<Order>;
  const permission = payload.refunds ? "orders.refund" : "orders.manage";
  if (!hasPermission(result.session, permission)) {
    return c.json({ message: "Forbidden" }, 403);
  }

  return c.json(updateOrder(result.session.activeAccount.id, c.req.param("id"), payload));
});

app.get("/api/customers", (c) => {
  const result = requirePermission(c.req.raw, "customers.view");
  if ("error" in result) {
    return c.json({ message: result.error }, result.status);
  }

  return c.json(listCustomers(result.session.activeAccount.id));
});

app.get("/api/customers/:id", (c) => {
  const result = requirePermission(c.req.raw, "customers.view");
  if ("error" in result) {
    return c.json({ message: result.error }, result.status);
  }

  const customer = getCustomer(result.session.activeAccount.id, c.req.param("id"));
  return customer ? c.json(customer) : c.json({ message: "Not found" }, 404);
});

app.patch("/api/customers/:id", async (c) => {
  const result = requirePermission(c.req.raw, "customers.view");
  if ("error" in result) {
    return c.json({ message: result.error }, result.status);
  }

  const payload = (await c.req.json()) as Partial<Customer>;
  const customer = updateCustomer(result.session.activeAccount.id, c.req.param("id"), payload);
  return customer ? c.json(customer) : c.json({ message: "Not found" }, 404);
});

app.get("/api/discounts", (c) => {
  const result = requirePermission(c.req.raw, "discounts.view");
  if ("error" in result) {
    return c.json({ message: result.error }, result.status);
  }

  return c.json(listDiscounts(result.session.activeAccount.id));
});

app.post("/api/discounts", async (c) => {
  const result = requirePermission(c.req.raw, "discounts.manage");
  if ("error" in result) {
    return c.json({ message: result.error }, result.status);
  }

  const payload = (await c.req.json()) as Omit<Discount, "id" | "usageCount">;
  return c.json(createDiscount(result.session.activeAccount.id, payload), 201);
});

app.get("/api/discounts/:id", (c) => {
  const result = requirePermission(c.req.raw, "discounts.view");
  if ("error" in result) {
    return c.json({ message: result.error }, result.status);
  }

  const discount = getDiscount(result.session.activeAccount.id, c.req.param("id"));
  return discount ? c.json(discount) : c.json({ message: "Not found" }, 404);
});

app.patch("/api/discounts/:id", async (c) => {
  const result = requirePermission(c.req.raw, "discounts.manage");
  if ("error" in result) {
    return c.json({ message: result.error }, result.status);
  }

  const payload = (await c.req.json()) as Partial<Discount>;
  return c.json(updateDiscount(result.session.activeAccount.id, c.req.param("id"), payload));
});

app.get("/api/analytics/overview", (c) => {
  const result = requirePermission(c.req.raw, "analytics.view");
  if ("error" in result) {
    return c.json({ message: result.error }, result.status);
  }

  return c.json(getAnalyticsOverview(result.session.activeAccount.id));
});

app.get("/api/settings", (c) => {
  const result = requirePermission(c.req.raw, "settings.view");
  if ("error" in result) {
    return c.json({ message: result.error }, result.status);
  }

  return c.json(getSettings(result.session.activeAccount.id));
});

app.patch("/api/settings", async (c) => {
  const result = requireSession(c.req.raw);
  if ("error" in result) {
    return c.json({ message: result.error }, result.status);
  }

  const payload = (await c.req.json()) as Partial<SettingsData>;
  if (
    (payload.shipping && !hasPermission(result.session, "settings.shipping.manage")) ||
    (payload.taxes && !hasPermission(result.session, "settings.tax.manage")) ||
    (payload.notifications && !hasPermission(result.session, "settings.notifications.manage"))
  ) {
    return c.json({ message: "Forbidden" }, 403);
  }

  return c.json(updateSettings(result.session.activeAccount.id, payload));
});

app.get("/api/accounts/:accountId", (c) => {
  const accountId = c.req.param("accountId");
  const result = requireActiveAccount(c.req.raw, accountId);
  if ("error" in result) {
    return c.json({ message: result.error }, result.status);
  }

  return c.json(getAccount(accountId));
});

app.patch("/api/accounts/:accountId", async (c) => {
  const accountId = c.req.param("accountId");
  const result = requireActiveAccount(c.req.raw, accountId);
  if ("error" in result) {
    return c.json({ message: result.error }, result.status);
  }

  if (!hasPermission(result.session, "settings.account_profile.manage")) {
    return c.json({ message: "Forbidden" }, 403);
  }

  const payload = (await c.req.json()) as Partial<Account>;
  return c.json(updateAccount(accountId, payload));
});

app.get("/api/accounts/:accountId/settings", (c) => {
  const accountId = c.req.param("accountId");
  const result = requireActiveAccount(c.req.raw, accountId);
  if ("error" in result) {
    return c.json({ message: result.error }, result.status);
  }

  if (!hasPermission(result.session, "settings.view")) {
    return c.json({ message: "Forbidden" }, 403);
  }

  return c.json(getSettings(accountId));
});

app.patch("/api/accounts/:accountId/settings", async (c) => {
  const accountId = c.req.param("accountId");
  const result = requireActiveAccount(c.req.raw, accountId);
  if ("error" in result) {
    return c.json({ message: result.error }, result.status);
  }

  const payload = (await c.req.json()) as Partial<SettingsData>;
  if (
    (payload.shipping && !hasPermission(result.session, "settings.shipping.manage")) ||
    (payload.taxes && !hasPermission(result.session, "settings.tax.manage")) ||
    (payload.notifications && !hasPermission(result.session, "settings.notifications.manage"))
  ) {
    return c.json({ message: "Forbidden" }, 403);
  }

  return c.json(updateSettings(accountId, payload));
});

app.get("/api/accounts/:accountId/users", (c) => {
  const accountId = c.req.param("accountId");
  const result = requireActiveAccount(c.req.raw, accountId);
  if ("error" in result) {
    return c.json({ message: result.error }, result.status);
  }

  if (!hasPermission(result.session, "settings.users.manage")) {
    return c.json({ message: "Forbidden" }, 403);
  }

  return c.json(getAccountUsers(accountId));
});

app.get("/api/accounts/:accountId/users/:userId", (c) => {
  const accountId = c.req.param("accountId");
  const userId = c.req.param("userId");
  const result = requireActiveAccount(c.req.raw, accountId);
  if ("error" in result) {
    return c.json({ message: result.error }, result.status);
  }

  if (!hasPermission(result.session, "settings.users.manage")) {
    return c.json({ message: "Forbidden" }, 403);
  }

  const user = getAccountUser(accountId, userId);
  return user ? c.json(user) : c.json({ message: "Not found" }, 404);
});

app.patch("/api/accounts/:accountId/users/:userId", async (c) => {
  const accountId = c.req.param("accountId");
  const userId = c.req.param("userId");
  const result = requireActiveAccount(c.req.raw, accountId);
  if ("error" in result) {
    return c.json({ message: result.error }, result.status);
  }

  if (!hasPermission(result.session, "settings.users.manage")) {
    return c.json({ message: "Forbidden" }, 403);
  }

  const payload = (await c.req.json()) as Partial<AccountMember>;
  return c.json(updateAccountUser(accountId, userId, payload));
});

app.get("/api/accounts/:accountId/permissions", (c) => {
  const accountId = c.req.param("accountId");
  const result = requireActiveAccount(c.req.raw, accountId);
  if ("error" in result) {
    return c.json({ message: result.error }, result.status);
  }

  if (!hasPermission(result.session, "settings.permissions.manage")) {
    return c.json({ message: "Forbidden" }, 403);
  }

  return c.json(getAccountPermissions(accountId));
});

app.patch("/api/accounts/:accountId/permissions", async (c) => {
  const accountId = c.req.param("accountId");
  const result = requireActiveAccount(c.req.raw, accountId);
  if ("error" in result) {
    return c.json({ message: result.error }, result.status);
  }

  if (!hasPermission(result.session, "settings.permissions.manage")) {
    return c.json({ message: "Forbidden" }, 403);
  }

  const payload = (await c.req.json()) as Partial<AccountPermissionPolicy>;
  return c.json(updateAccountPermissions(accountId, payload));
});

async function handleImageUpload(c: Context) {
  const payload = (await c.req.json()) as { dataUrl?: string; fileName?: string };
  const dataUrl = typeof payload.dataUrl === "string" ? payload.dataUrl : "";
  const fileName = typeof payload.fileName === "string" ? payload.fileName : "upload";
  const match = dataUrl.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/);

  if (!match) {
    return c.json({ message: "Invalid image payload" }, 400);
  }

  const [, mimeType, base64Data] = match;
  const bytes = Buffer.from(base64Data, "base64");
  if (!bytes.length) {
    return c.json({ message: "Uploaded image is empty" }, 400);
  }

  await fs.mkdir(uploadsDir, { recursive: true });
  const uploadFileName = getUploadFileName(fileName, mimeType);
  await fs.writeFile(path.join(uploadsDir, uploadFileName), bytes);

  return c.json({ url: `/api/uploads/${uploadFileName}` }, 201);
}

app.post("/api/uploads/image", handleImageUpload);

app.post("/api/uploads/avatar", handleImageUpload);

app.get("/api/uploads/:fileName", async (c) => {
  const fileName = path.basename(c.req.param("fileName"));
  const filePath = path.join(uploadsDir, fileName);

  try {
    const content = await fs.readFile(filePath);
    const extension = path.extname(fileName).toLowerCase();
    const contentType =
      extension === ".jpg" || extension === ".jpeg" ? "image/jpeg" :
      extension === ".png" ? "image/png" :
      extension === ".gif" ? "image/gif" :
      extension === ".webp" ? "image/webp" :
      extension === ".svg" ? "image/svg+xml" :
      "application/octet-stream";

    return new Response(content, { headers: { "Content-Type": contentType } });
  } catch {
    return c.json({ message: "Not found" }, 404);
  }
});

app.notFound((c) => c.json({ message: "Not found" }, 404));

app.onError((error, c) => {
  console.error(error);
  return c.json({ message: "Internal server error" }, 500);
});

await bootStorePersistence();
serve({ fetch: app.fetch, port });
console.log(`CommerceOS API running on http://localhost:${port}`);
