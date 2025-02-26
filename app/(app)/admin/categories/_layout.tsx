// app/(app)/admin/categories/_layout.tsx

import { Stack } from "expo-router";
import { CategoriesProvider } from "@/src/features/categories/contexts/categories-provider";

export default function CategoriesLayout() {
  return (
    <CategoriesProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen
          name="index"
          options={{
            title: "Categorias",
          }}
        />
      </Stack>
    </CategoriesProvider>
  );
}
