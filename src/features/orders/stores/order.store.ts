// Path: src/features/orders/stores/order.store.ts
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { storage } from "@/src/lib/storage";
import {
  Order,
  OrderStatus,
  createOrderFromCart,
  createOrderFromExisting,
  PaymentMethod,
  PaymentStatus,
} from "../models/order";
import { CartItem } from "@/src/features/cart/models/cart";

interface OrderState {
  // Estado
  orders: Order[];

  // Ações
  createOrder: (
    cartItems: CartItem[],
    companyId: string,
    companySlug: string,
    companyName: string
  ) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  cancelOrder: (orderId: string) => void;
  deleteOrder: (orderId: string) => void;
  repeatOrder: (orderId: string) => Order | null;

  // Getters
  getOrdersByCompany: (companySlug: string) => Order[];
  getOrderById: (orderId: string) => Order | undefined;
  getOrdersByStatus: (status: OrderStatus) => Order[];
  getAllOrders: () => Order[];
}

const ensureDateObjects = (orders: Order[]): Order[] => {
  return orders.map((order) => ({
    ...order,
    createdAt:
      order.createdAt instanceof Date
        ? order.createdAt
        : new Date(order.createdAt || Date.now()),
    updatedAt:
      order.updatedAt instanceof Date
        ? order.updatedAt
        : new Date(order.updatedAt || Date.now()),
  }));
};

// Cria o store de pedidos com persistência
export const useOrderStore = create<OrderState>()(
  persist(
    (set, get) => ({
      orders: [],

      createOrder: (cartItems, companyId, companySlug, companyName) => {
        const newOrder = createOrderFromCart(
          cartItems,
          companyId,
          companySlug,
          companyName
        );

        set((state) => ({
          orders: [newOrder, ...state.orders],
        }));

        return newOrder;
      },

      updateOrderStatus: (orderId, status) => {
        set((state) => ({
          orders: state.orders.map((order) =>
            order.id === orderId
              ? {
                  ...order,
                  status,
                  updatedAt: new Date(),
                }
              : order
          ),
        }));
      },

      cancelOrder: (orderId) => {
        set((state) => ({
          orders: state.orders.map((order) =>
            order.id === orderId
              ? {
                  ...order,
                  status: OrderStatus.CANCELED,
                  updatedAt: new Date(),
                }
              : order
          ),
        }));
      },

      deleteOrder: (orderId) => {
        set((state) => ({
          orders: state.orders.filter((order) => order.id !== orderId),
        }));
      },

      repeatOrder: (orderId) => {
        const existingOrder = get().getOrderById(orderId);
        if (!existingOrder) return null;

        const newOrder = createOrderFromExisting(existingOrder);

        set((state) => ({
          orders: [newOrder, ...state.orders],
        }));

        return newOrder;
      },

      getOrdersByCompany: (companySlug) => {
        return ensureDateObjects(
          get().orders.filter((order) => order.companySlug === companySlug)
        );
      },

      getOrderById: (orderId) => {
        const order = get().orders.find((order) => order.id === orderId);
        return order ? ensureDateObjects([order])[0] : undefined;
      },

      getOrdersByStatus: (status) => {
        return ensureDateObjects(
          get().orders.filter((order) => order.status === status)
        );
      },

      getAllOrders: () => {
        return ensureDateObjects(get().orders);
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
