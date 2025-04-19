// Path: src/features/profile/hooks/use-profile.ts

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { profileService } from "../services/profile.service";
import { UpdateProfileDTO } from "../models/profile";

export function useProfile(companyId: string) {
  const queryClient = useQueryClient();

  // Chave de query consistente para o perfil
  const profileQueryKey = ["profile", companyId];

  const {
    data: profile,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: profileQueryKey,
    queryFn: () => profileService.getProfile(companyId),
    enabled: !!companyId,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateProfileDTO }) =>
      profileService.updateProfile(id, data),
    onSuccess: () => {
      // Corrigido: Invalidar a query do perfil após atualização bem-sucedida
      queryClient.invalidateQueries({ queryKey: profileQueryKey });

      // Opcionalmente, fazer um refetch explícito para garantir
      refetch();
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
    refetchProfile: refetch, // Expõe a função de refetch caso necessário
  };
}
