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
import { Controller } from "react-hook-form";

export function CheckoutUserForm() {
  const {
    personalInfo,
    setPersonalInfo,
    address,
    setAddress,
    companyConfig,
    deliveryMethod,
    isPersonalInfoValid,
    control,
    errors,
    formMethods,
    showValidationErrors, // Use o estado de controle de exibição de erros
  } = useCheckoutViewModel();

  // Estado local para o telefone formatado - apenas para exibição
  const [formattedPhone, setFormattedPhone] = useState(
    formatPhoneNumber(personalInfo.phone || "")
  );

  // Estado para o seletor de bairros
  const [showNeighborhoodSelector, setShowNeighborhoodSelector] =
    useState(false);

  // Verificar se a empresa especifica bairros de entrega
  const hasNeighborhoodsList =
    companyConfig?.deliveryConfig?.specifyNeighborhoods === true &&
    Array.isArray(companyConfig?.deliveryConfig?.neighborhoods) &&
    (companyConfig?.deliveryConfig?.neighborhoods?.length || 0) > 0;

  // Cor primária da empresa ou valor padrão
  const primaryColor = companyConfig?.primaryColor || "#F4511E";

  // Verificar se o formulário é válido
  const [formValid, setFormValid] = useState(false);

  // Verificar validade do formulário sempre que os campos mudarem
  useEffect(() => {
    const checkFormValidity = async () => {
      const isValid = await isPersonalInfoValid();
      setFormValid(isValid);
    };

    checkFormValidity();
  }, [personalInfo, address, deliveryMethod, isPersonalInfoValid]);

  // Atualizar telefone com formatação
  const handlePhoneChange = (value: string) => {
    // Manter apenas dígitos
    const numericValue = value.replace(/\D/g, "");

    // Formatar para exibição
    const formatted = formatPhoneNumber(numericValue);
    setFormattedPhone(formatted);

    // Atualizar o estado com o valor numérico
    setPersonalInfo({
      phone: numericValue,
    });
  };

  // Atualizar campos do endereço
  const updateAddress = (field: keyof typeof address, value: string) => {
    setAddress({
      [field]: value,
    });
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

            <Controller
              control={control}
              name="personalInfo.name"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  value={value}
                  onChangeText={(text) => {
                    onChange(text);
                    setPersonalInfo({ name: text });
                  }}
                  onBlur={onBlur}
                  placeholder="Digite seu nome completo"
                  className={`bg-gray-50 border ${
                    errors.personalInfo?.name && showValidationErrors
                      ? "border-red-400"
                      : "border-gray-200"
                  } rounded-lg p-3 mt-1 text-gray-800`}
                  placeholderTextColor="#9CA3AF"
                  autoCapitalize="words"
                />
              )}
            />

            {errors.personalInfo?.name && showValidationErrors && (
              <HStack space="xs" alignItems="center" className="mt-1">
                <AlertCircle size={14} color="#EF4444" />
                <Text className="text-xs text-red-500">
                  {errors.personalInfo.name.message}
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

            <Controller
              control={control}
              name="personalInfo.phone"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  value={formattedPhone}
                  onChangeText={(text) => {
                    const numericValue = text.replace(/\D/g, "");
                    const formatted = formatPhoneNumber(numericValue);
                    setFormattedPhone(formatted);
                    onChange(numericValue);
                    setPersonalInfo({ phone: numericValue });
                  }}
                  onBlur={onBlur}
                  placeholder="(00) 00000-0000"
                  className={`bg-gray-50 border ${
                    errors.personalInfo?.phone && showValidationErrors
                      ? "border-red-400"
                      : "border-gray-200"
                  } rounded-lg p-3 mt-1 text-gray-800`}
                  placeholderTextColor="#9CA3AF"
                  keyboardType="phone-pad"
                  maxLength={15} // (99) 99999-9999
                />
              )}
            />

            {errors.personalInfo?.phone && showValidationErrors ? (
              <HStack space="xs" alignItems="center" className="mt-1">
                <AlertCircle size={14} color="#EF4444" />
                <Text className="text-xs text-red-500">
                  {errors.personalInfo.phone.message}
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
        <FormValidationFeedback
          isValid={formValid}
          isPartiallyValid={!!personalInfo.name || !!personalInfo.phone}
          validMessage="Pronto para continuar"
          invalidMessage="Preencha todos os campos obrigatórios"
          partialMessage="Continue preenchendo os campos necessários"
          primaryColor={primaryColor}
        />
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

          <Controller
            control={control}
            name="personalInfo.name"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                value={value}
                onChangeText={(text) => {
                  onChange(text);
                  setPersonalInfo({ name: text });
                }}
                onBlur={onBlur}
                placeholder="Digite seu nome completo"
                className={`bg-gray-50 border ${
                  errors.personalInfo?.name && showValidationErrors
                    ? "border-red-400"
                    : "border-gray-200"
                } rounded-lg p-3 mt-1 text-gray-800`}
                placeholderTextColor="#9CA3AF"
                autoCapitalize="words"
              />
            )}
          />

          {errors.personalInfo?.name && showValidationErrors && (
            <HStack space="xs" alignItems="center" className="mt-1">
              <AlertCircle size={14} color="#EF4444" />
              <Text className="text-xs text-red-500">
                {errors.personalInfo.name.message}
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

          <Controller
            control={control}
            name="personalInfo.phone"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                value={formattedPhone}
                onChangeText={(text) => {
                  const numericValue = text.replace(/\D/g, "");
                  const formatted = formatPhoneNumber(numericValue);
                  setFormattedPhone(formatted);
                  onChange(numericValue);
                  setPersonalInfo({ phone: numericValue });
                }}
                onBlur={onBlur}
                placeholder="(00) 00000-0000"
                className={`bg-gray-50 border ${
                  errors.personalInfo?.phone && showValidationErrors
                    ? "border-red-400"
                    : "border-gray-200"
                } rounded-lg p-3 mt-1 text-gray-800`}
                placeholderTextColor="#9CA3AF"
                keyboardType="phone-pad"
                maxLength={15} // (99) 99999-9999
              />
            )}
          />

          {errors.personalInfo?.phone && showValidationErrors ? (
            <HStack space="xs" alignItems="center" className="mt-1">
              <AlertCircle size={14} color="#EF4444" />
              <Text className="text-xs text-red-500">
                {errors.personalInfo.phone.message}
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

            <Controller
              control={control}
              name="address.street"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  value={value}
                  onChangeText={(text) => {
                    onChange(text);
                    updateAddress("street", text);
                  }}
                  onBlur={onBlur}
                  placeholder="Digite o nome da sua rua"
                  className={`bg-gray-50 border ${
                    errors.address?.street && showValidationErrors
                      ? "border-red-400"
                      : "border-gray-200"
                  } rounded-lg p-3 text-gray-800`}
                  placeholderTextColor="#9CA3AF"
                />
              )}
            />

            {errors.address?.street && showValidationErrors && (
              <HStack space="xs" alignItems="center" className="mt-1">
                <AlertCircle size={14} color="#EF4444" />
                <Text className="text-xs text-red-500">
                  {errors.address.street.message}
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
              <Controller
                control={control}
                name="address.number"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    value={value}
                    onChangeText={(text) => {
                      onChange(text);
                      updateAddress("number", text);
                    }}
                    onBlur={onBlur}
                    placeholder="Nº"
                    className={`bg-gray-50 border ${
                      errors.address?.number && showValidationErrors
                        ? "border-red-400"
                        : "border-gray-200"
                    } rounded-lg p-3 text-gray-800`}
                    placeholderTextColor="#9CA3AF"
                    keyboardType="numeric"
                  />
                )}
              />

              {errors.address?.number && showValidationErrors && (
                <Text className="text-xs text-red-500 mt-1">
                  {errors.address.number.message}
                </Text>
              )}
            </VStack>

            <VStack className="flex-2" space="xs">
              <Text className="font-medium text-gray-700">Complemento</Text>
              <Controller
                control={control}
                name="address.complement"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    value={value || ""}
                    onChangeText={(text) => {
                      onChange(text);
                      updateAddress("complement", text);
                    }}
                    onBlur={onBlur}
                    placeholder="Apto, Bloco, etc."
                    className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-gray-800"
                    placeholderTextColor="#9CA3AF"
                  />
                )}
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
              <Controller
                control={control}
                name="address.neighborhood"
                render={({ field: { onChange, value } }) => (
                  <>
                    <TouchableOpacity
                      onPress={() =>
                        setShowNeighborhoodSelector(!showNeighborhoodSelector)
                      }
                      className={`bg-gray-50 border ${
                        errors.address?.neighborhood && showValidationErrors
                          ? "border-red-400"
                          : "border-gray-200"
                      } rounded-lg p-3 flex-row justify-between items-center`}
                    >
                      <Text
                        className={value ? "text-gray-800" : "text-gray-400"}
                      >
                        {value || "Selecione seu bairro"}
                      </Text>
                      <ChevronDown size={20} color="#9CA3AF" />
                    </TouchableOpacity>

                    {/* Mostrar seletor de bairros quando clicado */}
                    {showNeighborhoodSelector && (
                      <Card className="mt-2 border border-gray-200 max-h-48 overflow-hidden">
                        <ScrollView
                          className="p-2"
                          showsVerticalScrollIndicator={false}
                        >
                          {companyConfig?.deliveryConfig?.neighborhoods?.map(
                            (neighborhood, index) => (
                              <TouchableOpacity
                                key={index}
                                onPress={() => {
                                  handleSelectNeighborhood(neighborhood);
                                  onChange(neighborhood);
                                }}
                                className={`p-3 flex-row justify-between items-center ${
                                  index <
                                  (companyConfig?.deliveryConfig?.neighborhoods
                                    ?.length || 0) -
                                    1
                                    ? "border-b border-gray-100"
                                    : ""
                                }`}
                              >
                                <Text className="text-gray-800">
                                  {neighborhood}
                                </Text>
                                {value === neighborhood && (
                                  <CheckCircle size={16} color={primaryColor} />
                                )}
                              </TouchableOpacity>
                            )
                          )}
                        </ScrollView>
                      </Card>
                    )}
                  </>
                )}
              />
            ) : (
              // Campo de texto quando não há lista predefinida
              <Controller
                control={control}
                name="address.neighborhood"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    value={value}
                    onChangeText={(text) => {
                      onChange(text);
                      updateAddress("neighborhood", text);
                    }}
                    onBlur={onBlur}
                    placeholder="Digite seu bairro"
                    className={`bg-gray-50 border ${
                      errors.address?.neighborhood && showValidationErrors
                        ? "border-red-400"
                        : "border-gray-200"
                    } rounded-lg p-3 text-gray-800`}
                    placeholderTextColor="#9CA3AF"
                  />
                )}
              />
            )}

            {errors.address?.neighborhood && showValidationErrors && (
              <HStack space="xs" alignItems="center" className="mt-1">
                <AlertCircle size={14} color="#EF4444" />
                <Text className="text-xs text-red-500">
                  {errors.address.neighborhood.message}
                </Text>
              </HStack>
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

            <Controller
              control={control}
              name="address.reference"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  value={value || ""}
                  onChangeText={(text) => {
                    onChange(text);
                    updateAddress("reference", text);
                  }}
                  onBlur={onBlur}
                  placeholder="Ex: Próximo ao mercado..."
                  className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-gray-800"
                  placeholderTextColor="#9CA3AF"
                />
              )}
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
            !!personalInfo.name || !!personalInfo.phone || !!address.street
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
