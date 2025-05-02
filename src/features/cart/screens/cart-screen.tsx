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
import {
  ShoppingBag,
  Trash2,
  MinusCircle,
  PlusCircle,
  ArrowLeft,
  MessageSquare,
  Edit3,
  ChevronRight,
  Tag,
  CreditCard,
} from "lucide-react-native";
import ScreenHeader from "@/components/ui/screen-header";
import {
  Card,
  Button,
  VStack,
  HStack,
  Divider,
  useToast,
} from "@gluestack-ui/themed";
import { useCartViewModel } from "../view-models/use-cart-view-model";
import { useOrderViewModel } from "@/src/features/orders/view-models/use-order-view-model";
import { THEME_COLORS } from "@/src/styles/colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ImagePreview } from "@/components/custom/image-preview";
import { Package } from "lucide-react-native";
import { getContrastColor } from "@/src/utils/color.utils";
import { CartItem } from "../models/cart";
import { useMultiCartStore } from "../stores/cart.store";
import { toastUtils } from "@/src/utils/toast.utils";

/**
 * Item individual do carrinho
 */
interface CartItemProps {
  item: CartItem;
  onRemove: (itemId: string) => void;
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onUpdateObservation: (itemId: string, observation: string) => void;
  primaryColor: string;
}

const CartItemComponent: React.FC<CartItemProps> = ({
  item,
  onRemove,
  onUpdateQuantity,
  onUpdateObservation,
  primaryColor,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempObservation, setTempObservation] = useState(
    item.observation || ""
  );

  const handleSaveObservation = () => {
    onUpdateObservation(item.id, tempObservation);
    setIsEditing(false);
  };

  return (
    <Card className="mb-4 overflow-hidden shadow-sm border border-gray-100">
      <HStack space="md" className="p-3 border-b border-gray-100 bg-white">
        {/* Imagem do produto */}
        <View className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100">
          <ImagePreview
            uri={item.imageUrl}
            fallbackIcon={Package}
            width="100%"
            height="100%"
            resizeMode="cover"
          />
        </View>

        {/* Informações do produto */}
        <VStack className="flex-1 justify-between">
          <Text className="font-semibold text-gray-800 text-base">
            {item.name}
          </Text>

          {item.description && (
            <Text className="text-gray-500 text-xs" numberOfLines={1}>
              {item.description}
            </Text>
          )}

          <HStack className="justify-between items-center mt-1">
            <Text className="font-bold" style={{ color: primaryColor }}>
              {item.priceFormatted}
            </Text>

            {/* Controles de quantidade */}
            <HStack className="items-center">
              <TouchableOpacity
                onPress={() => onUpdateQuantity(item.id, item.quantity - 1)}
                disabled={item.quantity <= 1}
                style={{ opacity: item.quantity <= 1 ? 0.5 : 1 }}
              >
                <MinusCircle size={20} color={primaryColor} />
              </TouchableOpacity>

              <Text className="mx-3 font-medium text-gray-800">
                {item.quantity}
              </Text>

              <TouchableOpacity
                onPress={() => onUpdateQuantity(item.id, item.quantity + 1)}
              >
                <PlusCircle size={20} color={primaryColor} />
              </TouchableOpacity>
            </HStack>
          </HStack>
        </VStack>
      </HStack>

      {/* Área de observação */}
      <View className="p-3 bg-gray-50">
        {isEditing ? (
          <VStack space="sm">
            <HStack className="items-center mb-1">
              <MessageSquare size={16} color={primaryColor} />
              <Text className="ml-1 text-sm font-medium text-gray-700">
                Observação:
              </Text>
            </HStack>

            <TextInput
              value={tempObservation}
              onChangeText={setTempObservation}
              placeholder="Adicione uma observação para o estabelecimento"
              multiline
              numberOfLines={2}
              className="bg-white border border-gray-200 rounded-lg p-2 text-gray-700"
              style={{ textAlignVertical: "top" }}
            />

            <HStack className="justify-end gap-2">
              <TouchableOpacity
                onPress={() => {
                  setTempObservation(item.observation || "");
                  setIsEditing(false);
                }}
                className="py-1 px-3 rounded-lg bg-gray-200"
              >
                <Text className="text-gray-700">Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleSaveObservation}
                className="py-1 px-3 rounded-lg"
                style={{ backgroundColor: primaryColor }}
              >
                <Text className="text-white">Salvar</Text>
              </TouchableOpacity>
            </HStack>
          </VStack>
        ) : (
          <HStack className="justify-between items-center">
            <HStack className="items-center flex-1">
              <MessageSquare size={16} color="#6B7280" />

              <Text
                className="ml-2 text-sm text-gray-500 flex-1"
                numberOfLines={1}
              >
                {item.observation ? item.observation : "Sem observações"}
              </Text>
            </HStack>

            <HStack className="gap-3">
              <TouchableOpacity
                onPress={() => setIsEditing(true)}
                className="p-1 rounded-full"
              >
                <Edit3 size={16} color={primaryColor} />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => onRemove(item.id)}
                className="p-1 rounded-full"
              >
                <Trash2 size={16} color="#EF4444" />
              </TouchableOpacity>
            </HStack>
          </HStack>
        )}
      </View>
    </Card>
  );
};

/**
 * Componente principal da tela do carrinho
 */
export function CartScreen() {
  const { companySlug } = useLocalSearchParams<{ companySlug: string }>();
  const multiCartStore = useMultiCartStore();
  const cart = useCartViewModel();
  const orderViewModel = useOrderViewModel();
  const [isProcessing, setIsProcessing] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [isCouponValid, setIsCouponValid] = useState(false);
  const [showCouponInput, setShowCouponInput] = useState(false);
  const insets = useSafeAreaInsets();
  const { width } = Dimensions.get("window");

  const toast = useToast();

  // Efeito para definir o carrinho ativo com base no slug da URL
  useEffect(() => {
    if (companySlug) {
      multiCartStore.setActiveCart(companySlug);
    }
  }, [companySlug]);

  // Verificar se o carrinho está vazio
  const cartIsEmpty = cart.isEmpty;

  // Primarycolor para personalização baseada na empresa
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

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
    >
      <View className="flex-1 bg-gray-50">
        {/* Cabeçalho com título e botão de voltar */}
        {/* <ScreenHeader
          title="Carrinho"
          subtitle={
            cartIsEmpty ? undefined : "Revise seus produtos antes de finalizar"
          }
          showBackButton={true}
          onBackPress={handleBackToCompany}
        /> */}

        {cartIsEmpty ? (
          // Exibe mensagem quando o carrinho está vazio
          <View className="flex-1 justify-center items-center px-4">
            <Card className="p-8 items-center justify-center border border-gray-200 w-full max-w-md">
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
            </Card>
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
              <Text className="text-base font-medium text-gray-700 mb-2">
                Seu pedido ({cart.items.length}{" "}
                {cart.items.length === 1 ? "item" : "itens"})
              </Text>

              {cart.items.map((item) => (
                <CartItemComponent
                  key={item.id}
                  item={item}
                  onRemove={handleRemoveItemWithToast}
                  onUpdateQuantity={handleUpdateQuantityWithToast}
                  onUpdateObservation={cart.updateObservation}
                  primaryColor={primaryColor}
                />
              ))}
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
                      ? cart.total // Aqui deveria aplicar o desconto
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
            className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4"
            style={{ paddingBottom: Math.max(insets.bottom, 16) }}
          >
            <Button
              onPress={handleCheckout}
              style={{ backgroundColor: primaryColor }}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <HStack space="sm" alignItems="center">
                  <ActivityIndicator size="small" color="white" />
                  <Text className="text-white font-bold">Processando...</Text>
                </HStack>
              ) : (
                <HStack space="sm" alignItems="center">
                  <CreditCard size={20} color="white" />
                  <Text className="text-white font-bold">Finalizar Pedido</Text>
                </HStack>
              )}
            </Button>
          </View>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}
