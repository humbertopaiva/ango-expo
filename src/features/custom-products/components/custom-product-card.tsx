// Path: src/features/custom-products/components/custom-product-card.tsx
import React, { useState } from "react";
import { View, Text, TouchableOpacity, Pressable } from "react-native";
import { Card } from "@gluestack-ui/themed";
import {
  MoreVertical,
  Edit,
  Trash,
  Eye,
  MenuSquare,
  Calendar,
  StepForwardIcon,
} from "lucide-react-native";
import { CustomProduct } from "../models/custom-product";
import { THEME_COLORS } from "@/src/styles/colors";
import * as Haptics from "expo-haptics";

interface CustomProductCardProps {
  product: CustomProduct;
  onEdit: () => void;
  onDelete: () => void;
  onView: () => void;
}

export function CustomProductCard({
  product,
  onEdit,
  onDelete,
  onView,
}: CustomProductCardProps) {
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
                {product.nome}
              </Text>

              {/* Descrição e status */}
              <Text className="text-gray-600 text-sm mt-1 line-clamp-1">
                {product.descricao}
              </Text>

              {/* Estatísticas e datas */}
              <View className="flex-row items-center flex-wrap mt-2">
                <View className="flex-row items-center mr-4 mb-1">
                  <StepForwardIcon
                    size={16}
                    color={THEME_COLORS.primary}
                    className="mr-1"
                  />
                  <Text className="text-gray-600">
                    {product.passos?.length || 0} Passos
                  </Text>
                </View>
                <View className="flex-row items-center mb-1">
                  <View
                    className={`px-2 py-0.5 rounded-full ${
                      product.status === "ativo" ? "bg-green-100" : "bg-red-100"
                    }`}
                  >
                    <Text
                      className={
                        product.status === "ativo"
                          ? "text-xs text-green-800"
                          : "text-xs text-red-800"
                      }
                    >
                      {product.status === "ativo" ? "Ativo" : "Desativado"}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Data de modificação */}
              <View className="flex-row items-center mt-1">
                <Calendar size={14} color="#6B7280" className="mr-1" />
                <Text className="text-gray-500 text-xs">
                  {product.date_updated
                    ? `Atualizado em ${formatDate(product.date_updated)}`
                    : `Criado em ${formatDate(product.date_created)}`}
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
