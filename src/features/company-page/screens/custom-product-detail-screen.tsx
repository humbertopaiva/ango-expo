// Path: src/features/company-page/screens/custom-product-detail-screen.tsx
import React, { useState, useRef, useCallback, useMemo } from "react";
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
import { ShoppingBag, Package, AlertTriangle } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { ImagePreview } from "@/components/custom/image-preview";
import { ProductHeaderOverlay } from "../components/product-header-overlay";
import { CustomProductStep } from "../components/custom-product-step";
import { useCustomProductDetailViewModel } from "../view-models/custom-product-detail.view-model";
import { getContrastColor } from "@/src/utils/color.utils";
import { HStack } from "@gluestack-ui/themed";

export function CustomProductDetailScreen() {
  const { productId } = useLocalSearchParams<{ productId: string }>();
  const vm = useCustomProductDetailViewModel(productId);
  const insets = useSafeAreaInsets();

  // State for expanded steps
  const [expandedSteps, setExpandedSteps] = useState<Record<number, boolean>>(
    {}
  );

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const buttonScaleAnim = useRef(new Animated.Value(1)).current;

  // Start animations when product is loaded
  React.useEffect(() => {
    if (!vm.isLoading && vm.product) {
      // Initialize first step as expanded
      if (vm.product.passos.length > 0) {
        setExpandedSteps({ [vm.product.passos[0].passo_numero]: true });
      }

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

  // Toggle step expansion
  const toggleStepExpansion = useCallback((stepNumber: number) => {
    setExpandedSteps((prev) => ({
      ...prev,
      [stepNumber]: !prev[stepNumber],
    }));
  }, []);

  // Handle back
  const handleBack = () => {
    router.back();
  };

  // Handle add to cart with animation
  const handleAddToCart = () => {
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

    vm.addToCart();
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
    <View className="flex-1 bg-white">
      {/* Header overlay */}
      <ProductHeaderOverlay
        onBack={handleBack}
        onShare={() => {}}
        onToggleFavorite={() => {}}
        isFavorite={false}
        topInset={insets.top}
      />

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
                Produto personalizado
              </Text>
            </View>
          </View>

          {/* Product name */}
          <Text className="text-2xl font-bold text-gray-800 mb-2">
            {vm.product.nome}
          </Text>

          {/* Description */}
          {vm.product.descricao ? (
            <Text className="text-gray-600 text-base leading-relaxed mb-6">
              {vm.product.descricao}
            </Text>
          ) : (
            <Text className="text-gray-500 text-base leading-relaxed mb-6 italic">
              Monte seu produto personalizado selecionando os itens desejados em
              cada etapa.
            </Text>
          )}

          {/* Price type info */}
          <View className="mb-4 p-4 bg-gray-50 rounded-lg">
            <Text className="text-gray-700 font-medium mb-2">
              Preço baseado em:{" "}
              {vm.product.preco_tipo === "soma"
                ? "Soma dos itens selecionados"
                : "Configuração personalizada"}
            </Text>
            <Text className="text-gray-600 text-sm">
              Este produto personalizado possui {vm.product.passos.length}{" "}
              etapas de seleção.
              {vm.product.passos.some(
                (step) => (step.quantidade_minima_itens || 0) > 0
              )
                ? " Algumas etapas são obrigatórias."
                : " Todas as etapas são opcionais."}
            </Text>
          </View>
        </Animated.View>

        {/* Steps section */}
        <View className="px-4 pb-24">
          <Text className="text-xl font-bold text-gray-800 mb-4">
            Escolha os itens para cada etapa
          </Text>

          {vm.product.passos.map((step) => (
            <CustomProductStep
              key={step.passo_numero}
              step={step}
              expanded={!!expandedSteps[step.passo_numero]}
              onToggleExpand={() => toggleStepExpansion(step.passo_numero)}
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
                  Complete etapas obrigatórias
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
