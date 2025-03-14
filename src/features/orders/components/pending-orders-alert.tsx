// Path: src/features/orders/components/pending-orders-alert.tsx
import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Card, HStack, VStack } from "@gluestack-ui/themed";
import { AlertCircle, ChevronRight, Clock } from "lucide-react-native";
import { useOrderViewModel } from "../view-models/use-order-view-model";
import { Order, OrderStatus } from "../models/order";
import { router } from "expo-router";
import { format, differenceInMinutes } from "date-fns";
import { ptBR } from "date-fns/locale";

export function PendingOrdersAlert() {
  const [pendingOrders, setPendingOrders] = useState<Order[]>([]);
  const { orders } = useOrderViewModel();

  // Filtrar pedidos pendentes na montagem do componente
  useEffect(() => {
    const pending = orders.filter(
      (order) =>
        order.status !== OrderStatus.DELIVERED &&
        order.status !== OrderStatus.CANCELED
    );

    // Ordenar por data mais recente
    pending.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    // Limitar a 3 pedidos pendentes
    setPendingOrders(pending.slice(0, 3));
  }, [orders]);

  // Se não houver pedidos pendentes, não exibir nada
  if (pendingOrders.length === 0) {
    return null;
  }

  // Formatar tempo desde o pedido
  const formatTimeSince = (date: Date) => {
    const minutes = differenceInMinutes(new Date(), date);

    if (minutes < 60) {
      return `${minutes} min atrás`;
    } else if (minutes < 1440) {
      // Menos de 24h
      const hours = Math.floor(minutes / 60);
      return `${hours} h atrás`;
    } else {
      return format(date, "dd/MM", { locale: ptBR });
    }
  };

  // Ir para o pedido
  const goToOrder = (order: Order) => {
    router.push(`/empresa/${order.companySlug}/orders/${order.id}`);
  };

  return (
    <Card className="mx-4 mb-6 bg-yellow-50 border border-yellow-200">
      <View className="p-4">
        <HStack space="sm" alignItems="center" className="mb-2">
          <AlertCircle size={18} color="#F59E0B" />
          <Text className="font-semibold text-yellow-800">
            Pedidos em andamento
          </Text>
        </HStack>

        {pendingOrders.map((order) => (
          <TouchableOpacity
            key={order.id}
            onPress={() => goToOrder(order)}
            className="mt-2 bg-white p-3 rounded-lg border border-yellow-100"
          >
            <HStack className="justify-between items-center">
              <VStack>
                <Text className="font-medium text-gray-800">
                  Pedido em {order.companyName}
                </Text>
                <HStack space="sm" alignItems="center" className="mt-1">
                  <Clock size={14} color="#6B7280" />
                  <Text className="text-xs text-gray-500">
                    {formatTimeSince(order.createdAt)}
                  </Text>
                </HStack>
              </VStack>

              <ChevronRight size={16} color="#6B7280" />
            </HStack>
          </TouchableOpacity>
        ))}
      </View>
    </Card>
  );
}
