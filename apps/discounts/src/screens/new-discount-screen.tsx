import { useNavigate } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createDiscount } from "@commerceos/shared/api/discounts";
import { useAuth } from "@commerceos/shared/providers/use-auth";
import { PageHeader } from "@commerceos/shared/components/page-header";
import { DiscountForm, type DiscountFormValues } from "../components/discount-form";
import { serializeDiscountValues } from "../utils/discounts";

export function NewDiscountScreen() {
  const { hasPermission } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (values: DiscountFormValues) => createDiscount(serializeDiscountValues(values)),
    onSuccess: async (created) => {
      await queryClient.invalidateQueries({ queryKey: ["discounts"] });
      await queryClient.invalidateQueries({ queryKey: ["dashboard", "summary"] });
      await navigate({ to: "/discounts/$discountId", params: { discountId: created.id } });
    },
  });

  return (
    <div className="space-y-6">
      <PageHeader title="New Discount" description="Create a mock discount offer for workshop flows." />
      <DiscountForm
        disabled={!hasPermission("discounts.manage")}
        submitLabel={mutation.isPending ? "Saving..." : "Create discount"}
        onSubmit={async (values) => {
          await mutation.mutateAsync(values);
        }}
      />
    </div>
  );
}
