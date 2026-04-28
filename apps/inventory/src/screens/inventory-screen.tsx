import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchInventory, updateInventory } from "@commerceos/shared/api/inventory";
import { useAuth } from "@commerceos/shared/providers/use-auth";
import { LoadingState } from "@commerceos/shared/feedback/loading-state";
import { PageHeader } from "@commerceos/shared/components/page-header";
import { InventoryTable } from "../features/inventory-list/inventory-table";

export function InventoryScreen() {
  const { hasPermission } = useAuth();
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["inventory"],
    queryFn: fetchInventory,
  });
  const canEditInventory = hasPermission("inventory.edit");

  const mutation = useMutation({
    mutationFn: ({ itemId, stockQuantity }: { itemId: string; stockQuantity: number }) =>
      updateInventory(itemId, { stockQuantity }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["inventory"] });
      await queryClient.invalidateQueries({ queryKey: ["products"] });
      await queryClient.invalidateQueries({ queryKey: ["dashboard", "summary"] });
    },
  });

  if (isLoading || !data) {
    return <LoadingState label="Loading inventory..." />;
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Inventory" description="Track stock levels across warehouse locations and adjust counts." />
      <InventoryTable canEditInventory={canEditInventory} inventory={data} mutation={mutation} />
    </div>
  );
}
