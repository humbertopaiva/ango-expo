// Path: src/features/checkout/components/order-confirmation-step.tsx

import React from "react";
import { View, Text, ScrollView, ActivityIndicator } from "react-native";
import { Card, VStack, HStack, Button, Divider } from "@gluestack-ui/themed";
import {
  Check,
  Truck,
  Home,
  User,
  Phone,
  MapPin,
  CreditCard,
  Smartphone,
  Banknote,
  ShoppingBag,
  Sparkles,
} from "lucide-react-native";
import { useCheckoutViewModel } from "../view-models/use-checkout-view-model";
import {
  CheckoutDeliveryType,
  CheckoutPaymentMethod,
} from "../models/checkout";
import { THEME_COLORS } from "@/src/styles/colors";
import { CartProcessorService } from "../services/cart-processor.service";

export function OrderConfirmationStep() {
  const { checkout, isProcessing, finalizeOrder, prevStep } =
    useCheckoutViewModel();
  const primaryColor = THEME_COLORS.primary;

  const isDelivery = checkout.deliveryType === CheckoutDeliveryType.DELIVERY;

  // Usar o CartProcessorService para processar os itens
  const { mainItems, addons, customItems } = CartProcessorService.processItems(
    checkout.items
  );

  // Ícone para método de pagamento
  const getPaymentIcon = () => {
    switch (checkout.paymentInfo.method) {
      case CheckoutPaymentMethod.PIX:
        return <Smartphone size={18} color="#6B7280" />;
      case CheckoutPaymentMethod.CREDIT_CARD:
      case CheckoutPaymentMethod.DEBIT_CARD:
        return <CreditCard size={18} color="#6B7280" />;
      case CheckoutPaymentMethod.CASH:
        return <Banknote size={18} color="#6B7280" />;
      default:
        return <CreditCard size={18} color="#6B7280" />;
    }
  };

  // Texto para método de pagamento
  const getPaymentMethodText = () => {
    switch (checkout.paymentInfo.method) {
      case CheckoutPaymentMethod.PIX:
        return "PIX";
      case CheckoutPaymentMethod.CREDIT_CARD:
        return "Cartão de Crédito";
      case CheckoutPaymentMethod.DEBIT_CARD:
        return "Cartão de Débito";
      case CheckoutPaymentMethod.CASH:
        return "Dinheiro";
      default:
        return "Desconhecido";
    }
  };

  return (
    <ScrollView className="flex-1 p-4">
      <Card className="p-4 mb-4 border border-gray-100">
        <Text className="text-lg font-semibold text-gray-800 mb-1">
          Confirme seu Pedido
        </Text>
        <Text className="text-gray-500 text-sm mb-4">
          Verifique os detalhes abaixo antes de finalizar
        </Text>

        {/* Tipo de entrega */}
        <VStack
          className="mb-4 p-3 rounded-lg"
          style={{ backgroundColor: `${primaryColor}10` }}
        >
          <HStack className="items-center mb-1">
            {isDelivery ? (
              <Truck size={18} color={primaryColor} />
            ) : (
              <Home size={18} color={primaryColor} />
            )}
            <Text className="ml-2 font-medium" style={{ color: primaryColor }}>
              {isDelivery ? "Entrega" : "Retirada no local"}
            </Text>
          </HStack>

          <Text className="text-gray-600 text-sm">
            {isDelivery
              ? "Seu pedido será entregue no endereço informado"
              : "Você poderá retirar seu pedido diretamente no estabelecimento"}
          </Text>
        </VStack>

        {/* Dados pessoais */}
        <View className="mb-4">
          <Text className="font-semibold text-gray-800 mb-2">Seus Dados</Text>

          <VStack className="bg-gray-50 p-3 rounded-lg">
            <HStack className="items-center mb-2">
              <User size={16} color="#6B7280" />
              <Text className="ml-2 text-gray-700">
                {checkout.personalInfo.fullName}
              </Text>
            </HStack>

            <HStack className="items-center">
              <Phone size={16} color="#6B7280" />
              <Text className="ml-2 text-gray-700">
                {checkout.personalInfo.whatsapp}
              </Text>
            </HStack>
          </VStack>
        </View>

        {/* Endereço (se for entrega) */}
        {isDelivery && (
          <View className="mb-4">
            <Text className="font-semibold text-gray-800 mb-2">
              Endereço de Entrega
            </Text>

            <VStack className="bg-gray-50 p-3 rounded-lg">
              <HStack className="items-start">
                <MapPin size={16} color="#6B7280" className="mt-1" />
                <VStack className="ml-2">
                  <Text className="text-gray-700">
                    {checkout.personalInfo.address},{" "}
                    {checkout.personalInfo.number}
                  </Text>
                  <Text className="text-gray-700">
                    {checkout.personalInfo.neighborhood}
                  </Text>
                  <Text className="text-gray-700">Lima Duarte (MG)</Text>
                  {checkout.personalInfo.reference && (
                    <Text className="text-gray-500 text-sm mt-1">
                      Ponto de referência: {checkout.personalInfo.reference}
                    </Text>
                  )}
                </VStack>
              </HStack>
            </VStack>
          </View>
        )}

        {/* Itens do pedido */}
        <View className="mb-4">
          <Text className="font-semibold text-gray-800 mb-2">
            Itens do Pedido
          </Text>

          <VStack className="bg-gray-50 p-3 rounded-lg">
            {/* Produtos normais com adicionais */}
            {mainItems.map((item) => (
              <View key={item.id} className="mb-2">
                <HStack className="justify-between">
                  <VStack className="flex-1">
                    <HStack className="items-center">
                      <ShoppingBag size={14} color="#6B7280" />
                      <Text className="ml-2 text-gray-700">
                        {item.quantity}x {item.name}
                        {item.hasVariation && item.variationName
                          ? ` (${item.variationName})`
                          : ""}
                      </Text>
                    </HStack>

                    {/* Adicionais do item principal */}
                    {addons[item.id]?.map((addon, addonIndex) => (
                      <Text
                        key={`addon-${addonIndex}`}
                        className="text-xs text-gray-500 ml-6"
                      >
                        + {addon.quantity}x {addon.name}
                      </Text>
                    ))}

                    {/* Observação do item */}
                    {item.observation && (
                      <Text className="text-xs text-gray-500 ml-6">
                        Obs: {item.observation}
                      </Text>
                    )}
                  </VStack>
                  <Text className="font-medium text-gray-700">
                    {item.totalPriceFormatted}
                  </Text>
                </HStack>
              </View>
            ))}

            {/* Produtos customizados */}
            {customItems.map((item) => (
              <View key={item.id} className="mb-2">
                <HStack className="justify-between">
                  <VStack className="flex-1">
                    <HStack className="items-center">
                      <Sparkles size={14} color="#6B7280" />
                      <Text className="ml-2 text-gray-700">
                        {item.quantity}x {item.name} (Personalizado)
                      </Text>
                    </HStack>

                    {/* Detalhes dos passos customizados (simplificados) */}
                    {item.customProductSteps?.map((step, stepIndex) => (
                      <Text
                        key={`step-${stepIndex}`}
                        className="text-xs text-gray-500 ml-6"
                      >
                        {step.stepName && `${step.stepName}: `}
                        {step.selectedItems.map((i) => i.name).join(", ")}
                      </Text>
                    ))}

                    {/* Observação do item */}
                    {item.observation && (
                      <Text className="text-xs text-gray-500 ml-6">
                        Obs: {item.observation}
                      </Text>
                    )}
                  </VStack>
                  <Text className="font-medium text-gray-700">
                    {item.totalPriceFormatted}
                  </Text>
                </HStack>
              </View>
            ))}

            <Divider className="my-2" />

            <HStack className="justify-between">
              <Text className="font-semibold text-gray-800">Total</Text>
              <Text className="font-bold text-gray-800">
                {checkout.total.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </Text>
            </HStack>
          </VStack>
        </View>

        {/* Forma de pagamento */}
        <View className="mb-2">
          <Text className="font-semibold text-gray-800 mb-2">
            Forma de Pagamento
          </Text>

          <VStack className="bg-gray-50 p-3 rounded-lg">
            <HStack className="items-center">
              {getPaymentIcon()}
              <Text className="ml-2 text-gray-700">
                {getPaymentMethodText()}
              </Text>
            </HStack>

            {checkout.paymentInfo.method === CheckoutPaymentMethod.CASH &&
              checkout.paymentInfo.change && (
                <Text className="ml-6 text-gray-600 text-sm mt-1">
                  Troco para: R$ {checkout.paymentInfo.change}
                </Text>
              )}
          </VStack>
        </View>
      </Card>

      <HStack space="md" className="mb-8">
        <Button
          onPress={prevStep}
          variant="outline"
          className="flex-1"
          isDisabled={isProcessing}
        >
          <Text className="font-medium">Voltar</Text>
        </Button>

        <Button
          onPress={finalizeOrder}
          style={{ backgroundColor: primaryColor }}
          className="flex-1"
          isDisabled={isProcessing}
        >
          {isProcessing ? (
            <HStack space="sm">
              <ActivityIndicator size="small" color="white" />
              <Text className="text-white font-medium">Processando...</Text>
            </HStack>
          ) : (
            <HStack space="sm">
              <Check size={18} color="white" />
              <Text className="text-white font-medium">Finalizar Pedido</Text>
            </HStack>
          )}
        </Button>
      </HStack>
    </ScrollView>
  );
}
