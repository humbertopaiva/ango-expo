// app/(app)/admin/_layout.tsx
import { Stack, router } from "expo-router";
import { useEffect } from "react";
import useAuthStore from "@/src/stores/auth";
import { AdminLayoutContainer } from "@/components/layouts/admin-layout";
import { CustomTabBar } from "@/components/ui/custom-tab-bar";
import { StatusBar, TouchableOpacity } from "react-native";
import { ArrowLeft, ChevronLeft } from "lucide-react-native";
import { useSegments } from "expo-router";
import { View } from "@gluestack-ui/themed";
import { CustomStatusBar } from "@/components/common/custom-status-bar";
import { Text } from "@/components/ui/text";
import { goToDashboard } from "@/src/utils/nacigation.utils";

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

  return (
    <View style={{ flex: 1 }}>
      <StatusBar backgroundColor="#FF5500" />
      {/* Conteúdo principal */}
      <View style={{ flex: 1 }}>
        <AdminLayoutContainer>
          <Stack
            screenOptions={{
              headerShown: true,
              headerStyle: {
                backgroundColor: "#FF5500",
              },
              headerTitleStyle: {
                color: "#FFFFFF",
                fontSize: 18,
                fontWeight: "bold",
              },
              headerTintColor: "#FFFFFF",
              headerBackVisible: true,
              headerTitleAlign: "center",
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
      </View>
    </View>
  );
}
