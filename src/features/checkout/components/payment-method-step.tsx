// Path: src/features/checkout/components/payment-method-step.tsx (continuação)
import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useForm, Controller } from "react-hook-form";
import {
  Card,
  VStack,
  HStack,
  Button,
  Radio,
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
  }, [paymentMethod]);

  const PaymentMethodOption = ({
    method,
    label,
    icon: Icon,
  }: {
    method: CheckoutPaymentMethod;
    label: string;
    icon: any;
  }) => (
    <TouchableOpacity
      onPress={() => setValue("method", method)}
      className={`p-4 border rounded-lg mb-3 ${
        paymentMethod === method
          ? `border-primary-500 bg-primary-50`
          : "border-gray-200"
      }`}
    >
      <HStack space="md" alignItems="center">
        <View
          className="h-10 w-10 rounded-full items-center justify-center"
          style={{
            backgroundColor:
              paymentMethod === method ? `${primaryColor}20` : "#f3f4f6",
          }}
        >
          <Icon
            size={20}
            color={paymentMethod === method ? primaryColor : "#64748b"}
          />
        </View>

        <Text className="font-medium text-gray-800">{label}</Text>

        <Controller
          control={control}
          name="method"
          render={({ field }) => (
            <Radio
              value={method}
              isChecked={field.value === method}
              onChange={() => field.onChange(method)}
              accessibilityLabel={label}
              className="ml-auto"
            />
          )}
        />
      </HStack>
    </TouchableOpacity>
  );

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
            render={() => (
              <View>
                <PaymentMethodOption
                  method={CheckoutPaymentMethod.PIX}
                  label="PIX"
                  icon={Smartphone}
                />
                <PaymentMethodOption
                  method={CheckoutPaymentMethod.CREDIT_CARD}
                  label="Cartão de Crédito"
                  icon={CreditCard}
                />
                <PaymentMethodOption
                  method={CheckoutPaymentMethod.DEBIT_CARD}
                  label="Cartão de Débito"
                  icon={CreditCard}
                />
                <PaymentMethodOption
                  method={CheckoutPaymentMethod.CASH}
                  label="Dinheiro"
                  icon={Banknote}
                />
              </View>
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
                      //   leftElement={
                      //     <DollarSign
                      //       size={18}
                      //       color="#6B7280"
                      //       className="ml-2"
                      //     />
                      //   }
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
