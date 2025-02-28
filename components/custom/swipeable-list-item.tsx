// Path: components/custom/swipeable-list-item.tsx
import React, { useRef, useState } from "react";
import { View, Text, TouchableOpacity, Animated } from "react-native";
import { Card } from "@gluestack-ui/themed";
import { MoreHorizontal, Edit, Trash } from "lucide-react-native";
import { ImagePreview } from "./image-preview";
import { StatusBadge } from "./status-badge";

interface SwipeableListItemProps {
  title: string;
  subtitle?: string;
  description?: string;
  status?: string;
  statusLabel?: string;
  imageUri?: string | null;
  imageIcon?: React.ElementType;
  price?: string;
  promotionalPrice?: string;
  onEdit?: () => void;
  onDelete?: () => void;
  onPress?: () => void;
  rightContent?: React.ReactNode;
  metadata?: { label: string; value: string }[];
  badges?: { label: string; variant?: "solid" | "outline" }[];
}

export function SwipeableListItem({
  title,
  subtitle,
  description,
  status,
  statusLabel,
  imageUri,
  imageIcon,
  price,
  promotionalPrice,
  onEdit,
  onDelete,
  onPress,
  rightContent,
  metadata = [],
  badges = [],
}: SwipeableListItemProps) {
  const [isActionsVisible, setIsActionsVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(0)).current;

  const formatCurrency = (value: string | null | undefined) => {
    if (!value) return "";
    try {
      const numericValue = parseFloat(value);
      if (isNaN(numericValue)) return "";
      return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(numericValue);
    } catch (error) {
      console.error("Error formatting currency value:", error);
      return "";
    }
  };

  // Função para mostrar ou esconder as ações
  const toggleActions = () => {
    if (isActionsVisible) {
      // Esconder ações
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
      }).start();
      setIsActionsVisible(false);
    } else {
      // Mostrar ações
      Animated.spring(slideAnim, {
        toValue: -100, // Valor negativo para deslizar para a esquerda
        useNativeDriver: true,
      }).start();
      setIsActionsVisible(true);
    }
  };

  const CardContainer = onPress ? TouchableOpacity : View;

  return (
    <View className="overflow-hidden relative">
      {/* Botões de ação que aparecem ao deslizar */}
      <View
        className="absolute right-0 top-0 bottom-0 flex-row items-center justify-center h-full"
        style={{ width: 100 }}
      >
        {onEdit && (
          <TouchableOpacity
            onPress={onEdit}
            className="bg-gray-100 h-full w-1/2 items-center justify-center"
          >
            <Edit size={20} color="#374151" />
          </TouchableOpacity>
        )}
        {onDelete && (
          <TouchableOpacity
            onPress={onDelete}
            className="bg-red-100 h-full w-1/2 items-center justify-center"
          >
            <Trash size={20} color="#ef4444" />
          </TouchableOpacity>
        )}
      </View>

      {/* Card principal que desliza */}
      <Animated.View
        style={{
          transform: [{ translateX: slideAnim }],
        }}
      >
        <CardContainer onPress={onPress}>
          <Card className="p-4 bg-white">
            <View className="flex-row items-center gap-3">
              {imageUri !== undefined && (
                <View className="h-16 w-16">
                  <ImagePreview
                    uri={imageUri}
                    fallbackIcon={imageIcon}
                    containerClassName="rounded-lg"
                  />
                </View>
              )}

              <View className="flex-1">
                <Text
                  className="font-medium text-sm"
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {title}
                </Text>
                {subtitle && (
                  <Text
                    className="text-sm text-gray-500"
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {subtitle}
                  </Text>
                )}

                {price && (
                  <View className="flex-row items-center mt-1">
                    {promotionalPrice ? (
                      <>
                        {/* Se tiver preço promocional, destaca ele e mostra o preço original riscado */}
                        <Text className="font-medium text-xs text-primary-500">
                          {formatCurrency(promotionalPrice)}
                        </Text>
                        <Text className="ml-2 text-xs text-gray-500 line-through">
                          {formatCurrency(price)}
                        </Text>
                      </>
                    ) : (
                      // Se não tiver preço promocional, mostra só o preço normal destacado
                      <Text className="font-medium text-sm text-primary-600">
                        {formatCurrency(price)}
                      </Text>
                    )}
                  </View>
                )}

                {metadata.length > 0 && (
                  <View className="mt-1">
                    {metadata.map((item, index) => (
                      <Text key={index} className="text-xs text-gray-500">
                        {item.label}: {item.value}
                      </Text>
                    ))}
                  </View>
                )}
                <View className="flex-row items-center mt-1 gap-2">
                  {status && (
                    <StatusBadge status={status} customLabel={statusLabel} />
                  )}

                  {badges.map((badge, index) => (
                    <View
                      key={index}
                      className={`px-2 py-1 rounded-full ${
                        badge.variant === "outline"
                          ? "bg-gray-100"
                          : "bg-gray-100"
                      }`}
                    >
                      <Text className="text-gray-800 text-xs">
                        {badge.label}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>

              {rightContent ? (
                rightContent
              ) : (
                <TouchableOpacity onPress={toggleActions} className="p-2">
                  <MoreHorizontal size={20} color="#374151" />
                </TouchableOpacity>
              )}
            </View>
          </Card>
        </CardContainer>
      </Animated.View>
    </View>
  );
}
