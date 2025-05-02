// Path: src/features/company-page/screens/custom-product-detail-screen.tsx
import React, { useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  ShoppingBag,
  Package,
  AlertTriangle,
  MessageSquare,
} from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { ImagePreview } from "@/components/custom/image-preview";
import { ProductHeaderOverlay } from "../components/product-header-overlay";
import { CustomProductStep } from "../components/custom-product-step";
import { useCustomProductDetailViewModel } from "../view-models/custom-product-detail.view-model";
import { getContrastColor } from "@/src/utils/color.utils";
import { HStack, useToast } from "@gluestack-ui/themed";
import { ProductObservationInput } from "../components/product-observation-input";
import { useCartViewModel } from "@/src/features/cart/view-models/use-cart-view-model";
import { toastUtils } from "@/src/utils/toast.utils";
import { TextareaInput } from "@gluestack-ui/themed";

export function CustomProductDetailScreen() {
  const { productId } = useLocalSearchParams<{ productId: string }>();
  const vm = useCustomProductDetailViewModel(productId);
  const cartVm = useCartViewModel();
  const toast = useToast();
  const insets = useSafeAreaInsets();

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
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
      ]).start();
    }
  }, [vm.isLoading, vm.product]);

  // Handle back
  const handleBack = () => {
    router.back();
  };

  // Handle add to cart with animation
  const handleAddToCart = () => {
    if (!vm.product) return;

    // Animar o botão
    Animated.sequence([
      Animated.timing(buttonScaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(buttonScaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    // Verificar se pode adicionar ao carrinho
    if (!vm.canAddToCart()) {
      toastUtils.warning(toast, "Complete todas as seleções obrigatórias");
      return;
    }

    const companySlug = vm.product.empresa?.slug || "";
    const companyName = vm.product.nome;

    // Usar a função específica para produtos customizados
    cartVm.addCustomProduct(
      vm.product,
      companySlug,
      companyName,
      vm.selections,
      vm.totalPrice,
      1, // Quantidade padrão para produtos customizados
      vm.observation.trim()
    );

    toastUtils.success(toast, `${vm.product.nome} adicionado ao carrinho!`);
  };

  if (vm.isLoading) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" color="#F4511E" />
        <Text className="mt-4 text-gray-600">Carregando produto...</Text>
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

  const primaryColor =
    vm.product?.preco_tipo === "menor" ? "#F4511E" : "#F4511E";
  const contrastTextColor = getContrastColor(primaryColor);

  // Verificar se há passos obrigatórios pendentes
  const hasRequiredIncompleteSteps = vm.product.passos.some((step) => {
    const minRequired = step.quantidade_minima_itens || 0;
    if (minRequired === 0) return false; // Passo não é obrigatório

    return !vm.isStepComplete(step.passo_numero);
  });

  return (
    <View className="flex-1 bg-white pb-20">
      <Animated.ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        style={{ opacity: fadeAnim }}
      >
        {/* Product image */}
        <View className="w-full aspect-[4/3] relative">
          <ImagePreview
            uri={vm.product.imagem}
            fallbackIcon={Package}
            width="100%"
            height="100%"
            resizeMode="cover"
            containerClassName="bg-gray-100"
          />
        </View>

        {/* Product content */}
        <Animated.View
          style={{ transform: [{ translateY: slideAnim }] }}
          className="px-5 pt-6 pb-4 bg-white"
        >
          {/* Custom product badge */}
          <View className="flex-row mb-2">
            <View
              className="px-3 py-1 rounded-full"
              style={{ backgroundColor: `${primaryColor}15` }}
            >
              <Text
                className="text-xs font-medium"
                style={{ color: primaryColor }}
              >
                Monte seu produto
              </Text>
            </View>
          </View>

          {/* Product name */}
          <Text className="text-2xl font-bold text-gray-800 mb-2">
            {vm.product.nome}
          </Text>

          {/* Description */}
          {vm.product.descricao ? (
            <Text className="text-gray-600 text-base leading-relaxed mb-5">
              {vm.product.descricao}
            </Text>
          ) : null}

          {/* Price type info - Simplified */}
          {vm.product.preco_tipo === "soma" && (
            <View className="mb-4 p-3 bg-gray-50 rounded-lg">
              <Text className="text-gray-700 text-sm">
                Preço calculado com base na soma dos itens selecionados
              </Text>
            </View>
          )}
        </Animated.View>

        {/* Steps section - All steps always expanded */}
        <View className="px-4 pb-8">
          <Text className="text-xl font-bold text-gray-800 mb-2">
            Selecione os itens
          </Text>

          {vm.product.passos.map((step) => (
            <CustomProductStep
              key={step.passo_numero}
              step={step}
              expanded={true} // Always expanded
              onToggleExpand={() => {}} // No toggle functionality
              isComplete={vm.isStepComplete(step.passo_numero)}
              minimumSelections={vm.getMinimumSelectionsForStep(
                step.passo_numero
              )}
              maxSelections={vm.getRequiredSelectionsForStep(step.passo_numero)}
              currentSelections={vm.getCurrentSelectionsForStep(
                step.passo_numero
              )}
              isItemSelected={(itemId) =>
                vm.isItemSelected(step.passo_numero, itemId)
              }
              onSelectItem={(item) =>
                vm.toggleItemSelection(step.passo_numero, item)
              }
              primaryColor={primaryColor}
              showPrices={vm.product?.preco_tipo === "soma"}
            />
          ))}

          {/* Observação */}
          <View className="mt-4">
            <TouchableOpacity
              onPress={vm.toggleObservationInput}
              className="flex-row items-center justify-between mb-2 bg-gray-50 py-3 px-4 rounded-lg"
            >
              <HStack space="md" alignItems="center">
                <View
                  className="w-8 h-8 rounded-full items-center justify-center"
                  style={{ backgroundColor: `${primaryColor}15` }}
                >
                  <MessageSquare size={18} color={primaryColor} />
                </View>
                <Text
                  className="font-medium text-base"
                  style={{ color: primaryColor }}
                >
                  {vm.showObservationInput
                    ? "Ocultar observação"
                    : "Adicionar observação"}
                </Text>
              </HStack>
            </TouchableOpacity>

            {vm.showObservationInput && (
              <View className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <TextareaInput
                  value={vm.observation}
                  onChangeText={vm.setObservation}
                  placeholder="Alguma observação? Ex: Gostaria que..."
                  className="text-gray-700 min-h-24"
                />
                <Text className="text-gray-500 text-xs mt-2">
                  Informe aqui preferências ou instruções especiais para este
                  produto personalizado.
                </Text>
              </View>
            )}
          </View>
        </View>
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
          <View>
            <Text className="text-sm text-gray-500">Total</Text>
            <Text className="text-2xl font-bold text-gray-800">
              {vm.getFormattedPrice()}
            </Text>
          </View>

          <Animated.View style={{ transform: [{ scale: buttonScaleAnim }] }}>
            {hasRequiredIncompleteSteps ? (
              <View className="flex-row items-center">
                <AlertTriangle size={20} color="#F59E0B" className="mr-2" />
                <Text className="text-amber-600 font-medium">
                  Complete as seleções obrigatórias
                </Text>
              </View>
            ) : (
              <TouchableOpacity
                onPress={handleAddToCart}
                activeOpacity={0.8}
                className="rounded-xl overflow-hidden"
              >
                <LinearGradient
                  colors={[primaryColor, primaryColor]}
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
  );
}
