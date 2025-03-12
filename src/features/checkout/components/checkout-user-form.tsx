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
  AlertCircle,
} from "lucide-react-native";
import { useCheckoutViewModel } from "../view-models/use-checkout-view-model";
import { formatPhoneNumber } from "@/src/utils/format.utils";
import { FormValidationFeedback } from "@/components/common/form-validation-feedback";

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

  // Estado para rastrear campos que foram tocados pelo usuário
  const [touchedFields, setTouchedFields] = useState({
    name: false,
    phone: false,
    street: false,
    number: false,
    neighborhood: false,
  });

  // Verificar se a empresa especifica bairros de entrega
  const hasNeighborhoodsList =
    companyConfig?.deliveryConfig?.specifyNeighborhoods === true &&
    Array.isArray(companyConfig?.deliveryConfig?.neighborhoods) &&
    (companyConfig?.deliveryConfig?.neighborhoods?.length || 0) > 0;

  // Cor primária da empresa ou valor padrão
  const primaryColor = companyConfig?.primaryColor || "#F4511E";

  // Validar formulário cada vez que dados são alterados
  useEffect(() => {
    const isValid = isPersonalInfoValid();
    setFormValid(isValid);
  }, [personalInfo, address, deliveryMethod, isPersonalInfoValid]);

  // Validações de campos individuais
  const validations = {
    name: personalInfo.name.trim().length > 0,
    phone: personalInfo.phone.replace(/\D/g, "").length >= 10,
    street:
      deliveryMethod === "pickup" ? true : address.street.trim().length > 0,
    number:
      deliveryMethod === "pickup" ? true : address.number.trim().length > 0,
    neighborhood:
      deliveryMethod === "pickup"
        ? true
        : address.neighborhood.trim().length > 0,
    // A cidade não precisa mais ser validada
  };

  // Marcar campo como tocado
  const markFieldAsTouched = (field: keyof typeof touchedFields) => {
    setTouchedFields((prev) => ({
      ...prev,
      [field]: true,
    }));
  };

  // Verificar se um campo específico tem erro
  const hasFieldError = (field: keyof typeof touchedFields) => {
    return touchedFields[field] && !validations[field];
  };

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

    // Marcar o campo como tocado se for um campo que validamos
    if (field === "street" || field === "number" || field === "neighborhood") {
      markFieldAsTouched(field as keyof typeof touchedFields);
    }
  };

  // Selecionar bairro da lista
  const handleSelectNeighborhood = (neighborhood: string) => {
    updateAddress("neighborhood", neighborhood);
    setShowNeighborhoodSelector(false);
    markFieldAsTouched("neighborhood");
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
              onBlur={() => markFieldAsTouched("name")}
              placeholder="Digite seu nome completo"
              className={`bg-gray-50 border ${
                hasFieldError("name") ? "border-red-400" : "border-gray-200"
              } rounded-lg p-3 mt-1 text-gray-800`}
              placeholderTextColor="#9CA3AF"
              autoCapitalize="words"
            />

            {hasFieldError("name") && (
              <HStack space="xs" alignItems="center" className="mt-1">
                <AlertCircle size={14} color="#EF4444" />
                <Text className="text-xs text-red-500">
                  O nome é obrigatório
                </Text>
              </HStack>
            )}
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
              onBlur={() => markFieldAsTouched("phone")}
              placeholder="(00) 00000-0000"
              className={`bg-gray-50 border ${
                hasFieldError("phone") ? "border-red-400" : "border-gray-200"
              } rounded-lg p-3 mt-1 text-gray-800`}
              placeholderTextColor="#9CA3AF"
              keyboardType="phone-pad"
              maxLength={15} // (99) 99999-9999
            />

            {hasFieldError("phone") ? (
              <HStack space="xs" alignItems="center" className="mt-1">
                <AlertCircle size={14} color="#EF4444" />
                <Text className="text-xs text-red-500">
                  Digite um número de telefone válido
                </Text>
              </HStack>
            ) : (
              <Text className="text-xs text-gray-500 mt-1">
                Digite seu número de WhatsApp para contato
              </Text>
            )}
          </VStack>
        </VStack>

        {/* Indicador de status do formulário */}
        {formValid ? (
          <View className="mt-6 p-3 rounded-lg bg-green-50 border border-green-200">
            <HStack space="sm" alignItems="center">
              <CheckCircle size={18} color="#10B981" />
              <Text className="text-green-700 font-medium">
                Pronto para continuar
              </Text>
            </HStack>
          </View>
        ) : (
          <View className="mt-6 p-3 rounded-lg bg-yellow-50 border border-yellow-200">
            <HStack space="sm" alignItems="center">
              <Info size={18} color="#F59E0B" />
              <Text className="text-yellow-700 font-medium">
                Preencha todos os campos obrigatórios
              </Text>
            </HStack>
          </View>
        )}
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
            onBlur={() => markFieldAsTouched("name")}
            placeholder="Digite seu nome completo"
            className={`bg-gray-50 border ${
              hasFieldError("name") ? "border-red-400" : "border-gray-200"
            } rounded-lg p-3 mt-1 text-gray-800`}
            placeholderTextColor="#9CA3AF"
            autoCapitalize="words"
          />

          {hasFieldError("name") && (
            <HStack space="xs" alignItems="center" className="mt-1">
              <AlertCircle size={14} color="#EF4444" />
              <Text className="text-xs text-red-500">O nome é obrigatório</Text>
            </HStack>
          )}
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
            onBlur={() => markFieldAsTouched("phone")}
            placeholder="(00) 00000-0000"
            className={`bg-gray-50 border ${
              hasFieldError("phone") ? "border-red-400" : "border-gray-200"
            } rounded-lg p-3 mt-1 text-gray-800`}
            placeholderTextColor="#9CA3AF"
            keyboardType="phone-pad"
            maxLength={15} // (99) 99999-9999
          />

          {hasFieldError("phone") ? (
            <HStack space="xs" alignItems="center" className="mt-1">
              <AlertCircle size={14} color="#EF4444" />
              <Text className="text-xs text-red-500">
                Digite um número de telefone válido
              </Text>
            </HStack>
          ) : (
            <Text className="text-xs text-gray-500 mt-1">
              Digite seu número de WhatsApp para contato
            </Text>
          )}
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
              onBlur={() => markFieldAsTouched("street")}
              placeholder="Digite o nome da sua rua"
              className={`bg-gray-50 border ${
                hasFieldError("street") ? "border-red-400" : "border-gray-200"
              } rounded-lg p-3 text-gray-800`}
              placeholderTextColor="#9CA3AF"
            />

            {hasFieldError("street") && (
              <HStack space="xs" alignItems="center" className="mt-1">
                <AlertCircle size={14} color="#EF4444" />
                <Text className="text-xs text-red-500">
                  A rua é obrigatória
                </Text>
              </HStack>
            )}
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
                onBlur={() => markFieldAsTouched("number")}
                placeholder="Nº"
                className={`bg-gray-50 border ${
                  hasFieldError("number") ? "border-red-400" : "border-gray-200"
                } rounded-lg p-3 text-gray-800`}
                placeholderTextColor="#9CA3AF"
                keyboardType="numeric"
              />

              {hasFieldError("number") && (
                <Text className="text-xs text-red-500 mt-1">Obrigatório</Text>
              )}
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
                onBlur={() => markFieldAsTouched("neighborhood")}
                className={`bg-gray-50 border ${
                  hasFieldError("neighborhood")
                    ? "border-red-400"
                    : "border-gray-200"
                } rounded-lg p-3 flex-row justify-between items-center`}
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
                onBlur={() => markFieldAsTouched("neighborhood")}
                placeholder="Digite seu bairro"
                className={`bg-gray-50 border ${
                  hasFieldError("neighborhood")
                    ? "border-red-400"
                    : "border-gray-200"
                } rounded-lg p-3 text-gray-800`}
                placeholderTextColor="#9CA3AF"
              />
            )}

            {hasFieldError("neighborhood") && (
              <HStack space="xs" alignItems="center" className="mt-1">
                <AlertCircle size={14} color="#EF4444" />
                <Text className="text-xs text-red-500">
                  O bairro é obrigatório
                </Text>
              </HStack>
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
          <VStack space="xs" className="mt-2">
            <HStack space="sm" alignItems="center">
              <Building size={18} color={primaryColor} />
              <Text className="font-medium text-gray-700">Cidade</Text>
            </HStack>

            <View className="bg-blue-50 border border-blue-100 rounded-lg p-3">
              <HStack alignItems="center" space="sm">
                <Info size={16} color="#3B82F6" />
                <Text className="text-blue-700">
                  Atendemos apenas em{" "}
                  <Text className="font-medium">Lima Duarte (MG)</Text>
                </Text>
              </HStack>
            </View>
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

        <FormValidationFeedback
          isValid={formValid}
          isPartiallyValid={
            Object.values(validations).some(Boolean) && !formValid
          }
          validMessage="Informações completas, pronto para continuar"
          invalidMessage="Preencha todos os campos obrigatórios"
          partialMessage="Continue preenchendo os campos necessários"
          primaryColor={primaryColor}
        />
      </VStack>
    </Card>
  );
}
