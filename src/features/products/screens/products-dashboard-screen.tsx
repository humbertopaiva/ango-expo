// Path: src/features/products/screens/products-dashboard-screen.tsx (atualização)
import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Card } from "@gluestack-ui/themed";
import { Package, Plus, Tag, MenuSquare } from "lucide-react-native";
import { ContentContainer } from "@/components/custom/content-container";
import { THEME_COLORS } from "@/src/styles/colors";
import { AdminScreenHeader } from "@/components/navigation/admin-screen-header";

export function ProductsDashboardScreen() {
  const menuItems = [
    {
      title: "Gerenciar Produtos",
      description: "Gerencie todos os produtos existentes",
      icon: <Package size={24} color="#4B5563" />,
      route: "/admin/products/list",
    },
    {
      title: "Gerenciar Variações",
      description: "Veja e edite os tipos de variação existentes",
      icon: <Tag size={24} color="#4B5563" />,
      route: "/admin/products/variations/types",
    },
    {
      title: "Gerenciar Adicionais",
      description: "Crie e gerencie listas de produtos adicionais",
      icon: <Plus size={24} color="#4B5563" />,
      route: "/admin/addons",
    },
    {
      title: "Produtos Personalizados",
      description: "Crie produtos com passos de personalização",
      icon: <MenuSquare size={24} color="#4B5563" />,
      route: "/admin/custom-products",
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <AdminScreenHeader
        title="Produtos"
        showBackButton={true}
        backTo="/admin"
      />
      <ContentContainer>
        <Text className="text-2xl font-bold text-gray-800 mb-2 mt-6">
          Gerenciamento de Produtos
        </Text>
        <Text className="text-gray-600 mb-6">
          Gerencie seu catálogo de produtos, variações e personalização
        </Text>

        <ScrollView showsVerticalScrollIndicator={false}>
          <View className="gap-4 pb-20">
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => router.push(item.route as any)}
                activeOpacity={0.7}
              >
                <Card className="p-4 border border-gray-200 bg-white">
                  <View className="flex-row items-center">
                    <View className="w-12 h-12 rounded-full items-center justify-center bg-gray-100">
                      {item.icon}
                    </View>
                    <View className="ml-4 flex-1">
                      <Text className="font-semibold text-lg text-gray-800">
                        {item.title}
                      </Text>
                      <Text className="text-gray-600">{item.description}</Text>
                    </View>
                  </View>
                </Card>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </ContentContainer>
    </SafeAreaView>
  );
}
