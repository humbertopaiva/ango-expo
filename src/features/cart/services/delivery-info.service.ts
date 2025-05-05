// Path: src/features/cart/services/delivery-info.service.ts

import { CompanyConfig } from "@/src/features/company-page/models/company-config";
import {
  DeliveryConfig,
  DeliveryConfigService,
} from "@/src/features/checkout/services/delivery-config.service";

export class DeliveryInfoService {
  /**
   * Obtém o valor da taxa de entrega com base na configuração da empresa
   * @param config Configuração da empresa ou config de delivery
   * @returns Valor da taxa de entrega
   */
  static getDeliveryFee(config: CompanyConfig | DeliveryConfig | null): number {
    // Se for a nova estrutura DeliveryConfig
    if (config && "taxa_entrega" in config) {
      return DeliveryConfigService.getDeliveryFee(config as DeliveryConfig);
    }

    // Compatibilidade com formato antigo
    if (!config || !config.delivery || !config.delivery.taxa_entrega) {
      return 0;
    }

    // A taxa de entrega é armazenada como string, então convertemos para número
    const taxaEntrega = config.delivery.taxa_entrega;

    // Analisar a string e converter para número
    try {
      return parseFloat(taxaEntrega) || 0;
    } catch (error) {
      console.error("Erro ao converter taxa de entrega:", error);
      return 0;
    }
  }

  /**
   * Verifica se uma empresa possui entrega disponível
   * @param config Configuração da empresa ou config de delivery
   * @returns True se a empresa oferece entrega
   */
  static hasDelivery(config: CompanyConfig | DeliveryConfig | null): boolean {
    // Se for a nova estrutura DeliveryConfig
    if (config && "mostrar_info_delivery" in config) {
      return DeliveryConfigService.isDeliveryEnabled(config as DeliveryConfig);
    }

    // Compatibilidade com formato antigo
    return !!(
      config &&
      config.delivery &&
      (config.delivery.mostrar_info_delivery === true ||
        config.delivery.mostrar_info_delivery === null)
    );
  }

  /**
   * Verifica se o valor mínimo para entrega foi atingido
   * @param subtotal Valor do subtotal do pedido
   * @param config Configuração da empresa ou config de delivery
   * @returns True se o valor mínimo foi atingido
   */
  static hasReachedMinimumOrderValue(
    subtotal: number,
    config: CompanyConfig | DeliveryConfig | null
  ): boolean {
    // Se for a nova estrutura DeliveryConfig
    if (config && "pedido_minimo" in config) {
      const minValue = DeliveryConfigService.getMinimumOrderValue(
        config as DeliveryConfig
      );
      return subtotal >= minValue;
    }

    // Compatibilidade com formato antigo
    if (!config || !config.delivery || !config.delivery.pedido_minimo) {
      return true; // Se não há valor mínimo configurado, considera atingido
    }

    const pedidoMinimo = parseFloat(config.delivery.pedido_minimo);
    return subtotal >= pedidoMinimo;
  }

  /**
   * Obtém o valor mínimo de pedido para entrega
   * @param config Configuração da empresa ou config de delivery
   * @returns Valor mínimo do pedido
   */
  static getMinimumOrderValue(
    config: CompanyConfig | DeliveryConfig | null
  ): number {
    // Se for a nova estrutura DeliveryConfig
    if (config && "pedido_minimo" in config) {
      return DeliveryConfigService.getMinimumOrderValue(
        config as DeliveryConfig
      );
    }

    // Compatibilidade com formato antigo
    if (!config || !config.delivery || !config.delivery.pedido_minimo) {
      return 0;
    }

    return parseFloat(config.delivery.pedido_minimo);
  }

  /**
   * Verifica se a empresa especifica bairros atendidos
   * @param config Configuração da empresa ou config de delivery
   * @returns True se a empresa especifica bairros
   */
  static hasSpecificNeighborhoods(
    config: CompanyConfig | DeliveryConfig | null
  ): boolean {
    // Se for a nova estrutura DeliveryConfig
    if (config && "especificar_bairros_atendidos" in config) {
      return DeliveryConfigService.hasSpecificNeighborhoods(
        config as DeliveryConfig
      );
    }

    // Compatibilidade com formato antigo
    return !!(
      config &&
      config.delivery &&
      config.delivery.especificar_bairros_atendidos === true
    );
  }

  /**
   * Obtém a lista de bairros atendidos
   * @param config Configuração da empresa ou config de delivery
   * @returns Lista de bairros atendidos
   */
  static getNeighborhoodsList(
    config: CompanyConfig | DeliveryConfig | null
  ): string[] {
    // Se for a nova estrutura DeliveryConfig
    if (config && "bairros_atendidos" in config) {
      return DeliveryConfigService.getNeighborhoodsList(
        config as DeliveryConfig
      );
    }

    // Compatibilidade com formato antigo
    if (!config || !config.delivery || !config.delivery.bairros_atendidos) {
      return [];
    }

    // Verificar se é um array ou converter string para array
    if (Array.isArray(config.delivery.bairros_atendidos)) {
      return config.delivery.bairros_atendidos;
    } else {
      try {
        return JSON.parse(config.delivery.bairros_atendidos);
      } catch {
        return [];
      }
    }
  }

  /**
   * Formata uma string para exibição como moeda
   */
  static formatCurrency(value: number | string): string {
    const numericValue = typeof value === "string" ? parseFloat(value) : value;
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(numericValue);
  }
}
