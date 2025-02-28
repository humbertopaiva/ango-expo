// Path: src/features/shop-window/components/vitrine-produto-list.tsx
import React, { useState } from "react";
import { View, Text, ScrollView, FlatList } from "react-native";
import { Card } from "@gluestack-ui/themed";
import {
  Package,
  Check,
  PanelRight,
  ChevronsUpDown,
} from "lucide-react-native";
import { VitrineProduto } from "../models";
import { SortableProdutoItem } from "./sortable-produto-item";
import { Button, ButtonText } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react-native";

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

  // Renderiza cada item da lista
  const renderItem = ({
    item,
    index,
  }: {
    item: VitrineProduto;
    index: number;
  }) => (
    <View className="mb-3">
      <SortableProdutoItem
        produto={item}
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
    </View>
  );

  return (
    <View className="flex-1">
      {produtos.length >= 10 && (
        <Alert className="mb-3 bg-amber-50 border border-amber-200">
          <AlertCircle size={16} color="#F59E0B" />
          <Text className="text-amber-700">
            Limite máximo de 10 produtos em destaque atingido.
          </Text>
        </Alert>
      )}

      {/* Botão de Editar Ordem com design melhorado */}
      <View className="flex-row justify-between items-center mb-3">
        <Text className="text-sm text-gray-500">
          {produtos.length} {produtos.length === 1 ? "produto" : "produtos"} em
          destaque
        </Text>

        {!isEditingOrder ? (
          <Button
            variant="outline"
            onPress={() => setIsEditingOrder(true)}
            size="sm"
            className="border-primary-500"
          >
            <ChevronsUpDown size={16} color="#F4511E" className="mr-1" />
            <ButtonText className="text-primary-500">Ordenar</ButtonText>
          </Button>
        ) : (
          <Button
            onPress={handleSaveOrder}
            size="sm"
            className="bg-primary-500"
          >
            <Check size={16} color="white" className="mr-1" />
            <ButtonText>Salvar Ordem</ButtonText>
          </Button>
        )}
      </View>

      {/* Modo de edição de ordem - banner informativo */}
      {isEditingOrder && (
        <View className="mb-3 bg-primary-50 p-3 rounded-lg border border-primary-100 flex-row items-center">
          <PanelRight size={20} color="#F4511E" className="mr-2" />
          <Text className="text-sm text-primary-700 flex-1">
            Arraste os itens para cima ou para baixo para reorganizar a ordem em
            que aparecerão na vitrine.
          </Text>
        </View>
      )}

      {/* Lista de produtos com FlatList para melhor performance de scroll */}
      <FlatList
        data={orderedProducts}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={true}
        contentContainerStyle={{ paddingBottom: 160 }} // Espaço extra para FAB e TabBar
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={10}
      />
    </View>
  );
}
