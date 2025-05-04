// Path: src/features/checkout/components/personal-info-step.tsx

import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import {
  Card,
  VStack,
  HStack,
  Button,
  Input,
  InputField,
  FormControl,
  FormControlError,
  FormControlErrorText,
  useToast,
} from "@gluestack-ui/themed";
import {
  User,
  Phone,
  MapPin,
  Info,
  AlertCircle,
  CheckCircle,
} from "lucide-react-native";
import { useCheckoutViewModel } from "../view-models/use-checkout-view-model";
import { CheckoutDeliveryType, PersonalInfo } from "../models/checkout";
import { THEME_COLORS } from "@/src/styles/colors";
import { FormValidationFeedback } from "@/components/common/form-validation-feedback";
import { maskPhoneNumber } from "../utils/checkout.utils";

export function PersonalInfoStep() {
  const {
    checkout,
    personalInfoForm,
    savePersonalInfo,
    prevStep,
    isLoadingUserData,
  } = useCheckoutViewModel();

  const primaryColor = THEME_COLORS.primary;
  const toast = useToast();

  const [addressFieldsComplete, setAddressFieldsComplete] = useState(false);
  const [hasLoadedUserData, setHasLoadedUserData] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid, isDirty, isSubmitting, dirtyFields },
    watch,
    trigger,
    getValues,
  } = personalInfoForm;

  // Observar alterações em tempo real para todos os campos
  const watchedFields = watch();
  const isDelivery = checkout.deliveryType === CheckoutDeliveryType.DELIVERY;

  // Verificar se os dados iniciais são válidos quando o componente monta
  useEffect(() => {
    if (!hasLoadedUserData && !isLoadingUserData) {
      const values = getValues();
      const hasValidData = !!(
        values.fullName &&
        values.fullName.length >= 5 &&
        values.whatsapp &&
        values.whatsapp.length >= 11
      );

      setHasLoadedUserData(hasValidData);

      // Trigger para validar os campos iniciais
      trigger();

      // Se for entrega, verificar os campos de endereço
      if (isDelivery) {
        verifyAddressFields();
      }
    }
  }, [isLoadingUserData, checkout.personalInfo]);

  // Verificar se os campos de endereço estão preenchidos quando é entrega
  const verifyAddressFields = useCallback(() => {
    if (!isDelivery) {
      setAddressFieldsComplete(true);
      return true;
    }

    const values = getValues();
    const isComplete = !!(
      values.address &&
      values.address.trim().length >= 5 &&
      values.number &&
      values.number.trim().length >= 1 &&
      values.neighborhood &&
      values.neighborhood.trim().length >= 3
    );

    setAddressFieldsComplete(isComplete);
    return isComplete;
  }, [isDelivery, getValues]);

  // Verificar campos sempre que algum valor mudar
  useEffect(() => {
    verifyAddressFields();
  }, [watchedFields, verifyAddressFields]);

  // Função para validar e salvar dados
  const handleSavePersonalInfo = async (data: PersonalInfo) => {
    // Verificação adicional para entrega
    if (isDelivery && !verifyAddressFields()) {
      toast.show({
        render: () => (
          <View className="bg-red-500 px-4 py-3 rounded-lg mx-4 my-2">
            <Text className="text-white font-medium">
              Preencha todos os campos de endereço corretamente
            </Text>
          </View>
        ),
      });
      return;
    }

    await savePersonalInfo(data);
  };

  if (isLoadingUserData) {
    return (
      <View className="flex-1 justify-center items-center p-4">
        <ActivityIndicator size="large" color={primaryColor} />
        <Text className="mt-4 text-gray-700">Carregando seus dados...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
      keyboardVerticalOffset={100}
    >
      <ScrollView className="flex-1 p-4">
        {hasLoadedUserData && (
          <View className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
            <HStack space="sm" alignItems="center">
              <CheckCircle size={18} color="#3B82F6" />
              <Text className="text-sm text-blue-700">
                Seus dados foram recuperados automaticamente
              </Text>
            </HStack>
          </View>
        )}

        {isDelivery && !addressFieldsComplete && (
          <View className="mb-4 p-3 bg-amber-50 rounded-lg border border-amber-100">
            <HStack space="sm" alignItems="center">
              <AlertCircle size={18} color="#F59E0B" />
              <Text className="text-sm text-amber-700">
                Preencha todos os campos de endereço para entrega
              </Text>
            </HStack>
          </View>
        )}

        <Card className="p-4 mb-4 border border-gray-100">
          <Text className="text-lg font-semibold text-gray-800 mb-4">
            Seus Dados
          </Text>

          <VStack space="md">
            {/* Nome completo */}
            <FormControl isInvalid={!!errors.fullName} isRequired>
              <HStack alignItems="center" className="mb-1">
                <User size={16} color="#6B7280" />
                <Text className="ml-2 text-gray-700 font-medium">
                  Nome completo
                </Text>
              </HStack>
              <Controller
                control={control}
                name="fullName"
                rules={{
                  required: "Nome completo é obrigatório",
                  minLength: {
                    value: 5,
                    message: "Nome deve ter pelo menos 5 caracteres",
                  },
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input>
                    <InputField
                      placeholder="Nome completo"
                      value={value}
                      onChangeText={onChange}
                      onBlur={() => {
                        onBlur();
                        trigger("fullName");
                      }}
                      testID="fullName-input"
                    />
                  </Input>
                )}
              />
              <FormControlError>
                <FormControlErrorText>
                  {errors.fullName?.message}
                </FormControlErrorText>
              </FormControlError>
            </FormControl>

            {/* WhatsApp com máscara */}
            <FormControl isInvalid={!!errors.whatsapp} isRequired>
              <HStack alignItems="center" className="mb-1">
                <Phone size={16} color="#6B7280" />
                <Text className="ml-2 text-gray-700 font-medium">
                  WhatsApp com DDD
                </Text>
              </HStack>
              <Controller
                control={control}
                name="whatsapp"
                rules={{
                  required: "WhatsApp é obrigatório",
                  minLength: {
                    value: 11,
                    message: "Digite um número válido com DDD",
                  },
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input>
                    <InputField
                      placeholder="(00) 0 0000-0000"
                      value={maskPhoneNumber(value)}
                      onChangeText={(text) => {
                        // Permitir apenas números
                        const cleaned = text.replace(/\D/g, "");
                        onChange(cleaned);
                      }}
                      onBlur={() => {
                        onBlur();
                        trigger("whatsapp");
                      }}
                      keyboardType="phone-pad"
                      testID="whatsapp-input"
                    />
                  </Input>
                )}
              />
              <FormControlError>
                <FormControlErrorText>
                  {errors.whatsapp?.message}
                </FormControlErrorText>
              </FormControlError>
            </FormControl>

            {/* Campos de endereço (apenas se for entrega) */}
            {isDelivery && (
              <>
                <Text className="text-lg font-semibold text-gray-800 mb-1 mt-4">
                  Endereço de Entrega
                </Text>

                {/* Rua */}
                <FormControl isInvalid={!!errors.address} isRequired>
                  <HStack alignItems="center" className="mb-1">
                    <MapPin size={16} color="#6B7280" />
                    <Text className="ml-2 text-gray-700 font-medium">
                      Rua/Avenida
                    </Text>
                  </HStack>
                  <Controller
                    control={control}
                    name="address"
                    rules={{
                      required: "Endereço é obrigatório",
                      minLength: { value: 5, message: "Endereço muito curto" },
                    }}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <Input>
                        <InputField
                          placeholder="Rua/Avenida"
                          value={value}
                          onChangeText={onChange}
                          onBlur={() => {
                            onBlur();
                            trigger("address");
                            verifyAddressFields();
                          }}
                          testID="address-input"
                        />
                      </Input>
                    )}
                  />
                  <FormControlError>
                    <FormControlErrorText>
                      {errors.address?.message}
                    </FormControlErrorText>
                  </FormControlError>
                </FormControl>

                {/* Número e Bairro */}
                <HStack space="md">
                  <FormControl
                    isInvalid={!!errors.number}
                    className="w-1/3 mr-2"
                    isRequired
                  >
                    <Text className="text-gray-700 font-medium mb-1">
                      Número
                    </Text>
                    <Controller
                      control={control}
                      name="number"
                      rules={{ required: "Número é obrigatório" }}
                      render={({ field: { onChange, onBlur, value } }) => (
                        <Input>
                          <InputField
                            placeholder="Número"
                            value={value}
                            onChangeText={onChange}
                            onBlur={() => {
                              onBlur();
                              trigger("number");
                              verifyAddressFields();
                            }}
                            keyboardType="numeric"
                            testID="number-input"
                          />
                        </Input>
                      )}
                    />
                    <FormControlError>
                      <FormControlErrorText>
                        {errors.number?.message}
                      </FormControlErrorText>
                    </FormControlError>
                  </FormControl>

                  <FormControl
                    isInvalid={!!errors.neighborhood}
                    className="flex-1"
                    isRequired
                  >
                    <Text className="text-gray-700 font-medium mb-1">
                      Bairro
                    </Text>
                    <Controller
                      control={control}
                      name="neighborhood"
                      rules={{
                        required: "Bairro é obrigatório",
                        minLength: { value: 3, message: "Bairro muito curto" },
                      }}
                      render={({ field: { onChange, onBlur, value } }) => (
                        <Input>
                          <InputField
                            placeholder="Bairro"
                            value={value}
                            onChangeText={onChange}
                            onBlur={() => {
                              onBlur();
                              trigger("neighborhood");
                              verifyAddressFields();
                            }}
                            testID="neighborhood-input"
                          />
                        </Input>
                      )}
                    />
                    <FormControlError>
                      <FormControlErrorText>
                        {errors.neighborhood?.message}
                      </FormControlErrorText>
                    </FormControlError>
                  </FormControl>
                </HStack>

                {/* Cidade (fixa) */}
                <Input isDisabled={true} className="mt-2">
                  <InputField
                    value="Lima Duarte (MG)"
                    placeholder="Cidade"
                    className="bg-gray-100"
                  />
                </Input>

                {/* Ponto de referência (opcional) */}
                <FormControl className="mt-2">
                  <Text className="text-gray-700 font-medium mb-1">
                    Ponto de referência (opcional)
                  </Text>
                  <Controller
                    control={control}
                    name="reference"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <Input>
                        <InputField
                          placeholder="Ponto de referência (opcional)"
                          value={value}
                          onChangeText={onChange}
                          onBlur={onBlur}
                          testID="reference-input"
                        />
                      </Input>
                    )}
                  />
                </FormControl>
              </>
            )}

            <FormValidationFeedback
              isValid={isDelivery ? isValid && addressFieldsComplete : isValid}
              isPartiallyValid={isDirty && !isValid}
              validMessage={
                isDelivery
                  ? "Todos os campos preenchidos corretamente"
                  : "Dados básicos preenchidos corretamente"
              }
              invalidMessage={
                isDelivery
                  ? "Preencha todos os campos obrigatórios"
                  : "Preencha seu nome e WhatsApp corretamente"
              }
              partialMessage="Continue preenchendo os campos obrigatórios"
              primaryColor={primaryColor}
            />
          </VStack>
        </Card>

        <HStack space="md" className="mb-8">
          <Button
            onPress={prevStep}
            variant="outline"
            className="flex-1"
            isDisabled={isSubmitting}
          >
            <Text className="font-medium">Voltar</Text>
          </Button>

          <Button
            onPress={handleSubmit(handleSavePersonalInfo)}
            style={{ backgroundColor: primaryColor }}
            isDisabled={
              isSubmitting ||
              (isDelivery ? !isValid || !addressFieldsComplete : !isValid)
            }
            className="flex-1"
          >
            {isSubmitting ? (
              <Text className="text-white font-medium">Processando...</Text>
            ) : (
              <Text className="text-white font-medium">Continuar</Text>
            )}
          </Button>
        </HStack>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
