// Path: src/features/cart/services/cart-item-identifier.service.ts
// Serviço para ajudar a identificar itens de forma consistente

/**
 * Serviço para auxiliar na identificação de itens do carrinho
 * Garante que o mesmo produto com variações diferentes seja tratado como itens distintos
 */
export class CartItemIdentifierService {
  /**
   * Gera um ID único para um item do carrinho
   * Para produtos com variação, inclui o ID da variação para garantir unicidade
   */
  static generateItemId(
    productId: string,
    hasVariation: boolean = false,
    variationId?: string
  ): string {
    const timestamp = Date.now();

    if (hasVariation && variationId) {
      return `${productId}_var_${variationId}_${timestamp}`;
    }

    return `${productId}_${timestamp}`;
  }

  /**
   * Verifica se dois itens do carrinho são essencialmente o mesmo produto
   * Considera variações como produtos diferentes
   */
  static isSameProduct(item1: any, item2: any): boolean {
    // Se ambos têm variação, compara productId E variationId
    if (item1.hasVariation && item2.hasVariation) {
      return (
        item1.productId === item2.productId &&
        item1.variationId === item2.variationId
      );
    }

    // Se apenas um tem variação, são produtos diferentes
    if (item1.hasVariation !== item2.hasVariation) {
      return false;
    }

    // Se nenhum tem variação, compara apenas o productId
    return item1.productId === item2.productId;
  }

  /**
   * Formata o nome do produto para exibição, incluindo a variação se existir
   */
  static formatProductName(
    name: string,
    hasVariation: boolean,
    variationName?: string
  ): string {
    if (hasVariation && variationName) {
      return `${name} (${variationName})`;
    }
    return name;
  }
}
