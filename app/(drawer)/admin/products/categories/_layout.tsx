// Path: app/(drawer)/admin/products/categories/_layout.tsx

import { Stack } from "expo-router";
import { CategoriesProvider } from "@/src/features/categories/contexts/categories-provider";

export default function CategoriesLayout() {
  return (
    <CategoriesProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen
          name="index"
          options={{
            title: "Categorias2",
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="new"
          options={{
            title: "Nova Categoria",
          }}
        />
        <Stack.Screen
          name="[id]"
          options={{
            title: "Editar Categoria",
          }}
        />
      </Stack>
    </CategoriesProvider>
  );
}
