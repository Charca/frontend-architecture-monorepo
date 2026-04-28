import { useEffect, useState } from "react";
import { Link, useParams } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchCustomer, updateCustomer } from "@commerceos/shared/api/customers";
import { useAuth } from "@commerceos/shared/providers/use-auth";
import { LoadingState } from "@commerceos/shared/feedback/loading-state";
import { PageHeader } from "@commerceos/shared/components/page-header";
import { Button } from "@commerceos/ui";
import { CustomerOrderHistory } from "../features/order-history/customer-order-history";
import { CustomerNotesCard } from "../features/profile/customer-notes-card";
import { CustomerProfileCard } from "../features/profile/customer-profile-card";
import type { Customer } from "@commerceos/shared/types";

export function CustomerDetailScreen() {
  const { customerId } = useParams({ from: "/customers/$customerId" });
  const { hasPermission } = useAuth();
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["customers", customerId],
    queryFn: () => fetchCustomer(customerId),
  });
  const [form, setForm] = useState<Customer | null>(null);
  const canEditCustomer = hasPermission("customers.view");

  useEffect(() => {
    if (data) {
      setForm({
        id: data.id,
        name: data.name,
        email: data.email,
        segment: data.segment,
        tags: data.tags,
        priceListId: data.priceListId ?? null,
        lifetimeSpend: data.lifetimeSpend,
        notes: data.notes,
        joinedAt: data.joinedAt,
      });
    }
  }, [data]);

  const mutation = useMutation({
    mutationFn: (payload: Partial<Customer>) => updateCustomer(customerId, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["customers"] });
      await queryClient.invalidateQueries({ queryKey: ["customers", customerId] });
    },
  });

  if (isLoading || !data || !form) {
    return <LoadingState label="Loading customer..." />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={form.name}
        description={form.email}
        actions={
          <Link to="/customers">
            <Button variant="outline">Back to customers</Button>
          </Link>
        }
      />
      <div className="grid gap-6 xl:grid-cols-[1.3fr,1fr]">
        <CustomerOrderHistory orders={data.orderHistory} />
        <div className="space-y-6">
          <CustomerProfileCard canEditCustomer={canEditCustomer} customer={data} form={form} mutation={mutation} onFormChange={setForm} />
          <CustomerNotesCard canEditCustomer={canEditCustomer} form={form} onFormChange={setForm} />
        </div>
      </div>
    </div>
  );
}
