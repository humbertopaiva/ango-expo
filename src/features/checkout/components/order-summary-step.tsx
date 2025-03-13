// Path: src/features/checkout/components/order-summary-step.tsx
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Card, VStack, HStack, Button, Radio } from "@gluestack-ui/themed";
import { Truck, Home, Package } from "lucide-react-native";
import { useCheckoutViewModel } from "../view-models/use-checkout-view-model";
import { CheckoutDeliveryType } from "../models/checkout";
import { THEME_COLORS } from "@/src/styles/colors";

export function OrderSummaryStep() {
  const { checkout, setDeliveryType, nextStep } = useCheckoutViewModel();
  const primaryColor = THEME_COLORS.primary;

  return (
    <View className="flex-1 p-4">
      <Card className="p-4 mb-4 border border-gray-100">
        <Text className="text-lg font-semibold text-gray-800 mb-4">
          Resumo do Pedido
        </Text>

        <View className="bg-gray-50 p-3 rounded-lg mb-4">
          <Text className="font-medium text-gray-800 mb-2">
            {checkout.items.length}{" "}
            {checkout.items.length === 1 ? "item" : "itens"} de{" "}
            {checkout.companyName}
          </Text>

          {checkout.items.map((item) => (
            <View key={item.id} className="mb-2">
              <HStack className="justify-between">
                <Text className="text-gray-700">
                  {item.quantity}x {item.name}
                </Text>
                <Text className="font-medium text-gray-800">
                  {item.totalPriceFormatted}
                </Text>
              </HStack>

              {item.observation && (
                <Text className="text-sm text-gray-500">
                  Obs: {item.observation}
                </Text>
              )}
            </View>
          ))}

          <View className="mt-3 pt-3 border-t border-gray-200">
            <HStack className="justify-between">
              <Text className="font-semibold text-gray-800">Total</Text>
              <Text className="font-bold text-gray-800">
                {checkout.total.toLocaleString("pt-BR", {
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

        <Radio.Group
          value={checkout.deliveryType}
          onChange={(value) => setDeliveryType(value as CheckoutDeliveryType)}
        >
          <View className="mb-3">
            <TouchableOpacity
              onPress={() => setDeliveryType(CheckoutDeliveryType.DELIVERY)}
              className={`p-4 border rounded-lg ${
                checkout.deliveryType === CheckoutDeliveryType.DELIVERY
                  ? `border-primary-500 bg-primary-50`
                  : "border-gray-200"
              }`}
            >
              <HStack space="md" alignItems="center">
                <View
                  className="h-10 w-10 rounded-full items-center justify-center"
                  style={{
                    backgroundColor:
                      checkout.deliveryType === CheckoutDeliveryType.DELIVERY
                        ? `${primaryColor}20`
                        : "#f3f4f6",
                  }}
                >
                  <Truck
                    size={20}
                    color={
                      checkout.deliveryType === CheckoutDeliveryType.DELIVERY
                        ? primaryColor
                        : "#64748b"
                    }
                  />
                </View>

                <VStack>
                  <Text className="font-medium text-gray-800">Entrega</Text>
                  <Text className="text-sm text-gray-500">
                    Receba seu pedido em casa
                  </Text>
                </VStack>

                <Radio
                  value={CheckoutDeliveryType.DELIVERY}
                  accessibilityLabel="Entrega"
                  className="ml-auto"
                />
              </HStack>
            </TouchableOpacity>
          </View>

          <View>
            <TouchableOpacity
              onPress={() => setDeliveryType(CheckoutDeliveryType.PICKUP)}
              className={`p-4 border rounded-lg ${
                checkout.deliveryType === CheckoutDeliveryType.PICKUP
                  ? `border-primary-500 bg-primary-50`
                  : "border-gray-200"
              }`}
            >
              <HStack space="md" alignItems="center">
                <View
                  className="h-10 w-10 rounded-full items-center justify-center"
                  style={{
                    backgroundColor:
                      checkout.deliveryType === CheckoutDeliveryType.PICKUP
                        ? `${primaryColor}20`
                        : "#f3f4f6",
                  }}
                >
                  <Home
                    size={20}
                    color={
                      checkout.deliveryType === CheckoutDeliveryType.PICKUP
                        ? primaryColor
                        : "#64748b"
                    }
                  />
                </View>

                <VStack>
                  <Text className="font-medium text-gray-800">
                    Retirada no local
                  </Text>
                  <Text className="text-sm text-gray-500">
                    Retire seu pedido no estabelecimento
                  </Text>
                </VStack>

                <Radio
                  value={CheckoutDeliveryType.PICKUP}
                  accessibilityLabel="Retirada no local"
                  className="ml-auto"
                />
              </HStack>
            </TouchableOpacity>
          </View>
        </Radio.Group>
      </Card>

      <Button onPress={nextStep} style={{ backgroundColor: primaryColor }}>
        <Text className="text-white font-medium">Continuar</Text>
      </Button>
    </View>
  );
}
