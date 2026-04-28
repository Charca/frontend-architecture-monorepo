import { useEffect, useState } from "react";
import { Link, useParams } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchAccountUser, updateAccountUser } from "@commerceos/shared/api/accounts";
import { useAuth } from "@commerceos/shared/providers/use-auth";
import { LoadingState } from "@commerceos/shared/feedback/loading-state";
import { PageHeader } from "@commerceos/shared/components/page-header";
import { Button } from "@commerceos/ui";
import { UserDetailsCard } from "../features/user-detail/user-details-card";
import type { AccountMember } from "@commerceos/shared/types";

export function UserDetailScreen() {
  const { session, hasPermission } = useAuth();
  const { userId } = useParams({ from: "/users/$userId" });
  const queryClient = useQueryClient();
  const accountId = session?.activeAccount.id ?? "";
  const canManageUsers = hasPermission("settings.users.manage");

  const { data, isLoading } = useQuery({
    queryKey: ["accounts", accountId, "users", userId],
    queryFn: () => fetchAccountUser(accountId, userId),
    enabled: Boolean(accountId) && canManageUsers,
  });

  const [form, setForm] = useState<AccountMember | null>(null);

  useEffect(() => {
    if (data) setForm(data);
  }, [data]);

  const mutation = useMutation({
    mutationFn: (payload: Partial<AccountMember>) => updateAccountUser(accountId, userId, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["accounts", accountId, "users"] });
      await queryClient.invalidateQueries({ queryKey: ["accounts", accountId, "users", userId] });
      await queryClient.invalidateQueries({ queryKey: ["auth", "session"] });
    },
  });

  if (isLoading || !form) {
    return <LoadingState label="Loading user..." />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={form.name}
        description={`Edit account access and profile details for ${form.email}.`}
        actions={
          <Link to="/users">
            <Button variant="outline">Back to users</Button>
          </Link>
        }
      />

      <UserDetailsCard canManageUsers={canManageUsers} form={form} mutation={mutation} onFormChange={setForm} />
    </div>
  );
}
