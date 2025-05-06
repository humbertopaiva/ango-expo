// Path: src/features/commerce/components/showcase-grid.tsx
import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { Card } from "@gluestack-ui/themed";
import { Store, Sparkles } from "lucide-react-native";
import { ImagePreview } from "@/components/custom/image-preview";
import { ShowcaseCompany } from "../models/showcase-company";
import { router } from "expo-router";

interface ShowcaseGridProps {
  companies: ShowcaseCompany[];
  isLoading: boolean;
}

export function ShowcaseGrid({ companies, isLoading }: ShowcaseGridProps) {
  if (isLoading) {
    return (
      <View className="mb-8">
        <View className="inline-flex items-center gap-2 bg-primary-100 mb-4 px-4 py-2 rounded-full">
          <Sparkles className="h-4 w-4 text-primary-600" />
          <Text className="text-sm font-medium text-primary-600">
            Vitrines em Destaque
          </Text>
        </View>

        <Text className="text-2xl font-bold mb-2 text-gray-900">
          Últimas Novidades
        </Text>

        <Text className="text-gray-600 mb-6">
          Confira os produtos mais recentes das lojas da nossa cidade
        </Text>

        <View className="flex-row flex-wrap gap-4">
          {[1, 2, 3].map((i) => (
            <View key={i} className="w-full md:w-1/2 lg:w-1/3">
              <Card className="p-4 h-48 animate-pulse bg-gray-200" />
            </View>
          ))}
        </View>
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
    <View className="mb-8">
      <View className="mb-6">
        <View className="inline-flex items-center gap-2 bg-primary-100 mb-4 px-4 py-2 rounded-full">
          <Sparkles className="h-4 w-4 text-primary-600" />
          <Text className="text-sm font-medium text-primary-600">
            Vitrines em Destaque
          </Text>
        </View>

        <Text className="text-2xl font-bold mb-2 text-gray-900">
          Últimas Novidades
        </Text>

        <Text className="text-gray-600 mb-6">
          Confira os produtos mais recentes das lojas da nossa cidade
        </Text>
      </View>

      <View className="gap-4">
        {companies.map((item) => (
          <TouchableOpacity
            key={item.id}
            onPress={() => router.push(`/(drawer)/empresa/${item.slug}`)}
          >
            <Card
              className="overflow-hidden rounded-xl border border-gray-200 "
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 3,
                elevation: 3,
              }}
            >
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
                <View className="flex-row justify-between items-center mt-2">
                  <Text className="text-sm text-gray-500">
                    Última atualização:{" "}
                    {new Date(item.date_updated).toLocaleDateString()}
                  </Text>
                  <View className="bg-primary-50 rounded-full px-2 py-1">
                    <Text className="text-xs text-primary-700">Ver mais</Text>
                  </View>
                </View>
              </View>
            </Card>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
