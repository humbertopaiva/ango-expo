// Path: src/features/shop-window/components/simple-produto-item.tsx

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Card } from "@gluestack-ui/themed";
import {
  Package,
  ArrowUp,
  ArrowDown,
  Trash,
  Edit,
  DollarSign,
} from "lucide-react-native";
import { VitrineProduto } from "../models";
import { ResilientImage } from "@/components/common/resilient-image";

interface SimpleProdutoItemProps {
  produto: VitrineProduto;
  onEdit: (produto: VitrineProduto) => void;
  onDelete: (produto: VitrineProduto) => void;
  isReordering?: boolean;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  position?: number;
}

export function SimpleProdutoItem({
  produto,
  onEdit,
  onDelete,
  isReordering,
  onMoveUp,
  onMoveDown,
  position,
}: SimpleProdutoItemProps) {
  const formatCurrency = (value: string) => {
    const numericValue = parseFloat(value);
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(numericValue);
  };

  return (
    <Card className="bg-white shadow-sm border border-gray-100 overflow-hidden mb-3">
      {/* Posição do item como "tag" no canto superior direito */}
      {!isReordering && position && (
        <View className="absolute top-0 right-0 bg-primary-100 rounded-bl-lg px-1.5 py-0.5 z-10">
          <Text className="text-xs font-bold text-primary-700">
            #{position}
          </Text>
        </View>
      )}

      <View className="p-2 flex-row">
        {/* Área de reordenação ou imagem */}
        <View className="pr-2">
          {isReordering ? (
            <View className="h-12 w-12 bg-gray-50 rounded-lg justify-center items-center">
              <View className="flex-row">
                {onMoveUp && (
                  <View
                    className="shadow-md"
                    style={[
                      styles.arrowButton,
                      !onMoveUp && styles.disabledButton,
                    ]}
                    onTouchEnd={onMoveUp}
                  >
                    <ArrowUp
                      size={16}
                      color={
                        onMoveUp !== undefined
                          ? "#F4511E"
                          : "rgba(244, 81, 30, 0.4)"
                      }
                    />
                  </View>
                )}
                {onMoveDown && (
                  <View
                    style={[
                      styles.arrowButton,
                      { marginLeft: 4 },
                      !onMoveDown && styles.disabledButton,
                    ]}
                    onTouchEnd={onMoveDown}
                  >
                    <ArrowDown
                      size={16}
                      color={
                        onMoveDown !== undefined
                          ? "#F4511E"
                          : "rgba(244, 81, 30, 0.4)"
                      }
                    />
                  </View>
                )}
              </View>
            </View>
          ) : (
            <View className="h-12 w-12 bg-gray-100 rounded-lg overflow-hidden">
              {produto.produto.imagem ? (
                <ResilientImage
                  source={produto.produto.imagem}
                  style={{ height: "100%", width: "100%" }}
                  resizeMode="cover"
                />
              ) : (
                <View className="h-full w-full items-center justify-center">
                  <Package size={20} color="#6B7280" />
                </View>
              )}
            </View>
          )}
        </View>

        {/* Informações do produto */}
        <View className="flex-1">
          {/* Status de disponibilidade */}
          <View className="flex-row mb-0.5">
            <View
              className={`px-1.5 py-0.5 rounded-full ${
                produto.disponivel ? "bg-green-100" : "bg-gray-100"
              }`}
            >
              <Text
                className={`text-xs ${
                  produto.disponivel ? "text-green-700" : "text-gray-700"
                }`}
              >
                {produto.disponivel ? "Disponível" : "Indisponível"}
              </Text>
            </View>
          </View>

          {/* Nome do produto */}
          <Text className="font-medium text-sm" numberOfLines={2}>
            {produto.produto.nome}
          </Text>

          {/* Informações de preço */}
          <View className="flex-row items-center mt-0.5 flex-wrap">
            <View className="flex-row items-center bg-gray-50 px-1.5 py-0.5 rounded-md mr-2">
              <DollarSign size={10} color="#4B5563" />
              <Text className="font-medium text-xs text-gray-700 ml-0.5">
                {formatCurrency(produto.produto.preco)}
              </Text>
            </View>

            {produto.produto.preco_promocional && (
              <Text className="text-xs text-gray-500 line-through">
                {formatCurrency(produto.produto.preco_promocional)}
              </Text>
            )}
          </View>
        </View>

        {/* Botões de ação */}
        {!isReordering && (
          <View className="flex-row">
            <View
              style={styles.actionButton}
              onTouchEnd={() => onEdit(produto)}
            >
              <Edit size={20} color="#374151" />
            </View>
            <View
              style={[styles.actionButton, { backgroundColor: "#FEE2E2" }]}
              onTouchEnd={() => onDelete(produto)}
            >
              <Trash size={20} color="#EF4444" />
            </View>
          </View>
        )}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  arrowButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    elevation: 2,
  },
  disabledButton: {
    opacity: 0.4,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 4,
  },
});
