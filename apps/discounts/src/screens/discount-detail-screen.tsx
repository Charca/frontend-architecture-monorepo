import { useEffect, useState } from "react";
import { Link, useParams } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchDiscount, updateDiscount } from "@commerceos/shared/api/discounts";
import { useAuth } from "@commerceos/shared/providers/use-auth";
import { LoadingState } from "@commerceos/shared/feedback/loading-state";
import { ActivityHistoryCard } from "@commerceos/shared/components/activity-history-card";
import { PageHeader } from "@commerceos/shared/components/page-header";
import { Button } from "@commerceos/ui";
import { DiscountForm, type DiscountFormValues } from "../components/discount-form";
import type { Discount } from "@commerceos/shared/types";
import { normalizeDiscountValues, serializeDiscountValues } from "../utils/discounts";

export function DiscountDetailScreen() {
  const { hasPermission } = useAuth();
  const { discountId } = useParams({ from: "/discounts/$discountId" });
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["discounts", discountId],
    queryFn: () => fetchDiscount(discountId),
  });
  const [initialValues, setInitialValues] = useState<DiscountFormValues | undefined>(undefined);

  useEffect(() => {
    if (data) setInitialValues(normalizeDiscountValues(data));
  }, [data]);

  const mutation = useMutation({
    mutationFn: (payload: Partial<Discount>) => updateDiscount(discountId, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["discounts"] });
      await queryClient.invalidateQueries({ queryKey: ["discounts", discountId] });
      await queryClient.invalidateQueries({ queryKey: ["dashboard", "summary"] });
    },
  });

  if (isLoading || !initialValues) {
    return <LoadingState label="Loading discount..." />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={data?.code ?? "Discount"}
        description="Edit placeholder promotion details."
        actions={
          <Link to="/discounts">
            <Button variant="outline">Back to discounts</Button>
          </Link>
        }
      />
      <DiscountForm
        disabled={!hasPermission("discounts.manage")}
        submitLabel={mutation.isPending ? "Saving..." : "Save discount"}
        initialValues={initialValues}
        onSubmit={async (values) => {
          await mutation.mutateAsync(serializeDiscountValues(values));
        }}
      />
      <ActivityHistoryCard entries={data?.activityHistory} />
    </div>
  );
}
