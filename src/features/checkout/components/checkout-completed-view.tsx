// Path: src/features/checkout/components/checkout-completed-view.tsx
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
  Linking,
} from "react-native";
import { Card, VStack, HStack, Button } from "@gluestack-ui/themed";
import {
  CheckCircle,
  MessageSquare,
  Store,
  ChevronRight,
  ArrowRight,
  ShoppingBag,
} from "lucide-react-native";
import { useCheckoutViewModel } from "../view-models/use-checkout-view-model";
import { useCartViewModel } from "@/src/features/cart/view-models/use-cart-view-model";

interface CheckoutCompletedViewProps {
  onBackToStore: () => void;
}

export function CheckoutCompletedView({
  onBackToStore,
}: CheckoutCompletedViewProps) {
  const checkoutVm = useCheckoutViewModel();
  const { width } = Dimensions.get("window");

  // Cor primária da empresa ou valor padrão
  const primaryColor = checkoutVm.companyConfig?.primaryColor || "#F4511E";

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        paddingBottom: 40,
        alignItems: "center",
      }}
    >
      {/* Animação de sucesso */}
      <View className="items-center justify-center mb-8 mt-4">
        <View
          className="w-24 h-24 rounded-full items-center justify-center mb-6"
          style={{ backgroundColor: `${primaryColor}15` }}
        >
          <CheckCircle size={64} color={primaryColor} />
        </View>

        <Text className="text-2xl font-bold text-gray-800 text-center mb-2">
          Pedido Enviado!
        </Text>

        <Text className="text-base text-gray-600 text-center max-w-xs">
          Sua solicitação foi enviada com sucesso para o estabelecimento via
          WhatsApp.
        </Text>
      </View>

      {/* Card de próximos passos */}
      <Card className="p-4 border border-gray-100 mb-8 w-full">
        <Text className="text-lg font-semibold text-gray-800 mb-4">
          Próximos Passos
        </Text>

        <VStack space="md">
          <HStack space="md" alignItems="flex-start">
            <View
              className="w-8 h-8 rounded-full items-center justify-center"
              style={{ backgroundColor: `${primaryColor}15` }}
            >
              <Text
                className="font-bold text-primary-600"
                style={{ color: primaryColor }}
              >
                1
              </Text>
            </View>

            <VStack className="flex-1">
              <Text className="font-medium text-gray-800">
                Aguarde a confirmação
              </Text>
              <Text className="text-sm text-gray-600 mt-1">
                O estabelecimento receberá seu pedido e enviará uma confirmação
                pelo WhatsApp.
              </Text>
            </VStack>
          </HStack>

          <HStack space="md" alignItems="flex-start">
            <View
              className="w-8 h-8 rounded-full items-center justify-center"
              style={{ backgroundColor: `${primaryColor}15` }}
            >
              <Text
                className="font-bold text-primary-600"
                style={{ color: primaryColor }}
              >
                2
              </Text>
            </View>

            <VStack className="flex-1">
              <Text className="font-medium text-gray-800">
                Preparação do pedido
              </Text>
              <Text className="text-sm text-gray-600 mt-1">
                Após a confirmação, seu pedido entrará em preparação.
              </Text>
            </VStack>
          </HStack>

          <HStack space="md" alignItems="flex-start">
            <View
              className="w-8 h-8 rounded-full items-center justify-center"
              style={{ backgroundColor: `${primaryColor}15` }}
            >
              <Text
                className="font-bold text-primary-600"
                style={{ color: primaryColor }}
              >
                3
              </Text>
            </View>

            <VStack className="flex-1">
              <Text className="font-medium text-gray-800">
                {checkoutVm.deliveryMethod === "delivery"
                  ? "Entrega"
                  : "Retirada"}
              </Text>
              <Text className="text-sm text-gray-600 mt-1">
                {checkoutVm.deliveryMethod === "delivery"
                  ? "Seu pedido será entregue no endereço informado."
                  : "Você poderá retirar seu pedido no estabelecimento quando estiver pronto."}
              </Text>
            </VStack>
          </HStack>
        </VStack>
      </Card>

      {/* Empresa */}
      {checkoutVm.companyConfig?.companyName && (
        <Card className="p-4 border border-gray-100 mb-6 w-full">
          <HStack space="md" alignItems="center" className="mb-3">
            <View className="w-12 h-12 rounded-lg items-center justify-center bg-gray-100">
              <Store size={24} color="#6B7280" />
            </View>

            <VStack className="flex-1">
              <Text className="font-medium text-gray-800">
                {checkoutVm.companyConfig.companyName}
              </Text>

              {checkoutVm.deliveryMethod === "delivery" &&
                checkoutVm.companyConfig.deliveryConfig?.estimatedTime && (
                  <Text className="text-xs text-gray-500 mt-1">
                    Tempo estimado de entrega:{" "}
                    {checkoutVm.companyConfig.deliveryConfig.estimatedTime} min
                  </Text>
                )}
            </VStack>
          </HStack>

          <TouchableOpacity
            onPress={onBackToStore}
            className="mt-2 border border-gray-200 rounded-lg p-3 flex-row items-center justify-center"
          >
            <Text
              className="font-medium text-primary-600 mr-2"
              style={{ color: primaryColor }}
            >
              Voltar para a loja
            </Text>
            <ArrowRight size={16} color={primaryColor} />
          </TouchableOpacity>
        </Card>
      )}

      {/* Botão de contato via WhatsApp */}
      {checkoutVm.companyConfig?.whatsapp && (
        <Card className="p-4 border border-gray-100 w-full">
          <Button
            onPress={() => {
              // Abrir WhatsApp com o número do estabelecimento
              const phoneNumber = checkoutVm.companyConfig?.whatsapp?.replace(
                /\D/g,
                ""
              );
              const whatsappUrl = `https://wa.me/${phoneNumber}`;
              Linking.openURL(whatsappUrl);
            }}
            style={{ backgroundColor: "#25D366" }}
          >
            <HStack space="sm" alignItems="center">
              <MessageSquare size={20} color="white" />
              <Text className="text-white font-bold">
                Enviar mensagem pelo WhatsApp
              </Text>
            </HStack>
          </Button>

          <Text className="text-xs text-center text-gray-500 mt-3">
            Se precisar entrar em contato com o estabelecimento, você pode
            enviar uma mensagem diretamente pelo WhatsApp.
          </Text>
        </Card>
      )}
    </ScrollView>
  );
}
