// Path: src/features/cart/view-models/use-cart-view-model.ts
import { useCartStore } from "../stores/cart.store";
import { CompanyProduct } from "@/src/features/company-page/models/company-product";

export interface CartViewModel {
  // Estado
  isEmpty: boolean;
  itemCount: number;
  items: any[];
  subtotal: string;
  total: string;
  companySlug: string | undefined;
  companyName: string | undefined;

  // Ações
  addProduct: (
    product: CompanyProduct,
    companySlug: string,
    companyName: string
  ) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  isProductInCart: (productId: string) => boolean;
}

/**
 * Hook que fornece a lógica de negócios para o carrinho de compras
 * Segue o padrão MVVM para separar a lógica da UI
 */
export function useCartViewModel(): CartViewModel {
  const cartStore = useCartStore();

  // Verifica se o carrinho está vazio
  const isEmpty = cartStore.items.length === 0;

  // Quantidade total de itens no carrinho
  const itemCount = cartStore.getItemCount();

  // Adiciona um produto ao carrinho
  const addProduct = (
    product: CompanyProduct,
    companySlug: string,
    companyName: string
  ) => {
    // Gera um ID único para o item do carrinho
    const itemId = `${product.id}_${Date.now()}`;

    cartStore.addItem({
      id: itemId,
      productId: product.id,
      name: product.nome,
      quantity: 1,
      price: parseFloat(product.preco_promocional || product.preco),
      imageUrl: product.imagem || undefined,
      description: product.descricao || undefined,
      companyId: product.empresa.slug, // Usando o slug como companyId
      companySlug,
      companyName,
    });
  };

  // Verifica se um produto está no carrinho
  const isProductInCart = (productId: string): boolean => {
    return !!cartStore.getItemByProductId(productId);
  };

  return {
    isEmpty,
    itemCount,
    items: cartStore.items,
    subtotal: cartStore.subtotalFormatted,
    total: cartStore.totalFormatted,
    companySlug: cartStore.companySlug,
    companyName: cartStore.companyName,

    addProduct,
    removeItem: cartStore.removeItem,
    updateQuantity: cartStore.updateQuantity,
    clearCart: cartStore.clearCart,
    isProductInCart,
  };
}
