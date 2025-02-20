// src/features/products/components/products-list.tsx
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { MoreHorizontal, Package } from "lucide-react-native";
import { Product } from "../models/product";
import { Card } from "@/components/ui/card";
import { Image } from "@/components/ui/image";

interface ProductsListProps {
  products: Product[];
  isLoading: boolean;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

export function ProductsList({
  products,
  isLoading,
  onEdit,
  onDelete,
}: ProductsListProps) {
  if (isLoading) {
    return (
      <View className="space-y-4">
        {[1, 2, 3].map((i) => (
          <View key={i} className="h-24 bg-gray-100 rounded-lg animate-pulse" />
        ))}
      </View>
    );
  }

  if (products.length === 0) {
    return (
      <View className="p-6 bg-white rounded-lg">
        <Text className="text-gray-500 text-center">
          Nenhum produto encontrado. Crie um novo produto para começar.
        </Text>
      </View>
    );
  }

  const formatCurrency = (value: string) => {
    const numericValue = parseFloat(value);
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(numericValue);
  };

  return (
    <View className="space-y-4">
      {products.map((product) => (
        <Card key={product.id} className="p-4 bg-white">
          <View className="flex-row items-center space-x-4">
            {/* Imagem ou ícone do produto */}
            <View className="h-16 w-16 bg-gray-100 rounded-lg items-center justify-center">
              {product.imagem ? (
                <Image
                  source={{ uri: product.imagem }}
                  style={{ height: "100%", width: "100%", borderRadius: 8 }}
                  resizeMode="cover"
                />
              ) : (
                <Package size={24} color="#6B7280" />
              )}
            </View>

            {/* Informações do produto */}
            <View className="flex-1">
              <Text className="font-medium text-base">{product.nome}</Text>
              <Text className="text-sm text-gray-500" numberOfLines={2}>
                {product.descricao}
              </Text>
              <View className="flex-row items-center mt-1">
                <Text className="font-medium text-primary-600">
                  {formatCurrency(product.preco)}
                </Text>
                {product.preco_promocional && (
                  <Text className="ml-2 text-sm text-gray-500 line-through">
                    {formatCurrency(product.preco_promocional)}
                  </Text>
                )}
              </View>
              <View className="flex-row items-center mt-1">
                <View
                  className={`px-2 py-1 rounded-full ${
                    product.status === "disponivel"
                      ? "bg-green-100"
                      : "bg-gray-100"
                  }`}
                >
                  <Text
                    className={
                      product.status === "disponivel"
                        ? "text-green-800"
                        : "text-gray-800"
                    }
                  >
                    {product.status === "disponivel"
                      ? "Disponível"
                      : "Indisponível"}
                  </Text>
                </View>
              </View>
            </View>

            {/* Menu de ações */}
            <TouchableOpacity onPress={() => onEdit(product)} className="p-2">
              <MoreHorizontal size={20} color="#374151" />
            </TouchableOpacity>
          </View>
        </Card>
      ))}
    </View>
  );
}
