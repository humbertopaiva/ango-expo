// src/features/delivery-config/hooks/use-delivery-config.ts
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
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateDeliveryConfigDTO }) =>
      deliveryConfigService.updateConfig(id, data),
    onSuccess: () => {
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
