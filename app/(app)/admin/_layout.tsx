// app/(app)/admin/_layout.tsx
import { Stack, router } from "expo-router";
import { useEffect } from "react";
import useAuthStore from "@/src/stores/auth";
import { AdminLayoutContainer } from "@/components/layouts/admin-layout";
import { Pressable } from "@gluestack-ui/themed";
import { Ionicons } from "@expo/vector-icons";

export default function AdminLayout() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated());

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/(auth)/login");
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <AdminLayoutContainer>
      <Stack
        screenOptions={{
          headerShown: true,
          headerLeft: () => (
            <Pressable
              onPress={() => {
                console.log("Voltando...");
                router.back();
              }}
              style={{ padding: 10 }}
            >
              <Ionicons
                name="chevron-back"
                size={20}
                className="color-primary-500"
              />
            </Pressable>
          ),
        }}
      >
        <Stack.Screen
          name="categories/index"
          options={{
            title: "Categorias",
          }}
        />
        <Stack.Screen
          name="products/index"
          options={{
            title: "Produtos",
          }}
        />
        <Stack.Screen
          name="delivery/index"
          options={{
            title: "Delivery",
          }}
        />
        <Stack.Screen
          name="delivery-config/index"
          options={{
            title: "Configurações de Delivery",
          }}
        />
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
    </AdminLayoutContainer>
  );
}
