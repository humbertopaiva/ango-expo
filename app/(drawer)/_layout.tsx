import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Drawer } from "expo-router/drawer";

export default function Layout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer>
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
      </Drawer>
    </GestureHandlerRootView>
  );
}
