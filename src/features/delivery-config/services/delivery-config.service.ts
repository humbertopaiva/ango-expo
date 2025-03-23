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

    const response = await api.get<DeliveryConfigResponse>(
      `/api/config/company?company=${companyId}`,
      {
        params: {
          _t: Date.now(), // Cache busting
        },
      }
    );

    // Verificar se a resposta da API está no formato esperado
    if (!response.data?.data?.delivery) {
      console.error("Formato de resposta inesperado:", response.data);
      throw new Error("Formato de resposta da API inválido");
    }

    return response.data.data.delivery;
  }

  async updateConfig(id: string, data: UpdateDeliveryConfigDTO) {
    const companyId = useAuthStore.getState().getCompanyId();
    if (!companyId) {
      throw new Error("ID da empresa não encontrado");
    }

    const response = await api.patch<DeliveryConfigResponse>(
      `/api/config/company/${id}`,
      {
        ...data,
        empresa: companyId,
      }
    );

    // Verificar se a resposta da API está no formato esperado
    if (!response.data?.data?.delivery) {
      console.error("Formato de resposta inesperado:", response.data);
      throw new Error("Formato de resposta da API inválido");
    }

    return response.data.data.delivery;
  }
}

export const deliveryConfigService = new DeliveryConfigService();
