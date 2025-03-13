// Path: src/features/checkout/components/payment-method-step.tsx
import React, { useEffect, useState } from "react";
import { View, Text, ScrollView } from "react-native";
import { useForm, Controller } from "react-hook-form";
import {
  Card,
  VStack,
  HStack,
  Button,
  RadioGroup,
  Input,
  InputField,
  FormControl,
} from "@gluestack-ui/themed";
import {
  CreditCard,
  Banknote,
  Smartphone,
  DollarSign,
} from "lucide-react-native";
import { useCheckoutViewModel } from "../view-models/use-checkout-view-model";
import { CheckoutPaymentMethod, PaymentInfo } from "../models/checkout";
import { THEME_COLORS } from "@/src/styles/colors";
import { RadioOptionButton } from "@/components/ui/radio-option-button";

export function PaymentMethodStep() {
  const { checkout, paymentInfoForm, savePaymentInfo, prevStep } =
    useCheckoutViewModel();
  const primaryColor = THEME_COLORS.primary;
  const [showChangeInput, setShowChangeInput] = useState(
    checkout.paymentInfo.method === CheckoutPaymentMethod.CASH
  );

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { isValid },
    reset,
  } = paymentInfoForm;

  // Inicializar o formulário com os valores do checkout
  useEffect(() => {
    reset(checkout.paymentInfo);
  }, [checkout.paymentInfo]);

  // Observar mudanças no método de pagamento
  const paymentMethod = watch("method");

  // Atualizar estado do input de troco quando mudar para/de dinheiro
  useEffect(() => {
    setShowChangeInput(paymentMethod === CheckoutPaymentMethod.CASH);
    if (paymentMethod !== CheckoutPaymentMethod.CASH) {
      setValue("change", "");
    }
  }, [paymentMethod, setValue]);

  // Opções de pagamento
  const paymentOptions = [
    {
      method: CheckoutPaymentMethod.PIX,
      label: "PIX",
      icon: (
        <Smartphone
          size={20}
          color={
            paymentMethod === CheckoutPaymentMethod.PIX
              ? primaryColor
              : "#64748b"
          }
        />
      ),
    },
    {
      method: CheckoutPaymentMethod.CREDIT_CARD,
      label: "Cartão de Crédito",
      icon: (
        <CreditCard
          size={20}
          color={
            paymentMethod === CheckoutPaymentMethod.CREDIT_CARD
              ? primaryColor
              : "#64748b"
          }
        />
      ),
    },
    {
      method: CheckoutPaymentMethod.DEBIT_CARD,
      label: "Cartão de Débito",
      icon: (
        <CreditCard
          size={20}
          color={
            paymentMethod === CheckoutPaymentMethod.DEBIT_CARD
              ? primaryColor
              : "#64748b"
          }
        />
      ),
    },
    {
      method: CheckoutPaymentMethod.CASH,
      label: "Dinheiro",
      icon: (
        <Banknote
          size={20}
          color={
            paymentMethod === CheckoutPaymentMethod.CASH
              ? primaryColor
              : "#64748b"
          }
        />
      ),
    },
  ];

  return (
    <ScrollView className="flex-1 p-4">
      <Card className="p-4 mb-4 border border-gray-100">
        <Text className="text-lg font-semibold text-gray-800 mb-4">
          Forma de Pagamento
        </Text>

        <VStack space="md">
          <Controller
            control={control}
            name="method"
            defaultValue={CheckoutPaymentMethod.PIX}
            render={({ field }) => (
              <RadioGroup
                value={field.value}
                onChange={(newValue) => {
                  field.onChange(newValue);
                }}
              >
                {paymentOptions.map((option) => (
                  <RadioOptionButton
                    key={option.method}
                    value={option.method}
                    label={option.label}
                    icon={option.icon}
                    isSelected={field.value === option.method}
                    onPress={() => field.onChange(option.method)}
                    primaryColor={primaryColor}
                  />
                ))}
              </RadioGroup>
            )}
          />

          {showChangeInput && (
            <FormControl>
              <Text className="text-gray-700 mb-2">Troco para quanto?</Text>
              <Controller
                control={control}
                name="change"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input>
                    <InputField
                      placeholder="Valor para troco (ex: 50)"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      keyboardType="numeric"
                    />
                  </Input>
                )}
              />
            </FormControl>
          )}

          <View className="mt-4 p-4 bg-gray-50 rounded-lg">
            <Text className="text-sm text-gray-600">
              Você poderá confirmar os detalhes do pagamento na próxima etapa
              antes de finalizar o pedido.
            </Text>
          </View>
        </VStack>
      </Card>

      <HStack space="md" className="mb-8">
        <Button onPress={prevStep} variant="outline" className="flex-1">
          <Text className="font-medium">Voltar</Text>
        </Button>

        <Button
          onPress={handleSubmit(savePaymentInfo)}
          style={{ backgroundColor: primaryColor }}
          className="flex-1"
        >
          <Text className="text-white font-medium">Continuar</Text>
        </Button>
      </HStack>
    </ScrollView>
  );
}
