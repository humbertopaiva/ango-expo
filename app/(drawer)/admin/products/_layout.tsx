// Path: app/(drawer)/admin/products/_layout.tsx (atualização)
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
            headerShown: true,
          }}
        />

        {/* Gerenciamento de produtos */}
        <Stack.Screen
          name="list"
          options={{
            title: "Lista de Produtos",
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
          name="[id]/index"
          options={{
            title: "Criar Produto",
            headerShown: true,
          }}
        />

        {/* Visualização e variações de produtos */}
        <Stack.Screen
          name="view/[id]"
          options={{
            title: "Detalhes do Produto",
            headerShown: true,
          }}
        />
        <Stack.Screen
          name="[id]/add-variation"
          options={{
            title: "Adicionar Variação",
            headerShown: true,
          }}
        />
      </Stack>
    </ProductsProvider>
  );
}
