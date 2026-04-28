import type { UseMutationResult } from "@tanstack/react-query";
import { SectionCard } from "@commerceos/shared/components/section-card";
import { ToggleSettingRow } from "@commerceos/shared/components/toggle-setting-row";
import { Button } from "@commerceos/ui";
import type { SettingsData } from "@commerceos/shared/types";

interface NotificationSettingsCardProps {
  canManageNotifications: boolean;
  mutation: UseMutationResult<unknown, Error, Partial<SettingsData>>;
  settings: SettingsData;
  onSettingsChange: (settings: SettingsData) => void;
}

export function NotificationSettingsCard({
  canManageNotifications,
  mutation,
  settings,
  onSettingsChange,
}: NotificationSettingsCardProps) {
  return (
    <SectionCard id="notifications" title="Notifications" contentClassName="space-y-4">
      <ToggleSettingRow
        title="Low stock"
        description="Alert merchants when inventory dips below thresholds."
        disabled={!canManageNotifications}
        checked={settings.notifications.lowStock}
        onCheckedChange={(checked) =>
          onSettingsChange({ ...settings, notifications: { ...settings.notifications, lowStock: checked } })
        }
      />
      <ToggleSettingRow
        title="Order alerts"
        description="Send updates for new and delayed orders."
        disabled={!canManageNotifications}
        checked={settings.notifications.orderAlerts}
        onCheckedChange={(checked) =>
          onSettingsChange({ ...settings, notifications: { ...settings.notifications, orderAlerts: checked } })
        }
      />
      <ToggleSettingRow
        title="Weekly digest"
        description="Send one summary report each week."
        disabled={!canManageNotifications}
        checked={settings.notifications.weeklyDigest}
        onCheckedChange={(checked) =>
          onSettingsChange({ ...settings, notifications: { ...settings.notifications, weeklyDigest: checked } })
        }
      />
      <div className="flex justify-end">
        <Button
          disabled={!canManageNotifications || mutation.isPending}
          onClick={() => void mutation.mutateAsync({ notifications: settings.notifications })}
        >
          {mutation.isPending ? "Saving..." : "Save notifications"}
        </Button>
      </div>
    </SectionCard>
  );
}
