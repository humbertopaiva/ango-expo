// Path: src/features/shop-window/components/vitrine-link-list.tsx
import React, { useState } from "react";
import { View, Text, FlatList } from "react-native";
import { Card } from "@gluestack-ui/themed";
import { Link2, Check, PanelRight, ChevronsUpDown } from "lucide-react-native";
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

  // Renderiza cada item da lista
  const renderItem = ({
    item,
    index,
  }: {
    item: VitrineLink;
    index: number;
  }) => (
    <View className="mb-3">
      <SortableLinkItem
        link={item}
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
    </View>
  );

  return (
    <View className="flex-1">
      {/* Botão de Editar Ordem com design melhorado */}
      <View className="flex-row justify-between items-center mb-3">
        <Text className="text-sm text-gray-500">
          {links.length} {links.length === 1 ? "link" : "links"} na vitrine
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
            Arraste os links para cima ou para baixo para reorganizar a ordem em
            que aparecerão na vitrine.
          </Text>
        </View>
      )}

      {/* Lista de links com FlatList para melhor performance de scroll */}
      <FlatList
        data={orderedLinks}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={true}
        contentContainerStyle={{ paddingBottom: 160 }} // Espaço extra para FAB e TabBar
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={10}
      />
    </View>
  );
}
