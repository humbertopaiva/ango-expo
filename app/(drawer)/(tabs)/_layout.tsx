// Path: app/(drawer)/(tabs)/_layout.tsx
import { Tabs } from "expo-router";
import { AppBar } from "@/components/navigation/app-bar";
import { View } from "react-native";
import { PublicLayoutContainer } from "@/components/layouts/public-layout";
import { CustomTabBar } from "@/components/navigation/custom-tab-bar";

export default function PublicLayout() {
  return (
    <View style={{ flex: 1 }}>
      <AppBar />
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: { display: "none" }, // Esconde a TabBar nativa
        }}
        tabBar={(props) => <CustomTabBar {...props} />} // Usa nosso componente customizado
      >
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
        <Tabs.Screen
          name="categoria"
          options={{
            headerShown: false,
          }}
        />
      </Tabs>
    </View>
  );
}
