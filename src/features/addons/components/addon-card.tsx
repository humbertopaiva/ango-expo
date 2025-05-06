// Path: src/features/addons/components/addon-card.tsx

import React, { useState } from "react";
import { View, Text, TouchableOpacity, Pressable } from "react-native";
import {
  MoreVertical,
  Edit,
  Trash,
  Eye,
  Tag,
  Box,
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

  const toggleActions = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsActionsVisible(!isActionsVisible);
  };

  return (
    <View className="bg-white rounded-xl mb-3 overflow-hidden border border-gray-100 shadow-sm">
      <Pressable
        onPress={onView}
        className="flex-1"
        android_ripple={{ color: "rgba(0, 0, 0, 0.05)" }}
      >
        <View className="p-4">
          <View className="flex-row items-center justify-between">
            <View className="flex-1">
              <Text className="font-semibold text-lg text-gray-800">
                {addon.nome}
              </Text>

              <View className="flex-row flex-wrap items-center mt-2 gap-2">
                <View className="flex-row items-center bg-gray-50 px-2 py-1 rounded-md gap-1">
                  <Tag
                    size={14}
                    color={THEME_COLORS.primary}
                    className="mr-1"
                  />
                  <Text className="text-sm text-gray-600">
                    {addon.categorias?.length || 0} Categorias
                  </Text>
                </View>

                <View className="flex-row items-center bg-gray-50 px-2 py-1 rounded-md gap-1">
                  <Box
                    size={14}
                    color={THEME_COLORS.primary}
                    className="mr-1"
                  />
                  <Text className="text-sm text-gray-600">
                    {addon.produtos?.length || 0} Produtos
                  </Text>
                </View>
              </View>
            </View>

            <TouchableOpacity
              onPress={toggleActions}
              className="w-8 h-8 rounded-full bg-gray-50 items-center justify-center"
            >
              <MoreVertical size={18} color="#374151" />
            </TouchableOpacity>
          </View>
        </View>
      </Pressable>

      {isActionsVisible && (
        <View className="flex-row border-t border-gray-100">
          <TouchableOpacity
            onPress={() => {
              onView();
              setIsActionsVisible(false);
            }}
            className="flex-1 p-3 flex-row items-center justify-center"
            style={{ borderRightWidth: 1, borderRightColor: "#f3f4f6" }}
          >
            <Eye size={16} color="#374151" className="mr-2" />
            <Text className="text-sm font-medium text-gray-700">Ver</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              onEdit();
              setIsActionsVisible(false);
            }}
            className="flex-1 p-3 flex-row items-center justify-center"
            style={{ borderRightWidth: 1, borderRightColor: "#f3f4f6" }}
          >
            <Edit size={16} color="#374151" className="mr-2" />
            <Text className="text-sm font-medium text-gray-700">Editar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              onDelete();
              setIsActionsVisible(false);
            }}
            className="flex-1 p-3 flex-row items-center justify-center"
          >
            <Trash size={16} color="#EF4444" className="mr-2" />
            <Text className="text-sm font-medium text-red-500">Excluir</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
