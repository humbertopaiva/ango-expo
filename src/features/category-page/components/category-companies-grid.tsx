// Path: src/features/category-page/components/category-companies-grid.tsx
import React from "react";
import { View, Text, FlatList, TouchableOpacity, Platform } from "react-native";
import { Card } from "@gluestack-ui/themed";
import { Store } from "lucide-react-native";
import { ImagePreview } from "@/components/custom/image-preview";
import { CategoryCompany } from "../models/category-company";

interface CategoryCompaniesGridProps {
  companies: CategoryCompany[];
  isLoading: boolean;
}

export function CategoryCompaniesGrid({
  companies,
  isLoading,
}: CategoryCompaniesGridProps) {
  if (isLoading) {
    return (
      <View className="flex-row flex-wrap gap-4">
        {[1, 2, 3].map((i) => (
          <View key={i} className="w-full md:w-1/2 lg:w-1/3">
            <Card className="p-4 h-48 animate-pulse bg-gray-200" />
          </View>
        ))}
      </View>
    );
  }

  if (companies.length === 0) {
    return (
      <Card>
        <View className="p-8 items-center justify-center">
          <Text className="text-lg font-medium mb-2">
            Nenhuma empresa encontrada
          </Text>
          <Text className="text-gray-500 text-center">
            Não encontramos empresas nesta categoria.
          </Text>
        </View>
      </Card>
    );
  }

  return (
    <FlatList
      data={companies}
      keyExtractor={(item) => item.id}
      numColumns={Platform.OS === "web" ? 3 : 1}
      renderItem={({ item }) => (
        <View className="w-full md:w-1/2 lg:w-1/3 p-2">
          <Card className="overflow-hidden">
            <View className="relative h-32">
              {item.banner ? (
                <ImagePreview
                  uri={item.banner}
                  width="100%"
                  height="100%"
                  resizeMode="cover"
                />
              ) : (
                <View className="w-full h-full bg-primary-100" />
              )}
              <View className="absolute -bottom-8 left-4">
                <View className="w-16 h-16 rounded-full border-4 border-white overflow-hidden bg-white">
                  {item.logo ? (
                    <ImagePreview
                      uri={item.logo}
                      width="100%"
                      height="100%"
                      resizeMode="cover"
                    />
                  ) : (
                    <View className="w-full h-full items-center justify-center bg-gray-100">
                      <Store size={24} color="#6B7280" />
                    </View>
                  )}
                </View>
              </View>
            </View>
            <View className="p-4 pt-12">
              <Text className="font-medium text-lg">{item.nome}</Text>
              <View className="flex-row flex-wrap gap-2 mt-2">
                {item.subcategorias.map((relation) => (
                  <View
                    key={relation.subcategorias_empresas_id.id}
                    className="bg-gray-100 px-2 py-1 rounded-full"
                  >
                    <Text className="text-xs text-gray-700">
                      {relation.subcategorias_empresas_id.nome}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </Card>
        </View>
      )}
      contentContainerStyle={{
        flexGrow: 1,
      }}
      scrollEnabled={false}
    />
  );
}
