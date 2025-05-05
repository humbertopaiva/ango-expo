// Path: src/features/checkout/components/order-confirmation-step.tsx

import React from "react";
import { View, Text, ScrollView } from "react-native";
import { Card, VStack, HStack, Divider } from "@gluestack-ui/themed";
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
  CheckCircle,
  MapPinned,
  Navigation,
  Info,
} from "lucide-react-native";
import { useCheckoutViewModel } from "../view-models/use-checkout-view-model";
import {
  CheckoutDeliveryType,
  CheckoutPaymentMethod,
} from "../models/checkout";
import { THEME_COLORS } from "@/src/styles/colors";
import { CartProcessorService } from "../services/cart-processor.service";

export function OrderConfirmationStep() {
  const { checkout, forcedDeliveryFee, deliveryConfig } =
    useCheckoutViewModel();
  const primaryColor = THEME_COLORS.primary;

  const isDelivery = checkout.deliveryType === CheckoutDeliveryType.DELIVERY;
  const isDeliveryFree =
    checkout.deliveryFee === 0 || checkout.deliveryFee === undefined;

  // Usar o CartProcessorService para processar os itens
  const { mainItems, addons, customItems } = CartProcessorService.processItems(
    checkout.items
  );

  // Ícone para método de pagamento
  const getPaymentIcon = () => {
    switch (checkout.paymentInfo.method) {
      case CheckoutPaymentMethod.PIX:
        return <Smartphone size={18} color={primaryColor} />;
      case CheckoutPaymentMethod.CREDIT_CARD:
      case CheckoutPaymentMethod.DEBIT_CARD:
        return <CreditCard size={18} color={primaryColor} />;
      case CheckoutPaymentMethod.CASH:
        return <Banknote size={18} color={primaryColor} />;
      default:
        return <CreditCard size={18} color={primaryColor} />;
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
    <ScrollView
      className="flex-1"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ padding: 16, paddingBottom: 24 }}
    >
      {/* Banner de confirmação */}
      <View className="mb-4 p-4 bg-green-50 rounded-lg border border-green-100">
        <HStack alignItems="center" className="mb-2">
          <CheckCircle size={24} color="#22C55E" className="mr-3" />
          <Text className="text-lg font-bold text-green-700">
            Tudo pronto para finalizar!
          </Text>
        </HStack>
        <Text className="text-green-700">
          Revise todos os detalhes do seu pedido abaixo antes de finalizar.
        </Text>
      </View>

      {/* Tipo de entrega */}
      <Card className="p-4 mb-4 border border-gray-100">
        <View className="flex-row items-center mb-2">
          {isDelivery ? (
            <Truck size={18} color={primaryColor} className="mr-2" />
          ) : (
            <Home size={18} color={primaryColor} className="mr-2" />
          )}
          <Text className="text-lg font-semibold text-gray-800">
            {isDelivery ? "Entrega" : "Retirada no local"}
          </Text>
        </View>

        <Text className="text-gray-600 mb-3">
          {isDelivery
            ? "Seu pedido será entregue no endereço informado"
            : "Você poderá retirar seu pedido diretamente no estabelecimento"}
        </Text>

        {/* Dados pessoais */}
        <View className="mb-4">
          <Text className="font-semibold text-gray-800 mb-2">Seus Dados</Text>

          <View className="bg-gray-50 p-3 rounded-lg">
            <HStack className="items-center mb-2">
              <User size={16} color="#4B5563" className="mr-2" />
              <Text className="text-gray-700 font-medium">
                {checkout.personalInfo.fullName}
              </Text>
            </HStack>

            <HStack className="items-center">
              <Phone size={16} color="#4B5563" className="mr-2" />
              <Text className="text-gray-700">
                {checkout.personalInfo.whatsapp}
              </Text>
            </HStack>
          </View>
        </View>

        {/* Endereço (se for entrega) */}
        {isDelivery && (
          <View className="mb-4">
            <Text className="font-semibold text-gray-800 mb-2">
              Endereço de Entrega
            </Text>

            <View className="bg-gray-50 p-3 rounded-lg">
              <HStack className="items-start mb-2">
                <MapPin size={16} color="#4B5563" className="mt-1 mr-2" />
                <Text className="text-gray-700 flex-1">
                  {checkout.personalInfo.address},{" "}
                  {checkout.personalInfo.number}
                </Text>
              </HStack>
              <HStack className="items-center mb-2">
                <MapPinned size={16} color="#4B5563" className="mr-2" />
                <Text className="text-gray-700 font-medium">
                  {checkout.personalInfo.neighborhood}, Lima Duarte (MG)
                </Text>
              </HStack>

              {checkout.personalInfo.reference && (
                <HStack className="items-center">
                  <Navigation size={16} color="#4B5563" className="mr-2" />
                  <Text className="text-gray-700">
                    {checkout.personalInfo.reference}
                  </Text>
                </HStack>
              )}
            </View>
          </View>
        )}

        {/* Forma de pagamento */}
        <View className="mb-3">
          <Text className="font-semibold text-gray-800 mb-2">
            Forma de Pagamento
          </Text>

          <View className="bg-gray-50 p-3 rounded-lg">
            <HStack className="items-center">
              {getPaymentIcon()}
              <Text className="ml-2 text-gray-700 font-medium">
                {getPaymentMethodText()}
              </Text>
            </HStack>

            {checkout.paymentInfo.method === CheckoutPaymentMethod.CASH &&
              checkout.paymentInfo.change && (
                <View className="mt-2 ml-6 bg-blue-50 p-2 rounded border border-blue-100">
                  <Text className="text-blue-700">
                    Troco para: {checkout.paymentInfo.change}
                  </Text>
                </View>
              )}
          </View>
        </View>
      </Card>

      {/* Itens do pedido */}
      <Card className="p-4 mb-4 border border-gray-100">
        <Text className="text-lg font-semibold text-gray-800 mb-3">
          Itens do Pedido
        </Text>

        <View className="bg-gray-50 p-3 rounded-lg">
          {/* Produtos normais com adicionais */}
          {mainItems.map((item, idx) => (
            <View
              key={item.id}
              className={idx > 0 ? "mt-3 pt-3 border-t border-gray-200" : ""}
            >
              <HStack className="justify-between mb-1">
                <View className="flex-1 flex-row">
                  <View className="w-6 h-6 bg-gray-200 rounded-full items-center justify-center mr-2">
                    <Text className="text-xs font-bold text-gray-700">
                      {idx + 1}
                    </Text>
                  </View>
                  <View className="flex-1">
                    <Text className="text-gray-800 font-medium">
                      {item.quantity}x {item.name}
                      {item.hasVariation && item.variationName
                        ? ` (${item.variationName})`
                        : ""}
                    </Text>
                    <Text className="text-sm text-gray-500">
                      {item.totalPriceFormatted}
                    </Text>
                  </View>
                </View>
              </HStack>

              {/* Adicionais do item principal com preços */}
              {addons[item.id]?.map((addon, addonIndex) => (
                <View
                  key={`addon-${addonIndex}`}
                  className="flex-row justify-between ml-8 mb-0.5"
                >
                  <Text className="text-sm text-gray-600">
                    + {addon.quantity}x {addon.name}
                  </Text>
                  <Text className="text-sm text-gray-600">
                    {(addon.price * addon.quantity).toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </Text>
                </View>
              ))}

              {/* Observação do item */}
              {item.observation && (
                <View className="ml-8 mt-1 bg-gray-100 p-2 rounded">
                  <Text className="text-xs text-gray-600">
                    <Text className="font-medium">Observação:</Text>{" "}
                    {item.observation}
                  </Text>
                </View>
              )}
            </View>
          ))}

          {/* Produtos customizados */}
          {customItems.map((item, idx) => (
            <View key={item.id} className="mt-3 pt-3 border-t border-gray-200">
              <HStack className="justify-between mb-1">
                <View className="flex-1 flex-row">
                  <View className="w-6 h-6 bg-blue-100 rounded-full items-center justify-center mr-2">
                    <Sparkles size={14} color="#3B82F6" />
                  </View>
                  <View className="flex-1">
                    <View className="flex-row items-center">
                      <Text className="text-gray-800 font-medium">
                        {item.quantity}x {item.name}
                      </Text>
                      <View className="bg-blue-100 px-2 py-0.5 rounded ml-2">
                        <Text className="text-xs text-blue-700 font-medium">
                          Personalizado
                        </Text>
                      </View>
                    </View>
                    <Text className="text-sm text-gray-500">
                      {item.totalPriceFormatted}
                    </Text>
                  </View>
                </View>
              </HStack>

              {/* Detalhes dos passos customizados */}
              {item.customProductSteps?.map((step, stepIndex) => (
                <View key={`step-${stepIndex}`} className="ml-8 mb-0.5">
                  <Text className="text-sm text-gray-600">
                    {step.stepName && (
                      <Text className="font-medium">{step.stepName}:</Text>
                    )}{" "}
                    {step.selectedItems.map((i) => i.name).join(", ")}
                  </Text>
                </View>
              ))}

              {/* Observação do item */}
              {item.observation && (
                <View className="ml-8 mt-1 bg-gray-100 p-2 rounded">
                  <Text className="text-xs text-gray-600">
                    <Text className="font-medium">Observação:</Text>{" "}
                    {item.observation}
                  </Text>
                </View>
              )}
            </View>
          ))}

          <Divider className="my-4" />

          {/* Resumo de valores */}
          <VStack space="sm">
            <HStack className="justify-between">
              <Text className="text-gray-600">Subtotal</Text>
              <Text className="font-medium text-gray-800">
                {checkout.subtotal.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </Text>
            </HStack>

            {/* Taxa de entrega */}
            <HStack className="justify-between">
              <Text className="text-gray-600">Taxa de entrega</Text>
              {isDelivery ? (
                <Text
                  className={`font-medium ${
                    isDeliveryFree ? "text-green-600" : "text-gray-800"
                  }`}
                >
                  {isDeliveryFree ? "Grátis" : forcedDeliveryFee}
                </Text>
              ) : (
                <Text className="font-medium text-green-600">Grátis</Text>
              )}
            </HStack>

            <Divider className="my-2" />

            <HStack className="justify-between">
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
        </View>
      </Card>

      {/* Instruções finais */}
      <Card className="p-4 mb-4 border border-gray-100">
        <HStack space="sm" alignItems="flex-start">
          <Info size={18} color={primaryColor} className="mt-1" />
          <View className="flex-1">
            <Text className="text-gray-700 font-medium mb-1">
              O que acontece após finalizar?
            </Text>
            <Text className="text-gray-600 text-sm mb-2">
              Seu pedido será enviado via WhatsApp para {checkout.companyName}.
            </Text>
            <Text className="text-gray-600 text-sm">
              Você será redirecionado para o WhatsApp para confirmar e enviar
              sua mensagem. O estabelecimento entrará em contato para confirmar
              seu pedido.
            </Text>
          </View>
        </HStack>

        {checkout.paymentInfo.method === CheckoutPaymentMethod.PIX && (
          <View className="mt-3 p-3 bg-blue-50 rounded-lg">
            <HStack space="sm" alignItems="flex-start">
              <Smartphone size={16} color="#3B82F6" className="mt-1" />
              <View className="flex-1">
                <Text className="text-blue-700 font-medium mb-1">
                  Pagamento via PIX
                </Text>
                <Text className="text-blue-700 text-sm">
                  Você receberá as informações para pagamento via PIX no
                  WhatsApp após confirmar o pedido.
                </Text>
              </View>
            </HStack>
          </View>
        )}
      </Card>

      {/* Botão de finalizar */}
      <View className="mb-4 p-4 bg-green-50 rounded-lg border border-green-100">
        <HStack alignItems="center" className="mb-1">
          <CheckCircle size={18} color="#22C55E" className="mr-2" />
          <Text className="text-green-700 font-medium">
            Pronto para finalizar seu pedido?
          </Text>
        </HStack>
        <Text className="text-green-700 text-sm">
          Clique no botão abaixo para enviar seu pedido para{" "}
          {checkout.companyName}.
        </Text>
      </View>
    </ScrollView>
  );
}
