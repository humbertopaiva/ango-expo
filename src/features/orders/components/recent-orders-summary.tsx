// Path: src/features/orders/components/recent-orders-summary.tsx
import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, FlatList } from "react-native";
import { Card, HStack, VStack } from "@gluestack-ui/themed";
import { Clock, ChevronRight, Package, ShoppingBag } from "lucide-react-native";
import { Order, OrderStatus } from "../models/order";
import { useOrderViewModel } from "../view-models/use-order-view-model";
import { router } from "expo-router";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { THEME_COLORS } from "@/src/styles/colors";

export function RecentOrdersSummary() {
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const { orders } = useOrderViewModel();
  const primaryColor = THEME_COLORS.primary;

  // Carregar pedidos recentes na montagem do componente
  useEffect(() => {
    // Ordenar por data mais recente e pegar os 5 mais recentes
    const recent = [...orders]
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, 5);
    setRecentOrders(recent);
  }, [orders]);

  // Formatação de data
  const formatDate = (date: Date) => {
    return format(date, "dd/MM/yyyy • HH:mm", { locale: ptBR });
  };

  // Formatar valor monetário
  const formatCurrency = (value: number) => {
    return value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  // Navegar para detalhes do pedido
  const goToOrderDetails = (order: Order) => {
    router.push(`/(drawer)/empresa/${order.companySlug}/orders/${order.id}`);
  };

  // Navegar para a lista completa de pedidos
  const seeAllOrders = () => {
    if (recentOrders.length > 0) {
      // Navegar para a lista de pedidos da empresa do pedido mais recente
      router.push(`/(drawer)/empresa/${recentOrders[0].companySlug}/orders`);
    }
  };

  // Se não houver pedidos, não exibir nada
  if (recentOrders.length === 0) {
    return null;
  }

  return (
    <Card className="mx-4 mb-6 border border-gray-100">
      <HStack className="p-4 border-b border-gray-100 justify-between items-center">
        <Text className="font-semibold text-gray-800 text-lg">
          Seus Pedidos
        </Text>

        <TouchableOpacity
          onPress={seeAllOrders}
          className="flex-row items-center"
        >
          <Text
            className="mr-1 text-sm font-medium"
            style={{ color: primaryColor }}
          >
            Ver todos
          </Text>
          <ChevronRight size={16} color={primaryColor} />
        </TouchableOpacity>
      </HStack>

      <FlatList
        data={recentOrders}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => goToOrderDetails(item)}
            className="p-4 border-b border-gray-100"
          >
            <HStack className="justify-between">
              <HStack space="sm" className="items-start flex-1">
                <View className="bg-gray-100 p-2 rounded-full mt-1">
                  <ShoppingBag size={16} color="#6B7280" />
                </View>

                <VStack className="flex-1">
                  <Text className="font-medium text-gray-800">
                    Pedido em {item.companyName}
                  </Text>
                  <Text className="text-xs text-gray-500">
                    {formatDate(item.createdAt)}
                  </Text>
                  <HStack className="mt-1">
                    <View
                      className="px-2 py-1 rounded-full mt-1"
                      style={{
                        backgroundColor:
                          item.status === OrderStatus.DELIVERED
                            ? "#D1FAE5"
                            : item.status === OrderStatus.CANCELED
                            ? "#FEE2E2"
                            : "#DBEAFE",
                      }}
                    >
                      <Text
                        className="text-xs"
                        style={{
                          color:
                            item.status === OrderStatus.DELIVERED
                              ? "#059669"
                              : item.status === OrderStatus.CANCELED
                              ? "#DC2626"
                              : "#3B82F6",
                        }}
                      >
                        {item.status === OrderStatus.DELIVERED
                          ? "Entregue"
                          : item.status === OrderStatus.CANCELED
                          ? "Cancelado"
                          : "Em andamento"}
                      </Text>
                    </View>
                  </HStack>
                </VStack>
              </HStack>

              <Text className="font-bold text-gray-800">
                {formatCurrency(item.total)}
              </Text>
            </HStack>
          </TouchableOpacity>
        )}
      />
    </Card>
  );
}
