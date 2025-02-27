// app/(public)/_layout.tsx
import { Stack, Tabs } from "expo-router";
import { CustomTabBar } from "@/components/ui/custom-tab-bar";
import { PublicLayoutContainer } from "@/components/layouts/public-layout";

export default function PublicLayout() {
  return (
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
  );
}
