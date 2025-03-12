// Path: src/features/cart/stores/cart.store.ts
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { storage } from "@/src/lib/storage";
import { Cart, CartItem, emptyCart } from "../models/cart";

// Tipo para armazenar múltiplos carrinhos
interface MultiCartState {
  // Mapa de carrinhos por companySlug
  carts: Record<string, Cart>;
  // Carrinho ativo atualmente
  activeCartSlug: string | null;

  // Ações para gerenciar carrinhos
  getCart: (companySlug: string) => Cart;
  setActiveCart: (companySlug: string) => void;
  clearActiveCart: () => void;

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
  items: CartItem[]
): Pick<
  Cart,
  "subtotal" | "subtotalFormatted" | "total" | "totalFormatted"
> => {
  const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0);

  return {
    subtotal,
    subtotalFormatted: formatPrice(subtotal),
    total: subtotal, // Por enquanto sem taxa de entrega
    totalFormatted: formatPrice(subtotal),
  };
};

// Cria o store de múltiplos carrinhos com persistência
export const useMultiCartStore = create<MultiCartState>()(
  persist(
    (set, get) => ({
      carts: {},
      activeCartSlug: null,

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

      addItem: (companySlug: string, item) => {
        const carts = { ...get().carts };
        const currentCart = carts[companySlug] || {
          ...emptyCart,
          companyId: item.companyId,
          companySlug: companySlug,
          companyName: item.companyName,
        };

        // Verifica se o item já existe no carrinho
        const existingItemIndex = currentCart.items.findIndex(
          (i) => i.productId === item.productId
        );

        if (existingItemIndex >= 0) {
          // Se já existe, atualiza a quantidade e observação
          const newItems = [...currentCart.items];
          const existingItem = newItems[existingItemIndex];
          const newQuantity = existingItem.quantity + item.quantity;

          newItems[existingItemIndex] = {
            ...existingItem,
            quantity: newQuantity,
            observation:
              item.observation !== undefined
                ? item.observation
                : existingItem.observation,
            totalPrice: existingItem.price * newQuantity,
            totalPriceFormatted: formatPrice(existingItem.price * newQuantity),
          };

          const updatedCart = {
            ...currentCart,
            items: newItems,
            ...recalculateCart(newItems),
          };

          carts[companySlug] = updatedCart;
          set({ carts, activeCartSlug: companySlug });
        } else {
          // Se não existe, adiciona ao carrinho
          const newItem: CartItem = {
            ...item,
            priceFormatted: formatPrice(item.price),
            totalPrice: item.price * item.quantity,
            totalPriceFormatted: formatPrice(item.price * item.quantity),
          };

          const newItems = [...currentCart.items, newItem];

          const updatedCart = {
            ...currentCart,
            items: newItems,
            ...recalculateCart(newItems),
          };

          carts[companySlug] = updatedCart;
          set({ carts, activeCartSlug: companySlug });
        }
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

        const updatedCart = {
          ...currentCart,
          items: newItems,
          ...recalculateCart(newItems),
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

        const updatedCart = {
          ...currentCart,
          items: newItems,
          ...recalculateCart(newItems),
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

        return cart.items.reduce((count, item) => count + item.quantity, 0);
      },

      getItemByProductId: (companySlug: string, productId: string) => {
        const cart = get().carts[companySlug];
        if (!cart) return undefined;

        return cart.items.find((item) => item.productId === productId);
      },

      clearAllCarts: () => {
        set({ carts: {}, activeCartSlug: null });
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
