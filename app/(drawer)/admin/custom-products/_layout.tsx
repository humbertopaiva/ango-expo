// Path: app/(drawer)/admin/custom-products/_layout.tsx

import { Stack } from "expo-router";
import { CustomProductsProvider } from "@/src/features/custom-products/contexts/custom-products-provider";
import { THEME_COLORS } from "@/src/styles/colors";

export default function CustomProductsLayout() {
  return (
    <CustomProductsProvider>
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
        {/* Lista de produtos personalizados */}
        <Stack.Screen
          name="index"
          options={{
            title: "Produtos Personalizados",
            headerShown: true,
          }}
        />

        {/* Formulários de criação e edição */}
        <Stack.Screen
          name="new"
          options={{
            title: "Novo Produto Personalizado",
            headerShown: true,
          }}
        />
        <Stack.Screen
          name="[id]/index"
          options={{
            title: "Editar Produto Personalizado",
            headerShown: true,
          }}
        />
        <Stack.Screen
          name="[id]/details"
          options={{
            title: "Detalhes do Produto Personalizado",
            headerShown: true,
          }}
        />
      </Stack>
    </CustomProductsProvider>
  );
}
