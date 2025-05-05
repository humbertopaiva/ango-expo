// Path: src/features/checkout/components/payment-method-step.tsx

import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
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
  Divider,
} from "@gluestack-ui/themed";
import {
  CreditCard,
  Banknote,
  Smartphone,
  AlertCircle,
  CheckCircle,
  DollarSign,
  ChevronDown,
  ChevronUp,
  Info,
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
  const [showPaymentInfo, setShowPaymentInfo] = useState(false);

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
      description: "Pagamento instantâneo",
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
      description: "Pagamento na entrega",
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
      description: "Pagamento na entrega",
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
      description: "Pagamento na entrega",
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
      contentContainerStyle={{ padding: 16, paddingBottom: 24 }}
    >
      <Card className="p-4 mb-4 border border-gray-100">
        <Text className="text-lg font-semibold text-gray-800 mb-3">
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
                    description={option.description}
                    icon={option.icon}
                    isSelected={field.value === option.method}
                    onPress={() => field.onChange(option.method)}
                    primaryColor={primaryColor}
                  />
                ))}
              </RadioGroup>
            )}
          />

          {/* Input de troco com visual aprimorado */}
          {showChangeInput && (
            <View className="mt-2 pt-2 border-t border-gray-100">
              <FormControl>
                <HStack alignItems="center" className="mb-1">
                  <DollarSign size={16} color={primaryColor} />
                  <Text className="ml-2 text-primary-600 font-medium">
                    Troco para quanto?
                  </Text>
                </HStack>

                <Controller
                  control={control}
                  name="change"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      size="md"
                      className="bg-white"
                      borderColor="primary.100"
                    >
                      <InputField
                        placeholder="Valor para troco (opcional)"
                        value={value}
                        onChangeText={(text) => {
                          onChange(text); // Aceita qualquer valor sem limitar aos caracteres
                        }}
                        onBlur={onBlur}
                        keyboardType="numeric"
                        testID="change-input"
                      />
                    </Input>
                  )}
                />

                <Text className="text-xs text-gray-500 mt-1">
                  Informe aqui o valor total da nota que você usará para pagar
                </Text>
              </FormControl>

              {/* Cálculo do troco quando há valor */}
              {changeValue && (
                <View className="mt-3 bg-gray-50 p-3 rounded-lg">
                  <HStack alignItems="center" space="sm">
                    <InfoTip className="mr-2" />
                    <View>
                      <Text className="text-gray-700">
                        Valor do pedido:{" "}
                        <Text className="font-bold">
                          {(checkout.deliveryType ===
                          CheckoutDeliveryType.PICKUP
                            ? checkout.subtotal
                            : checkout.total
                          ).toLocaleString("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          })}
                        </Text>
                      </Text>
                    </View>
                  </HStack>
                </View>
              )}
            </View>
          )}

          {/* Status de validação - visual aprimorado */}
          <View
            className={`p-3 rounded-lg mt-3 ${
              paymentMethod === CheckoutPaymentMethod.CASH && !changeValue
                ? "bg-amber-50 border border-amber-100"
                : "bg-green-50 border border-green-100"
            }`}
          >
            <HStack space="sm" alignItems="center">
              {paymentMethod === CheckoutPaymentMethod.CASH && !changeValue ? (
                <>
                  <AlertCircle size={18} color="#F59E0B" />
                  <Text className="text-sm text-amber-700">
                    Informe um valor para troco
                  </Text>
                </>
              ) : (
                <>
                  <CheckCircle size={18} color="#22C55E" />
                  <Text className="text-sm text-green-700">
                    {paymentMethod === CheckoutPaymentMethod.CASH
                      ? "Pagamento em dinheiro selecionado"
                      : `Pagamento via ${
                          paymentMethod === CheckoutPaymentMethod.PIX
                            ? "PIX"
                            : paymentMethod ===
                              CheckoutPaymentMethod.CREDIT_CARD
                            ? "cartão de crédito"
                            : "cartão de débito"
                        } selecionado`}
                  </Text>
                </>
              )}
            </HStack>
          </View>
        </VStack>
      </Card>

      {/* Resumo do pedido */}
      <Card className="p-4 border border-gray-100">
        <TouchableOpacity
          onPress={() => setShowPaymentInfo(!showPaymentInfo)}
          className="flex-row justify-between items-center mb-3"
        >
          <Text className="text-lg font-semibold text-gray-800">
            Resumo do Pedido
          </Text>
          {showPaymentInfo ? (
            <ChevronUp size={20} color="#64748b" />
          ) : (
            <ChevronDown size={20} color="#64748b" />
          )}
        </TouchableOpacity>

        {/* Valores do pedido */}
        <VStack space="sm">
          <HStack justifyContent="space-between">
            <Text className="text-gray-600">Subtotal</Text>
            <Text className="text-gray-800 font-medium">
              {checkout.subtotal.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </Text>
          </HStack>

          <HStack justifyContent="space-between">
            <Text className="text-gray-600">Taxa de entrega</Text>
            {checkout.deliveryType === CheckoutDeliveryType.DELIVERY ? (
              <Text
                className={`font-medium ${
                  checkout.deliveryFee === 0
                    ? "text-green-600"
                    : "text-gray-800"
                }`}
              >
                {checkout.deliveryFee === 0
                  ? "Grátis"
                  : checkout.deliveryFee.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
              </Text>
            ) : (
              <Text className="font-medium text-green-600">Grátis</Text>
            )}
          </HStack>

          <Divider className="my-1" />

          <HStack justifyContent="space-between">
            <Text className="font-semibold text-gray-800">Total</Text>
            <Text className="font-bold text-lg text-gray-800">
              {(checkout.deliveryType === CheckoutDeliveryType.PICKUP
                ? checkout.subtotal
                : checkout.total
              ).toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </Text>
          </HStack>
        </VStack>

        {/* Detalhes do pedido (expandidos) */}
        {showPaymentInfo && (
          <View className="mt-4 pt-3 border-t border-gray-100">
            <Text className="font-medium text-gray-700 mb-2">
              Forma de recebimento:
            </Text>
            <Text className="text-gray-700 mb-3">
              {checkout.deliveryType === CheckoutDeliveryType.DELIVERY ? (
                <Text>
                  Entrega em {checkout.personalInfo.address},{" "}
                  {checkout.personalInfo.number} -{" "}
                  {checkout.personalInfo.neighborhood}
                </Text>
              ) : (
                <Text>Retirada no local</Text>
              )}
            </Text>

            <Text className="font-medium text-gray-700 mb-1">
              Método de pagamento:
            </Text>
            <Text className="text-gray-700">
              {paymentMethod === CheckoutPaymentMethod.PIX ? (
                <>
                  <Smartphone size={14} color={primaryColor} className="mr-1" />{" "}
                  PIX
                </>
              ) : paymentMethod === CheckoutPaymentMethod.CREDIT_CARD ? (
                <>
                  <CreditCard size={14} color={primaryColor} className="mr-1" />{" "}
                  Cartão de Crédito
                </>
              ) : paymentMethod === CheckoutPaymentMethod.DEBIT_CARD ? (
                <>
                  <CreditCard size={14} color={primaryColor} className="mr-1" />{" "}
                  Cartão de Débito
                </>
              ) : (
                <>
                  <Banknote size={14} color={primaryColor} className="mr-1" />{" "}
                  Dinheiro
                  {changeValue && (
                    <Text className="text-gray-600">
                      {" "}
                      (Troco para R$ {changeValue})
                    </Text>
                  )}
                </>
              )}
            </Text>
          </View>
        )}

        {/* Informações adicionais sobre pagamento */}
        <View className="mt-4 p-3 bg-gray-50 rounded-lg">
          <HStack space="sm" alignItems="flex-start">
            <Info size={16} color="#64748b" className="mt-1" />
            <View className="flex-1">
              <Text className="text-sm text-gray-600">
                {paymentMethod === CheckoutPaymentMethod.PIX
                  ? "Você receberá as informações para pagamento via PIX após confirmar o pedido."
                  : "Você poderá pagar diretamente ao entregador no momento da entrega."}
              </Text>
            </View>
          </HStack>
        </View>
      </Card>
    </ScrollView>
  );
}

// Componente auxiliar para o ícone de informação
const InfoTip: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <View
      className={`w-6 h-6 bg-blue-100 rounded-full items-center justify-center ${className}`}
    >
      <Info size={14} color="#3B82F6" />
    </View>
  );
};
