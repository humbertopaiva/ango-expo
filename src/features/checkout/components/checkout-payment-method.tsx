// Path: src/features/checkout/components/checkout-payment-method.tsx
import React, { useState } from "react";
import { View, Text, TouchableOpacity, TextInput } from "react-native";
import { Card, VStack, HStack, Divider } from "@gluestack-ui/themed";
import {
  CreditCard,
  DollarSign,
  Smartphone,
  ArrowRightLeft,
  Check,
} from "lucide-react-native";
import { useCheckoutViewModel } from "../view-models/use-checkout-view-model";
import { PaymentMethod } from "../view-models/use-checkout-view-model";
import { useCartViewModel } from "@/src/features/cart/view-models/use-cart-view-model";

// Interface para opções de pagamento
interface PaymentOption {
  id: PaymentMethod;
  label: string;
  icon: React.ElementType;
  description: string;
}

export function CheckoutPaymentMethod() {
  const { paymentInfo, setPaymentInfo, formatChangeValue, companyConfig } =
    useCheckoutViewModel();

  const cartVm = useCartViewModel();

  // Estado local para o input de troco formatado
  const [changeInputValue, setChangeInputValue] = useState(
    paymentInfo.changeFor || ""
  );

  // Opções de métodos de pagamento
  const paymentOptions: PaymentOption[] = [
    {
      id: "pix",
      label: "PIX",
      icon: Smartphone,
      description: "Pagamento instantâneo via PIX",
    },
    {
      id: "credit",
      label: "Cartão de Crédito",
      icon: CreditCard,
      description: "Pague com cartão de crédito na entrega",
    },
    {
      id: "debit",
      label: "Cartão de Débito",
      icon: CreditCard,
      description: "Pague com cartão de débito na entrega",
    },
    {
      id: "cash",
      label: "Dinheiro",
      icon: DollarSign,
      description: "Pague em dinheiro na entrega",
    },
    {
      id: "transfer",
      label: "Transferência Bancária",
      icon: ArrowRightLeft,
      description: "Pagamento via transferência bancária",
    },
  ];

  // Selecionar método de pagamento
  const handleSelectPaymentMethod = (method: PaymentMethod) => {
    setPaymentInfo({
      ...paymentInfo,
      method,
      // Limpar valor de troco se o método não for dinheiro
      changeFor: method === "cash" ? paymentInfo.changeFor : undefined,
    });
  };

  // Atualizar valor para troco (apenas para pagamento em dinheiro)
  const handleChangeForValue = (value: string) => {
    // Mantenha apenas números
    const numericValue = value.replace(/\D/g, "");

    // Formatar valor
    const formattedValue = formatChangeValue(numericValue);
    setChangeInputValue(formattedValue);

    // Atualizar estado
    setPaymentInfo({
      ...paymentInfo,
      changeFor: formattedValue,
    });
  };

  // Cor primária da empresa ou valor padrão
  const primaryColor = companyConfig?.primaryColor || "#F4511E";

  return (
    <Card className="p-4 border border-gray-100">
      <Text className="text-lg font-semibold text-gray-800 mb-4">
        Forma de Pagamento
      </Text>

      <VStack space="md">
        {paymentOptions.map((option) => (
          <TouchableOpacity
            key={option.id}
            onPress={() => handleSelectPaymentMethod(option.id)}
            className={`p-4 rounded-lg border ${
              paymentInfo.method === option.id
                ? "border-primary-500 bg-primary-50"
                : "border-gray-200 bg-white"
            }`}
            style={{
              borderColor:
                paymentInfo.method === option.id ? primaryColor : "#E5E7EB",
              backgroundColor:
                paymentInfo.method === option.id
                  ? `${primaryColor}10`
                  : "white",
            }}
          >
            <HStack className="items-center justify-between">
              <HStack space="md" alignItems="center">
                <View
                  className="p-2 rounded-full"
                  style={{
                    backgroundColor:
                      paymentInfo.method === option.id
                        ? `${primaryColor}20`
                        : "#F3F4F6",
                  }}
                >
                  <option.icon
                    size={24}
                    color={
                      paymentInfo.method === option.id
                        ? primaryColor
                        : "#6B7280"
                    }
                  />
                </View>

                <VStack>
                  <Text
                    className="font-medium"
                    style={{
                      color:
                        paymentInfo.method === option.id
                          ? primaryColor
                          : "#111827",
                    }}
                  >
                    {option.label}
                  </Text>
                  <Text className="text-xs text-gray-500 mt-1">
                    {option.description}
                  </Text>
                </VStack>
              </HStack>

              {paymentInfo.method === option.id && (
                <View
                  className="p-1 rounded-full"
                  style={{ backgroundColor: primaryColor }}
                >
                  <Check size={16} color="white" />
                </View>
              )}
            </HStack>
          </TouchableOpacity>
        ))}

        {/* Campo para valor de troco (apenas quando o método for dinheiro) */}
        {paymentInfo.method === "cash" && (
          <Card className="p-4 border border-gray-200 bg-gray-50 mt-2">
            <Text className="font-medium text-gray-800 mb-2">
              Troco para quanto?
            </Text>

            <TextInput
              value={changeInputValue}
              onChangeText={handleChangeForValue}
              placeholder="R$ 0,00"
              className="bg-white border border-gray-200 rounded-lg p-3 text-gray-800"
              placeholderTextColor="#9CA3AF"
              keyboardType="numeric"
            />

            <Text className="text-xs text-gray-500 mt-2">
              Valor total do pedido: {cartVm.total}
            </Text>

            <Text className="text-xs text-gray-500 mt-1">
              Informe um valor maior que o total do pedido.
            </Text>
          </Card>
        )}
      </VStack>
    </Card>
  );
}
