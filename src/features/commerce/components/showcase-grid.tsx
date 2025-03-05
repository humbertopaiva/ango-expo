// src/features/commerce/components/showcase-grid.tsx
import React from "react";
import { View, Text, FlatList } from "react-native";
import { Card } from "@gluestack-ui/themed";
import { Store } from "lucide-react-native";
import { ImagePreview } from "@/components/custom/image-preview";
import { ShowcaseCompany } from "../models/showcase-company";

interface ShowcaseGridProps {
  companies: ShowcaseCompany[];
  isLoading: boolean;
}

export function ShowcaseGrid({ companies, isLoading }: ShowcaseGridProps) {
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
      <View className="items-center justify-center p-8">
        <Text className="text-gray-500 text-center">
          Nenhuma empresa em destaque
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={companies}
      keyExtractor={(item) => item.id}
      numColumns={1}
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
              <Text className="text-sm text-gray-500">
                Última atualização:{" "}
                {new Date(item.date_updated).toLocaleDateString()}
              </Text>
            </View>
          </Card>
        </View>
      )}
      horizontal={false}
      contentContainerStyle={{
        flexGrow: 1,
      }}
    />
  );
}
