// Path: src/features/company-page/components/custom-product-card.tsx

import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Card } from "@gluestack-ui/themed";
import { Package, Settings, ChevronRight, Layers } from "lucide-react-native";
import { ImagePreview } from "@/components/custom/image-preview";
import { useCompanyPageContext } from "../contexts/use-company-page-context";
import { CustomProduct } from "../models/custom-product";
import { router } from "expo-router";
import { HStack, VStack } from "@gluestack-ui/themed";

interface CustomProductCardProps {
  product: CustomProduct;
  style?: any;
}

export function CustomProductCard({ product, style }: CustomProductCardProps) {
  const vm = useCompanyPageContext();
  const primaryColor = vm.primaryColor || "#F4511E";

  // Total de etapas
  const totalSteps = product.passos.length;

  // Total de opções em todas as etapas
  const totalOptions = product.passos.reduce(
    (total, step) => total + step.produtos.length,
    0
  );

  // Navegar para a página de detalhes do produto personalizado
  const handlePress = () => {
    if (!vm.profile?.empresa.slug) return;

    router.push({
      pathname:
        `/(drawer)/empresa/${vm.profile.empresa.slug}/custom-product/${product.id}` as any,
      params: { productId: product.id },
    });
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      className="w-full mb-3"
      activeOpacity={0.7}
      style={style}
    >
      <Card className="overflow-hidden rounded-xl border border-gray-100 shadow-sm bg-white">
        {/* Cabeçalho com badge "Personalizado" */}
        <View
          className="p-2 border-b border-gray-100"
          style={{ backgroundColor: `${primaryColor}10` }}
        >
          <HStack className="items-center">
            <View
              className="px-2 py-0.5 rounded-full mr-2"
              style={{ backgroundColor: primaryColor }}
            >
              <Text className="text-xs font-medium text-white">
                Personalizado
              </Text>
            </View>
            <Text className="text-xs text-gray-600">
              {totalSteps} {totalSteps === 1 ? "etapa" : "etapas"} •{" "}
              {totalOptions} {totalOptions === 1 ? "opção" : "opções"}
            </Text>
          </HStack>
        </View>

        {/* Conteúdo principal */}
        <View className="flex-row">
          {/* Imagem do produto */}
          <View className="w-1/3 aspect-square">
            <ImagePreview
              uri={product.imagem}
              fallbackIcon={Package}
              width="100%"
              height="100%"
              resizeMode="cover"
            />
          </View>

          {/* Informações do produto */}
          <View className="w-2/3 p-3 justify-between">
            <View>
              <Text
                className="font-semibold text-gray-800 text-lg"
                numberOfLines={1}
              >
                {product.nome}
              </Text>

              {product.descricao ? (
                <Text className="text-sm text-gray-600 mt-1" numberOfLines={2}>
                  {product.descricao}
                </Text>
              ) : (
                <Text className="text-sm text-gray-500 mt-1 italic">
                  Monte seu produto personalizado
                </Text>
              )}
            </View>

            {/* Etapas de personalização */}
            <VStack className="mt-2">
              {product.passos.slice(0, 2).map((step) => (
                <View
                  key={`step-${step.passo_numero}`}
                  className="flex-row items-center mb-1"
                >
                  <View
                    className="w-4 h-4 rounded-full mr-2 items-center justify-center"
                    style={{ backgroundColor: `${primaryColor}20` }}
                  >
                    <Text
                      className="text-xs font-bold"
                      style={{ color: primaryColor }}
                    >
                      {step.passo_numero}
                    </Text>
                  </View>
                  <Text className="text-xs text-gray-700" numberOfLines={1}>
                    {step.nome || `Etapa ${step.passo_numero}`}
                    <Text className="text-gray-500">{` (${
                      step.qtd_items_step
                    } ${step.qtd_items_step === 1 ? "item" : "itens"})`}</Text>
                  </Text>
                </View>
              ))}

              {product.passos.length > 2 && (
                <Text className="text-xs text-gray-500 ml-6">
                  +{product.passos.length - 2} etapas adicionais
                </Text>
              )}
            </VStack>

            {/* Rodapé com ícone de configuração */}
            <HStack className="mt-3 items-center justify-between">
              <HStack className="items-center">
                <Settings size={16} color={primaryColor} />
                <Text className="ml-1 text-sm" style={{ color: primaryColor }}>
                  Personalizar
                </Text>
              </HStack>

              <ChevronRight size={18} color="#9CA3AF" />
            </HStack>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
}
