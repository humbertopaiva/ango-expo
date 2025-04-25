// Path: src/features/addons/components/enhanced-addon-card.tsx
import React, { useState } from "react";
import { View, Text, TouchableOpacity, Pressable } from "react-native";
import { Card } from "@gluestack-ui/themed";
import {
  MoreVertical,
  Edit,
  Trash,
  Eye,
  Tag,
  Box,
  Layers,
  Calendar,
} from "lucide-react-native";
import { AddonsList } from "../models/addon";
import { THEME_COLORS } from "@/src/styles/colors";
import * as Haptics from "expo-haptics";

interface AddonCardProps {
  addon: AddonsList;
  onEdit: () => void;
  onDelete: () => void;
  onView: () => void;
}

export function AddonCard({ addon, onEdit, onDelete, onView }: AddonCardProps) {
  const [isActionsVisible, setIsActionsVisible] = useState(false);

  // Formatar data para exibição legível
  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";

    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Data inválida";

    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const toggleActions = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsActionsVisible(!isActionsVisible);
  };

  return (
    <Card className="p-0 bg-white mb-3 overflow-hidden">
      <Pressable
        onPress={onView}
        className="flex-1"
        android_ripple={{ color: "rgba(0, 0, 0, 0.05)" }}
      >
        <View className="p-4">
          <View className="flex-row items-center justify-between">
            <View className="flex-1">
              <Text className="font-medium text-lg text-gray-800">
                {addon.nome}
              </Text>

              {/* Estatísticas e datas */}
              <View className="flex-row items-center flex-wrap mt-2">
                <View className="flex-row items-center mr-4 mb-1">
                  <Tag
                    size={16}
                    color={THEME_COLORS.primary}
                    className="mr-1"
                  />
                  <Text className="text-gray-600">
                    {addon.categorias?.length || 0} Categorias
                  </Text>
                </View>
                <View className="flex-row items-center mb-1">
                  <Box
                    size={16}
                    color={THEME_COLORS.primary}
                    className="mr-1"
                  />
                  <Text className="text-gray-600">
                    {addon.produtos?.length || 0} Produtos
                  </Text>
                </View>
              </View>

              {/* Data de modificação */}
              <View className="flex-row items-center mt-1">
                <Calendar size={14} color="#6B7280" className="mr-1" />
                <Text className="text-gray-500 text-xs">
                  {addon.date_updated
                    ? `Atualizado em ${formatDate(addon.date_updated)}`
                    : `Criado em ${formatDate(addon.date_created)}`}
                </Text>
              </View>
            </View>

            <TouchableOpacity onPress={toggleActions} className="p-2">
              <MoreVertical size={20} color="#374151" />
            </TouchableOpacity>
          </View>
        </View>
      </Pressable>

      {/* Ações (expandíveis) */}
      {isActionsVisible && (
        <View className="flex-row border-t border-gray-100 bg-gray-50">
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
