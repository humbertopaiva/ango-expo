// Path: src/features/checkout/components/delivery-fee-summary.tsx

import React from "react";
import { View, Text } from "react-native";
import { HStack, VStack, Badge } from "@gluestack-ui/themed";
import { Truck, Info } from "lucide-react-native";
import { CheckoutDeliveryType } from "../models/checkout";

interface DeliveryFeeSummaryProps {
  deliveryFee: number;
  deliveryType: CheckoutDeliveryType;
  primaryColor: string;
}

export function DeliveryFeeSummary({
  deliveryFee,
  deliveryType,
  primaryColor,
}: DeliveryFeeSummaryProps) {
  const isDelivery = deliveryType === CheckoutDeliveryType.DELIVERY;
  const isDeliveryFree = deliveryFee === 0;

  // Se não for entrega, não mostrar nada
  if (!isDelivery) return null;

  const formattedFee = deliveryFee.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  return (
    <View
      className="mb-4 p-3 rounded-lg"
      style={{ backgroundColor: `${primaryColor}10` }}
    >
      <HStack className="justify-between items-center">
        <HStack space="sm" alignItems="center">
          <Truck size={16} color={primaryColor} />
          <Text className="font-medium text-gray-700">Taxa de entrega:</Text>
        </HStack>

        {isDeliveryFree ? (
          <Badge
            bg="green.100"
            borderColor="green.500"
            borderWidth={1}
            rounded="md"
          >
            <Text className="text-green-700 font-medium px-1">Grátis</Text>
          </Badge>
        ) : (
          <Text className="font-bold" style={{ color: primaryColor }}>
            {formattedFee}
          </Text>
        )}
      </HStack>

      {!isDeliveryFree && (
        <HStack className="mt-2 items-start">
          <Info size={14} color={primaryColor} className="mt-0.5 mr-1" />
          <Text className="text-xs text-gray-600 flex-1">
            Esta taxa será adicionada ao valor final do seu pedido para cobrir
            os custos de entrega.
          </Text>
        </HStack>
      )}
    </View>
  );
}
