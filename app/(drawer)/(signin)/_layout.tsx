// app/(app)/admin/_layout.tsx
import { Stack, router } from "expo-router";

import useAuthStore from "@/src/stores/auth";
import { AdminLayoutContainer } from "@/components/layouts/admin-layout";
import { CustomTabBar } from "@/components/ui/custom-tab-bar";
import { StatusBar } from "react-native";

import { useSegments } from "expo-router";
import { View } from "@gluestack-ui/themed";

import { useEffect } from "react";

export default function AdminLayout() {
  const isAuthenticated = useAuthStore(
    (state: { isAuthenticated: () => any }) => state.isAuthenticated()
  );
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
          <Stack.Screen
            name="leaflets/index"
            options={{
              title: "Encartes",
            }}
          />
        </Stack>
      </View>
    </View>
  );
}
