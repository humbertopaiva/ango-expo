import React, { useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  useWindowDimensions,
} from "react-native";
import { Category } from "../models/category";
import { Store } from "lucide-react-native";
import { ImagePreview } from "@/components/custom/image-preview";
import { router } from "expo-router";
import { HStack } from "@gluestack-ui/themed";
import { THEME_COLORS } from "@/src/styles/colors";

interface CategoryGridProps {
  categories: Category[];
  isLoading: boolean;
}

const CATEGORY_COLORS = [
  "#F4511E",
  "#0891B2",
  "#3B82F6",
  "#8B5CF6",
  "#10B981",
  "#EC4899",
  "#F59E0B",
  "#EF4444",
  "#F97316",
  "#6366F1",
];

export function CategoryGrid({ categories, isLoading }: CategoryGridProps) {
  const { width } = useWindowDimensions();

  const categoriesWithColors = useMemo(() => {
    return categories.map((category, index) => ({
      ...category,
      color: CATEGORY_COLORS[index % CATEGORY_COLORS.length],
    }));
  }, [categories]);

  const renderItem = ({ item }: { item: Category & { color: string } }) => (
    <TouchableOpacity
      onPress={() => router.push(`/(drawer)/(tabs)/categoria/${item.slug}`)}
      activeOpacity={0.8}
      style={{ marginRight: 12 }}
    >
      <View style={{ width: 100, alignItems: "center" }}>
        <View
          style={{
            width: 64,
            height: 64,
            borderRadius: 32,
            borderWidth: 2,
            borderColor: item.color,
            overflow: "hidden",
            backgroundColor: `${item.color}15`,
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 8,
          }}
        >
          {item.imagem ? (
            <ImagePreview
              uri={item.imagem}
              width="100%"
              height="100%"
              resizeMode="cover"
            />
          ) : (
            <Store size={28} color={item.color} />
          )}
        </View>
        <Text
          numberOfLines={2}
          style={{
            textAlign: "center",
            fontSize: 12,
            color: "#333",
            fontFamily: "PlusJakartaSans_500Medium",
          }}
        >
          {item.nome}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View>
      <HStack
        className="px-4 mb-8"
        style={{ justifyContent: "space-between", alignItems: "center" }}
      >
        <Text className="text-xl font-gothic text-primary-500">CATEGORIAS</Text>
        <TouchableOpacity
        // onPress={() => router.push("/(drawer)/(tabs)/categorias")}
        >
          <HStack className="gap-2" alignItems="center">
            <Store
              size={16}
              color={THEME_COLORS.primary}
              style={{ marginLeft: 4, marginTop: 2 }}
            />
            <Text className="text-md font-semibold text-primary-500">
              Ver todas
            </Text>
          </HStack>
        </TouchableOpacity>
      </HStack>

      {isLoading ? (
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={[1, 2, 3, 4, 5, 6]}
          keyExtractor={(item) => item.toString()}
          contentContainerStyle={{ paddingHorizontal: 16 }}
          renderItem={() => (
            <View style={{ marginRight: 12 }}>
              <View
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: 12,
                  backgroundColor: "#E5E7EB",
                }}
              />
            </View>
          )}
        />
      ) : (
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={categoriesWithColors}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ paddingHorizontal: 16 }}
          renderItem={renderItem}
        />
      )}
    </View>
  );
}
