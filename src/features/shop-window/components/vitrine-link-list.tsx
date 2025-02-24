// Path: src/features/vitrine/components/vitrine-link-list.tsx
import React from "react";
import { View, ScrollView, Text } from "react-native";
import { Card } from "@gluestack-ui/themed";
import { Link2 } from "lucide-react-native";
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
    <ScrollView className="space-y-4">
      {links.map((link) => (
        <SortableLinkItem
          key={link.id}
          link={link}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </ScrollView>
  );
}
