// Path: app/_layout.tsx
import { View } from "react-native";
import "@/global.css";
import { GluestackUIProvider, StatusBar } from "@gluestack-ui/themed";
import { config } from "@gluestack-ui/config";
import { Slot } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { DrawerProvider } from "@/src/providers/drawer-provider";
import { LoadingProvider } from "@/src/providers/loading-provider";
import { NavigationProvider } from "@/src/providers/navigation-provider"; // Importando o novo provedor
import { Loader } from "@/components/common/loader";
import { useFonts } from "@/src/hooks/use-fonts";
import { THEME_COLORS } from "@/src/styles/colors";

const queryClient = new QueryClient();

export default function RootLayout() {
  const { isReady, error } = useFonts();

  // Retornar null enquanto as fontes estão carregando
  // Isso mantém a SplashScreen visível até que as fontes sejam carregadas
  if (!isReady && !error) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <LoadingProvider>
          <GluestackUIProvider config={config}>
            <NavigationProvider>
              <DrawerProvider>
                <Loader />
                <View className="flex-1 bg-background">
                  <StatusBar
                    backgroundColor={THEME_COLORS.primary}
                    barStyle="light-content"
                  />
                  <Slot />
                </View>
              </DrawerProvider>
            </NavigationProvider>
          </GluestackUIProvider>
        </LoadingProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
