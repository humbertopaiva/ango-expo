// components/custom/SortableList.tsx
import React, { useState, useEffect } from "react";
import { View, Text, ScrollView } from "react-native";
import { Button, ButtonText } from "@/components/ui/button";
import { Check } from "lucide-react-native";
import { Card } from "@gluestack-ui/themed";
import { DataList } from "./data-list";

interface SortableListProps<T> {
  data: T[];
  renderItem: (
    item: T,
    index: number,
    isReordering: boolean,
    moveUp?: () => void,
    moveDown?: () => void
  ) => React.ReactNode;
  onReorder: (newData: T[]) => void;
  isLoading?: boolean;
  emptyMessage?: string;
  emptyIcon?: React.ReactNode;
  disableReordering?: boolean;
  keyExtractor: (item: T) => string | number;
}

export function SortableList<T>({
  data,
  renderItem,
  onReorder,
  isLoading = false,
  emptyMessage,
  emptyIcon,
  disableReordering = false,
  keyExtractor,
}: SortableListProps<T>) {
  const [isReordering, setIsReordering] = useState(false);
  const [orderedItems, setOrderedItems] = useState<T[]>(data);

  // Reset order when data changes
  useEffect(() => {
    setOrderedItems(data);
  }, [data]);

  const moveItem = (index: number, direction: "up" | "down") => {
    const newOrderedItems = [...orderedItems];

    if (direction === "up" && index > 0) {
      // Swap with item above
      [newOrderedItems[index], newOrderedItems[index - 1]] = [
        newOrderedItems[index - 1],
        newOrderedItems[index],
      ];
    } else if (direction === "down" && index < newOrderedItems.length - 1) {
      // Swap with item below
      [newOrderedItems[index], newOrderedItems[index + 1]] = [
        newOrderedItems[index + 1],
        newOrderedItems[index],
      ];
    }

    setOrderedItems(newOrderedItems);
  };

  const handleSaveOrder = () => {
    onReorder(orderedItems);
    setIsReordering(false);
  };

  if (isLoading) {
    return <DataList data={[]} renderItem={() => null} isLoading={true} />;
  }

  if (data.length === 0) {
    return (
      <Card>
        <View className="p-6 items-center">
          {emptyIcon}
          <Text className="mt-2 text-gray-500 text-center">
            {emptyMessage || "Nenhum item encontrado"}
          </Text>
        </View>
      </Card>
    );
  }

  return (
    <View>
      {/* Reordering controls */}
      {!disableReordering && (
        <View className="flex-row justify-end mb-4">
          {!isReordering ? (
            <Button
              variant="outline"
              onPress={() => setIsReordering(true)}
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
      )}

      <ScrollView className="space-y-4">
        {orderedItems.map((item, index) => (
          <View key={keyExtractor(item)} className="mb-4">
            {renderItem(
              item,
              index,
              isReordering,
              index > 0 ? () => moveItem(index, "up") : undefined,
              index < orderedItems.length - 1
                ? () => moveItem(index, "down")
                : undefined
            )}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
