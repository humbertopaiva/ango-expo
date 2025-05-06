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
import { Card, VStack, HStack, Divider, useToast } from "@gluestack-ui/themed";
import {
  Clock,
  ShoppingBag,
  ChevronRight,
  Calendar,
  Package,
  Trash2,
  Home,
  MessageSquare,
} from "lucide-react-native";
import { useOrderViewModel } from "../view-models/use-order-view-model";
import { Order } from "../models/order";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { THEME_COLORS } from "@/src/styles/colors";
import { SwipeableCard } from "@/components/common/swipeable-card";
import { useMultiCartStore } from "@/src/features/cart/stores/cart.store";
import { toastUtils } from "@/src/utils/toast.utils";

export function OrdersScreen() {
  const { companySlug } = useLocalSearchParams<{ companySlug: string }>();
  const [orders, setOrders] = useState<Order[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const toast = useToast();

  const primaryColor = THEME_COLORS.primary;

  // Usar o ViewModel
  const orderViewModel = useOrderViewModel();

  useEffect(() => {
    loadOrders();
  }, [companySlug]);

  const loadOrders = () => {
    if (companySlug) {
      const companyOrders = orderViewModel.getOrdersByCompany(companySlug);
      setOrders(companyOrders);
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

  // Handler para limpar todos os pedidos da empresa
  const handleClearAllOrders = () => {
    if (orders.length === 0) return;

    Alert.alert(
      "Limpar Histórico",
      "Tem certeza que deseja limpar todo o histórico de pedidos desta empresa?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Limpar",
          style: "destructive",
          onPress: () => {
            orderViewModel.clearCompanyOrders(companySlug);
            setOrders([]);
            toastUtils.success(toast, "Histórico de pedidos limpo");
          },
        },
      ]
    );
  };

  // Retornar para a tela principal da empresa
  const handleReturnToCompanyHome = () => {
    router.push(`/(drawer)/empresa/${companySlug}`);
  };

  // Contatar a empresa via WhatsApp
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
    return format(date, "dd 'de' MMMM, yyyy 'às' HH:mm", { locale: ptBR });
  };

  // Renderizar item de pedido simplificado conforme solicitação
  const renderOrderItem = ({ item, index }: { item: Order; index: number }) => {
    // Usar o índice + 1 como número do pedido para sequência não aleatória
    const orderNumber = index + 1;

    return (
      <SwipeableCard
        onEdit={() => handleOrderPress(item.id)}
        onDelete={() => handleDeleteOrder(item.id)}
      >
        <View
          className="border-l-4 pl-3 py-3 pr-4"
          style={{ borderLeftColor: primaryColor }}
        >
          <HStack className="justify-between items-center mb-2">
            <HStack space="sm" alignItems="center">
              <View className="p-1 rounded-full bg-primary-50">
                <ShoppingBag size={16} color={primaryColor} />
              </View>
              <Text className="font-semibold text-gray-800">
                Pedido #{orderNumber}
              </Text>
            </HStack>

            <Text className="text-sm font-medium text-primary-500">
              {formatCurrency(item.total)}
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
          </HStack>

          <Divider className="my-2" />

          <HStack space="md" justifyContent="flex-end">
            <TouchableOpacity
              onPress={() => handleContactCompany(item.id)}
              className="flex-row items-center"
            >
              <MessageSquare size={16} color={primaryColor} />
              <Text className="ml-1 text-sm" style={{ color: primaryColor }}>
                Falar com a loja
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
        subtitle={
          companySlug ? `${orders.length} pedidos realizados` : undefined
        }
        showBackButton={true}
        onBackPress={() => router.back()}
        rightContent={
          orders.length > 0 ? (
            <TouchableOpacity onPress={handleClearAllOrders} className="p-2">
              <Trash2 size={20} color="#EF4444" />
            </TouchableOpacity>
          ) : undefined
        }
      />

      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        renderItem={renderOrderItem}
        contentContainerStyle={{ padding: 16, paddingBottom: 88 }} // Adicionar espaço para botão ao final
        showsVerticalScrollIndicator={true} // Garantir que o scroll vertical esteja visível
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

      {/* Botão Voltar para Home ao final da tela */}
      <View className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200">
        <TouchableOpacity
          onPress={handleReturnToCompanyHome}
          className="py-3 rounded-lg flex-row justify-center items-center"
          style={{ backgroundColor: primaryColor }}
        >
          <Home size={18} color="white" className="mr-2" />
          <Text className="text-white font-medium">
            Voltar para o perfil da empresa
          </Text>
        </TouchableOpacity>

        {orders.length > 0 && (
          <TouchableOpacity
            onPress={handleClearAllOrders}
            className="py-3 mt-2 rounded-lg border border-red-500 flex-row justify-center items-center"
          >
            <Trash2 size={18} color="#EF4444" className="mr-2" />
            <Text className="text-red-500 font-medium">Limpar Pedidos</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
