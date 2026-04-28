import type { UseMutationResult } from "@tanstack/react-query";
import { SectionCard } from "@commerceos/shared/components/section-card";
import { Button } from "@commerceos/ui";
import { Input } from "@commerceos/ui";
import { Label } from "@commerceos/ui";
import { Select } from "@commerceos/ui";
import { formatCurrency, formatDate } from "@commerceos/shared/lib/utils";
import type { Customer } from "@commerceos/shared/types";

interface CustomerProfileCardProps {
  canEditCustomer: boolean;
  customer: Customer;
  form: Customer;
  mutation: UseMutationResult<unknown, Error, Partial<Customer>>;
  onFormChange: (form: Customer) => void;
}

export function CustomerProfileCard({ canEditCustomer, customer, form, mutation, onFormChange }: CustomerProfileCardProps) {
  return (
    <SectionCard title="Profile" contentClassName="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" disabled={!canEditCustomer} value={form.name} onChange={(event) => onFormChange({ ...form, name: event.target.value })} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          disabled={!canEditCustomer}
          value={form.email}
          onChange={(event) => onFormChange({ ...form, email: event.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="segment">Segment</Label>
        <Select
          id="segment"
          disabled={!canEditCustomer}
          value={form.segment}
          onChange={(event) => onFormChange({ ...form, segment: event.target.value as Customer["segment"] })}
        >
          <option value="VIP">VIP</option>
          <option value="Wholesale">Wholesale</option>
          <option value="At Risk">At Risk</option>
          <option value="New">New</option>
          <option value="Repeat">Repeat</option>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="tags">Tags</Label>
        <Input
          id="tags"
          disabled={!canEditCustomer}
          value={form.tags.join(", ")}
          onChange={(event) =>
            onFormChange({
              ...form,
              tags: event.target.value
                .split(",")
                .map((tag) => tag.trim())
                .filter(Boolean),
            })
          }
        />
      </div>
      <div className="rounded-md border px-3 py-2 text-sm">
        <div className="flex items-center justify-between gap-4">
          <span className="text-muted-foreground">Price list</span>
          <span>{customer.priceList?.name ?? "Retail default"}</span>
        </div>
        <div className="mt-2 flex items-center justify-between gap-4">
          <span className="text-muted-foreground">Lifetime spend</span>
          <span>{formatCurrency(customer.lifetimeSpend)}</span>
        </div>
        <div className="mt-2 flex items-center justify-between gap-4">
          <span className="text-muted-foreground">Joined</span>
          <span>{formatDate(customer.joinedAt)}</span>
        </div>
      </div>
      <div className="flex justify-end">
        <Button disabled={!canEditCustomer || mutation.isPending} onClick={() => void mutation.mutateAsync(form)}>
          {mutation.isPending ? "Saving..." : "Save customer"}
        </Button>
      </div>
    </SectionCard>
  );
}
