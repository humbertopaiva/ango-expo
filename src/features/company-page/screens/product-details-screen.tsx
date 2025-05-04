// Path: src/features/company-page/screens/product-details-screen.tsx
import React, { useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Platform,
  TextInput,
  KeyboardAvoidingView,
  Animated,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import {
  ShoppingBag,
  Square,
  ChevronRight,
  MessageSquare,
  Share2,
} from "lucide-react-native";
import { HStack, VStack, Badge, useToast } from "@gluestack-ui/themed";
import { ImagePreview } from "@/components/custom/image-preview";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { getContrastColor } from "@/src/utils/color.utils";
import { animationUtils } from "@/src/utils/animations.utils";
import { LinearGradient } from "expo-linear-gradient";
import { ProductImageViewer } from "../components/product-image-viewer";
import { useProductDetailsViewModel } from "../view-models/product-details.view-model";
import { ProductPriceDisplay } from "../components/product-price-display";
import { ProductQuantityControl } from "../components/product-quantity-control";
import { ProductObservationInput } from "../components/product-observation-input";
import { ProductHeaderOverlay } from "../components/product-header-overlay";
import { useProductAddons } from "../hooks/use-product-addons";
import { ProductAddonsSection } from "../components/product-addons-section";
import { useCartViewModel } from "@/src/features/cart/view-models/use-cart-view-model";
import { toastUtils } from "@/src/utils/toast.utils";
import { AddToCartConfirmationModal } from "../components/add-to-cart-confirmation-modal";

export function ProductDetailsScreen() {
  const { productId } = useLocalSearchParams<{ productId: string }>();
  const vm = useProductDetailsViewModel(productId);
  const cartVm = useCartViewModel();
  const toast = useToast();
  const insets = useSafeAreaInsets();

  // Animações
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const imageScaleAnim = useRef(new Animated.Value(0.95)).current;
  const buttonScaleAnim = useRef(new Animated.Value(1)).current;

  // Iniciar animações quando o produto é carregado
  React.useEffect(() => {
    if (!vm.isLoading && vm.product) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.spring(imageScaleAnim, {
          toValue: 1,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [vm.isLoading, vm.product]);

  // Adicionais do produto
  const { addonLists, hasAddons } = useProductAddons(productId);

  // Handler para adicionar ao carrinho com animação
  const handleAddToCart = () => {
    if (!vm.product) return;

    animationUtils.createPulseAnimation(buttonScaleAnim)();

    // Usar a função addToCart do view model que já inclui a lógica de confirmação
    vm.addToCart();
  };

  // Handler para voltar
  const handleBack = () => {
    router.back();
  };

  if (vm.isLoading) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" color="#F4511E" />
        <Text className="mt-4 text-gray-600">
          Carregando detalhes do produto...
        </Text>
      </View>
    );
  }

  if (!vm.product) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <Text>Produto não encontrado</Text>
      </View>
    );
  }

  // Se o produto tem variação, redirecionar para a tela de variação
  if (vm.hasVariation) {
    router.replace(
      `/(drawer)/empresa/${vm.product.empresa.slug}/product-variation/${vm.product.id}`
    );
    return null;
  }

  const contrastTextColor = getContrastColor(vm.primaryColor);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
    >
      <View className="flex-1 bg-white">
        {/* Visualizador de imagem em tela cheia */}
        <ProductImageViewer
          isVisible={vm.isImageViewerVisible}
          imageUrl={vm.product.imagem}
          onClose={vm.handleCloseImageViewer}
          productName={vm.product.nome}
          productDescription={vm.product.descricao}
          onShare={vm.handleShareProduct}
        />

        {/* Modal de confirmação */}
        <AddToCartConfirmationModal
          isVisible={vm.isConfirmationVisible}
          onClose={vm.hideConfirmation}
          productName={vm.lastAddedItem?.productName || ""}
          quantity={vm.lastAddedItem?.quantity || 0}
          totalPrice={vm.lastAddedItem?.totalPrice || ""}
          companySlug={vm.product?.empresa.slug || ""}
          addonItems={vm.lastAddedItem?.addonItems}
          observation={vm.lastAddedItem?.observation}
          primaryColor={vm.primaryColor}
        />

        <Animated.ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          style={{
            opacity: fadeAnim,
          }}
        >
          {/* Imagem do produto com tamanho proporcional à tela */}
          <Animated.View
            style={{
              transform: [{ scale: imageScaleAnim }],
            }}
            className="w-full aspect-[4/3] relative"
          >
            <TouchableOpacity
              onPress={vm.handleOpenImageViewer}
              activeOpacity={0.95}
              className="w-full h-full"
            >
              <ImagePreview
                uri={vm.product.imagem}
                width="100%"
                height="100%"
                resizeMode="cover"
                containerClassName="bg-gray-100"
              />
            </TouchableOpacity>

            {/* Badge de desconto (se houver) */}
            {vm.discountPercent && (
              <View
                className="absolute top-0 right-0 py-3 px-4 rounded-bl-2xl shadow-lg"
                style={{ backgroundColor: vm.primaryColor }}
              >
                <Text className="text-white font-bold text-xl">
                  {vm.discountPercent}%
                </Text>
                <Text className="text-white text-xs font-medium">OFF</Text>
              </View>
            )}

            {/* Botões de ampliar e compartilhar lado a lado */}
            <View className="absolute bottom-4 right-4 flex-row gap-2">
              <TouchableOpacity
                onPress={vm.handleOpenImageViewer}
                className="bg-black/50 rounded-full p-3"
              >
                <Square size={20} color="#FFFFFF" />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={vm.handleShareProduct}
                className="bg-black/50 rounded-full p-3"
              >
                <Share2 size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </Animated.View>

          {/* Conteúdo do produto */}
          <Animated.View
            style={{
              transform: [{ translateY: slideAnim }],
            }}
            className="px-5 pt-6 bg-white"
          >
            {/* Nome do produto */}
            <Text className="text-2xl font-bold text-gray-800 mb-2">
              {vm.product.nome}
            </Text>

            {/* Descrição */}
            {vm.product.descricao && (
              <Text className="text-gray-600 text-base leading-relaxed mb-6">
                {vm.product.descricao}
              </Text>
            )}

            {/* Preço */}
            <View className="mb-6">
              <ProductPriceDisplay
                product={vm.product}
                primaryColor={vm.primaryColor}
                size="lg"
                showParcelamento={true}
                showAvista={true}
              />
            </View>

            {/* Controles de quantidade */}
            {!hasAddons && (
              <ProductQuantityControl
                quantity={vm.quantity}
                maxQuantity={vm.maxQuantity}
                onIncrease={vm.increaseQuantity}
                onDecrease={vm.decreaseQuantity}
                primaryColor={vm.primaryColor}
                hasAddons={hasAddons}
              />
            )}

            {/* Observação */}
            <View className="mb-6">
              <TouchableOpacity
                onPress={vm.toggleObservationInput}
                className="flex-row items-center justify-between mb-2 bg-gray-50 py-3 px-4 rounded-lg"
              >
                <HStack space="md" alignItems="center">
                  <View
                    className="w-8 h-8 rounded-full items-center justify-center"
                    style={{ backgroundColor: `${vm.primaryColor}15` }}
                  >
                    <MessageSquare size={18} color={vm.primaryColor} />
                  </View>
                  <Text
                    className="font-medium text-base"
                    style={{ color: vm.primaryColor }}
                  >
                    {vm.showObservationInput
                      ? "Ocultar observação"
                      : "Adicionar observação"}
                  </Text>
                </HStack>

                {/* Indicador de observação presente quando minimizada */}
                {!vm.showObservationInput &&
                  vm.observation.trim().length > 0 && (
                    <Badge className="bg-green-100 border border-green-300 rounded-full px-2 py-0.5">
                      <Text className="text-green-800 text-xs font-medium">
                        Adicionada
                      </Text>
                    </Badge>
                  )}
              </TouchableOpacity>

              {vm.showObservationInput && (
                <View className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <TextInput
                    value={vm.observation}
                    onChangeText={vm.setObservation}
                    placeholder="Alguma observação? Ex: Sem cebola, bem passado..."
                    multiline
                    numberOfLines={3}
                    className="text-gray-700 min-h-24"
                    style={{ textAlignVertical: "top" }}
                  />
                  <Text className="text-gray-500 text-xs mt-2">
                    Informe aqui preferências ou instruções especiais para este
                    produto.
                  </Text>
                </View>
              )}
            </View>
          </Animated.View>

          {/* Produtos adicionais recomendados */}
          {hasAddons && (
            <ProductAddonsSection
              addonLists={addonLists}
              onAddAddonToCart={(product, quantity) => {
                vm.addAddonToCart(product, quantity);
              }}
            />
          )}

          {/* Espaço extra no final do scroll para permitir rolagem completa */}
          <View style={{ height: 120 }} />
        </Animated.ScrollView>

        {/* Barra inferior com total e botão de adicionar ao carrinho */}
        <Animated.View
          className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-5 py-4"
          style={{
            paddingBottom: Math.max(insets.bottom, 16),
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
            shadowColor: "#000",
            shadowOffset: { width: 0, height: -3 },
            shadowOpacity: 0.1,
            shadowRadius: 3,
            elevation: 5,
          }}
        >
          <HStack className="items-center justify-between">
            <VStack>
              <Text className="text-sm text-gray-500">Total</Text>
              <Text className="text-2xl font-bold text-gray-800">
                {vm.formattedTotal}
              </Text>
            </VStack>

            <Animated.View
              style={{
                transform: [{ scale: buttonScaleAnim }],
              }}
            >
              <TouchableOpacity
                onPress={handleAddToCart}
                activeOpacity={0.8}
                className="rounded-xl overflow-hidden"
              >
                <LinearGradient
                  colors={[vm.primaryColor, vm.primaryColor]}
                  className="py-3.5 px-6 flex-row items-center"
                >
                  <ShoppingBag size={20} color={contrastTextColor} />
                  <Text
                    className="font-semibold ml-2 text-base"
                    style={{ color: contrastTextColor }}
                  >
                    Adicionar ao Carrinho
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>
          </HStack>
        </Animated.View>
      </View>
    </KeyboardAvoidingView>
  );
}
