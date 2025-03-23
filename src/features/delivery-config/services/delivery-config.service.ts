// Path: src/features/delivery-config/services/delivery-config.service.ts
import { api } from "@/src/services/api";
import useAuthStore from "@/src/stores/auth";
import {
  DeliveryConfigResponse,
  UpdateDeliveryConfigDTO,
} from "../models/delivery-config";

class DeliveryConfigService {
  async getCompanyConfig() {
    const companyId = useAuthStore.getState().getCompanyId();
    if (!companyId) {
      throw new Error("ID da empresa não encontrado");
    }

    // Log para debug
    console.log("Buscando configurações para empresa:", companyId);

    try {
      const response = await api.get<DeliveryConfigResponse>(
        `/api/config/company?company=${companyId}`,
        {
          params: {
            _t: Date.now(), // Cache busting
          },
        }
      );

      console.log("Resposta da API getCompanyConfig:", response.data);

      // Verificar se a resposta da API está no formato esperado
      if (!response.data?.data?.delivery) {
        console.error("Formato de resposta inesperado:", response.data);
        throw new Error("Formato de resposta da API inválido");
      }

      return response.data.data.delivery;
    } catch (error) {
      console.error("Erro ao buscar configurações:", error);
      throw error;
    }
  }

  async updateConfig(id: string, data: UpdateDeliveryConfigDTO) {
    const companyId = useAuthStore.getState().getCompanyId();
    if (!companyId) {
      throw new Error("ID da empresa não encontrado");
    }

    // Log para debug
    console.log("Atualizando configuração:", id);
    console.log("Dados para atualização:", data);

    try {
      // Garantir que todos os campos booleanos são enviados como boolean, não string
      const sanitizedData = {
        ...data,
        mostrar_info_delivery: Boolean(data.mostrar_info_delivery),
        habilitar_carrinho: Boolean(data.habilitar_carrinho),
        especificar_bairros_atendidos: Boolean(
          data.especificar_bairros_atendidos
        ),
        empresa: companyId,
      };

      console.log("Dados sanitizados para envio:", sanitizedData);

      const response = await api.patch<DeliveryConfigResponse>(
        `/api/config/company/${id}`,
        sanitizedData
      );

      console.log("Resposta da API updateConfig:", response.data);

      // Verificar se a resposta da API está no formato esperado
      if (!response.data?.data?.delivery) {
        console.error("Formato de resposta inesperado:", response.data);
        throw new Error("Formato de resposta da API inválido");
      }

      return response.data.data.delivery;
    } catch (error) {
      console.error("Erro ao atualizar configuração:", error);
      throw error;
    }
  }
}

export const deliveryConfigService = new DeliveryConfigService();
