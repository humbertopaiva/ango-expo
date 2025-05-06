// Path: app/(drawer)/admin/products/_layout.tsx (atualização)
import { Stack } from "expo-router";
import { THEME_COLORS } from "@/src/styles/colors";

export default function VariationsLayout() {
  return (
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
      {/* Editar Variação */}
      <Stack.Screen
        name="edit/[id]"
        options={{
          title: "Editar Variação",
          headerShown: true,
        }}
      />

      {/* Gerenciamento de produtos */}
      <Stack.Screen
        name="new"
        options={{
          title: "Criar Variação",
          headerShown: true,
        }}
      />

      <Stack.Screen
        name="types"
        options={{
          title: "Listar Variações",
          headerShown: true,
        }}
      />
    </Stack>
  );
}
