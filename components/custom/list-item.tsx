// components/custom/ListItem.tsx
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Card } from "@gluestack-ui/themed";
import { MoreHorizontal, Edit, Trash } from "lucide-react-native";
import { ImagePreview } from "./image-preview";
import { StatusBadge } from "./status-badge";

interface ListItemProps {
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

export function ListItem({
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
}: ListItemProps) {
  const formatCurrency = (value: string) => {
    const numericValue = parseFloat(value);
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(numericValue);
  };

  const CardContainer = onPress ? TouchableOpacity : View;

  return (
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
            <Text className="font-medium text-base">{title}</Text>

            {subtitle && (
              <Text className="text-sm text-gray-500">{subtitle}</Text>
            )}

            {price && (
              <View className="flex-row items-center mt-1">
                <Text className="font-medium text-primary-600">
                  {formatCurrency(price)}
                </Text>
                {promotionalPrice && (
                  <Text className="ml-2 text-sm text-gray-500 line-through">
                    {formatCurrency(promotionalPrice)}
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

            <View className="flex-row items-center mt-1 space-x-2">
              {status && (
                <StatusBadge status={status} customLabel={statusLabel} />
              )}

              {badges.map((badge, index) => (
                <View
                  key={index}
                  className={`px-2 py-1 rounded-full ${
                    badge.variant === "outline" ? "bg-gray-100" : "bg-gray-100"
                  }`}
                >
                  <Text className="text-gray-800 text-sm">{badge.label}</Text>
                </View>
              ))}
            </View>
          </View>

          {rightContent ? (
            rightContent
          ) : (
            <View className="flex-row">
              {onEdit && (
                <TouchableOpacity onPress={onEdit} className="p-2 mr-2">
                  <Edit size={20} color="#374151" />
                </TouchableOpacity>
              )}

              {onDelete && (
                <TouchableOpacity onPress={onDelete} className="p-2">
                  <Trash size={20} color="#ef4444" />
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>
      </Card>
    </CardContainer>
  );
}
