// app/(public)/_layout.tsx
import { Tabs } from "expo-router";
import { Platform } from "react-native";
import { Store, Truck, FileText } from "lucide-react-native";
import { WebNav } from "@/components/ui/web-nav";
import { Box } from "@/components/ui/box";

export default function PublicLayout() {
  const isWeb = Platform.OS === "web";

  return (
    <Box className="flex-1">
      <WebNav />
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            height: 60,
            paddingBottom: 8,
            paddingTop: 8,
            backgroundColor: "white",
            borderTopColor: "#E5E7EB",
            borderTopWidth: 1,
          },
          tabBarActiveTintColor: "#0891B2", // Cor do ícone/texto ativo
          tabBarInactiveTintColor: "#6B7280", // Cor do ícone/texto inativo
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: "500",
          },
        }}
      >
        <Tabs.Screen
          name="comercio-local"
          options={{
            title: "Comércio Local",
            tabBarIcon: ({ color, size }) => (
              <Store size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="delivery"
          options={{
            title: "Delivery",
            tabBarIcon: ({ color, size }) => (
              <Truck size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="encartes"
          options={{
            title: "Encartes",
            tabBarIcon: ({ color, size }) => (
              <FileText size={size} color={color} />
            ),
          }}
        />
      </Tabs>
    </Box>
  );
}
