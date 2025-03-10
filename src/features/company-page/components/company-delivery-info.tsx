// Path: src/features/company-page/components/Company-delivery-info.tsx
import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import {
  Clock,
  MapPin,
  DollarSign,
  ChevronDown,
  ChevronUp,
  Truck,
} from "lucide-react-native";
import { useCompanyPageContext } from "../contexts/use-company-page-context";
import { Card, HStack, VStack } from "@gluestack-ui/themed";
import { THEME_COLORS } from "@/src/styles/colors";

interface CompanyDeliveryInfoProps {
  showTitle?: boolean;
}

/**
 * Componente aprimorado para exibir informações de entrega
 */
export function CompanyDeliveryInfo({
  showTitle = true,
}: CompanyDeliveryInfoProps) {
  const vm = useCompanyPageContext();
  const [expanded, setExpanded] = useState(false);

  if (!vm.config?.delivery || !vm.hasDelivery()) return null;

  const { delivery } = vm.config;

  // Formata valores monetários
  const formatCurrency = (value: string) => {
    if (!value) return "R$ 0,00";
    const numValue = parseFloat(value) / 100;
    return numValue.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  const primaryColor = vm.primaryColor || THEME_COLORS.primary;

  return (
    <Card className="mx-4 mb-6 overflow-hidden rounded-xl border border-gray-100">
      {/* Cabeçalho */}
      <TouchableOpacity
        className="p-4 flex-row items-center justify-between"
        onPress={() => setExpanded(!expanded)}
        style={{ backgroundColor: `${primaryColor}10` }}
      >
        <HStack space="md" alignItems="center">
          <View
            className="w-10 h-10 rounded-full items-center justify-center"
            style={{ backgroundColor: `${primaryColor}20` }}
          >
            <Truck size={20} color={primaryColor} />
          </View>

          <VStack>
            <Text className="font-semibold text-gray-800">
              Informações de Entrega
            </Text>
            <Text className="text-xs text-gray-500">
              {expanded ? "Toque para recolher" : "Toque para expandir"}
            </Text>
          </VStack>
        </HStack>

        {expanded ? (
          <ChevronUp size={20} color="#6B7280" />
        ) : (
          <ChevronDown size={20} color="#6B7280" />
        )}
      </TouchableOpacity>

      {/* Conteúdo expandido */}
      {expanded && (
        <View className="p-4 border-t border-gray-100">
          <View className="space-y-4">
            <HStack space="md">
              <Clock size={18} color="#6B7280" />
              <VStack flex={1}>
                <Text className="font-medium text-gray-800">
                  Tempo estimado
                </Text>
                <Text className="text-gray-600">
                  {delivery.tempo_estimado_entrega} minutos
                </Text>
              </VStack>
            </HStack>

            <HStack space="md">
              <MapPin size={18} color="#6B7280" />
              <VStack flex={1}>
                <Text className="font-medium text-gray-800">
                  Área de entrega
                </Text>
                {delivery.especificar_bairros_atendidos ? (
                  <>
                    <Text className="text-gray-600">
                      Entregamos nos bairros:
                    </Text>
                    <View className="ml-2 mt-1">
                      {delivery.bairros_atendidos.map((bairro, index) => (
                        <Text key={index} className="text-gray-600 text-sm">
                          • {bairro}
                        </Text>
                      ))}
                    </View>
                  </>
                ) : (
                  <Text className="text-gray-600">
                    Consulte a disponibilidade
                  </Text>
                )}
              </VStack>
            </HStack>

            <HStack space="md">
              <DollarSign size={18} color="#6B7280" />
              <VStack flex={1}>
                <Text className="font-medium text-gray-800">Taxas</Text>
                <HStack flexWrap="wrap" space="sm">
                  <Text className="text-gray-600">
                    Taxa de entrega: {formatCurrency(delivery.taxa_entrega)}
                  </Text>
                  <Text className="text-gray-600">
                    Pedido mínimo: {formatCurrency(delivery.pedido_minimo)}
                  </Text>
                </HStack>
              </VStack>
            </HStack>

            {delivery.observacoes && (
              <View className="p-3 bg-gray-50 rounded-lg mt-2">
                <Text className="text-sm text-gray-700">
                  {delivery.observacoes}
                </Text>
              </View>
            )}
          </View>
        </View>
      )}
    </Card>
  );
}
