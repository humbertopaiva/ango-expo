// app/(app)/admin/_layout.tsx
import { Stack, router } from "expo-router";
import { useEffect } from "react";
import useAuthStore from "@/src/stores/auth";
import { AdminLayoutContainer } from "@/components/layouts/admin-layout";
import { CustomTabBar } from "@/components/ui/custom-tab-bar";
import { TouchableOpacity } from "react-native";
import { ArrowLeft, ChevronLeft } from "lucide-react-native";
import { useSegments } from "expo-router";

export default function AdminLayout() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated());
  const segments = useSegments();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/(auth)/login");
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return null;
  }

  // Função para voltar ao dashboard
  const goToDashboard = () => {
    router.push("/(app)/admin/dashboard");
  };

  return (
    <AdminLayoutContainer>
      <Stack
        screenOptions={{
          headerShown: true,
          headerBackground: () => (
            <TouchableOpacity
              onPress={goToDashboard}
              className="flex-row items-center bg-primary-500 p-6 h-20"
            ></TouchableOpacity>
          ),
          headerLeft: () => (
            <TouchableOpacity
              onPress={goToDashboard}
              className="flex-row items-center pr-4"
            >
              <ChevronLeft size={24} color="#FFFFFF" />
            </TouchableOpacity>
          ),
          headerTintColor: "#FFFFFF",
        }}
      >
        {/* Dashboard */}
        <Stack.Screen
          name="dashboard/index"
          options={{
            title: "Dashboard",
          }}
        />

        {/* Categorias */}
        <Stack.Screen
          name="categories/index"
          options={{
            title: "Categorias",
          }}
        />
        <Stack.Screen
          name="categories/new"
          options={{
            title: "Nova Categoria",
          }}
        />
        <Stack.Screen
          name="categories/[id]"
          options={{
            title: "Categoria",
          }}
        />

        {/* Produtos */}
        <Stack.Screen
          name="products/index"
          options={{
            title: "Produtos",
          }}
        />
        <Stack.Screen
          name="products/new"
          options={{
            title: "Novo Produto",
          }}
        />
        <Stack.Screen
          name="products/[id]"
          options={{
            title: "Produto",
          }}
        />

        {/* Configurações */}
        <Stack.Screen
          name="delivery-config/index"
          options={{
            title: "Configurações de Delivery",
          }}
        />

        {/* Destaques */}
        <Stack.Screen
          name="destaques/index"
          options={{
            title: "Destaques",
          }}
        />
        <Stack.Screen
          name="encartes/index"
          options={{
            title: "Encartes",
          }}
        />
        <Stack.Screen
          name="profile/index"
          options={{
            title: "Perfil",
          }}
        />
        <Stack.Screen
          name="vitrine/index"
          options={{
            title: "Vitrine",
          }}
        />
      </Stack>

      {/* Custom Tab Bar */}
      <CustomTabBar />
    </AdminLayoutContainer>
  );
}
