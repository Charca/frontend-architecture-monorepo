import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchAccountPermissions, updateAccountPermissions } from "@commerceos/shared/api/accounts";
import { useAuth } from "@commerceos/shared/providers/use-auth";
import { LoadingState } from "@commerceos/shared/feedback/loading-state";
import { PageHeader } from "@commerceos/shared/components/page-header";
import { Button } from "@commerceos/ui";
import { Card, CardContent, CardHeader, CardTitle } from "@commerceos/ui";
import { RolePermissionsCard } from "../features/permissions-policy/role-permissions-card";
import type { AccountPermissionPolicy } from "@commerceos/shared/types";

export function RolesPermissionsScreen() {
  const { session, hasPermission } = useAuth();
  const queryClient = useQueryClient();
  const accountId = session?.activeAccount.id ?? "";
  const canManagePermissions = hasPermission("settings.permissions.manage");

  const { data, isLoading } = useQuery({
    queryKey: ["accounts", accountId, "permissions"],
    queryFn: () => fetchAccountPermissions(accountId),
    enabled: Boolean(accountId) && canManagePermissions,
  });

  const [permissionForm, setPermissionForm] = useState<AccountPermissionPolicy | null>(null);

  useEffect(() => {
    if (data) setPermissionForm(data);
  }, [data]);

  const mutation = useMutation({
    mutationFn: (payload: Partial<AccountPermissionPolicy>) => updateAccountPermissions(accountId, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["accounts", accountId, "permissions"] });
      await queryClient.invalidateQueries({ queryKey: ["auth", "session"] });
    },
  });

  if (isLoading || !permissionForm) {
    return <LoadingState label="Loading permissions..." />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Roles & Permissions"
        description={`Customize Admin and User role access for ${session?.activeAccount.name}.`}
        actions={
          <Link to="/users">
            <Button variant="outline">Back to users</Button>
          </Link>
        }
      />

      <Card>
        <CardHeader>
          <CardTitle>Account Owner</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Account Owners always keep full access and cannot be customized.
        </CardContent>
      </Card>

      <RolePermissionsCard
        canManagePermissions={canManagePermissions}
        isPending={mutation.isPending}
        permissionForm={permissionForm}
        role="admin"
        onPermissionFormChange={setPermissionForm}
        onSave={(role) => void mutation.mutateAsync({ [role]: permissionForm[role] })}
      />
      <RolePermissionsCard
        canManagePermissions={canManagePermissions}
        isPending={mutation.isPending}
        permissionForm={permissionForm}
        role="user"
        onPermissionFormChange={setPermissionForm}
        onSave={(role) => void mutation.mutateAsync({ [role]: permissionForm[role] })}
      />
    </div>
  );
}
