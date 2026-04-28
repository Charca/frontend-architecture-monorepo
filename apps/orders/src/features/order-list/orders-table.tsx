import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { EmptyState } from "@commerceos/shared/feedback/empty-state";
import { SectionCard } from "@commerceos/shared/components/section-card";
import { StatusBadge } from "@commerceos/shared/components/status-badge";
import { Select } from "@commerceos/ui";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@commerceos/ui";
import { formatCurrency, formatDate } from "@commerceos/shared/lib/utils";
import type { Order } from "@commerceos/shared/types";

interface OrdersTableProps {
  orders: Order[];
}

export function OrdersTable({ orders }: OrdersTableProps) {
  const [status, setStatus] = useState("all");
  const filteredOrders = useMemo(
    () => orders.filter((order) => status === "all" || order.status === status),
    [orders, status],
  );

  return (
    <SectionCard contentClassName="space-y-4">
      <div className="max-w-xs">
        <Select value={status} onChange={(event) => setStatus(event.target.value)}>
          <option value="all">All statuses</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="fulfilled">Fulfilled</option>
          <option value="cancelled">Cancelled</option>
          <option value="refunded">Refunded</option>
        </Select>
      </div>
      {filteredOrders.length ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Price List</TableHead>
              <TableHead>Shipment</TableHead>
              <TableHead>Aftercare</TableHead>
              <TableHead>Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>
                  <Link to="/orders/$orderId" params={{ orderId: order.id }} className="font-medium text-primary hover:underline">
                    {order.orderNumber}
                  </Link>
                </TableCell>
                <TableCell>{order.customerName}</TableCell>
                <TableCell className="table-cell-muted">{formatDate(order.date)}</TableCell>
                <TableCell>
                  <StatusBadge status={order.status} />
                </TableCell>
                <TableCell className="table-cell-muted">{order.appliedPriceListName ?? "Retail default"}</TableCell>
                <TableCell>
                  <div className="text-sm">{order.shipment.carrier}</div>
                  <div className="table-cell-muted">
                    {order.shipment.status.replace("_", " ")} · {order.shipment.trackingNumber}
                  </div>
                </TableCell>
                <TableCell className="table-cell-muted">
                  {order.returns.length} returns · {order.refunds.length} refunds
                </TableCell>
                <TableCell>{formatCurrency(order.total)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <EmptyState title="No orders in this status" description="Try a different status filter." />
      )}
    </SectionCard>
  );
}
