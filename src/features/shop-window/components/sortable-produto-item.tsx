// Path: src/features/vitrine/components/sortable-produto-item.tsx
import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { Card } from "@gluestack-ui/themed";
import { Package, MoreHorizontal, GripVertical } from "lucide-react-native";
import { VitrineProduto } from "../models";
import { ResilientImage } from "@/components/common/resilient-image";

interface SortableProdutoItemProps {
  produto: VitrineProduto;
  onEdit: (produto: VitrineProduto) => void;
  onDelete: (produto: VitrineProduto) => void;
  isDragging?: boolean;
}

export function SortableProdutoItem({
  produto,
  onEdit,
  onDelete,
  isDragging,
}: SortableProdutoItemProps) {
  const formatCurrency = (value: string) => {
    const numericValue = parseFloat(value);
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(numericValue);
  };

  return (
    <Card
      className={`bg-white ${
        isDragging ? "shadow-lg border-2 border-primary-500" : ""
      } 
                 ${!produto.disponivel ? "opacity-60" : ""}`}
    >
      <View className="p-4">
        <View className="flex-row items-center space-x-4">
          <TouchableOpacity className="p-2">
            <GripVertical size={20} color="#6B7280" />
          </TouchableOpacity>

          <View className="h-16 w-16 bg-gray-100 rounded-lg items-center justify-center">
            {produto.produto.imagem ? (
              <ResilientImage
                source={produto.produto.imagem}
                style={{ height: "100%", width: "100%", borderRadius: 8 }}
                resizeMode="cover"
              />
            ) : (
              <Package size={24} color="#6B7280" />
            )}
          </View>

          <View className="flex-1">
            <Text className="font-medium text-base">
              {produto.produto.nome}
            </Text>
            <Text className="text-sm text-gray-500" numberOfLines={2}>
              {produto.produto.descricao}
            </Text>
            <View className="flex-row items-center mt-1">
              <Text className="font-medium text-primary-600">
                {formatCurrency(produto.produto.preco)}
              </Text>
              {produto.produto.preco_promocional && (
                <Text className="ml-2 text-sm text-gray-500 line-through">
                  {formatCurrency(produto.produto.preco_promocional)}
                </Text>
              )}
            </View>
          </View>

          <TouchableOpacity onPress={() => onEdit(produto)} className="p-2">
            <MoreHorizontal size={20} color="#374151" />
          </TouchableOpacity>
        </View>
      </View>
    </Card>
  );
}
