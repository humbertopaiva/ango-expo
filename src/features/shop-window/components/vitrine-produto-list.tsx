// Path: src/features/vitrine/components/vitrine-produto-list.tsx
import React from "react";
import { View, ScrollView, Text } from "react-native";
import { Card } from "@gluestack-ui/themed";
import { Package } from "lucide-react-native";

import DraggableFlatList, {
  ScaleDecorator,
  RenderItemParams,
} from "react-native-draggable-flatlist";
import { Alert } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { VitrineProduto } from "../models";
import { SortableProdutoItem } from "./sortable-produto-item";

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

  const renderItem = ({
    item,
    drag,
    isActive,
  }: RenderItemParams<VitrineProduto>) => (
    <ScaleDecorator>
      <TouchableOpacity onLongPress={drag} disabled={isActive}>
        <SortableProdutoItem
          produto={item}
          onEdit={onEdit}
          onDelete={onDelete}
          isDragging={isActive}
        />
      </TouchableOpacity>
    </ScaleDecorator>
  );

  return (
    <View className="space-y-4">
      {produtos.length >= 10 && (
        <Alert>
          <AlertCircle size={16} color="#6B7280" />
          <Text className="ml-2 text-gray-500">
            Você atingiu o limite de 10 produtos em destaque.
          </Text>
        </Alert>
      )}

      <DraggableFlatList
        data={produtos}
        onDragEnd={({ data }) => {
          const newProdutos = data.map((produto, index) => ({
            ...produto,
            ordem: String.fromCharCode(65 + index),
            sort: index + 1,
          }));
          onReorder(newProdutos);
        }}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
      />
    </View>
  );
}
