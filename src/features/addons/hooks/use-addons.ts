// Path: src/features/addons/hooks/use-addons.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { addonsService } from "../services/addons.service";
import { CreateAddonsListDTO, UpdateAddonsListDTO } from "../models/addon";
import useAuthStore from "@/src/stores/auth";

export function useAddons() {
  const queryClient = useQueryClient();
  const getCompanyId = useAuthStore((state) => state.getCompanyId);
  const companyId = getCompanyId();

  const queryKey = ["addons-lists", companyId];

  const { data: addonsList = [], isLoading } = useQuery({
    queryKey,
    queryFn: addonsService.getAddonsList,
    enabled: !!companyId,
    staleTime: 1000 * 60 * 5, // 5 minutos de cache
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateAddonsListDTO) => {
      if (!companyId) throw new Error("ID da empresa não encontrado");

      // Certifique-se de adicionar o ID da empresa
      const enrichedData = {
        ...data,
        empresa: companyId,
      };

      return addonsService.createAddonsList(enrichedData);
    },
    onSuccess: () => {
      // Invalidar a lista de adicionais
      queryClient.invalidateQueries({ queryKey });
    },
    onError: (error: any) => {
      console.error("Erro ao criar lista de adicionais:", error);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateAddonsListDTO }) => {
      return addonsService.updateAddonsList(id, data);
    },
    onSuccess: () => {
      // Invalidar a lista de adicionais
      queryClient.invalidateQueries({ queryKey });
    },
    onError: (error: any) => {
      console.error("Erro ao atualizar lista de adicionais:", error);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => addonsService.deleteAddonsList(id),
    onSuccess: () => {
      // Invalidar a lista de adicionais
      queryClient.invalidateQueries({ queryKey });
    },
    onError: (error: any) => {
      console.error("Erro ao excluir lista de adicionais:", error);
    },
  });

  return {
    addonsList: Array.isArray(addonsList) ? addonsList : [],
    isLoading,
    createAddonsList: createMutation.mutate,
    updateAddonsList: updateMutation.mutate,
    deleteAddonsList: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}

// Hook for getting a specific addon list by ID
export function useAddonsListById(id: string | undefined) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["addons-list", id],
    queryFn: () => (id ? addonsService.getAddonsListById(id) : null),
    enabled: !!id,
  });

  const refetch = () => {
    const queryClient = useQueryClient();
    const queryKey = ["addons-lists"];
    queryClient
      .invalidateQueries({ queryKey })
      .then(() => {
        console.log("Lista de adicionais atualizada com sucesso!");
      })
      .catch((error) => {
        console.error("Erro ao atualizar lista de adicionais:", error);
      });
  };

  return {
    addonsList: data,
    isLoading,
    error,
    refetch,
  };
}
