// Path: src/features/checkout/components/delivery-method-selector.tsx
import React from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { Card, HStack } from "@gluestack-ui/themed";
import { MapPin, Building } from "lucide-react-native";
import { useCheckoutViewModel } from "../view-models/use-checkout-view-model";
import { DeliveryMethod } from "../view-models/use-checkout-view-model";

export function DeliveryMethodSelector() {
  const { deliveryMethod, setDeliveryMethod, companyConfig } =
    useCheckoutViewModel();

  // Cor primária da empresa ou valor padrão
  const primaryColor = companyConfig?.primaryColor || "#F4511E";

  // Função para tratar a mudança do método de entrega
  const handleDeliveryMethodChange = (method: DeliveryMethod) => {
    // Se estiver mudando de delivery para pickup, confirmar a mudança
    // pois isso vai limpar os campos de endereço
    if (deliveryMethod === "delivery" && method === "pickup") {
      Alert.alert(
        "Mudar para Retirada?",
        "Ao selecionar retirada, você precisará buscar seu pedido no estabelecimento. Deseja continuar?",
        [
          {
            text: "Cancelar",
            style: "cancel",
          },
          {
            text: "Confirmar",
            onPress: () => setDeliveryMethod(method),
          },
        ]
      );
    } else {
      // Método mudando de pickup para delivery ou inicialização
      setDeliveryMethod(method);
    }
  };

  return (
    <Card className="p-4 border border-gray-100 mb-4">
      <Text className="text-lg font-semibold text-gray-800 mb-4">
        Método de Entrega
      </Text>

      <HStack className="mb-2 space-x-2 justify-center">
        <TouchableOpacity
          onPress={() => handleDeliveryMethodChange("delivery")}
          className={`flex-1 p-3 rounded-lg border ${
            deliveryMethod === "delivery"
              ? "border-primary-500 bg-primary-50"
              : "border-gray-200 bg-white"
          }`}
          style={{
            borderColor:
              deliveryMethod === "delivery" ? primaryColor : "#E5E7EB",
            backgroundColor:
              deliveryMethod === "delivery" ? `${primaryColor}10` : "white",
          }}
        >
          <HStack className="items-center justify-center space-x-2">
            <MapPin
              size={18}
              color={deliveryMethod === "delivery" ? primaryColor : "#6B7280"}
            />
            <Text
              className={`font-medium ${
                deliveryMethod === "delivery"
                  ? "text-primary-700"
                  : "text-gray-700"
              }`}
              style={{
                color: deliveryMethod === "delivery" ? primaryColor : "#374151",
              }}
            >
              Entrega
            </Text>
          </HStack>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => handleDeliveryMethodChange("pickup")}
          className={`flex-1 p-3 rounded-lg border ${
            deliveryMethod === "pickup"
              ? "border-primary-500 bg-primary-50"
              : "border-gray-200 bg-white"
          }`}
          style={{
            borderColor: deliveryMethod === "pickup" ? primaryColor : "#E5E7EB",
            backgroundColor:
              deliveryMethod === "pickup" ? `${primaryColor}10` : "white",
          }}
        >
          <HStack className="items-center justify-center space-x-2">
            <Building
              size={18}
              color={deliveryMethod === "pickup" ? primaryColor : "#6B7280"}
            />
            <Text
              className={`font-medium ${
                deliveryMethod === "pickup"
                  ? "text-primary-700"
                  : "text-gray-700"
              }`}
              style={{
                color: deliveryMethod === "pickup" ? primaryColor : "#374151",
              }}
            >
              Retirar
            </Text>
          </HStack>
        </TouchableOpacity>
      </HStack>

      {/* Exibir informações sobre delivery ou retirada */}
      {deliveryMethod === "delivery" ? (
        <View className="bg-blue-50 p-3 rounded-lg mt-2">
          <Text className="text-sm text-blue-700">
            Entregamos em seu endereço. Você fornecerá os detalhes na próxima
            etapa.
            {companyConfig?.deliveryConfig?.deliveryFee &&
              ` Taxa de entrega: ${
                parseFloat(companyConfig.deliveryConfig.deliveryFee) > 0
                  ? (
                      parseFloat(companyConfig.deliveryConfig.deliveryFee) / 100
                    ).toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })
                  : "Grátis"
              }`}
          </Text>
        </View>
      ) : (
        <View className="bg-green-50 p-3 rounded-lg mt-2">
          <Text className="text-sm text-green-700">
            Você retirará seu pedido diretamente no estabelecimento quando
            estiver pronto.
          </Text>
        </View>
      )}
    </Card>
  );
}
