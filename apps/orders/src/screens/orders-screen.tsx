import { useQuery } from "@tanstack/react-query";
import { fetchOrders } from "@commerceos/shared/api/orders";
import { LoadingState } from "@commerceos/shared/feedback/loading-state";
import { PageHeader } from "@commerceos/shared/components/page-header";
import { OrdersTable } from "../features/order-list/orders-table";

export function OrdersScreen() {
  const { data, isLoading } = useQuery({
    queryKey: ["orders"],
    queryFn: fetchOrders,
  });

  if (isLoading) {
    return <LoadingState label="Loading orders..." />;
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Orders" description="Review order flow, fulfillment status, and customer purchases." />
      <OrdersTable orders={data ?? []} />
    </div>
  );
}
