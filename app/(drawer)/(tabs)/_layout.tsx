// Path: app/(drawer)/(tabs)/_layout.tsx

import { Tabs } from "expo-router";
import { AppBar } from "@/components/navigation/app-bar";
import { View } from "react-native";
import { CustomTabBar } from "@/components/navigation/custom-tab-bar";
import { usePathname } from "expo-router";

export default function PublicLayout() {
  const pathname = usePathname();

  // Verifica se estamos em uma página de categoria
  const isCategoryPage = pathname.includes("/categoria/");

  return (
    <View style={{ flex: 1 }}>
      {/* Renderiza o AppBar apenas se NÃO estiver na página de categoria */}
      {!isCategoryPage && <AppBar />}

      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: { display: "none" }, // Esconde a TabBar nativa
        }}
        tabBar={(props) => {
          // Não renderiza a CustomTabBar se estiver na página de categoria
          if (isCategoryPage) return null;
          return <CustomTabBar {...props} />;
        }}
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
          name="categoria/[categorySlug]"
          options={{
            headerShown: false,
          }}
        />
      </Tabs>
    </View>
  );
}
