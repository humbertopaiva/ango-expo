// Path: src/features/vitrine/components/sortable-produto-item.tsx
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Card } from "@gluestack-ui/themed";
import {
  Package,
  MoreHorizontal,
  ArrowUp,
  ArrowDown,
  Trash,
  Edit,
} from "lucide-react-native";
import { VitrineProduto } from "../models";
import { ResilientImage } from "@/components/common/resilient-image";
import {
  Menu,
  MenuItem,
  MenuItemLabel,
  Button,
  ButtonText,
  MenuIcon,
} from "@gluestack-ui/themed";

interface SortableProdutoItemProps {
  produto: VitrineProduto;
  onEdit: (produto: VitrineProduto) => void;
  onDelete: (produto: VitrineProduto) => void;
  isReordering?: boolean;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
}

export function SortableProdutoItem({
  produto,
  onEdit,
  onDelete,
  isReordering,
  onMoveUp,
  onMoveDown,
}: SortableProdutoItemProps) {
  const formatCurrency = (value: string) => {
    const numericValue = parseFloat(value);
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(numericValue);
  };

  return (
    <Card className={`bg-white ${!produto.disponivel ? "opacity-60" : ""}`}>
      <View className="p-4">
        <View className="flex-row items-center space-x-4">
          {/* Botões de Reordenação */}
          {isReordering && (
            <View className="flex-col justify-center items-center">
              <TouchableOpacity
                onPress={onMoveUp}
                disabled={!onMoveUp}
                className={`p-2 ${!onMoveUp ? "opacity-30" : ""}`}
              >
                <ArrowUp size={20} color="#374151" />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={onMoveDown}
                disabled={!onMoveDown}
                className={`p-2 ${!onMoveDown ? "opacity-30" : ""}`}
              >
                <ArrowDown size={20} color="#374151" />
              </TouchableOpacity>
            </View>
          )}

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

          {/* Menu de Ações - esconder no modo de reordenação */}
          {!isReordering && (
            <View className="flex-row">
              <TouchableOpacity
                onPress={() => onEdit(produto)}
                className="p-2 mr-2"
              >
                <Edit size={20} color="#374151" />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => onDelete(produto)}
                className="p-2"
              >
                <Trash size={20} color="#ef4444" />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </Card>
  );
}
