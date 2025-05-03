// Path: src/features/cart/view-models/use-cart-view-model.ts
import { useMultiCartStore } from "../stores/cart.store";
import {
  CompanyProduct,
  ProductWithVariation,
} from "@/src/features/company-page/models/company-product";
import { Cart, CartItem, emptyCart } from "../models/cart";
import { useCallback, useEffect } from "react";
import { useLocalSearchParams } from "expo-router";
import {
  CustomProductDetail,
  CustomProductSelection,
} from "@/src/features/company-page/models/custom-product";
import { toastUtils } from "@/src/utils/toast.utils";

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

  // Novas ações para diferentes tipos de pedidos
  addProductWithVariation: (
    product: CompanyProduct,
    companySlug: string,
    companyName: string,
    variationId: string,
    variationName: string,
    variationPrice: number,
    variationDescription?: string,
    quantity?: number,
    observation?: string
  ) => string;
  addCustomProduct: (
    product: CustomProductDetail,
    companySlug: string,
    companyName: string,
    selections: CustomProductSelection[],
    totalPrice: number,
    quantity?: number,
    observation?: string
  ) => void;
  addAddonToCart: (
    addon: CompanyProduct,
    companySlug: string,
    companyName: string,
    parentItemId: string,
    quantity?: number,
    parentItemName?: string
  ) => void;
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

  // Adiciona um produto com variação ao carrinho
  const addProductWithVariation = (
    product: CompanyProduct,
    companySlug: string,
    companyName: string,
    variationId: string,
    variationName: string,
    variationPrice: number,
    variationDescription?: string,
    quantity: number = 1,
    observation?: string
  ): string => {
    // Generate a unique ID with timestamp to ensure uniqueness
    const uniqueTimestamp = Date.now();
    const itemId = `${product.id}_var_${variationId}_${uniqueTimestamp}`;

    // Add the item to the cart
    addItem(companySlug, {
      id: itemId,
      productId: product.id,
      name: product.nome,
      quantity,
      price: variationPrice,
      imageUrl: product.imagem || undefined,
      description: variationDescription || product.descricao || undefined,
      observation,
      companyId: product.empresa.slug,
      companySlug,
      companyName,
      hasVariation: true,
      variationId,
      variationName,
      variationDescription,
    });

    // Important: Return the item ID for use with addons
    return itemId;
  };

  // Adiciona um produto customizado ao carrinho
  const addCustomProduct = useCallback(
    (
      product: CustomProductDetail,
      companySlug: string,
      companyName: string,
      selections: CustomProductSelection[],
      totalPrice: number,
      quantity: number = 1,
      observation?: string
    ) => {
      // Verificações importantes
      if (!companySlug) {
        console.error("Cannot add custom product: companySlug is empty");
        return;
      }

      // Gera um ID único com timestamp atual para garantir unicidade
      const uniqueTimestamp = Date.now();
      const itemId = `custom_${product.id}_${uniqueTimestamp}`;

      // Mapear as seleções para o formato do carrinho
      const customProductSteps = selections.map((step) => ({
        stepNumber: step.stepNumber,
        stepName: product.passos.find((p) => p.passo_numero === step.stepNumber)
          ?.nome,
        selectedItems: step.selectedItems.map((item) => ({
          id: item.produtos.key,
          name: item.produto_detalhes.nome,
          price: item.produto_detalhes.preco
            ? parseFloat(item.produto_detalhes.preco.replace(",", "."))
            : 0,
        })),
      }));

      addItem(companySlug, {
        id: itemId,
        productId: product.id,
        name: product.nome,
        quantity,
        price: totalPrice / quantity, // Preço por unidade
        imageUrl: product.imagem || undefined,
        description: product.descricao || undefined,
        observation,
        companyId: product.empresa || "",
        companySlug,
        companyName,
        isCustomProduct: true,
        customProductSteps,
      });

      // Retorna o ID do item criado
      return itemId;
    },
    [addItem, getCart]
  );

  // Adiciona um addon ao carrinho, associado a um item principal
  const addAddonToCart = (
    addon: CompanyProduct,
    companySlug: string,
    companyName: string,
    parentItemId: string,
    quantity: number = 1,
    parentItemName: string = "item"
  ) => {
    // Gera um ID único para o item adicional
    const itemId = `addon_${addon.id}_${Date.now()}`;
    const price = parseFloat(addon.preco_promocional || addon.preco);

    addItem(companySlug, {
      id: itemId,
      productId: addon.id,
      name: addon.nome,
      quantity,
      price,
      imageUrl: addon.imagem || undefined,
      description: `Adicional para: ${parentItemName}`,
      companyId: addon.empresa.slug,
      companySlug,
      companyName,
      addons: [
        {
          id: addon.id,
          name: addon.nome,
          quantity,
          price,
          parentItemId,
        },
      ],
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

    // Novas funções
    addProductWithVariation,
    addCustomProduct,
    addAddonToCart,
  };
}
