// Path: src/features/delivery-config/hooks/use-delivery-config.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { deliveryConfigService } from "../services/delivery-config.service";
import { UpdateDeliveryConfigDTO } from "../models/delivery-config";
import useAuthStore from "@/src/stores/auth";

export function useDeliveryConfig() {
  const queryClient = useQueryClient();
  const getCompanyId = useAuthStore((state) => state.getCompanyId);
  const companyId = getCompanyId();

  const queryKey = ["delivery-config", companyId];

  const { data: config, isLoading } = useQuery({
    queryKey,
    queryFn: deliveryConfigService.getCompanyConfig,
    enabled: !!companyId,
    retry: 1,
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: UpdateDeliveryConfigDTO;
    }) => {
      // Log de debug para verificar os dados
      console.log("Mutation - enviando dados para o servidor:", data);
      return deliveryConfigService.updateConfig(id, data);
    },
    onSuccess: (data) => {
      console.log("Mutation - atualização bem-sucedida:", data);
      // Invalida a query para recarregar os dados
      queryClient.invalidateQueries({ queryKey });
    },
    onError: (error: any) => {
      console.error("Erro ao atualizar configurações:", error);
    },
  });

  return {
    config,
    isLoading,
    updateConfig: updateMutation.mutate,
    isUpdating: updateMutation.isPending,
  };
}
