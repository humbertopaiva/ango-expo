// Path: src/features/orders/stores/order.store.ts

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { storage } from "@/src/lib/storage";
import { Order, PaymentMethod, createOrderFromCart } from "../models/order";
import { CartItem } from "@/src/features/cart/models/cart";

interface OrderState {
  // Estado
  orders: Order[];

  // Ações
  createOrder: (
    cartItems: CartItem[],
    companyId: string,
    companySlug: string,
    companyName: string,
    companyPhone?: string
  ) => Order;
  deleteOrder: (orderId: string) => void;
  clearAllOrders: () => void;
  clearCompanyOrders: (companySlug: string) => void;

  // Getters
  getOrdersByCompany: (companySlug: string, limit?: number) => Order[];
  getOrderById: (orderId: string) => Order | undefined;
  getAllOrders: (limit?: number) => Order[];
}

const ensureDateObjects = (orders: Order[]): Order[] => {
  if (!orders) return [];

  return orders
    .map((order) => {
      if (!order) return order as Order;

      try {
        // Garantir que payment nunca será undefined
        const paymentInfo = order.payment || {
          method: PaymentMethod.CREDIT_CARD,
        };

        // Tratar a data de pagamento
        if (paymentInfo.paymentDate) {
          paymentInfo.paymentDate =
            paymentInfo.paymentDate instanceof Date
              ? new Date(paymentInfo.paymentDate.getTime())
              : new Date(paymentInfo.paymentDate);
        }

        // Criar um novo objeto com as datas convertidas
        return {
          ...order,
          // Converter datas garantindo valores válidos
          createdAt:
            order.createdAt instanceof Date
              ? new Date(order.createdAt.getTime())
              : new Date(order.createdAt || Date.now()),
          updatedAt:
            order.updatedAt instanceof Date
              ? new Date(order.updatedAt.getTime())
              : new Date(order.updatedAt || Date.now()),
          // Atribuir o objeto payment corrigido
          payment: paymentInfo,
        };
      } catch (error) {
        console.error("Error processing order dates:", error);
        return order;
      }
    })
    .filter((order): order is Order => Boolean(order));
};

// Número máximo de pedidos a manter
const MAX_ORDERS = 10;

// Cria o store de pedidos com persistência
export const useOrderStore = create<OrderState>()(
  persist(
    (set, get) => ({
      orders: [],

      createOrder: (
        cartItems,
        companyId,
        companySlug,
        companyName,
        companyPhone
      ) => {
        const newOrder = createOrderFromCart(
          cartItems,
          companyId,
          companySlug,
          companyName,
          companyPhone
        );

        set((state) => {
          // Ordenar por data (mais recentes primeiro)
          const sortedOrders = [newOrder, ...state.orders].sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );

          // Limitar ao número máximo de pedidos
          const limitedOrders = sortedOrders.slice(0, MAX_ORDERS);

          return { orders: limitedOrders };
        });

        return newOrder;
      },

      deleteOrder: (orderId) => {
        set((state) => ({
          orders: state.orders.filter((order) => order.id !== orderId),
        }));
      },

      clearAllOrders: () => {
        set({ orders: [] });
      },

      clearCompanyOrders: (companySlug) => {
        set((state) => ({
          orders: state.orders.filter(
            (order) => order.companySlug !== companySlug
          ),
        }));
      },

      getOrdersByCompany: (companySlug, limit = MAX_ORDERS) => {
        const filteredOrders = ensureDateObjects(
          get().orders.filter((order) => order.companySlug === companySlug)
        );

        // Ordenar por data (mais recentes primeiro) e limitar
        return filteredOrders
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
          .slice(0, limit);
      },

      getOrderById: (orderId) => {
        const order = get().orders.find((order) => order.id === orderId);
        return order ? ensureDateObjects([order])[0] : undefined;
      },

      getAllOrders: (limit = MAX_ORDERS) => {
        // Ordenar por data (mais recentes primeiro) e limitar
        return ensureDateObjects(get().orders)
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
          .slice(0, limit);
      },
    }),
    {
      name: "orders-storage",
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
      // Adicione esta função para processar os dados durante a hidratação do store
      partialize: (state) => ({ ...state }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Garantir que as datas sejam objetos Date após a hidratação
          state.orders = ensureDateObjects(state.orders);
        }
      },
    }
  )
);
