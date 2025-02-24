// Path: src/features/vitrine/components/vitrine-produto-list.tsx
import React, { useState } from "react";
import { View, Text, ScrollView } from "react-native";
import { Card } from "@gluestack-ui/themed";
import { Package, Check } from "lucide-react-native";
import { VitrineProduto } from "../models";
import { SortableProdutoItem } from "./sortable-produto-item";
import { Alert } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react-native";
import { Button, ButtonText } from "@/components/ui/button";

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
  React.useEffect(() => {
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
      <View className="space-y-4">
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
    <View>
      {produtos.length >= 10 && (
        <Alert className="mb-4">
          <AlertCircle size={16} color="#6B7280" />
          <Text>Limite máximo de 10 produtos em destaque atingido.</Text>
        </Alert>
      )}

      {/* Botão de Editar Ordem */}
      <View className="flex-row justify-end mb-4">
        {!isEditingOrder ? (
          <Button
            variant="outline"
            onPress={() => setIsEditingOrder(true)}
            size="sm"
          >
            <ButtonText>Editar Ordem</ButtonText>
          </Button>
        ) : (
          <Button onPress={handleSaveOrder} size="sm">
            <Check size={16} color="white" className="mr-1" />
            <ButtonText>Salvar Ordem</ButtonText>
          </Button>
        )}
      </View>

      <ScrollView className="space-y-4">
        {orderedProducts.map((produto, index) => (
          <View key={produto.id} className="mb-4">
            <SortableProdutoItem
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
            />
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
