// Path: src/features/checkout/components/order-summary-step.tsx

import React from "react";
import { View, Text, ScrollView } from "react-native";
import { Card, VStack, HStack, RadioGroup, Badge } from "@gluestack-ui/themed";
import { Truck, Home, ShoppingBag, Sparkles } from "lucide-react-native";
import { useCheckoutViewModel } from "../view-models/use-checkout-view-model";
import { CheckoutDeliveryType } from "../models/checkout";
import { THEME_COLORS } from "@/src/styles/colors";
import { RadioOptionButton } from "@/components/ui/radio-option-button";
import { CartProcessorService } from "../services/cart-processor.service";

export function OrderSummaryStep() {
  const { checkout, setDeliveryType, forcedDeliveryFee, deliveryConfig } =
    useCheckoutViewModel();
  const primaryColor = THEME_COLORS.primary;

  // Processar os itens em categorias
  const { mainItems, addons, customItems } = CartProcessorService.processItems(
    checkout.items
  );

  // Verificar se a entrega é gratuita
  const isDeliveryFree =
    checkout.deliveryFee === 0 || checkout.deliveryFee === undefined;

  const isDelivery = checkout.deliveryType === CheckoutDeliveryType.DELIVERY;

  // Verificar se há bairros específicos
  const hasSpecificNeighborhoods =
    deliveryConfig?.especificar_bairros_atendidos;

  // Adicionar informações sobre bairros atendidos
  const renderDeliveryNote = () => {
    if (!isDelivery) return null;

    if (
      hasSpecificNeighborhoods &&
      deliveryConfig?.bairros_atendidos &&
      deliveryConfig.bairros_atendidos.length > 0
    ) {
      return (
        <View className="mt-2 p-3 bg-blue-50 rounded-lg">
          <Text className="text-blue-700 font-medium mb-1">
            Bairros atendidos:
          </Text>
          <Text className="text-blue-700">
            {deliveryConfig.bairros_atendidos.join(", ")}
          </Text>
        </View>
      );
    }

    return null;
  };

  // Formatar a taxa de entrega
  const formatDeliveryFee = () => {
    if (checkout.deliveryType !== CheckoutDeliveryType.DELIVERY) {
      return "Grátis";
    }

    if (isDeliveryFree) {
      return "Grátis";
    }

    return checkout.deliveryFee.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  const deliveryOptions = [
    {
      type: CheckoutDeliveryType.DELIVERY,
      label: "Entrega",
      description: "Receba seu pedido em casa",
      icon: (
        <Truck
          size={20}
          color={
            checkout.deliveryType === CheckoutDeliveryType.DELIVERY
              ? primaryColor
              : "#64748b"
          }
        />
      ),
    },
    {
      type: CheckoutDeliveryType.PICKUP,
      label: "Retirada no local",
      description: "Retire seu pedido no estabelecimento",
      icon: (
        <Home
          size={20}
          color={
            checkout.deliveryType === CheckoutDeliveryType.PICKUP
              ? primaryColor
              : "#64748b"
          }
        />
      ),
    },
  ];

  return (
    <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
      <View className="p-4">
        <Card className="p-4 mb-4 border border-gray-100">
          <Text className="text-lg font-semibold text-gray-800 mb-4">
            Resumo do Pedido
          </Text>

          {/* Exibir claramente a taxa de entrega */}
          {checkout.deliveryType === CheckoutDeliveryType.DELIVERY && (
            <View className="bg-secondary-50 p-3 rounded-lg mb-4">
              <HStack className="justify-between items-center">
                <Text className="text-primary-500 font-medium">
                  Taxa de entrega:
                </Text>
                <View>
                  {isDelivery && (
                    <Text className="font-medium text-primary-500">
                      {isDelivery && forcedDeliveryFee}
                    </Text>
                  )}
                </View>
              </HStack>
            </View>
          )}

          {/* Informações sobre bairros atendidos */}
          {renderDeliveryNote()}

          <View className="bg-gray-50 p-3 rounded-lg mb-4">
            <Text className="font-medium text-gray-800 mb-2">
              {checkout.items.length}{" "}
              {checkout.items.length === 1 ? "item" : "itens"} de{" "}
              {checkout.companyName}
            </Text>

            {/* Produtos normais com adicionais */}
            {mainItems.map((item) => (
              <View key={item.id} className="mb-2">
                <HStack className="justify-between">
                  <View className="flex-1">
                    <HStack>
                      <ShoppingBag
                        size={14}
                        color="#6B7280"
                        className="mt-1 mr-1"
                      />
                      <View className="flex-1">
                        <Text className="text-gray-700">
                          {item.quantity}x {item.name}
                          {item.hasVariation && item.variationName
                            ? ` (${item.variationName})`
                            : ""}
                        </Text>

                        {/* Adicionais do item principal */}
                        {addons[item.id]?.map((addon, addonIndex) => (
                          <Text
                            key={`addon-${addonIndex}`}
                            className="text-xs text-gray-500 ml-4"
                          >
                            + {addon.quantity}x {addon.name}
                          </Text>
                        ))}
                      </View>
                    </HStack>
                  </View>
                  <Text className="font-medium text-gray-800 ml-2">
                    {item.totalPriceFormatted}
                  </Text>
                </HStack>

                {item.observation && (
                  <Text className="text-sm text-gray-500 ml-6">
                    Obs: {item.observation}
                  </Text>
                )}
              </View>
            ))}
            {/* Produtos customizados */}
            {customItems.map((item) => (
              <View key={item.id} className="mb-2">
                <HStack className="justify-between">
                  <View className="flex-1">
                    <HStack>
                      <Sparkles
                        size={14}
                        color="#6B7280"
                        className="mt-1 mr-1"
                      />
                      <View className="flex-1">
                        <HStack>
                          <Text className="text-gray-700 flex-1">
                            {item.quantity}x {item.name}
                          </Text>
                          <View className="bg-gray-200 px-1 rounded ml-1">
                            <Text className="text-xs text-gray-600">
                              Personalizado
                            </Text>
                          </View>
                        </HStack>

                        {/* Detalhes dos passos customizados (simplificados) */}
                        {item.customProductSteps?.map((step, stepIndex) => (
                          <Text
                            key={`step-${stepIndex}`}
                            className="text-xs text-gray-500 ml-4"
                          >
                            {step.stepName && `${step.stepName}: `}
                            {step.selectedItems.map((i) => i.name).join(", ")}
                          </Text>
                        ))}
                      </View>
                    </HStack>
                  </View>
                  <Text className="font-medium text-gray-800 ml-2">
                    {item.totalPriceFormatted}
                  </Text>
                </HStack>

                {item.observation && (
                  <Text className="text-sm text-gray-500 ml-6">
                    Obs: {item.observation}
                  </Text>
                )}
              </View>
            ))}
            <View className="mt-3 pt-3 border-t border-gray-200">
              <HStack className="justify-between">
                <Text className="text-gray-600">Subtotal</Text>
                <Text className="font-medium text-gray-800">
                  {checkout.subtotal.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </Text>
              </HStack>

              {/* Mostrar taxa de entrega no resumo de valores */}
              <HStack className="justify-between mt-1">
                <Text className="text-gray-600">Taxa de entrega</Text>
                {isDelivery ? (
                  <Text className="font-medium text-primary-500">
                    {forcedDeliveryFee}
                  </Text>
                ) : (
                  <Text className="font-medium text-gray-800">R$ 0,00</Text>
                )}
              </HStack>

              <HStack className="justify-between mt-2">
                <Text className="font-semibold text-gray-800">Total</Text>
                <Text className="font-bold text-gray-800">
                  {isDelivery
                    ? checkout.total.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })
                    : checkout.subtotal.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
                </Text>
              </HStack>
            </View>
          </View>

          <Text className="text-lg font-semibold text-gray-800 mb-2">
            Como você quer receber seu pedido?
          </Text>

          <RadioGroup
            value={checkout.deliveryType}
            onChange={(value) => setDeliveryType(value as CheckoutDeliveryType)}
          >
            {deliveryOptions.map((option) => (
              <RadioOptionButton
                key={option.type}
                value={option.type}
                label={option.label}
                description={option.description}
                icon={option.icon}
                isSelected={checkout.deliveryType === option.type}
                onPress={() => setDeliveryType(option.type)}
                primaryColor={primaryColor}
              />
            ))}
          </RadioGroup>

          {/* Indicação clara do status da taxa de entrega */}
          <View className="mt-3 p-3 bg-gray-50 rounded-lg">
            <HStack className="items-center">
              <Truck size={16} color={primaryColor} className="mr-2" />
              <Text className="text-gray-700">
                {checkout.deliveryType === CheckoutDeliveryType.DELIVERY
                  ? isDeliveryFree
                    ? "Entrega gratuita disponível para seu pedido!"
                    : `Taxa de entrega: ${checkout.deliveryFee.toLocaleString(
                        "pt-BR",
                        {
                          style: "currency",
                          currency: "BRL",
                        }
                      )}`
                  : "Retirada gratuita no estabelecimento"}
              </Text>
            </HStack>
          </View>
        </Card>
      </View>
    </ScrollView>
  );
}
