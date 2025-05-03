// Path: src/features/checkout/services/checkout-optimizer.service.ts

import { CheckoutData } from "../models/checkout";
import { cacheService } from "@/src/services/cache-service";

const CHECKOUT_CACHE_KEY = "checkout_session";
const CHECKOUT_CACHE_EXPIRATION = 30 * 60 * 1000; // 30 minutos

/**
 * Serviço para otimizar a performance do checkout
 * através de técnicas de cache e memoização
 */
export class CheckoutOptimizerService {
  /**
   * Salva o estado atual do checkout no cache
   * @param checkoutData Dados atuais do checkout
   */
  static async cacheCheckoutState(checkoutData: CheckoutData): Promise<void> {
    try {
      await cacheService.set(CHECKOUT_CACHE_KEY, checkoutData);
    } catch (error) {
      console.error("Erro ao salvar cache do checkout:", error);
    }
  }

  /**
   * Recupera o último estado do checkout do cache
   * @returns Dados do checkout ou null se não houver cache
   */
  static async getCheckoutState(): Promise<CheckoutData | null> {
    try {
      return await cacheService.get<CheckoutData>(
        CHECKOUT_CACHE_KEY,
        CHECKOUT_CACHE_EXPIRATION
      );
    } catch (error) {
      console.error("Erro ao recuperar cache do checkout:", error);
      return null;
    }
  }

  /**
   * Limpa o cache do checkout
   */
  static async clearCheckoutCache(): Promise<void> {
    try {
      await cacheService.remove(CHECKOUT_CACHE_KEY);
    } catch (error) {
      console.error("Erro ao limpar cache do checkout:", error);
    }
  }

  /**
   * Gera um ID único para o checkout com memoização para evitar recálculos
   * @param companyId ID da empresa
   * @returns ID único para o checkout
   */
  static generateCheckoutId(companyId: string): string {
    return `checkout_${companyId}_${Date.now()}`;
  }
}
