// Path: src/features/company-page/components/custom-product-card.tsx
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { Box, Card, HStack } from "@gluestack-ui/themed";
import { Package, ShoppingBag } from "lucide-react-native";
import { ImagePreview } from "@/components/custom/image-preview";
import { useCompanyPageContext } from "../contexts/use-company-page-context";
import { router } from "expo-router";
import { useToast } from "@gluestack-ui/themed";
import { toastUtils } from "@/src/utils/toast.utils";
import { CustomProduct } from "../../custom-products/models/custom-product";
import { useCartViewModel } from "@/src/features/cart/view-models/use-cart-view-model";

interface CustomProductCardProps {
  product: CustomProduct;
}

export function CustomProductCard({ product }: CustomProductCardProps) {
  const vm = useCompanyPageContext();
  const cartVm = useCartViewModel();
  const toast = useToast();

  // Verificar se o carrinho está habilitado
  const isCartEnabled = vm.config?.delivery?.habilitar_carrinho !== false;

  // Navegar para a página de detalhes do produto
  const handleProductPress = () => {
    if (!vm.profile?.empresa.slug) return;

    router.push({
      pathname:
        `/(drawer)/empresa/${vm.profile.empresa.slug}/custom-product/${product.id}` as any,
      params: { productId: product.id },
    });
  };

  // Adicionar ao carrinho
  const handleAddToCart = (e: any) => {
    e.stopPropagation();
    handleProductPress();
  };

  // Cor primária da empresa
  const primaryColor = vm.primaryColor || "#F4511E";

  // Layout delivery-style
  return (
    <TouchableOpacity
      onPress={handleProductPress}
      className="w-full"
      activeOpacity={0.7}
    >
      <Box className="flex-row overflow-hidden max-h-32 mb-3 rounded-md bg-white border border-gray-200">
        {/* Imagem do produto - maior como solicitado */}
        <View className="w-32 h-32">
          <ImagePreview
            uri={product.imagem}
            fallbackIcon={Package}
            width="100%"
            height="100%"
            resizeMode="cover"
            containerClassName="bg-primary-50"
          />
        </View>

        {/* Informações do produto */}
        <View className="flex-1 px-3 justify-between py-3">
          <HStack>
            <View className="">
              <Text className="font-semibold text-gray-800 line-clamp-1 text-lg">
                {product.nome}
              </Text>

              {/* Descrição */}
              {product.descricao && (
                <Text className="text-gray-600 text-sm line-clamp-2 mt-1">
                  {product.descricao}
                </Text>
              )}
            </View>
            {/* Botão de adicionar ao carrinho - mesmo estilo do AdaptiveProductCard */}
            <View>
              {isCartEnabled && (
                <TouchableOpacity
                  onPress={handleAddToCart}
                  className="rounded-full p-2 mt-2 self-end"
                  style={{
                    backgroundColor: primaryColor,
                  }}
                >
                  <ShoppingBag size={20} color="#FFFFFF" />
                </TouchableOpacity>
              )}
            </View>
          </HStack>
        </View>
      </Box>
    </TouchableOpacity>
  );
}
