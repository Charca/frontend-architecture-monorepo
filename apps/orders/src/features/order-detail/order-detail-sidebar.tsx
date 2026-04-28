import { ActivityHistoryCard } from "@commerceos/shared/components/activity-history-card";
import { KeyValueList } from "@commerceos/shared/components/key-value-list";
import { SectionCard } from "@commerceos/shared/components/section-card";
import { StatusBadge } from "@commerceos/shared/components/status-badge";
import { formatCurrency, formatDate } from "@commerceos/shared/lib/utils";
import type { Order } from "@commerceos/shared/types";

interface OrderDetailSidebarProps {
  order: Order;
}

export function OrderDetailSidebar({ order }: OrderDetailSidebarProps) {
  const refundedAmount = order.refunds.reduce((sum, refund) => sum + refund.amount, 0);

  return (
    <div className="space-y-6">
      <SectionCard title="Summary">
        <KeyValueList
          items={[
            { label: "Order status", value: <StatusBadge status={order.status} /> },
            { label: "Payment", value: <StatusBadge status={order.paymentStatus} /> },
            { label: "Customer", value: order.customerName },
            { label: "Price list", value: order.appliedPriceListName ?? "Retail default" },
            { label: "Total", value: formatCurrency(order.total) },
            { label: "Refunded", value: formatCurrency(refundedAmount) },
          ]}
        />
      </SectionCard>
      <SectionCard title="Shipping Info" contentClassName="space-y-1 text-sm">
        <div>{order.shippingAddress.name}</div>
        <div>{order.shippingAddress.line1}</div>
        <div>
          {order.shippingAddress.city}, {order.shippingAddress.region} {order.shippingAddress.postalCode}
        </div>
        <div>{order.shippingAddress.country}</div>
      </SectionCard>
      <SectionCard title="Shipment Tracking">
        <KeyValueList
          items={[
            { label: "Carrier", value: order.shipment.carrier },
            { label: "Tracking", value: order.shipment.trackingNumber },
            { label: "Shipment status", value: <StatusBadge status={order.shipment.status} /> },
            { label: "Shipped", value: order.shipment.shippedAt ? formatDate(order.shipment.shippedAt) : "Not shipped yet" },
            {
              label: "Estimated delivery",
              value: order.shipment.estimatedDelivery ? formatDate(order.shipment.estimatedDelivery) : "Pending",
            },
          ]}
        />
      </SectionCard>
      <SectionCard title="Returns and Refunds" contentClassName="space-y-4 text-sm">
        <div className="space-y-2">
          <div className="font-medium">Refunds</div>
          {order.refunds.length ? (
            order.refunds.map((refund) => (
              <div key={refund.id} className="rounded-md border p-3">
                <div className="flex items-center justify-between">
                  <span>{refund.reason}</span>
                  <span>{formatCurrency(refund.amount)}</span>
                </div>
                <div className="text-muted-foreground">{formatDate(refund.createdAt)}</div>
              </div>
            ))
          ) : (
            <div className="text-muted-foreground">No refunds recorded.</div>
          )}
        </div>
        <div className="space-y-2">
          <div className="font-medium">Returns</div>
          {order.returns.length ? (
            order.returns.map((entry) => (
              <div key={entry.id} className="rounded-md border p-3">
                <div className="flex items-center justify-between">
                  <span>{entry.productName}</span>
                  <StatusBadge status={entry.status} />
                </div>
                <div className="text-muted-foreground">
                  Qty {entry.quantity} · {formatDate(entry.createdAt)}
                </div>
              </div>
            ))
          ) : (
            <div className="text-muted-foreground">No returns recorded.</div>
          )}
        </div>
        <div className="space-y-2">
          <div className="font-medium">Exchanges</div>
          {order.exchanges.length ? (
            order.exchanges.map((entry) => (
              <div key={entry.id} className="rounded-md border p-3">
                <div className="flex items-center justify-between">
                  <span>{entry.originalProductName}</span>
                  <StatusBadge status={entry.status} />
                </div>
                <div className="text-muted-foreground">
                  For {entry.replacementProductName} · {formatDate(entry.createdAt)}
                </div>
              </div>
            ))
          ) : (
            <div className="text-muted-foreground">No exchanges recorded.</div>
          )}
        </div>
      </SectionCard>
      <SectionCard title="Notes" contentClassName="text-sm text-muted-foreground">
        {order.notes || "No notes available."}
      </SectionCard>
      <ActivityHistoryCard entries={order.activityHistory} />
    </div>
  );
}
