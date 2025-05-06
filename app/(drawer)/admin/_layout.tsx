// Path: app/(drawer)/admin/_layout.tsx

import { Stack, router } from "expo-router";
import useAuthStore from "@/src/stores/auth";
import { StatusBar, View } from "react-native";
import { useSegments } from "expo-router";
import { useEffect } from "react";

export default function AdminLayout() {
  const isAuthenticated = useAuthStore(
    (state: { isAuthenticated: () => any }) => state.isAuthenticated()
  );
  const segments = useSegments();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/(drawer)/(auth)/login");
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <View style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false }}>
        {/* Dashboard */}
        <Stack.Screen name="dashboard/index" />

        {/* Categorias */}
        <Stack.Screen name="categories/index" />
        <Stack.Screen name="categories/new" />
        <Stack.Screen name="categories/[id]" />

        {/* Produtos */}
        <Stack.Screen name="products" />

        {/* Produtos */}
        <Stack.Screen name="variations" />

        {/* Delivery */}
        <Stack.Screen name="delivery-config/index" />

        {/* Vitrine */}
        <Stack.Screen name="vitrine/index" />

        {/* Encartes */}
        <Stack.Screen name="leaflets" />

        {/* Perfil */}
        <Stack.Screen name="profile/index" />

        {/* Outras telas administrativas */}
        <Stack.Screen name="index" />
      </Stack>
    </View>
  );
}
