// Path: src/features/cart/components/cart-delivery-selector.tsx

import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { HStack, VStack, Badge } from "@gluestack-ui/themed";
import { Truck, Home } from "lucide-react-native";
import { CompanyConfig } from "@/src/features/company-page/models/company-config";
import { DeliveryInfoService } from "../services/delivery-info.service";

interface CartDeliverySelectorProps {
  isDelivery: boolean;
  onToggleDeliveryMode: () => void;
  subtotal: number;
  deliveryFee: number;
  config: CompanyConfig | null;
  primaryColor: string;
}

export const CartDeliverySelector: React.FC<CartDeliverySelectorProps> = ({
  isDelivery,
  onToggleDeliveryMode,
  subtotal,
  deliveryFee,
  config,
  primaryColor,
}) => {
  // Verificar se atingiu o valor mínimo para entrega
  const hasReachedMinimum = DeliveryInfoService.hasReachedMinimumOrderValue(
    subtotal,
    config
  );

  // Obter o valor mínimo formatado
  const getMinimumOrderValue = () => {
    if (!config?.delivery?.pedido_minimo) return null;
    return DeliveryInfoService.formatCurrency(config.delivery.pedido_minimo);
  };

  // Obter o valor restante para atingir o mínimo
  const getRemainingValue = () => {
    if (!config?.delivery?.pedido_minimo) return 0;
    const minValue = parseFloat(config.delivery.pedido_minimo);
    return Math.max(0, minValue - subtotal);
  };

  return (
    <View className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
      <Text className="text-base font-medium text-gray-800 mb-3">
        Como você deseja receber seu pedido?
      </Text>

      <HStack className="justify-between mb-2">
        {/* Opção de Entrega */}
        <TouchableOpacity
          className={`flex-1 p-3 rounded-lg border ${
            isDelivery ? "border-2" : "border"
          }`}
          style={{
            borderColor: isDelivery ? primaryColor : "#E5E7EB",
            backgroundColor: isDelivery ? `${primaryColor}10` : "white",
          }}
          onPress={() => {
            if (!isDelivery) onToggleDeliveryMode();
          }}
        >
          <VStack className="items-center space-y-1">
            <Truck size={24} color={isDelivery ? primaryColor : "#6B7280"} />
            <Text
              className="font-medium text-center"
              style={{ color: isDelivery ? primaryColor : "#6B7280" }}
            >
              Entrega
            </Text>
            {deliveryFee > 0 ? (
              <Text className="text-xs text-gray-500">
                {DeliveryInfoService.formatCurrency(deliveryFee)}
              </Text>
            ) : (
              <Text className="text-xs text-green-600 font-medium">Grátis</Text>
            )}
          </VStack>
        </TouchableOpacity>

        {/* Espaçador */}
        <View className="w-4" />

        {/* Opção de Retirada */}
        <TouchableOpacity
          className={`flex-1 p-3 rounded-lg border ${
            !isDelivery ? "border-2" : "border"
          }`}
          style={{
            borderColor: !isDelivery ? primaryColor : "#E5E7EB",
            backgroundColor: !isDelivery ? `${primaryColor}10` : "white",
          }}
          onPress={() => {
            if (isDelivery) onToggleDeliveryMode();
          }}
        >
          <VStack className="items-center space-y-1">
            <Home size={24} color={!isDelivery ? primaryColor : "#6B7280"} />
            <Text
              className="font-medium text-center"
              style={{ color: !isDelivery ? primaryColor : "#6B7280" }}
            >
              Retirada
            </Text>
            <Text className="text-xs text-gray-500">No local</Text>
          </VStack>
        </TouchableOpacity>
      </HStack>

      {/* Mensagem de valor mínimo */}
      {isDelivery && !hasReachedMinimum && getMinimumOrderValue() && (
        <View className="mt-2 p-2 bg-amber-50 rounded-md border border-amber-200">
          <Text className="text-amber-800 text-sm">
            Valor mínimo para entrega: {getMinimumOrderValue()}
          </Text>
          <Text className="text-amber-800 text-sm">
            Adicione mais{" "}
            {DeliveryInfoService.formatCurrency(getRemainingValue())} ao seu
            pedido.
          </Text>
        </View>
      )}
    </View>
  );
};
