// Path: src/features/company-page/components/product-addons-section.tsx

import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { Card, HStack, VStack, Divider } from "@gluestack-ui/themed";
import { Plus, Check, ShoppingBag, Award } from "lucide-react-native";
import { ProductAddonList, AddonProduct } from "../models/product-addon-list";
import { ImagePreview } from "@/components/custom/image-preview";
import { CompanyProduct } from "../models/company-product";
import { useCompanyPageContext } from "../contexts/use-company-page-context";
import { ProductPriceDisplay } from "./product-price-display";

interface ProductAddonsSectionProps {
  addonLists: ProductAddonList[];
  onAddAddonToCart?: (addon: CompanyProduct) => void;
}

export function ProductAddonsSection({
  addonLists,
  onAddAddonToCart,
}: ProductAddonsSectionProps) {
  const vm = useCompanyPageContext();
  const [expandedLists, setExpandedLists] = useState<Record<string, boolean>>(
    {}
  );
  const [selectedAddons, setSelectedAddons] = useState<Record<string, boolean>>(
    {}
  );

  // Cor primária da empresa
  const primaryColor = vm.primaryColor || "#F4511E";

  // Se não houver listas de adicionais, não renderiza nada
  if (!addonLists || addonLists.length === 0) {
    return null;
  }

  // Ativar/desativar a expansão de uma lista
  const toggleListExpansion = (listId: string) => {
    setExpandedLists((prev) => ({
      ...prev,
      [listId]: !prev[listId],
    }));
  };

  // Alternar seleção de um produto adicional
  const toggleAddonSelection = (productId: string) => {
    setSelectedAddons((prev) => ({
      ...prev,
      [productId]: !prev[productId],
    }));
  };

  // Handler para adicionar produto adicional ao carrinho
  const handleAddToCart = (addon: AddonProduct) => {
    if (!onAddAddonToCart) return;

    // Transformar o produto adicional no formato CompanyProduct
    const addonProduct: CompanyProduct = {
      id: addon.produtos_id.id,
      nome: addon.produtos_id.nome,
      imagem: addon.produtos_id.imagem,
      preco: addon.produtos_id.preco || "0",
      descricao: addon.produtos_id.descricao,
      preco_promocional: addon.produtos_id.preco_promocional || null,
      parcelamento_cartao: addon.produtos_id.parcelamento_cartao,
      quantidade_parcelas: addon.produtos_id.quantidade_parcelas,
      parcelas_sem_juros: addon.produtos_id.parcelas_sem_juros,
      preco_parcelado_tipo: addon.produtos_id.preco_parcelado_tipo,
      desconto_avista: addon.produtos_id.desconto_avista,
      tem_variacao: addon.produtos_id.tem_variacao,
      variacao: null,
      exibir_preco: addon.produtos_id.exibir_preco ?? true,
      exibir_produto: addon.produtos_id.exibir_produto,
      quantidade_maxima_carrinho: addon.produtos_id.quantidade_maxima_carrinho,
      empresa: {
        nome: "",
        slug: "",
      },
    };

    // Chamar o callback para adicionar ao carrinho
    onAddAddonToCart(addonProduct);

    // Marcar como selecionado
    toggleAddonSelection(addon.produtos_id.id);
  };

  return (
    <View className="mt-6 mb-8">
      <View className="px-5 mb-4">
        <HStack alignItems="center" space="sm">
          <Award size={22} color={primaryColor} />
          <Text className="text-xl font-bold text-gray-800">
            Produtos adicionais recomendados
          </Text>
        </HStack>
      </View>

      {addonLists.map((list) => (
        <Card
          key={list.id}
          className="mx-4 mb-4 rounded-xl border border-gray-100"
        >
          {/* Cabeçalho da lista de adicionais */}
          <TouchableOpacity
            onPress={() => toggleListExpansion(list.id)}
            className="p-4 flex-row justify-between items-center"
          >
            <Text className="font-semibold text-lg text-gray-800">
              {list.nome}
            </Text>
            <View
              className="w-6 h-6 rounded-full items-center justify-center"
              style={{ backgroundColor: `${primaryColor}20` }}
            >
              <Plus
                size={16}
                color={primaryColor}
                style={{
                  transform: [
                    { rotate: expandedLists[list.id] ? "45deg" : "0deg" },
                  ],
                }}
              />
            </View>
          </TouchableOpacity>

          {/* Lista de produtos adicionais (expandível) */}
          {expandedLists[list.id] && (
            <View className="px-4 pb-4">
              <Divider />
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingTop: 16, paddingBottom: 8 }}
              >
                {list.produtos.map((addon) => (
                  <View key={addon.id} className="mr-4 w-40">
                    <Card className="border border-gray-100 rounded-lg overflow-hidden">
                      {/* Imagem do produto */}
                      <View className="h-32 w-full relative">
                        <ImagePreview
                          uri={addon.produtos_id.imagem}
                          width="100%"
                          height="100%"
                          resizeMode="cover"
                        />

                        {/* Badge de selecionado */}
                        {selectedAddons[addon.produtos_id.id] && (
                          <View
                            className="absolute top-2 right-2 rounded-full p-1"
                            style={{ backgroundColor: primaryColor }}
                          >
                            <Check size={14} color="#FFFFFF" />
                          </View>
                        )}
                      </View>

                      {/* Informações do produto adicional */}
                      <View className="p-3">
                        <Text
                          className="font-medium text-gray-800 mb-1"
                          numberOfLines={2}
                        >
                          {addon.produtos_id.nome}
                        </Text>

                        {/* Preço (se existir) */}
                        {addon.produtos_id.preco && (
                          <View className="mb-2">
                            <Text
                              className="font-bold text-base"
                              style={{ color: primaryColor }}
                            >
                              {new Intl.NumberFormat("pt-BR", {
                                style: "currency",
                                currency: "BRL",
                              }).format(parseFloat(addon.produtos_id.preco))}
                            </Text>
                          </View>
                        )}

                        {/* Botão para adicionar ao carrinho */}
                        <TouchableOpacity
                          onPress={() => handleAddToCart(addon)}
                          className="mt-2 p-2 rounded-lg flex-row justify-center items-center"
                          style={{
                            backgroundColor: selectedAddons[
                              addon.produtos_id.id
                            ]
                              ? `${primaryColor}20`
                              : primaryColor,
                          }}
                        >
                          {selectedAddons[addon.produtos_id.id] ? (
                            <Text
                              className="font-medium text-sm"
                              style={{ color: primaryColor }}
                            >
                              Adicionado
                            </Text>
                          ) : (
                            <>
                              <ShoppingBag size={16} color="#FFFFFF" />
                              <Text className="ml-2 text-white font-medium text-sm">
                                Adicionar
                              </Text>
                            </>
                          )}
                        </TouchableOpacity>
                      </View>
                    </Card>
                  </View>
                ))}
              </ScrollView>
            </View>
          )}
        </Card>
      ))}
    </View>
  );
}
