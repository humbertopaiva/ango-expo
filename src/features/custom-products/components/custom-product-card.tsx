// Path: src/features/custom-products/components/custom-product-card.tsx
import React, { useState } from "react";
import { View, Text, TouchableOpacity, Pressable } from "react-native";
import { Card } from "@gluestack-ui/themed";
import {
  MoreVertical,
  Edit,
  Trash,
  Eye,
  Calendar,
  StepForwardIcon,
  Tag,
} from "lucide-react-native";
import { CustomProduct } from "../models/custom-product";
import { THEME_COLORS } from "@/src/styles/colors";
import * as Haptics from "expo-haptics";
import { formatCurrency } from "@/src/utils/format.utils";
import { ImagePreview } from "@/components/custom/image-preview";

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

  // Obter a exibição do tipo de preço
  const getPriceTypeLabel = (priceType?: string) => {
    switch (priceType) {
      case "menor":
        return "Menor preço";
      case "maior":
        return "Maior preço";
      case "media":
        return "Média de preços";
      case "unico":
        return "Preço único";
      case "soma":
        return "Soma";
      default:
        return "Não definido";
    }
  };

  const toggleActions = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsActionsVisible(!isActionsVisible);
  };

  return (
    <Card className="p-0 bg-white mb-3 overflow-hidden shadow-sm border border-gray-100 rounded-xl">
      <Pressable
        onPress={onView}
        className="flex-1"
        android_ripple={{ color: "rgba(0, 0, 0, 0.05)" }}
      >
        <View className="p-4">
          <View className="flex-row">
            {/* Imagem do produto (se disponível) */}
            {product.imagem && (
              <View className="w-16 h-16 mr-3 rounded-lg overflow-hidden">
                <ImagePreview
                  uri={product.imagem}
                  containerClassName="rounded-lg"
                  fallbackIcon={() => <Tag size={24} color="#9CA3AF" />}
                />
              </View>
            )}

            <View className="flex-1">
              <View className="flex-row items-center justify-between">
                <Text className="font-medium text-lg text-gray-800">
                  {product.nome}
                </Text>
                <TouchableOpacity
                  onPress={toggleActions}
                  className="w-8 h-8 rounded-full bg-gray-50 items-center justify-center"
                >
                  <MoreVertical size={18} color="#374151" />
                </TouchableOpacity>
              </View>

              {/* Descrição com limite de caracteres */}
              {product.descricao && (
                <Text className="text-gray-600 text-sm mt-1 line-clamp-1">
                  {product.descricao}
                </Text>
              )}

              {/* Estatísticas e status */}
              <View className="flex-row items-center flex-wrap mt-2">
                <View className="flex-row items-center mr-4 mb-1 gap-1">
                  <StepForwardIcon
                    size={16}
                    color={THEME_COLORS.primary}
                    className="mr-1"
                  />
                  <Text className="text-gray-600">
                    {product.passos?.length || 0} Passos
                  </Text>
                </View>

                <View className="mb-1">
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
            </View>
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
            className="flex-1 p-3 flex-row items-center justify-center gap-1"
            style={{ borderRightWidth: 1, borderRightColor: "#f3f4f6" }}
          >
            <Eye size={16} color="#374151" className="mr-1" />
            <Text className="text-sm font-medium text-gray-700">Ver</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              onEdit();
              setIsActionsVisible(false);
            }}
            className="flex-1 p-3 flex-row items-center justify-center gap-1"
            style={{ borderRightWidth: 1, borderRightColor: "#f3f4f6" }}
          >
            <Edit size={16} color="#374151" className="mr-1" />
            <Text className="text-sm font-medium text-gray-700">Editar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              onDelete();
              setIsActionsVisible(false);
            }}
            className="flex-1 p-3 flex-row items-center justify-center gap-1"
          >
            <Trash size={16} color="#EF4444" className="mr-1" />
            <Text className="text-sm font-medium text-red-500">Excluir</Text>
          </TouchableOpacity>
        </View>
      )}
    </Card>
  );
}
