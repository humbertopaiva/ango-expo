// Path: src/features/products/screens/products-dashboard-screen.tsx
import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Card } from "@gluestack-ui/themed";
import {
  Package,
  Layers,
  Plus,
  List,
  Tag,
  Settings,
} from "lucide-react-native";
import { ContentContainer } from "@/components/custom/content-container";
import { THEME_COLORS } from "@/src/styles/colors";

export function ProductsDashboardScreen() {
  const menuItems = [
    {
      title: "Novo Produto",
      description: "Adicione um novo produto ao catálogo",
      icon: <Plus size={24} color={THEME_COLORS.primary} />,
      route: "/admin/products/new",
      primary: true,
    },
    {
      title: "Produtos Cadastrados",
      description: "Gerencie todos os produtos existentes",
      icon: <Package size={24} color="#4B5563" />,
      // Corrigindo aqui para apontar para a rota "list" em vez de outra coisa
      route: "/admin/products/list",
    },
    {
      title: "Nova Variação",
      description: "Crie um novo tipo de variação (tamanho, cor, etc.)",
      icon: <Plus size={24} color="#4B5563" />,
      route: "/admin/products/variations/new",
    },
    {
      title: "Variações Cadastradas",
      description: "Veja e edite os tipos de variação existentes",
      icon: <Tag size={24} color="#4B5563" />,
      route: "/admin/products/variations/types",
    },
    {
      title: "Configurações de Produto",
      description: "Ajuste as configurações globais de produtos",
      icon: <Settings size={24} color="#4B5563" />,
      route: "/admin/products/settings",
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ContentContainer>
        <Text className="text-2xl font-bold text-gray-800 mb-2 mt-6">
          Gerenciamento de Produtos
        </Text>
        <Text className="text-gray-600 mb-6">
          Gerencie seu catálogo de produtos e variações
        </Text>

        <ScrollView showsVerticalScrollIndicator={false}>
          <View className="gap-4 pb-20">
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => router.push(item.route as any)}
                activeOpacity={0.7}
              >
                <Card
                  className={`p-4 border ${
                    item.primary
                      ? "border-primary-200 bg-primary-50"
                      : "border-gray-200 bg-white"
                  }`}
                >
                  <View className="flex-row items-center">
                    <View
                      className={`w-12 h-12 rounded-full items-center justify-center ${
                        item.primary ? "bg-primary-100" : "bg-gray-100"
                      }`}
                    >
                      {item.icon}
                    </View>
                    <View className="ml-4 flex-1">
                      <Text
                        className={`font-semibold text-lg ${
                          item.primary ? "text-primary-700" : "text-gray-800"
                        }`}
                      >
                        {item.title}
                      </Text>
                      <Text
                        className={
                          item.primary ? "text-primary-600" : "text-gray-600"
                        }
                      >
                        {item.description}
                      </Text>
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
