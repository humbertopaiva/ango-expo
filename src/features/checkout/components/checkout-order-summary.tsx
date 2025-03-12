// Path: src/features/checkout/components/checkout-order-summary.tsx
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Card, HStack, VStack, Divider } from "@gluestack-ui/themed";
import { Package, MessageSquare } from "lucide-react-native";
import { useCartViewModel } from "@/src/features/cart/view-models/use-cart-view-model";
import { useCheckoutViewModel } from "../view-models/use-checkout-view-model";
import { ImagePreview } from "@/components/custom/image-preview";
import { CartItem } from "@/src/features/cart/models/cart";
import { DeliveryMethodSelector } from "./delivery-method-selector";

/**
 * Componente de item de pedido individual com detalhes e observações
 */
const OrderItem = ({ item }: { item: CartItem }) => {
  return (
    <HStack space="md" className="py-3 border-b border-gray-100">
      {/* Imagem do produto */}
      <View className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
        <ImagePreview
          uri={item.imageUrl}
          fallbackIcon={Package}
          width="100%"
          height="100%"
          resizeMode="cover"
        />
      </View>

      {/* Detalhes do produto */}
      <VStack className="flex-1 justify-between">
        <View>
          <Text className="font-semibold text-gray-800">{item.name}</Text>

          {item.description && (
            <Text className="text-xs text-gray-500 mt-0.5" numberOfLines={1}>
              {item.description}
            </Text>
          )}
        </View>

        <HStack className="justify-between items-center mt-1">
          <Text className="text-sm text-gray-700">
            {item.quantity}x {item.priceFormatted}
          </Text>
          <Text className="font-semibold text-gray-800">
            {item.totalPriceFormatted}
          </Text>
        </HStack>
      </VStack>
    </HStack>
  );
};

/**
 * Componente para observações de um item (exibido se houver observação)
 */
const ItemObservation = ({ observation }: { observation: string }) => {
  if (!observation.trim()) return null;

  return (
    <View className="bg-gray-50 p-3 rounded-lg my-2 ml-16">
      <HStack className="items-start">
        <MessageSquare size={14} color="#6B7280" className="mt-0.5" />
        <Text className="ml-2 text-sm text-gray-600 flex-1">{observation}</Text>
      </HStack>
    </View>
  );
};

/**
 * Componente de resumo do pedido para a primeira etapa do checkout
 */
export function CheckoutOrderSummary() {
  const cartVm = useCartViewModel();
  const checkoutVm = useCheckoutViewModel();

  const hasDeliveryFee =
    checkoutVm.deliveryMethod === "delivery" &&
    checkoutVm.companyConfig?.deliveryConfig?.deliveryFee &&
    parseFloat(checkoutVm.companyConfig.deliveryConfig.deliveryFee) > 0;

  // Calcular o total considerando a taxa de entrega
  const calculateTotal = () => {
    const subtotal = cartVm.items.reduce(
      (sum, item) => sum + item.totalPrice,
      0
    );
    const deliveryFee = hasDeliveryFee
      ? parseFloat(
          checkoutVm.companyConfig?.deliveryConfig?.deliveryFee || "0"
        ) / 100
      : 0;

    return (subtotal + deliveryFee).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  return (
    <View>
      {/* Seletor de método de entrega */}
      <DeliveryMethodSelector />

      {/* Itens do Pedido */}
      <Card className="p-0 overflow-hidden border border-gray-100">
        {/* Seção de itens do pedido */}
        <View className="p-4 bg-white">
          <Text className="text-lg font-semibold text-gray-800 mb-3">
            Itens do Pedido ({cartVm.items.length})
          </Text>

          <VStack space="xs">
            {cartVm.items.map((item) => (
              <React.Fragment key={item.id}>
                <OrderItem item={item} />
                {item.observation && (
                  <ItemObservation observation={item.observation} />
                )}
              </React.Fragment>
            ))}
          </VStack>
        </View>

        {/* Resumo de valores */}
        <View className="bg-gray-50 p-4">
          <Text className="font-semibold text-gray-800 mb-3">
            Resumo de Valores
          </Text>

          <VStack space="sm">
            <HStack className="justify-between">
              <Text className="text-gray-600">Subtotal</Text>
              <Text className="font-medium text-gray-800">
                {cartVm.subtotal}
              </Text>
            </HStack>

            <HStack className="justify-between">
              <Text className="text-gray-600">Taxa de entrega</Text>
              <Text className="font-medium text-gray-800">
                {hasDeliveryFee
                  ? (
                      parseFloat(
                        checkoutVm.companyConfig?.deliveryConfig?.deliveryFee ||
                          "0"
                      ) / 100
                    ).toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })
                  : "Grátis"}
              </Text>
            </HStack>

            <Divider my="$0.5" />

            <HStack className="justify-between mt-2">
              <Text className="font-semibold text-gray-800">Total</Text>
              <Text className="font-bold text-lg text-gray-800">
                {calculateTotal()}
              </Text>
            </HStack>
          </VStack>
        </View>

        {/* Notas sobre entrega, se disponível */}
        {checkoutVm.companyConfig?.deliveryConfig?.notes && (
          <View className="bg-blue-50 p-4 border-t border-blue-100">
            <Text className="font-medium text-blue-800 mb-1">
              Informações de Entrega
            </Text>
            <Text className="text-sm text-blue-700">
              {checkoutVm.companyConfig.deliveryConfig.notes}
            </Text>
          </View>
        )}
      </Card>
    </View>
  );
}
