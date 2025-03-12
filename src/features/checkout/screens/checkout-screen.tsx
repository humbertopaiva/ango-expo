// Path: src/features/checkout/screens/checkout-screen.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  Platform,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import ScreenHeader from "@/components/ui/screen-header";
import { Card, VStack, HStack, Divider, Button } from "@gluestack-ui/themed";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  MapPin,
  CreditCard,
  Banknote,
  Wallet,
  ChevronRight,
  Clock,
  CheckCircle,
  ChevronDown,
  Phone as PhoneIcon, // Renomeado para evitar conflito
} from "lucide-react-native";
import { useCartViewModel } from "@/src/features/cart/view-models/use-cart-view-model";
import { useOrderViewModel } from "@/src/features/orders/view-models/use-order-view-model";
import { THEME_COLORS } from "@/src/styles/colors";
import { getContrastColor } from "@/src/utils/color.utils";
import { PaymentMethod } from "@/src/features/orders/models/order";

export function CheckoutScreen() {
  const { companySlug } = useLocalSearchParams<{ companySlug: string }>();
  const insets = useSafeAreaInsets();
  const cartViewModel = useCartViewModel();
  const orderViewModel = useOrderViewModel();

  const [isProcessing, setIsProcessing] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<PaymentMethod>(PaymentMethod.CREDIT_CARD);
  const [orderProcessed, setOrderProcessed] = useState(false);
  const [orderNumber, setOrderNumber] = useState<string | null>(null);

  const primaryColor = THEME_COLORS.primary;
  const contrastColor = getContrastColor(primaryColor);

  useEffect(() => {
    // Se o carrinho estiver vazio, redirecionar para a página da empresa
    if (cartViewModel.isEmpty && !orderProcessed) {
      router.replace(`/(drawer)/empresa/${companySlug}`);
    }
  }, [cartViewModel.isEmpty, companySlug, orderProcessed]);

  // Formatar o telefone enquanto o usuário digita
  const formatPhoneNumber = (text: string) => {
    // Remove tudo exceto números
    const cleaned = text.replace(/\D/g, "");

    // Limita ao tamanho máximo de um número de telefone
    const limited = cleaned.substring(0, 11);

    // Aplica a formatação
    let formatted = limited;
    if (limited.length > 2) {
      formatted = `(${limited.substring(0, 2)}) ${limited.substring(2)}`;

      if (limited.length > 7) {
        formatted = `(${limited.substring(0, 2)}) ${limited.substring(
          2,
          7
        )}-${limited.substring(7)}`;
      }
    }

    return formatted;
  };

  const handlePhoneChange = (text: string) => {
    setContactPhone(formatPhoneNumber(text));
  };

  // Processar o pedido
  const handlePlaceOrder = async () => {
    if (!deliveryAddress.trim()) {
      Alert.alert(
        "Endereço necessário",
        "Por favor, informe seu endereço de entrega."
      );
      return;
    }

    if (!contactPhone.trim() || contactPhone.length < 14) {
      Alert.alert(
        "Telefone necessário",
        "Por favor, informe um número de telefone válido."
      );
      return;
    }

    try {
      setIsProcessing(true);

      // Processar o pedido usando o OrderViewModel
      const order = await orderViewModel.placeOrder(selectedPaymentMethod);

      if (order) {
        setOrderProcessed(true);
        setOrderNumber(order.id);

        // Aqui você pode adicionar lógica para enviar os detalhes de entrega
        // para o seu backend através de uma API
      } else {
        Alert.alert(
          "Erro",
          "Não foi possível processar seu pedido. Tente novamente."
        );
      }
    } catch (error) {
      console.error("Erro ao finalizar pedido:", error);
      Alert.alert("Erro", "Ocorreu um erro ao processar seu pedido.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Ir para a tela de acompanhamento de pedido
  const goToOrderTracking = () => {
    if (orderNumber) {
      router.push(`/(drawer)/empresa/${companySlug}/orders/${orderNumber}`);
    }
  };

  // Voltar para a loja
  const goBackToStore = () => {
    router.replace(`/(drawer)/empresa/${companySlug}`);
  };

  // Renderizar o conteúdo após o processamento do pedido
  if (orderProcessed) {
    return (
      <View className="flex-1 bg-white">
        <ScreenHeader title="Pedido Confirmado" showBackButton={false} />

        <View className="flex-1 items-center justify-center p-6">
          <View className="items-center mb-8">
            <View
              className="w-20 h-20 rounded-full items-center justify-center mb-4"
              style={{ backgroundColor: `${primaryColor}15` }}
            >
              <CheckCircle size={40} color={primaryColor} />
            </View>

            <Text className="text-2xl font-bold text-gray-800 mb-2">
              Pedido realizado com sucesso!
            </Text>

            <Text className="text-gray-600 text-center mb-2">
              Seu pedido #{orderNumber?.replace("order_", "").substring(0, 6)}{" "}
              foi confirmado.
            </Text>

            <HStack className="items-center space-x-1 mb-6">
              <Clock size={16} color="#6B7280" />
              <Text className="text-gray-500">
                Tempo estimado de entrega: 30-45 minutos
              </Text>
            </HStack>
          </View>

          <VStack space="lg" className="w-full">
            <Button
              onPress={goToOrderTracking}
              style={{ backgroundColor: primaryColor }}
            >
              <Text className="text-white font-bold">Acompanhar Pedido</Text>
            </Button>

            <Button variant="outline" onPress={goBackToStore}>
              <Text className="font-medium" style={{ color: primaryColor }}>
                Voltar para a Loja
              </Text>
            </Button>
          </VStack>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      <ScreenHeader
        title="Finalizar Pedido"
        subtitle="Complete as informações para delivery"
        showBackButton={true}
        onBackPress={() => router.back()}
      />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 16, paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Informações de Entrega */}
        <Card className="p-4 mb-4 border border-gray-100">
          <Text className="font-semibold text-gray-800 text-base mb-3">
            Informações de Entrega
          </Text>

          <VStack space="lg">
            <VStack>
              <Text className="text-gray-700 mb-1">Endereço de Entrega</Text>
              <View className="flex-row items-center bg-white border border-gray-200 rounded-lg px-3 py-2">
                <MapPin size={18} color="#9CA3AF" />
                <TextInput
                  value={deliveryAddress}
                  onChangeText={setDeliveryAddress}
                  placeholder="Ex: Rua exemplo, 123 - Bairro"
                  className="flex-1 ml-2 text-gray-800"
                />
              </View>
            </VStack>

            <VStack>
              <Text className="text-gray-700 mb-1">Telefone para Contato</Text>
              <View className="flex-row items-center bg-white border border-gray-200 rounded-lg px-3 py-2">
                <PhoneIcon size={18} color="#9CA3AF" />
                <TextInput
                  value={contactPhone}
                  onChangeText={handlePhoneChange}
                  placeholder="(00) 00000-0000"
                  keyboardType="phone-pad"
                  className="flex-1 ml-2 text-gray-800"
                />
              </View>
            </VStack>
          </VStack>
        </Card>

        {/* Seleção de Forma de Pagamento */}
        <Card className="p-4 mb-4 border border-gray-100">
          <Text className="font-semibold text-gray-800 text-base mb-3">
            Forma de Pagamento
          </Text>

          <VStack space="sm">
            {/* Cartão de Crédito */}
            <TouchableOpacity
              onPress={() =>
                setSelectedPaymentMethod(PaymentMethod.CREDIT_CARD)
              }
              className={`p-3 rounded-lg border ${
                selectedPaymentMethod === PaymentMethod.CREDIT_CARD
                  ? `border-${primaryColor} bg-${primaryColor}10`
                  : "border-gray-200 bg-white"
              }`}
              style={{
                borderColor:
                  selectedPaymentMethod === PaymentMethod.CREDIT_CARD
                    ? primaryColor
                    : "#E5E7EB",
                backgroundColor:
                  selectedPaymentMethod === PaymentMethod.CREDIT_CARD
                    ? `${primaryColor}10`
                    : "white",
              }}
            >
              <HStack space="md" alignItems="center">
                <CreditCard
                  size={20}
                  color={
                    selectedPaymentMethod === PaymentMethod.CREDIT_CARD
                      ? primaryColor
                      : "#6B7280"
                  }
                />
                <Text
                  className="font-medium"
                  style={{
                    color:
                      selectedPaymentMethod === PaymentMethod.CREDIT_CARD
                        ? primaryColor
                        : "#374151",
                  }}
                >
                  Cartão de Crédito
                </Text>
              </HStack>
            </TouchableOpacity>

            {/* Cartão de Débito */}
            <TouchableOpacity
              onPress={() => setSelectedPaymentMethod(PaymentMethod.DEBIT_CARD)}
              className={`p-3 rounded-lg border ${
                selectedPaymentMethod === PaymentMethod.DEBIT_CARD
                  ? `border-${primaryColor} bg-${primaryColor}10`
                  : "border-gray-200 bg-white"
              }`}
              style={{
                borderColor:
                  selectedPaymentMethod === PaymentMethod.DEBIT_CARD
                    ? primaryColor
                    : "#E5E7EB",
                backgroundColor:
                  selectedPaymentMethod === PaymentMethod.DEBIT_CARD
                    ? `${primaryColor}10`
                    : "white",
              }}
            >
              <HStack space="md" alignItems="center">
                <CreditCard
                  size={20}
                  color={
                    selectedPaymentMethod === PaymentMethod.DEBIT_CARD
                      ? primaryColor
                      : "#6B7280"
                  }
                />
                <Text
                  className="font-medium"
                  style={{
                    color:
                      selectedPaymentMethod === PaymentMethod.DEBIT_CARD
                        ? primaryColor
                        : "#374151",
                  }}
                >
                  Cartão de Débito
                </Text>
              </HStack>
            </TouchableOpacity>

            {/* Dinheiro */}
            <TouchableOpacity
              onPress={() => setSelectedPaymentMethod(PaymentMethod.CASH)}
              className={`p-3 rounded-lg border ${
                selectedPaymentMethod === PaymentMethod.CASH
                  ? `border-${primaryColor} bg-${primaryColor}10`
                  : "border-gray-200 bg-white"
              }`}
              style={{
                borderColor:
                  selectedPaymentMethod === PaymentMethod.CASH
                    ? primaryColor
                    : "#E5E7EB",
                backgroundColor:
                  selectedPaymentMethod === PaymentMethod.CASH
                    ? `${primaryColor}10`
                    : "white",
              }}
            >
              <HStack space="md" alignItems="center">
                <Banknote
                  size={20}
                  color={
                    selectedPaymentMethod === PaymentMethod.CASH
                      ? primaryColor
                      : "#6B7280"
                  }
                />
                <Text
                  className="font-medium"
                  style={{
                    color:
                      selectedPaymentMethod === PaymentMethod.CASH
                        ? primaryColor
                        : "#374151",
                  }}
                >
                  Dinheiro
                </Text>
              </HStack>
            </TouchableOpacity>

            {/* PIX */}
            <TouchableOpacity
              onPress={() => setSelectedPaymentMethod(PaymentMethod.PIX)}
              className={`p-3 rounded-lg border ${
                selectedPaymentMethod === PaymentMethod.PIX
                  ? `border-${primaryColor} bg-${primaryColor}10`
                  : "border-gray-200 bg-white"
              }`}
              style={{
                borderColor:
                  selectedPaymentMethod === PaymentMethod.PIX
                    ? primaryColor
                    : "#E5E7EB",
                backgroundColor:
                  selectedPaymentMethod === PaymentMethod.PIX
                    ? `${primaryColor}10`
                    : "white",
              }}
            >
              <HStack space="md" alignItems="center">
                <Wallet
                  size={20}
                  color={
                    selectedPaymentMethod === PaymentMethod.PIX
                      ? primaryColor
                      : "#6B7280"
                  }
                />
                <Text
                  className="font-medium"
                  style={{
                    color:
                      selectedPaymentMethod === PaymentMethod.PIX
                        ? primaryColor
                        : "#374151",
                  }}
                >
                  PIX
                </Text>
              </HStack>
            </TouchableOpacity>
          </VStack>
        </Card>

        {/* Resumo do Pedido */}
        <Card className="p-4 mb-4 border border-gray-100">
          <Text className="font-semibold text-gray-800 text-base mb-3">
            Resumo do Pedido
          </Text>

          <VStack space="sm">
            <HStack className="justify-between">
              <Text className="text-gray-600">
                Subtotal ({cartViewModel.itemCount}{" "}
                {cartViewModel.itemCount === 1 ? "item" : "itens"})
              </Text>
              <Text className="font-medium text-gray-800">
                {cartViewModel.subtotal}
              </Text>
            </HStack>

            <HStack className="justify-between">
              <Text className="text-gray-600">Taxa de entrega</Text>
              <Text className="font-medium text-gray-800">R$ 5,00</Text>
            </HStack>

            <Divider className="my-2" />

            <HStack className="justify-between">
              <Text className="font-semibold text-gray-800">Total</Text>
              <Text className="font-bold text-lg text-gray-800">
                {cartViewModel.total}
              </Text>
            </HStack>
          </VStack>
        </Card>
      </ScrollView>

      {/* Botão de Finalizar Pedido */}
      <View
        className="absolute left-0 right-0 bottom-0 p-4 bg-white border-t border-gray-200"
        style={{ paddingBottom: Math.max(insets.bottom, 16) }}
      >
        <Button
          onPress={handlePlaceOrder}
          style={{ backgroundColor: primaryColor }}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <HStack space="sm" alignItems="center">
              <ActivityIndicator size="small" color="white" />
              <Text className="text-white font-bold">Processando...</Text>
            </HStack>
          ) : (
            <Text className="text-white font-bold">Confirmar Pedido</Text>
          )}
        </Button>
      </View>
    </View>
  );
}
