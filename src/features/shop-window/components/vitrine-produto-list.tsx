// Path: src/features/shop-window/components/vitrine-produto-list.tsx

import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { Card } from "@gluestack-ui/themed";
import {
  Package,
  Check,
  PanelRight,
  ChevronsUpDown,
  AlertCircle,
} from "lucide-react-native";
import { VitrineProduto } from "../models";
import { SimpleProdutoItem } from "./simple-produto-item";

interface VitrineProdutoListProps {
  produtos: VitrineProduto[];
  isLoading: boolean;
  isReordering?: boolean;
  onEdit: (produto: VitrineProduto) => void;
  onDelete: (produto: VitrineProduto) => void;
  onReorder: (produtos: VitrineProduto[]) => void;
}

export function VitrineProdutoList({
  produtos,
  isLoading,
  onEdit,
  onDelete,
  onReorder,
  isReordering,
}: VitrineProdutoListProps) {
  const [isEditingOrder, setIsEditingOrder] = useState(false);
  const [orderedProducts, setOrderedProducts] =
    useState<VitrineProduto[]>(produtos);

  // Reset ordenação quando os produtos mudam
  useEffect(() => {
    setOrderedProducts(produtos);
  }, [produtos]);

  const moveItem = (index: number, direction: "up" | "down") => {
    const newOrderedProducts = [...orderedProducts];

    if (direction === "up" && index > 0) {
      // Troca com o item acima
      [newOrderedProducts[index], newOrderedProducts[index - 1]] = [
        newOrderedProducts[index - 1],
        newOrderedProducts[index],
      ];
    } else if (direction === "down" && index < newOrderedProducts.length - 1) {
      // Troca com o item abaixo
      [newOrderedProducts[index], newOrderedProducts[index + 1]] = [
        newOrderedProducts[index + 1],
        newOrderedProducts[index],
      ];
    }

    setOrderedProducts(newOrderedProducts);
  };

  const handleSaveOrder = () => {
    // Atualiza ordem alfabética e sort
    const updatedProducts = orderedProducts.map((produto, index) => ({
      ...produto,
      ordem: String.fromCharCode(65 + index), // A, B, C...
      sort: index + 1,
    }));

    onReorder(updatedProducts);
    setIsEditingOrder(false);
  };

  if (isLoading || isReordering) {
    return (
      <View className="gap-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <View className="p-4">
              <View className="h-24 bg-gray-100 rounded" />
            </View>
          </Card>
        ))}
      </View>
    );
  }

  if (produtos.length === 0) {
    return (
      <Card>
        <View className="p-6 items-center">
          <Package size={32} color="#6B7280" />
          <Text className="mt-2 text-gray-500 text-center">
            Nenhum produto em destaque. Adicione produtos para começar.
          </Text>
        </View>
      </Card>
    );
  }

  return (
    <View className="flex-1">
      {produtos.length >= 10 && (
        <View className="mb-3 bg-amber-50 p-3 rounded-lg border border-amber-200 flex-row items-center">
          <AlertCircle size={16} color="#F59E0B" />
          <Text className="text-amber-700 ml-2">
            Limite máximo de 10 produtos em destaque atingido.
          </Text>
        </View>
      )}

      {/* Controles de Ordenação */}
      <View className="flex-row justify-between items-center mb-3">
        <Text className="text-sm text-gray-500">
          {produtos.length} {produtos.length === 1 ? "produto" : "produtos"} em
          destaque
        </Text>

        {!isEditingOrder ? (
          <View
            style={styles.orderButton}
            onTouchEnd={() => setIsEditingOrder(true)}
          >
            <ChevronsUpDown size={16} color="#F4511E" />
            <Text className="text-primary-500 ml-1 font-medium">Ordenar</Text>
          </View>
        ) : (
          <View style={styles.saveOrderButton} onTouchEnd={handleSaveOrder}>
            <Check size={16} color="white" />
            <Text className="text-white ml-1 font-medium">Salvar Ordem</Text>
          </View>
        )}
      </View>

      {/* Banner de instrução para ordenação */}
      {isEditingOrder && (
        <View className="mb-3 bg-primary-50 p-3 rounded-lg border border-primary-100 flex-row items-center">
          <PanelRight size={20} color="#F4511E" />
          <Text className="ml-2 text-primary-700 flex-1">
            Arraste os itens para cima ou para baixo para reorganizar a ordem em
            que aparecerão na vitrine.
          </Text>
        </View>
      )}

      {/* Lista de produtos */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {orderedProducts.map((produto, index) => (
          <SimpleProdutoItem
            key={produto.id.toString()}
            produto={produto}
            onEdit={onEdit}
            onDelete={onDelete}
            isReordering={isEditingOrder}
            onMoveUp={index > 0 ? () => moveItem(index, "up") : undefined}
            onMoveDown={
              index < orderedProducts.length - 1
                ? () => moveItem(index, "down")
                : undefined
            }
            position={index + 1}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  orderButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "white",
    borderColor: "#F4511E",
    borderWidth: 1,
    borderRadius: 4,
  },
  saveOrderButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#F4511E",
    borderRadius: 4,
  },
});
