// Path: src/features/company-page/components/company-delivery-info.tsx
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Clock, DollarSign, ChevronRight } from "lucide-react-native";
import { useCompanyPageContext } from "../contexts/use-company-page-context";
import { Card, HStack } from "@gluestack-ui/themed";
import { THEME_COLORS } from "@/src/styles/colors";

interface CompanyDeliveryInfoProps {
  onMoreInfoPress: () => void;
}

export function CompanyDeliveryInfo({
  onMoreInfoPress,
}: CompanyDeliveryInfoProps) {
  const vm = useCompanyPageContext();

  if (!vm.config?.delivery || !vm.hasDelivery()) return null;

  const { delivery } = vm.config;

  // Formata valores monetários
  const formatCurrency = (value: string) => {
    if (!value) return "Grátis";
    const numValue = parseFloat(value) / 100;
    return numValue === 0
      ? "Grátis"
      : numValue.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        });
  };

  const primaryColor = vm.primaryColor || THEME_COLORS.primary;

  return (
    <TouchableOpacity
      onPress={onMoreInfoPress}
      className="mx-4 mb-6"
      activeOpacity={0.8}
    >
      <Card className="p-4 rounded-xl border border-gray-100 shadow-sm">
        <HStack className="items-center justify-between mb-3">
          <Text className="text-lg font-semibold text-gray-800">Delivery</Text>
          <View className="flex-row items-center">
            <Text
              className="text-primary-500 font-medium mr-1"
              style={{ color: primaryColor }}
            >
              Ver detalhes
            </Text>
            <ChevronRight size={16} color={primaryColor} />
          </View>
        </HStack>

        {/* Informações principais alinhadas horizontalmente */}
        <View className="flex-row justify-between items-center">
          {/* Tempo estimado de entrega */}
          {delivery.tempo_estimado_entrega && (
            <View className="flex-1 items-center border-r border-gray-100 pr-2">
              <View
                className="w-8 h-8 rounded-full items-center justify-center mb-1"
                style={{ backgroundColor: `${primaryColor}10` }}
              >
                <Clock size={16} color={primaryColor} />
              </View>
              <Text className="text-xs text-gray-500">Tempo</Text>
              <Text className="text-sm font-medium text-gray-800">
                {delivery.tempo_estimado_entrega} min
              </Text>
            </View>
          )}

          {/* Taxa de entrega */}
          <View className="flex-1 items-center px-2">
            <View
              className="w-8 h-8 rounded-full items-center justify-center mb-1"
              style={{ backgroundColor: `${primaryColor}10` }}
            >
              <DollarSign size={16} color={primaryColor} />
            </View>
            <Text className="text-xs text-gray-500">Taxa</Text>
            <Text className="text-sm font-medium text-gray-800">
              {formatCurrency(delivery.taxa_entrega || "0")}
            </Text>
          </View>

          {/* Pedido mínimo, se existir */}
          {delivery.pedido_minimo && (
            <View className="flex-1 items-center border-l border-gray-100 pl-2">
              <View
                className="w-8 h-8 rounded-full items-center justify-center mb-1"
                style={{ backgroundColor: `${primaryColor}10` }}
              >
                <DollarSign size={16} color={primaryColor} />
              </View>
              <Text className="text-xs text-gray-500">Mínimo</Text>
              <Text className="text-sm font-medium text-gray-800">
                {formatCurrency(delivery.pedido_minimo)}
              </Text>
            </View>
          )}
        </View>
      </Card>
    </TouchableOpacity>
  );
}
