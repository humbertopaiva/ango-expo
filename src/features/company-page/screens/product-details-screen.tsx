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
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import {
  Share2,
  ShoppingBag,
  MinusCircle,
  PlusCircle,
  ArrowLeft,
  Package,
} from "lucide-react-native";
import { HStack, VStack, Button } from "@gluestack-ui/themed";
import { useCompanyPageContext } from "../contexts/use-company-page-context";
import { ImagePreview } from "@/components/custom/image-preview";
import { useCartViewModel } from "@/src/features/cart/view-models/use-cart-view-model";
import { CompanyProduct } from "../models/company-product";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export function ProductDetailsScreen() {
  const { productId } = useLocalSearchParams<{ productId: string }>();
  const vm = useCompanyPageContext();
  const cartVm = useCartViewModel();
  const [product, setProduct] = useState<CompanyProduct | null>(null);
  const [quantity, setQuantity] = useState(1);
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

    cartVm.addProduct(product, vm.profile.empresa.slug, vm.profile.nome);

    // Navegar para o carrinho após adicionar
    router.push(`/(drawer)/empresa/${vm.profile.empresa.slug}/cart`);
  };

  // Voltar para a página da empresa
  const handleBack = () => {
    router.back();
  };

  // Compartilhar o produto
  const handleShare = async () => {
    // if (!product || !vm.profile) return;

    // const productUrl = `https://ango.app/empresa/${vm.profile.empresa.slug}/product/${product.id}`;

    // try {
    //   await Share.share({
    //     message:
    //       Platform.OS === "ios"
    //         ? undefined
    //         : `Confira ${product.nome} na ${
    //             vm.profile.nome
    //           }: ${productUrl}`,
    //     url: Platform.OS === "ios" ? productUrl : undefined,
    //     title: `${product.nome} - ${vm.profile.nome}`,
    //   });
    // } catch (error) {
    //   console.error("Erro ao compartilhar:", error);
    // }
    console.log("COMPARTILHAR");
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

  const discountPercent = calculateDiscount();
  const primaryColor = vm.primaryColor || "#F4511E";

  return (
    <View className="flex-1 bg-gray-50">
      <StatusBar barStyle="light-content" />

      {/* Área da imagem em aspecto quadrado com botões sobrepostos */}
      <View
        style={{ width: width, height: width }}
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
  );
}
