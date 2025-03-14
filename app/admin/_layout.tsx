// app/admin/_layout.tsx
import { Stack, router } from "expo-router";
import useAuthStore from "@/src/stores/auth";
import { StatusBar, View, TouchableOpacity } from "react-native";
import { useSegments, useNavigation } from "expo-router";
import { useEffect } from "react";
import { ArrowLeft, Menu } from "lucide-react-native";
import { DrawerActions } from "@react-navigation/native";

export default function AdminLayout() {
  const isAuthenticated = useAuthStore(
    (state: { isAuthenticated: () => any }) => state.isAuthenticated()
  );
  const segments = useSegments();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/(auth)/login");
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <View style={{ flex: 1 }}>
      <StatusBar backgroundColor="#F4511E" barStyle="light-content" />
      <Stack
        screenOptions={({ navigation, route }) => ({
          headerShown: false,
          headerStyle: {
            backgroundColor: "#F4511E",
          },
          headerTintColor: "white",
          headerTitleStyle: {
            fontWeight: "bold",
            fontSize: 18,
          },
          headerTitleAlign: "center",
          contentStyle: { backgroundColor: "#f5f5f5" },
          headerLeft: ({ tintColor }) => {
            // Obtém o nome da rota atual
            const routeName = route.name;

            // // Para a tela dashboard, mostramos o botão do drawer
            // if (routeName === "dashboard/index") {
            //   return (
            //     <TouchableOpacity
            //       onPress={() =>
            //         navigation.dispatch(DrawerActions.toggleDrawer())
            //       }
            //       style={{ paddingLeft: 16 }}
            //     >
            //       <Menu size={24} color="white" />
            //     </TouchableOpacity>
            //   );
            // }

            // Para as outras telas, mostramos o botão de voltar para o dashboard
            return (
              <TouchableOpacity
                onPress={() => router.push("/admin/dashboard")}
                style={{ paddingLeft: 16 }}
              >
                <ArrowLeft size={24} color="white" />
              </TouchableOpacity>
            );
          },
        })}
      >
        {/* Dashboard */}
        <Stack.Screen
          name="dashboard/index"
          options={{
            title: "",
            headerTitle: () => null,
            headerShown: false,
          }}
        />

        {/* Categorias */}
        <Stack.Screen
          name="categories/index"
          options={{
            title: "Categorias",
          }}
        />
        <Stack.Screen
          name="categories/new"
          options={{
            title: "Nova Categoria",
          }}
        />

        {/* Produtos */}
        <Stack.Screen
          name="products/index"
          options={{
            title: "Produtos",
          }}
        />
        <Stack.Screen
          name="products/new"
          options={{
            title: "Novo Produto",
          }}
        />
        <Stack.Screen
          name="products/[id]"
          options={{
            title: "Editar Produto",
          }}
        />

        {/* Delivery */}
        <Stack.Screen
          name="delivery-config/index"
          options={{
            title: "Configurações de Delivery",
          }}
        />

        {/* Vitrine */}
        <Stack.Screen
          name="vitrine/index"
          options={{
            title: "Vitrine",
          }}
        />

        {/* Encartes */}
        <Stack.Screen
          name="leaflets/index"
          options={{
            title: "Encartes",
          }}
        />
        <Stack.Screen
          name="leaflets/new"
          options={{
            title: "Novo Encarte",
          }}
        />
        {/* <Stack.Screen
          name="leaflets/[id]"
          options={{
            title: "Editar Encarte",
          }}
        /> */}

        {/* Perfil */}
        <Stack.Screen
          name="profile/index"
          options={{
            title: "Perfil",
          }}
        />

        {/* Outras telas administrativas */}
        <Stack.Screen
          name="index"
          options={{
            title: "Administração",
          }}
        />
      </Stack>
    </View>
  );
}
