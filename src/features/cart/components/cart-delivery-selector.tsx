// Path: src/features/cart/components/cart-delivery-selector.tsx

import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { HStack, VStack, Badge } from "@gluestack-ui/themed";
import { Truck, Home } from "lucide-react-native";
import { CompanyConfig } from "@/src/features/company-page/models/company-config";
import { DeliveryInfoService } from "../services/delivery-info.service";
import { DeliveryConfig } from "@/src/features/checkout/services/delivery-config.service";

interface CartDeliverySelectorProps {
  isDelivery: boolean;
  onToggleDeliveryMode: () => void;
  subtotal: number;
  deliveryFee: number;
  config: CompanyConfig | DeliveryConfig | null;
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

  // Obter o valor mínimo e formatá-lo
  const minimumOrderValue = DeliveryInfoService.getMinimumOrderValue(config);
  const formattedMinimumValue =
    DeliveryInfoService.formatCurrency(minimumOrderValue);

  // Calcular valor restante para atingir o mínimo
  const remainingValue = Math.max(0, minimumOrderValue - subtotal);
  const formattedRemainingValue =
    DeliveryInfoService.formatCurrency(remainingValue);

  // Verificar se a empresa tem bairros específicos
  const hasSpecificNeighborhoods =
    DeliveryInfoService.hasSpecificNeighborhoods(config);
  const neighborhoods = DeliveryInfoService.getNeighborhoodsList(config);

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
          <VStack className="items-center gap-1">
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
          <VStack className="items-center gap-1">
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
      {isDelivery && !hasReachedMinimum && minimumOrderValue > 0 && (
        <View className="mt-2 p-2 bg-amber-50 rounded-md border border-amber-200">
          <Text className="text-amber-800 text-sm">
            Valor mínimo para entrega: {formattedMinimumValue}
          </Text>
          <Text className="text-amber-800 text-sm">
            Adicione mais {formattedRemainingValue} ao seu pedido.
          </Text>
        </View>
      )}

      {/* Alerta sobre bairros específicos */}
      {isDelivery && hasSpecificNeighborhoods && neighborhoods.length > 0 && (
        <View className="mt-2 p-2 bg-blue-50 rounded-md border border-blue-200">
          <Text className="text-blue-800 text-sm">
            Entrega disponível apenas para bairros selecionados. Verifique
            disponibilidade no checkout.
          </Text>
        </View>
      )}
    </View>
  );
};
