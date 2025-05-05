// Path: src/features/checkout/services/delivery-config.service.ts

import { api } from "@/src/services/api";

// Interface para bairros atendidos
export interface DeliveryNeighborhood {
  name: string;
  fee?: number; // Taxa específica do bairro (opcional)
}

// Interface para configuração de delivery
export interface DeliveryConfig {
  id: string;
  taxa_entrega: string;
  pedido_minimo: string;
  tempo_estimado_entrega: number;
  especificar_bairros_atendidos: boolean;
  bairros_atendidos: string[];
  mostrar_info_delivery: boolean;
  habilitar_carrinho: boolean;
  observacoes?: string;
  empresa?: any;
}

export class DeliveryConfigService {
  /**
   * Obtém a taxa de entrega em número
   * @param config Configuração de delivery
   * @returns Taxa de entrega como número
   */
  static getDeliveryFee(config: DeliveryConfig | null): number {
    if (!config || !config.taxa_entrega) return 0;

    try {
      return parseFloat(config.taxa_entrega);
    } catch (error) {
      console.error("Erro ao converter taxa de entrega:", error);
      return 0;
    }
  }

  /**
   * Obtém o valor mínimo para pedido em número
   * @param config Configuração de delivery
   * @returns Valor mínimo como número
   */
  static getMinimumOrderValue(config: DeliveryConfig | null): number {
    if (!config || !config.pedido_minimo) return 0;

    try {
      return parseFloat(config.pedido_minimo);
    } catch (error) {
      console.error("Erro ao converter valor mínimo de pedido:", error);
      return 0;
    }
  }

  /**
   * Verifica se o delivery está habilitado
   * @param config Configuração de delivery
   * @returns True se o delivery estiver habilitado
   */
  static isDeliveryEnabled(config: DeliveryConfig | null): boolean {
    return !!(config && config.mostrar_info_delivery);
  }

  /**
   * Verifica se a empresa especifica bairros atendidos
   * @param config Configuração de delivery
   * @returns True se a empresa especifica bairros
   */
  static hasSpecificNeighborhoods(config: DeliveryConfig | null): boolean {
    return !!(config && config.especificar_bairros_atendidos);
  }

  /**
   * Obtém a lista de bairros atendidos
   * @param config Configuração de delivery
   * @returns Lista de bairros atendidos ou array vazio
   */
  static getNeighborhoodsList(config: DeliveryConfig | null): string[] {
    if (!config || !config.bairros_atendidos) return [];
    return config.bairros_atendidos;
  }

  /**
   * Verifica se um bairro específico é atendido
   * @param config Configuração de delivery
   * @param neighborhood Nome do bairro
   * @returns True se o bairro for atendido
   */
  static isNeighborhoodServed(
    config: DeliveryConfig | null,
    neighborhood: string
  ): boolean {
    if (!config || !config.bairros_atendidos || !neighborhood) return false;

    // Normalizar o nome do bairro para comparação
    const normalizedNeighborhood = neighborhood.trim().toLowerCase();

    return config.bairros_atendidos.some(
      (n) => n.trim().toLowerCase() === normalizedNeighborhood
    );
  }

  /**
   * Verifica se um bairro é atendido pela empresa
   * @param config Configuração de delivery
   * @param neighborhood Bairro a verificar
   * @returns true se o bairro é atendido
   */
  static isValidNeighborhood(
    config: DeliveryConfig | null,
    neighborhood: string
  ): boolean {
    if (!config || !neighborhood) return false;

    // Se a empresa não especifica bairros, qualquer bairro é válido
    if (!config.especificar_bairros_atendidos) return true;

    // Se não há lista de bairros, considerar inválido
    if (!config.bairros_atendidos || config.bairros_atendidos.length === 0)
      return false;

    // Normalizar para comparação
    const normalizedNeighborhood = neighborhood.trim().toLowerCase();

    // Verificar se o bairro está na lista de atendidos
    return config.bairros_atendidos.some(
      (bairro) => bairro.trim().toLowerCase() === normalizedNeighborhood
    );
  }
}
