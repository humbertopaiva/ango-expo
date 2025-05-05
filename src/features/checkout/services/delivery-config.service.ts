// Path: src/features/checkout/services/delivery-config.service.ts

import { api } from "@/src/services/api";
import { cacheService } from "@/src/services/cache-service";

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

// Chave para cache
const CACHE_KEY_PREFIX = "delivery_config_";
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutos

export class DeliveryConfigService {
  /**
   * Busca a configuração de delivery da empresa
   * @param companyId ID da empresa
   * @returns Configuração de delivery
   */
  static async getDeliveryConfig(
    companyId: string
  ): Promise<DeliveryConfig | null> {
    if (!companyId) {
      console.error("CompanyId não fornecido para buscar config de delivery");
      return null;
    }

    const cacheKey = `${CACHE_KEY_PREFIX}${companyId}`;

    try {
      // Verificar cache primeiro
      const cachedConfig = await cacheService.get<DeliveryConfig>(
        cacheKey,
        CACHE_DURATION
      );

      if (cachedConfig) {
        console.log("Usando config de delivery do cache");
        return cachedConfig;
      }

      // Buscar da API se não estiver em cache
      console.log(`Buscando config de delivery para empresa: ${companyId}`);
      const response = await api.get(
        `/api/delivery/config?company=${companyId}`
      );

      if (response.data?.status === "success" && response.data?.data) {
        const config = response.data.data;

        // Salvar no cache para futuras consultas
        await cacheService.set(cacheKey, config);

        return config;
      }

      console.log("Nenhuma configuração de delivery encontrada");
      return null;
    } catch (error) {
      console.error("Erro ao buscar configuração de delivery:", error);
      return null;
    }
  }

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
