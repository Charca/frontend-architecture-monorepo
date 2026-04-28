import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchProfile, updateProfile } from "@commerceos/shared/api/users";
import { LoadingState } from "@commerceos/shared/feedback/loading-state";
import { PageHeader } from "@commerceos/shared/components/page-header";
import { ProfileFormCard } from "../features/profile-form/profile-form-card";
import type { AuthUser } from "@commerceos/shared/types";

export function ProfileScreen() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["me"],
    queryFn: fetchProfile,
  });
  const [form, setForm] = useState<AuthUser | null>(null);

  useEffect(() => {
    if (data) setForm(data);
  }, [data]);

  const mutation = useMutation({
    mutationFn: (payload: Partial<AuthUser>) => updateProfile(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["me"] });
      await queryClient.invalidateQueries({ queryKey: ["auth", "session"] });
      await queryClient.invalidateQueries({ queryKey: ["accounts"] });
    },
  });

  if (isLoading || !form) {
    return <LoadingState label="Loading profile..." />;
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Profile" description="Customize your own account details and avatar." />
      <ProfileFormCard form={form} mutation={mutation} onFormChange={setForm} />
    </div>
  );
}
