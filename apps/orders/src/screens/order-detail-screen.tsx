import { useParams } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchOrder, updateOrder } from "@commerceos/shared/api/orders";
import { useAuth } from "@commerceos/shared/providers/use-auth";
import { LoadingState } from "@commerceos/shared/feedback/loading-state";
import { PageHeader } from "@commerceos/shared/components/page-header";
import { SectionCard } from "@commerceos/shared/components/section-card";
import { formatDate } from "@commerceos/shared/lib/utils";
import { OrderLineItemsTable } from "@commerceos/shared/components/order-line-items-table";
import { OrderDetailActions } from "../features/order-detail/order-detail-actions";
import { OrderDetailSidebar } from "../features/order-detail/order-detail-sidebar";
import type { Order } from "@commerceos/shared/types";

export function OrderDetailScreen() {
  const { hasPermission } = useAuth();
  const { orderId } = useParams({ from: "/orders/$orderId" });
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["orders", orderId],
    queryFn: () => fetchOrder(orderId),
  });

  const mutation = useMutation({
    mutationFn: (payload: Partial<Order>) => updateOrder(orderId, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["orders"] });
      await queryClient.invalidateQueries({ queryKey: ["orders", orderId] });
      await queryClient.invalidateQueries({ queryKey: ["dashboard", "summary"] });
      await queryClient.invalidateQueries({ queryKey: ["analytics", "overview"] });
    },
  });

  if (isLoading || !data) {
    return <LoadingState label="Loading order..." />;
  }

  const canManageOrders = hasPermission("orders.manage");
  const canRefundOrders = hasPermission("orders.refund");

  return (
    <div className="space-y-6">
      <PageHeader
        title={data.orderNumber}
        description={`Placed on ${formatDate(data.date)} by ${data.customerName}.`}
        actions={
          <OrderDetailActions
            canManageOrders={canManageOrders}
            canRefundOrders={canRefundOrders}
            order={data}
            onAction={(payload) => void mutation.mutateAsync(payload)}
          />
        }
      />

      <div className="grid gap-6 xl:grid-cols-[2fr,1fr]">
        <SectionCard title="Line Items">
          <OrderLineItemsTable items={data.lineItems} />
        </SectionCard>

        <OrderDetailSidebar order={data} />
      </div>
    </div>
  );
}
