import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { fetchDiscounts } from "@commerceos/shared/api/discounts";
import { useAuth } from "@commerceos/shared/providers/use-auth";
import { LoadingState } from "@commerceos/shared/feedback/loading-state";
import { PageHeader } from "@commerceos/shared/components/page-header";
import { Button } from "@commerceos/ui";
import { DiscountsTable } from "../features/discount-list/discounts-table";

export function DiscountsScreen() {
  const { hasPermission } = useAuth();
  const { data, isLoading } = useQuery({
    queryKey: ["discounts"],
    queryFn: fetchDiscounts,
  });

  if (isLoading || !data) {
    return <LoadingState label="Loading discounts..." />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Discounts"
        description="Manage promotional codes and scheduled offers."
        actions={
          hasPermission("discounts.manage") ? (
            <Link to="/discounts/new">
              <Button>Create discount</Button>
            </Link>
          ) : null
        }
      />
      <DiscountsTable discounts={data} />
    </div>
  );
}
