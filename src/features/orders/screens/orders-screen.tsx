// Path: src/features/orders/screens/orders-screen.tsx
import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import {
  Package,
  Clock,
  Check,
  Truck,
  AlertCircle,
  RefreshCw,
} from "lucide-react-native";
import ScreenHeader from "@/components/ui/screen-header";
import {
  Card,
  VStack,
  HStack,
  Select,
  SelectTrigger,
  SelectInput,
  SelectContent,
  SelectItem,
} from "@gluestack-ui/themed";
import { THEME_COLORS } from "@/src/styles/colors";
import { useOrderViewModel } from "../view-models/use-order-view-model";
import { Order, OrderStatus } from "../models/order";

export function OrdersScreen() {
  const { companySlug } = useLocalSearchParams<{ companySlug: string }>();
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const orderViewModel = useOrderViewModel();
  const [orders, setOrders] = useState<Order[]>([]);

  // Carrega os pedidos da empresa específica
  useEffect(() => {
    if (companySlug) {
      const companyOrders = orderViewModel.ordersByCompany(companySlug);
      setOrders(companyOrders);
    }
  }, [companySlug, orderViewModel.orders]);

  // Filtra os pedidos conforme selecionado
  const filteredOrders =
    filterStatus === "all"
      ? orders
      : orders.filter((order) => order.status === filterStatus);

  // Botão para retornar à página da empresa
  const handleBackToCompany = () => {
    router.push(`/(drawer)/empresa/${companySlug}`);
  };

  // Renderiza ícone de status conforme o estado do pedido
  const renderStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case "pending":
        return <Clock size={16} color="#F59E0B" />;
      case "preparing":
        return <Package size={16} color="#3B82F6" />;
      case "shipping":
        return <Truck size={16} color="#8B5CF6" />;
      case "delivered":
        return <Check size={16} color="#10B981" />;
      case "canceled":
        return <AlertCircle size={16} color="#EF4444" />;
      default:
        return <Clock size={16} color="#6B7280" />;
    }
  };

  // Texto de status conforme o estado do pedido
  const getStatusText = orderViewModel.getStatusText;

  // Cor de status conforme o estado do pedido
  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case "pending":
        return { bg: "bg-amber-100", text: "text-amber-700" };
      case "preparing":
        return { bg: "bg-blue-100", text: "text-blue-700" };
      case "shipping":
        return { bg: "bg-purple-100", text: "text-purple-700" };
      case "delivered":
        return { bg: "bg-green-100", text: "text-green-700" };
      case "canceled":
        return { bg: "bg-red-100", text: "text-red-700" };
      default:
        return { bg: "bg-gray-100", text: "text-gray-700" };
    }
  };

  return (
    <View className="flex-1 bg-background">
      {/* Cabeçalho com título e botão de voltar */}
      <ScreenHeader
        title="Meus Pedidos"
        subtitle="Acompanhe seus pedidos realizados"
        showBackButton={true}
        onBackPress={handleBackToCompany}
      />

      <View className="px-4 py-2">
        {/* Filtro de status */}
        <Select
          defaultValue="all"
          onValueChange={(value) => setFilterStatus(value)}
        >
          <SelectTrigger className="bg-white border border-gray-200 rounded-lg h-10">
            <SelectInput
              placeholder="Filtrar por status"
              className="text-gray-800"
            />
          </SelectTrigger>
          <SelectContent>
            <SelectItem label="Todos os pedidos" value="all" />
            <SelectItem label="Aguardando confirmação" value="pending" />
            <SelectItem label="Em preparação" value="preparing" />
            <SelectItem label="Em entrega" value="shipping" />
            <SelectItem label="Entregue" value="delivered" />
            <SelectItem label="Cancelado" value="canceled" />
          </SelectContent>
        </Select>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
      >
        {filteredOrders.length === 0 ? (
          // Exibe mensagem quando não há pedidos
          <Card className="p-8 items-center justify-center border border-gray-200">
            <Package size={64} color="#9CA3AF" className="mb-4" />
            <Text className="text-lg font-semibold text-gray-800 mb-2 text-center">
              Você ainda não tem pedidos
            </Text>
            <Text className="text-gray-500 text-center mb-6">
              Seus pedidos aparecerão aqui quando você fizer compras
            </Text>
            <TouchableOpacity
              onPress={handleBackToCompany}
              className="bg-primary-500 px-4 py-2 rounded-lg"
            >
              <Text className="text-white font-medium">Ver Produtos</Text>
            </TouchableOpacity>
          </Card>
        ) : (
          // Lista de pedidos
          <VStack space="md">
            {filteredOrders.map((order) => {
              const statusStyle = getStatusColor(order.status);
              const orderDate = new Date(order.createdAt).toLocaleString(
                "pt-BR",
                {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                }
              );

              return (
                <Card key={order.id} className="p-4 border border-gray-200">
                  <VStack space="sm">
                    {/* Cabeçalho do pedido */}
                    <HStack className="justify-between items-center">
                      <Text className="font-semibold text-gray-800">
                        Pedido #{order.id}
                      </Text>
                      <Text className="text-gray-500 text-sm">{orderDate}</Text>
                    </HStack>

                    {/* Status do pedido */}
                    <View
                      className={`flex-row items-center py-1 px-3 self-start rounded-full ${statusStyle.bg}`}
                    >
                      {renderStatusIcon(order.status)}
                      <Text
                        className={`${statusStyle.text} ml-1 font-medium text-sm`}
                      >
                        {getStatusText(order.status)}
                      </Text>
                    </View>

                    {/* Itens do pedido */}
                    <View className="bg-gray-50 p-3 rounded-lg">
                      <Text className="font-medium mb-2">Itens do pedido:</Text>
                      {order.items.map((item) => (
                        <HStack key={item.id} className="justify-between mb-1">
                          <Text className="text-gray-700">
                            {item.quantity}x {item.name}
                          </Text>
                          <Text className="text-gray-700">
                            {item.priceFormatted}
                          </Text>
                        </HStack>
                      ))}
                    </View>

                    {/* Total do pedido */}
                    <HStack className="justify-between border-t border-gray-200 pt-2">
                      <Text className="font-medium">Total</Text>
                      <Text className="font-bold">{order.totalFormatted}</Text>
                    </HStack>

                    {/* Botões de ação */}
                    <HStack className="justify-end space-x-2 mt-2">
                      {order.status === "pending" && (
                        <TouchableOpacity
                          className="px-4 py-2 bg-red-50 rounded-lg"
                          onPress={() => orderViewModel.cancelOrder(order.id)}
                        >
                          <Text className="text-red-700">Cancelar</Text>
                        </TouchableOpacity>
                      )}

                      <TouchableOpacity className="px-4 py-2 bg-gray-100 rounded-lg">
                        <Text className="text-gray-700">Ver Detalhes</Text>
                      </TouchableOpacity>

                      {order.status === "delivered" && (
                        <TouchableOpacity className="px-4 py-2 bg-primary-50 rounded-lg">
                          <Text className="text-primary-700">
                            Pedir Novamente
                          </Text>
                        </TouchableOpacity>
                      )}
                    </HStack>
                  </VStack>
                </Card>
              );
            })}
          </VStack>
        )}
      </ScrollView>
    </View>
  );
}
