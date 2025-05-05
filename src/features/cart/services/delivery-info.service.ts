// Path: src/features/cart/services/delivery-info.service.ts

import { CompanyConfig } from "@/src/features/company-page/models/company-config";

export class DeliveryInfoService {
  /**
   * Obtém o valor da taxa de entrega com base na configuração da empresa
   * @param config Configuração da empresa
   * @returns Valor da taxa de entrega em centavos
   */
  static getDeliveryFee(config: CompanyConfig | null): number {
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
   * @param config Configuração da empresa
   * @returns True se a empresa oferece entrega
   */
  static hasDelivery(config: CompanyConfig | null): boolean {
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
   * @param config Configuração da empresa
   * @returns True se o valor mínimo foi atingido
   */
  static hasReachedMinimumOrderValue(
    subtotal: number,
    config: CompanyConfig | null
  ): boolean {
    if (!config || !config.delivery || !config.delivery.pedido_minimo) {
      return true; // Se não há valor mínimo configurado, considera atingido
    }

    const pedidoMinimo = parseFloat(config.delivery.pedido_minimo);
    return subtotal >= pedidoMinimo;
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
