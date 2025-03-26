// Path: src/features/company-page/components/payment-methods-display.tsx
import React from "react";
import { View, Text } from "react-native";
import { getPaymentMethod } from "@/src/utils/payment-methods.utils";
import { VStack, HStack } from "@gluestack-ui/themed";

interface PaymentOption {
  tipo: string;
  ativo: boolean;
}

interface PaymentMethodsDisplayProps {
  paymentOptions: PaymentOption[];
  compact?: boolean;
  primaryColor?: string;
}

export function PaymentMethodsDisplay({
  paymentOptions,
  compact = false,
  primaryColor = "#F4511E",
}: PaymentMethodsDisplayProps) {
  // Filtrar apenas as opções ativas
  const activeOptions = paymentOptions.filter((option) => option.ativo);

  if (activeOptions.length === 0) {
    return (
      <View className="px-3 py-2 bg-gray-100 rounded-lg">
        <Text className="text-gray-500 text-center">
          Sem informações de pagamento
        </Text>
      </View>
    );
  }

  // Layout compacto para uso em cards
  if (compact) {
    return (
      <HStack className="flex-wrap gap-2">
        {activeOptions.map((option, index) => {
          const paymentMethod = getPaymentMethod(option.tipo);
          const PaymentIcon = paymentMethod.icon;

          return (
            <View
              key={index}
              className="px-2.5 py-1.5 rounded-full flex-row items-center"
              style={{
                backgroundColor: `${paymentMethod.color}10`,
                borderWidth: 1,
                borderColor: `${paymentMethod.color}20`,
              }}
            >
              <PaymentIcon size={14} color={paymentMethod.color} />
              <Text
                className="text-xs font-medium ml-1.5"
                style={{ color: paymentMethod.color }}
              >
                {paymentMethod.label}
              </Text>
            </View>
          );
        })}
      </HStack>
    );
  }

  // Layout detalhado para uso em modais
  return (
    <View className="gap-3">
      {activeOptions.map((option, index) => {
        const paymentMethod = getPaymentMethod(option.tipo);
        const PaymentIcon = paymentMethod.icon;

        return (
          <HStack
            key={index}
            className="rounded-lg overflow-hidden border"
            style={{
              borderColor: `${paymentMethod.color}30`,
            }}
          >
            <View
              className="w-12 h-12 items-center justify-center"
              style={{ backgroundColor: `${paymentMethod.color}20` }}
            >
              <PaymentIcon size={20} color={paymentMethod.color} />
            </View>
            <View className="flex-1 py-2.5 px-3">
              <Text className="font-medium text-gray-800">
                {paymentMethod.label}
              </Text>
            </View>
          </HStack>
        );
      })}
    </View>
  );
}
