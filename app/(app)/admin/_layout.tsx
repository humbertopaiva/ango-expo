// app/(app)/admin/_layout.tsx
import { Stack, router } from "expo-router";
import { useEffect } from "react";
import useAuthStore from "@/src/stores/auth";

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
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="categories/index"
        options={{
          headerShown: false,
          title: "Categorias",
        }}
      />
      <Stack.Screen
        name="categories/new"
        options={{
          headerShown: false,
          title: "Nova Categoria",
        }}
      />
      <Stack.Screen
        name="categories/[id]"
        options={{
          headerShown: false,
          title: "Editar Categoria",
        }}
      />
    </Stack>
  );
}
