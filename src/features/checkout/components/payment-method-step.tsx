// Path: src/features/checkout/components/payment-method-step.tsx

import React, { useEffect, useState } from "react";
import { View, Text, ScrollView } from "react-native";
import { useForm, Controller } from "react-hook-form";
import {
  Card,
  VStack,
  HStack,
  RadioGroup,
  Input,
  InputField,
  FormControl,
  FormControlError,
  FormControlErrorText,
} from "@gluestack-ui/themed";
import {
  CreditCard,
  Banknote,
  Smartphone,
  AlertCircle,
  CheckCircle,
} from "lucide-react-native";
import { useCheckoutViewModel } from "../view-models/use-checkout-view-model";
import {
  CheckoutDeliveryType,
  CheckoutPaymentMethod,
  PaymentInfo,
} from "../models/checkout";
import { THEME_COLORS } from "@/src/styles/colors";
import { RadioOptionButton } from "@/components/ui/radio-option-button";

export function PaymentMethodStep() {
  const { checkout, paymentInfoForm } = useCheckoutViewModel();
  const primaryColor = THEME_COLORS.primary;
  const isDelivery = checkout.deliveryType === CheckoutDeliveryType.DELIVERY;

  const [showChangeInput, setShowChangeInput] = useState(
    checkout.paymentInfo.method === CheckoutPaymentMethod.CASH
  );
  const [isFormValid, setIsFormValid] = useState(false);

  const {
    control,
    watch,
    setValue,
    trigger,
    formState: { errors, isSubmitting },
    reset,
  } = paymentInfoForm;

  // Inicializar o formulário com os valores do checkout
  useEffect(() => {
    reset(checkout.paymentInfo);
  }, [checkout.paymentInfo, reset]);

  // Observar mudanças no método de pagamento
  const paymentMethod = watch("method");
  const changeValue = watch("change");

  // Atualizar estado do input de troco quando mudar para/de dinheiro
  useEffect(() => {
    setShowChangeInput(paymentMethod === CheckoutPaymentMethod.CASH);

    if (paymentMethod !== CheckoutPaymentMethod.CASH) {
      setValue("change", "");
      setIsFormValid(true);
    } else {
      // Se o método for dinheiro, validar o campo de troco
      setTimeout(() => {
        trigger("change");
      }, 100);

      // Verifica se já tem um valor de troco válido
      if (changeValue) {
        setIsFormValid(true);
      } else {
        setIsFormValid(false);
      }
    }
  }, [paymentMethod, setValue, trigger]);

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

  // Calcular valor do troco
  const calculateChange = () => {
    if (!changeValue) return 0;

    const changeAmount = parseFloat(changeValue.replace(",", "."));
    if (isNaN(changeAmount)) return 0;

    // Determinar o valor total correto baseado no tipo de entrega
    const totalValue =
      checkout.deliveryType === CheckoutDeliveryType.PICKUP
        ? checkout.subtotal
        : checkout.total;

    return changeAmount - totalValue;
  };

  return (
    <ScrollView
      className="flex-1"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ padding: 16, paddingBottom: 120 }}
    >
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
            <FormControl isRequired={true}>
              <HStack alignItems="center" className="mb-1">
                <Banknote size={16} color="#6B7280" />
                <Text className="ml-2 text-gray-700 font-medium">
                  Troco para quanto?
                </Text>
              </HStack>

              <Controller
                control={control}
                name="change"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input>
                    <InputField
                      placeholder="Valor para troco (ex: 50)"
                      value={value}
                      onChangeText={(text) => {
                        // Permitir apenas números e vírgula
                        const cleaned = text.replace(/[^\d,]/g, "");
                        onChange(cleaned);
                      }}
                      onBlur={onBlur}
                      keyboardType="numeric"
                      testID="change-input"
                    />
                  </Input>
                )}
              />

              <Text className="text-xs text-gray-500 mt-1">
                O valor deve ser maior que o total do pedido
              </Text>
            </FormControl>
          )}

          {/* Status de validação */}
          {paymentMethod === CheckoutPaymentMethod.CASH ? (
            <View className="p-3 rounded-lg mt-2 bg-green-50 border border-green-100">
              <HStack space="sm" alignItems="center">
                <CheckCircle size={18} color="#22C55E" />
                <Text className="text-sm text-green-700">
                  Informe um valor para troco
                </Text>
              </HStack>
            </View>
          ) : (
            <View className="p-3 rounded-lg mt-2 bg-green-50 border border-green-100">
              <HStack space="sm" alignItems="center">
                <CheckCircle size={18} color="#22C55E" />
                <Text className="text-sm text-green-700">
                  Método de pagamento selecionado
                </Text>
              </HStack>
            </View>
          )}

          {/* Resumo do valor */}
          <View className="mt-4 p-4 bg-gray-50 rounded-lg">
            <HStack justifyContent="space-between">
              <Text className="text-gray-700 font-medium">
                Total do pedido:
              </Text>
              <Text className="text-gray-800 font-bold">
                {checkout.deliveryType === CheckoutDeliveryType.PICKUP
                  ? checkout.subtotal.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })
                  : checkout.total.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
              </Text>
            </HStack>

            {paymentMethod === CheckoutPaymentMethod.CASH && changeValue && (
              <>
                <HStack justifyContent="space-between" className="mt-2">
                  <Text className="text-gray-700">Valor do troco:</Text>
                  <Text className="text-gray-800">
                    {calculateChange().toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </Text>
                </HStack>
              </>
            )}
          </View>

          {/* Mensagem de orientação */}
          <View className="mt-2 p-4 bg-gray-50 rounded-lg">
            <HStack space="sm" alignItems="center">
              <AlertCircle size={16} color={primaryColor} />
              <Text className="text-sm text-gray-600">
                Você poderá confirmar os detalhes do pagamento na próxima etapa
                antes de finalizar o pedido.
              </Text>
            </HStack>
          </View>
        </VStack>
      </Card>
    </ScrollView>
  );
}
