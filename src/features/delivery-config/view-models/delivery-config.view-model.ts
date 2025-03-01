// Path: src/features/delivery-config/view-models/delivery-config.view-model.ts

import { useState, useRef } from "react";
import { useDeliveryConfig } from "../hooks/use-delivery-config";
import { IDeliveryConfigViewModel } from "./delivery-config.view-model.interface";
import { UpdateDeliveryConfigDTO } from "../models/delivery-config";
import { useToast } from "@/src/hooks/use-toast";
import { DeliveryConfigFormData } from "../schemas/delivery-config.schema";

export function useDeliveryConfigViewModel(): IDeliveryConfigViewModel {
  const { config, isLoading, updateConfig, isUpdating } = useDeliveryConfig();
  const toast = useToast();
  const [isSaved, setIsSaved] = useState(false);
  const formRef = useRef(null); // Referência para o formulário

  // Handle form submission
  const handleSubmit = async (data: DeliveryConfigFormData) => {
    try {
      if (!config?.id) {
        toast.show({
          title: "Erro",
          description: "Configuração não encontrada",
          type: "error",
        });
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
      toast.show({
        title: "Sucesso",
        description: "Configurações de entrega atualizadas com sucesso",
        type: "success",
      });

      // Reset do estado após alguns segundos
      setTimeout(() => {
        setIsSaved(false);
      }, 3000);
    } catch (error) {
      console.error("Erro ao atualizar configuração:", error);
      toast.show({
        title: "Erro",
        description: "Não foi possível atualizar as configurações de entrega",
        type: "error",
      });
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
