// Path: app/(drawer)/(tabs)/categoria/_layout.tsx
import React from "react";
import { Stack, useRouter } from "expo-router";
import { THEME_COLORS } from "@/src/styles/colors";
import { StatusBar } from "react-native";
import { Pressable } from "@gluestack-ui/themed";
import { Ionicons } from "@expo/vector-icons";

export default function CategoryLayout() {
  const router = useRouter();

  return (
    <Stack>
      <Stack.Screen
        name="[categorySlug]"
        options={{
          headerShown: true,
          headerStyle: {
            backgroundColor: THEME_COLORS.primary,
          },
          headerTintColor: "#FFFFFF",
          headerTitleStyle: {
            fontWeight: "600",
          },
          headerTitleAlign: "left",
          headerTitle: "Categoria",
          headerBackVisible: true,
          headerLeft: () => {
            return (
              <Pressable onPress={() => router.back()} className="pr-4">
                <Ionicons name="arrow-back" size={24} color="#fff" />
              </Pressable>
            );
          },
        }}
      />
    </Stack>
  );
}
