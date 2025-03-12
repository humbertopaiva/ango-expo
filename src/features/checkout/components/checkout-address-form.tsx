// Path: src/features/checkout/components/checkout-address-form.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Card, VStack, HStack, Divider, Select } from "@gluestack-ui/themed";
import {
  MapPin,
  Home,
  Building,
  Navigation,
  Info,
  ChevronDown,
  CheckCircle,
} from "lucide-react-native";
import { useCheckoutViewModel } from "../view-models/use-checkout-view-model";

export function CheckoutAddressForm() {
  const {
    address,
    setAddress,
    companyConfig,
    deliveryMethod,
    setDeliveryMethod,
  } = useCheckoutViewModel();

  // Estado para o seletor de bairros (visível apenas quando o bairro for clicado)
  const [showNeighborhoodSelector, setShowNeighborhoodSelector] =
    useState(false);

  // Verificar se a empresa especifica bairros de entrega
  const hasNeighborhoodsList =
    companyConfig?.deliveryConfig?.specifyNeighborhoods &&
    companyConfig?.deliveryConfig?.neighborhoods?.length > 0;

  // Cor primária da empresa ou valor padrão
  const primaryColor = companyConfig?.primaryColor || "#F4511E";

  // Atualizar campos do endereço
  const updateAddress = (field: keyof typeof address, value: string) => {
    setAddress({
      ...address,
      [field]: value,
    });
  };

  // Selecionar bairro da lista
  const handleSelectNeighborhood = (neighborhood: string) => {
    updateAddress("neighborhood", neighborhood);
    setShowNeighborhoodSelector(false);
  };

  // Renderizar opções de métodos de entrega
  const renderDeliveryMethods = () => {
    return (
      <HStack className="mb-4 space-x-2 justify-center">
        <TouchableOpacity
          onPress={() => setDeliveryMethod("delivery")}
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
          onPress={() => setDeliveryMethod("pickup")}
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
    );
  };

  // Renderizar formulário de retirada quando o método for "pickup"
  if (deliveryMethod === "pickup") {
    return (
      <Card className="p-4 border border-gray-100">
        <VStack space="lg">
          <Text className="text-lg font-semibold text-gray-800 mb-2">
            Método de Entrega
          </Text>

          {renderDeliveryMethods()}

          <VStack className="items-center justify-center py-6 bg-gray-50 rounded-lg">
            <Building size={48} color={primaryColor} className="mb-3" />
            <Text className="text-base font-medium text-gray-800 mb-1">
              Retirada no Estabelecimento
            </Text>
            <Text className="text-sm text-gray-600 text-center max-w-xs">
              Você escolheu retirar seu pedido diretamente no estabelecimento.
              Entraremos em contato quando estiver pronto para retirada.
            </Text>

            {companyConfig?.companyName && (
              <VStack className="items-center mt-4 p-3 bg-white rounded-lg border border-gray-200 w-full">
                <Text className="text-sm text-gray-500">Retirar em:</Text>
                <Text className="text-base font-medium text-gray-800">
                  {companyConfig.companyName}
                </Text>
              </VStack>
            )}
          </VStack>
        </VStack>
      </Card>
    );
  }

  // Formulário de endereço (para método de entrega "delivery")
  return (
    <Card className="p-4 border border-gray-100">
      <VStack space="lg">
        <Text className="text-lg font-semibold text-gray-800 mb-2">
          Método de Entrega
        </Text>

        {renderDeliveryMethods()}

        <Divider />

        <Text className="text-base font-medium text-gray-800">
          Endereço de Entrega
        </Text>

        {/* Campos de endereço */}
        <VStack space="md">
          {/* Rua */}
          <VStack space="xs">
            <HStack space="sm" alignItems="center">
              <Home size={18} color={primaryColor} />
              <Text className="font-medium text-gray-700">Rua/Avenida</Text>
            </HStack>

            <TextInput
              value={address.street}
              onChangeText={(value) => updateAddress("street", value)}
              placeholder="Digite o nome da sua rua"
              className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-gray-800"
              placeholderTextColor="#9CA3AF"
            />
          </VStack>

          {/* Número e Complemento */}
          <HStack space="md">
            <VStack className="flex-1" space="xs">
              <Text className="font-medium text-gray-700">Número</Text>
              <TextInput
                value={address.number}
                onChangeText={(value) => updateAddress("number", value)}
                placeholder="Nº"
                className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-gray-800"
                placeholderTextColor="#9CA3AF"
                keyboardType="numeric"
              />
            </VStack>

            <VStack className="flex-2" space="xs">
              <Text className="font-medium text-gray-700">Complemento</Text>
              <TextInput
                value={address.complement}
                onChangeText={(value) => updateAddress("complement", value)}
                placeholder="Apto, Bloco, etc."
                className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-gray-800"
                placeholderTextColor="#9CA3AF"
              />
            </VStack>
          </HStack>

          {/* Bairro */}
          <VStack space="xs">
            <HStack space="sm" alignItems="center">
              <Building size={18} color={primaryColor} />
              <Text className="font-medium text-gray-700">Bairro</Text>
            </HStack>

            {hasNeighborhoodsList ? (
              // Seletor de bairros quando há uma lista predefinida
              <TouchableOpacity
                onPress={() =>
                  setShowNeighborhoodSelector(!showNeighborhoodSelector)
                }
                className="bg-gray-50 border border-gray-200 rounded-lg p-3 flex-row justify-between items-center"
              >
                <Text
                  className={
                    address.neighborhood ? "text-gray-800" : "text-gray-400"
                  }
                >
                  {address.neighborhood || "Selecione seu bairro"}
                </Text>
                <ChevronDown size={20} color="#9CA3AF" />
              </TouchableOpacity>
            ) : (
              // Campo de texto quando não há lista predefinida
              <TextInput
                value={address.neighborhood}
                onChangeText={(value) => updateAddress("neighborhood", value)}
                placeholder="Digite seu bairro"
                className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-gray-800"
                placeholderTextColor="#9CA3AF"
              />
            )}

            {/* Mostrar seletor de bairros quando clicado */}
            {hasNeighborhoodsList && showNeighborhoodSelector && (
              <Card className="mt-2 border border-gray-200 max-h-48 overflow-hidden">
                <ScrollView
                  className="p-2"
                  showsVerticalScrollIndicator={false}
                >
                  {companyConfig?.deliveryConfig?.neighborhoods?.map(
                    (neighborhood, index) => (
                      <TouchableOpacity
                        key={index}
                        onPress={() => handleSelectNeighborhood(neighborhood)}
                        className={`p-3 flex-row justify-between items-center ${
                          index <
                          companyConfig.deliveryConfig.neighborhoods!.length - 1
                            ? "border-b border-gray-100"
                            : ""
                        }`}
                      >
                        <Text className="text-gray-800">{neighborhood}</Text>
                        {address.neighborhood === neighborhood && (
                          <CheckCircle size={16} color={primaryColor} />
                        )}
                      </TouchableOpacity>
                    )
                  )}
                </ScrollView>
              </Card>
            )}
          </VStack>

          {/* Cidade */}
          <VStack space="xs">
            <Text className="font-medium text-gray-700">Cidade</Text>
            <TextInput
              value={address.city}
              onChangeText={(value) => updateAddress("city", value)}
              placeholder="Digite sua cidade"
              className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-gray-800"
              placeholderTextColor="#9CA3AF"
            />
          </VStack>

          {/* Ponto de referência */}
          <VStack space="xs">
            <HStack space="sm" alignItems="center">
              <Navigation size={18} color={primaryColor} />
              <Text className="font-medium text-gray-700">
                Ponto de referência (opcional)
              </Text>
            </HStack>

            <TextInput
              value={address.reference}
              onChangeText={(value) => updateAddress("reference", value)}
              placeholder="Ex: Próximo ao mercado..."
              className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-gray-800"
              placeholderTextColor="#9CA3AF"
            />

            <Text className="text-xs text-gray-500 mt-1">
              Informações adicionais para ajudar o entregador a encontrar seu
              endereço
            </Text>
          </VStack>
        </VStack>

        {/* Informações sobre taxa de entrega e tempo estimado */}
        {companyConfig?.deliveryConfig && (
          <View className="bg-blue-50 p-4 rounded-lg mt-2">
            <HStack space="sm" alignItems="center" className="mb-2">
              <Info size={18} color="#1E40AF" />
              <Text className="font-medium text-blue-800">
                Informações de Entrega
              </Text>
            </HStack>

            <VStack space="sm">
              {companyConfig.deliveryConfig.estimatedTime && (
                <Text className="text-sm text-blue-700">
                  • Tempo estimado: {companyConfig.deliveryConfig.estimatedTime}{" "}
                  minutos
                </Text>
              )}

              {companyConfig.deliveryConfig.deliveryFee && (
                <Text className="text-sm text-blue-700">
                  • Taxa de entrega:{" "}
                  {parseFloat(companyConfig.deliveryConfig.deliveryFee) > 0
                    ? (
                        parseFloat(companyConfig.deliveryConfig.deliveryFee) /
                        100
                      ).toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })
                    : "Grátis"}
                </Text>
              )}

              {companyConfig.deliveryConfig.minOrderValue &&
                parseFloat(companyConfig.deliveryConfig.minOrderValue) > 0 && (
                  <Text className="text-sm text-blue-700">
                    • Pedido mínimo:{" "}
                    {(
                      parseFloat(companyConfig.deliveryConfig.minOrderValue) /
                      100
                    ).toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </Text>
                )}
            </VStack>
          </View>
        )}
      </VStack>
    </Card>
  );
}
