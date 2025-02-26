// Path: app/(app)/admin/products/_layout.tsx
import { Stack } from "expo-router";
import { ProductsProvider } from "@/src/features/products/contexts/products-provider";

export default function ProductsLayout() {
  return (
    <ProductsProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen
          name="index"
          options={{
            title: "Produtos",
          }}
        />
        <Stack.Screen
          name="new"
          options={{
            title: "Novo Produto",
          }}
        />
        <Stack.Screen
          name="[id]"
          options={{
            title: "Editar Produto",
          }}
        />
      </Stack>
    </ProductsProvider>
  );
}
