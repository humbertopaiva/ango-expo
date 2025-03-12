// Path: src/features/orders/view-models/use-order-view-model.ts
import { useState } from "react";
import { useCartViewModel } from "@/src/features/cart/view-models/use-cart-view-model";
import {
  Order,
  OrderStatus,
  PaymentMethod,
  PaymentStatus,
} from "../models/order";
import { useMultiCartStore } from "@/src/features/cart/stores/cart.store";
import { useLocalSearchParams } from "expo-router";

// Simulação de um serviço de armazenamento de pedidos
// Em um aplicativo real, isso seria substituído por uma chamada de API
class OrderStorageService {
  private static instance: OrderStorageService;
  private orders: Order[] = [];

  private constructor() {}

  public static getInstance(): OrderStorageService {
    if (!OrderStorageService.instance) {
      OrderStorageService.instance = new OrderStorageService();
    }
    return OrderStorageService.instance;
  }

  public getOrders(): Order[] {
    return this.orders;
  }

  public getOrdersByCompanySlug(companySlug: string): Order[] {
    return this.orders.filter((order) => order.companySlug === companySlug);
  }

  public getOrderById(id: string): Order | undefined {
    return this.orders.find((order) => order.id === id);
  }

  public addOrder(order: Order): Order {
    this.orders.push(order);
    return order;
  }

  public updateOrder(updatedOrder: Order): Order {
    const index = this.orders.findIndex(
      (order) => order.id === updatedOrder.id
    );
    if (index !== -1) {
      this.orders[index] = updatedOrder;
    }
    return updatedOrder;
  }
}

export interface OrderViewModel {
  isLoading: boolean;
  orders: Order[];

  // Ações
  placeOrder: (paymentMethod?: PaymentMethod) => Promise<Order | null>;
  getOrdersByCompany: (companySlug: string) => Order[];
  getOrderById: (orderId: string) => Order | undefined;
}

export function useOrderViewModel(): OrderViewModel {
  const [isLoading, setIsLoading] = useState(false);
  const cartViewModel = useCartViewModel();
  const multiCartStore = useMultiCartStore();
  const orderStorage = OrderStorageService.getInstance();
  const { companySlug } = useLocalSearchParams<{ companySlug: string }>();

  // Obter pedidos do storage
  const orders = orderStorage.getOrders();

  // Colocar um novo pedido
  const placeOrder = async (
    paymentMethod: PaymentMethod = PaymentMethod.CREDIT_CARD
  ): Promise<Order | null> => {
    if (cartViewModel.isEmpty || !companySlug) return null;

    setIsLoading(true);

    try {
      // Simulação de processamento de pedido
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Criar um novo pedido com os itens do carrinho
      const newOrder: Order = {
        id: `order_${Date.now()}`,
        companyId: cartViewModel.items[0]?.companyId || "",
        companySlug: companySlug,
        companyName: cartViewModel.companyName || "",
        customerName: "Cliente", // Em um app real, isso viria de um serviço de autenticação
        items: [...cartViewModel.items],
        subtotal: parseFloat(
          cartViewModel.subtotal.replace(/[^\d,]/g, "").replace(",", ".")
        ),
        total: parseFloat(
          cartViewModel.total.replace(/[^\d,]/g, "").replace(",", ".")
        ),
        status: OrderStatus.PENDING,
        payment: {
          method: paymentMethod,
          status: PaymentStatus.PENDING,
        },
        createdAt: new Date(),
        updatedAt: new Date(),
        estimatedDeliveryTime: 45, // 45 minutos de estimativa padrão
      };

      // Salvar o pedido
      const savedOrder = orderStorage.addOrder(newOrder);

      // Limpar o carrinho específico após finalizar o pedido
      multiCartStore.clearCart(companySlug);

      return savedOrder;
    } catch (error) {
      console.error("Erro ao finalizar pedido:", error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Obter pedidos por empresa
  const getOrdersByCompany = (companySlug: string): Order[] => {
    return orderStorage.getOrdersByCompanySlug(companySlug);
  };

  // Obter pedido por ID
  const getOrderById = (orderId: string): Order | undefined => {
    return orderStorage.getOrderById(orderId);
  };

  return {
    isLoading,
    orders,
    placeOrder,
    getOrdersByCompany,
    getOrderById,
  };
}
