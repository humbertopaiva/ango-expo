// Path: src/features/company-page/screens/product-details-screen.tsx
import React, { useState, useEffect } from "react";
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
} from "lucide-react-native";
import { HStack, VStack, Button } from "@gluestack-ui/themed";
import { useCompanyPageContext } from "../contexts/use-company-page-context";
import { ImagePreview } from "@/components/custom/image-preview";
import { useCartViewModel } from "@/src/features/cart/view-models/use-cart-view-model";
import { useMultiCartStore } from "@/src/features/cart/stores/cart.store";
import { CompanyProduct } from "../models/company-product";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { getContrastColor } from "@/src/utils/color.utils";

export function ProductDetailsScreen() {
  const { productId } = useLocalSearchParams<{ productId: string }>();
  const vm = useCompanyPageContext();
  const cartVm = useCartViewModel();
  const [product, setProduct] = useState<CompanyProduct | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [observation, setObservation] = useState("");
  const [showObservationInput, setShowObservationInput] = useState(false);
  const { width } = Dimensions.get("window");
  const insets = useSafeAreaInsets();

  // Carregar dados do produto
  useEffect(() => {
    if (!productId || !vm.products) return;

    const foundProduct = vm.products.find((p) => p.id === productId);
    if (foundProduct) {
      setProduct(foundProduct);
    } else {
      console.error("Produto não encontrado:", productId);
    }
  }, [productId, vm.products]);

  if (!product) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <Text>Carregando produto...</Text>
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

  // Adicionar ao carrinho
  const addToCart = () => {
    if (!product || !vm.profile) return;

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
    Alert.alert("Produto adicionado", "Produto adicionado ao seu carrinho!", [
      {
        text: "Continuar comprando",
        style: "cancel",
      },
      {
        text: "Ver carrinho",
        onPress: () => router.push(`/empresa/${companySlug}/cart`),
      },
    ]);
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

  const discountPercent = calculateDiscount();
  const primaryColor = vm.primaryColor || "#F4511E";
  const contrastTextColor = getContrastColor(primaryColor);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
    >
      <View className="flex-1 bg-gray-50">
        <StatusBar barStyle="light-content" />

        {/* Área da imagem em aspecto quadrado com botões sobrepostos */}
        <View
          style={{ width: width, height: width * 0.8 }}
          className="bg-white relative"
        >
          <ImagePreview
            uri={product.imagem}
            fallbackIcon={Package}
            width="100%"
            height="100%"
            resizeMode="contain"
          />

          {/* Overlay gradiente no topo para melhorar visibilidade dos botões */}
          <View className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-black/50 to-transparent" />

          {/* Botões de navegação sobrepostos */}
          <View
            className="absolute top-0 left-0 right-0 flex-row items-center justify-between px-4"
            style={{ paddingTop: insets.top || 16 }}
          >
            <TouchableOpacity
              onPress={handleBack}
              className="w-10 h-10 rounded-full bg-black/30 items-center justify-center"
            >
              <ArrowLeft size={24} color="#FFFFFF" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleShare}
              className="w-10 h-10 rounded-full bg-black/30 items-center justify-center"
            >
              <Share2 size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {/* Badge de desconto (se houver) */}
          {discountPercent && (
            <View className="absolute top-4 right-4 bg-red-500 px-3 py-1 rounded-full">
              <Text className="text-white font-bold text-sm">
                {discountPercent}% OFF
              </Text>
            </View>
          )}
        </View>

        <ScrollView className="flex-1">
          {/* Conteúdo do produto */}
          <View className="p-4 bg-white">
            {/* Informações da categoria */}
            {product.categoria && (
              <Text className="text-sm text-gray-500 mb-1">
                {product.categoria.nome}
              </Text>
            )}

            {/* Nome do produto */}
            <Text className="text-2xl font-bold text-gray-800 mb-2">
              {product.nome}
            </Text>

            {/* Preço do produto */}
            <View className="mb-4">
              <HStack className="items-center">
                {product.preco_promocional ? (
                  <>
                    <Text
                      className="text-2xl font-bold text-primary-600"
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
                    className="text-2xl font-bold text-primary-600"
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
                >
                  <MinusCircle size={26} color={primaryColor} />
                </TouchableOpacity>

                <Text className="text-xl font-medium mx-4 min-w-8 text-center">
                  {quantity}
                </Text>

                <TouchableOpacity onPress={increaseQuantity} className="p-2">
                  <PlusCircle size={26} color={primaryColor} />
                </TouchableOpacity>
              </HStack>
            </View>
          </View>
        </ScrollView>

        {/* Barra inferior com botão de adicionar ao carrinho */}
        <View
          className="bg-white p-4 border-t border-gray-200"
          style={{ paddingBottom: Math.max(insets.bottom, 16) }}
        >
          <HStack className="justify-between items-center">
            <VStack>
              <Text className="text-sm text-gray-500">Total</Text>
              <Text className="text-xl font-bold text-gray-800">
                {calculateTotal()}
              </Text>
            </VStack>

            <Button
              onPress={addToCart}
              className="bg-primary-500 h-12 flex-row items-center px-6"
              style={{ backgroundColor: primaryColor }}
            >
              <ShoppingBag size={20} color="white" />
              <Text className="text-white font-bold ml-2 text-base">
                Adicionar ao Carrinho
              </Text>
            </Button>
          </HStack>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
