// Path: app/(drawer)/admin/leaflets/_layout.tsx

import { Stack } from "expo-router";
import { LeafletsProvider } from "@/src/features/leaflets/contexts/leaflets-provider";

export default function LeafletsLayout() {
  return (
    <LeafletsProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen
          name="index"
          options={{
            title: "Leaflets",
          }}
        />
        <Stack.Screen
          name="new"
          options={{
            title: "Novo Leaflet",
          }}
        />
        <Stack.Screen
          name="[id]/index"
          options={{
            title: "Editar Leaflet",
          }}
        />
      </Stack>
    </LeafletsProvider>
  );
}
