import { SectionCard } from "@commerceos/shared/components/section-card";
import { StatusBadge } from "@commerceos/shared/components/status-badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@commerceos/ui";
import { formatCurrency, formatDate } from "@commerceos/shared/lib/utils";
import { OrderHistoryOrderLink } from "../../components/order-history-order-link";
import type { Order } from "@commerceos/shared/types";

interface CustomerOrderHistoryProps {
  orders: Order[];
}

export function CustomerOrderHistory({ orders }: CustomerOrderHistoryProps) {
  return (
    <SectionCard title="Order History">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell>
                <OrderHistoryOrderLink order={order} />
              </TableCell>
              <TableCell className="table-cell-muted">{formatDate(order.date)}</TableCell>
              <TableCell>
                <StatusBadge status={order.status} />
              </TableCell>
              <TableCell>{formatCurrency(order.total)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </SectionCard>
  );
}
