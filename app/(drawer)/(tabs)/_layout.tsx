// app/(drawer)/(tabs)/_layout.tsx (modificado para incluir o AppBar)
import { Tabs } from "expo-router";
import { AppBar } from "@/components/navigation/app-bar";
import { View } from "react-native";
import { PublicLayoutContainer } from "@/components/layouts/public-layout";

export default function PublicLayout() {
  return (
    <View style={{ flex: 1 }}>
      <AppBar />
      <Tabs screenOptions={{ headerShown: false }}>
        <Tabs.Screen
          name="comercio-local"
          options={{
            title: "Comércio",
          }}
        />
        <Tabs.Screen
          name="delivery"
          options={{
            title: "Delivery",
          }}
        />
        <Tabs.Screen
          name="encartes"
          options={{
            title: "Encartes",
          }}
        />
      </Tabs>
    </View>
  );
}
