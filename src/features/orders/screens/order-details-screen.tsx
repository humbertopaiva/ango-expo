// Path: src/features/orders/screens/order-details-screen.tsx

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  Share,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import ScreenHeader from "@/components/ui/screen-header";
import { Card, VStack, HStack, Divider } from "@gluestack-ui/themed";
import {
  Clock,
  MapPin,
  CreditCard,
  MessageSquare,
  Phone,
  RefreshCw,
  ShoppingBag,
  Share2,
  Trash2,
} from "lucide-react-native";
import { useOrderViewModel } from "../view-models/use-order-view-model";
import { Order, PaymentMethod } from "../models/order";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { THEME_COLORS } from "@/src/styles/colors";
import { ImagePreview } from "@/components/custom/image-preview";
import { Package } from "lucide-react-native";
import { useMultiCartStore } from "@/src/features/cart/stores/cart.store";
import { toastUtils } from "@/src/utils/toast.utils";
import { useToast } from "@gluestack-ui/themed";

export function OrderDetailsScreen() {
  const { orderId, companySlug } = useLocalSearchParams<{
    orderId: string;
    companySlug: string;
  }>();

  const orderViewModel = useOrderViewModel();
  const [order, setOrder] = useState<Order | null>(null);

  const multiCartStore = useMultiCartStore();
  const toast = useToast();

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

  const handleContactCompany = async () => {
    if (order && order.companyPhone) {
      const success = await orderViewModel.contactCompany(
        order.companyPhone,
        order.id
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

  const handleDeleteOrder = () => {
    Alert.alert(
      "Deletar Pedido",
      "Tem certeza que deseja remover este pedido do histórico?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Deletar",
          style: "destructive",
          onPress: () => {
            orderViewModel.deleteOrder(order.id);
            toastUtils.success(toast, "Pedido removido com sucesso");
            router.back();
          },
        },
      ]
    );
  };

  const handleRepeatOrder = () => {
    // Adicionar itens ao carrinho
    multiCartStore.clearCart(companySlug);
    order.items.forEach((item) => {
      multiCartStore.addItem(companySlug, item);
    });

    // Navegar para o carrinho
    router.push(`/(drawer)/empresa/${companySlug}/cart`);
    toastUtils.success(toast, "Itens adicionados ao carrinho!");
  };

  const handleShareOrder = async () => {
    try {
      const orderCode = order.id.replace("order_", "").substring(0, 6);
      const formattedDate = format(
        new Date(order.createdAt),
        "dd/MM/yyyy 'às' HH:mm",
        { locale: ptBR }
      );
      const totalItems = order.items.reduce(
        (sum, item) => sum + item.quantity,
        0
      );

      const message = `
Pedido #${orderCode} - ${order.companyName}
Data: ${formattedDate}
Itens: ${totalItems} ${totalItems === 1 ? "item" : "itens"}
Total: ${formatCurrency(order.total)}

Detalhes do pedido:
${order.items
  .map((item) => `- ${item.quantity}x ${item.name} (${item.priceFormatted})`)
  .join("\n")}
`;

      await Share.share({
        message,
        title: `Pedido #${orderCode} - ${order.companyName}`,
      });
    } catch (error) {
      console.error("Erro ao compartilhar pedido:", error);
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
          label: "Método de pagamento",
          icon: CreditCard,
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

  const paymentInfo = getPaymentMethodInfo(order.payment.method);
  const PaymentIcon = paymentInfo.icon;

  return (
    <View className="flex-1 bg-gray-50">
      {/* <ScreenHeader
        title={`Pedido #${order.id.replace("order_", "").substring(0, 6)}`}
        showBackButton={true}
        onBackPress={() => router.back()}
        rightContent={
          <TouchableOpacity onPress={handleShareOrder} className="p-2">
            <Share2 size={20} color="white" />
          </TouchableOpacity>
        }
      /> */}

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 16 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Informações Gerais do Pedido */}
        <Card className="mb-4 border border-gray-100">
          <View className="p-4">
            <HStack className="items-center mb-3">
              <ShoppingBag size={16} color={primaryColor} className="mr-2" />
              <Text
                className="text-base font-semibold"
                style={{ color: primaryColor }}
              >
                Informações do Pedido
              </Text>
            </HStack>

            <HStack className="items-center mb-3">
              <Clock size={16} color="#6B7280" />
              <Text className="ml-2 text-gray-700">
                Realizado em {formatDate(order.createdAt)}
              </Text>
            </HStack>

            {order.estimatedDeliveryTime && (
              <HStack className="items-center">
                <Clock size={16} color="#6B7280" />
                <Text className="ml-2 text-gray-700">
                  Previsão de entrega: {order.estimatedDeliveryTime} minutos
                </Text>
              </HStack>
            )}
          </View>
          // Path: src/features/orders/screens/order-details-screen.tsx
          (continuação)
          {/* Botão de ação rápida */}
          <TouchableOpacity
            onPress={handleContactCompany}
            className="mt-1 mb-2 p-3 border-t border-gray-100 flex-row items-center justify-center"
            style={{ backgroundColor: `${primaryColor}10` }}
          >
            <MessageSquare size={18} color={primaryColor} className="mr-2" />
            <Text className="font-medium" style={{ color: primaryColor }}>
              Falar com a Empresa
            </Text>
          </TouchableOpacity>
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

                    {/* Exibir variação */}
                    {item.variationName && (
                      <View className="mt-1 p-2 bg-gray-50 rounded-md">
                        <Text className="text-xs font-medium text-gray-700">
                          Variação: {item.variationName}
                        </Text>
                        {item.variationDescription && (
                          <Text className="text-xs text-gray-600 mt-0.5">
                            {item.variationDescription}
                          </Text>
                        )}
                      </View>
                    )}

                    {/* Exibir customização */}
                    {item.isCustomProduct &&
                      item.customProductSteps?.length > 0 && (
                        <View className="mt-1 p-2 bg-gray-50 rounded-md">
                          <Text className="text-xs font-medium text-gray-700 mb-1">
                            Personalização:
                          </Text>
                          {item.customProductSteps.map((step: any) => (
                            <View key={step.stepNumber} className="mb-1">
                              {step.stepName && (
                                <Text className="text-xs font-medium text-gray-600">
                                  {step.stepName}:
                                </Text>
                              )}
                              <Text className="text-xs text-gray-600">
                                {step.selectedItems
                                  .map((si: any) => si.name)
                                  .join(", ")}
                              </Text>
                            </View>
                          ))}
                        </View>
                      )}

                    {/* Exibir adicionais */}
                    {item.addons?.length > 0 && (
                      <View className="mt-1 p-2 bg-gray-50 rounded-md">
                        <Text className="text-xs font-medium text-gray-700 mb-1">
                          Adicionais:
                        </Text>
                        {item.addons.map((addon: any, idx: number) => (
                          <Text
                            key={`${addon.id}_${idx}`}
                            className="text-xs text-gray-600"
                          >
                            {addon.quantity}x {addon.name}
                          </Text>
                        ))}
                      </View>
                    )}

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
        {order.delivery && (
          <Card className="mb-4 border border-gray-100">
            <View className="p-4">
              <Text className="font-semibold text-gray-800 text-base mb-3">
                Informações de Entrega
              </Text>

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
            </View>
          </Card>
        )}

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
        <View className="mb-8 space-y-3">
          <TouchableOpacity
            className="py-3 rounded-lg border border-primary-500"
            onPress={handleRepeatOrder}
          >
            <HStack space="sm" className="items-center justify-center">
              <RefreshCw size={18} color={primaryColor} />
              <Text className="font-medium" style={{ color: primaryColor }}>
                Repetir Pedido
              </Text>
            </HStack>
          </TouchableOpacity>

          <TouchableOpacity
            className="py-3 rounded-lg"
            style={{ backgroundColor: primaryColor }}
            onPress={handleContactCompany}
          >
            <HStack space="sm" className="items-center justify-center">
              <MessageSquare size={18} color="white" />
              <Text className="text-center font-medium text-white">
                Falar com a Empresa
              </Text>
            </HStack>
          </TouchableOpacity>

          <TouchableOpacity
            className="py-3 rounded-lg border border-red-500"
            onPress={handleDeleteOrder}
          >
            <HStack space="sm" className="items-center justify-center">
              <Trash2 size={18} color="#EF4444" />
              <Text className="font-medium text-red-500">Remover Pedido</Text>
            </HStack>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
