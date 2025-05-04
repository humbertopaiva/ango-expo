// Path: src/features/cart/screens/cart-screen.tsx

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { ShoppingBag, Trash2, CreditCard } from "lucide-react-native";
import {
  Card,
  Button,
  VStack,
  HStack,
  Divider,
  useToast,
} from "@gluestack-ui/themed";
import { useCartViewModel } from "../view-models/use-cart-view-model";
import { THEME_COLORS } from "@/src/styles/colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CartItem } from "../models/cart";
import { useMultiCartStore } from "../stores/cart.store";
import { toastUtils } from "@/src/utils/toast.utils";
import { CartItemComponent } from "../components/cart-item";
import { CartCustomProductComponent } from "../components/cart-custom-product";

export function CartScreen() {
  const { companySlug } = useLocalSearchParams<{ companySlug: string }>();
  const multiCartStore = useMultiCartStore();
  const cart = useCartViewModel();
  const [isProcessing, setIsProcessing] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [isCouponValid, setIsCouponValid] = useState(false);
  const [showCouponInput, setShowCouponInput] = useState(false);
  const insets = useSafeAreaInsets();
  const toast = useToast();

  // Efeito para definir o carrinho ativo com base no slug da URL
  useEffect(() => {
    if (companySlug) {
      multiCartStore.setActiveCart(companySlug);
    }
  }, [companySlug]);

  // Verificar se o carrinho está vazio
  const cartIsEmpty = cart.isEmpty;

  // Primary color para personalização baseada na empresa
  const primaryColor = THEME_COLORS.primary;

  // Botão para retornar à página da empresa
  const handleBackToCompany = () => {
    router.push(`/(drawer)/empresa/${companySlug}`);
  };

  // Botão para adicionar produtos
  const handleAddProducts = () => {
    router.push(`/(drawer)/empresa/${companySlug}`);
  };

  // Verificar cupom (mockado por enquanto)
  const handleApplyCoupon = () => {
    if (!couponCode.trim()) {
      Alert.alert("Erro", "Digite um código de cupom");
      return;
    }

    // Simulação de verificação de cupom
    setTimeout(() => {
      if (couponCode.toUpperCase() === "PROMO10") {
        setIsCouponValid(true);
        Alert.alert("Sucesso", "Cupom aplicado com sucesso!");
      } else {
        setIsCouponValid(false);
        Alert.alert("Erro", "Cupom inválido ou expirado");
      }
    }, 500);
  };

  // Botão para finalizar pedido
  const handleCheckout = async () => {
    try {
      setIsProcessing(true);

      // Verificar se temos um companySlug válido
      if (!companySlug) {
        Alert.alert(
          "Erro",
          "Não foi possível identificar a empresa para este carrinho."
        );
        return;
      }

      // Garantir que o carrinho ativo seja o da empresa atual
      multiCartStore.setActiveCart(companySlug);

      // Navegar para a tela de checkout
      router.push(`/(drawer)/empresa/${companySlug}/checkout`);
    } catch (error) {
      console.error("Erro ao processar pedido:", error);
      Alert.alert(
        "Erro ao processar",
        "Não foi possível finalizar seu pedido. Tente novamente."
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRemoveItemWithToast = (itemId: string) => {
    // Encontrar o item para obter o nome antes de remover
    const item = cart.items.find((item) => item.id === itemId);

    // Remover do carrinho
    cart.removeItem(itemId);

    // Mostrar toast se o item foi encontrado
    if (item) {
      toastUtils.info(toast, `${item.name} removido do carrinho`);
    }
  };

  const handleUpdateQuantityWithToast = (itemId: string, quantity: number) => {
    // Encontrar o item para obter o nome
    const item = cart.items.find((item) => item.id === itemId);

    // Atualizar quantidade
    cart.updateQuantity(itemId, quantity);

    // Mostrar toast se o item foi encontrado
    if (item) {
      toastUtils.success(toast, `Agora você tem ${quantity}x ${item.name}`);
    }
  };

  const handleClearCart = () => {
    // Verificar se tem itens no carrinho
    if (cart.items.length === 0) return;

    Alert.alert(
      "Limpar carrinho",
      "Tem certeza que deseja remover todos os itens do carrinho?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Limpar",
          style: "destructive",
          onPress: () => {
            // Limpar o carrinho atual
            cart.clearCart();
            toastUtils.success(toast, "Carrinho limpo com sucesso");
          },
        },
      ]
    );
  };

  // Processar itens do carrinho em categorias
  const processCartItems = () => {
    // Separate items into categories
    const mainItems: CartItem[] = [];
    const customItems: CartItem[] = [];
    const addonMap: Record<string, CartItem[]> = {};

    // First pass: identify addons by their parentItemId
    cart.items.forEach((item) => {
      if (
        item.isAddon ||
        (item.addons && item.addons.length > 0 && item.addons[0].parentItemId)
      ) {
        // It's an addon
        const parentId =
          item.parentItemId || (item.addons && item.addons[0].parentItemId);

        if (parentId) {
          if (!addonMap[parentId]) {
            addonMap[parentId] = [];
          }
          addonMap[parentId].push(item);
        }
      } else if (item.isCustomProduct) {
        // It's a custom product
        customItems.push(item);
      } else {
        // It's a main item (including products with variations)
        mainItems.push(item);
      }
    });

    return { mainItems, customItems, addonMap };
  };

  const { mainItems, customItems, addonMap } = processCartItems();

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
    >
      <View className="flex-1 bg-gray-50">
        {cartIsEmpty ? (
          // Exibe mensagem quando o carrinho está vazio
          <View className="flex-1 justify-center items-center px-4">
            <View className="p-8 items-center justify-centerw-full max-w-md">
              <ShoppingBag size={64} color="#9CA3AF" className="mb-4" />
              <Text className="text-lg font-semibold text-gray-800 mb-2 text-center">
                Seu carrinho está vazio
              </Text>
              <Text className="text-gray-500 text-center mb-6">
                Adicione produtos da loja para começar seu pedido
              </Text>
              <Button
                onPress={handleAddProducts}
                style={{ backgroundColor: primaryColor }}
              >
                <HStack space="sm" alignItems="center">
                  <ShoppingBag size={20} color="white" />
                  <Text className="text-white font-medium">
                    Explorar Produtos
                  </Text>
                </HStack>
              </Button>
            </View>
          </View>
        ) : (
          // Exibe os itens do carrinho
          <ScrollView
            className="flex-1"
            contentContainerStyle={{ padding: 16, paddingBottom: 160 }}
            showsVerticalScrollIndicator={false}
          >
            {/* Nome da empresa */}
            <HStack className="items-center justify-between mb-4">
              <Text className="text-lg font-semibold text-gray-800">
                {cart.companyName}
              </Text>

              <TouchableOpacity
                onPress={handleAddProducts}
                className="py-1 px-3 rounded-lg"
                style={{ backgroundColor: `${primaryColor}15` }}
              >
                <Text style={{ color: primaryColor }}>+ Adicionar itens</Text>
              </TouchableOpacity>
            </HStack>

            {/* Lista de itens do carrinho */}
            <View className="mb-6">
              <HStack className="justify-between items-center mb-2">
                <Text className="text-base font-medium text-gray-700">
                  Seu pedido ({cart.itemCount}{" "}
                  {cart.itemCount === 1 ? "item" : "itens"})
                </Text>

                {/* Botão de limpar carrinho */}
                <TouchableOpacity
                  onPress={handleClearCart}
                  className="flex-row items-center py-1 px-3 rounded-lg bg-red-50"
                >
                  <Trash2 size={14} color="#EF4444" className="mr-1" />
                  <Text className="text-red-500 text-sm">Limpar</Text>
                </TouchableOpacity>
              </HStack>

              {/* Render custom products first */}
              {customItems.length > 0 && (
                <>
                  {customItems.map((item) => (
                    <CartCustomProductComponent
                      key={item.id}
                      item={item}
                      onRemove={handleRemoveItemWithToast}
                      onUpdateQuantity={handleUpdateQuantityWithToast}
                      onUpdateObservation={cart.updateObservation}
                      primaryColor={primaryColor}
                    />
                  ))}
                </>
              )}

              {/* Render normal products */}
              {mainItems.map((item) => {
                const itemAddons = addonMap[item.id] || [];

                // Passa os adicionais específicos deste item
                return (
                  <CartItemComponent
                    key={item.id}
                    item={item}
                    addons={itemAddons}
                    onRemove={handleRemoveItemWithToast}
                    onUpdateQuantity={handleUpdateQuantityWithToast}
                    onUpdateObservation={cart.updateObservation}
                    primaryColor={primaryColor}
                  />
                );
              })}
            </View>

            {/* Resumo do pedido */}
            <Card className="p-4 border border-gray-100 mb-4">
              <Text className="font-semibold mb-3 text-base text-gray-800">
                Resumo do Pedido
              </Text>

              <VStack space="sm">
                <HStack className="justify-between">
                  <Text className="text-gray-600">Subtotal</Text>
                  <Text className="font-medium text-gray-800">
                    {cart.subtotal}
                  </Text>
                </HStack>

                <HStack className="justify-between">
                  <Text className="text-gray-600">Taxa de entrega</Text>
                  <Text className="font-medium text-gray-800">A calcular</Text>
                </HStack>

                {isCouponValid && (
                  <HStack className="justify-between">
                    <Text className="text-green-600">Desconto (PROMO10)</Text>
                    <Text className="font-medium text-green-600">-10%</Text>
                  </HStack>
                )}

                <Divider className="my-2" />

                <HStack className="justify-between">
                  <Text className="font-semibold text-gray-800">Total</Text>
                  <Text className="font-bold text-lg text-gray-800">
                    {isCouponValid
                      ? cart.total // Aplicar o desconto no cálculo real
                      : cart.total}
                  </Text>
                </HStack>
              </VStack>
            </Card>
          </ScrollView>
        )}

        {/* Barra inferior com botão de finalizar pedido */}
        {!cartIsEmpty && (
          <View
            className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3"
            style={{
              paddingBottom: Math.max(insets.bottom, 16),
              ...Platform.select({
                ios: {
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: -3 },
                  shadowOpacity: 0.1,
                  shadowRadius: 5,
                },
                android: {
                  elevation: 5,
                },
              }),
            }}
          >
            <HStack alignItems="center" justifyContent="space-between">
              <View>
                <Text className="text-gray-600 text-sm">Total</Text>
                <Text className="font-bold text-gray-800 text-lg">
                  {isCouponValid ? cart.total : cart.total}
                </Text>
              </View>

              <Button
                onPress={handleCheckout}
                style={{
                  backgroundColor: primaryColor,
                  height: 48,
                  borderRadius: 8,
                  paddingHorizontal: 16,
                }}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <HStack space="sm" alignItems="center">
                    <ActivityIndicator size="small" color="white" />
                    <Text className="text-white font-medium">
                      Processando...
                    </Text>
                  </HStack>
                ) : (
                  <HStack space="sm" alignItems="center">
                    <CreditCard size={18} color="white" />
                    <Text className="text-white font-medium">
                      Finalizar Pedido
                    </Text>
                  </HStack>
                )}
              </Button>
            </HStack>
          </View>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}
