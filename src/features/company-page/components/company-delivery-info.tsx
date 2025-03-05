// src/features/company-page/components/company-delivery-info.tsx
import React from "react";
import { View, Text } from "react-native";
import { Clock, MapPin, DollarSign } from "lucide-react-native";
import { useCompanyPageContext } from "../contexts/use-company-page-context";
import { Card } from "@gluestack-ui/themed";

export function CompanyDeliveryInfo() {
  const vm = useCompanyPageContext();

  if (!vm.config?.delivery || !vm.hasDelivery()) return null;

  const delivery = vm.config.delivery;

  // Formata valores monetários
  const formatCurrency = (value: string) => {
    const numValue = parseFloat(value) / 100;
    return numValue.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  return (
    <Card className="mx-4 mt-4">
      <View className="p-4">
        <Text className="text-lg font-semibold mb-4">
          Informações de Entrega
        </Text>
        <View className="space-y-4">
          <View className="flex-row items-start gap-3">
            <Clock size={20} color="#6B7280" />
            <View>
              <Text className="font-medium">Tempo estimado</Text>
              <Text className="text-sm text-gray-600">
                {delivery.tempo_estimado_entrega} minutos
              </Text>
            </View>
          </View>

          <View className="flex-row items-start gap-3">
            <MapPin size={20} color="#6B7280" />
            <View>
              <Text className="font-medium">Área de entrega</Text>
              {delivery.especificar_bairros_atendidos ? (
                <View>
                  <Text className="text-sm text-gray-600">
                    Entregamos nos bairros:
                  </Text>
                  <View className="ml-4 mt-1">
                    {delivery.bairros_atendidos.map((bairro, index) => (
                      <Text key={index} className="text-sm text-gray-600">
                        • {bairro}
                      </Text>
                    ))}
                  </View>
                </View>
              ) : (
                <Text className="text-sm text-gray-600">
                  Consulte a disponibilidade
                </Text>
              )}
            </View>
          </View>

          <View className="flex-row items-start gap-3">
            <DollarSign size={20} color="#6B7280" />
            <View>
              <Text className="font-medium">Taxas</Text>
              <View className="space-y-1">
                <Text className="text-sm text-gray-600">
                  Taxa de entrega: {formatCurrency(delivery.taxa_entrega)}
                </Text>
                <Text className="text-sm text-gray-600">
                  Pedido mínimo: {formatCurrency(delivery.pedido_minimo)}
                </Text>
              </View>
            </View>
          </View>

          {delivery.observacoes && (
            <View className="mt-4 p-3 bg-gray-100 rounded-lg">
              <Text className="text-sm">{delivery.observacoes}</Text>
            </View>
          )}
        </View>
      </View>
    </Card>
  );
}
