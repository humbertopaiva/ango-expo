// Path: src/features/vitrine/components/vitrine-link-list.tsx
import React, { useState } from "react";
import { View, Text, ScrollView } from "react-native";
import { Card } from "@gluestack-ui/themed";
import { Link2, ArrowDown, ArrowUp, Check } from "lucide-react-native";
import { VitrineLink } from "../models";
import { SortableLinkItem } from "./sortable-link-item";
import { Button, ButtonText } from "@/components/ui/button";

interface VitrineLinkListProps {
  links: VitrineLink[];
  isLoading: boolean;
  isReordering?: boolean;
  onEdit: (link: VitrineLink) => void;
  onDelete: (link: VitrineLink) => void;
  onReorder: (links: VitrineLink[]) => void;
}

export function VitrineLinkList({
  links,
  isLoading,
  onEdit,
  onDelete,
  onReorder,
  isReordering,
}: VitrineLinkListProps) {
  const [isEditingOrder, setIsEditingOrder] = useState(false);
  const [orderedLinks, setOrderedLinks] = useState<VitrineLink[]>(links);

  // Reset ordenação quando os links mudam
  React.useEffect(() => {
    setOrderedLinks(links);
  }, [links]);

  const moveItem = (index: number, direction: "up" | "down") => {
    const newOrderedLinks = [...orderedLinks];

    if (direction === "up" && index > 0) {
      // Troca com o item acima
      [newOrderedLinks[index], newOrderedLinks[index - 1]] = [
        newOrderedLinks[index - 1],
        newOrderedLinks[index],
      ];
    } else if (direction === "down" && index < newOrderedLinks.length - 1) {
      // Troca com o item abaixo
      [newOrderedLinks[index], newOrderedLinks[index + 1]] = [
        newOrderedLinks[index + 1],
        newOrderedLinks[index],
      ];
    }

    setOrderedLinks(newOrderedLinks);
  };

  const handleSaveOrder = () => {
    // Atualiza ordem numericamente
    const updatedLinks = orderedLinks.map((link, index) => ({
      ...link,
      ordem: index + 1,
    }));

    onReorder(updatedLinks);
    setIsEditingOrder(false);
  };

  if (isLoading || isReordering) {
    return (
      <View className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="h-24 bg-gray-100 rounded-lg animate-pulse" />
        ))}
      </View>
    );
  }

  if (links.length === 0) {
    return (
      <Card>
        <View className="p-6 items-center">
          <Link2 size={32} color="#6B7280" />
          <Text className="mt-2 text-gray-500 text-center">
            Nenhum link na vitrine. Adicione links para começar.
          </Text>
        </View>
      </Card>
    );
  }

  return (
    <View>
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
        {orderedLinks.map((link, index) => (
          <View key={link.id} className="mb-4">
            <SortableLinkItem
              link={link}
              onEdit={onEdit}
              onDelete={onDelete}
              isReordering={isEditingOrder}
              onMoveUp={index > 0 ? () => moveItem(index, "up") : undefined}
              onMoveDown={
                index < orderedLinks.length - 1
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
