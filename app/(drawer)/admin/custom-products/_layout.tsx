// Path: app/(drawer)/admin/products/_layout.tsx (atualização)
import { Stack } from "expo-router";

import { THEME_COLORS } from "@/src/styles/colors";
import { CustomProductsProvider } from "@/src/features/custom-products/contexts/custom-products-provider";

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
        {/* Dashboard principal de produtos */}
        <Stack.Screen
          name="index"
          options={{
            title: "Produtos Customizados",
            headerShown: true,
          }}
        />

        {/* Gerenciamento de produtos */}
        <Stack.Screen
          name="[id]"
          options={{
            title: "Editar Produto Customizado",
            headerShown: true,
          }}
        />
        <Stack.Screen
          name="new"
          options={{
            title: "Novo Produto Customizado",
            headerShown: true,
          }}
        />
        <Stack.Screen
          name="view/[id]"
          options={{
            title: "Produto Customizado",
            headerShown: true,
          }}
        />
      </Stack>
    </CustomProductsProvider>
  );
}
