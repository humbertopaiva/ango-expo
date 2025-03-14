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
  OrderPaymentInfo,
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
  if (!orders) return [];

  return orders
    .map((order) => {
      if (!order) return order as Order;

      try {
        // Garantir que payment nunca será undefined
        const paymentInfo: OrderPaymentInfo = order.payment || {
          method: PaymentMethod.CREDIT_CARD, // Valor padrão
          status: PaymentStatus.PENDING, // Valor padrão
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
        // Em caso de erro, retornar o objeto original garantindo o tipo correto
        return order;
      }
    })
    .filter((order): order is Order => Boolean(order)); // Type guard para garantir que é Order
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
