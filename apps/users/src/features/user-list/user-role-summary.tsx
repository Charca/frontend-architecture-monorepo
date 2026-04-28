import { StatCard } from "@commerceos/shared/components/stat-card";

interface UserRoleSummaryProps {
  accountOwners: number;
  admins: number;
  users: number;
}

export function UserRoleSummary({ accountOwners, admins, users }: UserRoleSummaryProps) {
  return (
    <div className="grid gap-3 md:grid-cols-3">
      <StatCard title="Account Owners" value={String(accountOwners)} detail="Members with full access" />
      <StatCard title="Admins" value={String(admins)} detail="Operational managers" />
      <StatCard title="Users" value={String(users)} detail="Standard workspace access" />
    </div>
  );
}
