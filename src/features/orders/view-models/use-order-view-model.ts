// Path: src/features/orders/view-models/use-order-view-model.ts
import { useOrderStore } from "../stores/order.store";
import { useCartStore } from "@/src/features/cart/stores/cart.store";
import { Order, OrderStatus } from "../models/order";

export interface OrderViewModel {
  // Estado
  orders: Order[];
  hasOrders: boolean;

  // Filtragem
  ordersByCompany: (companySlug: string) => Order[];
  ordersByStatus: (status: OrderStatus) => Order[];

  // Ações
  placeOrder: () => Promise<Order | null>;
  cancelOrder: (orderId: string) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;

  // Helpers
  getOrderById: (orderId: string) => Order | undefined;
  getStatusText: (status: OrderStatus) => string;
}

/**
 * Hook que fornece a lógica de negócios para os pedidos
 * Segue o padrão MVVM para separar a lógica da UI
 */
export function useOrderViewModel(): OrderViewModel {
  const orderStore = useOrderStore();
  const cartStore = useCartStore();

  // Verifica se há pedidos
  const hasOrders = orderStore.orders.length > 0;

  // Finaliza um pedido
  const placeOrder = async (): Promise<Order | null> => {
    try {
      // Verificar se há itens no carrinho
      if (cartStore.items.length === 0) {
        console.log("Não é possível finalizar pedido: carrinho vazio");
        return null;
      }

      // Verificar se há informações da empresa
      if (
        !cartStore.companyId ||
        !cartStore.companySlug ||
        !cartStore.companyName
      ) {
        console.log(
          "Não é possível finalizar pedido: informações da empresa faltando"
        );
        return null;
      }

      // Criar o pedido
      const newOrder = orderStore.createOrder(
        cartStore.items,
        cartStore.companyId,
        cartStore.companySlug,
        cartStore.companyName
      );

      // Limpar o carrinho
      cartStore.clearCart();

      return newOrder;
    } catch (error) {
      console.error("Erro ao finalizar pedido:", error);
      return null;
    }
  };

  // Retorna o texto legível do status
  const getStatusText = (status: OrderStatus): string => {
    switch (status) {
      case "pending":
        return "Aguardando confirmação";
      case "preparing":
        return "Em preparação";
      case "shipping":
        return "Em entrega";
      case "delivered":
        return "Entregue";
      case "canceled":
        return "Cancelado";
      default:
        return "Status desconhecido";
    }
  };

  return {
    orders: orderStore.orders,
    hasOrders,

    ordersByCompany: orderStore.getOrdersByCompany,
    ordersByStatus: orderStore.getOrdersByStatus,

    placeOrder,
    cancelOrder: orderStore.cancelOrder,
    updateOrderStatus: orderStore.updateOrderStatus,

    getOrderById: orderStore.getOrderById,
    getStatusText,
  };
}
