// Path: src/features/cart/stores/cart.store.ts

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { storage } from "@/src/lib/storage";
import { Cart, CartItem, emptyCart } from "../models/cart";
import { DeliveryInfoService } from "../services/delivery-info.service";

// Tipo para armazenar múltiplos carrinhos
interface MultiCartState {
  // Mapa de carrinhos por companySlug
  carts: Record<string, Cart>;
  // Carrinho ativo atualmente
  activeCartSlug: string | null;
  // Taxas de entrega por empresa
  deliveryFees: Record<string, number>;
  // Modo de entrega por empresa (true = entrega, false = retirada)
  isDeliveryMode: Record<string, boolean>;

  // Ações para gerenciar carrinhos
  getCart: (companySlug: string) => Cart;
  setActiveCart: (companySlug: string) => void;
  clearActiveCart: () => void;

  // Ações para gerenciar entrega
  setDeliveryFee: (companySlug: string, fee: number) => void;
  setDeliveryMode: (companySlug: string, isDelivery: boolean) => void;

  // Ações para gerenciar itens
  addItem: (
    companySlug: string,
    item: Omit<
      CartItem,
      "totalPrice" | "totalPriceFormatted" | "priceFormatted"
    >
  ) => void;
  removeItem: (companySlug: string, itemId: string) => void;
  updateQuantity: (
    companySlug: string,
    itemId: string,
    quantity: number
  ) => void;
  updateObservation: (
    companySlug: string,
    itemId: string,
    observation: string
  ) => void;
  clearCart: (companySlug: string) => void;

  // Computed properties
  getItemCount: (companySlug: string) => number;
  getItemByProductId: (
    companySlug: string,
    productId: string
  ) => CartItem | undefined;

  // Estado global
  clearAllCarts: () => void;
}

// Helper para formatar preços
const formatPrice = (price: number): string => {
  return price.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
};

// Helper para recalcular totais
const recalculateCart = (
  items: CartItem[],
  companySlug: string,
  isDelivery: boolean = true,
  deliveryFee: number = 0
): Pick<
  Cart,
  | "subtotal"
  | "subtotalFormatted"
  | "deliveryFee"
  | "deliveryFeeFormatted"
  | "total"
  | "totalFormatted"
> => {
  // Mapping for main items and their addons
  const mainItems: CartItem[] = [];
  const addonsMap: Record<string, CartItem[]> = {};
  const customItems: CartItem[] = [];

  // First pass: identify addons and their parent items, and custom products
  items.forEach((item) => {
    // Check if it's an addon
    if (item.addons && item.addons.length > 0 && item.addons[0].parentItemId) {
      const parentId = item.addons[0].parentItemId;
      if (!addonsMap[parentId]) {
        addonsMap[parentId] = [];
      }
      addonsMap[parentId].push(item);
    } else if (item.isCustomProduct) {
      // It's a custom product
      customItems.push(item);
    } else {
      // It's a main item (simple or with variation)
      mainItems.push(item);
    }
  });

  // Calculate subtotal for main items with their addons
  const mainItemsTotal = mainItems.reduce((sum, item) => {
    // Price of the main item
    let itemTotal = item.price * item.quantity;

    // Add price of addons for this item
    const addons = addonsMap[item.id] || [];
    const addonsTotal = addons.reduce(
      (addonSum, addon) => addonSum + addon.price * addon.quantity,
      0
    );

    return sum + itemTotal + addonsTotal;
  }, 0);

  // Calculate subtotal for custom products
  const customItemsTotal = customItems.reduce((sum, item) => {
    return sum + item.price * item.quantity;
  }, 0);

  // Total subtotal
  const subtotal = mainItemsTotal + customItemsTotal;

  // Aplicar a taxa de entrega apenas se o método de entrega for selecionado
  const finalDeliveryFee = isDelivery ? deliveryFee : 0;

  // Calcular o total (subtotal + taxa de entrega)
  const total = subtotal + finalDeliveryFee;

  return {
    subtotal,
    subtotalFormatted: formatPrice(subtotal),
    deliveryFee: finalDeliveryFee,
    deliveryFeeFormatted: formatPrice(finalDeliveryFee),
    total,
    totalFormatted: formatPrice(total),
  };
};

// Cria o store de múltiplos carrinhos com persistência
export const useMultiCartStore = create<MultiCartState>()(
  persist(
    (set, get) => ({
      carts: {},
      activeCartSlug: null,
      deliveryFees: {},
      isDeliveryMode: {},

      getCart: (companySlug: string) => {
        const cart = get().carts[companySlug];
        return cart || { ...emptyCart, companySlug };
      },

      setActiveCart: (companySlug: string) => {
        set({ activeCartSlug: companySlug });
      },

      clearActiveCart: () => {
        set({ activeCartSlug: null });
      },

      setDeliveryFee: (companySlug: string, fee: number) => {
        const deliveryFees = { ...get().deliveryFees };
        deliveryFees[companySlug] = fee;

        // Recalcular o carrinho com a nova taxa
        const carts = { ...get().carts };
        const currentCart = carts[companySlug];

        if (currentCart) {
          const isDelivery = get().isDeliveryMode[companySlug] !== false;

          const updatedCart = {
            ...currentCart,
            ...recalculateCart(currentCart.items, companySlug, isDelivery, fee),
            isDelivery,
          };

          carts[companySlug] = updatedCart;
          set({ carts, deliveryFees });
        } else {
          set({ deliveryFees });
        }
      },

      setDeliveryMode: (companySlug: string, isDelivery: boolean) => {
        const isDeliveryMode = { ...get().isDeliveryMode };
        isDeliveryMode[companySlug] = isDelivery;

        // Recalcular o carrinho com o novo modo
        const carts = { ...get().carts };
        const currentCart = carts[companySlug];

        if (currentCart) {
          const fee = get().deliveryFees[companySlug] || 0;

          const updatedCart = {
            ...currentCart,
            isDelivery,
            ...recalculateCart(currentCart.items, companySlug, isDelivery, fee),
          };

          carts[companySlug] = updatedCart;
          set({ carts, isDeliveryMode });
        } else {
          set({ isDeliveryMode });
        }
      },

      addItem: (companySlug: string, item) => {
        const carts = { ...get().carts };
        const currentCart = carts[companySlug] || {
          ...emptyCart,
          companyId: item.companyId,
          companySlug: companySlug,
          companyName: item.companyName,
          isDelivery: get().isDeliveryMode[companySlug] !== false,
        };

        // Formatar o preço para exibição
        const formattedPrice = formatPrice(item.price);
        const totalPrice = item.price * item.quantity;
        const formattedTotalPrice = formatPrice(totalPrice);

        // Adicionar como novo item, verificando se é um adicional com parentItemId
        const isAddon =
          item.addons && item.addons.length > 0 && item.addons[0].parentItemId;

        // Se for um adicional, garantir que o ID seja único e relacionado ao item pai
        const itemId = isAddon
          ? `addon_${item.productId}_${
              item.addons?.[0]?.parentItemId
            }_${Date.now()}`
          : item.id;

        const newItem: CartItem = {
          ...item,
          id: itemId, // Usar o ID gerado acima
          priceFormatted: formattedPrice,
          totalPrice,
          totalPriceFormatted: formattedTotalPrice,
        };

        const newItems = [...currentCart.items, newItem];

        // Obter o modo de entrega e taxa atuais
        const isDelivery = get().isDeliveryMode[companySlug] !== false;
        const deliveryFee = get().deliveryFees[companySlug] || 0;

        const updatedCart = {
          ...currentCart,
          items: newItems,
          isDelivery,
          ...recalculateCart(newItems, companySlug, isDelivery, deliveryFee),
        };

        carts[companySlug] = updatedCart;
        set({ carts, activeCartSlug: companySlug });
      },

      removeItem: (companySlug: string, itemId: string) => {
        const carts = { ...get().carts };
        const currentCart = carts[companySlug];

        if (!currentCart) return;

        const newItems = currentCart.items.filter((item) => item.id !== itemId);

        // Se o carrinho ficar vazio, remove-o do mapa
        if (newItems.length === 0) {
          delete carts[companySlug];

          // Se o carrinho ativo foi esvaziado, limpa o activeCartSlug
          if (get().activeCartSlug === companySlug) {
            set({ carts, activeCartSlug: null });
          } else {
            set({ carts });
          }
          return;
        }

        // Obter o modo de entrega e taxa atuais
        const isDelivery = get().isDeliveryMode[companySlug] !== false;
        const deliveryFee = get().deliveryFees[companySlug] || 0;

        const updatedCart = {
          ...currentCart,
          items: newItems,
          ...recalculateCart(newItems, companySlug, isDelivery, deliveryFee),
        };

        carts[companySlug] = updatedCart;
        set({ carts });
      },

      updateQuantity: (
        companySlug: string,
        itemId: string,
        quantity: number
      ) => {
        const carts = { ...get().carts };
        const currentCart = carts[companySlug];

        if (!currentCart) return;

        // Não permitir quantidades menores que 1
        if (quantity < 1) quantity = 1;

        const newItems = currentCart.items.map((item) => {
          if (item.id === itemId) {
            return {
              ...item,
              quantity,
              totalPrice: item.price * quantity,
              totalPriceFormatted: formatPrice(item.price * quantity),
            };
          }
          return item;
        });

        // Obter o modo de entrega e taxa atuais
        const isDelivery = get().isDeliveryMode[companySlug] !== false;
        const deliveryFee = get().deliveryFees[companySlug] || 0;

        const updatedCart = {
          ...currentCart,
          items: newItems,
          ...recalculateCart(newItems, companySlug, isDelivery, deliveryFee),
        };

        carts[companySlug] = updatedCart;
        set({ carts });
      },

      updateObservation: (
        companySlug: string,
        itemId: string,
        observation: string
      ) => {
        const carts = { ...get().carts };
        const currentCart = carts[companySlug];

        if (!currentCart) return;

        const newItems = currentCart.items.map((item) => {
          if (item.id === itemId) {
            return {
              ...item,
              observation,
            };
          }
          return item;
        });

        const updatedCart = {
          ...currentCart,
          items: newItems,
        };

        carts[companySlug] = updatedCart;
        set({ carts });
      },

      clearCart: (companySlug: string) => {
        const carts = { ...get().carts };

        // Remove o carrinho do mapa
        delete carts[companySlug];

        // Se o carrinho ativo foi limpo, limpa o activeCartSlug
        if (get().activeCartSlug === companySlug) {
          set({ carts, activeCartSlug: null });
        } else {
          set({ carts });
        }
      },

      getItemCount: (companySlug: string) => {
        const cart = get().carts[companySlug];
        if (!cart) return 0;

        // Contar apenas itens que não são adicionais (não têm parentItemId)
        return cart.items.reduce((count, item) => {
          // Verificar se o item é um adicional (tem addons com parentItemId)
          const isAddon =
            item.addons &&
            item.addons.length > 0 &&
            item.addons[0].parentItemId !== undefined;

          // Se não for adicional, contar normalmente
          if (!isAddon) {
            return count + item.quantity;
          }

          // Se for adicional, não contar
          return count;
        }, 0);
      },

      getItemByProductId: (companySlug: string, productId: string) => {
        const cart = get().carts[companySlug];
        if (!cart) return undefined;

        return cart.items.find((item) => item.productId === productId);
      },

      clearAllCarts: () => {
        set({
          carts: {},
          activeCartSlug: null,
          deliveryFees: {},
          isDeliveryMode: {},
        });
      },
    }),
    {
      name: "multi-cart-storage",
      storage: createJSONStorage(() => ({
        getItem: async (name) => {
          const value = await storage.getItem(name);
          return value ? JSON.parse(value) : null;
        },
        setItem: async (name, value) => {
          await storage.setItem(name, JSON.stringify(value));
        },
        removeItem: async (name) => {
          await storage.removeItem(name);
        },
      })),
    }
  )
);

// Para compatibilidade com código existente, mantém uma API simplificada para o carrinho ativo
export const useCartStore = {
  ...useMultiCartStore,
  getState: () => {
    const state = useMultiCartStore.getState();
    const activeSlug = state.activeCartSlug;

    // Se não há carrinho ativo, retorna um carrinho vazio
    if (!activeSlug) return { ...emptyCart };

    // Retorna o carrinho ativo
    return state.getCart(activeSlug);
  },
};
