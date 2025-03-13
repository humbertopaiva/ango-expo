// Path: src/features/checkout/components/personal-info-step.tsx
import React, { useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
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
} from "@gluestack-ui/themed";
import { User, Phone, MapPin, Info } from "lucide-react-native";
import { useCheckoutViewModel } from "../view-models/use-checkout-view-model";
import { CheckoutDeliveryType, PersonalInfo } from "../models/checkout";
import { THEME_COLORS } from "@/src/styles/colors";
import { FormValidationFeedback } from "@/components/common/form-validation-feedback";

export function PersonalInfoStep() {
  const { checkout, personalInfoForm, savePersonalInfo, prevStep } =
    useCheckoutViewModel();
  const primaryColor = THEME_COLORS.primary;

  const {
    control,
    handleSubmit,
    formState: { errors, isValid, isDirty },
    reset,
  } = personalInfoForm;

  // Inicializar o formulário com os valores do checkout
  useEffect(() => {
    reset(checkout.personalInfo);
  }, [checkout.personalInfo]);

  const isDelivery = checkout.deliveryType === CheckoutDeliveryType.DELIVERY;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
      keyboardVerticalOffset={100}
    >
      <ScrollView className="flex-1 p-4">
        <Card className="p-4 mb-4 border border-gray-100">
          <Text className="text-lg font-semibold text-gray-800 mb-4">
            Seus Dados
          </Text>

          <VStack space="md">
            {/* Nome completo */}
            <FormControl isInvalid={!!errors.fullName}>
              <Controller
                control={control}
                name="fullName"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input>
                    <InputField
                      placeholder="Nome completo"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      //   leftElement={
                      //     <User size={18} color="#6B7280" className="ml-2" />
                      //   }
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

            {/* WhatsApp */}
            <FormControl isInvalid={!!errors.whatsapp}>
              <Controller
                control={control}
                name="whatsapp"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input>
                    <InputField
                      placeholder="WhatsApp (com DDD)"
                      value={value}
                      onChangeText={(text) => {
                        // Permitir apenas números
                        const cleaned = text.replace(/\D/g, "");
                        onChange(cleaned);
                      }}
                      onBlur={onBlur}
                      keyboardType="phone-pad"
                      //   leftElement={
                      //     <Phone size={18} color="#6B7280" className="ml-2" />
                      //   }
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

            {isDelivery && (
              <>
                <Text className="text-lg font-semibold text-gray-800 mb-1 mt-2">
                  Endereço de Entrega
                </Text>

                {/* Rua */}
                <FormControl isInvalid={!!errors.address}>
                  <Controller
                    control={control}
                    name="address"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <Input>
                        <InputField
                          placeholder="Rua/Avenida"
                          value={value}
                          onChangeText={onChange}
                          onBlur={onBlur}
                          //   leftElement={
                          //     <MapPin
                          //       size={18}
                          //       color="#6B7280"
                          //       className="ml-2"
                          //     />
                          //   }
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
                  >
                    <Controller
                      control={control}
                      name="number"
                      render={({ field: { onChange, onBlur, value } }) => (
                        <Input>
                          <InputField
                            placeholder="Número"
                            value={value}
                            onChangeText={onChange}
                            onBlur={onBlur}
                            keyboardType="numeric"
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
                  >
                    <Controller
                      control={control}
                      name="neighborhood"
                      render={({ field: { onChange, onBlur, value } }) => (
                        <Input>
                          <InputField
                            placeholder="Bairro"
                            value={value}
                            onChangeText={onChange}
                            onBlur={onBlur}
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
                <Input isDisabled={true}>
                  <InputField
                    value="Lima Duarte (MG)"
                    placeholder="Cidade"
                    className="bg-gray-100"
                  />
                </Input>

                {/* Ponto de referência (opcional) */}
                <FormControl>
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
                          //   leftElement={
                          //     <Info size={18} color="#6B7280" className="ml-2" />
                          //   }
                        />
                      </Input>
                    )}
                  />
                </FormControl>
              </>
            )}

            <FormValidationFeedback
              isValid={isValid && isDirty}
              isPartiallyValid={isDirty && !isValid}
              validMessage="Todos os campos preenchidos"
              invalidMessage="Preencha os campos obrigatórios"
              partialMessage="Continue preenchendo os campos"
              primaryColor={primaryColor}
            />
          </VStack>
        </Card>

        <HStack space="md" className="mb-8">
          <Button onPress={prevStep} variant="outline" className="flex-1">
            <Text className="font-medium">Voltar</Text>
          </Button>

          <Button
            onPress={handleSubmit(savePersonalInfo)}
            style={{ backgroundColor: primaryColor }}
            isDisabled={!isValid}
            className="flex-1"
          >
            <Text className="text-white font-medium">Continuar</Text>
          </Button>
        </HStack>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
