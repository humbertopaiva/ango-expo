import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { profileService } from "../services/profile.service";
import { UpdateProfileDTO } from "../models/profile";

export function useProfile(companyId: string) {
  const queryClient = useQueryClient();

  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile", companyId],
    queryFn: () => profileService.getProfile(companyId),
    enabled: !!companyId,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateProfileDTO }) =>
      profileService.updateProfile(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile", companyId] });
    },
    onError: (error) => {
      console.error("Error updating profile:", error);
    },
  });

  return {
    profile,
    isLoading,
    updateProfile: updateMutation.mutate,
    isUpdating: updateMutation.isPending,
  };
}
