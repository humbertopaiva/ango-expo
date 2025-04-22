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
          headerTintColor: "#FFFFFF",
          headerTitleStyle: {
            fontWeight: "600",
          },
          headerShadowVisible: true,
        }}
      >
        {/* Dashboard principal de produtos */}
        <Stack.Screen
          name="index"
          options={{
            title: "Produtos",
            headerShown: false,
          }}
        />

        {/* Gerenciamento de produtos */}
        <Stack.Screen
          name="list"
          options={{
            title: "Lista de Produtos",
            headerShown: false,
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

        {/* Gerenciamento de tipos de variação */}
        <Stack.Screen
          name="variations/types"
          options={{
            title: "Tipos de Variação",
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="variations/new"
          options={{
            title: "Nova Variação",
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="variations/edit/[id]"
          options={{
            title: "Editar Variação",
            headerShown: false,
          }}
        />
      </Stack>
    </ProductsProvider>
  );
}
