// Path: src/features/vitrine/components/sortable-link-item.tsx
import React from "react";
import { View, Text, TouchableOpacity, Linking } from "react-native";
import { Card } from "@gluestack-ui/themed";
import {
  MoreHorizontal,
  ExternalLink,
  GripVertical,
} from "lucide-react-native";
import { VitrineLink } from "../models";

interface SortableLinkItemProps {
  link: VitrineLink;
  onEdit: (link: VitrineLink) => void;
  onDelete: (link: VitrineLink) => void;
  isDragging?: boolean;
}

export function SortableLinkItem({
  link,
  onEdit,
  onDelete,
  isDragging,
}: SortableLinkItemProps) {
  const handleOpenUrl = async () => {
    try {
      await Linking.openURL(link.url);
    } catch (error) {
      console.error("Erro ao abrir URL:", error);
    }
  };

  return (
    <Card
      className={`bg-white ${
        isDragging ? "shadow-lg border-2 border-primary-500" : ""
      }`}
    >
      <View className="p-4">
        <View className="flex-row items-center space-x-4">
          <TouchableOpacity className="p-2">
            <GripVertical size={20} color="#6B7280" />
          </TouchableOpacity>

          <View className="flex-1">
            <View className="flex-row justify-between">
              <View>
                <Text className="font-medium text-base">{link.texto}</Text>
                <TouchableOpacity onPress={handleOpenUrl}>
                  <View className="flex-row items-center space-x-1">
                    <Text className="text-sm text-gray-500">{link.url}</Text>
                    <ExternalLink size={12} color="#6B7280" />
                  </View>
                </TouchableOpacity>
              </View>
              <Text className="text-sm text-gray-500">
                Tipo: {link.tipo_link}
              </Text>
            </View>
          </View>

          <TouchableOpacity onPress={() => onEdit(link)} className="p-2">
            <MoreHorizontal size={20} color="#374151" />
          </TouchableOpacity>
        </View>
      </View>
    </Card>
  );
}
