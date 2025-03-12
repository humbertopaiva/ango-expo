// Path: src/features/cart/view-models/use-cart-view-model.ts
import { useCartStore } from "../stores/cart.store";
import { CompanyProduct } from "@/src/features/company-page/models/company-product";
import { CartItem } from "../models/cart";

export interface CartViewModel {
  // Estado
  isEmpty: boolean;
  itemCount: number;
  items: CartItem[];
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
  addToCartWithObservation: (
    product: CompanyProduct,
    companySlug: string,
    companyName: string,
    quantity: number,
    observation?: string
  ) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  updateObservation: (itemId: string, observation: string) => void;
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

  // Adiciona um produto ao carrinho com quantidade padrão 1
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

  // Adiciona um produto ao carrinho com quantidade e observação específicas
  const addToCartWithObservation = (
    product: CompanyProduct,
    companySlug: string,
    companyName: string,
    quantity: number = 1,
    observation?: string
  ) => {
    // Gera um ID único para o item do carrinho
    const itemId = `${product.id}_${Date.now()}`;

    cartStore.addItem({
      id: itemId,
      productId: product.id,
      name: product.nome,
      quantity,
      price: parseFloat(product.preco_promocional || product.preco),
      imageUrl: product.imagem || undefined,
      description: product.descricao || undefined,
      observation,
      companyId: product.empresa.slug, // Usando o slug como companyId
      companySlug,
      companyName,
    });
  };

  // Atualiza a observação de um item
  const updateObservation = (itemId: string, observation: string) => {
    cartStore.updateObservation(itemId, observation);
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
    addToCartWithObservation,
    removeItem: cartStore.removeItem,
    updateQuantity: cartStore.updateQuantity,
    updateObservation,
    clearCart: cartStore.clearCart,
    isProductInCart,
  };
}
