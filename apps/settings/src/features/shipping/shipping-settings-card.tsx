import type { UseMutationResult } from "@tanstack/react-query";
import { SectionCard } from "@commerceos/shared/components/section-card";
import { Button } from "@commerceos/ui";
import { Input } from "@commerceos/ui";
import { Label } from "@commerceos/ui";
import type { SettingsData } from "@commerceos/shared/types";

interface ShippingSettingsCardProps {
  canManageShipping: boolean;
  mutation: UseMutationResult<unknown, Error, Partial<SettingsData>>;
  settings: SettingsData;
  onSettingsChange: (settings: SettingsData) => void;
}

export function ShippingSettingsCard({ canManageShipping, mutation, settings, onSettingsChange }: ShippingSettingsCardProps) {
  return (
    <SectionCard id="shipping" title="Shipping" contentClassName="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="carrier">Default carrier</Label>
        <Input
          id="carrier"
          disabled={!canManageShipping}
          value={settings.shipping.defaultCarrier}
          onChange={(event) => onSettingsChange({ ...settings, shipping: { ...settings.shipping, defaultCarrier: event.target.value } })}
        />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="standardRate">Standard rate</Label>
          <Input
            id="standardRate"
            type="number"
            disabled={!canManageShipping}
            value={settings.shipping.standardRate}
            onChange={(event) =>
              onSettingsChange({ ...settings, shipping: { ...settings.shipping, standardRate: Number(event.target.value) } })
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="expressRate">Express rate</Label>
          <Input
            id="expressRate"
            type="number"
            disabled={!canManageShipping}
            value={settings.shipping.expressRate}
            onChange={(event) =>
              onSettingsChange({ ...settings, shipping: { ...settings.shipping, expressRate: Number(event.target.value) } })
            }
          />
        </div>
      </div>
      <div className="flex justify-end">
        <Button disabled={!canManageShipping || mutation.isPending} onClick={() => void mutation.mutateAsync({ shipping: settings.shipping })}>
          {mutation.isPending ? "Saving..." : "Save shipping"}
        </Button>
      </div>
    </SectionCard>
  );
}
