// Path: src/features/products/screens/products-dashboard-screen.tsx
import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import {
  Package,
  Tag,
  Grid,
  BarChart4,
  Plus,
  ListFilter,
  Settings,
} from "lucide-react-native";
import { THEME_COLORS } from "@/src/styles/colors";
import { AdminScreenHeader } from "@/components/navigation/admin-screen-header";
import { Box } from "@/components/ui/box";
import { useProducts } from "../hooks/use-products";

/**
 * Modern redesigned dashboard for products management
 */
export function ProductsDashboardScreen() {
  const { products, isLoading } = useProducts();

  // Menu items with configuration
  const menuItems = [
    {
      id: "products-list",
      title: "Listar Produtos",
      subtitle: `${products.length} produtos cadastrados`,
      icon: Package,
      iconColor: "#2196F3",
      bgColor: "#EFF6FF",
      path: "/admin/products/list",
    },
    {
      id: "variations",
      title: "Variações",
      subtitle: "Tamanhos, cores, etc",
      icon: Tag,
      iconColor: "#9C27B0",
      bgColor: "#F3E8FF",
      path: "/admin/variations",
    },
    {
      id: "addons",
      title: "Adicionais",
      subtitle: "Complementos de produtos",
      icon: Plus,
      iconColor: "#4CAF50",
      bgColor: "#ECFDF5",
      path: "/admin/addons",
    },
    {
      id: "custom-products",
      title: "Produtos Personalizados",
      subtitle: "Personalizações passo a passo",
      icon: Settings,
      iconColor: "#F44336",
      bgColor: "#FEF2F2",
      path: "/admin/custom-products",
    },
  ];

  // Quick action buttons
  const quickActions = [
    {
      id: "new-product",
      title: "Novo Produto",
      icon: Plus,
      path: "/admin/products/new",
      primary: true,
    },
    {
      id: "filter",
      title: "Filtrar",
      icon: ListFilter,
      path: "/admin/products/list",
      primary: false,
    },
    {
      id: "stats",
      title: "Estatísticas",
      icon: BarChart4,
      path: "/admin/products/stats",
      primary: false,
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1">
        {/* Quick Actions */}
        <View className="px-4 flex-row justify-between mb-6 py-6">
          {quickActions.map((action) => (
            <TouchableOpacity
              key={action.id}
              className={`flex-1 py-3 mx-1 items-center rounded-xl ${
                action.primary ? "bg-primary-500" : "bg-gray-100"
              }`}
              onPress={() => router.push(action.path as any)}
            >
              <action.icon
                size={18}
                color={action.primary ? "#FFFFFF" : "#374151"}
              />
              <Text
                className={`text-xs font-medium mt-1 ${
                  action.primary ? "text-white" : "text-gray-800"
                }`}
              >
                {action.title}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Menu Grid */}
        <View className="px-4 mb-8">
          <Text className="text-lg font-semibold text-gray-800 mb-4">
            Módulos de Produtos
          </Text>

          <View className="gap-4">
            {menuItems.map((item) => (
              <TouchableOpacity
                key={item.id}
                className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm"
                onPress={() => router.push(item.path as any)}
                activeOpacity={0.7}
              >
                <View className="flex-row items-center">
                  <View
                    className="w-12 h-12 rounded-full items-center justify-center mr-4"
                    style={{ backgroundColor: item.bgColor }}
                  >
                    <item.icon size={22} color={item.iconColor} />
                  </View>

                  <View className="flex-1">
                    <Text className="font-semibold text-base text-gray-800">
                      {item.title}
                    </Text>
                    <Text className="text-gray-500 text-sm">
                      {item.subtitle}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Bottom spacing */}
        <View className="h-10" />
      </ScrollView>
    </SafeAreaView>
  );
}
