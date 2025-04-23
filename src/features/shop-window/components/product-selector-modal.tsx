// Path: src/features/shop-window/components/product-selector-modal.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Modal,
  SafeAreaView,
  TextInput,
} from "react-native";
import { X, Search, Package, Layers } from "lucide-react-native";
import { useProducts } from "../../products/hooks/use-products";
import { Product } from "../../products/models/product";
import { ResilientImage } from "@/components/common/resilient-image";
import { Button, ButtonText } from "@/components/ui/button";

interface ProductSelectorModalProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (productId: string) => void;
  selectedProductId?: string;
}

export function ProductSelectorModal({
  visible,
  onClose,
  onSelect,
  selectedProductId,
}: ProductSelectorModalProps) {
  const { products, isLoading } = useProducts();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  // Aplicar filtro de busca
  useEffect(() => {
    if (products) {
      setFilteredProducts(
        products.filter((product) =>
          product.nome.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [products, searchTerm]);

  const formatCurrency = (value: string) => {
    try {
      const numericValue = parseFloat(value);
      return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(numericValue);
    } catch (e) {
      return value;
    }
  };

  // Verifica se um produto tem variação
  const hasVariation = (product: Product) => {
    return !!product.variacao;
  };

  // Renderiza um item da lista de produtos
  const renderProductItem = ({ item }: { item: Product }) => {
    const isSelected = item.id === selectedProductId;
    const productHasVariation = hasVariation(item);

    return (
      <TouchableOpacity
        onPress={() => onSelect(item.id)}
        className={`flex-row p-3 rounded-lg mb-2 border ${
          isSelected
            ? "border-primary-500 bg-primary-50"
            : "border-gray-200 bg-white"
        }`}
        activeOpacity={0.7}
      >
        {/* Imagem do produto */}
        <View className="h-16 w-16 bg-gray-100 rounded-md overflow-hidden mr-3">
          {item.imagem ? (
            <ResilientImage
              source={item.imagem}
              style={{ width: "100%", height: "100%" }}
              resizeMode="cover"
            />
          ) : (
            <View className="w-full h-full items-center justify-center">
              <Package size={24} color="#9CA3AF" />
            </View>
          )}
        </View>

        {/* Detalhes do produto */}
        <View className="flex-1 justify-center">
          <Text className="text-gray-900 font-medium mb-1" numberOfLines={2}>
            {item.nome}
          </Text>

          {/* Exibir badge de variação se o produto tiver variações */}
          {productHasVariation && (
            <View className="flex-row items-center bg-blue-100 self-start px-2 py-1 rounded-full mb-1">
              <Layers size={12} color="#1D4ED8" />
              <Text className="text-xs text-blue-700 ml-1">
                Produto com variações
              </Text>
            </View>
          )}

          {/* Mostrar preço apenas se não for um produto com variação */}
          {!productHasVariation && (
            <View className="flex-row items-center">
              {item.preco_promocional ? (
                <>
                  <Text className="text-primary-600 font-bold">
                    {formatCurrency(item.preco_promocional)}
                  </Text>
                  <Text className="text-gray-500 line-through ml-2 text-xs">
                    {formatCurrency(item.preco)}
                  </Text>
                </>
              ) : (
                <Text className="text-gray-800 font-semibold">
                  {formatCurrency(item.preco)}
                </Text>
              )}
            </View>
          )}

          {/* Status do produto */}
          <View className="mt-1">
            <View
              className={`px-2 py-0.5 rounded-full self-start ${
                item.status === "disponivel" ? "bg-green-100" : "bg-gray-100"
              }`}
            >
              <Text
                className={`text-xs ${
                  item.status === "disponivel"
                    ? "text-green-800"
                    : "text-gray-700"
                }`}
              >
                {item.status === "disponivel" ? "Disponível" : "Indisponível"}
              </Text>
            </View>
          </View>
        </View>

        {/* Indicador de seleção */}
        {isSelected && (
          <View className="h-6 w-6 rounded-full bg-primary-500 items-center justify-center self-center ml-2">
            <Text className="text-white font-bold">✓</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <SafeAreaView className="flex-1 bg-black/50">
        <View className="flex-1 mt-6 bg-white rounded-t-3xl">
          {/* Header */}
          <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
            <Text className="text-xl font-semibold">Selecionar Produto</Text>
            <TouchableOpacity onPress={onClose} className="p-2">
              <X size={24} color="#000" />
            </TouchableOpacity>
          </View>

          {/* Barra de busca */}
          <View className="px-4 pt-4 pb-2">
            <View className="flex-row bg-gray-100 rounded-lg px-3 py-2 items-center">
              <Search size={20} color="#6B7280" />
              <TextInput
                placeholder="Buscar produtos..."
                className="flex-1 ml-2 text-gray-800"
                value={searchTerm}
                onChangeText={setSearchTerm}
              />
              {searchTerm.length > 0 && (
                <TouchableOpacity onPress={() => setSearchTerm("")}>
                  <X size={18} color="#6B7280" />
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Lista de produtos */}
          {isLoading ? (
            <View className="flex-1 justify-center items-center">
              <Text>Carregando produtos...</Text>
            </View>
          ) : (
            <FlatList
              data={filteredProducts}
              renderItem={renderProductItem}
              keyExtractor={(item) => item.id}
              contentContainerStyle={{ padding: 16 }}
              ListEmptyComponent={
                <View className="py-8 items-center">
                  <Package size={48} color="#D1D5DB" />
                  <Text className="text-gray-500 mt-4 text-center">
                    {searchTerm
                      ? `Nenhum produto encontrado para "${searchTerm}"`
                      : "Nenhum produto disponível para adicionar à vitrine"}
                  </Text>
                </View>
              }
            />
          )}

          {/* Footer */}
          <View className="p-4 border-t border-gray-200">
            <Button onPress={onClose} variant="outline" className="w-full">
              <ButtonText>Fechar</ButtonText>
            </Button>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
}
