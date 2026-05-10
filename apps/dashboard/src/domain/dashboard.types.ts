import type { Discount } from "@commerceos/discounts/domain/discounts.types";
import type { InventoryItem } from "@commerceos/inventory/domain/inventory.types";
import type { Order, OrderStatus } from "@commerceos/orders/domain/orders.types";

export interface DashboardSummary {
  revenue: number;
  orders: number;
  customers: number;
  lowStockItems: number;
  recentOrderRevenueTrend: Array<{ label: string; revenue: number; orders: number }>;
  orderDistribution: Array<{ label: OrderStatus; value: number }>;
  recentOrders: Order[];
  notifications: {
    lowStock: InventoryItem[];
    expiringDiscounts: Discount[];
  };
  topProducts: Array<{
    productId: string;
    name: string;
    unitsSold: number;
    revenue: number;
  }>;
}
