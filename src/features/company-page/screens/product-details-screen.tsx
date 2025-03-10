// Path: src/features/company-page/screens/product-details-screen.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import {
  Share2,
  Heart,
  ShoppingBag,
  MinusCircle,
  PlusCircle,
  ArrowLeft,
  Package,
} from "lucide-react-native";
import { HStack, VStack, Card, Button } from "@gluestack-ui/themed";
import { useCompanyPageContext } from "../contexts/use-company-page-context";
import { ImagePreview } from "@/components/custom/image-preview";
import { useCartViewModel } from "@/src/features/cart/view-models/use-cart-view-model";
import { CompanyProduct } from "../models/company-product";

export function ProductDetailsScreen() {
  const { productId } = useLocalSearchParams<{ productId: string }>();
  const vm = useCompanyPageContext();
  const cartVm = useCartViewModel();
  const [product, setProduct] = useState<CompanyProduct | null>(null);
  const [quantity, setQuantity] = useState(1);
  const { width } = Dimensions.get("window");

  // Carregar dados do produto
  useEffect(() => {
    if (!productId || !vm.products) return;

    const foundProduct = vm.products.find((p) => p.id === productId);
    if (foundProduct) {
      setProduct(foundProduct);
    } else {
      // Produto não encontrado, poderia mostrar um erro ou redirecionar
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
    router.push(`/(drawer)/empresa/${vm.profile?.empresa.slug}`);
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* Cabeçalho */}
      <View className="bg-white p-4 flex-row items-center justify-between">
        <TouchableOpacity onPress={handleBack} className="p-2">
          <ArrowLeft size={24} color="#374151" />
        </TouchableOpacity>

        <HStack space="md">
          <TouchableOpacity className="p-2">
            <Share2 size={24} color="#374151" />
          </TouchableOpacity>

          <TouchableOpacity className="p-2">
            <Heart size={24} color="#374151" />
          </TouchableOpacity>
        </HStack>
      </View>

      <ScrollView className="flex-1">
        {/* Imagem do produto */}
        <View style={{ width: width, height: width }} className="bg-white">
          <ImagePreview
            uri={product.imagem}
            fallbackIcon={Package}
            width="100%"
            height="100%"
            resizeMode="contain"
          />
        </View>

        {/* Informações do produto */}
        <Card className="m-4 p-4 rounded-xl">
          <VStack space="md">
            <Text className="text-2xl font-bold text-gray-800">
              {product.nome}
            </Text>

            <HStack className="justify-between items-center">
              <View>
                {product.preco_promocional ? (
                  <View>
                    <Text className="text-gray-500 text-sm line-through">
                      {formatCurrency(product.preco)}
                    </Text>
                    <Text className="text-xl font-bold text-primary-600">
                      {formatCurrency(product.preco_promocional)}
                    </Text>
                  </View>
                ) : (
                  <Text className="text-xl font-bold text-primary-600">
                    {formatCurrency(product.preco)}
                  </Text>
                )}

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

              {/* Seletor de quantidade */}
              <HStack className="items-center space-x-2 bg-gray-50 p-2 rounded-lg">
                <TouchableOpacity onPress={decreaseQuantity}>
                  <MinusCircle size={24} color="#6B7280" />
                </TouchableOpacity>

                <Text className="text-xl font-medium w-8 text-center">
                  {quantity}
                </Text>

                <TouchableOpacity onPress={increaseQuantity}>
                  <PlusCircle size={24} color={vm.primaryColor || "#F4511E"} />
                </TouchableOpacity>
              </HStack>
            </HStack>

            {product.descricao && (
              <View className="mt-4">
                <Text className="text-base font-semibold text-gray-800">
                  Descrição
                </Text>
                <Text className="text-gray-600 mt-1 text-sm">
                  {product.descricao}
                </Text>
              </View>
            )}
          </VStack>
        </Card>
      </ScrollView>

      {/* Barra inferior com botão de adicionar ao carrinho */}
      <View className="bg-white p-4 border-t border-gray-200">
        <HStack className="justify-between items-center">
          <VStack>
            <Text className="text-sm text-gray-500">Total</Text>
            <Text className="text-xl font-bold text-gray-800">
              {calculateTotal()}
            </Text>
          </VStack>

          <Button
            onPress={addToCart}
            className="bg-primary-500 flex-row items-center px-6"
            style={{ backgroundColor: vm.primaryColor }}
          >
            <ShoppingBag size={20} color="white" />
            <Text className="text-white font-bold ml-2">Adicionar</Text>
          </Button>
        </HStack>
      </View>
    </View>
  );
}
