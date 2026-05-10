import type { CustomerSegment } from "@commerceos/customers/domain/customers.types";
import type { OrderStatus } from "@commerceos/orders/domain/orders.types";

export interface AnalyticsOverview {
  revenue: number;
  aov: number;
  orders: number;
  performanceTrend: Array<{ label: string; revenue: number; orders: number }>;
  conversionTrend: Array<{ label: string; value: number }>;
  categoryRevenue: Array<{ label: string; value: number }>;
  customerSegments: Array<{ label: CustomerSegment; value: number }>;
  orderStatusMix: Array<{ label: OrderStatus; value: number }>;
}
