// src/features/delivery/components/delivery-card.tsx
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Card } from "@gluestack-ui/themed";
import { Store } from "lucide-react-native";
import { DeliveryProfile } from "../models/delivery-profile";
import { ImagePreview } from "@/components/custom/image-preview";

interface DeliveryCardProps {
  profile: DeliveryProfile;
  onPress?: () => void;
}

export function DeliveryCard({ profile, onPress }: DeliveryCardProps) {
  // Garantindo que as subcategorias são válidas
  const validSubcategories =
    profile?.empresa?.subcategorias?.filter(
      (sub) =>
        sub &&
        sub.subcategorias_empresas_id &&
        sub.subcategorias_empresas_id.slug !== "delivery"
    ) || [];

  return (
    <TouchableOpacity onPress={onPress} disabled={!onPress}>
      <Card className="overflow-hidden mb-4">
        <View className="relative">
          {/* Banner */}
          <View className="h-32 w-full">
            <ImagePreview
              uri={profile.banner}
              fallbackIcon={Store}
              containerClassName="rounded-none"
              width="100%"
              height="100%"
            />
          </View>

          {/* Logo */}
          <View className="absolute -bottom-8 left-4">
            <View className="w-16 h-16 rounded-full border-4 border-white overflow-hidden bg-white">
              <ImagePreview
                uri={profile.logo}
                fallbackIcon={Store}
                containerClassName="rounded-full"
                width="100%"
                height="100%"
              />
            </View>
          </View>
        </View>

        {/* Content */}
        <View className="p-4 pt-12">
          <Text className="font-medium text-lg">
            {profile.nome || "Estabelecimento"}
          </Text>
          <View className="flex-row flex-wrap gap-2 mt-2">
            {validSubcategories.slice(0, 3).map((relation) => (
              <View
                key={
                  relation.subcategorias_empresas_id.id ||
                  Math.random().toString()
                }
                className="bg-gray-100 px-2.5 py-0.5 rounded-full"
              >
                <Text className="text-xs text-gray-600">
                  {relation.subcategorias_empresas_id.nome || "Categoria"}
                </Text>
              </View>
            ))}

            {/* Indicador de mais categorias */}
            {validSubcategories.length > 3 && (
              <View className="bg-gray-100 px-2.5 py-0.5 rounded-full">
                <Text className="text-xs text-gray-600">
                  +{validSubcategories.length - 3}
                </Text>
              </View>
            )}
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
}
