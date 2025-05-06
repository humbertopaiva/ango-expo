// Path: src/features/orders/view-models/use-order-view-model.ts

import { useState } from "react";
import { useOrderStore } from "../stores/order.store";
import { Order } from "../models/order";
import { useLocalSearchParams } from "expo-router";
import { Linking } from "react-native";

export interface OrderViewModel {
  isLoading: boolean;
  orders: Order[];

  // Ações para obter pedidos
  getOrdersByCompany: (companySlug: string, limit?: number) => Order[];
  getOrderById: (orderId: string) => Order | undefined;
  getAllOrders: (limit?: number) => Order[];

  // Método para obter pedidos em sequência (do mais recente para o mais antigo)
  getOrdersInSequence: (companySlug?: string, limit?: number) => Order[];

  // Ações para manipular pedidos
  deleteOrder: (orderId: string) => void;
  clearAllOrders: () => void;
  clearCompanyOrders: (companySlug: string) => void;
  contactCompany: (companyPhone: string, orderId: string) => Promise<boolean>;
}

export function useOrderViewModel(): OrderViewModel {
  const [isLoading, setIsLoading] = useState(false);
  const orderStore = useOrderStore();
  const { companySlug } = useLocalSearchParams<{ companySlug: string }>();

  // Obter pedidos de uma empresa específica
  const getOrdersByCompany = (companySlug: string, limit?: number): Order[] => {
    return orderStore.getOrdersByCompany(companySlug, limit);
  };

  // Obter pedido por ID
  const getOrderById = (orderId: string): Order | undefined => {
    return orderStore.getOrderById(orderId);
  };

  // Obter todos os pedidos
  const getAllOrders = (limit?: number): Order[] => {
    return orderStore.getAllOrders(limit);
  };

  // Método para obter pedidos em sequência (do mais recente para o mais antigo)
  const getOrdersInSequence = (
    companySlug?: string,
    limit?: number
  ): Order[] => {
    const allOrders = companySlug
      ? orderStore.getOrdersByCompany(companySlug, limit)
      : orderStore.getAllOrders(limit);

    // Ordenar por data (mais recentes primeiro)
    return [...allOrders].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  };

  // Deletar pedido
  const deleteOrder = (orderId: string): void => {
    orderStore.deleteOrder(orderId);
  };

  // Limpar todos os pedidos
  const clearAllOrders = (): void => {
    orderStore.clearAllOrders();
  };

  // Limpar pedidos de uma empresa específica
  const clearCompanyOrders = (companySlug: string): void => {
    orderStore.clearCompanyOrders(companySlug);
  };

  // Contatar a empresa via WhatsApp
  const contactCompany = async (
    companyPhone: string,
    orderId: string
  ): Promise<boolean> => {
    try {
      // Se o número não começar com +, adicionar código do Brasil
      if (!companyPhone.startsWith("+")) {
        companyPhone = `+55${companyPhone.replace(/\D/g, "")}`;
      }

      const order = getOrderById(orderId);
      let message = "";

      if (order) {
        // Usar o ID do pedido para criar uma referência simples
        // Não precisamos mais do substring random para o número do pedido
        const orderReferenceId = orderId.replace("order_", "");

        // Formatar mensagem com detalhes do pedido
        message = `Olá! Gostaria de falar sobre meu pedido #${orderReferenceId} feito em ${new Date(
          order.createdAt
        ).toLocaleDateString()}`;
      } else {
        message = "Olá! Gostaria de falar sobre meu pedido.";
      }

      const whatsappUrl = `https://wa.me/${companyPhone}?text=${encodeURIComponent(
        message
      )}`;
      const canOpen = await Linking.canOpenURL(whatsappUrl);

      if (canOpen) {
        await Linking.openURL(whatsappUrl);
        return true;
      } else {
        console.error("Não foi possível abrir o WhatsApp");
        return false;
      }
    } catch (error) {
      console.error("Erro ao contatar empresa:", error);
      return false;
    }
  };

  return {
    isLoading,
    orders: orderStore.getAllOrders(),
    getOrdersByCompany,
    getOrderById,
    getAllOrders,
    getOrdersInSequence,
    deleteOrder,
    clearAllOrders,
    clearCompanyOrders,
    contactCompany,
  };
}
