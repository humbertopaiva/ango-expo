// src/features/dashboard/screens/dashboard-screen.tsx
import React from "react";
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
import { router } from "expo-router";
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
        <View className="mb-6 space-y-3">
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
        </View>

        {/* Grid de Acesso Rápido */}
        <Text className="text-lg font-semibold mb-4">Acesso Rápido</Text>
        <View className="flex-row flex-wrap justify-between">
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              className="w-[31%] mb-4"
              onPress={() => router.push(item.path)}
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

        {/* Atividades Recentes */}
        <Text className="text-lg font-semibold mb-4 mt-2">
          Atividades Recentes
        </Text>
        <Card className="p-4 mb-6">
          <View className="border-l-4 border-blue-500 pl-3 mb-3">
            <Text className="font-medium">Nova categoria adicionada</Text>
            <Text className="text-xs text-gray-500">Hoje às 10:30</Text>
          </View>
          <View className="border-l-4 border-amber-500 pl-3 mb-3">
            <Text className="font-medium">Produto atualizado</Text>
            <Text className="text-xs text-gray-500">Ontem às 14:20</Text>
          </View>
          <View className="border-l-4 border-green-500 pl-3">
            <Text className="font-medium">
              Configuração de entrega modificada
            </Text>
            <Text className="text-xs text-gray-500">20/02 às 09:15</Text>
          </View>
        </Card>

        {/* Dicas e ações recomendadas */}
        <Text className="text-lg font-semibold mb-4">Ações Recomendadas</Text>
        <Card className="p-4 mb-6 bg-blue-50 border border-blue-100">
          <View className="flex-row items-start">
            <View className="p-2 mr-3 rounded-full bg-blue-100">
              <TrendingUp size={20} color="#0891B2" />
            </View>
            <View className="flex-1">
              <Text className="font-medium text-gray-800">
                Aumente suas vendas
              </Text>
              <Text className="text-sm text-gray-600 mt-1">
                Você possui 3 produtos sem imagens. Produtos com imagens vendem
                até 4x mais que aqueles sem imagens.
              </Text>
              <TouchableOpacity
                className="mt-3 bg-blue-500 py-2 px-4 rounded-md self-start"
                onPress={() => router.push("/(app)/admin/products")}
              >
                <Text className="text-white font-medium">
                  Atualizar Produtos
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

export default DashboardScreen;
