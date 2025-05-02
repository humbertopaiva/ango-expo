// Path: src/features/orders/screens/all-orders-screen.tsx

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from "react-native";
import { router } from "expo-router";
import ScreenHeader from "@/components/ui/screen-header";
import { Card, VStack, HStack, useToast } from "@gluestack-ui/themed";
import {
  ChevronRight,
  Package,
  Store,
  Calendar,
  ShoppingBag,
  Trash2,
  MessageSquare,
} from "lucide-react-native";
import { useOrderViewModel } from "../view-models/use-order-view-model";
import { Order } from "../models/order";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { THEME_COLORS } from "@/src/styles/colors";
import { SwipeableCard } from "@/components/common/swipeable-card";
import { toastUtils } from "@/src/utils/toast.utils";

export function AllOrdersScreen() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const toast = useToast();

  const primaryColor = THEME_COLORS.primary;

  // ViewModel para obter os dados
  const orderViewModel = useOrderViewModel();

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = () => {
    // Buscar apenas os últimos 10 pedidos
    const allOrders = orderViewModel.getAllOrders(10);
    setOrders(allOrders);
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadOrders();
    setRefreshing(false);
  };

  const handleOrderPress = (order: Order) => {
    router.push(`/(drawer)/empresa/${order.companySlug}/orders/${order.id}`);
  };

  const handleDeleteOrder = (orderId: string) => {
    Alert.alert(
      "Deletar Pedido",
      "Tem certeza que deseja remover este pedido do histórico?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Deletar",
          style: "destructive",
          onPress: () => {
            orderViewModel.deleteOrder(orderId);
            loadOrders();
            toastUtils.success(toast, "Pedido removido com sucesso");
          },
        },
      ]
    );
  };

  const handleClearAllOrders = () => {
    if (orders.length === 0) return;

    Alert.alert(
      "Limpar Histórico",
      "Tem certeza que deseja limpar todo o histórico de pedidos?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Limpar",
          style: "destructive",
          onPress: () => {
            orderViewModel.clearAllOrders();
            setOrders([]);
            toastUtils.success(toast, "Histórico de pedidos limpo");
          },
        },
      ]
    );
  };

  const handleContactCompany = async (orderId: string) => {
    const order = orderViewModel.getOrderById(orderId);

    if (order && order.companyPhone) {
      const success = await orderViewModel.contactCompany(
        order.companyPhone,
        orderId
      );

      if (!success) {
        Alert.alert(
          "Erro ao abrir WhatsApp",
          "Não foi possível abrir o WhatsApp. Verifique se o aplicativo está instalado."
        );
      }
    } else {
      Alert.alert(
        "Informação não disponível",
        "Não foi possível encontrar o contato da empresa."
      );
    }
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  const formatDate = (date: Date) => {
    return format(new Date(date), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
  };

  const renderOrderItem = ({ item }: { item: Order }) => {
    return (
      <SwipeableCard
        onEdit={() => handleOrderPress(item)}
        onDelete={() => handleDeleteOrder(item.id)}
      >
        <View className="p-4 border-l-4 border-primary-500">
          <HStack className="items-center justify-between mb-2">
            <HStack className="items-center gap-2">
              <View className="bg-primary-50 p-2 rounded-full">
                <Store size={18} color={primaryColor} />
              </View>
              <VStack>
                <Text className="font-semibold text-gray-800">
                  {item.companyName}
                </Text>
                <HStack className="items-center mt-1">
                  <Calendar size={12} color="#6B7280" />
                  <Text className="text-xs text-gray-500 ml-1">
                    {formatDate(item.createdAt)}
                  </Text>
                </HStack>
              </VStack>
            </HStack>
            <Text className="font-bold text-gray-800">
              {formatCurrency(item.total)}
            </Text>
          </HStack>

          <Text className="text-gray-600 text-sm mt-2">
            <Text className="font-medium">
              Pedido #{item.id.replace("order_", "").substring(0, 6)}
            </Text>{" "}
            •{item.items.length} {item.items.length === 1 ? "item" : "itens"}
          </Text>

          <HStack className="justify-end gap-4 mt-3">
            <TouchableOpacity
              onPress={() => handleContactCompany(item.id)}
              className="flex-row items-center"
            >
              <MessageSquare size={16} color={primaryColor} />
              <Text className="ml-1 text-sm" style={{ color: primaryColor }}>
                Falar
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handleOrderPress(item)}
              className="flex-row items-center"
            >
              <ChevronRight size={16} color="#9CA3AF" />
              <Text className="ml-1 text-sm text-gray-600">Detalhes</Text>
            </TouchableOpacity>
          </HStack>
        </View>
      </SwipeableCard>
    );
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* <ScreenHeader
        title="Todos os Pedidos"
        subtitle={`${
          orders.length > 0
            ? `${orders.length} últimos pedidos`
            : "Histórico de pedidos"
        }`}
        showBackButton={true}
        onBackPress={() => router.back()}
        rightContent={
          orders.length > 0 ? (
            <TouchableOpacity onPress={handleClearAllOrders} className="p-2">
              <Trash2 size={20} color="#EF4444" />
            </TouchableOpacity>
          ) : undefined
        }
      /> */}

      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        renderItem={renderOrderItem}
        contentContainerStyle={{ padding: 16 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        ItemSeparatorComponent={() => <View className="h-3" />}
        ListEmptyComponent={
          <Card className="p-6 items-center justify-center border border-gray-100">
            <Package size={48} color="#9CA3AF" className="mb-3" />
            <Text className="text-gray-800 font-semibold text-lg mb-2 text-center">
              Nenhum pedido encontrado
            </Text>
            <Text className="text-gray-500 text-center">
              Você ainda não fez nenhum pedido.
            </Text>
          </Card>
        }
      />
    </View>
  );
}
