// Path: src/features/company-page/screens/product-details-screen.tsx
import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Share,
  Platform,
  TextInput,
  KeyboardAvoidingView,
  Alert,
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
  Package,
  Edit3,
  MessageSquare,
  Heart,
} from "lucide-react-native";
import { HStack, VStack, Button } from "@gluestack-ui/themed";
import { useCompanyPageContext } from "../contexts/use-company-page-context";
import { ImagePreview } from "@/components/custom/image-preview";
import { useCartViewModel } from "@/src/features/cart/view-models/use-cart-view-model";
import { useMultiCartStore } from "@/src/features/cart/stores/cart.store";
import { CompanyProduct } from "../models/company-product";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { getContrastColor } from "@/src/utils/color.utils";
import { animationUtils } from "@/src/utils/animations.utils";
import { LinearGradient } from "expo-linear-gradient";

export function ProductDetailsScreen() {
  const { productId } = useLocalSearchParams<{ productId: string }>();
  const vm = useCompanyPageContext();
  const cartVm = useCartViewModel();
  const [product, setProduct] = useState<CompanyProduct | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [observation, setObservation] = useState("");
  const [showObservationInput, setShowObservationInput] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const { width } = Dimensions.get("window");
  const insets = useSafeAreaInsets();

  // Animações
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const imageScaleAnim = useRef(new Animated.Value(0.9)).current;
  const buttonScaleAnim = useRef(new Animated.Value(0.95)).current;

  // Carregar dados do produto
  useEffect(() => {
    if (!productId || !vm.products) return;

    setIsLoading(true);

    // Simular um pequeno atraso para a experiência de carregamento
    setTimeout(() => {
      const foundProduct = vm.products.find((p) => p.id === productId);
      if (foundProduct) {
        setProduct(foundProduct);

        // Iniciar animações de entrada
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 500,
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
          Animated.spring(buttonScaleAnim, {
            toValue: 1,
            friction: 8,
            tension: 40,
            useNativeDriver: true,
            delay: 200,
          }),
        ]).start();
      } else {
        console.error("Produto não encontrado:", productId);
      }
      setIsLoading(false);
    }, 300);
  }, [productId, vm.products]);

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
  const increaseQuantity = () => setQuantity((prev) => prev + 1);
  const decreaseQuantity = () =>
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  // Adicionar ao carrinho com animação de feedback
  const addToCart = () => {
    if (!product || !vm.profile) return;

    // Animar o botão
    animationUtils.createPulseAnimation(buttonScaleAnim)();

    const companySlug = vm.profile.empresa.slug;
    const companyName = vm.profile.nome;

    // Configura o carrinho ativo para esta empresa
    useMultiCartStore.getState().setActiveCart(companySlug);

    // Adiciona o item ao carrinho da empresa
    cartVm.addToCartWithObservation(
      product,
      companySlug,
      companyName,
      quantity,
      observation.trim()
    );

    // Mostrar confirmação ao usuário
    Alert.alert(
      "Produto adicionado",
      `${product.nome} adicionado ao seu carrinho!`,
      [
        {
          text: "Continuar comprando",
          style: "cancel",
        },
        {
          text: "Ver carrinho",
          onPress: () => router.push(`/(drawer)/empresa/${companySlug}/cart`),
        },
      ]
    );
  };

  // Voltar para a página da empresa
  const handleBack = () => {
    router.back();
  };

  // Compartilhar o produto
  const handleShare = async () => {
    if (!product || !vm.profile) return;

    const productName = product.nome;
    const companyName = vm.profile.nome;
    const message = `Confira ${productName} em ${companyName}`;

    try {
      await Share.share({
        message,
        title: `${productName} - ${companyName}`,
      });
    } catch (error) {
      console.error("Erro ao compartilhar:", error);
    }
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
      <StatusBar barStyle="light-content" />

      <View className="flex-1 bg-gray-50">
        {/* Área da imagem em aspecto quadrado com botões sobrepostos */}
        <Animated.View
          style={{
            width: width,
            height: width,
            opacity: fadeAnim,
            transform: [{ scale: imageScaleAnim }],
          }}
          className="bg-white relative"
        >
          <ImagePreview
            uri={product.imagem}
            fallbackIcon={Package}
            width="100%"
            height="100%"
            resizeMode="contain"
            containerClassName="bg-gray-50"
          />

          {/* Overlay gradiente no topo para melhorar visibilidade dos botões */}
          <LinearGradient
            colors={["rgba(0,0,0,0.5)", "transparent"]}
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: 0,
              height: 100,
            }}
          />

          {/* Botões de navegação sobrepostos */}
          <View
            className="absolute top-0 left-0 right-0 flex-row items-center justify-between px-4"
            style={{ paddingTop: insets.top || 16 }}
          >
            <TouchableOpacity
              onPress={handleBack}
              className="w-10 h-10 rounded-full bg-black/30 items-center justify-center"
              activeOpacity={0.8}
            >
              <ArrowLeft size={24} color="#FFFFFF" />
            </TouchableOpacity>

            <View className="flex-row">
              <TouchableOpacity
                onPress={toggleFavorite}
                className="w-10 h-10 rounded-full bg-black/30 items-center justify-center mr-2"
                activeOpacity={0.8}
              >
                <Heart
                  size={20}
                  color="#FFFFFF"
                  fill={isFavorite ? "#FFFFFF" : "transparent"}
                />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleShare}
                className="w-10 h-10 rounded-full bg-black/30 items-center justify-center"
                activeOpacity={0.8}
              >
                <Share2 size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Badge de desconto (se houver) */}
          {discountPercent && (
            <View className="absolute top-20 right-4 bg-red-500 px-3 py-1 rounded-full">
              <Text className="text-white font-bold text-sm">
                {discountPercent}% OFF
              </Text>
            </View>
          )}
        </Animated.View>

        <Animated.ScrollView
          className="flex-1"
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }}
        >
          {/* Conteúdo do produto */}
          <View className="p-5 bg-white">
            {/* Informações da categoria */}
            {product.categoria && (
              <Text className="text-sm text-gray-500 mb-1">
                {product.categoria.nome}
              </Text>
            )}

            {/* Nome do produto */}
            <Text className="text-3xl font-bold text-gray-800 mb-2">
              {product.nome}
            </Text>

            {/* Preço do produto */}
            <View className="mb-5">
              <HStack className="items-baseline">
                {product.preco_promocional ? (
                  <>
                    <Text
                      className="text-3xl font-bold"
                      style={{ color: primaryColor }}
                    >
                      {formatCurrency(product.preco_promocional)}
                    </Text>
                    <Text className="ml-2 text-base text-gray-400 line-through">
                      {formatCurrency(product.preco)}
                    </Text>
                  </>
                ) : (
                  <Text
                    className="text-3xl font-bold"
                    style={{ color: primaryColor }}
                  >
                    {formatCurrency(product.preco)}
                  </Text>
                )}
              </HStack>

              {/* Informação de parcelamento */}
              {product.parcelamento_cartao && product.quantidade_parcelas && (
                <Text className="text-sm text-gray-600 mt-1">
                  ou {product.quantidade_parcelas}x de{" "}
                  {formatCurrency(
                    (
                      parseFloat(product.preco_promocional || product.preco) /
                      parseInt(product.quantidade_parcelas)
                    ).toString()
                  )}
                  {product.parcelas_sem_juros ? " sem juros" : ""}
                </Text>
              )}
            </View>

            {/* Descrição do produto */}
            {product.descricao && (
              <View className="mb-6 pb-4 border-b border-gray-100">
                <Text className="text-base font-semibold text-gray-800 mb-2">
                  Descrição
                </Text>
                <Text className="text-gray-600 text-base leading-relaxed">
                  {product.descricao}
                </Text>
              </View>
            )}

            {/* Observação do cliente */}
            <View className="mb-4 pb-4 border-b border-gray-100">
              <TouchableOpacity
                onPress={toggleObservationInput}
                className="flex-row items-center mb-2"
                activeOpacity={0.7}
              >
                <MessageSquare size={20} color={primaryColor} />
                <Text
                  className="ml-2 font-semibold text-base"
                  style={{ color: primaryColor }}
                >
                  {showObservationInput
                    ? "Ocultar observação"
                    : "Adicionar observação"}
                </Text>
              </TouchableOpacity>

              {showObservationInput && (
                <View className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                  <TextInput
                    value={observation}
                    onChangeText={setObservation}
                    placeholder="Alguma observação? Ex: Sem cebola, sem alface, etc."
                    multiline
                    numberOfLines={3}
                    className="text-gray-700 min-h-20"
                    style={{ textAlignVertical: "top" }}
                  />
                  <Text className="text-gray-500 text-xs mt-2">
                    Conte ao estabelecimento se você precisa de algo especial ou
                    tem alguma preferência.
                  </Text>
                </View>
              )}
            </View>

            {/* Seletor de quantidade */}
            <View className="mb-6">
              <Text className="text-base font-semibold text-gray-800 mb-2">
                Quantidade
              </Text>
              <HStack className="items-center bg-gray-50 self-start px-2 py-1 rounded-lg">
                <TouchableOpacity
                  onPress={decreaseQuantity}
                  className="p-2"
                  disabled={quantity <= 1}
                  style={{ opacity: quantity <= 1 ? 0.5 : 1 }}
                  activeOpacity={0.6}
                >
                  <MinusCircle size={26} color={primaryColor} />
                </TouchableOpacity>

                <Text className="text-2xl font-medium mx-4 min-w-8 text-center">
                  {quantity}
                </Text>

                <TouchableOpacity
                  onPress={increaseQuantity}
                  className="p-2"
                  activeOpacity={0.6}
                >
                  <PlusCircle size={26} color={primaryColor} />
                </TouchableOpacity>
              </HStack>
            </View>
          </View>
        </Animated.ScrollView>

        {/* Barra inferior com botão de adicionar ao carrinho */}
        <Animated.View
          className="bg-white p-4 border-t border-gray-200"
          style={{
            paddingBottom: Math.max(insets.bottom, 16),
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }}
        >
          <HStack className="justify-between items-center">
            <VStack>
              <Text className="text-sm text-gray-500">Total</Text>
              <Text className="text-xl font-bold text-gray-800">
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
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  className="py-3 px-6 flex-row items-center"
                >
                  <ShoppingBag size={20} color={contrastTextColor} />
                  <Text
                    className="font-bold ml-2 text-base"
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
