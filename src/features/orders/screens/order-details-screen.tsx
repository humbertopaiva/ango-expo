// Path: src/features/orders/screens/order-details-screen.tsx
import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import ScreenHeader from "@/components/ui/screen-header";
import { Card, VStack, HStack, Divider } from "@gluestack-ui/themed";
import {
  Clock,
  CheckCircle,
  Truck,
  XCircle,
  AlertCircle,
  Package,
  MapPin,
  CreditCard,
  MessageSquare,
  Phone,
  RefreshCw,
} from "lucide-react-native";
import { useOrderViewModel } from "../view-models/use-order-view-model";
import { THEME_COLORS } from "@/src/styles/colors";
import { Order, OrderStatus, PaymentMethod } from "../models/order";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ImagePreview } from "@/components/custom/image-preview";
import { useMultiCartStore } from "../../cart/stores/cart.store";
import { toastUtils } from "@/src/utils/toast.utils";

export function OrderDetailsScreen() {
  const { orderId, companySlug } = useLocalSearchParams<{
    orderId: string;
    companySlug: string;
  }>();

  const orderViewModel = useOrderViewModel();
  const [order, setOrder] = useState<Order | null>(null);

  const multiCartStore = useMultiCartStore();

  const primaryColor = THEME_COLORS.primary;

  useEffect(() => {
    if (orderId) {
      const foundOrder = orderViewModel.getOrderById(orderId);
      if (foundOrder) {
        setOrder(foundOrder);
      } else {
        // Se o pedido não for encontrado, voltar para a lista de pedidos
        router.back();
      }
    }
  }, [orderId]);

  if (!order) {
    return (
      <View className="flex-1 bg-gray-50 justify-center items-center">
        <Text>Carregando detalhes do pedido...</Text>
      </View>
    );
  }

  const handleRepeatOrder = () => {
    // Adicionar itens ao carrinho
    multiCartStore.clearCart(companySlug);
    order.items.forEach((item) => {
      multiCartStore.addItem(companySlug, item);
    });

    // Navegar para o carrinho
    router.push(`/(drawer)/empresa/${companySlug}/cart`);
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

  const getPaymentMethodInfo = (method: PaymentMethod) => {
    switch (method) {
      case PaymentMethod.CREDIT_CARD:
        return {
          label: "Cartão de Crédito",
          icon: CreditCard,
        };
      case PaymentMethod.DEBIT_CARD:
        return {
          label: "Cartão de Débito",
          icon: CreditCard,
        };
      case PaymentMethod.PIX:
        return {
          label: "PIX",
          icon: CreditCard,
        };
      case PaymentMethod.CASH:
        return {
          label: "Dinheiro",
          icon: CreditCard,
        };
      default:
        return {
          label: "Método desconhecido",
          icon: AlertCircle,
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
    return format(date, "dd 'de' MMMM, yyyy 'às' HH:mm", { locale: ptBR });
  };

  const statusInfo = getStatusInfo(order.status);
  const StatusIcon = statusInfo.icon;
  const paymentInfo = getPaymentMethodInfo(order.payment.method);
  const PaymentIcon = paymentInfo.icon;

  return (
    <View className="flex-1 bg-gray-50">
      <ScreenHeader
        title={`Pedido #${order.id.replace("order_", "").substring(0, 6)}`}
        subtitle={statusInfo.label}
        showBackButton={true}
        onBackPress={() => router.back()}
      />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 16 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Status do Pedido */}
        <Card className="mb-4 border border-gray-100">
          <View
            className="py-4 px-4 rounded-t-lg"
            style={{ backgroundColor: statusInfo.bgColor }}
          >
            <HStack className="items-center">
              <View className="w-12 h-12 rounded-full items-center justify-center bg-white">
                <StatusIcon size={24} color={statusInfo.color} />
              </View>

              <VStack className="ml-3">
                <Text
                  className="font-bold text-base"
                  style={{ color: statusInfo.color }}
                >
                  {statusInfo.label}
                </Text>
                <Text className="text-sm" style={{ color: statusInfo.color }}>
                  {order.status === OrderStatus.PENDING &&
                    "Aguardando confirmação"}
                  {order.status === OrderStatus.CONFIRMED &&
                    "Pedido confirmado"}
                  {order.status === OrderStatus.PREPARING && "Sendo preparado"}
                  {order.status === OrderStatus.READY_FOR_DELIVERY &&
                    "Pronto para entrega"}
                  {order.status === OrderStatus.IN_TRANSIT && "A caminho"}
                  {order.status === OrderStatus.DELIVERED &&
                    "Entregue com sucesso"}
                  {order.status === OrderStatus.CANCELED && "Pedido cancelado"}
                </Text>
              </VStack>
            </HStack>
          </View>

          <View className="p-4">
            <HStack className="items-center mb-3">
              <Clock size={16} color="#6B7280" />
              <Text className="ml-2 text-gray-700">
                Realizado em {formatDate(order.createdAt)}
              </Text>
            </HStack>

            {order.estimatedDeliveryTime && (
              <HStack className="items-center">
                <Truck size={16} color="#6B7280" />
                <Text className="ml-2 text-gray-700">
                  Previsão de entrega: {order.estimatedDeliveryTime} minutos
                </Text>
              </HStack>
            )}
          </View>
        </Card>

        {/* Itens do Pedido */}
        <Card className="mb-4 border border-gray-100">
          <View className="p-4">
            <Text className="font-semibold text-gray-800 text-base mb-3">
              Itens do Pedido
            </Text>

            {order.items.map((item: any, index: number) => (
              <View key={item.id} className="mb-3">
                <HStack space="md" className="mb-2">
                  {item.imageUrl && (
                    <View className="w-12 h-12 rounded-md overflow-hidden bg-gray-100">
                      <ImagePreview
                        uri={item.imageUrl}
                        fallbackIcon={Package}
                        width="100%"
                        height="100%"
                        resizeMode="cover"
                      />
                    </View>
                  )}

                  <VStack className="flex-1">
                    <HStack className="justify-between">
                      <Text className="font-medium text-gray-800">
                        {item.name}
                      </Text>
                      <Text className="text-gray-700">
                        {formatCurrency(item.totalPrice)}
                      </Text>
                    </HStack>

                    <HStack className="justify-between">
                      <Text className="text-sm text-gray-500">
                        {item.quantity} x {item.priceFormatted}
                      </Text>
                    </HStack>

                    {/* Observação do item */}
                    {item.observation && (
                      <View className="mt-1 p-2 bg-gray-50 rounded-md">
                        <HStack className="items-start">
                          <MessageSquare
                            size={14}
                            color="#6B7280"
                            className="mt-0.5"
                          />
                          <Text className="ml-2 text-xs text-gray-600 flex-1">
                            {item.observation}
                          </Text>
                        </HStack>
                      </View>
                    )}
                  </VStack>
                </HStack>

                {index < order.items.length - 1 && <Divider className="my-2" />}
              </View>
            ))}
          </View>
        </Card>

        {/* Informações de Entrega */}
        <Card className="mb-4 border border-gray-100">
          <View className="p-4">
            <Text className="font-semibold text-gray-800 text-base mb-3">
              Informações de Entrega
            </Text>

            {order.delivery ? (
              <VStack space="sm">
                <HStack className="items-start">
                  <MapPin size={16} color="#6B7280" className="mt-0.5" />
                  <VStack className="ml-2 flex-1">
                    <Text className="text-gray-700">
                      {order.delivery.address}
                    </Text>
                    <Text className="text-gray-700">
                      {order.delivery.city}, {order.delivery.state} -{" "}
                      {order.delivery.zipCode}
                    </Text>
                    {order.delivery.complement && (
                      <Text className="text-gray-500 text-sm">
                        Complemento: {order.delivery.complement}
                      </Text>
                    )}
                  </VStack>
                </HStack>

                <HStack className="items-center">
                  <Phone size={16} color="#6B7280" />
                  <Text className="ml-2 text-gray-700">
                    {order.delivery.contactPhone}
                  </Text>
                </HStack>

                {order.delivery.deliveryInstructions && (
                  <View className="mt-1 p-2 bg-gray-50 rounded-md">
                    <Text className="text-sm text-gray-600">
                      {order.delivery.deliveryInstructions}
                    </Text>
                  </View>
                )}
              </VStack>
            ) : (
              <Text className="text-gray-500">
                Informações de entrega não disponíveis.
              </Text>
            )}
          </View>
        </Card>

        {/* Pagamento */}
        <Card className="mb-4 border border-gray-100">
          <View className="p-4">
            <Text className="font-semibold text-gray-800 text-base mb-3">
              Pagamento
            </Text>

            <HStack className="items-center mb-3">
              <PaymentIcon size={16} color="#6B7280" />
              <Text className="ml-2 text-gray-700">{paymentInfo.label}</Text>
            </HStack>

            <Divider className="my-2" />

            <VStack space="sm">
              <HStack className="justify-between">
                <Text className="text-gray-600">Subtotal</Text>
                <Text className="text-gray-700">
                  {formatCurrency(order.subtotal)}
                </Text>
              </HStack>

              {order.deliveryFee !== undefined && (
                <HStack className="justify-between">
                  <Text className="text-gray-600">Taxa de entrega</Text>
                  <Text className="text-gray-700">
                    {formatCurrency(order.deliveryFee)}
                  </Text>
                </HStack>
              )}

              {order.discountAmount !== undefined && (
                <HStack className="justify-between">
                  <Text className="text-green-600">
                    Desconto{" "}
                    {order.discountPercentage !== undefined
                      ? `(${order.discountPercentage}%)`
                      : ""}
                  </Text>
                  <Text className="text-green-600">
                    -{formatCurrency(order.discountAmount)}
                  </Text>
                </HStack>
              )}

              <Divider className="my-1" />

              <HStack className="justify-between">
                <Text className="font-semibold text-gray-800">Total</Text>
                <Text className="font-bold text-gray-800">
                  {formatCurrency(order.total)}
                </Text>
              </HStack>
            </VStack>
          </View>
        </Card>

        {/* Botões de ação */}
        <View className="mb-8">
          {order.status === OrderStatus.PENDING && (
            <TouchableOpacity
              className="py-3 rounded-lg border border-red-500 mb-3"
              onPress={() => {
                Alert.alert(
                  "Cancelar Pedido",
                  "Tem certeza que deseja cancelar este pedido?",
                  [
                    { text: "Não", style: "cancel" },
                    {
                      text: "Sim, cancelar",
                      style: "destructive",
                      onPress: () => {
                        orderViewModel.cancelOrder(order.id);
                        setOrder({
                          ...order,
                          status: OrderStatus.CANCELED,
                          updatedAt: new Date(),
                        });
                      },
                    },
                  ]
                );
              }}
            >
              <Text className="text-center font-medium text-red-500">
                Cancelar Pedido
              </Text>
            </TouchableOpacity>
          )}

          {(order.status === OrderStatus.DELIVERED ||
            order.status === OrderStatus.CANCELED) && (
            <TouchableOpacity
              className="py-3 rounded-lg border border-primary-500 mb-3"
              onPress={handleRepeatOrder}
            >
              <HStack space="sm" className="items-center justify-center">
                <RefreshCw size={18} color={primaryColor} />
                <Text className="font-medium" style={{ color: primaryColor }}>
                  Repetir Pedido
                </Text>
              </HStack>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            className="py-3 rounded-lg"
            style={{ backgroundColor: primaryColor }}
          >
            <Text className="text-center font-medium text-white">
              Falar com o Estabelecimento
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
