// app/(app)/admin/_layout.tsx
import { Stack, router } from "expo-router";
import { useEffect } from "react";
import useAuthStore from "@/src/stores/auth";
import { AdminLayoutContainer } from "@/components/layouts/admin-layout";

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
      <Stack screenOptions={{ headerShown: false }}>
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
