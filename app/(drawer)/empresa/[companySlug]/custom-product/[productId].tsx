// Path: app/(drawer)/empresa/[companySlug]/custom-product/[productId].tsx

import React, { useEffect, useState } from "react";
import { View, Text, ScrollView } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { CompanySpecificHeader } from "@/src/features/company-page/components/company-specific-header";
import { Settings, Layers, ChevronRight } from "lucide-react-native";
import { useCompanyPageContext } from "@/src/features/company-page/contexts/use-company-page-context";
import { CustomProduct } from "@/src/features/company-page/models/custom-product";
import { Card, VStack } from "@gluestack-ui/themed";
import { ImagePreview } from "@/components/custom/image-preview";
import { Package } from "lucide-react-native";

export default function CustomProductScreen() {
  const { productId, companySlug } = useLocalSearchParams<{
    productId: string;
    companySlug: string;
  }>();

  const vm = useCompanyPageContext();
  const [product, setProduct] = useState<CustomProduct | null>(null);

  // Encontrar o produto personalizado com base no ID
  useEffect(() => {
    if (!vm.customProducts) return;

    const foundProduct = vm.customProducts.find((p) => p.id === productId);
    setProduct(foundProduct || null);
  }, [vm.customProducts, productId]);

  if (!product) {
    return (
      <View className="flex-1 bg-white">
        <CompanySpecificHeader
          title="Produto Personalizado"
          backTo={`/(drawer)/empresa/${companySlug}`}
        />

        <View className="flex-1 justify-center items-center p-6">
          <Text className="text-gray-500">Produto não encontrado</Text>
        </View>
      </View>
    );
  }

  // Cor primária
  const primaryColor = vm.primaryColor || "#F4511E";

  return (
    <View className="flex-1 bg-white">
      <CompanySpecificHeader
        title="Produto Personalizado"
        backTo={`/(drawer)/empresa/${companySlug}`}
      />

      <ScrollView className="flex-1">
        {/* Cabeçalho do produto */}
        <View className="p-4 border-b border-gray-100">
          <View className="flex-row items-center mb-2">
            <View
              className="px-2 py-0.5 rounded-full mr-2"
              style={{ backgroundColor: primaryColor }}
            >
              <Text className="text-xs font-medium text-white">
                Personalizado
              </Text>
            </View>
          </View>

          <Text className="text-2xl font-bold text-gray-800 mb-2">
            {product.nome}
          </Text>

          {product.descricao ? (
            <Text className="text-gray-600">{product.descricao}</Text>
          ) : (
            <Text className="text-gray-500 italic">
              Selecione as opções desejadas em cada etapa para personalizar seu
              produto.
            </Text>
          )}
        </View>

        {/* Imagem do produto */}
        <View className="p-4 bg-gray-50">
          <ImagePreview
            uri={product.imagem}
            fallbackIcon={Package}
            width="100%"
            height={200}
            resizeMode="contain"
            containerClassName="rounded-lg bg-white"
          />
        </View>

        {/* Detalhes das etapas */}
        <View className="p-4">
          <View className="flex-row items-center mb-4">
            <Layers size={20} color={primaryColor} className="mr-2" />
            <Text className="text-lg font-semibold text-gray-800">
              Etapas de Personalização
            </Text>
          </View>

          <VStack space="md">
            {product.passos.map((step) => (
              <Card
                key={`step-${step.passo_numero}`}
                className="p-4 border border-gray-100"
              >
                <View className="flex-row items-center mb-2">
                  <View
                    className="w-8 h-8 rounded-full mr-3 items-center justify-center"
                    style={{ backgroundColor: primaryColor }}
                  >
                    <Text className="text-white font-bold">
                      {step.passo_numero}
                    </Text>
                  </View>
                  <View className="flex-1">
                    <Text className="text-lg font-semibold text-gray-800">
                      {step.nome || `Etapa ${step.passo_numero}`}
                    </Text>
                    <Text className="text-sm text-gray-500">
                      Selecione {step.qtd_items_step}{" "}
                      {step.qtd_items_step === 1 ? "item" : "itens"}
                    </Text>
                  </View>
                </View>

                {step.descricao && (
                  <Text className="text-gray-600 mb-3 ml-11">
                    {step.descricao}
                  </Text>
                )}

                <View className="ml-11 p-3 bg-gray-50 rounded-lg">
                  <Text className="text-sm text-gray-700">
                    {step.produtos.length}{" "}
                    {step.produtos.length === 1
                      ? "opção disponível"
                      : "opções disponíveis"}
                  </Text>
                </View>
              </Card>
            ))}
          </VStack>
        </View>

        {/* Mensagem temporária */}
        <View className="p-4 mt-4 mb-8 mx-4 bg-blue-50 rounded-lg">
          <Text className="text-blue-800 text-center">
            Esta é uma tela temporária. A implementação completa do fluxo de
            personalização será desenvolvida posteriormente.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
