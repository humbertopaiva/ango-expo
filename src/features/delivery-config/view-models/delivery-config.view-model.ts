// src/features/delivery-config/view-models/delivery-config.view-model.ts
import { useDeliveryConfig } from "../hooks/use-delivery-config";
import { IDeliveryConfigViewModel } from "./delivery-config.view-model.interface";
import { UpdateDeliveryConfigDTO } from "../models/delivery-config";
import { router } from "expo-router";

export function useDeliveryConfigViewModel(): IDeliveryConfigViewModel {
  const { config, isLoading, updateConfig, isUpdating } = useDeliveryConfig();

  // Handle form submission
  const handleSubmit = async (data: UpdateDeliveryConfigDTO) => {
    try {
      if (!config?.id) {
        console.error("Configuração não encontrada");
        return;
      }

      // Preparar dados para atualização
      const updateData: UpdateDeliveryConfigDTO = {
        tempo_estimado_entrega: data.tempo_estimado_entrega,
        especificar_bairros_atendidos: data.especificar_bairros_atendidos,
        bairros_atendidos: data.bairros_atendidos || [],
        observacoes: data.observacoes || "",
        taxa_entrega: data.taxa_entrega,
        pedido_minimo: data.pedido_minimo,
      };

      await updateConfig({
        id: config.id,
        data: updateData,
      });

      // Navegar de volta após sucesso
      router.back();
    } catch (error) {
      console.error("Erro ao atualizar configuração:", error);
    }
  };

  return {
    // Estado
    config: config || null,
    isLoading,
    isUpdating,

    // Handlers
    handleSubmit,
  };
}
