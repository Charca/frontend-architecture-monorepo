import { useQuery } from "@tanstack/react-query";
import { fetchCustomers } from "@commerceos/shared/api/customers";
import { LoadingState } from "@commerceos/shared/feedback/loading-state";
import { PageHeader } from "@commerceos/shared/components/page-header";
import { CustomersTable } from "../features/customer-list/customers-table";

export function CustomersScreen() {
  const { data, isLoading } = useQuery({
    queryKey: ["customers"],
    queryFn: fetchCustomers,
  });

  if (isLoading) {
    return <LoadingState label="Loading customers..." />;
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Customers" description="Browse customer records, spend, and order activity." />
      <CustomersTable customers={data ?? []} />
    </div>
  );
}
