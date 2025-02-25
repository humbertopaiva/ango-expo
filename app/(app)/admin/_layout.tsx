// app/(app)/admin/_layout.tsx
import { Tabs, router } from "expo-router";
import { useEffect } from "react";
import useAuthStore from "@/src/stores/auth";
import { AdminLayoutContainer } from "@/components/layouts/admin-layout";
import { CustomTabBar } from "@/components/ui/custom-tab-bar";

export default function AdminLayout() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated());

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/(auth)/login");
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <AdminLayoutContainer>
      <Tabs
        screenOptions={{
          headerShown: true,
          tabBarStyle: { display: "none" }, // Esconde a tab bar nativa
        }}
        tabBar={(props) => <CustomTabBar {...props} />}
      >
        {/* Dashboard */}
        <Tabs.Screen
          name="dashboard/index"
          options={{
            title: "Dashboard",
          }}
        />

        {/* Categorias */}
        <Tabs.Screen
          name="categories/index"
          options={{
            title: "Categorias",
          }}
        />
        <Tabs.Screen
          name="categories/new"
          options={{
            title: "Nova Categoria",
          }}
        />
        <Tabs.Screen
          name="categories/[id]"
          options={{
            title: "Categoria",
          }}
        />

        {/* Produtos */}
        <Tabs.Screen
          name="products/index"
          options={{
            title: "Produtos",
          }}
        />
        <Tabs.Screen
          name="products/new"
          options={{
            title: "Novo Produto",
          }}
        />
        <Tabs.Screen
          name="products/[id]"
          options={{
            title: "Produto",
          }}
        />

        {/* Configurações */}
        <Tabs.Screen
          name="delivery-config/index"
          options={{
            title: "Configurações de Delivery",
          }}
        />

        {/* Destaques */}
        <Tabs.Screen
          name="destaques/index"
          options={{
            title: "Destaques",
          }}
        />
        <Tabs.Screen
          name="encartes/index"
          options={{
            title: "Encartes",
          }}
        />
        <Tabs.Screen
          name="profile/index"
          options={{
            title: "Perfil",
          }}
        />
        <Tabs.Screen
          name="vitrine/index"
          options={{
            title: "Vitrine",
          }}
        />
      </Tabs>
    </AdminLayoutContainer>
  );
}
