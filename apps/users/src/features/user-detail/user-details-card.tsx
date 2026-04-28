import type { UseMutationResult } from "@tanstack/react-query";
import { SectionCard } from "@commerceos/shared/components/section-card";
import { Button } from "@commerceos/ui";
import { Input } from "@commerceos/ui";
import { Label } from "@commerceos/ui";
import { Select } from "@commerceos/ui";
import { ROLE_LABELS } from "@commerceos/shared/lib/auth";
import { AvatarField } from "@commerceos/shared/components/avatar-field";
import type { AccountMember, RoleKey } from "@commerceos/shared/types";

interface UserDetailsCardProps {
  canManageUsers: boolean;
  form: AccountMember;
  mutation: UseMutationResult<unknown, Error, Partial<AccountMember>>;
  onFormChange: (form: AccountMember) => void;
}

export function UserDetailsCard({ canManageUsers, form, mutation, onFormChange }: UserDetailsCardProps) {
  return (
    <SectionCard title="User Details" contentClassName="space-y-6">
      <AvatarField
        avatarUrl={form.avatarUrl}
        initials={form.initials}
        disabled={!canManageUsers}
        onChange={(avatarUrl) => onFormChange({ ...form, avatarUrl })}
      />

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" disabled={!canManageUsers} value={form.name} onChange={(event) => onFormChange({ ...form, name: event.target.value })} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input id="title" disabled={!canManageUsers} value={form.title} onChange={(event) => onFormChange({ ...form, title: event.target.value })} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" disabled={!canManageUsers} value={form.email} onChange={(event) => onFormChange({ ...form, email: event.target.value })} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="role">Role</Label>
          <Select
            id="role"
            disabled={!canManageUsers || form.role === "account_owner"}
            value={form.role}
            onChange={(event) => onFormChange({ ...form, role: event.target.value as RoleKey })}
          >
            <option value="account_owner">{ROLE_LABELS.account_owner}</option>
            <option value="admin">{ROLE_LABELS.admin}</option>
            <option value="user">{ROLE_LABELS.user}</option>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select
            id="status"
            disabled={!canManageUsers}
            value={form.status}
            onChange={(event) => onFormChange({ ...form, status: event.target.value as AccountMember["status"] })}
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastActiveAt">Last active</Label>
          <Input id="lastActiveAt" disabled value={form.lastActiveAt} />
        </div>
      </div>

      <div className="flex justify-end">
        <Button disabled={!canManageUsers || mutation.isPending} onClick={() => void mutation.mutateAsync(form)}>
          {mutation.isPending ? "Saving..." : "Save user"}
        </Button>
      </div>
    </SectionCard>
  );
}
