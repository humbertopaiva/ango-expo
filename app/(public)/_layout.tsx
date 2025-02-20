// app/(public)/_layout.tsx
import { Tabs } from "expo-router";
import { CustomTabBar } from "@/components/ui/custom-tab-bar";

export default function PublicLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tabs.Screen
        name="comercio-local"
        options={{
          title: "Comércio Local",
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
