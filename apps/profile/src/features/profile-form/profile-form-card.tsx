import type { UseMutationResult } from "@tanstack/react-query";
import { SectionCard } from "@commerceos/shared/components/section-card";
import { Button } from "@commerceos/ui";
import { Input } from "@commerceos/ui";
import { Label } from "@commerceos/ui";
import { AvatarField } from "@commerceos/shared/components/avatar-field";
import type { AuthUser } from "@commerceos/shared/types";

import { ProfileScreen } from "../../screens/profile-screen";

console.log(ProfileScreen);

interface ProfileFormCardProps {
  form: AuthUser;
  mutation: UseMutationResult<unknown, Error, Partial<AuthUser>>;
  onFormChange: (form: AuthUser) => void;
}

export function ProfileFormCard({ form, mutation, onFormChange }: ProfileFormCardProps) {
  return (
    <SectionCard title="Your Profile" contentClassName="space-y-6">
      <AvatarField avatarUrl={form.avatarUrl} initials={form.initials} onChange={(avatarUrl) => onFormChange({ ...form, avatarUrl })} />

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" value={form.name} onChange={(event) => onFormChange({ ...form, name: event.target.value })} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input id="title" value={form.title} onChange={(event) => onFormChange({ ...form, title: event.target.value })} />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" value={form.email} onChange={(event) => onFormChange({ ...form, email: event.target.value })} />
        </div>
      </div>

      <div className="flex justify-end">
        <Button disabled={mutation.isPending} onClick={() => void mutation.mutateAsync(form)}>
          {mutation.isPending ? "Saving..." : "Save profile"}
        </Button>
      </div>
    </SectionCard>
  );
}
