// src/features/leaflets/hooks/use-leaflets.ts

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { leafletService } from "../services/leaflet.service";
import { CreateLeafletDTO, UpdateLeafletDTO } from "../models/leaflet";
import useAuthStore from "@/src/stores/auth";

export function useLeaflets() {
  const queryClient = useQueryClient();
  const getCompanyId = useAuthStore((state) => state.getCompanyId);
  const companyId = getCompanyId();

  const queryKey = ["leaflets", companyId];

  const { data: leaflets = [], isLoading } = useQuery({
    queryKey,
    queryFn: leafletService.getLeaflets,
    enabled: !!companyId,
  });

  // Use the array length directly for count
  const leafletCount = Array.isArray(leaflets) ? leaflets.length : 0;

  const createMutation = useMutation({
    mutationFn: async (data: Omit<CreateLeafletDTO, "empresa">) => {
      if (!companyId) throw new Error("ID da empresa não encontrado");

      // Check limit before creating
      if (leafletCount >= 5)
        throw new Error("Limite máximo de encartes atingido (5)");

      return leafletService.createLeaflet({
        ...data,
        empresa: companyId,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
    onError: (error: any) => {
      console.error("Erro ao criar encarte:", error);
      throw error; // Re-throw to be caught by the caller
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateLeafletDTO }) =>
      leafletService.updateLeaflet(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
    onError: (error: any) => {
      console.error("Erro ao atualizar encarte:", error);
      throw error; // Re-throw to be caught by the caller
    },
  });

  const deleteMutation = useMutation({
    mutationFn: leafletService.deleteLeaflet,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
    onError: (error: any) => {
      console.error("Erro ao excluir encarte:", error);
      throw error; // Re-throw to be caught by the caller
    },
  });

  return {
    leaflets: Array.isArray(leaflets) ? leaflets : [],
    isLoading,
    leafletCount,
    createLeaflet: createMutation.mutate,
    updateLeaflet: updateMutation.mutate,
    deleteLeaflet: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
