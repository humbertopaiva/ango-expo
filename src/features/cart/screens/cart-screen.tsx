// Path: src/features/cart/screens/cart-screen.tsx

import React, { useState, useEffect, useCallback } from "react";
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
import { CartDeliverySelector } from "../components/cart-delivery-selector";
import { useCompanyPageContext } from "@/src/features/company-page/contexts/use-company-page-context";

export function CartScreen() {
  const { companySlug } = useLocalSearchParams<{ companySlug: string }>();
  const multiCartStore = useMultiCartStore();
  const cart = useCartViewModel();
  const companyContext = useCompanyPageContext();
  const [isProcessing, setIsProcessing] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [isCouponValid, setIsCouponValid] = useState(false);
  const [showCouponInput, setShowCouponInput] = useState(false);
  const insets = useSafeAreaInsets();
  const toast = useToast();

  // Memoizar processamento dos itens do carrinho para evitar recálculos desnecessários
  const processCartItems = useCallback(() => {
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
  }, [cart.items]);

  // Extrair processamento para fora do corpo do componente
  const { mainItems, customItems, addonMap } = processCartItems();

  // Efeito para definir o carrinho ativo com base no slug da URL - APENAS UMA VEZ AO MONTAR
  useEffect(() => {
    if (companySlug) {
      multiCartStore.setActiveCart(companySlug);
    }

    // Função de limpeza para evitar efeitos colaterais indesejados
    return () => {
      // Opcional: Limpar aqui se necessário
    };
  }, [companySlug]); // Dependência única - não incluir multiCartStore para evitar loops

  // Verificar se o carrinho está vazio
  const cartIsEmpty = cart.isEmpty;

  // Primary color para personalização baseada na empresa
  const primaryColor = THEME_COLORS.primary;

  // Memoizar handlers para evitar recriações a cada renderização
  const handleBackToCompany = useCallback(() => {
    router.push(`/(drawer)/empresa/${companySlug}`);
  }, [companySlug]);

  const handleAddProducts = useCallback(() => {
    router.push(`/(drawer)/empresa/${companySlug}`);
  }, [companySlug]);

  const handleApplyCoupon = useCallback(() => {
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
  }, [couponCode]);

  const handleCheckout = useCallback(async () => {
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

      // Verificar valor mínimo para entrega
      if (
        cart.isDelivery &&
        !cart.hasReachedMinimumOrderValue(
          cart.deliveryConfig || companyContext.config
        )
      ) {
        const minValue =
          cart.deliveryConfig?.pedido_minimo ||
          companyContext.config?.delivery?.pedido_minimo ||
          "0";

        Alert.alert(
          "Pedido mínimo não atingido",
          `Para delivery, o valor mínimo é de ${cart.formatCurrency(
            minValue
          )}. Adicione mais itens para continuar.`
        );
        setIsProcessing(false);
        return;
      }

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
  }, [companySlug, cart, companyContext.config]);

  const handleRemoveItemWithToast = useCallback(
    (itemId: string) => {
      // Encontrar o item para obter o nome antes de remover
      const item = cart.items.find((item) => item.id === itemId);

      // Remover do carrinho
      cart.removeItem(itemId);

      // Mostrar toast se o item foi encontrado
      if (item) {
        toastUtils.info(toast, `${item.name} removido do carrinho`);
      }
    },
    [cart, toast]
  );

  const handleUpdateQuantityWithToast = useCallback(
    (itemId: string, quantity: number) => {
      // Encontrar o item para obter o nome
      const item = cart.items.find((item) => item.id === itemId);

      // Atualizar quantidade
      cart.updateQuantity(itemId, quantity);

      // Mostrar toast se o item foi encontrado
      if (item) {
        toastUtils.success(toast, `Agora você tem ${quantity}x ${item.name}`);
      }
    },
    [cart, toast]
  );

  const handleClearCart = useCallback(() => {
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
  }, [cart, toast]);

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

            {/* Removido o componente CartDeliverySelector para debug */}

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

            {/* Resumo do pedido atualizado */}
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
                  <Text className="font-medium text-gray-800">
                    {cart.isDelivery ? cart.deliveryFee : "R$ 0,00"}
                  </Text>
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
                    {cart.total}
                  </Text>
                </HStack>
              </VStack>
            </Card>

            {/* Seção de cupom (opcional) */}
            <TouchableOpacity
              onPress={() => setShowCouponInput(!showCouponInput)}
              className="mb-4"
            >
              <HStack className="items-center">
                <Text
                  className="text-base font-medium"
                  style={{ color: primaryColor }}
                >
                  {showCouponInput
                    ? "Ocultar cupom"
                    : "Possui cupom de desconto?"}
                </Text>
              </HStack>
            </TouchableOpacity>

            {showCouponInput && (
              <HStack className="items-center mb-6">
                <TextInput
                  value={couponCode}
                  onChangeText={setCouponCode}
                  placeholder="Digite o código do cupom"
                  className="flex-1 h-12 px-4 border border-gray-300 rounded-l-lg bg-white"
                />
                <TouchableOpacity
                  onPress={handleApplyCoupon}
                  className="h-12 px-4 flex items-center justify-center rounded-r-lg"
                  style={{ backgroundColor: primaryColor }}
                >
                  <Text className="text-white font-medium">Aplicar</Text>
                </TouchableOpacity>
              </HStack>
            )}
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
                  {cart.total}
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
                isDisabled={
                  isProcessing ||
                  (cart.isDelivery &&
                    !cart.hasReachedMinimumOrderValue(
                      cart.deliveryConfig || companyContext.config
                    ))
                }
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

            {/* Mensagem de erro para valor mínimo */}
            {cart.isDelivery &&
              !cart.hasReachedMinimumOrderValue(
                cart.deliveryConfig || companyContext.config
              ) && (
                <Text className="text-red-500 text-xs mt-1 text-center">
                  O valor mínimo para delivery não foi atingido.
                </Text>
              )}
          </View>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}
