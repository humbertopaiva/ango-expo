// src/features/delivery-config/view-models/delivery-config.view-model.ts

import { useState, useRef } from "react";
import { useDeliveryConfig } from "../hooks/use-delivery-config";
import { IDeliveryConfigViewModel } from "./delivery-config.view-model.interface";
import { UpdateDeliveryConfigDTO } from "../models/delivery-config";
import { useToast } from "@gluestack-ui/themed"; // Importação direta do Gluestack
import { DeliveryConfigFormData } from "../schemas/delivery-config.schema";
import {
  showErrorToast,
  showSuccessToast,
} from "@/components/common/toast-helper";

export function useDeliveryConfigViewModel(): IDeliveryConfigViewModel {
  const { config, isLoading, updateConfig, isUpdating } = useDeliveryConfig();
  const toast = useToast(); // Usa o hook do Gluestack diretamente
  const [isSaved, setIsSaved] = useState(false);
  const formRef = useRef(null); // Referência para o formulário

  // Handle form submission
  const handleSubmit = async (data: DeliveryConfigFormData) => {
    try {
      if (!config?.id) {
        // Usa o toast simplificado
        showErrorToast(toast, "Configuração não encontrada");
        return;
      }

      // Prepara os dados para atualização
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

      // Mostra o toast de sucesso mas não navega para trás
      setIsSaved(true);

      // Usa o toast simplificado
      showSuccessToast(
        toast,
        "Configurações de entrega atualizadas com sucesso"
      );

      // Reset do estado após alguns segundos
      setTimeout(() => {
        setIsSaved(false);
      }, 3000);
    } catch (error) {
      console.error("Erro ao atualizar configuração:", error);

      // Usa o toast simplificado
      showErrorToast(
        toast,
        "Não foi possível atualizar as configurações de entrega"
      );
    }
  };

  return {
    // Estado
    config: config || null,
    isLoading,
    isUpdating,
    isSaved,
    formRef,

    // Handlers
    handleSubmit,
  };
}
