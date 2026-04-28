import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchAccount, fetchAccountSettings, updateAccount, updateAccountSettings } from "@commerceos/shared/api/accounts";
import { useAuth } from "@commerceos/shared/providers/use-auth";
import { LoadingState } from "@commerceos/shared/feedback/loading-state";
import { PageHeader } from "@commerceos/shared/components/page-header";
import { AccountProfileCard } from "../features/account-profile/account-profile-card";
import { NotificationSettingsCard } from "../features/notifications/notification-settings-card";
import { ShippingSettingsCard } from "../features/shipping/shipping-settings-card";
import { TaxSettingsCard } from "../features/taxes/tax-settings-card";
import type { Account, SettingsData } from "@commerceos/shared/types";

export function SettingsScreen() {
  const { session, hasPermission } = useAuth();
  const queryClient = useQueryClient();
  const accountId = session?.activeAccount.id ?? "";

  const accountQuery = useQuery({
    queryKey: ["accounts", accountId],
    queryFn: () => fetchAccount(accountId),
    enabled: Boolean(accountId),
  });
  const settingsQuery = useQuery({
    queryKey: ["accounts", accountId, "settings"],
    queryFn: () => fetchAccountSettings(accountId),
    enabled: Boolean(accountId),
  });
  const [accountForm, setAccountForm] = useState<Account | null>(null);
  const [settingsForm, setSettingsForm] = useState<SettingsData | null>(null);

  useEffect(() => {
    if (accountQuery.data) setAccountForm(accountQuery.data);
  }, [accountQuery.data]);

  useEffect(() => {
    if (settingsQuery.data) setSettingsForm(settingsQuery.data);
  }, [settingsQuery.data]);

  const accountMutation = useMutation({
    mutationFn: (payload: Partial<Account>) => updateAccount(accountId, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["accounts", accountId] });
      await queryClient.invalidateQueries({ queryKey: ["auth", "session"] });
    },
  });
  const settingsMutation = useMutation({
    mutationFn: (payload: Partial<SettingsData>) => updateAccountSettings(accountId, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["accounts", accountId, "settings"] });
    },
  });

  const canManageProfile = hasPermission("settings.account_profile.manage");
  const canManageShipping = hasPermission("settings.shipping.manage");
  const canManageTaxes = hasPermission("settings.tax.manage");
  const canManageNotifications = hasPermission("settings.notifications.manage");

  if (!accountForm || !settingsForm || accountQuery.isLoading || settingsQuery.isLoading) {
    return <LoadingState label="Loading settings..." />;
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Settings" description={`Operational settings for ${accountForm.name}.`} />

      <div className="grid gap-6 xl:grid-cols-2">
        <AccountProfileCard
          account={accountForm}
          canManageProfile={canManageProfile}
          mutation={accountMutation}
          onAccountChange={setAccountForm}
        />
        <ShippingSettingsCard
          canManageShipping={canManageShipping}
          mutation={settingsMutation}
          settings={settingsForm}
          onSettingsChange={setSettingsForm}
        />
        <TaxSettingsCard
          canManageTaxes={canManageTaxes}
          mutation={settingsMutation}
          settings={settingsForm}
          onSettingsChange={setSettingsForm}
        />
        <NotificationSettingsCard
          canManageNotifications={canManageNotifications}
          mutation={settingsMutation}
          settings={settingsForm}
          onSettingsChange={setSettingsForm}
        />
      </div>
    </div>
  );
}
