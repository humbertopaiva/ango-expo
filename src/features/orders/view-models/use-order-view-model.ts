// Path: src/features/orders/view-models/use-order-view-model.ts
// Atualizar o arquivo existente com a funcionalidade de repetir e deletar pedidos

import { useState } from "react";
import { useOrderStore } from "../stores/order.store";
import {
  Order,
  OrderStatus,
  PaymentMethod,
  PaymentStatus,
} from "../models/order";
import { useLocalSearchParams } from "expo-router";

export interface OrderViewModel {
  isLoading: boolean;
  orders: Order[];

  // Ações
  getOrdersByCompany: (companySlug: string) => Order[];
  getOrderById: (orderId: string) => Order | undefined;
  deleteOrder: (orderId: string) => void;
  repeatOrder: (orderId: string) => Order | null;
  cancelOrder: (orderId: string) => void;
}

export function useOrderViewModel(): OrderViewModel {
  const [isLoading, setIsLoading] = useState(false);
  const orderStore = useOrderStore();
  const { companySlug } = useLocalSearchParams<{ companySlug: string }>();

  // Obter pedidos
  const getOrdersByCompany = (companySlug: string): Order[] => {
    return orderStore.getOrdersByCompany(companySlug);
  };

  // Obter pedido por ID
  const getOrderById = (orderId: string): Order | undefined => {
    return orderStore.getOrderById(orderId);
  };

  // Deletar pedido
  const deleteOrder = (orderId: string): void => {
    orderStore.deleteOrder(orderId);
  };

  // Repetir pedido
  const repeatOrder = (orderId: string): Order | null => {
    return orderStore.repeatOrder(orderId);
  };

  // Cancelar pedido
  const cancelOrder = (orderId: string): void => {
    orderStore.cancelOrder(orderId);
  };

  return {
    isLoading,
    orders: orderStore.getAllOrders(),
    getOrdersByCompany,
    getOrderById,
    deleteOrder,
    repeatOrder,
    cancelOrder,
  };
}
