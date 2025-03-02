// Path: src/features/shop-window/components/vitrine-link-list.tsx

import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, Button } from "react-native";
import { Card } from "@gluestack-ui/themed";
import { Link2, PanelRight } from "lucide-react-native";
import { VitrineLink } from "../models";
import { SortableLinkItem } from "./sortable-link-item";

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
  useEffect(() => {
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
      <View className="gap-4">
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
    <View className="flex-1">
      {/* Controles de Ordenação */}
      <View className="flex-row items-center justify-between mb-3">
        <Text className="text-sm text-gray-500">
          {links.length} {links.length === 1 ? "link" : "links"} na vitrine
        </Text>

        {!isEditingOrder ? (
          <View>
            <Button
              title="Ordenar"
              onPress={() => setIsEditingOrder(true)}
              color="#F4511E"
            />
          </View>
        ) : (
          <View className="flex-row">
            <Button
              title="Cancelar"
              onPress={() => {
                setOrderedLinks(links);
                setIsEditingOrder(false);
              }}
              color="#6B7280"
            />
            <View style={{ width: 8 }} />
            <Button
              title="Salvar Ordem"
              onPress={handleSaveOrder}
              color="#F4511E"
            />
          </View>
        )}
      </View>

      {/* Banner de instrução para ordenação */}
      {isEditingOrder && (
        <Card className="mb-3 bg-blue-50 border-blue-200 border">
          <View className="p-3 flex-row items-center">
            <PanelRight size={20} color="#3B82F6" />
            <Text className="ml-2 text-blue-700 flex-1">
              Use as setas para cima e para baixo para reorganizar a ordem dos
              links.
            </Text>
          </View>
        </Card>
      )}

      {/* Lista de links */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {orderedLinks.map((link, index) => (
          <SortableLinkItem
            key={link.id}
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
            position={index + 1}
          />
        ))}
      </ScrollView>
    </View>
  );
}
