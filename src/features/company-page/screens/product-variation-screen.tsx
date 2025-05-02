// Path: src/features/company-page/screens/product-variation-screen.tsx
import React, { useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
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
  AlertTriangle,
} from "lucide-react-native";
import { HStack, VStack, Badge, useToast } from "@gluestack-ui/themed";
import { ImagePreview } from "@/components/custom/image-preview";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { getContrastColor } from "@/src/utils/color.utils";
import { animationUtils } from "@/src/utils/animations.utils";
import { LinearGradient } from "expo-linear-gradient";
import { ProductImageViewer } from "../components/product-image-viewer";
import { ProductQuantityControl } from "../components/product-quantity-control";
import { ProductHeaderOverlay } from "../components/product-header-overlay";
import { ProductVariationSelector } from "../components/product-variation-selector";
import { useProductAddons } from "../hooks/use-product-addons";
import { ProductAddonsSection } from "../components/product-addons-section";
import { useProductVariationViewModel } from "../view-models/product-variation.view-model";
import { useCartViewModel } from "@/src/features/cart/view-models/use-cart-view-model";
import { toastUtils } from "@/src/utils/toast.utils";
import { AddToCartConfirmationModal } from "../components/add-to-cart-confirmation-modal";

export function ProductVariationScreen() {
  const { productId } = useLocalSearchParams<{ productId: string }>();
  const vm = useProductVariationViewModel(productId);
  const cartVm = useCartViewModel();
  const toast = useToast();
  const insets = useSafeAreaInsets();

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const imageScaleAnim = useRef(new Animated.Value(0.95)).current;
  const buttonScaleAnim = useRef(new Animated.Value(1)).current;

  // Start animations when product is loaded
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

  // Product add-ons
  const { addonLists, hasAddons } = useProductAddons(productId);

  // Handler for adding to cart with animation
  const handleAddToCart = () => {
    if (!vm.product || !vm.selectedVariation) return;

    animationUtils.createPulseAnimation(buttonScaleAnim)();

    const companySlug = vm.product.empresa.slug;
    const companyName = vm.product.empresa.nome;

    // Usar a função específica para produtos com variação
    cartVm.addProductWithVariation(
      vm.product,
      companySlug,
      companyName,
      vm.selectedVariation.id,
      vm.selectedVariation.name,
      parseFloat(
        vm.selectedVariation.promotional_price || vm.selectedVariation.price
      ),
      vm.selectedVariation.description,
      vm.quantity,
      vm.observation
    );

    // Adicionar os adicionais selecionados se houver
    vm.selectedAddons.forEach((addon) => {
      if (addon.quantity > 0) {
        // Criar um identificador mais específico para o adicional
        const uniqueParentId = `${vm.product.id}_${vm.selectedVariation.id}`;

        cartVm.addAddonToCart(
          addon.product,
          companySlug,
          companyName,
          uniqueParentId,
          addon.quantity,
          `${vm.product.nome} (${vm.selectedVariation.name})`
        );
      }
    });

    // Show success toast
    toastUtils.success(
      toast,
      `${vm.product.nome} (${vm.selectedVariation.name}) adicionado ao carrinho!`
    );
  };

  // Handler for back
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

  const contrastTextColor = getContrastColor(vm.primaryColor);
  const canAddToCart = vm.selectedVariation !== null;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
    >
      <View className="flex-1 bg-white">
        {/* Full screen image viewer */}
        <ProductImageViewer
          isVisible={vm.isImageViewerVisible}
          imageUrl={vm.currentImage}
          onClose={vm.handleCloseImageViewer}
          productName={vm.product.nome}
          productDescription={
            vm.selectedVariation?.description || vm.product.descricao
          }
          onShare={vm.handleShareProduct}
        />

        {/* Confirmation Modal */}
        <AddToCartConfirmationModal
          isVisible={vm.isConfirmationVisible}
          onClose={vm.hideConfirmation}
          productName={vm.lastAddedItem?.productName || ""}
          quantity={vm.lastAddedItem?.quantity || 0}
          totalPrice={vm.lastAddedItem?.totalPrice || ""}
          companySlug={vm.product?.empresa.slug || ""}
          variationName={vm.lastAddedItem?.variationName}
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
          {/* Product image */}
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
                uri={vm.currentImage}
                width="100%"
                height="100%"
                resizeMode="cover"
                containerClassName="bg-gray-100"
              />
            </TouchableOpacity>

            {/* Discount badge */}
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

            {/* Zoom and share buttons */}
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

          {/* Product content */}
          <Animated.View
            style={{
              transform: [{ translateY: slideAnim }],
            }}
            className="px-5 pt-6 bg-white"
          >
            {/* Product name */}
            <Text className="text-2xl font-bold text-gray-800 mb-2">
              {vm.product.nome}
            </Text>

            {/* Description */}
            {vm.product.descricao && (
              <Text className="text-gray-600 text-base leading-relaxed mb-6">
                {vm.product.descricao}
              </Text>
            )}

            {/* Variation selector */}
            <ProductVariationSelector
              options={vm.variationOptions}
              selectedOption={vm.selectedVariation}
              onSelect={vm.selectVariation}
              isLoading={vm.loadingVariations}
              error={vm.variationError}
              primaryColor={vm.primaryColor}
            />

            {/* Selected variation details */}
            {vm.selectedVariation && (
              <>
                {/* Description if available */}
                {vm.selectedVariation.description && (
                  <View className="mb-4">
                    <Text className="text-gray-600 text-base leading-relaxed">
                      {vm.selectedVariation.description}
                    </Text>
                  </View>
                )}

                {/* Price */}
                <View className="mb-6">
                  <Text className="text-lg font-semibold text-gray-800 mb-2">
                    Preço
                  </Text>
                  <HStack alignItems="baseline" space="sm">
                    {vm.selectedVariation.promotional_price ? (
                      <>
                        <Text
                          className="text-2xl font-bold"
                          style={{ color: vm.primaryColor }}
                        >
                          {new Intl.NumberFormat("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          }).format(
                            parseFloat(vm.selectedVariation.promotional_price)
                          )}
                        </Text>
                        <Text className="text-base text-gray-400 line-through">
                          {new Intl.NumberFormat("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          }).format(parseFloat(vm.selectedVariation.price))}
                        </Text>
                      </>
                    ) : (
                      <Text
                        className="text-2xl font-bold"
                        style={{ color: vm.primaryColor }}
                      >
                        {new Intl.NumberFormat("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        }).format(parseFloat(vm.selectedVariation.price))}
                      </Text>
                    )}
                  </HStack>
                </View>
              </>
            )}

            {/* Quantity controls */}
            <ProductQuantityControl
              quantity={vm.quantity}
              maxQuantity={vm.maxQuantity}
              onIncrease={vm.increaseQuantity}
              onDecrease={vm.decreaseQuantity}
              primaryColor={vm.primaryColor}
            />

            {/* Observation section */}
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

                {/* Indicator when observation is present but minimized */}
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

          {/* Product add-ons section */}
          {hasAddons && (
            <ProductAddonsSection
              addonLists={addonLists}
              onAddAddonToCart={(product, quantity) => {
                vm.addAddonToCart(product, quantity);
              }}
            />
          )}

          {/* Extra space at the end for complete scrolling */}
          <View style={{ height: 120 }} />
        </Animated.ScrollView>

        {/* Bottom bar with total and add to cart button */}
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
              {!canAddToCart ? (
                <View className="flex-row items-center">
                  <AlertTriangle size={20} color="#F59E0B" className="mr-2" />
                  <Text className="text-amber-600 font-medium">
                    Selecione uma variação
                  </Text>
                </View>
              ) : (
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
              )}
            </Animated.View>
          </HStack>
        </Animated.View>
      </View>
    </KeyboardAvoidingView>
  );
}
