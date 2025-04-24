// Path: src/features/addons/components/addon-card.tsx
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Card } from "@gluestack-ui/themed";
import {
  MoreVertical,
  Edit,
  Trash,
  Eye,
  Tag,
  Box,
  LayersIcon,
} from "lucide-react-native";
import { AddonsList } from "../models/addon";
import { THEME_COLORS } from "@/src/styles/colors";

interface AddonCardProps {
  addon: AddonsList;
  onEdit: () => void;
  onDelete: () => void;
  onView: () => void;
}

export function AddonCard({ addon, onEdit, onDelete, onView }: AddonCardProps) {
  const [isActionsVisible, setIsActionsVisible] = React.useState(false);

  const toggleActions = () => {
    setIsActionsVisible(!isActionsVisible);
  };

  return (
    <Card className="p-4 bg-white">
      <TouchableOpacity onPress={onView} className="flex-1">
        <View className="flex-row items-center justify-between">
          <View className="flex-1">
            <Text className="font-medium text-lg text-gray-800">
              {addon.nome}
            </Text>
            <View className="flex-row items-center mt-2">
              <View className="flex-row items-center mr-4">
                <Tag size={16} color={THEME_COLORS.primary} className="mr-1" />
                <Text className="text-gray-600">
                  {addon.categorias?.length || 0} Categorias
                </Text>
              </View>
              <View className="flex-row items-center">
                <Box size={16} color={THEME_COLORS.primary} className="mr-1" />
                <Text className="text-gray-600">
                  {addon.produtos?.length || 0} Produtos
                </Text>
              </View>
            </View>
          </View>

          <TouchableOpacity onPress={toggleActions} className="p-2">
            <MoreVertical size={20} color="#374151" />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>

      {/* Ações (expandíveis) */}
      {isActionsVisible && (
        <View className="flex-row border-t border-gray-100 mt-2 pt-2 bg-gray-50">
          <TouchableOpacity
            onPress={() => {
              onView();
              setIsActionsVisible(false);
            }}
            className="flex-1 p-3 flex-row items-center justify-center"
            style={{ borderRightWidth: 1, borderRightColor: "#f3f4f6" }}
          >
            <Eye size={16} color="#374151" className="mr-1" />
            <Text className="text-xs font-medium text-gray-700">Ver</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              onEdit();
              setIsActionsVisible(false);
            }}
            className="flex-1 p-3 flex-row items-center justify-center"
            style={{ borderRightWidth: 1, borderRightColor: "#f3f4f6" }}
          >
            <Edit size={16} color="#374151" className="mr-1" />
            <Text className="text-xs font-medium text-gray-700">Editar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              onDelete();
              setIsActionsVisible(false);
            }}
            className="flex-1 p-3 flex-row items-center justify-center"
          >
            <Trash size={16} color="#EF4444" className="mr-1" />
            <Text className="text-xs font-medium text-red-500">Excluir</Text>
          </TouchableOpacity>
        </View>
      )}
    </Card>
  );
}
