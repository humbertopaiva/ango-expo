// Path: src/features/cart/screens/cart-screen.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { ShoppingBag, ArrowLeft, Trash2 } from "lucide-react-native";
import ScreenHeader from "@/components/ui/screen-header";
import { Card, Button, VStack, HStack } from "@gluestack-ui/themed";
import { useCartViewModel } from "../view-models/use-cart-view-model";
import { useOrderViewModel } from "@/src/features/orders/view-models/use-order-view-model";
import { THEME_COLORS } from "@/src/styles/colors";

export function CartScreen() {
  const { companySlug } = useLocalSearchParams<{ companySlug: string }>();
  const cart = useCartViewModel();
  const orderViewModel = useOrderViewModel();
  const [isProcessing, setIsProcessing] = useState(false);

  // Verifica se o carrinho está vazio
  const cartIsEmpty = cart.isEmpty;

  // Botão para retornar à página da empresa
  const handleBackToCompany = () => {
    router.push(`/(drawer)/empresa/${companySlug}`);
  };

  // Botão para adicionar produtos
  const handleAddProducts = () => {
    router.push(`/(drawer)/empresa/${companySlug}`);
  };

  // Botão para finalizar pedido
  const handleCheckout = async () => {
    try {
      setIsProcessing(true);
      const order = await orderViewModel.placeOrder();

      if (order) {
        // Navega para a página de pedidos após finalizar
        router.push(`/(drawer)/empresa/${companySlug}/orders`);
      }
    } catch (error) {
      console.error("Erro ao finalizar pedido:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <View className="flex-1 bg-background">
      {/* Cabeçalho com título e botão de voltar */}
      <ScreenHeader
        title="Carrinho"
        subtitle="Revise seus produtos antes de finalizar"
        showBackButton={true}
        onBackPress={handleBackToCompany}
      />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 16, paddingBottom: 80 }}
      >
        {cartIsEmpty ? (
          // Exibe mensagem quando o carrinho está vazio
          <Card className="p-8 items-center justify-center border border-gray-200">
            <ShoppingBag size={64} color="#9CA3AF" className="mb-4" />
            <Text className="text-lg font-semibold text-gray-800 mb-2 text-center">
              Seu carrinho está vazio
            </Text>
            <Text className="text-gray-500 text-center mb-6">
              Adicione produtos da loja para começar seu pedido
            </Text>
            <Button onPress={handleAddProducts} className="bg-primary-500">
              <Button.Text>Adicionar Produtos</Button.Text>
            </Button>
          </Card>
        ) : (
          // Exibe os itens do carrinho (conteúdo a ser implementado futuramente)
          <VStack space="lg">
            <Text className="text-lg font-semibold">Seu Pedido</Text>

            {/* Lista de itens do carrinho (mockup) */}
            <Card className="p-4 border border-gray-200">
              <HStack className="justify-between">
                <Text className="font-medium">1x Produto Exemplo</Text>
                <Text>R$ 24,90</Text>
              </HStack>
              <Text className="text-gray-500 text-sm mt-1">
                Descrição do produto
              </Text>
              <HStack className="mt-4 justify-between">
                <TouchableOpacity className="flex-row items-center">
                  <Trash2 size={16} color="#EF4444" />
                  <Text className="text-red-500 ml-1">Remover</Text>
                </TouchableOpacity>
                <HStack space="xs">
                  <TouchableOpacity className="w-8 h-8 border border-gray-200 rounded-full items-center justify-center">
                    <Text className="font-bold">-</Text>
                  </TouchableOpacity>
                  <View className="w-8 h-8 border border-gray-200 rounded-full items-center justify-center">
                    <Text>1</Text>
                  </View>
                  <TouchableOpacity className="w-8 h-8 border border-gray-200 rounded-full items-center justify-center">
                    <Text className="font-bold">+</Text>
                  </TouchableOpacity>
                </HStack>
              </HStack>
            </Card>

            {/* Resumo do pedido */}
            <Card className="p-4 border border-gray-200">
              <Text className="font-semibold mb-2">Resumo do Pedido</Text>
              <HStack className="justify-between mb-1">
                <Text className="text-gray-600">Subtotal</Text>
                <Text>R$ 24,90</Text>
              </HStack>
              <HStack className="justify-between mb-1">
                <Text className="text-gray-600">Taxa de entrega</Text>
                <Text>R$ 5,00</Text>
              </HStack>
              <View className="border-t border-gray-200 my-2" />
              <HStack className="justify-between">
                <Text className="font-semibold">Total</Text>
                <Text className="font-bold">R$ 29,90</Text>
              </HStack>
            </Card>

            {/* Botão de finalizar pedido */}
            <Button
              onPress={handleCheckout}
              className="bg-primary-500 mt-4"
              isDisabled={isProcessing}
            >
              {isProcessing ? (
                <HStack space="sm">
                  <ActivityIndicator size="small" color="white" />
                  <Button.Text>Processando...</Button.Text>
                </HStack>
              ) : (
                <Button.Text>Finalizar Pedido</Button.Text>
              )}
            </Button>
          </VStack>
        )}
      </ScrollView>
    </View>
  );
}
