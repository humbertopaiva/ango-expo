// Path: app/(drawer)/admin/products/_layout.tsx
import { Stack } from "expo-router";
import { ProductsProvider } from "@/src/features/products/contexts/products-provider";
import { THEME_COLORS } from "@/src/styles/colors";

export default function ProductsLayout() {
  return (
    <ProductsProvider>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: THEME_COLORS.primary,
          },
          headerTintColor: "#FFFFFF", // Texto e ícones brancos
          headerTitleStyle: {
            fontWeight: "600",
          },
          headerShadowVisible: true,
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            title: "Produtos",
            headerShown: true,
          }}
        />
        <Stack.Screen
          name="new"
          options={{
            title: "Novo Produto",
            headerShown: true,
          }}
        />
        <Stack.Screen
          name="[id]"
          options={{
            title: "Editar Produto",
            headerShown: true,
          }}
        />
        <Stack.Screen
          name="variations/index"
          options={{
            title: "Variações",
            headerShown: true,
          }}
        />
        <Stack.Screen
          name="variations/types"
          options={{
            title: "Tipos de Variação",
            headerShown: true,
          }}
        />
        <Stack.Screen
          name="[id]/variations"
          options={{
            title: "Variações do Produto",
            headerShown: true,
          }}
        />
      </Stack>
    </ProductsProvider>
  );
}
