// Path: src/features/shop-window/components/vitrine-link-list.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Card } from "@gluestack-ui/themed";
import { Link2, Check, ChevronsUpDown, X } from "lucide-react-native";
import { VitrineLink } from "../models";
import { SortableLinkItem } from "./sortable-link-item";

interface VitrineLinkListProps {
  links: VitrineLink[];
  isLoading: boolean;
  isReordering?: boolean;
  onEdit: (link: VitrineLink) => void;
  onDelete: (link: VitrineLink) => void;
  onReorder: (links: VitrineLink[]) => void;
  onOrderingStateChange?: (isOrdering: boolean) => void; // Prop para notificar mudanças no estado de ordenação
}

export function VitrineLinkList({
  links,
  isLoading,
  onEdit,
  onDelete,
  onReorder,
  isReordering,
  onOrderingStateChange,
}: VitrineLinkListProps) {
  const [isEditingOrder, setIsEditingOrder] = useState(false);
  const [orderedLinks, setOrderedLinks] = useState<VitrineLink[]>(links);

  // Reset ordenação quando os links mudam
  useEffect(() => {
    setOrderedLinks(links);
  }, [links]);

  // Notificar o componente pai sobre mudanças no estado de ordenação
  useEffect(() => {
    if (onOrderingStateChange) {
      onOrderingStateChange(isEditingOrder);
    }
  }, [isEditingOrder, onOrderingStateChange]);

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

  const handleCancelOrdering = () => {
    // Restaura a ordem original e sai do modo de edição
    setOrderedLinks(links);
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
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-sm text-gray-600 font-medium">
          {links.length} {links.length === 1 ? "link" : "links"} na vitrine
        </Text>

        {!isEditingOrder ? (
          <TouchableOpacity
            style={styles.orderButton}
            onPress={() => setIsEditingOrder(true)}
            activeOpacity={0.8}
          >
            <ChevronsUpDown size={18} color="#F4511E" />
            <Text className="text-primary-600 ml-2 font-semibold">
              Ordenar Itens
            </Text>
          </TouchableOpacity>
        ) : (
          <View className="flex-row">
            <TouchableOpacity
              style={styles.cancelOrderButton}
              onPress={handleCancelOrdering}
              activeOpacity={0.7}
              className="mr-3"
            >
              <X size={18} color="#64748B" />
              <Text className="text-slate-600 ml-2 font-medium">Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.saveOrderButton}
              onPress={handleSaveOrder}
              activeOpacity={0.8}
            >
              <Check size={18} color="white" />
              <Text className="text-white ml-2 font-semibold">Salvar</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Banner de instrução para ordenação */}
      {isEditingOrder && (
        <View className="mb-4 bg-primary-50 p-4 rounded-xl border border-primary-100 flex-row items-center">
          <View className="bg-primary-100 rounded-full p-2 mr-3">
            <ChevronsUpDown size={18} color="#F4511E" />
          </View>
          <View className="flex-1">
            <Text className="text-primary-800 font-semibold mb-1">
              Modo de ordenação ativo
            </Text>
            <Text className="text-primary-700">
              Use os botões de seta para mover os itens para cima ou para baixo,
              definindo a ordem de exibição na vitrine.
            </Text>
          </View>
        </View>
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

const styles = StyleSheet.create({
  orderButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: "white",
    borderColor: "#F4511E",
    borderWidth: 1.5,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 2,
  },
  saveOrderButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: "#F4511E",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  cancelOrderButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: "#F8FAFC",
    borderColor: "#CBD5E1",
    borderWidth: 1,
    borderRadius: 8,
  },
});
