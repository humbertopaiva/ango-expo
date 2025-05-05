// Path: src/features/checkout/hooks/use-delivery-config.ts
import { useQuery } from "@tanstack/react-query";
import { api } from "@/src/services/api";
import { DeliveryConfig } from "../services/delivery-config.service";

const CACHE_TIME = 30 * 60 * 1000; // 30 minutos

export function useDeliveryConfig(companyId?: string, companySlug?: string) {
  const identifier = companyId || companySlug;

  return useQuery<DeliveryConfig | null>({
    queryKey: ["delivery-config", identifier],
    queryFn: async () => {
      if (!identifier) return null;

      try {
        // Usar slug ou id dependendo do que estiver disponível
        const param = companyId
          ? `companyId=${companyId}`
          : `slug=${companySlug}`;
        const response = await api.get(`/api/delivery/config?${param}`);

        if (response.data?.status === "success" && response.data?.data) {
          return response.data.data;
        }

        return null;
      } catch (error) {
        console.error("Erro ao buscar configuração de delivery:", error);
        return null;
      }
    },
    enabled: !!identifier,
    staleTime: CACHE_TIME,
  });
}
