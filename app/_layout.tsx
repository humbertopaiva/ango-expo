// Path: app/_layout.tsx (simplificado)
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useEffect } from "react";
import "@/global.css";
import { GluestackUIProvider } from "@gluestack-ui/themed";
import { config } from "@gluestack-ui/config";
import { Slot } from "expo-router";
import { useRouter, useSegments } from "expo-router";
import { Text, View } from "react-native";
import useAuthStore from "@/src/stores/auth";
import { useCustomFonts } from "@/src/styles/fonts";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { DrawerProvider } from "@/src/providers/drawer-provider";
import { LoadingProvider } from "@/src/providers/loading-provider";
import { Loader } from "@/components/common/loader";

const queryClient = new QueryClient();

export default function RootLayout() {
  const fontsLoaded = useCustomFonts();
  const segments = useSegments();
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated());

  useEffect(() => {
    if (!fontsLoaded) return;
    // Lógica de navegação baseada em autenticação pode ser adicionada aqui
  }, [isAuthenticated, segments, fontsLoaded]);

  if (!fontsLoaded) {
    return (
      <GluestackUIProvider config={config}>
        <View className="flex-1 bg-background">
          <Text>Carregando fontes...</Text>
        </View>
      </GluestackUIProvider>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <LoadingProvider>
          <GluestackUIProvider config={config}>
            <DrawerProvider>
              <Loader />
              <View className="flex-1 bg-background">
                <Slot />
              </View>
            </DrawerProvider>
          </GluestackUIProvider>
        </LoadingProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
