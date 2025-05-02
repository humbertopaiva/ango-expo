// Path: src/features/company-page/components/product-addons-section.tsx

import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";
import { Card, HStack } from "@gluestack-ui/themed";
import { Award } from "lucide-react-native";
import { ProductAddonList, AddonProduct } from "../models/product-addon-list";
import { useCompanyPageContext } from "../contexts/use-company-page-context";
import { ProductAddonItem } from "./product-addon-item";
import { CompanyProduct } from "../models/company-product";

interface ProductAddonsSectionProps {
  addonLists: ProductAddonList[];
  onAddAddonToCart?: (addon: CompanyProduct, quantity: number) => void;
}

export function ProductAddonsSection({
  addonLists,
  onAddAddonToCart,
}: ProductAddonsSectionProps) {
  const vm = useCompanyPageContext();
  const [selectedAddons, setSelectedAddons] = useState<Record<string, number>>(
    {}
  );
  const [allAddons, setAllAddons] = useState<AddonProduct[]>([]);

  // Cor primária da empresa
  const primaryColor = vm.primaryColor || "#F4511E";

  // Se não houver listas de adicionais, não renderiza nada
  if (!addonLists || addonLists.length === 0) {
    return null;
  }

  // Combinar todos os adicionais de todas as listas em um único array
  useEffect(() => {
    const combined: AddonProduct[] = [];
    addonLists.forEach((list) => {
      list.produtos.forEach((produto) => {
        combined.push(produto);
      });
    });
    setAllAddons(combined);
  }, [addonLists]);

  // Manipular mudança de quantidade
  const handleQuantityChange = (item: AddonProduct, quantity: number) => {
    setSelectedAddons((prev) => ({
      ...prev,
      [item.produtos_id.id]: quantity,
    }));

    if (!onAddAddonToCart) return;

    // Transformar o produto adicional no formato CompanyProduct
    const addonProduct: CompanyProduct = {
      id: item.produtos_id.id,
      nome: item.produtos_id.nome,
      imagem: item.produtos_id.imagem,
      preco: item.produtos_id.preco || "0",
      descricao: item.produtos_id.descricao,
      preco_promocional: item.produtos_id.preco_promocional || null,
      parcelamento_cartao: item.produtos_id.parcelamento_cartao,
      quantidade_parcelas: item.produtos_id.quantidade_parcelas,
      parcelas_sem_juros: item.produtos_id.parcelas_sem_juros,
      preco_parcelado_tipo: item.produtos_id.preco_parcelado_tipo,
      desconto_avista: item.produtos_id.desconto_avista,
      tem_variacao: item.produtos_id.tem_variacao,
      variacao: null,
      exibir_preco: item.produtos_id.exibir_preco ?? true,
      exibir_produto: item.produtos_id.exibir_produto,
      quantidade_maxima_carrinho: item.produtos_id.quantidade_maxima_carrinho,
      empresa: {
        nome: "",
        slug: "",
      },
    };

    // Chamar o callback para adicionar ao carrinho
    onAddAddonToCart(addonProduct, quantity);
  };

  return (
    <View className="mt-6 mb-8">
      {/* Título principal */}
      <View className="px-5 mb-4">
        <HStack alignItems="center" space="sm">
          <Award size={22} color={primaryColor} />
          <Text className="text-xl font-bold text-gray-800">Adicionais</Text>
        </HStack>
      </View>

      {/* Card unificado com todos os adicionais */}
      <View className="mx-4 mb-4 ">
        <View className="p-2">
          {/* Lista simples de todos os adicionais */}
          {allAddons.length > 0 ? (
            allAddons.map((addon) => (
              <ProductAddonItem
                key={addon.id}
                item={{
                  ...addon,
                  quantidade: selectedAddons[addon.produtos_id.id] || 0,
                }}
                onQuantityChange={handleQuantityChange}
                primaryColor={primaryColor}
              />
            ))
          ) : (
            <Text className="text-gray-500 text-center py-4">
              Nenhum adicional disponível para este produto
            </Text>
          )}
        </View>
      </View>
    </View>
  );
}
