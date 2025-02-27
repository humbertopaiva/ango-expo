// app/(drawer)/_layout.tsx
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Drawer } from "expo-router/drawer";
import { Dimensions } from "react-native";
import { CustomDrawerContent } from "@/components/navigation/custom-drawer-content";

const { width } = Dimensions.get("window");

export default function Layout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        drawerContent={(props) => <CustomDrawerContent {...props} />}
        screenOptions={{
          headerShown: false,
          drawerPosition: "left",
          drawerStyle: {
            width: width * 0.75, // 75% da largura da tela
            backgroundColor: "white",
          },
          drawerType: "front",
          swipeEnabled: true,
          overlayColor: "rgba(0, 0, 0, 0.5)", // Adiciona uma sobreposição semi-transparente
        }}
      >
        <Drawer.Screen
          name="(tabs)"
          options={{
            drawerLabel: "Início",
            title: "categories",
          }}
        />
        <Drawer.Screen
          name="admin"
          options={{
            drawerLabel: "Painel Administrativo",
            title: "categories",
          }}
        />

        <Drawer.Screen
          name="(auth)"
          options={{
            drawerLabel: "Login",
            title: "categories",
            headerShown: false,
          }}
        />
        <Drawer.Screen
          name="support"
          options={{
            drawerLabel: "Suporte",
            title: "support",
          }}
        />
        <Drawer.Screen
          name="about"
          options={{
            drawerLabel: "Quem Somos",
            title: "about",
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}
