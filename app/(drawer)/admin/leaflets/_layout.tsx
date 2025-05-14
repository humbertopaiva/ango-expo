// Path: app/(drawer)/admin/leaflets/_layout.tsx

import { Stack } from "expo-router";
import { LeafletsProvider } from "@/src/features/leaflets/contexts/leaflets-provider";
import { Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

export default function LeafletsLayout() {
  return (
    <LeafletsProvider>
      <Stack
        screenOptions={{
          contentStyle: { backgroundColor: "#FFFFFF" },
          headerShown: true,
          headerBackTitle: "Voltar",
          headerBackVisible: true,
          headerTintColor: "#FFFFFF",
          headerStyle: {
            backgroundColor: "#F4511E",
          },
          headerTitleStyle: {
            fontSize: 24,
          },
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            title: "Encartes",
            headerShown: true,
            headerLeft: () => {
              return (
                <Pressable onPress={() => router.back()} className="pr-4">
                  <Ionicons name="arrow-back" size={24} color="#fff" />
                </Pressable>
              );
            },
          }}
        />
        <Stack.Screen
          name="new/index"
          options={{
            title: "Novo Encarte",
            headerShown: true,
          }}
        />
        <Stack.Screen
          name="[id]/index"
          options={{
            title: "Editar Encarte",
            headerShown: true,
          }}
        />
      </Stack>
    </LeafletsProvider>
  );
}
