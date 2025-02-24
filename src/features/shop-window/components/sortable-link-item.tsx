// Path: src/features/vitrine/components/sortable-link-item.tsx
import React from "react";
import { View, Text, TouchableOpacity, Linking } from "react-native";
import { Card } from "@gluestack-ui/themed";
import {
  MoreHorizontal,
  ExternalLink,
  ArrowUp,
  ArrowDown,
  Trash,
  Edit,
} from "lucide-react-native";
import { VitrineLink } from "../models";

interface SortableLinkItemProps {
  link: VitrineLink;
  onEdit: (link: VitrineLink) => void;
  onDelete: (link: VitrineLink) => void;
  isReordering?: boolean;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
}

export function SortableLinkItem({
  link,
  onEdit,
  onDelete,
  isReordering,
  onMoveUp,
  onMoveDown,
}: SortableLinkItemProps) {
  const handleOpenUrl = async () => {
    try {
      await Linking.openURL(link.url);
    } catch (error) {
      console.error("Erro ao abrir URL:", error);
    }
  };

  return (
    <Card className="bg-white">
      <View className="p-4">
        <View className="flex-row items-center space-x-4">
          {/* Botões de Reordenação */}
          {isReordering && (
            <View className="flex-col justify-center items-center">
              <TouchableOpacity
                onPress={onMoveUp}
                disabled={!onMoveUp}
                className={`p-2 ${!onMoveUp ? "opacity-30" : ""}`}
              >
                <ArrowUp size={20} color="#374151" />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={onMoveDown}
                disabled={!onMoveDown}
                className={`p-2 ${!onMoveDown ? "opacity-30" : ""}`}
              >
                <ArrowDown size={20} color="#374151" />
              </TouchableOpacity>
            </View>
          )}

          <View className="flex-1">
            <View className="flex-row justify-between">
              <View>
                <Text className="font-medium text-base">{link.texto}</Text>
                <TouchableOpacity onPress={handleOpenUrl}>
                  <View className="flex-row items-center space-x-1">
                    <Text numberOfLines={1} className="text-sm text-gray-500">
                      {link.url}
                    </Text>
                    <ExternalLink size={12} color="#6B7280" />
                  </View>
                </TouchableOpacity>
              </View>
              <Text className="text-sm text-gray-500">
                Tipo: {link.tipo_link}
              </Text>
            </View>
          </View>

          {/* Menu de Ações - esconder no modo de reordenação */}
          {!isReordering && (
            <View className="flex-row">
              <TouchableOpacity
                onPress={() => onEdit(link)}
                className="p-2 mr-2"
              >
                <Edit size={20} color="#374151" />
              </TouchableOpacity>

              <TouchableOpacity onPress={() => onDelete(link)} className="p-2">
                <Trash size={20} color="#ef4444" />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </Card>
  );
}
