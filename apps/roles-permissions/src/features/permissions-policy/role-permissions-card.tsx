import { Button } from "@commerceos/ui";
import { Card, CardContent, CardHeader, CardTitle } from "@commerceos/ui";
import { Switch } from "@commerceos/ui";
import { PERMISSION_GROUPS, ROLE_LABELS } from "@commerceos/shared/lib/auth";
import type { AccountPermissionPolicy, RoleKey } from "@commerceos/shared/types";

interface RolePermissionsCardProps {
  canManagePermissions: boolean;
  isPending: boolean;
  permissionForm: AccountPermissionPolicy;
  role: Exclude<RoleKey, "account_owner">;
  onPermissionFormChange: (permissionForm: AccountPermissionPolicy) => void;
  onSave: (role: Exclude<RoleKey, "account_owner">) => void;
}

export function RolePermissionsCard({
  canManagePermissions,
  isPending,
  permissionForm,
  role,
  onPermissionFormChange,
  onSave,
}: RolePermissionsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{ROLE_LABELS[role]}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {PERMISSION_GROUPS.map((group) => (
          <div key={group.title} className="space-y-3">
            <div className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">{group.title}</div>
            <div className="grid gap-3 md:grid-cols-2">
              {group.items.map((permission) => {
                const checked = permissionForm[role].includes(permission.key);
                return (
                  <label key={permission.key} className="flex items-start justify-between gap-4 rounded-md border p-3">
                    <div>
                      <div className="font-medium">{permission.label}</div>
                      <div className="text-sm text-muted-foreground">{permission.description}</div>
                    </div>
                    <Switch
                      disabled={!canManagePermissions}
                      checked={checked}
                      onCheckedChange={(nextChecked) => {
                        const nextPermissions = nextChecked
                          ? [...permissionForm[role], permission.key]
                          : permissionForm[role].filter((entry) => entry !== permission.key);
                        onPermissionFormChange({
                          ...permissionForm,
                          [role]: nextPermissions,
                        });
                      }}
                    />
                  </label>
                );
              })}
            </div>
          </div>
        ))}

        <div className="flex justify-end">
          <Button disabled={!canManagePermissions || isPending} onClick={() => onSave(role)}>
            {isPending ? "Saving..." : `Save ${ROLE_LABELS[role]}`}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
