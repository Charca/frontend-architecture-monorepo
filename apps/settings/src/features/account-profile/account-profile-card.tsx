import type { UseMutationResult } from "@tanstack/react-query";
import { SectionCard } from "@commerceos/shared/components/section-card";
import { Button } from "@commerceos/ui";
import { Input } from "@commerceos/ui";
import { Label } from "@commerceos/ui";
import type { Account } from "@commerceos/shared/types";

interface AccountProfileCardProps {
  account: Account;
  canManageProfile: boolean;
  mutation: UseMutationResult<unknown, Error, Partial<Account>>;
  onAccountChange: (account: Account) => void;
}

export function AccountProfileCard({ account, canManageProfile, mutation, onAccountChange }: AccountProfileCardProps) {
  return (
    <SectionCard id="store-profile" title="Account Profile" contentClassName="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="storeName">Store name</Label>
        <Input
          id="storeName"
          disabled={!canManageProfile}
          value={account.profile.storeName}
          onChange={(event) => onAccountChange({ ...account, profile: { ...account.profile, storeName: event.target.value } })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="supportEmail">Support email</Label>
        <Input
          id="supportEmail"
          disabled={!canManageProfile}
          value={account.profile.supportEmail}
          onChange={(event) => onAccountChange({ ...account, profile: { ...account.profile, supportEmail: event.target.value } })}
        />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="currency">Currency</Label>
          <Input
            id="currency"
            disabled={!canManageProfile}
            value={account.profile.currency}
            onChange={(event) => onAccountChange({ ...account, profile: { ...account.profile, currency: event.target.value } })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="timezone">Timezone</Label>
          <Input
            id="timezone"
            disabled={!canManageProfile}
            value={account.profile.timezone}
            onChange={(event) => onAccountChange({ ...account, profile: { ...account.profile, timezone: event.target.value } })}
          />
        </div>
      </div>
      <div className="flex justify-end">
        <Button disabled={!canManageProfile || mutation.isPending} onClick={() => void mutation.mutateAsync({ profile: account.profile })}>
          {mutation.isPending ? "Saving..." : "Save profile"}
        </Button>
      </div>
    </SectionCard>
  );
}
