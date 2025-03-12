// Path: src/features/cart/view-models/use-cart-view-model.ts
import { useMultiCartStore } from "../stores/cart.store";
import { CompanyProduct } from "@/src/features/company-page/models/company-product";
import { Cart, CartItem, emptyCart } from "../models/cart";
import { useEffect } from "react";
import { useLocalSearchParams } from "expo-router";

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
  const {
    carts,
    getCart,
    setActiveCart,
    addItem,
    removeItem: removeCartItem,
    updateQuantity: updateCartQuantity,
    updateObservation: updateCartObservation,
    clearCart: clearCartBySlug,
    getItemCount,
    getItemByProductId,
    activeCartSlug,
  } = useMultiCartStore();

  // Pegar o parâmetro companySlug da URL para definir o carrinho ativo
  const { companySlug: urlCompanySlug } = useLocalSearchParams<{
    companySlug: string;
  }>();

  // Definir o carrinho ativo com base na URL, quando disponível
  useEffect(() => {
    if (urlCompanySlug) {
      setActiveCart(urlCompanySlug);
    }
  }, [urlCompanySlug, setActiveCart]);

  // Usar o carrinho ativo ou o da URL
  const currentSlug = activeCartSlug || urlCompanySlug;

  // Garantir que sempre temos um cart válido mesmo que vazio
  const cart: Cart = currentSlug ? getCart(currentSlug) : { ...emptyCart };

  // Verifica se o carrinho está vazio
  const isEmpty = !cart || cart.items.length === 0;

  // Quantidade total de itens no carrinho
  const itemCount = currentSlug ? getItemCount(currentSlug) : 0;

  // Adiciona um produto ao carrinho com quantidade padrão 1
  const addProduct = (
    product: CompanyProduct,
    companySlug: string,
    companyName: string
  ) => {
    // Gera um ID único para o item do carrinho
    const itemId = `${product.id}_${Date.now()}`;

    addItem(companySlug, {
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

    addItem(companySlug, {
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

  // Remover item do carrinho ativo
  const removeItem = (itemId: string) => {
    if (currentSlug) {
      removeCartItem(currentSlug, itemId);
    }
  };

  // Atualizar quantidade do item no carrinho ativo
  const updateQuantity = (itemId: string, quantity: number) => {
    if (currentSlug) {
      updateCartQuantity(currentSlug, itemId, quantity);
    }
  };

  // Atualiza a observação de um item no carrinho ativo
  const updateObservation = (itemId: string, observation: string) => {
    if (currentSlug) {
      updateCartObservation(currentSlug, itemId, observation);
    }
  };

  // Limpar o carrinho ativo
  const clearCart = () => {
    if (currentSlug) {
      clearCartBySlug(currentSlug);
    }
  };

  // Verifica se um produto está no carrinho ativo
  const isProductInCart = (productId: string): boolean => {
    if (!currentSlug) return false;
    return !!getItemByProductId(currentSlug, productId);
  };

  return {
    isEmpty,
    itemCount,
    items: cart.items,
    subtotal: cart.subtotalFormatted || "R$ 0,00",
    total: cart.totalFormatted || "R$ 0,00",
    companySlug: cart.companySlug,
    companyName: cart.companyName,

    addProduct,
    addToCartWithObservation,
    removeItem,
    updateQuantity,
    updateObservation,
    clearCart,
    isProductInCart,
  };
}
