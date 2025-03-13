// Path: src/features/orders/screens/orders-screen.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Alert,
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
  RefreshCw,
} from "lucide-react-native";
import { useOrderViewModel } from "../view-models/use-order-view-model";
import { Order, OrderStatus } from "../models/order";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { THEME_COLORS } from "@/src/styles/colors";
import { SwipeableCard } from "@/components/common/swipeable-card";
import { useMultiCartStore } from "@/src/features/cart/stores/cart.store";
import { useToast } from "@gluestack-ui/themed";
import { toastUtils } from "@/src/utils/toast.utils";

export function OrdersScreen() {
  const { companySlug } = useLocalSearchParams<{ companySlug: string }>();
  const [orders, setOrders] = useState<Order[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const multiCartStore = useMultiCartStore();
  const toast = useToast();

  const primaryColor = THEME_COLORS.primary;

  // Usar o ViewModel atualizado com as novas funcionalidades
  const orderViewModel = useOrderViewModel();

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

  // Handler para deletar um pedido
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
            loadOrders(); // Recarregar a lista
            toastUtils.success(toast, "Pedido removido com sucesso");
          },
        },
      ]
    );
  };

  // Handler para repetir um pedido
  const handleRepeatOrder = (orderId: string) => {
    const newOrder = orderViewModel.repeatOrder(orderId);

    if (newOrder) {
      // Adicionar os itens ao carrinho
      multiCartStore.clearCart(companySlug);
      newOrder.items.forEach((item) => {
        multiCartStore.addItem(companySlug, item);
      });

      // Navegar para o carrinho
      router.push(`/(drawer)/empresa/${companySlug}/cart`);

      // Exibir alerta de sucesso
      toastUtils.success(toast, "Itens adicionados ao carrinho!");
    }
  };

  // Função para obter informações de status
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
    const status = getStatusInfo(item.status);
    // Garantir que todos os componentes existam e sejam funções com as propriedades corretas
    const StatusIcon = status ? status.icon : AlertCircle;

    return (
      <SwipeableCard
        onEdit={() => handleOrderPress(item.id)}
        onDelete={() => handleDeleteOrder(item.id)}
      >
        <View
          className="border-l-4 pl-3 py-3 pr-4"
          style={{ borderLeftColor: status ? status.color : "#6B7280" }}
        >
          <HStack className="justify-between items-center mb-2">
            <HStack space="sm" alignItems="center">
              <View
                className="p-1 rounded-full"
                style={{ backgroundColor: status ? status.bgColor : "#F3F4F6" }}
              >
                <StatusIcon
                  size={16}
                  color={status ? status.color : "#6B7280"}
                />
              </View>
              <Text className="font-semibold text-gray-800">
                Pedido #{item.id.replace("order_", "").substring(0, 6)}
              </Text>
            </HStack>

            <Text
              className="text-sm font-medium"
              style={{ color: status ? status.color : "#6B7280" }}
            >
              {status ? status.label : "Desconhecido"}
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
            </HStack>
          </HStack>

          <Divider className="my-2" />

          <HStack space="md" justifyContent="flex-end">
            <TouchableOpacity
              onPress={() => handleRepeatOrder(item.id)}
              className="flex-row items-center"
            >
              <RefreshCw size={16} color={primaryColor} />
              <Text className="ml-1 text-sm" style={{ color: primaryColor }}>
                Repetir pedido
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handleOrderPress(item.id)}
              className="flex-row items-center"
            >
              <ChevronRight size={16} color="#9CA3AF" />
              <Text className="ml-1 text-sm text-gray-600">Ver detalhes</Text>
            </TouchableOpacity>
          </HStack>
        </View>
      </SwipeableCard>
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
