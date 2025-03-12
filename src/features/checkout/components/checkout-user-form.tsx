// Path: src/features/checkout/components/checkout-user-form.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
} from "react-native";
import { Card, VStack, HStack, Divider } from "@gluestack-ui/themed";
import {
  User,
  Phone,
  MapPin,
  Home,
  Building,
  Navigation,
  Info,
  ChevronDown,
  CheckCircle,
} from "lucide-react-native";
import { useCheckoutViewModel } from "../view-models/use-checkout-view-model";
import { formatPhoneNumber } from "@/src/utils/format.utils";

export function CheckoutUserForm() {
  const {
    personalInfo,
    setPersonalInfo,
    address,
    setAddress,
    companyConfig,
    deliveryMethod,
    isPersonalInfoValid,
  } = useCheckoutViewModel();

  // Estado local para o telefone formatado
  const [formattedPhone, setFormattedPhone] = useState(
    formatPhoneNumber(personalInfo.phone || "")
  );

  // Estado para o seletor de bairros
  const [showNeighborhoodSelector, setShowNeighborhoodSelector] =
    useState(false);

  // Estado para validação em tempo real
  const [formValid, setFormValid] = useState(false);

  // Verificar se a empresa especifica bairros de entrega (com verificações de null safety)
  const hasNeighborhoodsList =
    companyConfig?.deliveryConfig?.specifyNeighborhoods === true &&
    Array.isArray(companyConfig?.deliveryConfig?.neighborhoods) &&
    (companyConfig?.deliveryConfig?.neighborhoods?.length || 0) > 0;

  // Cor primária da empresa ou valor padrão
  const primaryColor = companyConfig?.primaryColor || "#F4511E";

  // Validar formulário cada vez que dados são alterados
  useEffect(() => {
    const isValid = isPersonalInfoValid();
    console.log("Validação do formulário:", isValid);
    setFormValid(isValid);
  }, [personalInfo, address, deliveryMethod, isPersonalInfoValid]);

  // Atualizar nome
  const handleNameChange = (value: string) => {
    setPersonalInfo({
      ...personalInfo,
      name: value,
    });
  };

  // Atualizar telefone com formatação
  const handlePhoneChange = (value: string) => {
    // Manter apenas dígitos
    const numericValue = value.replace(/\D/g, "");

    // Formatar para exibição
    const formatted = formatPhoneNumber(numericValue);
    setFormattedPhone(formatted);

    // Atualizar o estado com o valor numérico
    setPersonalInfo({
      ...personalInfo,
      phone: numericValue,
    });
  };

  // Atualizar campos do endereço
  const updateAddress = (field: keyof typeof address, value: string) => {
    setAddress((prevAddress) => ({
      ...prevAddress,
      [field]: value,
    }));
  };

  // Selecionar bairro da lista
  const handleSelectNeighborhood = (neighborhood: string) => {
    updateAddress("neighborhood", neighborhood);
    setShowNeighborhoodSelector(false);
  };

  // Se o método de entrega é "pickup", não mostrar campos de endereço
  if (deliveryMethod === "pickup") {
    return (
      <Card className="p-4 border border-gray-100 overflow-hidden">
        <Text className="text-lg font-semibold text-gray-800 mb-4">
          Suas Informações
        </Text>

        <VStack space="lg">
          {/* Campo de nome completo */}
          <VStack space="xs">
            <HStack space="sm" alignItems="center">
              <User size={18} color={primaryColor} />
              <Text className="font-medium text-gray-700">Nome completo</Text>
              <Text className="text-red-500">*</Text>
            </HStack>

            <TextInput
              value={personalInfo.name}
              onChangeText={handleNameChange}
              placeholder="Digite seu nome completo"
              className="bg-gray-50 border border-gray-200 rounded-lg p-3 mt-1 text-gray-800"
              placeholderTextColor="#9CA3AF"
              autoCapitalize="words"
            />

            <Text className="text-xs text-gray-500 mt-1">
              Digite seu nome completo para identificação do pedido
            </Text>
          </VStack>

          {/* Campo de telefone */}
          <VStack space="xs">
            <HStack space="sm" alignItems="center">
              <Phone size={18} color={primaryColor} />
              <Text className="font-medium text-gray-700">WhatsApp</Text>
              <Text className="text-red-500">*</Text>
            </HStack>

            <TextInput
              value={formattedPhone}
              onChangeText={handlePhoneChange}
              placeholder="(00) 00000-0000"
              className="bg-gray-50 border border-gray-200 rounded-lg p-3 mt-1 text-gray-800"
              placeholderTextColor="#9CA3AF"
              keyboardType="phone-pad"
              maxLength={15} // (99) 99999-9999
            />

            <Text className="text-xs text-gray-500 mt-1">
              Digite seu número de WhatsApp para contato
            </Text>
          </VStack>
        </VStack>

        {/* Indicador de status do formulário (apenas para debug) */}
        <View
          className="mt-4 p-2 rounded-lg"
          style={{ backgroundColor: formValid ? "#d1fae5" : "#fee2e2" }}
        >
          <Text className={formValid ? "text-green-700" : "text-red-700"}>
            {formValid
              ? "Dados válidos"
              : "Preencha todos os campos obrigatórios"}
          </Text>
        </View>
      </Card>
    );
  }

  return (
    <Card className="p-4 border border-gray-100 overflow-hidden">
      <Text className="text-lg font-semibold text-gray-800 mb-4">
        Suas Informações
      </Text>

      <VStack space="lg">
        {/* Campo de nome completo */}
        <VStack space="xs">
          <HStack space="sm" alignItems="center">
            <User size={18} color={primaryColor} />
            <Text className="font-medium text-gray-700">Nome completo</Text>
            <Text className="text-red-500">*</Text>
          </HStack>

          <TextInput
            value={personalInfo.name}
            onChangeText={handleNameChange}
            placeholder="Digite seu nome completo"
            className="bg-gray-50 border border-gray-200 rounded-lg p-3 mt-1 text-gray-800"
            placeholderTextColor="#9CA3AF"
            autoCapitalize="words"
          />
        </VStack>

        {/* Campo de telefone */}
        <VStack space="xs">
          <HStack space="sm" alignItems="center">
            <Phone size={18} color={primaryColor} />
            <Text className="font-medium text-gray-700">WhatsApp</Text>
            <Text className="text-red-500">*</Text>
          </HStack>

          <TextInput
            value={formattedPhone}
            onChangeText={handlePhoneChange}
            placeholder="(00) 00000-0000"
            className="bg-gray-50 border border-gray-200 rounded-lg p-3 mt-1 text-gray-800"
            placeholderTextColor="#9CA3AF"
            keyboardType="phone-pad"
            maxLength={15} // (99) 99999-9999
          />

          <Text className="text-xs text-gray-500 mt-1">
            Digite seu número de WhatsApp para contato
          </Text>
        </VStack>

        <Divider my="$2" />

        {/* Seção de endereço */}
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
              <Text className="text-red-500">*</Text>
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
              <HStack space="sm" alignItems="center">
                <Text className="font-medium text-gray-700">Número</Text>
                <Text className="text-red-500">*</Text>
              </HStack>
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
                value={address.complement || ""}
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
              <Text className="text-red-500">*</Text>
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
                          (companyConfig?.deliveryConfig?.neighborhoods
                            ?.length || 0) -
                            1
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
            <HStack space="sm" alignItems="center">
              <Text className="font-medium text-gray-700">Cidade</Text>
              <Text className="text-red-500">*</Text>
            </HStack>
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
              value={address.reference || ""}
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

        {/* Indicador de status do formulário (apenas para debug) */}
        <View
          className="mt-4 p-2 rounded-lg"
          style={{ backgroundColor: formValid ? "#d1fae5" : "#fee2e2" }}
        >
          <Text className={formValid ? "text-green-700" : "text-red-700"}>
            {formValid
              ? "Dados válidos"
              : "Preencha todos os campos obrigatórios"}
          </Text>
        </View>
      </VStack>
    </Card>
  );
}
