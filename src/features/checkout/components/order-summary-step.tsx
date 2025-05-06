// Path: src/features/checkout/components/order-summary-step.tsx

import React from "react";
import { View, Text, ScrollView } from "react-native";
import {
  Card,
  VStack,
  HStack,
  RadioGroup,
  Divider,
} from "@gluestack-ui/themed";
import { Truck, Home, ShoppingBag, Sparkles, Info } from "lucide-react-native";
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
    <ScrollView
      className="flex-1"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ padding: 16, paddingBottom: 24 }}
    >
      {/* Método de Recebimento Section - Movido para o topo como decisão principal */}
      <Card className="p-4 mb-4 border border-gray-100">
        <Text className="text-lg font-semibold text-gray-800 mb-3">
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

        {/* Indicação da taxa */}
        <View className="mt-3 p-3 bg-gray-50 rounded-lg">
          <HStack className="items-center">
            {isDelivery ? (
              <Truck size={16} color={primaryColor} className="mr-2" />
            ) : (
              <Home size={16} color={primaryColor} className="mr-2" />
            )}
            <Text className="text-gray-700 flex-1">
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

        {/* Informações sobre bairros atendidos */}
        {isDelivery &&
          hasSpecificNeighborhoods &&
          deliveryConfig?.bairros_atendidos &&
          deliveryConfig.bairros_atendidos.length > 0 && (
            <View className="mt-3 p-3 bg-blue-50 rounded-lg">
              <HStack className="items-start">
                <Info size={16} color="#3B82F6" className="mt-0.5 mr-2" />
                <View className="flex-1">
                  <Text className="text-blue-700 font-medium mb-1">
                    Bairros atendidos:
                  </Text>
                  <Text className="text-blue-700 text-sm">
                    {deliveryConfig.bairros_atendidos.join(", ")}
                  </Text>
                </View>
              </HStack>
            </View>
          )}
      </Card>

      {/* Resumo de itens */}
      <Card className="p-4 mb-4 border border-gray-100">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-lg font-semibold text-gray-800">
            Resumo do Pedido
          </Text>
          <Text className="text-sm font-medium text-gray-500">
            {checkout.items.length}{" "}
            {checkout.items.length === 1 ? "item" : "itens"}
          </Text>
        </View>

        {/* Produtos normais com adicionais */}
        {mainItems.map((item) => (
          <View key={item.id} className="mb-4">
            <HStack className="justify-between mb-1">
              <View className="flex-row items-start">
                <ShoppingBag size={14} color="#6B7280" className="mt-1 mr-2" />
                <View className="flex-1">
                  <Text className="text-gray-800 font-medium">
                    {item.quantity}x {item.name}
                  </Text>
                  {item.hasVariation && item.variationName && (
                    <Text className="text-gray-600 text-sm">
                      Opção: {item.variationName}
                    </Text>
                  )}
                </View>
              </View>
              <Text className="font-semibold text-gray-800">
                {item.totalPriceFormatted}
              </Text>
            </HStack>

            {/* Adicionais do item principal com preços individuais */}
            {addons[item.id]?.map((addon, addonIndex) => (
              <View
                key={`addon-${addonIndex}`}
                className="flex-row justify-between ml-6 mb-0.5"
              >
                <Text className="text-sm text-gray-600">
                  + {addon.quantity}x {addon.name}
                </Text>
                <Text className="text-sm text-gray-600">
                  {(addon.price * addon.quantity).toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </Text>
              </View>
            ))}

            {item.observation && (
              <View className="ml-6 mt-1 bg-gray-50 p-2 rounded">
                <Text className="text-xs text-gray-600">
                  <Text className="font-medium">Observação:</Text>{" "}
                  {item.observation}
                </Text>
              </View>
            )}
          </View>
        ))}

        {/* Produtos customizados */}
        {customItems.map((item) => (
          <View key={item.id} className="mb-4">
            <HStack className="justify-between mb-1">
              <View className="flex-row items-start">
                <Sparkles size={14} color="#6B7280" className="mt-1 mr-2" />
                <View className="flex-1">
                  <View className="flex-row items-center">
                    <Text className="text-gray-800 font-medium">
                      {item.quantity}x {item.name}
                    </Text>
                    <View className="bg-blue-100 px-2 py-0.5 rounded ml-2">
                      <Text className="text-xs text-blue-700 font-medium">
                        Personalizado
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
              <Text className="font-semibold text-gray-800">
                {item.totalPriceFormatted}
              </Text>
            </HStack>

            {/* Detalhes dos passos customizados */}
            {item.customProductSteps?.map((step, stepIndex) => (
              <View key={`step-${stepIndex}`} className="ml-6 mb-0.5">
                <Text className="text-sm text-gray-600">
                  {step.stepName && (
                    <Text className="font-medium">{step.stepName}:</Text>
                  )}{" "}
                  {step.selectedItems.map((i) => i.name).join(", ")}
                </Text>
              </View>
            ))}

            {item.observation && (
              <View className="ml-6 mt-1 bg-gray-50 p-2 rounded">
                <Text className="text-xs text-gray-600">
                  <Text className="font-medium">Observação:</Text>{" "}
                  {item.observation}
                </Text>
              </View>
            )}
          </View>
        ))}

        <Divider className="my-3" />

        {/* Resumo de valores com visual aprimorado */}
        <View className="gap-2">
          <HStack className="justify-between">
            <Text className="text-gray-600">Subtotal</Text>
            <Text className="font-medium text-gray-800">
              {checkout.subtotal.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </Text>
          </HStack>

          {/* Taxa de entrega mais visual */}
          <HStack className="justify-between">
            <Text className="text-gray-600">Taxa de entrega</Text>
            {isDelivery ? (
              <Text
                className={`font-medium ${
                  isDeliveryFree ? "text-green-600" : "text-primary-500"
                }`}
              >
                {isDeliveryFree ? "Grátis" : forcedDeliveryFee}
              </Text>
            ) : (
              <Text className="font-medium text-green-600">Grátis</Text>
            )}
          </HStack>

          <Divider className="my-1" />

          <HStack className="justify-between">
            <Text className="font-semibold text-gray-800">Total</Text>
            <Text className="font-bold text-lg text-gray-800">
              {(checkout.deliveryType === CheckoutDeliveryType.PICKUP
                ? checkout.subtotal
                : checkout.total
              ).toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </Text>
          </HStack>
        </View>
      </Card>
    </ScrollView>
  );
}
