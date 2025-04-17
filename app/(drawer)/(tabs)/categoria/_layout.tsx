// Path: app/(drawer)/(tabs)/categoria/_layout.tsx
import React from "react";
import { Stack } from "expo-router";

export default function CategoryLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="[categorySlug]" />
    </Stack>
  );
}
