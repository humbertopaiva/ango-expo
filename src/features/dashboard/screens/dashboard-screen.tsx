// src/features/dashboard/screens/dashboard-screen.tsx
import React, { useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Grid,
  Package,
  Star,
  Truck,
  FileText,
  Settings,
  BarChart,
  PieChart,
  TrendingUp,
  ShoppingCart,
  Users,
} from "lucide-react-native";
import { router, useNavigation } from "expo-router";
import ScreenHeader from "@/components/ui/screen-header";
import { Card } from "@gluestack-ui/themed";
import { useCategories } from "@/src/features/categories/hooks/use-categories";
import { DashboardStatCard } from "../components/dashboard-stat-card";

export function DashboardScreen() {
  const { categories, isLoading } = useCategories();

  const menuItems = [
    {
      title: "Categorias",
      icon: Grid,
      color: "#0891B2", // primary-500
      count: categories?.length || 0,
      path: "/(app)/admin/categories" as const,
    },
    {
      title: "Produtos",
      icon: Package,
      color: "#F59E0B", // amber-500
      count: 0,
      path: "/(app)/admin/products" as const,
    },
    {
      title: "Destaques",
      icon: Star,
      color: "#10B981", // emerald-500
      count: 0,
      path: "/(app)/admin/destaques" as const,
    },
    {
      title: "Delivery",
      icon: Truck,
      color: "#6366F1", // indigo-500
      count: 0,
      path: "/(app)/admin/delivery-config" as const,
    },
    {
      title: "Encartes",
      icon: FileText,
      color: "#EC4899", // pink-500
      count: 0,
      path: "/(app)/admin/encartes" as const,
    },
    {
      title: "Vitrine",
      icon: PieChart,
      color: "#8B5CF6", // violet-500
      count: 0,
      path: "/(app)/admin/vitrine" as const,
    },
  ];

  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={["top"]}>
      <ScrollView className="flex-1 px-4">
        {/* Saudação */}
        <View className="mt-2 mb-6">
          <Text className="text-xl font-semibold text-gray-800">
            Olá, bom dia!
          </Text>
          <Text className="text-gray-500">
            Aqui está a visão geral do seu comércio.
          </Text>
        </View>

        {/* Resumo Rápido de Estatísticas */}
        {/* <View className="mb-6 space-y-3">
          <Text className="text-lg font-semibold">Resumo</Text>

          <View className="flex-row justify-between space-x-3">
            <View className="flex-1">
              <DashboardStatCard
                title="Categorias"
                value={categories?.length || 0}
                icon={Grid}
                color="#0891B2"
                bgColor="bg-blue-50"
                trend={{ value: 12, isPositive: true }}
                onPress={() => router.push("/(app)/admin/categories")}
              />
            </View>

            <View className="flex-1">
              <DashboardStatCard
                title="Produtos"
                value="23"
                icon={Package}
                color="#F59E0B"
                bgColor="bg-amber-50"
                trend={{ value: 5, isPositive: true }}
                onPress={() => router.push("/(app)/admin/products")}
              />
            </View>
          </View>

          <View className="flex-row justify-between space-x-3">
            <View className="flex-1">
              <DashboardStatCard
                title="Vendas"
                value="R$ 1.250"
                icon={ShoppingCart}
                color="#10B981"
                bgColor="bg-green-50"
                subtitle="Últimos 30 dias"
                onPress={() => {}}
              />
            </View>

            <View className="flex-1">
              <DashboardStatCard
                title="Visitantes"
                value="324"
                icon={Users}
                color="#8B5CF6"
                bgColor="bg-violet-50"
                trend={{ value: 8, isPositive: false }}
                onPress={() => {}}
              />
            </View>
          </View>
        </View> */}

        {/* Grid de Acesso Rápido */}
        <Text className="text-lg font-semibold mb-4">Acesso Rápido</Text>
        <View className="flex-row flex-wrap justify-between">
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              className="w-[31%] mb-4"
              onPress={() => router.push(item.path as any)}
            >
              <Card className="p-4 items-center">
                <View
                  className="p-2 mb-2 rounded-full"
                  style={{ backgroundColor: `${item.color}20` }}
                >
                  <item.icon size={24} color={item.color} />
                </View>
                <Text className="text-sm text-center">{item.title}</Text>
                {item.count > 0 && (
                  <View className="absolute -top-1 -right-1 bg-red-500 rounded-full w-5 h-5 items-center justify-center">
                    <Text className="text-xs text-white">{item.count}</Text>
                  </View>
                )}
              </Card>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default DashboardScreen;
