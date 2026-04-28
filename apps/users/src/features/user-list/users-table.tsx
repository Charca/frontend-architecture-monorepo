import { Link } from "@tanstack/react-router";
import type { UseMutationResult } from "@tanstack/react-query";
import { SectionCard } from "@commerceos/shared/components/section-card";
import { StatusBadge } from "@commerceos/shared/components/status-badge";
import { Select } from "@commerceos/ui";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@commerceos/ui";
import { ROLE_LABELS } from "@commerceos/shared/lib/auth";
import type { AccountMember, RoleKey } from "@commerceos/shared/types";

interface UsersTableProps {
  accountMembers: AccountMember[];
  canManageUsers: boolean;
  mutation: UseMutationResult<unknown, Error, { userId: string; role: RoleKey }>;
}

export function UsersTable({ accountMembers, canManageUsers, mutation }: UsersTableProps) {
  return (
    <SectionCard title="Account Members">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Last Active</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {accountMembers.map((member) => (
            <TableRow key={member.userId}>
              <TableCell>
                <Link to="/users/$userId" params={{ userId: member.userId }} className="font-medium text-primary hover:underline">
                  {member.name}
                </Link>
                <div className="text-xs text-muted-foreground">{member.title}</div>
              </TableCell>
              <TableCell className="table-cell-muted">{member.email}</TableCell>
              <TableCell className="w-[180px]">
                <Select
                  disabled={!canManageUsers || member.role === "account_owner" || mutation.isPending}
                  value={member.role}
                  onChange={(event) => void mutation.mutateAsync({ userId: member.userId, role: event.target.value as RoleKey })}
                >
                  <option value="account_owner">{ROLE_LABELS.account_owner}</option>
                  <option value="admin">{ROLE_LABELS.admin}</option>
                  <option value="user">{ROLE_LABELS.user}</option>
                </Select>
              </TableCell>
              <TableCell>
                <StatusBadge status={member.status} />
              </TableCell>
              <TableCell className="table-cell-muted">{member.lastActiveAt}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </SectionCard>
  );
}
