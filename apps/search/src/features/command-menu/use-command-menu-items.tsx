import { useMemo } from "react";
import type { LucideIcon } from "lucide-react";
import {
  ChartColumn,
  Cog,
  CreditCard,
  FilePlus2,
  LayoutDashboard,
  Package,
  PackageSearch,
  Receipt,
  Settings,
  Truck,
  Users,
} from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { fetchCustomers } from "@commerceos/shared/api/customers";
import { fetchOrders } from "@commerceos/shared/api/orders";
import { fetchProducts } from "@commerceos/shared/api/products";
import { fetchAccountUsers } from "@commerceos/shared/api/accounts";
import { useAuth } from "@commerceos/shared/providers/use-auth";
import { ROLE_LABELS } from "@commerceos/shared/lib/auth";
import { formatCurrency, formatDate } from "@commerceos/shared/lib/utils";
import type { PermissionKey } from "@commerceos/shared/types";
import { useQuery } from "@tanstack/react-query";

export interface CommandItem {
  id: string;
  label: string;
  section: string;
  subtitle: string;
  keywords: string;
  icon: LucideIcon;
  permission?: PermissionKey;
  run: () => Promise<void> | void;
}

const settingsSections = [
  {
    id: "store-profile",
    label: "Store Profile",
    subtitle: "Store name, support email, currency, and timezone",
    keywords: "settings store profile support email currency timezone",
    icon: Cog,
  },
  {
    id: "shipping",
    label: "Shipping",
    subtitle: "Default carrier and shipping rates",
    keywords: "settings shipping carrier standard express rate",
    icon: Truck,
  },
  {
    id: "taxes",
    label: "Taxes",
    subtitle: "Tax region, default rate, and inclusive pricing",
    keywords: "settings taxes nexus region default rate prices include tax",
    icon: CreditCard,
  },
  {
    id: "notifications",
    label: "Notifications",
    subtitle: "Low-stock, order alert, and digest preferences",
    keywords: "settings notifications low stock order alerts weekly digest",
    icon: Settings,
  },
] as const;

function matchesQuery(item: Pick<CommandItem, "label" | "subtitle" | "keywords">, query: string) {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) return true;
  return `${item.label} ${item.subtitle} ${item.keywords}`.toLowerCase().includes(normalizedQuery);
}

interface UseCommandMenuItemsOptions {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  query: string;
}

export function useCommandMenuItems({ open, onOpenChange, query }: UseCommandMenuItemsOptions) {
  const navigate = useNavigate();
  const { session, hasPermission, switchAccount } = useAuth();

  const { data: products = [] } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
    enabled: open && hasPermission("catalog.view"),
    staleTime: 60_000,
  });
  const { data: orders = [] } = useQuery({
    queryKey: ["orders"],
    queryFn: fetchOrders,
    enabled: open && hasPermission("orders.view"),
    staleTime: 60_000,
  });
  const { data: customers = [] } = useQuery({
    queryKey: ["customers"],
    queryFn: fetchCustomers,
    enabled: open && hasPermission("customers.view"),
    staleTime: 60_000,
  });
  const { data: accountUsers = [] } = useQuery({
    queryKey: ["accounts", session?.activeAccount.id, "users"],
    queryFn: () => fetchAccountUsers(session?.activeAccount.id ?? ""),
    enabled: open && Boolean(session?.activeAccount.id) && hasPermission("settings.users.manage"),
    staleTime: 60_000,
  });

  return useMemo(() => {
    const navigateAndClose = async (callback: () => Promise<unknown>) => {
      onOpenChange(false);
      await callback();
    };

    const baseItems: CommandItem[] = [
      {
        id: "go-dashboard",
        label: "Go to Dashboard",
        section: "Navigate",
        subtitle: "Overview of revenue, orders, customers, and alerts",
        keywords: "home dashboard summary overview",
        icon: LayoutDashboard,
        permission: "dashboard.view",
        run: () => navigateAndClose(() => navigate({ to: "/" })),
      },
      {
        id: "go-catalog",
        label: "Go to Catalog",
        section: "Navigate",
        subtitle: "Browse products, pricing, and merchandising state",
        keywords: "catalog products inventory merchandise",
        icon: Package,
        permission: "catalog.view",
        run: () => navigateAndClose(() => navigate({ to: "/catalog" })),
      },
      {
        id: "go-inventory",
        label: "Go to Inventory",
        section: "Navigate",
        subtitle: "Review warehouse quantities and stock health",
        keywords: "inventory stock warehouse low stock",
        icon: PackageSearch,
        permission: "inventory.view",
        run: () => navigateAndClose(() => navigate({ to: "/inventory" })),
      },
      {
        id: "go-orders",
        label: "Go to Orders",
        section: "Navigate",
        subtitle: "Track order flow, fulfillment, and aftercare",
        keywords: "orders fulfillment shipment returns refunds",
        icon: Receipt,
        permission: "orders.view",
        run: () => navigateAndClose(() => navigate({ to: "/orders" })),
      },
      {
        id: "go-customers",
        label: "Go to Customers",
        section: "Navigate",
        subtitle: "Browse customer profiles, segments, and spend",
        keywords: "customers people buyers segments spend",
        icon: Users,
        permission: "customers.view",
        run: () => navigateAndClose(() => navigate({ to: "/customers" })),
      },
      {
        id: "go-discounts",
        label: "Go to Discounts",
        section: "Navigate",
        subtitle: "Manage active and archived discount rules",
        keywords: "discounts promotions coupons offers",
        icon: CreditCard,
        permission: "discounts.view",
        run: () => navigateAndClose(() => navigate({ to: "/discounts" })),
      },
      {
        id: "go-analytics",
        label: "Go to Analytics",
        section: "Navigate",
        subtitle: "View revenue, AOV, conversion, and category trends",
        keywords: "analytics revenue charts reports",
        icon: ChartColumn,
        permission: "analytics.view",
        run: () => navigateAndClose(() => navigate({ to: "/analytics" })),
      },
      {
        id: "go-settings",
        label: "Go to Settings",
        section: "Navigate",
        subtitle: "Open store configuration and operations settings",
        keywords: "settings configuration preferences store profile shipping taxes",
        icon: Settings,
        permission: "settings.view",
        run: () => navigateAndClose(() => navigate({ to: "/settings" })),
      },
      {
        id: "go-users",
        label: "Go to Users",
        section: "Navigate",
        subtitle: "Manage account members and role assignments",
        keywords: "users team members roles access account",
        icon: Users,
        permission: "settings.users.manage",
        run: () => navigateAndClose(() => navigate({ to: "/users" })),
      },
      {
        id: "go-profile",
        label: "Go to Profile",
        section: "Navigate",
        subtitle: "Edit your own name, email, title, and avatar",
        keywords: "profile me account avatar personal settings",
        icon: Users,
        permission: "dashboard.view",
        run: () => navigateAndClose(() => navigate({ to: "/profile" })),
      },
      {
        id: "go-roles-permissions",
        label: "Go to Roles & Permissions",
        section: "Navigate",
        subtitle: "Customize Admin and User permission sets",
        keywords: "users roles permissions access policy admin user",
        icon: Settings,
        permission: "settings.permissions.manage",
        run: () => navigateAndClose(() => navigate({ to: "/users/roles-permissions" })),
      },
      {
        id: "new-discount",
        label: "Create Discount",
        section: "Create",
        subtitle: "Open the new discount flow",
        keywords: "create new add discount promotion coupon",
        icon: FilePlus2,
        permission: "discounts.manage",
        run: () => navigateAndClose(() => navigate({ to: "/discounts/new" })),
      },
      ...settingsSections.map((section) => ({
        id: `settings-${section.id}`,
        label: `Open ${section.label}`,
        section: "Settings",
        subtitle: section.subtitle,
        keywords: section.keywords,
        icon: section.icon,
        permission:
          section.id === "store-profile" ? "settings.account_profile.manage" :
          section.id === "shipping" ? "settings.shipping.manage" :
          section.id === "taxes" ? "settings.tax.manage" :
          section.id === "notifications" ? "settings.notifications.manage" :
          "settings.view",
        run: () => navigateAndClose(() => navigate({ to: "/settings", hash: section.id })),
      })),
      ...(session?.memberships.length
        ? session.memberships.map((membership) => ({
            id: `account-${membership.account.id}`,
            label: `Switch to ${membership.account.name}`,
            section: "Accounts",
            subtitle: ROLE_LABELS[membership.role],
            keywords: `${membership.account.name} account switch tenant ${membership.role}`,
            icon: Cog,
            run: () => navigateAndClose(() => switchAccount(membership.account.id)),
          }))
        : []),
    ];

    const productItems: CommandItem[] = products.map((product) => ({
      id: `product-${product.id}`,
      label: product.name,
      section: "Products",
      subtitle: `${product.sku} · ${product.category} · ${formatCurrency(product.price)}`,
      keywords: `product ${product.name} ${product.sku} ${product.category} ${product.status}`,
      icon: Package,
      permission: "catalog.view",
      run: () => navigateAndClose(() => navigate({ to: "/catalog/$productId", params: { productId: product.id } })),
    }));

    const orderItems: CommandItem[] = orders.map((order) => ({
      id: `order-${order.id}`,
      label: `${order.orderNumber} · ${order.customerName}`,
      section: "Orders",
      subtitle: `${formatDate(order.date)} · ${order.status} · ${formatCurrency(order.total)}`,
      keywords: `order ${order.orderNumber} ${order.customerName} ${order.status} ${order.paymentStatus} ${order.shipment.carrier}`,
      icon: Receipt,
      permission: "orders.view",
      run: () => navigateAndClose(() => navigate({ to: "/orders/$orderId", params: { orderId: order.id } })),
    }));

    const customerItems: CommandItem[] = customers.map((customer) => ({
      id: `customer-${customer.id}`,
      label: customer.name,
      section: "Customers",
      subtitle: `${customer.email} · ${customer.segment} · ${formatCurrency(customer.lifetimeSpend)}`,
      keywords: `customer ${customer.name} ${customer.email} ${customer.segment} ${customer.tags.join(" ")}`,
      icon: Users,
      permission: "customers.view",
      run: () => navigateAndClose(() => navigate({ to: "/customers/$customerId", params: { customerId: customer.id } })),
    }));

    const userItems: CommandItem[] = accountUsers.map((user) => ({
      id: `user-${user.userId}`,
      label: user.name,
      section: "Users",
      subtitle: `${user.email} · ${ROLE_LABELS[user.role]} · ${user.title}`,
      keywords: `user ${user.name} ${user.email} ${user.title} ${user.role} team member account`,
      icon: Users,
      permission: "settings.users.manage",
      run: () => navigateAndClose(() => navigate({ to: "/users/$userId", params: { userId: user.userId } })),
    }));

    const filterItems = (itemsToFilter: CommandItem[]) =>
      itemsToFilter
        .filter((item) => !item.permission || hasPermission(item.permission))
        .filter((item) => matchesQuery(item, query));

    const filteredBaseItems = filterItems(baseItems);
    const filteredProductItems = filterItems(productItems).slice(0, query ? 6 : 4);
    const filteredOrderItems = filterItems(orderItems).slice(0, query ? 6 : 4);
    const filteredCustomerItems = filterItems(customerItems).slice(0, query ? 6 : 4);
    const filteredUserItems = filterItems(userItems).slice(0, query ? 6 : 4);

    return [
      ...filteredBaseItems,
      ...filteredProductItems,
      ...filteredOrderItems,
      ...filteredCustomerItems,
      ...filteredUserItems,
    ];
  }, [accountUsers, customers, hasPermission, navigate, onOpenChange, orders, products, query, session?.memberships, switchAccount]);
}
