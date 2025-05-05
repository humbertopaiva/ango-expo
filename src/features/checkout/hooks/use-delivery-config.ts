// Path: src/features/checkout/hooks/use-delivery-config.ts

import { useQuery } from "@tanstack/react-query";
import { api } from "@/src/services/api";
import { DeliveryConfig } from "../services/delivery-config.service";

const CACHE_TIME = 30 * 60 * 1000; // 30 minutos

export function useDeliveryConfig(companyId?: string, companySlug?: string) {
  // O erro provavelmente está ocorrendo aqui - a API está esperando um parâmetro específico
  // mas estamos enviando um que não é válido ou está no formato errado

  return useQuery<DeliveryConfig | null>({
    queryKey: ["delivery-config", companyId || companySlug],
    queryFn: async () => {
      // Se não temos nem ID nem slug, não fazemos a requisição
      if (!companyId && !companySlug) return null;

      try {
        // PROBLEMA: A forma como estamos construindo a URL pode estar incorreta
        // Vamos corrigir para garantir que usamos o parâmetro correto e construímos a URL adequadamente

        let url = "/api/delivery/config";

        // Verificar qual parâmetro está disponível e usar o correto
        if (companyId) {
          url += `?company=${encodeURIComponent(companyId)}`;
        } else if (companySlug) {
          url += `?slug=${encodeURIComponent(companySlug)}`;
        }

        console.log("Fazendo requisição para:", url); // Log para debug

        const response = await api.get(url);

        if (response.data?.status === "success" && response.data?.data) {
          return response.data.data;
        }

        return null;
      } catch (error) {
        console.error("Erro ao buscar configuração de delivery:", error);
        // Não propagar o erro para cima, retornar null
        return null;
      }
    },
    // Só habilitar a query se tivermos um identificador
    enabled: !!(companyId || companySlug),
    staleTime: CACHE_TIME,
    // Não tentar novamente automaticamente em caso de erro
    retry: false,
  });
}
