// Path: src/features/cart/stores/cart.store.ts
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { storage } from "@/src/lib/storage";
import { Cart, CartItem, emptyCart } from "../models/cart";

interface CartState extends Cart {
  // Ações
  addItem: (
    item: Omit<
      CartItem,
      "totalPrice" | "totalPriceFormatted" | "priceFormatted"
    >
  ) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  updateObservation: (itemId: string, observation: string) => void;
  clearCart: () => void;

  // Computed properties
  getItemCount: () => number;
  getItemByProductId: (productId: string) => CartItem | undefined;
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

// Cria o store do carrinho com persistência
export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      ...emptyCart,

      addItem: (item) => {
        const { items, companyId } = get();

        // Verifica se o item é de outra empresa
        if (companyId && item.companyId !== companyId) {
          // Aqui poderíamos mostrar um diálogo perguntando se deseja limpar o carrinho
          // Por ora, apenas substituímos os itens

          const newItem: CartItem = {
            ...item,
            priceFormatted: formatPrice(item.price),
            totalPrice: item.price * item.quantity,
            totalPriceFormatted: formatPrice(item.price * item.quantity),
          };

          set({
            items: [newItem],
            companyId: item.companyId,
            companySlug: item.companySlug,
            companyName: item.companyName,
            ...recalculateCart([newItem]),
          });

          return;
        }

        // Verifica se o item já existe no carrinho
        const existingItemIndex = items.findIndex(
          (i) => i.productId === item.productId
        );

        if (existingItemIndex >= 0) {
          // Se já existe, atualiza a quantidade e observação
          const newItems = [...items];
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

          set({
            items: newItems,
            ...recalculateCart(newItems),
          });
        } else {
          // Se não existe, adiciona ao carrinho
          const newItem: CartItem = {
            ...item,
            priceFormatted: formatPrice(item.price),
            totalPrice: item.price * item.quantity,
            totalPriceFormatted: formatPrice(item.price * item.quantity),
          };

          const newItems = [...items, newItem];

          set({
            items: newItems,
            companyId: companyId || item.companyId,
            companySlug: get().companySlug || item.companySlug,
            companyName: get().companyName || item.companyName,
            ...recalculateCart(newItems),
          });
        }
      },

      removeItem: (itemId) => {
        const { items } = get();
        const newItems = items.filter((item) => item.id !== itemId);

        // Se o carrinho ficar vazio, limpa as informações da empresa
        if (newItems.length === 0) {
          set({
            ...emptyCart,
          });
          return;
        }

        set({
          items: newItems,
          ...recalculateCart(newItems),
        });
      },

      updateQuantity: (itemId, quantity) => {
        const { items } = get();

        // Não permitir quantidades menores que 1
        if (quantity < 1) quantity = 1;

        const newItems = items.map((item) => {
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

        set({
          items: newItems,
          ...recalculateCart(newItems),
        });
      },

      updateObservation: (itemId, observation) => {
        const { items } = get();

        const newItems = items.map((item) => {
          if (item.id === itemId) {
            return {
              ...item,
              observation,
            };
          }
          return item;
        });

        set({
          items: newItems,
        });
      },

      clearCart: () => {
        set({
          ...emptyCart,
        });
      },

      getItemCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0);
      },

      getItemByProductId: (productId) => {
        return get().items.find((item) => item.productId === productId);
      },
    }),
    {
      name: "shopping-cart",
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
