// Path: src/features/orders/screens/orders-screen.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import ScreenHeader from "@/components/ui/screen-header";
import { Card, VStack, HStack, Divider } from "@gluestack-ui/themed";
import {
  Clock,
  CheckCircle,
  Truck,
  XCircle,
  AlertCircle,
  ChevronRight,
  Calendar,
  Package,
} from "lucide-react-native";
import { useOrderViewModel } from "../view-models/use-order-view-model";
import { THEME_COLORS } from "@/src/styles/colors";
import { Order, OrderStatus } from "../models/order";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export function OrdersScreen() {
  const { companySlug } = useLocalSearchParams<{ companySlug: string }>();
  const orderViewModel = useOrderViewModel();
  const [orders, setOrders] = useState<Order[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const primaryColor = THEME_COLORS.primary;

  useEffect(() => {
    loadOrders();
  }, [companySlug]);

  const loadOrders = () => {
    if (companySlug) {
      const companyOrders = orderViewModel.getOrdersByCompany(companySlug);
      // Ordenar por data, mais recentes primeiro
      setOrders(
        companyOrders.sort(
          (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
        )
      );
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadOrders();
    setRefreshing(false);
  };

  const handleOrderPress = (orderId: string) => {
    router.push(`/(drawer)/empresa/${companySlug}/orders/${orderId}`);
  };

  const getStatusInfo = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING:
        return {
          label: "Pendente",
          icon: AlertCircle,
          color: "#F59E0B", // Amber
          bgColor: "#FEF3C7",
        };
      case OrderStatus.CONFIRMED:
        return {
          label: "Confirmado",
          icon: CheckCircle,
          color: "#10B981", // Green
          bgColor: "#D1FAE5",
        };
      case OrderStatus.PREPARING:
        return {
          label: "Em preparação",
          icon: Clock,
          color: "#3B82F6", // Blue
          bgColor: "#DBEAFE",
        };
      case OrderStatus.READY_FOR_DELIVERY:
        return {
          label: "Pronto para entrega",
          icon: Package,
          color: "#8B5CF6", // Purple
          bgColor: "#EDE9FE",
        };
      case OrderStatus.IN_TRANSIT:
        return {
          label: "Em trânsito",
          icon: Truck,
          color: "#6366F1", // Indigo
          bgColor: "#E0E7FF",
        };
      case OrderStatus.DELIVERED:
        return {
          label: "Entregue",
          icon: CheckCircle,
          color: "#10B981", // Green
          bgColor: "#D1FAE5",
        };
      case OrderStatus.CANCELED:
        return {
          label: "Cancelado",
          icon: XCircle,
          color: "#EF4444", // Red
          bgColor: "#FEE2E2",
        };
      default:
        return {
          label: "Desconhecido",
          icon: AlertCircle,
          color: "#6B7280", // Gray
          bgColor: "#F3F4F6",
        };
    }
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  const formatDate = (date: Date) => {
    return format(date, "dd 'de' MMMM', às 'HH:mm", { locale: ptBR });
  };

  const renderOrderItem = ({ item }: { item: Order }) => {
    const statusInfo = getStatusInfo(item.status);
    const StatusIcon = statusInfo.icon;

    return (
      <TouchableOpacity
        onPress={() => handleOrderPress(item.id)}
        activeOpacity={0.7}
      >
        <Card className="mb-4 border border-gray-100 overflow-hidden">
          <View
            className="border-l-4 pl-3 py-3 pr-4"
            style={{ borderLeftColor: statusInfo.color }}
          >
            <HStack className="justify-between items-center mb-2">
              <HStack space="sm" alignItems="center">
                <View
                  className="p-1 rounded-full"
                  style={{ backgroundColor: statusInfo.bgColor }}
                >
                  <StatusIcon size={16} color={statusInfo.color} />
                </View>
                <Text className="font-semibold text-gray-800">
                  Pedido #{item.id.replace("order_", "").substring(0, 6)}
                </Text>
              </HStack>

              <Text
                className="text-sm font-medium"
                style={{ color: statusInfo.color }}
              >
                {statusInfo.label}
              </Text>
            </HStack>

            <HStack className="items-center mb-2">
              <Calendar size={14} color="#6B7280" />
              <Text className="text-xs text-gray-500 ml-1">
                {formatDate(item.createdAt)}
              </Text>
            </HStack>

            <HStack className="justify-between items-center">
              <Text className="text-gray-500 text-sm">
                {item.items.length} {item.items.length === 1 ? "item" : "itens"}
              </Text>
              <HStack space="sm" alignItems="center">
                <Text className="font-bold text-gray-800">
                  {formatCurrency(item.total)}
                </Text>
                <ChevronRight size={16} color="#9CA3AF" />
              </HStack>
            </HStack>
          </View>
        </Card>
      </TouchableOpacity>
    );
  };

  return (
    <View className="flex-1 bg-gray-50">
      <ScreenHeader
        title="Meus Pedidos"
        subtitle={companySlug ? `Acompanhe seus pedidos` : undefined}
        showBackButton={true}
        onBackPress={() => router.back()}
      />

      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        renderItem={renderOrderItem}
        contentContainerStyle={{ padding: 16 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        ListEmptyComponent={
          <Card className="p-6 items-center justify-center border border-gray-100">
            <Package size={48} color="#9CA3AF" className="mb-3" />
            <Text className="text-gray-800 font-semibold text-lg mb-2 text-center">
              Nenhum pedido encontrado
            </Text>
            <Text className="text-gray-500 text-center">
              Você ainda não fez nenhum pedido nesta loja.
            </Text>
          </Card>
        }
      />
    </View>
  );
}
