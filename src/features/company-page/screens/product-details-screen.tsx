// Path: src/features/company-page/screens/product-details-screen.tsx

import React, { useState, useEffect, useRef } from "react";
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
  Share2,
  ShoppingBag,
  MinusCircle,
  PlusCircle,
  ArrowLeft,
  MessageSquare,
  Heart,
  ChevronRight,
  Eye,
} from "lucide-react-native";
import { HStack, VStack, useToast } from "@gluestack-ui/themed";
import { useCompanyPageContext } from "../contexts/use-company-page-context";
import { ImagePreview } from "@/components/custom/image-preview";
import { useCartViewModel } from "@/src/features/cart/view-models/use-cart-view-model";
import { CompanyProduct } from "../models/company-product";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { getContrastColor } from "@/src/utils/color.utils";
import { animationUtils } from "@/src/utils/animations.utils";
import { LinearGradient } from "expo-linear-gradient";
import { toastUtils } from "@/src/utils/toast.utils";
import { ProductImageViewer } from "../components/product-image-viewer";
import { useProductAddons } from "../hooks/use-product-addons";
import { ProductAddonsSection } from "../components/product-addons-section";
import { Share } from "react-native";
import { ProductPriceDisplay } from "../components/product-price-display";

export function ProductDetailsScreen() {
  const { productId } = useLocalSearchParams<{ productId: string }>();
  const vm = useCompanyPageContext();
  const isCartEnabled = vm.config?.delivery?.habilitar_carrinho !== false;
  const cartVm = useCartViewModel();
  const [product, setProduct] = useState<CompanyProduct | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const insets = useSafeAreaInsets();

  // Estados para controlar a quantidade e observações
  const [quantity, setQuantity] = useState(isCartEnabled ? 1 : 0);
  const [observation, setObservation] = useState("");
  const [showObservationInput, setShowObservationInput] = useState(false);
  const [isImageViewerVisible, setImageViewerVisible] = useState(false);

  // Animações
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const imageScaleAnim = useRef(new Animated.Value(0.95)).current;
  const buttonScaleAnim = useRef(new Animated.Value(1)).current;

  const toast = useToast();

  // Carregar dados do produto
  useEffect(() => {
    if (!productId || !vm.products) return;

    setIsLoading(true);

    // Simulando um carregamento para melhor experiência
    setTimeout(() => {
      const foundProduct = vm.products.find((p) => p.id === productId);
      if (foundProduct) {
        setProduct(foundProduct);

        // Iniciar com quantidade 1 se o carrinho estiver habilitado
        if (isCartEnabled) {
          setQuantity(1);
          setObservation("");
          setShowObservationInput(false);
        }

        // Iniciar animações de entrada
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
      setIsLoading(false);
    }, 300);
  }, [productId, vm.products, isCartEnabled]);

  // Verificar se o produto tem variação
  const hasVariation = product?.tem_variacao === true;

  // Verificar se o produto tem limite de quantidade no carrinho
  const maxQuantity = product?.quantidade_maxima_carrinho || 999;

  // Buscar adicionais do produto
  const {
    addonLists,
    isLoading: isLoadingAddons,
    hasAddons,
  } = useProductAddons(productId);

  if (isLoading) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" color="#F4511E" />
        <Text className="mt-4 text-gray-600">
          Carregando detalhes do produto...
        </Text>
      </View>
    );
  }

  if (!product) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <Text>Produto não encontrado</Text>
      </View>
    );
  }

  // Formatação de moeda
  const formatCurrency = (value: string) => {
    const numericValue = parseFloat(value);
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(numericValue);
  };

  // Calcular preço total com base na quantidade
  const calculateTotal = () => {
    const price = parseFloat(product.preco_promocional || product.preco);
    return formatCurrency((price * quantity).toString());
  };

  // Adicionar ou remover quantidade
  const increaseQuantity = () => {
    if (quantity < maxQuantity) {
      setQuantity((prev) => prev + 1);
    } else {
      // Mostrar toast de limite atingido
      toastUtils.warning(
        toast,
        `Limite máximo de ${maxQuantity} unidades por pedido`
      );
    }
  };

  const decreaseQuantity = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  };

  // Adicionar ao carrinho com animação de feedback
  const addToCart = () => {
    if (!product || !vm.profile) return;

    // Animar o botão
    animationUtils.createPulseAnimation(buttonScaleAnim)();

    const companySlug = vm.profile.empresa.slug;
    const companyName = vm.profile.nome;

    // Adiciona o item ao carrinho da empresa
    cartVm.addToCartWithObservation(
      product,
      companySlug,
      companyName,
      quantity,
      observation.trim()
    );

    // Mostrar toast de sucesso
    toastUtils.success(toast, `${product.nome} adicionado ao carrinho!`);
  };

  const handleAddAddonToCart = (addon: CompanyProduct) => {
    if (!vm.profile) return;

    cartVm.addToCartWithObservation(
      addon,
      vm.profile.empresa.slug,
      vm.profile.nome,
      1,
      ""
    );

    toastUtils.success(toast, `${addon.nome} adicionado ao carrinho!`);
  };

  // Voltar para a página anterior
  const handleBack = () => {
    router.back();
  };

  // Compartilhar o produto
  const handleShareProduct = async () => {
    if (!product || !vm.profile) return;

    const productName = product.nome;
    const companyName = vm.profile.nome;

    let shareUrl = "";
    const shareMessage = `Confira ${productName} em ${companyName}`;

    if (Platform.OS === "web") {
      try {
        shareUrl = window.location.href;
      } catch (error) {
        console.log("Não foi possível obter URL para compartilhamento", error);
      }
    }

    try {
      await Share.share({
        message: shareUrl ? `${shareMessage}\n${shareUrl}` : shareMessage,
        title: `${productName} - ${companyName}`,
        url: shareUrl || undefined,
      });
    } catch (error) {
      console.error("Erro ao compartilhar:", error);
    }
  };

  // Abrir visualizador de imagem
  const handleOpenImageViewer = () => {
    setImageViewerVisible(true);
  };

  // Fechar visualizador de imagem
  const handleCloseImageViewer = () => {
    setImageViewerVisible(false);
  };

  // Calcular desconto percentual (se houver)
  const calculateDiscount = () => {
    if (!product.preco_promocional) return null;

    const originalPrice = parseFloat(product.preco);
    const discountPrice = parseFloat(product.preco_promocional);
    const discountPercent = Math.round(
      ((originalPrice - discountPrice) / originalPrice) * 100
    );

    return discountPercent;
  };

  // Manipular a entrada de observação
  const toggleObservationInput = () => {
    setShowObservationInput(!showObservationInput);
  };

  // Alternar favorito
  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const discountPercent = calculateDiscount();
  const primaryColor = vm.primaryColor || "#F4511E";
  const contrastTextColor = getContrastColor(primaryColor);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
    >
      <View className="flex-1 bg-white">
        {/* Header fixo em overlay */}
        <View className="absolute top-0 left-0 right-0 z-10">
          <LinearGradient
            colors={["rgba(0,0,0,0.7)", "rgba(0,0,0,0.3)", "transparent"]}
            style={{ height: 60 + (insets.top || 0) }}
          >
            <View
              className="flex-row justify-between items-center px-4"
              style={{ marginTop: insets.top || 10 }}
            >
              <TouchableOpacity
                onPress={handleBack}
                className="w-10 h-10 rounded-full bg-black/30 items-center justify-center"
              >
                <ArrowLeft size={20} color="#FFFFFF" />
              </TouchableOpacity>

              <View className="flex-row">
                <TouchableOpacity
                  onPress={toggleFavorite}
                  className="w-10 h-10 rounded-full bg-black/30 items-center justify-center mr-3"
                >
                  <Heart
                    size={20}
                    color="#FFFFFF"
                    fill={isFavorite ? "#FFFFFF" : "none"}
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleShareProduct}
                  className="w-10 h-10 rounded-full bg-black/30 items-center justify-center"
                >
                  <Share2 size={20} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Visualizador de imagem em tela cheia */}
        <ProductImageViewer
          isVisible={isImageViewerVisible}
          imageUrl={product.imagem}
          onClose={handleCloseImageViewer}
          productName={product.nome}
          productDescription={product.descricao}
          onShare={handleShareProduct}
          companyName={vm.profile?.nome}
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
            className="w-full aspect-square relative"
          >
            <TouchableOpacity
              onPress={handleOpenImageViewer}
              activeOpacity={0.95}
              className="w-full h-full"
            >
              <ImagePreview
                uri={product.imagem}
                width="100%"
                height="100%"
                resizeMode="cover"
                containerClassName="bg-gray-100"
              />
            </TouchableOpacity>

            {/* Badge de desconto (se houver) */}
            {discountPercent && (
              <View className="absolute top-4 right-4 bg-red-500 px-3 py-1.5 rounded-full shadow-md">
                <Text className="text-white font-bold text-sm">
                  {discountPercent}% OFF
                </Text>
              </View>
            )}

            {/* Botão de visualizar expandido */}
            <TouchableOpacity
              onPress={handleOpenImageViewer}
              className="absolute bottom-4 right-4 bg-black/50 rounded-full p-3"
            >
              <Eye size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </Animated.View>

          {/* Conteúdo do produto */}
          <Animated.View
            style={{
              transform: [{ translateY: slideAnim }],
            }}
            className="px-5 pt-6 bg-white"
          >
            {/* Categoria (se disponível) */}
            {product.categoria?.nome && (
              <TouchableOpacity
                className="flex-row items-center mb-2"
                activeOpacity={0.7}
              >
                <View
                  className="px-3 py-1 rounded-full"
                  style={{ backgroundColor: `${primaryColor}15` }}
                >
                  <Text
                    className="text-xs font-medium"
                    style={{ color: primaryColor }}
                  >
                    {product.categoria.nome}
                  </Text>
                </View>
                <ChevronRight
                  size={16}
                  color={primaryColor}
                  style={{ marginLeft: 4 }}
                />
              </TouchableOpacity>
            )}

            {/* Nome do produto */}
            <Text className="text-2xl font-bold text-gray-800 mb-4">
              {product.nome}
            </Text>

            {/* Preço */}
            <View className="mb-6">
              <ProductPriceDisplay
                product={product}
                primaryColor={primaryColor}
                size="lg"
                showParcelamento={true}
                showAvista={true}
              />
            </View>

            {/* Descrição */}
            {product.descricao && (
              <View className="mb-6 pb-2">
                <Text className="text-lg font-semibold text-gray-800 mb-2">
                  Descrição
                </Text>
                <Text className="text-gray-600 text-base leading-relaxed">
                  {product.descricao}
                </Text>
              </View>
            )}

            {/* Controles de quantidade */}
            <View className="mb-6">
              <Text className="text-lg font-semibold text-gray-800 mb-3">
                Quantidade
              </Text>
              <HStack className="items-center bg-gray-50 self-start rounded-xl border border-gray-200 overflow-hidden">
                <TouchableOpacity
                  onPress={decreaseQuantity}
                  className="p-3 active:bg-gray-200"
                  disabled={quantity <= 1}
                  style={{ opacity: quantity <= 1 ? 0.5 : 1 }}
                >
                  <MinusCircle size={24} color={primaryColor} />
                </TouchableOpacity>

                <Text className="text-xl font-medium mx-6 min-w-10 text-center">
                  {quantity}
                </Text>

                <TouchableOpacity
                  onPress={increaseQuantity}
                  className="p-3 active:bg-gray-200"
                  disabled={quantity >= maxQuantity}
                  style={{ opacity: quantity >= maxQuantity ? 0.5 : 1 }}
                >
                  <PlusCircle size={24} color={primaryColor} />
                </TouchableOpacity>
              </HStack>

              {maxQuantity < 999 && (
                <Text className="text-xs text-gray-500 mt-2">
                  *Limite máximo de {maxQuantity} unidades por pedido
                </Text>
              )}
            </View>

            {/* Observação */}
            {isCartEnabled && (
              <View className="mb-6">
                <TouchableOpacity
                  onPress={toggleObservationInput}
                  className="flex-row items-center mb-2"
                >
                  <View
                    className="w-8 h-8 rounded-full items-center justify-center mr-2"
                    style={{ backgroundColor: `${primaryColor}15` }}
                  >
                    <MessageSquare size={18} color={primaryColor} />
                  </View>
                  <Text
                    className="font-medium text-base"
                    style={{ color: primaryColor }}
                  >
                    {showObservationInput
                      ? "Ocultar observação"
                      : "Adicionar observação"}
                  </Text>
                </TouchableOpacity>

                {showObservationInput && (
                  <View className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                    <TextInput
                      value={observation}
                      onChangeText={setObservation}
                      placeholder="Alguma observação? Ex: Sem cebola, bem passado..."
                      multiline
                      numberOfLines={3}
                      className="text-gray-700 min-h-24"
                      style={{ textAlignVertical: "top" }}
                    />
                    <Text className="text-gray-500 text-xs mt-2">
                      Informe aqui preferências ou instruções especiais para
                      este produto.
                    </Text>
                  </View>
                )}
              </View>
            )}
          </Animated.View>

          {/* Produtos adicionais recomendados */}
          {hasAddons && (
            <ProductAddonsSection
              addonLists={addonLists}
              onAddAddonToCart={handleAddAddonToCart}
            />
          )}

          {/* Espaço extra no final do scroll para permitir rolagem completa */}
          <View style={{ height: 120 }} />
        </Animated.ScrollView>

        {/* Barra inferior com total e botão de adicionar ao carrinho */}
        {isCartEnabled && (
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
                  {calculateTotal()}
                </Text>
              </VStack>

              <Animated.View
                style={{
                  transform: [{ scale: buttonScaleAnim }],
                }}
              >
                <TouchableOpacity
                  onPress={addToCart}
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
              </Animated.View>
            </HStack>
          </Animated.View>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}
