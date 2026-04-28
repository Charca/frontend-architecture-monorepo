import { Link } from "@tanstack/react-router";
import { Button } from "@commerceos/ui";
import type { Order } from "@commerceos/shared/types";

interface OrderDetailActionsProps {
  canManageOrders: boolean;
  canRefundOrders: boolean;
  order: Order;
  onAction: (payload: Partial<Order>) => void;
}

export function OrderDetailActions({ canManageOrders, canRefundOrders, order, onAction }: OrderDetailActionsProps) {
  return (
    <>
      <Link to="/orders">
        <Button variant="outline">Back to orders</Button>
      </Link>
      <Button variant="outline" disabled={!canManageOrders} onClick={() => onAction({ status: "fulfilled" })}>
        Mark fulfilled
      </Button>
      <Button
        variant="outline"
        disabled={!canRefundOrders}
        onClick={() =>
          onAction({
            refunds: [
              ...order.refunds,
              {
                id: `refund_${order.refunds.length + 1}`,
                amount: Math.min(20, order.total),
                reason: "Partial appeasement refund",
                createdAt: "2026-04-16",
              },
            ],
          })
        }
      >
        Partial refund
      </Button>
      <Button
        variant="outline"
        disabled={!canManageOrders}
        onClick={() =>
          onAction({
            returns: [
              ...order.returns,
              {
                id: `return_${order.returns.length + 1}`,
                productName: order.lineItems[0]?.productName ?? "Order item",
                quantity: 1,
                status: "requested",
                createdAt: "2026-04-16",
              },
            ],
          })
        }
      >
        Start return
      </Button>
      <Button
        variant="outline"
        disabled={!canManageOrders}
        onClick={() =>
          onAction({
            exchanges: [
              ...order.exchanges,
              {
                id: `exchange_${order.exchanges.length + 1}`,
                originalProductName: order.lineItems[0]?.productName ?? "Order item",
                replacementProductName: `${order.lineItems[0]?.productName ?? "Order item"} replacement`,
                status: "pending",
                createdAt: "2026-04-16",
              },
            ],
          })
        }
      >
        Create exchange
      </Button>
      <Button variant="outline" disabled={!canManageOrders} onClick={() => onAction({ status: "cancelled", paymentStatus: "refunded" })}>
        Cancel
      </Button>
      <Button variant="destructive" disabled={!canRefundOrders} onClick={() => onAction({ status: "refunded", paymentStatus: "refunded" })}>
        Refund
      </Button>
    </>
  );
}
