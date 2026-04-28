import { SectionCard } from "@commerceos/shared/components/section-card";
import { Label } from "@commerceos/ui";
import { Textarea } from "@commerceos/ui";
import type { Customer } from "@commerceos/shared/types";

interface CustomerNotesCardProps {
  canEditCustomer: boolean;
  form: Customer;
  onFormChange: (form: Customer) => void;
}

export function CustomerNotesCard({ canEditCustomer, form, onFormChange }: CustomerNotesCardProps) {
  return (
    <SectionCard title="Notes" contentClassName="space-y-2">
      <Label htmlFor="notes">Notes</Label>
      <Textarea id="notes" disabled={!canEditCustomer} value={form.notes} onChange={(event) => onFormChange({ ...form, notes: event.target.value })} />
    </SectionCard>
  );
}
